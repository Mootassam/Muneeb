import ApiResponseHandler from '../apiResponseHandler';
import TeamService from '../../services/teamService';

export default async (req, res, next) => {
  try {
    const payload = await new TeamService(req).getTeam(req.params.userId);

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
