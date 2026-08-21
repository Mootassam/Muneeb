import ApiResponseHandler from '../apiResponseHandler';
import DepositService from '../../services/depositService';

export default async (req, res, next) => {
  try {
    const payload = await new DepositService(req).update(
      req.params.id,
      req.body.data,
    );

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
