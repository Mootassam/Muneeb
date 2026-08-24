import MongooseRepository from "./mongooseRepository";
import MongooseQueryUtils from "../utils/mongooseQueryUtils";
import AuditLogRepository from "./auditLogRepository";
import Error404 from "../../errors/Error404";
import { IRepositoryOptions } from "./IRepositoryOptions";
import FileRepository from "./fileRepository";
import Sequence from "../models/sequence";

class SequenceRepository {
  static async create(data, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);
    const currentUser = MongooseRepository.getCurrentUser(options);

    const [record] = await Sequence(options.database).create(
      [
        {
          title: data.title,
          products: SequenceRepository._sanitizeItems(data.products),
          combos: SequenceRepository._sanitizeItems(data.combos),
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
      Sequence(options.database).findById(id),
      options
    );

    if (!record || String(record.tenant) !== String(currentTenant.id)) {
      throw new Error404();
    }

    await Sequence(options.database).updateOne(
      { _id: id },
      {
        title: data.title,
        products: SequenceRepository._sanitizeItems(data.products),
        combos: SequenceRepository._sanitizeItems(data.combos),
        updatedBy: MongooseRepository.getCurrentUser(options).id,
      },
      options
    );

    await this._createAuditLog(AuditLogRepository.UPDATE, id, data, options);

    record = await this.findById(id, options);

    return record;
  }

  static _sanitizeItems(items) {
    if (!Array.isArray(items)) {
      return [];
    }

    return items
      .map((item) => ({
        product: item.product?.id || item.product?.value || item.product,
        itemNumber: Number(item.itemNumber),
      }))
      .filter((item) => item.product && !isNaN(item.itemNumber));
  }

  static async destroy(id, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    let record = await MongooseRepository.wrapWithSessionIfExists(
      Sequence(options.database).findById(id),
      options
    );

    if (!record || String(record.tenant) !== String(currentTenant.id)) {
      throw new Error404();
    }

    await Sequence(options.database).deleteOne({ _id: id }, options);

    await this._createAuditLog(AuditLogRepository.DELETE, id, record, options);
  }

  static async count(filter, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    return MongooseRepository.wrapWithSessionIfExists(
      Sequence(options.database).countDocuments({
        ...filter,
        tenant: currentTenant.id,
      }),
      options
    );
  }

  static async findById(id, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    let record = await MongooseRepository.wrapWithSessionIfExists(
      Sequence(options.database)
        .findById(id)
        .populate("products.product")
        .populate("combos.product"),
      options
    );

    if (!record || String(record.tenant) !== String(currentTenant.id)) {
      throw new Error404();
    }

    return this._fillComputedFields(record);
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

    const sort = MongooseQueryUtils.sort(orderBy || "createdAt_DESC");
    const skip = Number(offset || 0) || undefined;
    const limitEscaped = Number(limit || 0) || undefined;
    const criteria = criteriaAnd.length ? { $and: criteriaAnd } : null;

    let rows = await Sequence(options.database)
      .find(criteria)
      .skip(skip)
      .limit(limitEscaped)
      .populate("products.product")
      .populate("combos.product")
      .sort(sort);

    const count = await Sequence(options.database).countDocuments(criteria);

    rows = await Promise.all(
      rows.map((row) => this._fillComputedFields(row)),
    );

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
            title: {
              $regex: MongooseQueryUtils.escapeRegExp(search),
              $options: "i",
            },
          },
        ],
      });
    }

    const sort = MongooseQueryUtils.sort("title_ASC");
    const limitEscaped = Number(limit || 0) || undefined;

    const criteria = { $and: criteriaAnd };

    const records = await Sequence(options.database)
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
        entityName: Sequence(options.database).modelName,
        entityId: id,
        action,
        values: data,
      },
      options
    );
  }

  /**
   * Adds the read-only fields the admin UI renders on the list cards and
   * edit screen: total task count, the summed price of the plain-product
   * items (combos are priced separately), and per-combo price badges.
   * Also resolves legacy uploaded `photo` files (pre-dating the `image`
   * URL field) into downloadable URLs for items that never got one.
   */
  static async _fillComputedFields(record) {
    if (!record) {
      return null;
    }

    const output = record.toObject ? record.toObject() : record;

    output.products = (output.products || []).filter((item) => item.product);
    output.combos = (output.combos || []).filter((item) => item.product);

    await Promise.all(
      [...output.products, ...output.combos].map(async (item) => {
        if (!item.product.image && item.product.photo) {
          item.product.photo = await FileRepository.fillDownloadUrl(
            item.product.photo,
          );
        }
      }),
    );

    output.taskCount = output.products.length + output.combos.length;

    output.productValue = output.products.reduce((total, item) => {
      return total + (parseFloat(item.product?.amount) || 0);
    }, 0);

    output.comboBadges = output.combos.map((item) => ({
      id: item.product.id,
      title: item.product.title,
      amount: item.product.amount,
      itemNumber: item.itemNumber,
    }));

    return output;
  }
}

export default SequenceRepository;
