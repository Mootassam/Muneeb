import actions from 'src/modules/worker/list/workerListActions';

const INITIAL_PAGE_SIZE = 10;

const initialData = {
  rows: [] as Array<any>,
  count: 0,
  loading: false,
  emailFilter: '',
  pagination: {
    current: 1,
    pageSize: INITIAL_PAGE_SIZE,
  },
  sorter: {},
};

export default (state = initialData, { type, payload }) => {
  if (type === actions.RESETED) {
    return { ...initialData };
  }

  if (type === actions.EMAIL_FILTER_CHANGED) {
    return { ...state, emailFilter: payload || '' };
  }

  if (type === actions.PAGINATION_CHANGED) {
    return {
      ...state,
      pagination: payload || { current: 1, pageSize: INITIAL_PAGE_SIZE },
    };
  }

  if (type === actions.SORTER_CHANGED) {
    return { ...state, sorter: payload || {} };
  }

  if (type === actions.FETCH_STARTED) {
    return {
      ...state,
      loading: true,
      pagination:
        payload && payload.keepPagination
          ? state.pagination
          : { current: 1, pageSize: INITIAL_PAGE_SIZE },
    };
  }

  if (type === actions.FETCH_SUCCESS) {
    return {
      ...state,
      loading: false,
      rows: payload.rows,
      count: payload.count,
    };
  }

  if (type === actions.FETCH_ERROR) {
    return { ...state, loading: false, rows: [], count: 0 };
  }

  if (
    type === actions.DESTROY_STARTED ||
    type === actions.DESTROY_ALL_FULL_STARTED
  ) {
    return { ...state, loading: true };
  }

  if (
    type === actions.DESTROY_ERROR ||
    type === actions.DESTROY_ALL_FULL_ERROR
  ) {
    return { ...state, loading: false };
  }

  if (
    type === actions.DESTROY_SUCCESS ||
    type === actions.DESTROY_ALL_FULL_SUCCESS
  ) {
    return { ...state, loading: false };
  }

  return state;
};
