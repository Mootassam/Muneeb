import listActions from 'src/modules/sequence/list/sequenceListActions';
import Errors from 'src/modules/shared/error/errors';
import { i18n } from 'src/i18n';
import Message from 'src/view/shared/message';
import SequenceService from 'src/modules/sequence/sequenceService';

const prefix = 'SEQUENCE_DESTROY';

const sequenceDestroyActions = {
  DESTROY_STARTED: `${prefix}_DESTROY_STARTED`,
  DESTROY_SUCCESS: `${prefix}_DESTROY_SUCCESS`,
  DESTROY_ERROR: `${prefix}_DESTROY_ERROR`,

  doDestroy: (id) => async (dispatch) => {
    try {
      dispatch({
        type: sequenceDestroyActions.DESTROY_STARTED,
      });

      await SequenceService.destroyAll([id]);

      dispatch({
        type: sequenceDestroyActions.DESTROY_SUCCESS,
      });

      Message.success(i18n('entities.sequence.destroy.success'));

      dispatch(listActions.doFetch());
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: sequenceDestroyActions.DESTROY_ERROR,
      });
    }
  },
};

export default sequenceDestroyActions;
