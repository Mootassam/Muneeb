import schemas from 'src/modules/shared/yup/yupImporterSchemas';
import { i18n } from 'src/i18n';
import depositEnumerators from 'src/modules/deposit/depositEnumerators';

export default [
  {
    name: 'amount',
    label: i18n('entities.deposit.fields.amount'),
    schema: schemas.decimal(
      i18n('entities.deposit.fields.amount'),
      {
        "required": true
      },
    ),
  },
  {
    name: 'currency',
    label: i18n('entities.deposit.fields.currency'),
    schema: schemas.enumerator(
      i18n('entities.deposit.fields.currency'),
      {
        "options": depositEnumerators.currency
      },
    ),
  },
  {
    name: 'paymentMethod',
    label: i18n('entities.deposit.fields.paymentMethod'),
    schema: schemas.enumerator(
      i18n('entities.deposit.fields.paymentMethod'),
      {
        "options": depositEnumerators.paymentMethod
      },
    ),
  },
  {
    name: 'protocol',
    label: i18n('entities.deposit.fields.protocol'),
    schema: schemas.enumerator(
      i18n('entities.deposit.fields.protocol'),
      {
        "options": depositEnumerators.protocol
      },
    ),
  },
  {
    name: 'status',
    label: i18n('entities.deposit.fields.status'),
    schema: schemas.enumerator(
      i18n('entities.deposit.fields.status'),
      {
        "options": depositEnumerators.status
      },
    ),
  },
];
