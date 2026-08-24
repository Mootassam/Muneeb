import { createSelector } from 'reselect';

const selectRaw = (state) => state.sequence.form;

const selectInitLoading = createSelector(
  [selectRaw],
  (raw) => Boolean(raw.initLoading),
);

const selectSaveLoading = createSelector(
  [selectRaw],
  (raw) => Boolean(raw.saveLoading),
);

const selectRecord = createSelector([selectRaw], (raw) => raw.record);

const sequenceFormSelectors = {
  selectInitLoading,
  selectSaveLoading,
  selectRecord,
};

export default sequenceFormSelectors;
