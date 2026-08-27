import Roles from "../../security/roles";
import assert from "assert";
import Error400 from "../../errors/Error400";
import MongooseRepository from "../../database/repositories/mongooseRepository";
import UserRepository from "../../database/repositories/userRepository";
import TenantUserRepository from "../../database/repositories/tenantUserRepository";
import Plans from "../../security/plans";
import { IServiceOptions } from "../IServiceOptions";

export default class UserEditor {
  options: IServiceOptions;
  data;
  session;
  user;

  constructor(options) {
    this.options = options;
  }

  async update(data) {
    this.data = data;
    await this._validate();
    try {
      this.session = await MongooseRepository.createSession(
        this.options.database
      );
      await this._loadUser();
      await this._updateAtDatabase();
      await this._updateUserAtDatabase();
      await MongooseRepository.commitTransaction(this.session);
    } catch (error) {
      await MongooseRepository.abortTransaction(this.session);
      throw error;
    }
  }

  get _roles() {
    let roles = this.data.roles;
    if (!roles) {
      return [];
    }
    if (!Array.isArray(roles)) {
      roles = [roles];
    }
    return [...new Set(roles)];
  }

  async _loadUser() {
    this.user = await UserRepository.findById(this.data.id, this.options);

    if (!this.user) {
      throw new Error400(this.options.language, "user.errors.userNotFound");
    }
  }

  async _updateAtDatabase() {
    const status = this.data.status || undefined;
    await TenantUserRepository.updateRoles(
      this.options.currentTenant.id,
      this.data.id,
      this._roles,
      this.options,
      status
    );
  }
  async _updateUserAtDatabase() {
    // Autocomplete components return { id, label } objects — extract the raw ID
    // before persisting so Mongoose can cast them to ObjectId correctly.
    const vipId = this.data.vip?.id || this.data.vip || null;
    const prizesId = this.data.prizes?.id || this.data.prizes || null;

    const productItemMappings = (this.data.productItemMappings || [])
      .filter((m) => m && (m.productId?.id || m.productId))
      .map((m) => ({
        productId: m.productId?.id || m.productId,
        itemNumber: Number(m.itemNumber) || 0,
        amount: Number(m.amount) || 0,
      }));


    await UserRepository.updateUser(
      this.options.currentTenant.id,
      this.data.id,
      this.data.fullName,
      this.data.phoneNumber,
      this.data.passportNumber,
      this.data.nationality,
      this.data.country,
      this.data.passportPhoto,
      this.data.balance,
      vipId,
      this.options,
      this.data.status,
      this.data.itemNumber,
      prizesId,
      this.data?.prizesNumber,
      this.data.withdrawPassword,
      this.data.score,
      this.data.grab,
      this.data.withdraw,
      this.data.freezeblance,
      this.data.preferredcoin,
      productItemMappings,
      this.data.tasksDone,
      this.data.notification,
    );
  }
  /**
   * Checks if the user is removing the responsable for the plan
   */
  async _isRemovingPlanUser() {
    if (this._roles.includes(Roles.values.admin)) {
      return false;
    }

    const currentTenant = this.options.currentTenant;

    if (currentTenant.plan === Plans.values.free) {
      return false;
    }

    if (!currentTenant.planUserId) {
      return false;
    }

    return String(this.data.id) === String(currentTenant.planUserId);
  }

  /**
   * Checks if the user is removing it's own admin role
   */
  async _isRemovingOwnAdminRole() {
    if (this._roles.includes(Roles.values.admin)) {
      return false;
    }

    if (String(this.data.id) !== String(this.options.currentUser.id)) {
      return false;
    }

    const tenantUser = this.options.currentUser.tenants.find(
      (userTenant) => userTenant.tenant.id === this.options.currentTenant.id
    );

    return tenantUser.roles.includes(Roles.values.admin);
  }

  async _validate() {
    assert(this.options.currentTenant.id, "tenantId is required");

    assert(this.options.currentUser, "currentUser is required");
    assert(this.options.currentUser.id, "currentUser.id is required");
    assert(this.options.currentUser.email, "currentUser.email is required");

    assert(this.data.id, "id is required");
    assert(this._roles, "roles is required (can be empty)");

    if (await this._isRemovingPlanUser()) {
      throw new Error400(this.options.language, "user.errors.revokingPlanUser");
    }

    if (await this._isRemovingOwnAdminRole()) {
      throw new Error400(
        this.options.language,
        "user.errors.revokingOwnPermission"
      );
    }
  }
}
