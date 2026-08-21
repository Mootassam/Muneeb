import ApiResponseHandler from '../apiResponseHandler';
import WithdrawService from '../../services/withdrawService';

export default async (req, res, next) => {
  try {
    const payload = await new WithdrawService(req).update(
      req.params.id,
      req.body.data,
    );

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
