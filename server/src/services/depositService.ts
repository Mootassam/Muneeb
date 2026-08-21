import Error400 from "../errors/Error400";
import MongooseRepository from "../database/repositories/mongooseRepository";
import { IServiceOptions } from "./IServiceOptions";
import DepositRepository from "../database/repositories/DepositRepository";
import Notification from "../database/models/notification";

export default class DepositService {
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

      const values = {
        status: data.status || "pending",
        user: data.user,
        amount: data.amount,
        currency: data.currency,
        paymentMethod: data.paymentMethod,
        protocol: data.protocol,
      };

      const record = await DepositRepository.create(values, {
        ...this.options,
        session,
      });

      // A customer-submitted deposit is created "pending" and only credits
      // the balance once an admin approves it via updateDepositStatus.
      // Creating one already "success" (e.g. an admin manual entry) credits
      // immediately.
      if (values.status === "success") {
        await this.updateUserBalance(data.user, data.amount, session, "inc");

        await this.createNotification(
          data.user,
          record._id,
          "deposit_success",
          data.amount,
          { ...this.options, session }
        );
      }

      await MongooseRepository.commitTransaction(session);

      return record;
    } catch (error) {
      await MongooseRepository.abortTransaction(session);

      MongooseRepository.handleUniqueFieldError(
        error,
        this.options.language,
        "deposit"
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

  async createNotification(userId, depositId, type, amount, options) {
    const currentUser = MongooseRepository.getCurrentUser(options);
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    await Notification(options.database).create(
      [
        {
          type,
          status: "unread",
          user: userId,
          transaction: depositId,
          amount: amount.toString(),
          tenant: currentTenant.id,
          createdBy: currentUser.id,
        },
      ],
      options
    );
  }

  async updateDepositStatus(depositId, newStatus, options) {
    const session = await MongooseRepository.createSession(
      this.options.database
    );

    try {
      const Deposit = this.options.database.model("deposit");
      const User = this.options.database.model("user");

      const deposit = await Deposit.findById(depositId)
        .populate("user")
        .session(session);

      if (!deposit) {
        throw new Error400(this.options.language, "Deposit.notFoundDeposit");
      }

      const oldStatus = deposit.status;
      const amount = parseFloat(deposit.amount);

      const updatedDeposit = await Deposit.findByIdAndUpdate(
        depositId,
        {
          status: newStatus,
          updatedBy: MongooseRepository.getCurrentUser(options).id,
        },
        { new: true, session }
      );

      if (newStatus === "success" && oldStatus !== "success") {
        await this.createNotification(
          deposit.user._id,
          depositId,
          "deposit_success",
          deposit.amount,
          { ...this.options, session }
        );

        await User.findByIdAndUpdate(
          deposit.user._id,
          { $inc: { balance: amount } },
          { session }
        );
      } else if (newStatus === "canceled" && oldStatus !== "canceled") {
        await this.createNotification(
          deposit.user._id,
          depositId,
          "deposit_canceled",
          deposit.amount,
          { ...this.options, session }
        );

        if (oldStatus === "success") {
          await User.findByIdAndUpdate(
            deposit.user._id,
            { $inc: { balance: -amount } },
            { session }
          );
        }
      } else if (oldStatus === "success" && newStatus !== "success") {
        await User.findByIdAndUpdate(
          deposit.user._id,
          { $inc: { balance: -amount } },
          { session }
        );
      }

      await MongooseRepository.commitTransaction(session);
      return updatedDeposit;
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
      const record = await DepositRepository.update(id, data, {
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
        "deposit"
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
        await DepositRepository.destroy(id, {
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
    return DepositRepository.findById(id, this.options);
  }

  async findAllAutocomplete(search, limit) {
    return DepositRepository.findAllAutocomplete(search, limit, this.options);
  }

  async findAndCountAll(args) {
    return DepositRepository.findAndCountAll(args, this.options);
  }

  async findAndCountByUser(args) {
    return DepositRepository.findAndCountByUser(args, this.options);
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
    const count = await DepositRepository.count(
      {
        importHash,
      },
      this.options
    );

    return count > 0;
  }
}
