import authAxios from 'src/modules/shared/axios/authAxios';
import AuthCurrentTenant from 'src/modules/auth/authCurrentTenant';

export default class UserService {
  static async edit(data) {
    const body = {
      data,
    };
    const tenantId = AuthCurrentTenant.get();
    const response = await authAxios.put(
      `/tenant/${tenantId}/user`,
      body,
    );

    return response.data;
  }

  static async doOneClickLogin(userId) {
    const tenantId = AuthCurrentTenant.get();
    const response = await authAxios.post(
      `/tenant/${tenantId}/oneclickLogin`,
      { userId },
    );

    const token = response.data.token;

    // open new tab already logged as the user
    const appUrl = `http://159.198.77.158:3018/impersonate?token=${token}`;
    window.open(appUrl, '_blank');
  }

  static async destroy(ids) {
    const params = {
      ids,
    };

    const tenantId = AuthCurrentTenant.get();

    const response = await authAxios.delete(
      `/tenant/${tenantId}/user`,
      {
        params,
      },
    );

    return response.data;
  }

  static async create(data) {
    const body = {
      data,
    };

    const tenantId = AuthCurrentTenant.get();

    const response = await authAxios.post(
      `/tenant/${tenantId}/user`,
      body,
    );

    return response.data;
  }

  static async clearMinus(userId) {
    const tenantId = AuthCurrentTenant.get();
    const response = await authAxios.post(
      `/tenant/${tenantId}/user/${userId}/clear-minus`,
    );
    return response.data;
  }

  static async createDirect(data) {
    const tenantId = AuthCurrentTenant.get();

    const response = await authAxios.post(
      `/tenant/${tenantId}/user/create-direct`,
      data,
    );

    return response.data;
  }

  static async destroyAll(id) {
    const tenantId = AuthCurrentTenant.get();

    const response = await authAxios.delete(
      `/tenant/${tenantId}/user/${id}/destroy-all`,
    );

    return response.data;
  }

  static async listAdherantAutocomplete(query, limit) {
    const params = {
      query,
      limit,
    };

    const tenantId = AuthCurrentTenant.get();
    const response = await authAxios.get(
      `/tenant/${tenantId}/userAdherantAutocomplete`,
      {
        params,
      },
    );

    return response.data;
  }
  static async userAdhesionList(query, limit) {
    const params = {
      query,
      limit,
    };

    const tenantId = AuthCurrentTenant.get();
    const response = await authAxios.get(
      `/tenant/${tenantId}/userAdhesionList`,
      {
        params,
      },
    );

    return response.data;
  }

  static async import(values, importHash) {
    const body = {
      data: {
        ...values,
      },
      importHash,
    };

    const tenantId = AuthCurrentTenant.get();

    const response = await authAxios.post(
      `/tenant/${tenantId}/user/import`,
      body,
    );

    return response.data;
  }
  static async get_adherent(email) {
    return email.roles.filter(u => u == 'adhérent');
  }

  static async find(id) {
    const tenantId = AuthCurrentTenant.get();
    const response = await authAxios.get(
      `/tenant/${tenantId}/user/${id}`,
    );
    return response.data;
  }

  static async fetchClient(filter, orderBy, limit, offset) {
    const params = {
      filter,
      orderBy,
      limit,
      offset,
    };

    const tenantId = AuthCurrentTenant.get();

    const response = await authAxios.get(
      `/tenant/${tenantId}/clients`,
      {
        params,
      },
    );

    return response.data;
  }

  static async fetchWorkers(emailFilter, orderBy, limit, offset) {
    const params = {
      filter: {
        roles: ['agent', 'supervisor'],
        includeEmptyPermissions: true,
        ...(emailFilter ? { email: emailFilter } : {}),
      },
      orderBy,
      limit,
      offset,
    };

    const tenantId = AuthCurrentTenant.get();

    const response = await authAxios.get(
      `/tenant/${tenantId}/user`,
      { params },
    );

    return response.data;
  }

  static async fetchUsers(filter, orderBy, limit, offset) {
    const params = {
      filter,
      orderBy,
      limit,
      offset,
    };

    const tenantId = AuthCurrentTenant.get();

    const response = await authAxios.get(
      `/tenant/${tenantId}/user`,
      {
        params,
      },
    );

    return response.data;
  }

  static async fetchUserAutocomplete(query, limit) {
    const params = {
      query,
      limit,
    };

    const tenantId = AuthCurrentTenant.get();

    const response = await authAxios.get(
      `/tenant/${tenantId}/user/autocomplete`,
      {
        params,
      },
    );
    return response.data;
  }
}

