import MongooseRepository from "./mongooseRepository";
import { IRepositoryOptions } from "./IRepositoryOptions";
import User from "../models/user";
import Records from "../models/records";

class TeamRepository {
  static async getDirectReferrals(refcode, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    const rows = await MongooseRepository.wrapWithSessionIfExists(
      User(options.database)
        .find({
          invitationcode: refcode,
          tenants: { $elemMatch: { tenant: currentTenant.id } },
        })
        .select("fullName email balance tasksDone refcode createdAt")
        .sort({ createdAt: -1 }),
      options
    );

    return rows;
  }

  static async getInvitedCounts(refcodes, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);
    const counts = {};

    await Promise.all(
      refcodes.map(async (refcode) => {
        counts[refcode] = await MongooseRepository.wrapWithSessionIfExists(
          User(options.database).countDocuments({
            invitationcode: refcode,
            tenants: { $elemMatch: { tenant: currentTenant.id } },
          }),
          options
        );
      })
    );

    return counts;
  }

  static async getEarnedTotal(userIds, options: IRepositoryOptions) {
    if (!userIds || !userIds.length) {
      return 0;
    }

    const currentTenant = MongooseRepository.getCurrentTenant(options);

    const records = await MongooseRepository.wrapWithSessionIfExists(
      Records(options.database)
        .find({
          user: { $in: userIds },
          status: "completed",
          tenant: currentTenant.id,
        })
        .select("price commission"),
      options
    );

    let total = 0;
    for (const record of records) {
      const price = parseFloat(record.price || "0");
      const commission = parseFloat(record.commission || "0");
      total += (price * commission) / 100;
    }

    return parseFloat(total.toFixed(3));
  }
}

export default TeamRepository;
