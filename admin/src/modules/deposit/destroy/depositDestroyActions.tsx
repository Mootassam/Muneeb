import listActions from 'src/modules/deposit/list/depositListActions';
import DepositService from 'src/modules/deposit/depositService';
import Errors from 'src/modules/shared/error/errors';
import { i18n } from 'src/i18n';
import { getHistory } from 'src/modules/store';
import Message from 'src/view/shared/message';

const prefix = 'DEPOSIT_DESTROY';
const depositDestroyActions = {
  DESTROY_STARTED: `${prefix}_DESTROY_STARTED`,
  DESTROY_SUCCESS: `${prefix}_DESTROY_SUCCESS`,
  DESTROY_ERROR: `${prefix}_DESTROY_ERROR`,

  DESTROY_ALL_STARTED: `${prefix}_DESTROY_ALL_STARTED`,
  DESTROY_ALL_SUCCESS: `${prefix}_DESTROY_ALL_SUCCESS`,
  DESTROY_ALL_ERROR: `${prefix}_DESTROY_ALL_ERROR`,

  doDestroy: (id) => async (dispatch) => {
    try {
      dispatch({
        type: depositDestroyActions.DESTROY_STARTED,
      });

      await DepositService.destroyAll([id]);

      dispatch({
        type: depositDestroyActions.DESTROY_SUCCESS,
      });

      Message.success(
        i18n('entities.deposit.destroy.success'),
      );

      dispatch(listActions.doFetchCurrentFilter());

      getHistory().push('/deposit');
    } catch (error) {
      Errors.handle(error);

      dispatch(listActions.doFetchCurrentFilter());

      dispatch({
        type: depositDestroyActions.DESTROY_ERROR,
      });
    }
  },

  doDestroyAll: (ids) => async (dispatch) => {
    try {
      dispatch({
        type: depositDestroyActions.DESTROY_ALL_STARTED,
      });

      await DepositService.destroyAll(ids);

      dispatch({
        type: depositDestroyActions.DESTROY_ALL_SUCCESS,
      });

      if (listActions) {
        dispatch(listActions.doClearAllSelected());
        dispatch(listActions.doFetchCurrentFilter());
      }

      Message.success(
        i18n('entities.deposit.destroyAll.success'),
      );

      getHistory().push('/deposit');
    } catch (error) {
      Errors.handle(error);

      dispatch(listActions.doFetchCurrentFilter());

      dispatch({
        type: depositDestroyActions.DESTROY_ALL_ERROR,
      });
    }
  },
};

export default depositDestroyActions;
