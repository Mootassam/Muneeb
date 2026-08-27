import { createSelector } from 'reselect';

const selectRaw = (state) => state.combo.form;

const selectInitLoading = createSelector(
  [selectRaw],
  (raw) => Boolean(raw.initLoading),
);

const selectSaveLoading = createSelector(
  [selectRaw],
  (raw) => Boolean(raw.saveLoading),
);

const selectRecord = createSelector([selectRaw], (raw) => raw.record);

const comboFormSelectors = {
  selectInitLoading,
  selectSaveLoading,
  selectRecord,
};

export default comboFormSelectors;
