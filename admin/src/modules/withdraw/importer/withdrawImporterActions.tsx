import importerActions from 'src/modules/shared/importer/importerActions';
import selectors from 'src/modules/withdraw/importer/withdrawImporterSelectors';
import WithdrawService from 'src/modules/withdraw/withdrawService';
import fields from 'src/modules/withdraw/importer/withdrawImporterFields';
import { i18n } from 'src/i18n';

const withdrawImporterActions = importerActions(
  'WITHDRAW_IMPORTER',
  selectors,
  WithdrawService.import,
  fields,
  i18n('entities.withdraw.importer.fileName'),
);

export default withdrawImporterActions;