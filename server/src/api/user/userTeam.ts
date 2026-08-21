import PermissionChecker from '../../services/user/permissionChecker';
import ApiResponseHandler from '../apiResponseHandler';
import Permissions from '../../security/permissions';
import TeamService from '../../services/teamService';

export default async (req, res, next) => {
  try {
    new PermissionChecker(req).validateHas(Permissions.values.userRead);

    const payload = await new TeamService(req).getTeamForUser(req.params.id);

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
