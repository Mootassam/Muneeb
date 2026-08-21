import Errors from 'src/modules/shared/error/errors';
import Message from 'src/view/shared/message';
import { getHistory } from 'src/modules/store';
import { i18n } from 'src/i18n';
import WithdrawService from 'src/modules/withdraw/withdrawService';
import withdrawListActions from 'src/modules/withdraw/list/withdrawListActions';

const prefix = 'WITHDRAW_FORM';

const withdrawFormActions = {
  INIT_STARTED: `${prefix}_INIT_STARTED`,
  INIT_SUCCESS: `${prefix}_INIT_SUCCESS`,
  INIT_ERROR: `${prefix}_INIT_ERROR`,

  CREATE_STARTED: `${prefix}_CREATE_STARTED`,
  CREATE_SUCCESS: `${prefix}_CREATE_SUCCESS`,
  CREATE_ERROR: `${prefix}_CREATE_ERROR`,

  UPDATE_STARTED: `${prefix}_UPDATE_STARTED`,
  UPDATE_SUCCESS: `${prefix}_UPDATE_SUCCESS`,
  UPDATE_ERROR: `${prefix}_UPDATE_ERROR`,

  doInit: (id) => async (dispatch) => {
    try {
      dispatch({
        type: withdrawFormActions.INIT_STARTED,
      });

      let record = {};

      const isEdit = Boolean(id);

      if (isEdit) {
        record = await WithdrawService.find(id);
      }

      dispatch({
        type: withdrawFormActions.INIT_SUCCESS,
        payload: record,
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: withdrawFormActions.INIT_ERROR,
      });

      getHistory().push('/withdraw');
    }
  },

  doCreate: (values) => async (dispatch) => {
    try {
      dispatch({
        type: withdrawFormActions.CREATE_STARTED,
      });

      await WithdrawService.create(values);

      dispatch({
        type: withdrawFormActions.CREATE_SUCCESS,
      });

      Message.success(
        i18n('entities.withdraw.create.success'),
      );

      getHistory().push('/withdraw');
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: withdrawFormActions.CREATE_ERROR,
      });
    }
  },

  doUpdate: (id, values) => async (dispatch, getState) => {
    try {
      dispatch({
        type: withdrawFormActions.UPDATE_STARTED,
      });

      await WithdrawService.update(id, values);

      dispatch({
        type: withdrawFormActions.UPDATE_SUCCESS,
      });

      Message.success(
        i18n('entities.withdraw.update.success'),
      );

      getHistory().push('/withdraw');
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: withdrawFormActions.UPDATE_ERROR,
      });
    }
  },

    doUpdateStatus: (values) => async (dispatch, getState) => {
    try {
      dispatch({
        type: withdrawFormActions.UPDATE_STARTED,
      });

      await WithdrawService.withdrawStatus(values);

      dispatch({
        type: withdrawFormActions.UPDATE_SUCCESS,
      });

      Message.success(
        i18n('entities.withdraw.update.success'),
      );

      dispatch(withdrawListActions.doFetch())

      getHistory().push('/withdraw');
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: withdrawFormActions.UPDATE_ERROR,
      });
    }
  },
};

export default withdrawFormActions;
