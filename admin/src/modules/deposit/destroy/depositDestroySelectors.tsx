import { createSelector } from 'reselect';

const selectRaw = (state) => state.deposit.destroy;

const selectLoading = createSelector([selectRaw], (raw) =>
  Boolean(raw.loading),
);

const depositDestroySelectors = {
  selectLoading,
};

export default depositDestroySelectors;
