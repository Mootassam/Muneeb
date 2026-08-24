import actions from 'src/modules/sequence/destroy/sequenceDestroyActions';

const initialData = {
  loading: false,
};

export default (state = initialData, { type, payload }) => {
  if (type === actions.DESTROY_STARTED) {
    return {
      ...state,
      loading: true,
    };
  }

  if (
    type === actions.DESTROY_SUCCESS ||
    type === actions.DESTROY_ERROR
  ) {
    return {
      ...state,
      loading: false,
    };
  }

  return state;
};
