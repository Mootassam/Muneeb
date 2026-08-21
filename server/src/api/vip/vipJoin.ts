import ApiResponseHandler from '../apiResponseHandler';
import VipServices from '../../services/vipServices';

export default async (req, res, next) => {
  try {
    const payload = await new VipServices(req).join(req.params.id);

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
