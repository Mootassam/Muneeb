import Error400 from '../errors/Error400';
import MongooseRepository from '../database/repositories/mongooseRepository';
import { IServiceOptions } from './IServiceOptions';
import VipRepository from '../database/repositories/vipRepository';
import UserRepository from '../database/repositories/userRepository';

export default class VipServices {
  options: IServiceOptions;

  constructor(options) {
    this.options = options;
  }

  /**
   * Lets a customer switch their current VIP level to `vipId`, no balance
   * deduction involved — it's just a tier change. UserRepository.updateProfile
   * already rejects the switch (via checkSolde) if the account's balance is
   * below the target level's levellimit, or if it's already their current
   * level, so we just surface whatever it throws.
   */
  async join(vipId) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      const vip = await VipRepository.findById(vipId, this.options);

      const currentUserId = MongooseRepository.getCurrentUser(this.options).id;

      const user = await UserRepository.updateProfile(
        currentUserId,
        { vip },
        {
          ...this.options,
          session,
          bypassPermissionValidation: true,
        },
      );

      await MongooseRepository.commitTransaction(session);

      return user;
    } catch (error) {
      await MongooseRepository.abortTransaction(session);
      throw error;
    }
  }

  async create(data) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      const record = await VipRepository.create(data, {
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
        'vip',
      );

      throw error;
    }
  }

  async update(id, data) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      const record = await VipRepository.update(
        id,
        data,
        {
          ...this.options,
          session,
        },
      );

      await MongooseRepository.commitTransaction(session);

      return record;
    } catch (error) {
      await MongooseRepository.abortTransaction(session);

      MongooseRepository.handleUniqueFieldError(
        error,
        this.options.language,
        'vip',
      );

      throw error;
    }
  }

  async destroyAll(ids) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      for (const id of ids) {
        await VipRepository.destroy(id, {
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
    return VipRepository.findById(id, this.options);
  }

  async findAllAutocomplete(search, limit) {
    return VipRepository.findAllAutocomplete(
      search,
      limit,
      this.options,
    );
  }

  async findAndCountAll(args) {
    return VipRepository.findAndCountAll(
      args,
      this.options,
    );
  }

  async import(data, importHash) {
    if (!importHash) {
      throw new Error400(
        this.options.language,
        'importer.errors.importHashRequired',
      );
    }

    if (await this._isImportHashExistent(importHash)) {
      throw new Error400(
        this.options.language,
        'importer.errors.importHashExistent',
      );
    }

    const dataToCreate = {
      ...data,
      importHash,
    };

    return this.create(dataToCreate);
  }

  async _isImportHashExistent(importHash) {
    const count = await VipRepository.count(
      {
        importHash,
      },
      this.options,
    );

    return count > 0;
  }
}
