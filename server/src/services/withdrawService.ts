import Error400 from "../errors/Error400";
import MongooseRepository from "../database/repositories/mongooseRepository";
import { IServiceOptions } from "./IServiceOptions";
import WithdrawRepository from "../database/repositories/WithdrawRepository";
import Notification from "../database/models/notification";

export default class WithdrawService {
  options: IServiceOptions;

  constructor(options) {
    this.options = options;
  }

  async create(data) {
    const session = await MongooseRepository.createSession(
      this.options.database
    );

    try {
      if (!data || !data.amount) {
        throw new Error400(this.options.language, "validation.requiredAmount");
      }

      if (!data.address) {
        throw new Error400(this.options.language, "validation.missingWalletAddress");
      }

      const amount = parseFloat(data.amount);

      // A withdrawPassword is only present when the customer is submitting
      // their own request (the admin panel's manual-entry form has no such
      // field). In that case, validate the password and hold the requested
      // amount from their balance immediately.
      const isCustomerSubmission = data.withdrawPassword !== undefined;

      if (isCustomerSubmission) {
        const currentUser = MongooseRepository.getCurrentUser(this.options);

        if (!currentUser.withdrawPassword || currentUser.withdrawPassword !== data.withdrawPassword) {
          throw new Error400(this.options.language, "validation.inValidWithdrawPassword");
        }

        if (currentUser.balance < amount) {
          throw new Error400(this.options.language, "validation.exceedsBalance");
        }
      }

      const values = {
        status: "pending",
        user: data.user,
        amount: data.amount,
        currency: "USDT",
        protocol: "TRC-20",
        address: data.address,
      };

      const record = await WithdrawRepository.create(values, {
        ...this.options,
        session,
      });

      if (isCustomerSubmission) {
        // The requested amount is held immediately on submission; it's
        // returned to the balance only if the withdrawal is later canceled.
        await this.updateUserBalance(data.user, amount, session, "dec");
      }

      await MongooseRepository.commitTransaction(session);

      return record;
    } catch (error) {
      await MongooseRepository.abortTransaction(session);

      MongooseRepository.handleUniqueFieldError(
        error,
        this.options.language,
        "withdraw"
      );

      throw error;
    }
  }

  async updateUserBalance(userId, amount, session, operation = "inc") {
    const User = this.options.database.model("user");
    const update =
      operation === "inc"
        ? { $inc: { balance: parseFloat(amount) } }
        : { $inc: { balance: -parseFloat(amount) } };

    await User.findByIdAndUpdate(userId, update, { session });
  }

  async createNotification(userId, withdrawId, type, amount, options) {
    const currentUser = MongooseRepository.getCurrentUser(options);
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    await Notification(options.database).create(
      [
        {
          type,
          status: "unread",
          user: userId,
          transaction: withdrawId,
          amount: amount.toString(),
          tenant: currentTenant.id,
          createdBy: currentUser.id,
        },
      ],
      options
    );
  }

  async updateWithdrawStatus(withdrawId, newStatus, options) {
    const session = await MongooseRepository.createSession(
      this.options.database
    );

    try {
      const Withdraw = this.options.database.model("withdraw");

      const withdraw = await Withdraw.findById(withdrawId)
        .populate("user")
        .session(session);

      if (!withdraw) {
        throw new Error400(this.options.language, "Withdraw.notFoundWithdraw");
      }

      const oldStatus = withdraw.status;
      const amount = parseFloat(withdraw.amount);

      const updatedWithdraw = await Withdraw.findByIdAndUpdate(
        withdrawId,
        {
          status: newStatus,
          updatedBy: MongooseRepository.getCurrentUser(options).id,
        },
        { new: true, session }
      );

      if (newStatus === "success" && oldStatus !== "success") {
        await this.createNotification(
          withdraw.user._id,
          withdrawId,
          "withdraw_success",
          withdraw.amount,
          { ...this.options, session }
        );
      } else if (newStatus === "canceled" && oldStatus !== "canceled") {
        // Held amount is returned since the withdrawal didn't go through.
        await this.updateUserBalance(withdraw.user._id, amount, session, "inc");

        await this.createNotification(
          withdraw.user._id,
          withdrawId,
          "withdraw_canceled",
          withdraw.amount,
          { ...this.options, session }
        );
      } else if (oldStatus === "canceled" && newStatus === "pending") {
        // Reversing a cancellation holds the amount again.
        await this.updateUserBalance(withdraw.user._id, amount, session, "dec");
      }

      await MongooseRepository.commitTransaction(session);
      return updatedWithdraw;
    } catch (error) {
      await MongooseRepository.abortTransaction(session);
      throw error;
    }
  }

  async update(id, data) {
    const session = await MongooseRepository.createSession(
      this.options.database
    );

    try {
      const record = await WithdrawRepository.update(id, data, {
        ...this.options,
        session,
      });

      await MongooseRepository.commitTransaction(session);

      return record;
    } catch (error) {
      await MongooseRepository.abortTransaction(session);

      MongooseRepository.handleUniqueFieldError(
        error,
        this.options.language,
        "withdraw"
      );

      throw error;
    }
  }

  async destroyAll(ids) {
    const session = await MongooseRepository.createSession(
      this.options.database
    );

    try {
      for (const id of ids) {
        await WithdrawRepository.destroy(id, {
          ...this.options,
          session,
        });
      }

      await MongooseRepository.commitTransaction(session);
    } catch (error) {
      await MongooseRepository.abortTransaction(session);
      throw error;
    }
  }

  async findById(id) {
    return WithdrawRepository.findById(id, this.options);
  }

  async findAllAutocomplete(search, limit) {
    return WithdrawRepository.findAllAutocomplete(search, limit, this.options);
  }

  async findAndCountAll(args) {
    return WithdrawRepository.findAndCountAll(args, this.options);
  }

  async findAndCountByUser(args) {
    return WithdrawRepository.findAndCountByUser(args, this.options);
  }

  async import(data, importHash) {
    if (!importHash) {
      throw new Error400(
        this.options.language,
        "importer.errors.importHashRequired"
      );
    }

    if (await this._isImportHashExistent(importHash)) {
      throw new Error400(
        this.options.language,
        "importer.errors.importHashExistent"
      );
    }

    const dataToCreate = {
      ...data,
      importHash,
    };

    return this.create(dataToCreate);
  }

  async _isImportHashExistent(importHash) {
    const count = await WithdrawRepository.count(
      {
        importHash,
      },
      this.options
    );

    return count > 0;
  }
}
