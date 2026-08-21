import WithdrawService from 'src/modules/withdraw/withdrawService';

const prefix = 'WITHDRAW_COUNT';

const withdrawCountActions = {
  FETCH_STARTED: `${prefix}_FETCH_STARTED`,
  FETCH_SUCCESS: `${prefix}_FETCH_SUCCESS`,
  FETCH_ERROR: `${prefix}_FETCH_ERROR`,

  doFetchPendingCount: () => async (dispatch) => {
    try {
      dispatch({
        type: withdrawCountActions.FETCH_STARTED,
      });

      const response = await WithdrawService.list(
        { status: 'pending' },
        null,
        1,
        0,
      );

      dispatch({
        type: withdrawCountActions.FETCH_SUCCESS,
        payload: response.count,
      });
    } catch (error) {
      dispatch({
        type: withdrawCountActions.FETCH_ERROR,
      });
    }
  },
};

export default withdrawCountActions;
