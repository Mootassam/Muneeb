import { createSelector } from 'reselect';

const selectRaw = (state) => state.withdraw.destroy;

const selectLoading = createSelector([selectRaw], (raw) =>
  Boolean(raw.loading),
);

const withdrawDestroySelectors = {
  selectLoading,
};

export default withdrawDestroySelectors;
