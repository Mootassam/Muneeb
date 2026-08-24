import listActions from 'src/modules/combo/list/comboListActions';
import Errors from 'src/modules/shared/error/errors';
import { i18n } from 'src/i18n';
import Message from 'src/view/shared/message';
import ComboService from 'src/modules/combo/comboService';

const prefix = 'COMBO_DESTROY';

const comboDestroyActions = {
  DESTROY_STARTED: `${prefix}_DESTROY_STARTED`,
  DESTROY_SUCCESS: `${prefix}_DESTROY_SUCCESS`,
  DESTROY_ERROR: `${prefix}_DESTROY_ERROR`,

  DESTROY_ALL_STARTED: `${prefix}_DESTROY_ALL_STARTED`,
  DESTROY_ALL_SUCCESS: `${prefix}_DESTROY_ALL_SUCCESS`,
  DESTROY_ALL_ERROR: `${prefix}_DESTROY_ALL_ERROR`,

  doDestroy: (id) => async (dispatch) => {
    try {
      dispatch({
        type: comboDestroyActions.DESTROY_STARTED,
      });

      await ComboService.destroyAll([id]);

      dispatch({
        type: comboDestroyActions.DESTROY_SUCCESS,
      });

      Message.success(i18n('entities.combo.destroy.success'));

      dispatch(listActions.doFetchCurrentFilter());
    } catch (error) {
      Errors.handle(error);

      dispatch(listActions.doFetchCurrentFilter());

      dispatch({
        type: comboDestroyActions.DESTROY_ERROR,
      });
    }
  },

  doDestroyAll: (ids) => async (dispatch) => {
    try {
      dispatch({
        type: comboDestroyActions.DESTROY_ALL_STARTED,
      });

      await ComboService.destroyAll(ids);

      dispatch({
        type: comboDestroyActions.DESTROY_ALL_SUCCESS,
      });

      dispatch(listActions.doClearAllSelected());
      dispatch(listActions.doFetchCurrentFilter());

      Message.success(i18n('entities.combo.destroyAll.success'));
    } catch (error) {
      Errors.handle(error);

      dispatch(listActions.doFetchCurrentFilter());

      dispatch({
        type: comboDestroyActions.DESTROY_ALL_ERROR,
      });
    }
  },
};

export default comboDestroyActions;
