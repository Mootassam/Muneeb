import { createSelector } from 'reselect';

const selectRaw = (state) => state.worker.list;

const selectLoading = createSelector([selectRaw], (raw) => raw.loading);

const selectRows = createSelector([selectRaw], (raw) => raw.rows);

const selectCount = createSelector([selectRaw], (raw) => raw.count);

const selectHasRows = createSelector([selectCount], (count) => count > 0);

const selectSorter = createSelector([selectRaw], (raw) => raw.sorter || {});

const selectEmailFilter = createSelector([selectRaw], (raw) => raw.emailFilter || '');

const selectOrderBy = createSelector([selectRaw], (raw) => {
  const sorter = raw.sorter;
  if (!sorter || !sorter.field) return null;
  const direction = sorter.order === 'descend' ? 'DESC' : 'ASC';
  return `${sorter.field}_${direction}`;
});

const selectLimit = createSelector([selectRaw], (raw) => raw.pagination.pageSize);

const selectOffset = createSelector([selectRaw], (raw) => {
  const pagination = raw.pagination;
  if (!pagination || !pagination.pageSize) return 0;
  const current = pagination.current || 1;
  return (current - 1) * pagination.pageSize;
});

const selectPagination = createSelector([selectRaw, selectCount], (raw, count) => ({
  ...raw.pagination,
  total: count,
}));

const workerListSelectors = {
  selectLoading,
  selectRows,
  selectCount,
  selectOrderBy,
  selectLimit,
  selectOffset,
  selectPagination,
  selectHasRows,
  selectSorter,
  selectEmailFilter,
};

export default workerListSelectors;
