import { createSelector } from 'reselect';

const selectRaw = (state) => state.combo.destroy;

const selectLoading = createSelector([selectRaw], (raw) =>
  Boolean(raw.loading),
);

const comboDestroySelectors = {
  selectLoading,
};

export default comboDestroySelectors;
