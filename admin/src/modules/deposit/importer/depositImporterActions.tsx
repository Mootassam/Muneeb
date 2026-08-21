import importerActions from 'src/modules/shared/importer/importerActions';
import selectors from 'src/modules/deposit/importer/depositImporterSelectors';
import DepositService from 'src/modules/deposit/depositService';
import fields from 'src/modules/deposit/importer/depositImporterFields';
import { i18n } from 'src/i18n';

const depositImporterActions = importerActions(
  'DEPOSIT_IMPORTER',
  selectors,
  DepositService.import,
  fields,
  i18n('entities.deposit.importer.fileName'),
);

export default depositImporterActions;