import MongooseRepository from "./mongooseRepository";
import MongooseQueryUtils from "../utils/mongooseQueryUtils";
import AuditLogRepository from "./auditLogRepository";
import Error404 from "../../errors/Error404";
import { IRepositoryOptions } from "./IRepositoryOptions";
import Withdraw from "../models/withdraw";
import User from "../models/user";

class WithdrawRepository {
  static async create(data, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);
    const currentUser = MongooseRepository.getCurrentUser(options);
    const [record] = await Withdraw(options.database).create(
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

    await this._createAuditLog(
      AuditLogRepository.CREATE,
      record.id,
      data,
      options
    );

    return this.findById(record.id, options);
  }

  static async update(id, data, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    let record = await MongooseRepository.wrapWithSessionIfExists(
      Withdraw(options.database).findById(id),
      options
    );

    if (!record || String(record.tenant) !== String(currentTenant.id)) {
      throw new Error404();
    }

    await Withdraw(options.database).updateOne(
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

  static async destroy(id, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    let record = await MongooseRepository.wrapWithSessionIfExists(
      Withdraw(options.database).findById(id),
      options
    );

    if (!record || String(record.tenant) !== String(currentTenant.id)) {
      throw new Error404();
    }

    await Withdraw(options.database).deleteOne({ _id: id }, options);

    await this._createAuditLog(AuditLogRepository.DELETE, id, record, options);
  }

  static async count(filter, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    return MongooseRepository.wrapWithSessionIfExists(
      Withdraw(options.database).countDocuments({
        ...filter,
        tenant: currentTenant.id,
      }),
      options
    );
  }

  static async findById(id, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    let record = await MongooseRepository.wrapWithSessionIfExists(
      Withdraw(options.database).findById(id).populate("user"),
      options
    );

    if (!record || String(record.tenant) !== String(currentTenant.id)) {
      throw new Error404();
    }
    return record.toObject ? record.toObject() : record;
  }

  static async findAndCountAll(
    { filter, limit = 0, offset = 0, orderBy = "" },
    options: IRepositoryOptions
  ) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);
    const currentUser = MongooseRepository.getCurrentUser(options);

    let criteriaAnd: any = [];

    criteriaAnd.push({
      tenant: currentTenant.id,
    });

    const tenantMembership = currentUser?.tenants?.find(
      (tenantUser: any) => {
        const tenantId = tenantUser.tenant?._id || tenantUser.tenant;
        return tenantId?.toString() === currentTenant.id?.toString();
      }
    );

    const userRole = tenantMembership?.roles?.[0] || "member";

    if (userRole === "admin") {
      // Admin sees all withdraws – only tenant filter applies
    } else if (userRole === "agent") {
      if (currentUser?.refcode) {
        const referralUserIds = await this.getAllReferralUserIds(currentUser.refcode, options);
        referralUserIds.push(currentUser._id);
        criteriaAnd.push({
          user: { $in: referralUserIds }
        });
      } else {
        criteriaAnd.push({
          user: currentUser?._id
        });
      }
    } else {
      criteriaAnd.push({
        user: currentUser?._id
      });
    }

    if (filter) {
      if (filter.id) {
        criteriaAnd.push({
          ["_id"]: MongooseQueryUtils.uuid(filter.id),
        });
      }

      if (filter.user) {
        if (userRole === "admin") {
          criteriaAnd.push({
            user: filter.user,
          });
        } else if (userRole === "agent") {
          const referralUserIds = await this.getAllReferralUserIds(currentUser.refcode, options);
          referralUserIds.push(currentUser._id);
          if (referralUserIds.includes(filter.user)) {
            criteriaAnd.push({ user: filter.user });
          } else {
            return { rows: [], count: 0 };
          }
        } else {
          if (filter.user.toString() === currentUser?._id.toString()) {
            criteriaAnd.push({ user: filter.user });
          } else {
            return { rows: [], count: 0 };
          }
        }
      }

      if (filter.amount) {
        criteriaAnd.push({
          amount: {
            $regex: MongooseQueryUtils.escapeRegExp(filter.amount),
            $options: "i",
          },
        });
      }

      if (filter.status) {
        criteriaAnd.push({
          status: {
            $regex: MongooseQueryUtils.escapeRegExp(filter.status),
            $options: "i",
          },
        });
      }

      if (filter.address) {
        criteriaAnd.push({
          address: {
            $regex: MongooseQueryUtils.escapeRegExp(filter.address),
            $options: "i",
          },
        });
      }

      if (filter.protocol) {
        criteriaAnd.push({
          protocol: {
            $regex: MongooseQueryUtils.escapeRegExp(filter.protocol),
            $options: "i",
          },
        });
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;
        if (start && start !== "") {
          criteriaAnd.push({
            createdAt: { $gte: start },
          });
        }
        if (end && end !== "") {
          criteriaAnd.push({
            createdAt: { $lte: end },
          });
        }
      }
    }

    const sort = MongooseQueryUtils.sort(orderBy || "createdAt_DESC");
    const skip = Number(offset || 0) || undefined;
    const limitEscaped = Number(limit || 0) || undefined;
    const criteria = criteriaAnd.length ? { $and: criteriaAnd } : null;

    let rows = await Withdraw(options.database)
      .find(criteria)
      .skip(skip)
      .limit(limitEscaped)
      .sort(sort)
      .populate("user");

    const count = await Withdraw(options.database).countDocuments(criteria);

    rows = rows.map((row) => (row.toObject ? row.toObject() : row));

    return { rows, count };
  }

  static async findAndCountByUser(
    { filter, limit = 0, offset = 0, orderBy = "" },
    options: IRepositoryOptions
  ) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);
    const currentUser = MongooseRepository.getCurrentUser(options);

    let criteriaAnd: any = [
      {
        tenant: currentTenant.id,
        user: currentUser.id,
      },
    ];

    const search = filter;

    if (search) {
      if (search.status) {
        criteriaAnd.push({
          status: {
            $regex: MongooseQueryUtils.escapeRegExp(search.status),
            $options: "i",
          },
        });
      }
    }

    const sort = MongooseQueryUtils.sort(orderBy || "createdAt_DESC");
    const skip = Number(offset || 0) || undefined;
    const limitEscaped = Number(limit || 0) || undefined;
    const criteria = criteriaAnd.length ? { $and: criteriaAnd } : null;

    let rows = await Withdraw(options.database)
      .find(criteria)
      .skip(skip)
      .limit(limitEscaped)
      .sort(sort)
      .populate("user");

    const count = await Withdraw(options.database).countDocuments(criteria);

    rows = rows.map((row) => (row.toObject ? row.toObject() : row));

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
        _id: MongooseQueryUtils.uuid(search),
      });
    }

    const limitEscaped = Number(limit || 0) || undefined;
    const criteria = { $and: criteriaAnd };

    const records = await Withdraw(options.database)
      .find(criteria)
      .limit(limitEscaped)
      .sort(MongooseQueryUtils.sort("createdAt_DESC"));

    return records.map((record) => ({
      id: record.id,
      label: record.id,
    }));
  }

  /**
   * Get ALL user IDs in the complete referral tree (all levels)
   */
  static async getAllReferralUserIds(refcode, options) {
    const allUserIds: any[] = [];
    const processedRefcodes = new Set<string>();
    const queue: string[] = [refcode];

    const currentTenant = MongooseRepository.getCurrentTenant(options);

    while (queue.length > 0) {
      const currentRefcode = queue.shift();

      if (!currentRefcode || processedRefcodes.has(currentRefcode)) {
        continue;
      }
      processedRefcodes.add(currentRefcode);

      const referrals = await MongooseRepository.wrapWithSessionIfExists(
        User(options.database)
          .find({
            invitationcode: currentRefcode,
            tenants: { $elemMatch: { tenant: currentTenant.id } }
          })
          .select('_id refcode invitationcode')
          .lean(),
        options
      );

      for (const referral of referrals) {
        allUserIds.push(referral._id);

        if (referral.refcode) {
          queue.push(referral.refcode);
        }
      }
    }

    return allUserIds;
  }

  static async _createAuditLog(action, id, data, options: IRepositoryOptions) {
    await AuditLogRepository.log(
      {
        entityName: Withdraw(options.database).modelName,
        entityId: id,
        action,
        values: data,
      },
      options
    );
  }
}

export default WithdrawRepository;
