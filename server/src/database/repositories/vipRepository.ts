import MongooseRepository from "./mongooseRepository";
import MongooseQueryUtils from "../utils/mongooseQueryUtils";
import AuditLogRepository from "./auditLogRepository";
import Error404 from "../../errors/Error404";
import { IRepositoryOptions } from "./IRepositoryOptions";
import FileRepository from "./fileRepository";
import Vip from "../models/vip";
import User from "../models/user";

class VipRepository {
  static async create(data, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);
    const currentUser = MongooseRepository.getCurrentUser(options);

    // Create VIP record
    const [record] = await Vip(options.database).create(
      [
        {
          ...data,
          tenant: currentTenant.id,
          createdBy: currentUser.id,
          updatedBy: currentUser.id,
        },
      ],
      options
    );

    // Log creation
    await this._createAuditLog(
      AuditLogRepository.CREATE,
      record.id,
      data,
      options
    );

    // Return created record with details
    return this.findById(record.id, options);
  }

  static async update(id, data, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    let record = await MongooseRepository.wrapWithSessionIfExists(
      Vip(options.database).findById(id),
      options
    );

    if (!record || String(record.tenant) !== String(currentTenant.id)) {
      throw new Error404();
    }

    // Update the VIP record
    await Vip(options.database).updateOne(
      { _id: id },
      {
        ...data,
        updatedBy: MongooseRepository.getCurrentUser(options).id,
      },
      options
    );

    await this._createAuditLog(AuditLogRepository.UPDATE, id, data, options);

    record = await this.findById(id, options);

    return record;
  }

  /**
   * Finds the VIP tier whose Level Limit range [min, max] contains the
   * given balance. VIP is fully automatic — this is the single source of
   * truth for "which tier is a user currently in", used instead of a
   * stored/manually-assigned vip.
   */
  static async findCurrentTierForBalance(balance, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);
    const bal = Number(balance) || 0;

    const vips = await MongooseRepository.wrapWithSessionIfExists(
      Vip(options.database).find({ tenant: currentTenant.id }),
      options
    );

    const match = vips.find((vip) => {
      const min = Number(vip.min);
      const max = Number(vip.max);
      return !isNaN(min) && !isNaN(max) && bal >= min && bal <= max;
    });

    return match || null;
  }

  /**
   * Keeps user.vip as a cached snapshot of the live-computed current tier,
   * so UI that reads currentUser.vip (e.g. the daily-order progress bar)
   * stays accurate. Money calculations must NOT rely on this cache — they
   * should call findCurrentTierForBalance directly.
   */
  static async syncUserVip(userId, options: IRepositoryOptions) {
    const user = await User(options.database)
      .findById(userId)
      .select("balance vip")
      .lean() as any;

    if (!user) {
      return null;
    }

    const currentTier = await this.findCurrentTierForBalance(
      user.balance,
      options
    );

    const currentTierId = currentTier?.id || currentTier?._id || null;
    const existingVipId = user.vip ? String(user.vip) : null;

    if (String(currentTierId || "") !== String(existingVipId || "")) {
      await User(options.database).updateOne(
        { _id: userId },
        { $set: { vip: currentTierId } },
        options
      );
    }

    return currentTier;
  }

  static async destroy(id, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    let record = await MongooseRepository.wrapWithSessionIfExists(
      Vip(options.database).findById(id),
      options
    );

    if (!record || String(record.tenant) !== String(currentTenant.id)) {
      throw new Error404();
    }

    await Vip(options.database).deleteOne({ _id: id }, options);

    await this._createAuditLog(AuditLogRepository.DELETE, id, record, options);
  }

  static async count(filter, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    return MongooseRepository.wrapWithSessionIfExists(
      Vip(options.database).countDocuments({
        ...filter,
        tenant: currentTenant.id,
      }),
      options
    );
  }

  static async findById(id, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    let record = await MongooseRepository.wrapWithSessionIfExists(
      Vip(options.database).findById(id).populate("members"),
      options
    );

    if (!record || String(record.tenant) !== String(currentTenant.id)) {
      throw new Error404();
    }

    return this._fillFileDownloadUrls(record);
  }

  static async findAndCountAll(
    { filter, limit = 0, offset = 0, orderBy = "" },
    options: IRepositoryOptions
  ) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    let criteriaAnd: any = [];

    criteriaAnd.push({
      tenant: currentTenant.id,
    });

    if (filter) {
      if (filter.id) {
        criteriaAnd.push({
          ["_id"]: MongooseQueryUtils.uuid(filter.id),
        });
      }

      if (filter.title) {
        criteriaAnd.push({
          title: {
            $regex: MongooseQueryUtils.escapeRegExp(filter.title),
            $options: "i",
          },
        });
      }

    }

    const sort = MongooseQueryUtils.sort(orderBy || "createdAt_ASC");
    const skip = Number(offset || 0) || undefined;
    const limitEscaped = Number(limit || 0) || undefined;
    const criteria = criteriaAnd.length ? { $and: criteriaAnd } : null;
    let rows = await Vip(options.database)
      .find(criteria)
      .skip(skip)
      .limit(limitEscaped)
      .sort(sort)
      .populate("members");

    const count = await Vip(options.database).countDocuments(criteria);

    rows = await Promise.all(rows.map(this._fillFileDownloadUrls));

    return { rows, count };
  }

  static async findAllAutocomplete(search, limit, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    let criteriaAnd: Array<any> = [
      {
        tenant: currentTenant.id,
      },
    ];

    if (search) {
      criteriaAnd.push({
        $or: [
          {
            _id: MongooseQueryUtils.uuid(search),
          },
          {
            titre: {
              $regex: MongooseQueryUtils.escapeRegExp(search),
              $options: "i",
            },
          },
        ],
      });
    }

    const sort = MongooseQueryUtils.sort("titre_ASC");
    const limitEscaped = Number(limit || 0) || undefined;

    const criteria = { $and: criteriaAnd };

    const records = await Vip(options.database)
      .find(criteria)
      .limit(limitEscaped)
      .sort(sort);

    return records.map((record) => ({
      id: record.id,
      label: record.title,
    }));
  }

  static async _createAuditLog(action, id, data, options: IRepositoryOptions) {
    await AuditLogRepository.log(
      {
        entityName: Vip(options.database).modelName,
        entityId: id,
        action,
        values: data,
      },
      options
    );
  }

  static async _fillFileDownloadUrls(record) {
    if (!record) {
      return null;
    }

    const output = record.toObject ? record.toObject() : record;

    output.photo = await FileRepository.fillDownloadUrl(output.photo);

    return output;
  }
}

export default VipRepository;
