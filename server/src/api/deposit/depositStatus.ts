import ApiResponseHandler from '../apiResponseHandler';
import DepositService from '../../services/depositService';

export default async (req, res, next) => {
  try {
    const depositStatus = req.body.data.status;
    const depositId = req.body.data.id;

    const payload = await new DepositService(req).updateDepositStatus(
      depositId,
      depositStatus,
      req,
    );

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
