import { createSelector } from 'reselect';

const selectRaw = (state) => state.combo.list;

const selectLoading = createSelector([selectRaw], (raw) => raw.loading);

const selectRows = createSelector([selectRaw], (raw) => raw.rows);

const selectCount = createSelector([selectRaw], (raw) => raw.count);

const selectHasRows = createSelector([selectCount], (count) => count > 0);

const selectSorter = createSelector([selectRaw], (raw) => raw.sorter || {});

const selectOrderBy = createSelector([selectRaw], (raw) => {
  const sorter = raw.sorter;

  if (!sorter || !sorter.field) {
    return null;
  }

  let direction = sorter.order === 'descend' ? 'DESC' : 'ASC';

  return `${sorter.field}_${direction}`;
});

const selectFilter = createSelector([selectRaw], (raw) => raw.filter);

const selectRawFilter = createSelector([selectRaw], (raw) => raw.rawFilter);

const selectLimit = createSelector([selectRaw], (raw) => {
  const pagination = raw.pagination;
  return pagination.pageSize;
});

const selectOffset = createSelector([selectRaw], (raw) => {
  const pagination = raw.pagination;

  if (!pagination || !pagination.pageSize) {
    return 0;
  }

  const current = pagination.current || 1;

  return (current - 1) * pagination.pageSize;
});

const selectPagination = createSelector(
  [selectRaw, selectCount],
  (raw, count) => {
    return {
      ...raw.pagination,
      total: count,
    };
  },
);

const selectSelectedKeys = createSelector(
  [selectRaw],
  (raw) => raw.selectedKeys,
);

const selectIsAllSelected = createSelector(
  [selectRows, selectSelectedKeys],
  (rows, selectedKeys) => rows.length === selectedKeys.length,
);

const comboListSelectors = {
  selectLoading,
  selectRows,
  selectCount,
  selectOrderBy,
  selectLimit,
  selectFilter,
  selectOffset,
  selectPagination,
  selectSelectedKeys,
  selectHasRows,
  selectRawFilter,
  selectIsAllSelected,
  selectSorter,
};

export default comboListSelectors;
