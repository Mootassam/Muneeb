import { createSelector } from 'reselect';

const selectRaw = (state) => state.withdraw.count;

const selectPendingCount = createSelector(
  [selectRaw],
  (raw) => raw.pendingCount || 0,
);

const withdrawCountSelectors = {
  selectPendingCount,
};

export default withdrawCountSelectors;
