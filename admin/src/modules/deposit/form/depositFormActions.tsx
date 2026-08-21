import Errors from 'src/modules/shared/error/errors';
import Message from 'src/view/shared/message';
import { getHistory } from 'src/modules/store';
import { i18n } from 'src/i18n';
import DepositService from 'src/modules/deposit/depositService';
import depositListActions from 'src/modules/deposit/list/depositListActions';

const prefix = 'DEPOSIT_FORM';

const depositFormActions = {
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
        type: depositFormActions.INIT_STARTED,
      });

      let record = {};

      const isEdit = Boolean(id);

      if (isEdit) {
        record = await DepositService.find(id);
      }

      dispatch({
        type: depositFormActions.INIT_SUCCESS,
        payload: record,
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: depositFormActions.INIT_ERROR,
      });

      getHistory().push('/deposit');
    }
  },

  doCreate: (values) => async (dispatch) => {
    try {
      dispatch({
        type: depositFormActions.CREATE_STARTED,
      });

      await DepositService.create(values);

      dispatch({
        type: depositFormActions.CREATE_SUCCESS,
      });

      Message.success(
        i18n('entities.deposit.create.success'),
      );

      getHistory().push('/deposit');
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: depositFormActions.CREATE_ERROR,
      });
    }
  },

  doUpdate: (id, values) => async (dispatch, getState) => {
    try {
      dispatch({
        type: depositFormActions.UPDATE_STARTED,
      });

      await DepositService.update(id, values);

      dispatch({
        type: depositFormActions.UPDATE_SUCCESS,
      });

      Message.success(
        i18n('entities.deposit.update.success'),
      );

      getHistory().push('/deposit');
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: depositFormActions.UPDATE_ERROR,
      });
    }
  },

    doUpdateStatus: (values) => async (dispatch, getState) => {
    try {
      dispatch({
        type: depositFormActions.UPDATE_STARTED,
      });

      await DepositService.depositStatus(values);

      dispatch({
        type: depositFormActions.UPDATE_SUCCESS,
      });

      Message.success(
        i18n('entities.deposit.update.success'),
      );

      dispatch(depositListActions.doFetch())

      getHistory().push('/deposit');
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: depositFormActions.UPDATE_ERROR,
      });
    }
  },
};

export default depositFormActions;
