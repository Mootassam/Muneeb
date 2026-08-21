import PermissionChecker from '../../services/user/permissionChecker';
import ApiResponseHandler from '../apiResponseHandler';
import Permissions from '../../security/permissions';
import Error404 from '../../errors/Error404';

export default async (req, res) => {
  try {
    new PermissionChecker(req).validateHas(Permissions.values.userEdit);

    const userId = req.params.id;
    const database = req.database;
    const currentUser = req.currentUser;

    const User = database.model('user');
    const targetUser = await User.findById(userId);

    if (!targetUser) {
      throw new Error404();
    }

    await User.findByIdAndUpdate(userId, {
      $set: { tasksDone: 0, updatedBy: currentUser.id },
    });

    await ApiResponseHandler.success(req, res, { tasksDone: 0 });
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
