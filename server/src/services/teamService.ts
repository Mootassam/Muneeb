import Error404 from "../errors/Error404";
import MongooseRepository from "../database/repositories/mongooseRepository";
import { IServiceOptions } from "./IServiceOptions";
import UserRepository from "../database/repositories/userRepository";
import TeamRepository from "../database/repositories/TeamRepository";

export default class TeamService {
  options: IServiceOptions;

  constructor(options) {
    this.options = options;
  }

  /**
   * Returns the referral network for a given user: how many people they've
   * invited in total (every level), how much those invitees have collectively
   * earned from completed orders, and the list of their direct invitees (each
   * with their own invited-count and earned total) so the client can drill
   * down level by level.
   *
   * When userId is omitted, the focus user is the currently logged-in user.
   * When userId is provided, it must belong to the current user's referral
   * tree (or be the current user) — otherwise a 404 is raised.
   */
  async getTeam(userId?: string) {
    const currentUser = MongooseRepository.getCurrentUser(this.options);

    let focusUser = currentUser;

    if (userId && String(userId) !== String(currentUser.id)) {
      const ownDescendantIds = currentUser.refcode
        ? await UserRepository.getAllReferralUserIds(currentUser.refcode, this.options)
        : [];

      const isWithinOwnTeam = ownDescendantIds.some(
        (id) => String(id) === String(userId)
      );

      if (!isWithinOwnTeam) {
        throw new Error404();
      }

      focusUser = await UserRepository.findById(userId, this.options);
    }

    return this._buildTeamPayload(focusUser);
  }

  /**
   * Admin-facing variant: shows any user's referral network, no ownership
   * check (the admin already has userRead permission for this). Also
   * includes who invited that user (their parent/upline), which the
   * customer-facing getTeam() above doesn't need.
   */
  async getTeamForUser(userId: string) {
    const focusUser = await UserRepository.findById(userId, this.options);
    return this._buildTeamPayload(focusUser);
  }

  async _getParent(focusUser) {
    if (!focusUser.invitationcode) {
      return null;
    }

    const currentTenant = MongooseRepository.getCurrentTenant(this.options);
    const User = this.options.database.model("user");

    const parent = await User.findOne({
      refcode: focusUser.invitationcode,
      tenants: { $elemMatch: { tenant: currentTenant.id } },
    })
      .select("fullName email")
      .lean();

    if (!parent) {
      return null;
    }

    return {
      id: parent._id.toString(),
      fullName: parent.fullName,
      email: parent.email,
    };
  }

  async _buildTeamPayload(focusUser) {
    const refcode = focusUser.refcode;

    const descendantIds = refcode
      ? await UserRepository.getAllReferralUserIds(refcode, this.options)
      : [];

    const totalEarned = await TeamRepository.getEarnedTotal(
      descendantIds,
      this.options
    );

    const directMembers = refcode
      ? await TeamRepository.getDirectReferrals(refcode, this.options)
      : [];

    const memberRefcodes = directMembers
      .map((member) => member.refcode)
      .filter(Boolean);

    const invitedCounts = await TeamRepository.getInvitedCounts(
      memberRefcodes,
      this.options
    );

    const members = await Promise.all(
      directMembers.map(async (member) => {
        const memberDescendantIds = member.refcode
          ? await UserRepository.getAllReferralUserIds(member.refcode, this.options)
          : [];

        const earned = await TeamRepository.getEarnedTotal(
          [member.id, ...memberDescendantIds],
          this.options
        );

        return {
          id: member.id,
          fullName: member.fullName,
          email: member.email,
          balance: member.balance,
          tasksDone: member.tasksDone,
          invitedCount: invitedCounts[member.refcode] || 0,
          earned,
          createdAt: member.createdAt,
        };
      })
    );

    const parent = await this._getParent(focusUser);

    return {
      user: {
        id: focusUser.id,
        fullName: focusUser.fullName,
        email: focusUser.email,
      },
      parent,
      totalInvited: descendantIds.length,
      totalEarned,
      members,
    };
  }
}
