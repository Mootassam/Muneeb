import { createSelector } from 'reselect';

const selectRaw = (state) => state.deposit.view;

const selectRecord = createSelector(
  [selectRaw],
  (raw) => raw.record,
);

const selectLoading = createSelector([selectRaw], (raw) =>
  Boolean(raw.loading),
);

const depositViewSelectors = {
  selectLoading,
  selectRecord,
  selectRaw,
};

export default depositViewSelectors;
