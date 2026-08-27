import Errors from 'src/modules/shared/error/errors';
import Message from 'src/view/shared/message';
import { getHistory } from 'src/modules/store';
import { i18n } from 'src/i18n';
import ComboService from 'src/modules/combo/comboService';

const prefix = 'COMBO_FORM';

const comboFormActions = {
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
        type: comboFormActions.INIT_STARTED,
      });

      let record = {};

      const isEdit = Boolean(id);

      if (isEdit) {
        record = await ComboService.find(id);
      }

      dispatch({
        type: comboFormActions.INIT_SUCCESS,
        payload: record,
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: comboFormActions.INIT_ERROR,
      });

      getHistory().push('/combo');
    }
  },

  doCreate: (values) => async (dispatch) => {
    try {
      dispatch({
        type: comboFormActions.CREATE_STARTED,
      });

      await ComboService.create(values);

      dispatch({
        type: comboFormActions.CREATE_SUCCESS,
      });

      Message.success(i18n('entities.combo.create.success'));

      getHistory().push('/combo');
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: comboFormActions.CREATE_ERROR,
      });
    }
  },

  doUpdate: (id, values) => async (dispatch) => {
    try {
      dispatch({
        type: comboFormActions.UPDATE_STARTED,
      });

      await ComboService.update(id, values);

      dispatch({
        type: comboFormActions.UPDATE_SUCCESS,
      });

      Message.success(i18n('entities.combo.update.success'));

      getHistory().push('/combo');
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: comboFormActions.UPDATE_ERROR,
      });
    }
  },
};

export default comboFormActions;
