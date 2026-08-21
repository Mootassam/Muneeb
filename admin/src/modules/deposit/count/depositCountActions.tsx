import DepositService from 'src/modules/deposit/depositService';

const prefix = 'DEPOSIT_COUNT';

const depositCountActions = {
  FETCH_STARTED: `${prefix}_FETCH_STARTED`,
  FETCH_SUCCESS: `${prefix}_FETCH_SUCCESS`,
  FETCH_ERROR: `${prefix}_FETCH_ERROR`,

  doFetchPendingCount: () => async (dispatch) => {
    try {
      dispatch({
        type: depositCountActions.FETCH_STARTED,
      });

      const response = await DepositService.list(
        { status: 'pending' },
        null,
        1,
        0,
      );

      dispatch({
        type: depositCountActions.FETCH_SUCCESS,
        payload: response.count,
      });
    } catch (error) {
      dispatch({
        type: depositCountActions.FETCH_ERROR,
      });
    }
  },
};

export default depositCountActions;
