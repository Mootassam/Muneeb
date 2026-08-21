import DepositService from 'src/modules/deposit/depositService';
import Errors from 'src/modules/shared/error/errors';
import { getHistory } from 'src/modules/store';

const prefix = 'DEPOSIT_VIEW';

const depositViewActions = {
  FIND_STARTED: `${prefix}_FIND_STARTED`,
  FIND_SUCCESS: `${prefix}_FIND_SUCCESS`,
  FIND_ERROR: `${prefix}_FIND_ERROR`,

  doFind: (id) => async (dispatch) => {
    try {
      dispatch({
        type: depositViewActions.FIND_STARTED,
      });

      const record = await DepositService.find(id);

      dispatch({
        type: depositViewActions.FIND_SUCCESS,
        payload: record,
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: depositViewActions.FIND_ERROR,
      });

      getHistory().push('/deposit');
    }
  },
};

export default depositViewActions;
