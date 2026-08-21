import { createSelector } from 'reselect';

const selectRaw = (state) => state.deposit.count;

const selectPendingCount = createSelector(
  [selectRaw],
  (raw) => raw.pendingCount || 0,
);

const depositCountSelectors = {
  selectPendingCount,
};

export default depositCountSelectors;
