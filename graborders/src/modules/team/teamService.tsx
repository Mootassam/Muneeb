import authAxios from 'src/modules/shared/axios/authAxios';
import AuthCurrentTenant from 'src/modules/auth/authCurrentTenant';

export default class TeamService {
  static async find(userId?: string) {
    const tenantId = AuthCurrentTenant.get();

    const response = await authAxios.get(
      userId
        ? `/tenant/${tenantId}/team/${userId}`
        : `/tenant/${tenantId}/team`,
    );

    return response.data;
  }
}
