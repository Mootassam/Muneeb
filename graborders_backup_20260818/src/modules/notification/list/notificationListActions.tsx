import selectors from 'src/modules/notification/list/notificationListSelectors';
import Errors from 'src/modules/shared/error/errors';
import NotificationService from 'src/modules/notification/notificationService';

const prefix = 'NOTIFICATiON_LIST';

const notificationListActions = {
  FETCH_STARTED: `${prefix}_FETCH_STARTED`,
  FETCH_SUCCESS: `${prefix}_FETCH_SUCCESS`,
  FETCH_ERROR: `${prefix}_FETCH_ERROR`,


  COUNT_STARTED: `${prefix}_COUNT_STARTED`,

  COUNT_SUCCESS: `${prefix}_COUNT_SUCCESS`,
  COUNT_ERROR: `${prefix}_COUNT_ERROR`,

  RESETED: `${prefix}_RESETED`,
  TOGGLE_ONE_SELECTED: `${prefix}_TOGGLE_ONE_SELECTED`,
  TOGGLE_ALL_SELECTED: `${prefix}_TOGGLE_ALL_SELECTED`,
  CLEAR_ALL_SELECTED: `${prefix}_CLEAR_ALL_SELECTED`,


  doClearAllSelected() {
    return {
      type: notificationListActions.CLEAR_ALL_SELECTED,
    };
  },

  doToggleAllSelected() {
    return {
      type: notificationListActions.TOGGLE_ALL_SELECTED,
    };
  },

  doToggleOneSelected(id) {
    return {
      type: notificationListActions.TOGGLE_ONE_SELECTED,
      payload: id,
    };
  },

  doReset: () => async (dispatch) => {
    dispatch({
      type: notificationListActions.RESETED,
    });

    dispatch(notificationListActions.doFetch());
  },







  doFetchCurrentFilter:
    () => async (dispatch, getState) => {
      const filter = selectors.selectFilter(getState());
      const rawFilter = selectors.selectRawFilter(
        getState(),
      );
      dispatch(
        notificationListActions.doFetch(
          filter,
          rawFilter,
          true,
        ),
      );
    },

  doFetch:
    (filter?, rawFilter?, keepPagination = false) =>
      async (dispatch, getState) => {
        try {
          dispatch({
            type: notificationListActions.FETCH_STARTED,
            payload: { filter, rawFilter, keepPagination },
          });

          const response = await NotificationService.list(
            filter,
            selectors.selectOrderBy(getState()),
            selectors.selectLimit(getState()),
            selectors.selectOffset(getState()),
          );

          dispatch({
            type: notificationListActions.FETCH_SUCCESS,
            payload: {
              rows: response.rows,
              count: response.count,
            },
          });
        } catch (error) {
          Errors.handle(error);

          dispatch({
            type: notificationListActions.FETCH_ERROR,
          });
        }
      },



  fetchUnreadNotifications:
    () =>
      async (dispatch, getState) => {


        try {
          dispatch({
            type: notificationListActions.COUNT_STARTED,
          });

          const response = await NotificationService.countUnread(

          );

          dispatch({
            type: notificationListActions.COUNT_SUCCESS,
            payload: response
          });
        } catch (error) {
          Errors.handle(error);

          dispatch({
            type: notificationListActions.COUNT_ERROR,
          });
        }
      },

};

export default notificationListActions;
