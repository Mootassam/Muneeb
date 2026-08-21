import schemas from 'src/modules/shared/yup/yupImporterSchemas';
import { i18n } from 'src/i18n';
import withdrawEnumerators from 'src/modules/withdraw/withdrawEnumerators';

export default [
  {
    name: 'amount',
    label: i18n('entities.withdraw.fields.amount'),
    schema: schemas.decimal(
      i18n('entities.withdraw.fields.amount'),
      {
        "required": true
      },
    ),
  },
  {
    name: 'address',
    label: i18n('entities.withdraw.fields.address'),
    schema: schemas.string(
      i18n('entities.withdraw.fields.address'),
      {
        "required": true
      },
    ),
  },
  {
    name: 'status',
    label: i18n('entities.withdraw.fields.status'),
    schema: schemas.enumerator(
      i18n('entities.withdraw.fields.status'),
      {
        "options": withdrawEnumerators.status
      },
    ),
  },
];
