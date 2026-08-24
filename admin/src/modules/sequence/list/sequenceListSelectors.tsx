import { createSelector } from 'reselect';

const selectRaw = (state) => state.sequence.list;

const selectLoading = createSelector([selectRaw], (raw) => raw.loading);

const selectRows = createSelector([selectRaw], (raw) => raw.rows);

const selectCount = createSelector([selectRaw], (raw) => raw.count);

const selectHasRows = createSelector([selectCount], (count) => count > 0);

const selectFilter = createSelector([selectRaw], (raw) => raw.filter);

const selectRawFilter = createSelector([selectRaw], (raw) => raw.rawFilter);

const sequenceListSelectors = {
  selectLoading,
  selectRows,
  selectCount,
  selectHasRows,
  selectFilter,
  selectRawFilter,
};

export default sequenceListSelectors;
