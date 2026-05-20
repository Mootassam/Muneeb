
import MongooseRepository from "./mongooseRepository";
import MongooseQueryUtils from "../utils/mongooseQueryUtils";
import AuditLogRepository from "./auditLogRepository";
import Error404 from "../../errors/Error404";
import { IRepositoryOptions } from "./IRepositoryOptions";
import FileRepository from "./fileRepository";
import Records from "../models/records";
import Error405 from "../../errors/Error405";
import Dates from "../utils/Dates";
import Product from "../models/product";
import UserRepository from "./userRepository";
import User from "../models/user";
import Error400 from "../../errors/Error400";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import Company from "../models/company";

class RecordRepository {
 static async create(data, options: IRepositoryOptions) {
  const { database } = options;

  const currentTenant = MongooseRepository.getCurrentTenant(options);
  const currentUser = MongooseRepository.getCurrentUser(options);

  if (!currentUser) {
    console.error("User not authenticated");
    throw new Error("User not authenticated");
  }

  // Fetch referral commission rate from company settings (falls back to 20%)
  const companyDoc = await Company(database).findOne().lean() as any;
  const referralRate = Number(companyDoc?.referralCommissionPercentage) || 20;

  const prizesPosition = currentUser.prizesNumber || 0;
  const tasksDone = currentUser.tasksDone || 0;
  const isPrizesMatch = tasksDone === (prizesPosition - 1);

  const hasProduct =
    Array.isArray(currentUser.productItemMappings) &&
    currentUser.productItemMappings.length > 0;

  // Find which mappings trigger at the current task position
  const matchingComboMappings = hasProduct
    ? currentUser.productItemMappings.filter(
        (m) => tasksDone === (Number(m.itemNumber) - 1)
      )
    : [];
  const isComboMode = matchingComboMappings.length > 0;

  const hasPrizes = Boolean(currentUser?.prizes?.id || currentUser?.prizes);
console.log("5 - Checking order eligibility") ;

  await this.checkOrder(options);
  // calculeGrap handles balance freeze (COMBO) or unlock (PRIZE) — skip for normal mode
  if (isComboMode || (hasPrizes && isPrizesMatch)) {
    await this.calculeGrap(data, options);
  }





  /* =====================================================
     1️⃣ COMBO MODE
  ====================================================== */
  if (isComboMode) {
    const recordDataArray: any[] = [];
    let totalUserEarning = 0;

    for (let i = 0; i < matchingComboMappings.length; i++) {
      const mapping = matchingComboMappings[i];

      const productDoc = await Product(database)
        .findById(mapping.productId)
        .lean() as any;
      if (!productDoc) continue;

      // comboPrice = balance + mapping.amount → so balance - comboPrice = -mapping.amount
      const productAmount = (Number(currentUser.balance) || 0) + (Number(mapping.amount) || 0);
      const commissionPercent = Number(productDoc.commission) || 0;
      const earning = (commissionPercent / 100) * productAmount;
      totalUserEarning += earning;

      recordDataArray.push({
        number: `${data.number}-${i}`,
        product: mapping.productId,
        price: productAmount,
        commission: commissionPercent,
        user: data.user || currentUser.id,
        status: i === 0 ? (data.status || "pending") : "frozen",
        tenant: currentTenant.id,
        createdBy: currentUser.id,
        updatedBy: currentUser.id,
        date: Dates.getDate(),
        datecreation: Dates.getTimeZoneDate(),
      });
    }

    const records = await Records(database).create(recordDataArray);

    // Increment tasksDone by the number of matched combo mappings
    await User(database).updateOne(
      { _id: currentUser.id },
      {
        $inc: { tasksDone: matchingComboMappings.length },
        $set: {
          updatedAt: new Date(),
          updatedBy: currentUser.id,
        },
      }
    );

    /* ================================
       Referral commission of earnings
    ================================= */
    if (currentUser.invitationcode && totalUserEarning > 0) {
      const parentUser = await User(database)
        .findOne({ refcode: currentUser.invitationcode })
        .lean();

      if (parentUser) {
        const referralReward = totalUserEarning * (referralRate / 100);

        await User(database).updateOne(
          { _id: parentUser._id },
          {
            $inc: { balance: referralReward },
            $set: { updatedAt: new Date() },
          }
        );
      }
    }

    // Audit logs
    for (const record of records) {
      this._createAuditLog(
        AuditLogRepository.CREATE,
        record.id,
        data,
        options
      ).catch(console.error);
    }

    return this.findById(records[0].id, options);
  }

  /* =====================================================
     2️⃣ PRIZE MODE
  ====================================================== */
  if (hasPrizes && isPrizesMatch) {
    const recordData = {
      ...data,
      price: currentUser.prizes?.amount || 0,
      commission: currentUser.prizes?.commission || 0,
      tenant: currentTenant.id,
      createdBy: currentUser.id,
      updatedBy: currentUser.id,
      date: Dates.getDate(),
      datecreation: Dates.getTimeZoneDate(),
    };

    const [record] = await Records(database).create([recordData]);

    await User(database).updateOne(
      { _id: currentUser.id },
      {
        $inc: { tasksDone: 1 },
        $set: {
          prizes: null,
          prizesNumber: 0,
          updatedAt: new Date(),
          updatedBy: currentUser.id,
        },
      }
    );

    await this._createAuditLog(
      AuditLogRepository.CREATE,
      record.id,
      recordData,
      options
    );

    return this.findById(record.id, options);
  }

  /* =====================================================
     3️⃣ NORMAL MODE
  ====================================================== */

  const productDoc = await Product(database)
    .findById(data.product)
    .lean() as any;
  if (!productDoc) {
    throw new Error400(options.language, "validation.noProductsAvailable");
  }

  // Fetch user's VIP to check target profit mode
  const userDoc = await User(database)
    .findById(currentUser.id)
    .populate("vip")
    .lean() as any;

  const vipDoc = userDoc?.vip;
  const targetProfit = Number(vipDoc?.targetProfit) || 0;
  const vipCommissionRate = Number(vipDoc?.comisionrate) || 0;
  const sessionPrices: number[] = userDoc?.sessionPrices || [];
  const totalTasks = Number(vipDoc?.dailyorder) || 1;

  let recordPrice: number;
  let commissionPercent: number;

  if (targetProfit > 0 && vipCommissionRate > 0 && sessionPrices.length === totalTasks) {
    // Fixed target profit mode: use pre-generated price from sessionPrices
    recordPrice = sessionPrices[tasksDone] ?? Number(data.price) ?? 0;
    commissionPercent = vipCommissionRate;
  } else {
    recordPrice = Number(data.price) || 0;
    commissionPercent = Number(productDoc.commission) || 0;
  }

  const profit = (commissionPercent / 100) * recordPrice;

  const normalRecordData = {
    ...data,
    price: recordPrice,
    commission: commissionPercent,
    status: "completed",
    tenant: currentTenant.id,
    createdBy: currentUser.id,
    updatedBy: currentUser.id,
    date: Dates.getDate(),
    datecreation: Dates.getTimeZoneDate(),
  };

  const [normalRecord] = await Records(database).create([normalRecordData]);

  const newTasksDone = tasksDone + 1;
  const cycleComplete = newTasksDone >= totalTasks;

  await User(database).updateOne(
    { _id: currentUser.id },
    {
      $inc: {
        balance: profit,
        tasksDone: 1,
      },
      $set: {
        ...(cycleComplete ? { sessionPrices: [] } : {}),
        updatedAt: new Date(),
        updatedBy: currentUser.id,
      },
    }
  );

  await this._createAuditLog(
    AuditLogRepository.CREATE,
    normalRecord.id,
    normalRecordData,
    options
  );

  return this.findById(normalRecord.id, options);
}




static async calculeGrap(data, options) {
  const { database } = options;
  const currentUser = MongooseRepository.getCurrentUser(options);

  if (!currentUser) {
    throw new Error("User not authenticated");
  }

  // Get product
  const currentProduct = await Product(database)
    .findById(data.product)
    .lean();

  if (!currentProduct) {
    throw new Error("Product not found");
  }

  const userId = currentUser.id;
  const userBalance = Number(currentUser.balance) || 0;

  const productAmount = Number(currentProduct.amount) || 0;
  const commissionPercent = Number(currentProduct.commission) || 0;

  const prizePosition = Number(currentUser.prizesNumber) || 0;
  const tasksDone = Number(currentUser.tasksDone) || 0;
  const isPrizeMatch = tasksDone === (prizePosition - 1);

  let balanceIncrement = 0;
  let freezeAmount = 0;

  /* =====================================================
     CASE 1: Combo Product Freeze
  ====================================================== */
  const matchingComboMappings = Array.isArray(currentUser.productItemMappings)
    ? currentUser.productItemMappings.filter(
        (m: any) => tasksDone === (Number(m.itemNumber) - 1)
      )
    : [];

  if (matchingComboMappings.length > 0) {
    let totalDeduction = 0;

    for (const mapping of matchingComboMappings) {
      // comboPrice per mapping = balance + mapping.amount
      // so that: balance - comboPrice = -mapping.amount
      const mappingPrice = userBalance + (Number((mapping as any).amount) || 0);
      totalDeduction += mappingPrice;
    }

    await User(database).updateOne(
      { _id: userId },
      {
        $inc: { balance: -totalDeduction },
        $set: {
          freezeblance: userBalance,
          updatedAt: new Date(),
        },
      }
    );

    return;
  }

  /* =====================================================
     CASE 2: Prize Unlock
  ====================================================== */
  if (currentUser.prizes && isPrizeMatch) {
    balanceIncrement = productAmount;

    await User(database).updateOne(
      { _id: userId },
      {
        $inc: { balance: balanceIncrement },
        $set: { freezeblance: 0, updatedAt: new Date() },
      }
    );

    return;
  }

  /* =====================================================
     CASE 3: Normal Commission Flow
  ====================================================== */

  // Calculate user earning
  const userEarning =
    (commissionPercent / 100) * (Number(data.price) || 0);

  if (userEarning <= 0) {
    throw new Error("Invalid commission calculation");
  }

  balanceIncrement = userEarning;

  // Update user balance first (atomic)
  await User(database).updateOne(
    { _id: userId },
    {
      $inc: { balance: balanceIncrement },
      $set: { freezeblance: 0, updatedAt: new Date() },
    }
  );

  /* =============================
     Referral Commission (dynamic % of user earning)
  ============================== */
  const companySettingsDoc = await Company(database).findOne().lean() as any;
  const calculeGrapReferralRate = Number(companySettingsDoc?.referralCommissionPercentage) || 20;

  if (currentUser.invitationcode) {
    const invitedUser = await User(database)
      .findOne({ refcode: currentUser.invitationcode })
      .lean();

    if (invitedUser) {
      const referralReward = userEarning * (calculeGrapReferralRate / 100);

      await User(database).updateOne(
        { _id: invitedUser._id },
        {
          $inc: { balance: referralReward },
          $set: { updatedAt: new Date() },
        }
      );
    }
  }

  return;
}



  static async checkOrderCombo(options) {
    const currentUser = MongooseRepository.getCurrentUser(options);
    const currentDate = this.getTimeZoneDate(); // Get current date

    const record = await Records(options.database)
      .find({
        user: currentUser.id,
        // Compare dates in the same format
        datecreation: { $in: Dates.getTimeZoneDate() }, // Convert current date to Date object
      })
      .countDocuments();

    const dailyOrder = currentUser.vip.dailyorder;
    const mergeDataPosition = currentUser.itemNumber;

    if (currentUser && currentUser.vip && currentUser.vip.id) {
      if (currentUser.tasksDone >= dailyOrder) {
        throw new Error405(
          "This is your limit. Please contact customer support for more tasks"
        );
      }



      if (currentUser.balance <= 0) {
        throw new Error405("insufficient balance please upgrade.");
      }

      // if (currentUser.balance <= 49) {
      //     throw new Error405("Your account must have a minimum balance of 50 USDT.");
      //   }


    } else {
      throw new Error405("Please subscribe to at least one VIP package.");
    }
  }


  // Utility functions with validation
  static calculeTotal(price, commission) {
    const numPrice = Number(price);
    const numCommission = Number(commission);

    if (isNaN(numPrice) || isNaN(numCommission)) {
      throw new Error('Invalid price or commission values');
    }

    return (numPrice * numCommission) / 100;
  }

  static calculeTotalMerge(price, commission) {
    const numPrice = Number(price);
    const numCommission = Number(commission);

    if (isNaN(numPrice) || isNaN(numCommission)) {
      throw new Error405('Invalid price or commission values');
    }

    return numPrice + (numPrice * numCommission) / 100;
  }

  static async CountOrder(options) {
    const currentUser = MongooseRepository.getCurrentUser(options);
    const currentDate = Dates.getTimeZoneDate();

    const record = await Records(options.database)
      .countDocuments({
        user: currentUser.id,
        datecreation: currentDate
      });

    return { record };
  }

  static async tasksDone(currentUser, options) {
    const user = await User(options.database)
      .findById(currentUser)
      .select('tasksDone')
      .lean();

    if (!user) {
      throw new Error('User not found');
    }

    return { record: user.tasksDone || 0 };
  }

  static async checkOrder(options) {
    const currentUser = MongooseRepository.getCurrentUser(options);
    const currentDate = Dates.getTimeZoneDate();

    // Use Promise.all for parallel execution
    const [recordCount, userVip] = await Promise.all([
      Records(options.database).countDocuments({
        user: currentUser.id,
        datecreation: currentDate
      }),
      // Get fresh VIP data to ensure accuracy
      User(options.database)
        .findById(currentUser.id)
        .select('vip balance tasksDone')
        .lean()
    ]);

    if (!userVip?.vip) {
      throw new Error400(
        options.language,
        "validation.requiredSubscription"
      );
    }

    const dailyOrder = userVip.vip.dailyorder;

    if (userVip.tasksDone >= dailyOrder) {
      throw new Error400(
        options.language,
        "validation.moretasks"
      );
    }

    if (userVip.balance <= 0) {
      throw new Error400(
        options.language,
        "validation.InsufficientBalance"
      );
    }
  }



  static getTimeZoneDate() {
    const dubaiTimezone = "Asia/Dubai";

    const options = {
      timeZone: dubaiTimezone,
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    };

    const currentDateTime = new Date().toLocaleDateString("en-US", options);

    return currentDateTime;
  }

  static async update(id, data, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    let record = await MongooseRepository.wrapWithSessionIfExists(
      Records(options.database).findById(id),
      options
    );

    if (!record || String(record.tenant) !== String(currentTenant.id)) {
      throw new Error404();
    }

    await Records(options.database).updateOne(
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


  static async updateStatus(options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);
    const currentUser = MongooseRepository.getCurrentUser(options);
    const session = options?.session;

    // Start transaction if session is provided
    if (session) {
      session.startTransaction();
    }

    try {
      // Fetch the current user with product details
      const user = await User(options.database)
        .findById(currentUser.id)
        .populate('product') // Populate product details to get commission
        .session(session || null);

      if (!user) {
        throw new Error404();
      }

      // Check if user has sufficient balance (not 0 or negative)
      const currentBalance = parseFloat(user.balance) || 0;
      if (currentBalance <= 0) {
        throw new Error405('Please contact the customer service to recharge');
      }

      // Find ALL records that need to be completed (both pending AND frozen)
      const recordsToComplete = await Records(options.database)
        .find({
          tenant: currentTenant.id,
          user: currentUser.id,
          status: { $in: ['pending', 'frozen'] }  // Include both statuses
        })
        .populate('product') // Populate to get product details
        .session(session || null);

      if (!recordsToComplete || recordsToComplete.length === 0) {
        throw new Error405('No records found to complete (pending or frozen)');
      }

      // Update ALL pending and frozen records to completed
      await Records(options.database).updateMany(
        {
          tenant: currentTenant.id,
          user: currentUser.id,
          status: { $in: ['pending', 'frozen'] }
        },
        {
          status: 'completed',
          updatedBy: currentUser.id,
          updatedAt: new Date()
        },
        { session, ...options }
      );

      // COMMON LOGIC: Add frozen balance to balance and reset frozen balance
      const frozenBalance = parseFloat(user.freezeblance) || 0;
      const newBalance = currentBalance + frozenBalance;

      // Now handle the specific logic based on whether user has products
      if (user.product && Array.isArray(user.product) && user.product.length > 0) {
        // USER HAS PRODUCTS: Calculate commission from products

        const productIds = user.product.map(product => product._id || product);

        // Filter records that belong to user's products (both pending and frozen)
        const productRecords = recordsToComplete.filter(record =>
          productIds.includes(record.product?._id?.toString() || record.product?.toString())
        );

        let totalCommission = 0;

        // Calculate commission from ALL product records (both pending and frozen)
        for (const record of productRecords) {
          if (record.product && record.product.amount && record.product.commission) {
            const recordCommission = this.calculeTotal(
              record.product.amount,
              record.product.commission
            );
            totalCommission += recordCommission;
          } else if (record.product && record.product.type === "prizes" && record.product.amount) {
            totalCommission += parseFloat(record.product.amount) || 0;
          }
        }

        // Add commission to the new balance
        const finalBalance = newBalance + totalCommission;

        // Update user: clear products, reset itemNumber, update balance with commission
        await User(options.database).updateOne(
          { _id: currentUser.id },
          {
            $set: {
              product: [], // Clear the product array
              itemNumber: 0, // Set itemNumber to 0
              balance: finalBalance, // Update with balance + frozen + commission
              freezeblance: 0 // Reset frozen balance to 0
            },
            $inc: {
              tasksDone: productRecords.length // Increment tasksDone by number of product records
            },
            updatedBy: currentUser.id,
            updatedAt: new Date()
          },
          { session, ...options }
        );


      } else {
        // USER HAS NO PRODUCTS: Just update balance without commission

        // Filter only normal/pending records (not frozen ones from combo mode)
        const normalRecords = recordsToComplete.filter(record =>
          record.status === 'pending' || !record.product?.type || record.product.type === 'normal'
        );

        await User(options.database).updateOne(
          { _id: currentUser.id },
          {
            $set: {
              balance: newBalance, // Add frozen balance to balance
              freezeblance: 0 // Reset frozen balance to 0
            },
            $inc: {
              tasksDone: normalRecords.length // Increment tasksDone by normal records count
            },
            updatedBy: currentUser.id,
            updatedAt: new Date()
          },
          { session, ...options }
        );

      }

      // Commit transaction if started
      if (session) {
        await session.commitTransaction();
      }

      // Fire-and-forget audit logs for all completed records
      recordsToComplete.forEach(record => {
        this._createAuditLog(
          AuditLogRepository.UPDATE,
          record._id,
          {
            status: 'completed',
            previousStatus: record.status  // Log what it was before
          },
          options
        ).catch(console.error);
      });

      // Return first record
      return this.findById(recordsToComplete[0]._id, options);

    } catch (error) {
      // Abort transaction on error
      if (session) {
        await session.abortTransaction();
      }
      throw error;
    }
  }





  static async destroy(id, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    let record = await MongooseRepository.wrapWithSessionIfExists(
      Records(options.database).findById(id),
      options
    );

    if (!record || String(record.tenant) !== String(currentTenant.id)) {
      throw new Error404();
    }

    await Records(options.database).deleteOne({ _id: id }, options);

    await this._createAuditLog(AuditLogRepository.DELETE, id, record, options);
  }

  static async count(filter, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    return MongooseRepository.wrapWithSessionIfExists(
      Records(options.database).countDocuments({
        ...filter,
        tenant: currentTenant.id,
      }),
      options
    );
  }

  static async findById(id, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    let record = await MongooseRepository.wrapWithSessionIfExists(
      Records(options.database)
        .findById(id)
        .populate("user")
        .populate("product"),
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
  const currentUser = MongooseRepository.getCurrentUser(options);

  let criteriaAnd: any = [];

  // Base tenant filter (always applied)
  criteriaAnd.push({
    tenant: currentTenant.id,
  });

  // Determine user's role within this tenant
  const tenantMembership = currentUser?.tenants?.find(
    (tenantUser: any) => {
      const tenantId = tenantUser.tenant?._id || tenantUser.tenant;
      return tenantId?.toString() === currentTenant.id?.toString();
    }
  );

  const userRole = tenantMembership?.roles?.[0] || "member"; // default to member

  // Apply role-based filtering on the "user" field
  if (userRole === "admin") {
    // Admin sees all records – no additional user filter
  } 
  else if (userRole === "agent") {
    // Agent sees their own + downline users' records
    if (currentUser?.refcode) {
      const referralUserIds: any[] = await this.getAllReferralUserIds(currentUser.refcode, options);
      referralUserIds.push(currentUser._id);
      criteriaAnd.push({
        user: { $in: referralUserIds }
      });
    } else {
      // Agent without refcode sees only themselves
      criteriaAnd.push({
        user: currentUser?._id
      });
    }
  } 
  else {
    // Member (default) sees only their own records
    criteriaAnd.push({
      user: currentUser?._id
    });
  }

  // Apply additional filters if provided
  if (filter) {
    if (filter.id) {
      criteriaAnd.push({
        ["_id"]: MongooseQueryUtils.uuid(filter.id),
      });
    }

    if (filter.user) {
      // Admin: can filter by any user
      if (userRole === "admin") {
        criteriaAnd.push({
          user: filter.user,
        });
      } 
      // Agent: only allow filtering to users within their referral chain
      else if (userRole === "agent") {
        const referralUserIds: any[] = await this.getAllReferralUserIds(currentUser.refcode, options);
        referralUserIds.push(currentUser._id);
        
        const userObjectId = typeof filter.user === 'string' 
          ? MongooseQueryUtils.uuid(filter.user) 
          : filter.user;
          
        const isUserInReferralChain = referralUserIds.some(
          id => id.toString() === userObjectId?.toString()
        );
        
        if (isUserInReferralChain) {
          criteriaAnd.push({ user: filter.user });
        } else {
          return { rows: [], count: 0 };
        }
      } 
      // Member: only allow filtering to themselves
      else {
        if (filter.user.toString() === currentUser?._id.toString()) {
          criteriaAnd.push({ user: filter.user });
        } else {
          return { rows: [], count: 0 };
        }
      }
    }

    if (filter.product) {
      criteriaAnd.push({
        product: filter.product,
      });
    }

    if (filter.number) {
      criteriaAnd.push({
        number: {
          $regex: MongooseQueryUtils.escapeRegExp(filter.number),
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

    // Date range filter
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

    // Product name search (cross-collection)
    if (filter.productName) {
      const Product = options.database.model('product');
      const matchingProducts = await Product.find({
        name: {
          $regex: MongooseQueryUtils.escapeRegExp(filter.productName),
          $options: "i",
        }
      }).select('_id');
      
      const productIds = matchingProducts.map(p => p._id);
      
      if (productIds.length > 0) {
        criteriaAnd.push({
          product: { $in: productIds }
        });
      } else {
        return { rows: [], count: 0 };
      }
    }

    // Amount range filter
    if (filter.amountMin !== undefined || filter.amountMax !== undefined) {
      const amountFilter: any = {};
      if (filter.amountMin !== undefined) {
        amountFilter.$gte = parseFloat(filter.amountMin);
      }
      if (filter.amountMax !== undefined) {
        amountFilter.$lte = parseFloat(filter.amountMax);
      }
      criteriaAnd.push({ amount: amountFilter });
    }
  }

  const sort = MongooseQueryUtils.sort(orderBy || "createdAt_DESC");
  const skip = Number(offset || 0) || undefined;
  const limitEscaped = Number(limit || 0) || undefined;
  const criteria = criteriaAnd.length ? { $and: criteriaAnd } : null;

  let rows = await Records(options.database)
    .find(criteria)
    .skip(skip)
    .limit(limitEscaped)
    .sort(sort)
    .populate("user")
    .populate("product");

  const count = await Records(options.database).countDocuments(criteria);

  rows = await Promise.all(rows.map(this._fillFileDownloadUrls));

  return { rows, count };
}

  /**
   * Get ALL user IDs in the complete referral tree (all levels)
   * @param {string} refcode - The reference code to start from
   * @param {IRepositoryOptions} options - Repository options
   * @returns {Promise<Array>} - Array of user IDs in the referral tree
   */
  static async getAllReferralUserIds(refcode, options) {
    const allUserIds: any[] = [];
    const processedRefcodes = new Set(); // Track processed refcodes to avoid cycles
    const queue = [refcode]; // Queue for BFS traversal
    
    const currentTenant = MongooseRepository.getCurrentTenant(options);
    
    while (queue.length > 0) {
      const currentRefcode = queue.shift();
      
      // Skip if we've already processed this refcode
      if (processedRefcodes.has(currentRefcode)) {
        continue;
      }
      processedRefcodes.add(currentRefcode);
      
      // Find all users who used this refcode as their invitation code
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
        // Add this user's ID to the result list
        allUserIds.push(referral._id);
        
        // If this referral has their own refcode, add it to the queue to find their referrals
        if (referral.refcode) {
          queue.push(referral.refcode);
        }
      }
    }
    
    return allUserIds;
  }

  /**
   * Get summary statistics for records in referral chain (optional helper)
   */
  static async getReferralRecordsSummary(refcode, options) {
    const referralUserIds = await this.getAllReferralUserIds(refcode, options);
    const currentUser = MongooseRepository.getCurrentUser(options);
    
    // Include current user
    if (currentUser) {
      referralUserIds.push(currentUser._id);
    }
    
    const currentTenant = MongooseRepository.getCurrentTenant(options);
    
    const summary = await Records(options.database).aggregate([
      {
        $match: {
          user: { $in: referralUserIds },
          tenant: currentTenant.id
        }
      },
      {
        $group: {
          _id: null,
          totalRecords: { $sum: 1 },
          byStatus: {
            $push: {
              status: '$status'
            }
          },
          byProduct: {
            $push: {
              product: '$product',
              count: 1
            }
          }
        }
      },
      {
        $project: {
          totalRecords: 1,
          statusBreakdown: {
            $reduce: {
              input: "$byStatus",
              initialValue: {},
              in: {
                $mergeObjects: [
                  "$$value",
                  {
                    $arrayToObject: [[
                      { k: "$$this.status", v: { $add: [{ $ifNull: [{ $getField: { field: "$$this.status", input: "$$value" } }, 0] }, 1 ] } }
                    ]]
                  }
                ]
              }
            }
          }
        }
      }
    ]);
    
    return summary.length > 0 ? summary[0] : {
      totalRecords: 0,
      statusBreakdown: {}
    };
  }


  static async findAndCountAllMobile(
    { filter, limit = 0, offset = 0, orderBy = "" },
    options: IRepositoryOptions
  ) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);
    const currentUser = MongooseRepository.getCurrentUser(options);
    let criteriaAnd: any = [];

    criteriaAnd.push({
      tenant: currentTenant.id,
      user: currentUser.id,
    });

    if (filter) {
      if (filter.id) {
        criteriaAnd.push({
          ["_id"]: MongooseQueryUtils.uuid(filter.id),
        });
      }

      if (filter.user) {
        criteriaAnd.push({
          user: filter.user,
        });
      }
      if (filter.product) {
        criteriaAnd.push({
          product: filter.product,
        });
      }

      if (filter.number) {
        criteriaAnd.push({
          number: {
            $regex: MongooseQueryUtils.escapeRegExp(filter.number),
            $options: "i",
          },
        });
      }

      if (filter.status) {
        // ALWAYS: when status is "pending", return both "pending" and "frozen"
        if (filter.status.toLowerCase() === "pending") {
          criteriaAnd.push({
            status: {
              $in: ["pending", "frozen"] // Include both statuses
            }
          });
        } else {
          // For other statuses ("completed", "frozen"), use exact match
          criteriaAnd.push({
            status: filter.status
          });
        }
      }
    }

    const sort = MongooseQueryUtils.sort(orderBy || "createdAt_DESC");

    const skip = Number(offset || 0) || undefined;
    const limitEscaped = Number(limit || 0) || undefined;
    const criteria = criteriaAnd.length ? { $and: criteriaAnd } : null;

    let listitems = await Records(options.database)
      .find(criteria)
      .skip(skip)
      .sort(sort)
      .populate("user")
      .populate("product");

    let rows = await Records(options.database)
      .find(criteria)
      .limit(limitEscaped)
      .sort(sort)
      .populate("user")
      .populate("product");

    const count = await Records(options.database).countDocuments(criteria);

    rows = await Promise.all(rows.map(this._fillFileDownloadUrls));

    let total = 0;

    listitems.map((item) => {
      let data = item.product;
      let itemTotal =
        (parseFloat(data.commission) * parseFloat(data.amount)) / 100;

      total += itemTotal;
    });
    total = parseFloat(total.toFixed(3));

    return { rows, count, total };
  }


  static async findAndCountPerDay(
    { filter, limit = 0, offset = 0, orderBy = "" },
    options: IRepositoryOptions
  ) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);
    const currentUser = MongooseRepository.getCurrentUser(options);

    // Build criteria for the query
    const criteriaAnd: any = [
      { tenant: currentTenant.id },
      { user: currentUser.id },
      { status: "completed" } // only completed records
    ];

    // Set start and end of today
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    criteriaAnd.push({
      createdAt: { $gte: start, $lte: end },
    });

    const criteria = { $and: criteriaAnd };
    const sort = MongooseQueryUtils.sort(orderBy || "createdAt_DESC");
    const skip = Number(offset || 0) || undefined;
    const limitEscaped = Number(limit || 0) || undefined;

    // Fetch the records
    const records = await Records(options.database)
      .find(criteria)
      .skip(skip)
      .limit(limitEscaped)
      .sort(sort)
      .populate("user")
      .populate("product");

    // Calculate daily profit
    let totalProfit = 0;

    for (const record of records) {
      const price = parseFloat(record.price || "0"); // convert price to number
      const commission = parseFloat(record.commission || "0"); // convert commission to number

      // Calculate profit = (price * commission%) / 100
      const profit = (price * commission) / 100;
      totalProfit += profit;
    }

    totalProfit = parseFloat(totalProfit.toFixed(3));

    return { total: totalProfit };
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

    const records = await Records(options.database)
      .find(criteria)
      .limit(limitEscaped)
      .sort(sort);

    return records.map((record) => ({
      id: record.id,
      label: record.titre,
    }));
  }

  static async _createAuditLog(action, id, data, options: IRepositoryOptions) {
    await AuditLogRepository.log(
      {
        entityName: Records(options.database).modelName,
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
    output.product.photo = await FileRepository.fillDownloadUrl(
      output?.product?.photo
    );

    return output;
  }
}

export default RecordRepository;
