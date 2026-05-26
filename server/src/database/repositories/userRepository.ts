import MongooseRepository from "./mongooseRepository";
import User from "../models/user";
import AuditLogRepository from "./auditLogRepository";
import MongooseQueryUtils from "../utils/mongooseQueryUtils";
import FileRepository from "./fileRepository";
import crypto from "crypto";
import Error404 from "../../errors/Error404";
import SettingsRepository from "./settingsRepository";
import { isUserInTenant } from "../utils/userTenantUtils";
import { IRepositoryOptions } from "./IRepositoryOptions";
import lodash from "lodash";
import Error405 from "../../errors/Error405";
import product from "../models/product";
import VipRepository from "./vipRepository";
import Vip from "../models/vip";
import Error400 from "../../errors/Error400";
import axios from 'axios'
import bcrypt from 'bcrypt'
import company from "../models/company";
export default class UserRepository {
  static async create(data, options: IRepositoryOptions) {
    const currentUser = MongooseRepository.getCurrentUser(options);

    data = this._preSave(data);

    const [user] = await User(options.database).create(
      [
        {
          email: data.email,
          fullName: data.fullName || null,
          phoneNumber: data.phoneNumber || null,
          country: data.country || null,
          nationality: data.nationality || null,
          passportPhoto: data.passportPhoto || null,
          passportDocument: data.passportDocument || null,
          avatars: data.avatars || [],
          createdBy: currentUser.id,
          updatedBy: currentUser.id,
        },
      ],
      options
    );

    await AuditLogRepository.log(
      {
        entityName: "user",
        entityId: user.id,
        action: AuditLogRepository.CREATE,
        values: user,
      },
      options
    );

    return this.findById(user.id, {
      ...options,
      bypassPermissionValidation: true,
    });
  }



  static async createUniqueRefCode(options: IRepositoryOptions) {
    let code;
    let exists = true;

    while (exists) {
      code = this.generateRefCode();
      exists = await User(options.database).exists({ refCode: code });
    }

    return code;
  }


  static async generateRefCode() {
    const prefix = "NO";
    const randomPart = Math.floor(1000 + Math.random() * 9000); // 6 digits
    return `${prefix}${randomPart}`;
  }
static async updateUser(
    tenantId,
    id,
    fullName,
    phoneNumber,
    passportNumber,
    nationality,
    country,
    passportPhoto,
    balance,
    minbalance,
    vip,
    options,
    status,
    itemNumber,
    prizes,
    prizesNumber,
    withdrawPassword,
    score,
    grab,
    withdraw,
    freezeblance,
    preferredcoin,
    productItemMappings,
    tasksDone,
    notification,
  ) {
    // Build the $set object with all fields, only including 
    // productItemMappings if it was explicitly passed (even if empty array)
    const setFields = {
      fullName,
      phoneNumber,
      passportNumber,
      nationality,
      country,
      passportPhoto,
      balance,
      minbalance,
      vip,
      itemNumber,
      prizes,
      prizesNumber,
      withdrawPassword,
      score,
      grab,
      withdraw,
      freezeblance,
      preferredcoin,
      tasksDone,
      notification,
      ...(productItemMappings !== undefined && { productItemMappings }),
    };

    await User(options.database).updateOne(
      { _id: id },
      { $set: setFields },
      MongooseRepository.getSession(options)
        ? { session: MongooseRepository.getSession(options) }
        : {}
    );
  }


  static async generateCouponCode() {
    const randomNumber = Math.floor(Math.random() * 10000000);
    const randomNumberPadded = randomNumber.toString().padStart(7, "0");
    const randomCode = await `6L${randomNumberPadded}`;
    return randomCode;
  }

  static async getCountry(ip: string) {
    try {
      const response = await axios.get(`http://ip-api.com/json/${ip}`, { timeout: 3000 });
      return response.data?.country || null;
    } catch {
      return null;
    }
  }


  static async createFromAuth(data, options: IRepositoryOptions) {
    data = this._preSave(data);
    const req = data.req;
    const normalizeIP = (ip: string) => ip.replace(/^::ffff:/, "");

    const rawIP =
      req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      (req.connection as any).socket?.remoteAddress;

    const clientIP = normalizeIP(rawIP);
    const country = await this.getCountry(clientIP);

    let [user] = await User(options.database).create(
      [
        {
          email: data.email,
          password: data.password,
          phoneNumber: data.phoneNumber,
          country: country,
          ipAddress: clientIP,
          firstName: data.firstName,
          fullName: data.fullName,
          withdrawPassword: data.withdrawPassword,
          invitationcode: data.invitationcode,
          refcode: await this.createUniqueRefCode(options),
          couponcode: await this.createUniqueRefCode(options),
        },
      ],
      options
    );

    delete user.password;
    await AuditLogRepository.log(
      {
        entityName: "user",
        entityId: user.id,
        action: AuditLogRepository.CREATE,
        values: user,
      },
      options
    );

    return this.findById(user.id, {
      ...options,
      bypassPermissionValidation: true,
    });
  }

  static async VipLevel(options) {
    const sort = MongooseQueryUtils.sort("createdAt_ASC");
    const skip = Number(0) || undefined;
    const limitEscaped = Number(0) || undefined;
    let rows = await Vip(options.database)
      .find()
      .skip(skip)
      .limit(limitEscaped)
      .sort(sort)
      .populate("members");

    const count = await Vip(options.database).countDocuments();

    return { rows, count };
  }
  static async createFromAuthMobile(data, options: IRepositoryOptions) {
    // Resolve the VIP to use: prefer the explicitly provided ID, fall back to
    // the first available VIP level (default for self-registration flows).
    const vipLevels = await this.VipLevel(options);
    const defaultVipId = vipLevels?.rows[0]?.id ?? null;
    const vipId: string | null = data.vip || defaultVipId;

    data = this._preSave(data);

    const req = data.req;

    const normalizeIP = (ip: string) => ip.replace(/^::ffff:/, "");

    const rawIP =
      req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      (req.connection as any).socket?.remoteAddress;

    const clientIP = normalizeIP(rawIP);

    const country = await this.getCountry(clientIP);
    const defaultBalance = await company(options.database).find({});

    let settingsBalance;
    if (defaultBalance.length > 0) {
      settingsBalance = defaultBalance[0].defaultBalance;
    }

    let [user] = await User(options.database).create(
      [
        {
          email: data.email,
          password: data.password,
          phoneNumber: data.phoneNumber,
          ipAddress: clientIP,
          country: country,
          firstName: data.firstName,
          fullName: data.fullName,
          gender: data.gender,
          withdrawPassword: data.withdrawPassword,
          invitationcode: data.invitationcode,
          refcode: await this.createUniqueRefCode(options),
          // Use admin-supplied balance if provided, otherwise the company default.
          balance: data.balance !== undefined ? data.balance : settingsBalance,
          vip: vipId || undefined,
        },
      ],
      options
    );

    delete user.password;
    await AuditLogRepository.log(
      {
        entityName: "user",
        entityId: user.id,
        action: AuditLogRepository.CREATE,
        values: user,
      },
      options
    );

    return this.findByIdMobile(user.id, {
      ...options,
      bypassPermissionValidation: true,
    });
  }

  static async updatePassword(
    id,
    password,
    invalidateOldTokens: boolean,
    options: IRepositoryOptions
  ) {
    const currentUser = MongooseRepository.getCurrentUser(options);

    const data: any = {
      password,
      updatedBy: id,
    };

    if (invalidateOldTokens) {
      data.jwtTokenInvalidBefore = new Date();
    }

    await User(options.database).updateOne({ _id: id }, data, options);

    await AuditLogRepository.log(
      {
        entityName: "user",
        entityId: id,
        action: AuditLogRepository.UPDATE,
        values: {
          id,
          password: "secret",
        },
      },
      options
    );

    return this.findById(id, {
      ...options,
      bypassPermissionValidation: true,
    });
  }

  static async updateProfile(id, data, options: IRepositoryOptions) {
    const currentUser = MongooseRepository.getCurrentUser(options);

    await this.checkSolde(data, options);
    data = this._preSave(data);
    await User(options.database).updateOne(
      { _id: id },
      {
        firstName: data.firstName || currentUser.firstName,
        lastName: data.lastName || currentUser.lastName,
        fullName: data.fullName || currentUser.fullName,
        phoneNumber: data.phoneNumber || currentUser.phoneNumber,
        updatedBy: currentUser.id,
        avatars: data.avatars || [],
        vip: data.vip || currentUser.vip,
        balance: data.balance || currentUser.balance,
        trc20: data.trc20 || currentUser.trc20,
        walletname: data.walletname || currentUser.walletname,
        usernamewallet: data.usernamewallet || currentUser.usernamewallet,
        product: data?.product,
        itemNumber: data?.itemNumber,
        preferredcoin: data?.preferredcoin
      },
      options
    );

    const user = await this.findById(id, options);

    await AuditLogRepository.log(
      {
        entityName: "user",
        entityId: id,
        action: AuditLogRepository.UPDATE,
        values: user,
      },
      options
    );

    return user;
  }

  static async updateProfileGrap(id, data, options: IRepositoryOptions) {
    const currentUser = MongooseRepository.getCurrentUser(options);
    // await this.checkSolde(data, options);

    data = this._preSave(data);
    await User(options.database).updateOne(
      { _id: id },
      {
        firstName: data.firstName || currentUser.firstName,
        lastName: data.lastName || currentUser.lastName,
        fullName: data.fullName || currentUser.fullName,
        phoneNumber: data.phoneNumber || currentUser.phoneNumber,
        updatedBy: currentUser.id,
        avatars: data.avatars || [],
        vip: data.vip || currentUser.vip,
        balance: data.balance,
        freezeblance: data.freezeblance,
        erc20: data.erc20 || currentUser.erc20,
        trc20: data.trc20 || currentUser.trc20,
        walletname: data.walletname || currentUser.walletname,
        usernamewallet: data.usernamewallet || currentUser.usernamewallet,
        product: data?.product || currentUser?.product,
      },
      options
    );

    const user = await this.findById(id, options);

    await AuditLogRepository.log(
      {
        entityName: "user",
        entityId: id,
        action: AuditLogRepository.UPDATE,
        values: user,
      },
      options
    );

    return user;
  }

  static async updateSolde(id, data, options: IRepositoryOptions) {
    const currentUser = MongooseRepository.getCurrentUser(options);
    // await this.checkSolde(data, options);

    data = this._preSave(data);
    await User(options.database).updateOne(
      { _id: id },
      {
        firstName: data.firstName || currentUser.firstName,
        lastName: data.lastName || currentUser.lastName,
        fullName: data.fullName || currentUser.fullName,
        phoneNumber: data.phoneNumber || currentUser.phoneNumber,
        updatedBy: currentUser.id,
        avatars: data.avatars || [],
        vip: data.vip || currentUser.vip,
        balance: data.balances,
        erc20: data.erc20 || currentUser.erc20,
        trc20: data.trc20 || currentUser.trc20,
        walletname: data.walletname || currentUser.walletname,
        usernamewallet: data.usernamewallet || currentUser.usernamewallet,
        product: data?.product,
      },
      options
    );

    const user = await this.findById(id, options);

    await AuditLogRepository.log(
      {
        entityName: "user",
        entityId: id,
        action: AuditLogRepository.UPDATE,
        values: user,
      },
      options
    );

    return user;
  }

  static async updateBalance(data, options) {
    const currentUser = await MongooseRepository.getCurrentUser(options);

    const currentBalance = currentUser.balance;
    const currentVip = currentUser.vip.id;

    if (!data) return;
  }

  static async checkSolde(data, options) {
    const currentUser = await MongooseRepository.getCurrentUser(options);

    const currentBalance = currentUser.balance;
    const currentVip = currentUser.vip.id;

    if (!data?.vip?.id) return;

    if (currentVip === data?.vip?.id) {



      throw new Error400(
        options.language,
        "validation.duplicateSubsctription"
      );

    }
    if (currentBalance < data?.vip?.levellimit) {
      throw new Error400(
        options.language,
        "validation.InsufficientBalance"
      );
    }
  }

  static async generateEmailVerificationToken(
    email,
    options: IRepositoryOptions
  ) {
    const currentUser = MongooseRepository.getCurrentUser(options);

    const { id } = await this.findByEmailWithoutAvatar(email, options);

    const emailVerificationToken = crypto.randomBytes(20).toString("hex");
    const emailVerificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;

    await User(options.database).updateOne(
      { _id: id },
      {
        emailVerificationToken,
        emailVerificationTokenExpiresAt,
        updatedBy: currentUser.id,
      },
      options
    );

    await AuditLogRepository.log(
      {
        entityName: "user",
        entityId: id,
        action: AuditLogRepository.UPDATE,
        values: {
          id,
          emailVerificationToken,
          emailVerificationTokenExpiresAt,
        },
      },
      options
    );

    return emailVerificationToken;
  }

  static async generatePasswordResetToken(email, options: IRepositoryOptions) {
    const currentUser = MongooseRepository.getCurrentUser(options);

    const { id } = await this.findByEmailWithoutAvatar(email, options);

    const passwordResetToken = crypto.randomBytes(20).toString("hex");
    const passwordResetTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;

    await User(options.database).updateOne(
      { _id: id },
      {
        passwordResetToken,
        passwordResetTokenExpiresAt,
        updatedBy: currentUser.id,
      },
      options
    );

    await AuditLogRepository.log(
      {
        entityName: "user",
        entityId: id,
        action: AuditLogRepository.UPDATE,
        values: {
          id,
          passwordResetToken,
          passwordResetTokenExpiresAt,
        },
      },
      options
    );

    return passwordResetToken;
  }

  static async findByEmail(email, options: IRepositoryOptions) {
    const record = await this.findByEmailWithoutAvatar(email, options);
    return await this._fillRelationsAndFileDownloadUrls(record, options);
  }

  static async findByEmailWithoutAvatar(email, options: IRepositoryOptions) {
    return MongooseRepository.wrapWithSessionIfExists(
      User(options.database)
        .findOne({
          email: {
            $regex: new RegExp(`^${MongooseQueryUtils.escapeRegExp(email)}$`),
            $options: "i",
          },
        })
        .populate("tenants.tenant"),
      options
    );
  }

  static async findAndCountAll(
    { filter, limit = 0, offset = 0, orderBy = "" },
    options: IRepositoryOptions
  ) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    let criteriaAnd: any = [];

    criteriaAnd.push({
      tenants: { $elemMatch: { tenant: currentTenant.id } },
    });

    if (filter) {
      if (filter.id) {
        criteriaAnd.push({
          ["_id"]: MongooseQueryUtils.uuid(filter.id),
        });
      }

      if (filter.fullName) {
        criteriaAnd.push({
          ["fullName"]: {
            $regex: MongooseQueryUtils.escapeRegExp(filter.fullName),
            $options: "i",
          },
        });
      }

      if (filter.email) {
        criteriaAnd.push({
          ["email"]: {
            $regex: MongooseQueryUtils.escapeRegExp(filter.email),
            $options: "i",
          },
        });
      }

      if (filter.roles && Array.isArray(filter.roles) && filter.roles.length > 0) {
        if (filter.includeEmptyPermissions) {
          criteriaAnd.push({
            $or: [
              { tenants: { $elemMatch: { roles: { $in: filter.roles } } } },
              { tenants: { $elemMatch: { status: 'empty-permissions' } } },
            ],
          });
        } else {
          criteriaAnd.push({
            tenants: { $elemMatch: { roles: { $in: filter.roles } } },
          });
        }
      } else if (filter.role) {
        criteriaAnd.push({
          tenants: { $elemMatch: { roles: filter.role } },
        });
      }

      if (filter.invitationcode) {
        criteriaAnd.push({
          ["invitationcode"]: {
            $regex: MongooseQueryUtils.escapeRegExp(filter.invitationcode),
            $options: "i",
          },
        });
      }

      if (filter.couponcode) {
        criteriaAnd.push({
          ["couponcode"]: {
            $regex: MongooseQueryUtils.escapeRegExp(filter.couponcode),
            $options: "i",
          },
        });
      }


      if (filter.status) {
        criteriaAnd.push({
          tenants: {
            $elemMatch: { status: filter.status },
          },
        });
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (start !== undefined && start !== null && start !== "") {
          criteriaAnd.push({
            ["createdAt"]: {
              $gte: start,
            },
          });
        }

        if (end !== undefined && end !== null && end !== "") {
          criteriaAnd.push({
            ["createdAt"]: {
              $lte: end,
            },
          });
        }
      }
    }

    const sort = MongooseQueryUtils.sort(orderBy || "createdAt_DESC");

    const skip = Number(offset || 0) || undefined;
    const limitEscaped = Number(limit || 0) || undefined;
    const criteria = criteriaAnd.length ? { $and: criteriaAnd } : null;

    let rows = await MongooseRepository.wrapWithSessionIfExists(
      User(options.database)
        .find(criteria)
        .skip(skip)
        .limit(limitEscaped)
        .sort(sort)
        .populate("tenants.tenant")
        .populate("vip")
        .populate("product")
        .populate("prizes"),
      options
    );

    const count = await MongooseRepository.wrapWithSessionIfExists(
      User(options.database).countDocuments(criteria),
      options
    );

    rows = this._mapUserForTenantForRows(rows, currentTenant);
    rows = await Promise.all(
      rows.map((row) => this._fillRelationsAndFileDownloadUrls(row, options))
    );

    return { rows, count };
  }



  static async findReferralChain(
    { filter, limit = 0, offset = 0, orderBy = "" },
    options: IRepositoryOptions
  ) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);
    const currentUser = MongooseRepository.getCurrentUser(options);

    let criteriaAnd: any = [];

    // Base tenant filter
    criteriaAnd.push({
      tenants: { $elemMatch: { tenant: currentTenant.id } },
    });

    // Add referral chain filter for current user
    if (currentUser && currentUser.refcode) {
      // Get ALL users in the complete referral tree (all levels)
      const allReferralUserIds = await this.getAllReferralUserIds(currentUser.refcode, options);

      if (allReferralUserIds.length > 0) {
        criteriaAnd.push({
          _id: { $in: allReferralUserIds }
        });
      } else {
        // No referrals found, return empty result
        return { rows: [], count: 0 };
      }
    }

    // Apply additional filters if provided
    if (filter) {
      if (filter.id) {
        criteriaAnd.push({
          ["_id"]: MongooseQueryUtils.uuid(filter.id),
        });
      }

      if (filter.fullName) {
        criteriaAnd.push({
          ["fullName"]: {
            $regex: MongooseQueryUtils.escapeRegExp(filter.fullName),
            $options: "i",
          },
        });
      }

      if (filter.email) {
        criteriaAnd.push({
          ["email"]: {
            $regex: MongooseQueryUtils.escapeRegExp(filter.email),
            $options: "i",
          },
        });
      }

      if (filter.roles && Array.isArray(filter.roles) && filter.roles.length > 0) {
        if (filter.includeEmptyPermissions) {
          criteriaAnd.push({
            $or: [
              { tenants: { $elemMatch: { roles: { $in: filter.roles } } } },
              { tenants: { $elemMatch: { status: 'empty-permissions' } } },
            ],
          });
        } else {
          criteriaAnd.push({
            tenants: { $elemMatch: { roles: { $in: filter.roles } } },
          });
        }
      } else if (filter.role) {
        criteriaAnd.push({
          tenants: { $elemMatch: { roles: filter.role } },
        });
      }

      if (filter.invitationcode) {
        criteriaAnd.push({
          ["invitationcode"]: {
            $regex: MongooseQueryUtils.escapeRegExp(filter.invitationcode),
            $options: "i",
          },
        });
      }

      if (filter.couponcode) {
        criteriaAnd.push({
          ["couponcode"]: {
            $regex: MongooseQueryUtils.escapeRegExp(filter.couponcode),
            $options: "i",
          },
        });
      }

      if (filter.status) {
        criteriaAnd.push({
          tenants: {
            $elemMatch: { status: filter.status },
          },
        });
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (start !== undefined && start !== null && start !== "") {
          criteriaAnd.push({
            ["createdAt"]: {
              $gte: start,
            },
          });
        }

        if (end !== undefined && end !== null && end !== "") {
          criteriaAnd.push({
            ["createdAt"]: {
              $lte: end,
            },
          });
        }
      }

      // Add balance range filter
      if (filter.balanceMin !== undefined || filter.balanceMax !== undefined) {
        const balanceFilter: any = {};
        if (filter.balanceMin !== undefined) {
          balanceFilter.$gte = filter.balanceMin;
        }
        if (filter.balanceMax !== undefined) {
          balanceFilter.$lte = filter.balanceMax;
        }
        criteriaAnd.push({ balance: balanceFilter });
      }

      // Add VIP level filter
      if (filter.vipLevel) {
        criteriaAnd.push({
          vip: filter.vipLevel,
        });
      }
    }

    const sort = MongooseQueryUtils.sort(orderBy || "createdAt_DESC");
    const skip = Number(offset || 0) || undefined;
    const limitEscaped = Number(limit || 0) || undefined;

    const criteria = criteriaAnd.length ? { $and: criteriaAnd } : null;

    let rows = await MongooseRepository.wrapWithSessionIfExists(
      User(options.database)
        .find(criteria)
        .skip(skip)
        .limit(limitEscaped)
        .sort(sort)
        .populate("tenants.tenant")
        .populate("vip")
        .populate("product")
        .populate("prizes"),
      options
    );

    const count = await MongooseRepository.wrapWithSessionIfExists(
      User(options.database).countDocuments(criteria),
      options
    );

    rows = this._mapUserForTenantForRows(rows, currentTenant);
    rows = await Promise.all(
      rows.map((row) => this._fillRelationsAndFileDownloadUrls(row, options))
    );

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
   * Alternative method using aggregation pipeline for better performance with large datasets
   * This method returns the complete user objects instead of just IDs
   */
  static async getAllReferralUsers(refcode, options) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);
    const allUsers = [];
    const processedRefcodes = new Set();
    const queue = [refcode];

    while (queue.length > 0) {
      const currentRefcode = queue.shift();

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
          .populate("tenants.tenant")
          .populate("vip")
          .populate("product")
          .populate("prizes")
          .lean(),
        options
      );

      for (const referral of referrals) {
        allUsers.push(referral);

        if (referral.refcode) {
          queue.push(referral.refcode);
        }
      }
    }

    return allUsers;
  }

  /**
   * Advanced: Using MongoDB aggregation with $graphLookup for better performance
   * Use this method if you have a very large referral tree
   */
  static async getAllReferralUserIdsAggregation(refcode, options) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    const pipeline = [
      // Start with the root user
      {
        $match: {
          refcode: refcode,
          tenants: { $elemMatch: { tenant: currentTenant.id } }
        }
      },

      // Use graphLookup to find all descendants
      {
        $graphLookup: {
          from: "users",
          startWith: "$refcode",
          connectFromField: "refcode",
          connectToField: "invitationcode",
          as: "allDescendants",
          maxDepth: 20, // Maximum depth to traverse
          depthField: "level"
        }
      },

      // Unwind the descendants array
      {
        $unwind: {
          path: "$allDescendants",
          preserveNullAndEmptyArrays: false
        }
      },

      // Replace root with the descendant
      {
        $replaceRoot: {
          newRoot: "$allDescendants"
        }
      },

      // Filter to ensure tenant isolation
      {
        $match: {
          tenants: { $elemMatch: { tenant: currentTenant.id } }
        }
      },

      // Group by _id to remove duplicates
      {
        $group: {
          _id: "$_id",
          userId: { $first: "$_id" }
        }
      },

      // Replace root with just the user ID
      {
        $replaceRoot: {
          newRoot: {
            _id: "$userId"
          }
        }
      }
    ];

    const results = await MongooseRepository.wrapWithSessionIfExists(
      User(options.database).aggregate(pipeline),
      options
    );

    // Extract just the user IDs
    return results.map(result => result._id);
  }








  static async filterIdInTenant(id, options: IRepositoryOptions) {
    return lodash.get(await this.filterIdsInTenant([id], options), "[0]", null);
  }

  static async filterIdsInTenant(ids, options: IRepositoryOptions) {
    if (!ids || !ids.length) {
      return ids;
    }

    const currentTenant = MongooseRepository.getCurrentTenant(options);

    let users = await User(options.database)
      .find({
        _id: {
          $in: ids,
        },
        tenants: {
          $elemMatch: { tenant: currentTenant.id },
        },
      })
      .select(["_id"]);

    return users.map((user) => user._id);
  }

  static cleanupForRelationships(userOrUsers) {
    if (!userOrUsers) {
      return userOrUsers;
    }

    if (Array.isArray(userOrUsers)) {
      return userOrUsers.map((user) =>
        lodash.pick(user, ["_id", "id", "firstName", "lastName", "email"])
      );
    }

    return lodash.pick(userOrUsers, [
      "_id",
      "id",
      "firstName",
      "lastName",
      "email",
    ]);
  }

  static async findAllAutocomplete(search, limit, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    let criteriaAnd: Array<any> = [
      {
        tenants: {
          $elemMatch: { tenant: currentTenant.id },
        },
      },
    ];

    if (search) {
      criteriaAnd.push({
        $or: [
          {
            _id: MongooseQueryUtils.uuid(search),
          },
          {
            fullName: {
              $regex: MongooseQueryUtils.escapeRegExp(search),
              $options: "i",
            },
          },
          {
            email: {
              $regex: MongooseQueryUtils.escapeRegExp(search),
              $options: "i",
            },
          },
        ],
      });
    }

    const sort = MongooseQueryUtils.sort("fullName_ASC");
    const limitEscaped = Number(limit || 0) || undefined;

    const criteria = { $and: criteriaAnd };

    let users = await User(options.database)
      .find(criteria)
      .limit(limitEscaped)
      .sort(sort);

    users = this._mapUserForTenantForRows(users, currentTenant);

    const buildText = (user) => {
      if (!user.fullName) {
        return user.email;
      }

      return `${user.fullName} <${user.email}>`;
    };

    return users.map((user) => ({
      id: user.id,
      label: buildText(user),
    }));
  }

  static async findByIdWithPassword(id, options: IRepositoryOptions) {
    return await MongooseRepository.wrapWithSessionIfExists(
      User(options.database).findById(id).populate("tenants.tenant"),
      options
    );
  }

  static async findById(id, options: IRepositoryOptions) {
    let record = await MongooseRepository.wrapWithSessionIfExists(
      User(options.database)
        .findById(id)
        .populate("tenants.tenant")
        .populate("vip")
        .populate("product")
        .populate("productItemMappings.productId")
        .populate("prizes"),
      options
    );

    if (!record) {
      throw new Error404();
    }

    const currentTenant = MongooseRepository.getCurrentTenant(options);
    if (!options || !options.bypassPermissionValidation) {
      if (!isUserInTenant(record, currentTenant.id)) {
        throw new Error404();
      }
      record = this._mapUserForTenant(record, currentTenant);
    }

    record = await this._fillRelationsAndFileDownloadUrls(record, options);

    return record;
  }

  static async findByIdMobile(id, options: IRepositoryOptions) {
    let record = await MongooseRepository.wrapWithSessionIfExists(
      User(options.database)
        .findById(id)
        .populate("tenants.tenant")
        .populate("vip")
        .populate("product")
        .populate("prizes"),
      options
    );

    if (!record) {
      throw new Error404();
    }

    const currentTenant = MongooseRepository.getCurrentTenant(options);
    if (!options || !options.bypassPermissionValidation) {
      if (!isUserInTenant(record, currentTenant.id)) {
        throw new Error404();
      }
      record = this._mapUserForTenantMobile(record, currentTenant);
    }

    record = await this._fillRelationsAndFileDownloadUrls(record, options);

    return record;
  }

  static async checkRefcode(refcode, options: IRepositoryOptions) {
    const checkref = await MongooseRepository.wrapWithSessionIfExists(
      User(options.database).findOne({
        refcode: refcode,
      }),
      options
    );

    if (!checkref) {
      return null;
    }
    return true;
  }

  static async findPassword(id, options: IRepositoryOptions) {
    let record = await MongooseRepository.wrapWithSessionIfExists(
      User(options.database).findById(id).select("+password"),
      options
    );

    if (!record) {
      return null;
    }

    return record.password;
  }

  static async findByIdWithoutAvatar(id, options: IRepositoryOptions) {
    return this.findById(id, options);
  }

  static async Destroy(id, options) {
    return User(options.database).deleteOne({ _id: id });
  }

  static async destroyWithAllRelations(id, options) {
    const user = await this.findById(id, {
      ...options,
      bypassPermissionValidation: true,
    });

    if (!user) {
      return;
    }

    // Delete all related records across all models
    const database = options.database;

    // Delete records (tasks)
    await database.model('records').deleteMany({ user: id }, options);

    // Delete transactions
    await database.model('transaction').deleteMany({ user: id }, options);

    // Delete notifications
    await database.model('notification').deleteMany({ user: id }, options);

    // Delete mouvements
    await database.model('mouvements').deleteMany({ createdBy: id }, options);

    // Delete dons
    await database.model('dons').deleteMany({ adherent: id }, options);
    await database.model('dons').deleteMany({ createdBy: id }, options);

    // Delete historiquePoints
    await database.model('historiquePoints').deleteMany({ user: id }, options);

    // Delete votes
    await database.model('votes').deleteMany({ user: id }, options);

    // Delete company records
    await database.model('company').deleteMany({ createdBy: id }, options);

    // Delete products
    await database.model('product').deleteMany({ createdBy: id }, options);

    // Delete categories
    await database.model('category').deleteMany({ createdBy: id }, options);

    // Remove user from tenantUsers (tenants array)
    await database.model('user').updateOne(
      { _id: id },
      { $set: { tenants: [] } },
      options
    );

    // Finally delete the user
    await User(database).deleteOne({ _id: id }, options);

    await AuditLogRepository.log(
      {
        entityName: "user",
        entityId: id,
        action: AuditLogRepository.DELETE,
        values: { email: user.email },
      },
      options
    );
  }

  /**
   * Finds the user by the password token if not expired.
   */
  static async findByPasswordResetToken(token, options: IRepositoryOptions) {
    return MongooseRepository.wrapWithSessionIfExists(
      User(options.database).findOne({
        passwordResetToken: token,
        passwordResetTokenExpiresAt: { $gt: Date.now() },
      }),
      options
    );
  }

  /**
   * Finds the user by the email verification token if not expired.
   */
  static async findByEmailVerificationToken(
    token,
    options: IRepositoryOptions
  ) {
    return MongooseRepository.wrapWithSessionIfExists(
      User(options.database).findOne({
        emailVerificationToken: token,
        emailVerificationTokenExpiresAt: {
          $gt: Date.now(),
        },
      }),
      options
    );
  }

  static async markEmailVerified(id, options: IRepositoryOptions) {
    const currentUser = MongooseRepository.getCurrentUser(options);

    await User(options.database).updateOne(
      { _id: id },
      {
        emailVerified: true,
        updatedBy: currentUser.id,
      },
      options
    );

    await AuditLogRepository.log(
      {
        entityName: "user",
        entityId: id,
        action: AuditLogRepository.UPDATE,
        values: {
          emailVerified: true,
        },
      },
      options
    );

    return true;
  }

  static async count(filter, options: IRepositoryOptions) {
    return MongooseRepository.wrapWithSessionIfExists(
      User(options.database).countDocuments(filter),
      options
    );
  }

  /**
   * Normalize the user fields.
   */
  static _preSave(data) {
    if (data.firstName || data.lastName) {
      data.fullName = `${(data.firstName || "").trim()} ${(
        data.lastName || ""
      ).trim()}`.trim();
    }

    data.email = data.email ? data.email.trim() : null;

    data.firstName = data.firstName ? data.firstName.trim() : null;

    data.lastName = data.lastName ? data.lastName.trim() : null;

    return data;
  }

  /**
   * Maps the users data to show only the current tenant related info
   */
  static _mapUserForTenantForRows(rows, tenant) {
    if (!rows) {
      return rows;
    }

    return rows.map((record) => this._mapUserForTenant(record, tenant));
  }

  /**
   * Maps the user data to show only the current tenant related info
   */
  static _mapUserForTenant(user, tenant) {
    if (!user || !user.tenants) {
      return user;
    }

    const tenantUser = user.tenants.find(
      (tenantUser) =>
        tenantUser &&
        tenantUser.tenant &&
        String(tenantUser.tenant.id) === String(tenant.id)
    );

    delete user.tenants;

    const status = tenantUser ? tenantUser.status : "active";
    const roles = tenantUser ? tenantUser.roles : ["member"];

    // If the user is only invited,
    // tenant members can only see its email
    const otherData = status === "active" ? user.toObject() : {};

    return {
      ...otherData,
      id: user.id,
      email: user.email,
      phoneNumber: user.phoneNumber,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      passportNumber: user.passportNumber,
      country: user.country,
      withdrawPassword: user.withdrawPassword,
      balance: user.balance,
      invitationcode: user.invitationcode,
      nationality: user.nationality,
      refcode: user.refcode,
      roles,
      status,
      vip: user.vip,
      product: user.product,
      itemNumber: user.itemNumber,
      prizes: user.prizes,
      prizesNumber: user.prizesNumber,
      productItemMappings: (user.productItemMappings || []).map((m: any) => ({
        _id: m._id,
        productId: m.productId,
        itemNumber: m.itemNumber,
        amount: m.amount,
      })),
      grab: user.grab,
      withdraw: user.withdraw,
      freezeblance: user.freezeblance,
      minbalance: user.minbalance,
      score: user.score,
      tasksDone: user.tasksDone,
      sessionPrices: user.sessionPrices || [],
      preferredcoin: user.preferredcoin,
      passportPhoto: user.passportPhoto,
      passportDocument: user.passportDocument,
      notification: user.notification,
    };
  }

  static _mapUserForTenantMobile(user, tenant) {
    if (!user || !user.tenants) {
      return user;
    }

    const tenantUser = user.tenants.find(
      (tenantUser) =>
        tenantUser &&
        tenantUser.tenant &&
        String(tenantUser.tenant.id) === String(tenant.id)
    );

    // delete user.tenants;

    const status = "active";
    const roles = ["member"];

    // If the user is only invited,
    // tenant members can only see its email
    const otherData = status === "active" ? user.toObject() : {};

    return {
      ...otherData,
      id: user.id,
      email: user.email,
      phoneNumber: user.phoneNumber,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      passportNumber: user.passportNumber,
      country: user.country,
      withdrawPassword: user.withdrawPassword,
      balance: user.balance,
      invitationcode: user.invitationcode,
      nationality: user.nationality,
      refcode: user.refcode,
      roles,
      status,
      vip: user.vip,
      product: user.product,
      itemNumber: user.itemNumber,
      prizes: user.prizes,
      prizesNumber: user.prizesNumber,
      productItemMappings: (user.productItemMappings || []).map((m: any) => ({
        _id: m._id,
        productId: m.productId,
        itemNumber: m.itemNumber,
        amount: m.amount,
      })),
      grab: user.grab,
      withdraw: user.withdraw,
      freezeblance: user.freezeblance,
      minbalance: user.minbalance,
      score: user.score,
      tasksDone: user.tasksDone,
      sessionPrices: user.sessionPrices || [],
      preferredcoin: user.preferredcoin,
      passportPhoto: user.passportPhoto,
      passportDocument: user.passportDocument,
      avatars: user.avatars,
    };
  }
  static async findByRoleAutocomplete(
    search,
    limit,
    options: IRepositoryOptions
  ) {
    const currentTenant1 = MongooseRepository.getCurrentTenant(options);

    let criteriaAnd: Array<any> = [
      {
        tenants: {
          $elemMatch: { tenant: currentTenant1.id },
        },
      },
    ];
    if (search) {
      criteriaAnd.push({
        $or: [
          {
            _id: MongooseQueryUtils.uuid(search),
          },
          {
            fullName: {
              $regex: MongooseQueryUtils.escapeRegExp(search),
              $options: "i",
            },
          },
          {
            email: {
              $regex: MongooseQueryUtils.escapeRegExp(search),
              $options: "i",
            },
          },
        ],
      });
    }

    const sort = MongooseQueryUtils.sort("fullName_ASC");
    const limitEscaped = Number(limit || 0) || undefined;

    const criteria = { $and: criteriaAnd };

    let users = await User(options.database)
      .find(criteria)
      .limit(limitEscaped)
      .sort(sort);

    users = this._mapUserForTenantForRows(users, currentTenant1);

    const buildText = (user) => {
      if (!user.fullName) {
        return user.email;
      }

      return `${user.fullName} <${user.email}>`;
    };

    return users.map((user) => ({
      id: user.id,
      label: buildText(user),
    }));
  }

  static async _fillRelationsAndFileDownloadUrls(
    record,
    options: IRepositoryOptions
  ) {
    if (!record) {
      return null;
    }

    const output = record.toObject ? record.toObject() : record;

    if (output.tenants && output.tenants.length) {
      await Promise.all(
        output.tenants.map(async (userTenant) => {
          userTenant.tenant.settings = await SettingsRepository.find({
            currentTenant: userTenant.tenant,
            ...options,
          });
        })
      );
    }

    output.avatars = await FileRepository.fillDownloadUrl(output.avatars);
    output.passportPhoto = await FileRepository.fillDownloadUrl(
      output.passportPhoto
    );
    output.passportDocument = await FileRepository.fillDownloadUrl(
      output.passportDocument
    );
    return output;
  }

  static async createFromSocial(
    provider,
    providerId,
    email,
    emailVerified,
    firstName,
    lastName,
    options
  ) {
    let data = {
      email,
      emailVerified,
      providerId,
      provider,
      firstName,
      lastName,
    };

    data = this._preSave(data);

    let [user] = await User(options.database).create([data], options);

    await AuditLogRepository.log(
      {
        entityName: "user",
        entityId: user.id,
        action: AuditLogRepository.CREATE,
        values: user,
      },
      options
    );

    return this.findById(user.id, {
      ...options,
      bypassPermissionValidation: true,
    });
  }

  static async CountUser(options: IRepositoryOptions) {
    let rows = await User(options.database).aggregate([
      { $group: { _id: null, count: { $sum: 1 } } },
    ]);
    return rows;
  }

  static async CountUsers(options: IRepositoryOptions) {
    const count = await MongooseRepository.wrapWithSessionIfExists(
      User(options.database).countDocuments(),
      options
    );

    return count;
  }
}
