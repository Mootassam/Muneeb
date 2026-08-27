import MongooseRepository from "./mongooseRepository";
import MongooseQueryUtils from "../utils/mongooseQueryUtils";
import AuditLogRepository from "./auditLogRepository";
import Error404 from "../../errors/Error404";
import { IRepositoryOptions } from "./IRepositoryOptions";
import FileRepository from "./fileRepository";
import Product from "../models/product";
import UserRepository from "./userRepository";
import VipRepository from "./vipRepository";
import RecordRepository from "./recordRepository";
import Error405 from "../../errors/Error405";
import Error400 from "../../errors/Error400";
import Records from "../models/records";
import User from "../models/user";
class ProductRepository {

  static async _priceCombo(data, options: IRepositoryOptions) {
    if (data.type !== "combo") {
      return data;
    }

    const currentTenant = MongooseRepository.getCurrentTenant(options);

    const ids = (Array.isArray(data.products) ? data.products : [])
      .map((p) => p.product?.id || p.product?.value || p.product || p)
      .filter(Boolean);

    const constituents = await Product(options.database).find({
      _id: { $in: ids },
      tenant: currentTenant.id,
      type: "normal",
    });

    const sum = constituents.reduce(
      (total, p) => total + (parseFloat(p.amount) || 0),
      0
    );

    return {
      ...data,
      products: constituents.map((p) => ({ product: p.id })),
      amount: String(sum.toFixed(2)),
    };
  }

  static async create(data, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);
    const currentUser = MongooseRepository.getCurrentUser(options);

    data = await this._priceCombo(data, options);

    const [record] = await Product(options.database).create(
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
      Product(options.database).findById(id),
      options
    );

    if (!record || String(record.tenant) !== String(currentTenant.id)) {
      throw new Error404();
    }

    data = await this._priceCombo(data, options);

    await Product(options.database).updateOne(
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
      Product(options.database).findById(id),
      options
    );

    if (!record || String(record.tenant) !== String(currentTenant.id)) {
      throw new Error404();
    }

    await Product(options.database).deleteOne({ _id: id }, options);

    await this._createAuditLog(AuditLogRepository.DELETE, id, record, options);
  }

  static async count(filter, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    return MongooseRepository.wrapWithSessionIfExists(
      Product(options.database).countDocuments({
        ...filter,
        tenant: currentTenant.id,
      }),
      options
    );
  }

  static async findById(id, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    let record = await MongooseRepository.wrapWithSessionIfExists(
      Product(options.database).findById(id).populate("products.product"),
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

      if (filter.amount) {
        criteriaAnd.push({
          amount: {
            $regex: MongooseQueryUtils.escapeRegExp(filter.amount),
            $options: "i",
          },
        });
      }
      if (filter.active !== undefined && filter.active !== null && filter.active !== '') {
        criteriaAnd.push({
          active: filter.active === true || filter.active === 'true',
        });
      }
      if (filter.type) {
        criteriaAnd.push({
          type: filter.type,
        });
      }
    }

    const sort = MongooseQueryUtils.sort(orderBy || "createdAt_DESC");

    const skip = Number(offset || 0) || undefined;
    const limitEscaped = Number(limit || 0) || undefined;
    const criteria = criteriaAnd.length ? { $and: criteriaAnd } : null;

    let rows = await Product(options.database)
      .find(criteria)
      .skip(skip)
      .limit(limitEscaped)
      .sort(sort)
      .populate("products.product");

    const count = await Product(options.database).countDocuments(criteria);

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

    const records = await Product(options.database)
      .find(criteria)
      .limit(limitEscaped)
      .sort(sort);

    return records.map((record) => ({
      id: record.id,
      label: record.title,
      price: record.price
    }));
  }



  static async findAllAutocompleteProduct(search, limit, options: IRepositoryOptions, type?: string) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    let criteriaAnd: Array<any> = [
      {
        tenant: currentTenant.id,
      },
      {
        // Filter by a single type when provided, otherwise combo OR prizes
        type: type ? type : { $in: ["combo", "prizes"] },
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

    const records = await Product(options.database)
      .find(criteria)
      .limit(limitEscaped)
      .sort(sort);

    return records.map((record) => {
      return {
      id: record.id,
      label: record.title,
      amount: record.amount
    };
    });
  }

  static async _createAuditLog(action, id, data, options: IRepositoryOptions) {
    await AuditLogRepository.log(
      {
        entityName: Product(options.database).modelName,
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

    if (output.type === "combo" && output.products?.length) {
      await Promise.all(
        output.products.map(async (item) => {
          if (item.product && !item.product.image && item.product.photo) {
            item.product.photo = await FileRepository.fillDownloadUrl(
              item.product.photo
            );
          }
        })
      );
    }

    return output;
  }

  static async grapOrders(options: IRepositoryOptions) {
    const currentUser = MongooseRepository.getCurrentUser(options);
    const giftPosition = Number(currentUser.prizesNumber) || 0;

    // VIP is fully automatic — recompute (and cache on the user) the tier
    // whose Level Limit range currently contains the user's balance.
    const currentTier = await VipRepository.syncUserVip(currentUser.id, options);
    if (!currentTier) {
      throw new Error400(options.language, "validation.noVipForBalance");
    }
    const tierCommissionRate = Number(currentTier.comisionrate) || 0;

    // Check for pending orders
    const pendingRecords = await Records(options.database).find({
      user: currentUser.id,
      status: 'pending'
    });

    if (pendingRecords.length > 0) {
      throw new Error400(options.language, "validation.submitPendingProducts");
    }

    // Check daily order limit (current tier's Max Order per set)
    const dailyOrder = Number(currentTier.dailyorder) || 0;
    if (currentUser.tasksDone >= dailyOrder) {
      throw new Error400(options.language, "validation.moretasks");
    }

    const taskNumber = currentUser.tasksDone + 1;

    // Prizes — a separate, orthogonal feature, kept as-is
    if (currentUser?.prizes && currentUser.tasksDone === (giftPosition - 1)) {
      let product = currentUser.prizes;
      product.commission = tierCommissionRate;
      product.photo = await FileRepository.fillDownloadUrl(product?.photo);
      return product;
    }

    // -------------------------------------------------
    // Sequence-driven task lookup — the assigned Sequence
    // defines, in order, which product or combo appears
    // at each task position.
    // -------------------------------------------------
    const sequence = currentUser.sequence;
    if (!sequence) {
      throw new Error400(options.language, "validation.noSequenceAssigned");
    }

    const comboItem = (sequence.combos || []).find(
      (item) => item.itemNumber === taskNumber && item.product
    );
    const productItem = !comboItem
      ? (sequence.products || []).find(
          (item) => item.itemNumber === taskNumber && item.product
        )
      : null;

    if (comboItem) {
      const comboProduct = comboItem.product;
      comboProduct.commission = tierCommissionRate;
      comboProduct.photo = await FileRepository.fillDownloadUrl(comboProduct?.photo);
      if (comboProduct.products?.length) {
        await Promise.all(
          comboProduct.products.map(async (item) => {
            if (item.product && !item.product.image && item.product.photo) {
              item.product.photo = await FileRepository.fillDownloadUrl(
                item.product.photo
              );
            }
          })
        );
      }
      return comboProduct;
    }

    if (productItem) {
      const product = productItem.product;
      product.commission = tierCommissionRate;
      product.photo = await FileRepository.fillDownloadUrl(product?.photo);
      return product;
    }

    throw new Error400(options.language, "validation.noProductsAvailable");
  }




}

export default ProductRepository;
