import authAxios from 'src/modules/shared/axios/authAxios';
import AuthCurrentTenant from 'src/modules/auth/authCurrentTenant';

export default class WithdrawService {
  static async create(data) {
    const body = {
      data,
    };

    const tenantId = AuthCurrentTenant.get();

    const response = await authAxios.post(
      `/tenant/${tenantId}/withdraw`,
      body,
    );

    return response.data;
  }

  static async listByUser(filter?, orderBy?, limit?, offset?) {
    const params = {
      filter,
      orderBy,
      limit,
      offset,
    };

    const tenantId = AuthCurrentTenant.get();

    const response = await authAxios.get(
      `/tenant/${tenantId}/withdraw/byUser`,
      {
        params,
      },
    );

    return response.data;
  }
}
