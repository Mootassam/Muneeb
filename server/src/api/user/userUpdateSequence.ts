import PermissionChecker from '../../services/user/permissionChecker';
import ApiResponseHandler from '../apiResponseHandler';
import Permissions from '../../security/permissions';
import Error404 from '../../errors/Error404';

export default async (req, res) => {
  try {
    new PermissionChecker(req).validateHas(Permissions.values.userEdit);

    const userId = req.params.id;
    const sequenceId = req.body.sequenceId || null;
    const database = req.database;
    const currentUser = req.currentUser;

    const User = database.model('user');

    const targetUser = await User.findById(userId);

    if (!targetUser) {
      throw new Error404();
    }

    if (sequenceId) {
      const Sequence = database.model('sequence');
      const sequence = await Sequence.findById(sequenceId);

      if (!sequence) {
        throw new Error404();
      }
    }

    await User.findByIdAndUpdate(userId, {
      $set: { sequence: sequenceId, updatedBy: currentUser.id },
    });

    await ApiResponseHandler.success(req, res, { sequence: sequenceId });
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
