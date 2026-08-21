import ApiResponseHandler from '../apiResponseHandler';
import DepositService from '../../services/depositService';

export default async (req, res, next) => {
  try {
    const payload = await new DepositService(
      req,
    ).findAndCountAll(req.query);

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
