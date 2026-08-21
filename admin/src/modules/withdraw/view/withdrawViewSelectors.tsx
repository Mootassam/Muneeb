import { createSelector } from 'reselect';

const selectRaw = (state) => state.withdraw.view;

const selectRecord = createSelector(
  [selectRaw],
  (raw) => raw.record,
);

const selectLoading = createSelector([selectRaw], (raw) =>
  Boolean(raw.loading),
);

const withdrawViewSelectors = {
  selectLoading,
  selectRecord,
  selectRaw,
};

export default withdrawViewSelectors;
