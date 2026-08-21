import ApiResponseHandler from '../apiResponseHandler';
import WithdrawService from '../../services/withdrawService';

export default async (req, res, next) => {
  try {
    const payload = await new WithdrawService(req).findAndCountByUser(
      req.query
    );

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
