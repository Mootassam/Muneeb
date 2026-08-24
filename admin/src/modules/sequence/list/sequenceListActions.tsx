import Errors from 'src/modules/shared/error/errors';
import SequenceService from 'src/modules/sequence/sequenceService';

const prefix = 'SEQUENCE_LIST';

const sequenceListActions = {
  FETCH_STARTED: `${prefix}_FETCH_STARTED`,
  FETCH_SUCCESS: `${prefix}_FETCH_SUCCESS`,
  FETCH_ERROR: `${prefix}_FETCH_ERROR`,

  RESETED: `${prefix}_RESETED`,

  doReset: () => async (dispatch) => {
    dispatch({
      type: sequenceListActions.RESETED,
    });

    dispatch(sequenceListActions.doFetch());
  },

  doFetch:
    (filter?, rawFilter?) => async (dispatch) => {
      try {
        dispatch({
          type: sequenceListActions.FETCH_STARTED,
          payload: { filter, rawFilter },
        });

        const response = await SequenceService.list(
          filter,
          'createdAt_DESC',
          null,
          null,
        );

        dispatch({
          type: sequenceListActions.FETCH_SUCCESS,
          payload: {
            rows: response.rows,
            count: response.count,
          },
        });
      } catch (error) {
        Errors.handle(error);

        dispatch({
          type: sequenceListActions.FETCH_ERROR,
        });
      }
    },
};

export default sequenceListActions;
