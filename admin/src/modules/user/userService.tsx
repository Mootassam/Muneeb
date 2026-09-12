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

    // The customer-facing app is a separate frontend on its own port (3018),
    // but hosted alongside the API — reuse the API's host/protocol instead
    // of hardcoding an IP that goes stale whenever authAxios points elsewhere.
    const apiUrl = new URL(authAxios.defaults.baseURL as string);
    const appUrl = `${apiUrl.protocol}//${apiUrl.hostname}:3018/impersonate?token=${encodeURIComponent(token)}`;

    // A fixed, named target (not '_blank') is important here: it makes every
    // click reuse the same already-open window instead of trying to open a
    // brand new popup each time. Navigating an existing window is not subject
    // to popup-blocker/user-gesture rules the way opening a new one is, so
    // this reliably works even though the token above is fetched
    // asynchronously first (which would otherwise risk the popup being
    // silently blocked, or a stale tab reference being left showing the
    // previous account).
    window.open(appUrl, 'graborders_impersonate');
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

  static async resetTasks(userId) {
    const tenantId = AuthCurrentTenant.get();
    const response = await authAxios.post(
      `/tenant/${tenantId}/user/${userId}/reset-task`,
    );
    return response.data;
  }

  static async updateSequence(userId, sequenceId) {
    const tenantId = AuthCurrentTenant.get();
    const response = await authAxios.post(
      `/tenant/${tenantId}/user/${userId}/sequence`,
      { sequenceId },
    );
    return response.data;
  }

  static async getTeam(userId) {
    const tenantId = AuthCurrentTenant.get();
    const response = await authAxios.get(
      `/tenant/${tenantId}/user/${userId}/team`,
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

  static async fetchWorkers(emailFilter, orderBy, limit, offset, refcodeFilter?) {
    const params = {
      filter: {
        roles: ['agent', 'supervisor'],
        includeEmptyPermissions: true,
        ...(emailFilter ? { email: emailFilter } : {}),
        ...(refcodeFilter ? { refcode: refcodeFilter } : {}),
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

