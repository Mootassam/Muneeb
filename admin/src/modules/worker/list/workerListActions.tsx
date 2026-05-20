import UserService from 'src/modules/user/userService';
import selectors from 'src/modules/worker/list/workerListSelectors';
import Errors from 'src/modules/shared/error/errors';
import Message from 'src/view/shared/message';
import { i18n } from 'src/i18n';

const prefix = 'WORKER_LIST';

const workerListActions = {
  FETCH_STARTED: `${prefix}_FETCH_STARTED`,
  FETCH_SUCCESS: `${prefix}_FETCH_SUCCESS`,
  FETCH_ERROR: `${prefix}_FETCH_ERROR`,

  RESETED: `${prefix}_RESETED`,

  PAGINATION_CHANGED: `${prefix}_PAGINATION_CHANGED`,
  SORTER_CHANGED: `${prefix}_SORTER_CHANGED`,
  EMAIL_FILTER_CHANGED: `${prefix}_EMAIL_FILTER_CHANGED`,

  DESTROY_STARTED: `${prefix}_DESTROY_STARTED`,
  DESTROY_SUCCESS: `${prefix}_DESTROY_SUCCESS`,
  DESTROY_ERROR: `${prefix}_DESTROY_ERROR`,

  DESTROY_ALL_FULL_STARTED: `${prefix}_DESTROY_ALL_FULL_STARTED`,
  DESTROY_ALL_FULL_SUCCESS: `${prefix}_DESTROY_ALL_FULL_SUCCESS`,
  DESTROY_ALL_FULL_ERROR: `${prefix}_DESTROY_ALL_FULL_ERROR`,

  doReset: () => async (dispatch) => {
    dispatch({ type: workerListActions.RESETED });
    dispatch(workerListActions.doFetch());
  },

  doChangePagination: (pagination) => async (dispatch) => {
    dispatch({
      type: workerListActions.PAGINATION_CHANGED,
      payload: pagination,
    });
    dispatch(workerListActions.doFetchCurrentFilter());
  },

  doChangeSort: (sorter) => async (dispatch) => {
    dispatch({
      type: workerListActions.SORTER_CHANGED,
      payload: sorter,
    });
    dispatch(workerListActions.doFetchCurrentFilter());
  },

  doSearchByEmail: (email) => async (dispatch) => {
    dispatch({
      type: workerListActions.EMAIL_FILTER_CHANGED,
      payload: email,
    });
    dispatch(workerListActions.doFetch());
  },

  doFetchCurrentFilter: () => async (dispatch) => {
    dispatch(workerListActions.doFetch(true));
  },

  doFetch: (keepPagination = false) => async (dispatch, getState) => {
    try {
      dispatch({
        type: workerListActions.FETCH_STARTED,
        payload: { keepPagination },
      });

      const response = await UserService.fetchWorkers(
        selectors.selectEmailFilter(getState()),
        selectors.selectOrderBy(getState()),
        selectors.selectLimit(getState()),
        selectors.selectOffset(getState()),
      );

      dispatch({
        type: workerListActions.FETCH_SUCCESS,
        payload: {
          rows: response.rows,
          count: response.count,
        },
      });
    } catch (error) {
      Errors.handle(error);
      dispatch({ type: workerListActions.FETCH_ERROR });
    }
  },

  doDestroy: (id) => async (dispatch) => {
    try {
      dispatch({ type: workerListActions.DESTROY_STARTED });
      await UserService.destroy([id]);
      dispatch({ type: workerListActions.DESTROY_SUCCESS });
      Message.success(i18n('user.doDestroySuccess'));
      dispatch(workerListActions.doFetchCurrentFilter());
    } catch (error) {
      Errors.handle(error);
      dispatch({ type: workerListActions.DESTROY_ERROR });
      dispatch(workerListActions.doFetchCurrentFilter());
    }
  },

  doDestroyAllFull: (id) => async (dispatch) => {
    try {
      dispatch({ type: workerListActions.DESTROY_ALL_FULL_STARTED });
      await UserService.destroyAll(id);
      dispatch({ type: workerListActions.DESTROY_ALL_FULL_SUCCESS });
      Message.success(i18n('user.doDestroyAllFullSuccess'));
      dispatch(workerListActions.doFetchCurrentFilter());
    } catch (error) {
      Errors.handle(error);
      dispatch({ type: workerListActions.DESTROY_ALL_FULL_ERROR });
      dispatch(workerListActions.doFetchCurrentFilter());
    }
  },
};

export default workerListActions;
