import { i18n } from 'src/i18n';
import exporterRenders from 'src/modules/shared/exporter/exporterRenders';

export default [
  {
    name: 'id',
    label: i18n('entities.deposit.fields.id'),
  },
  {
    name: 'amount',
    label: i18n('entities.deposit.fields.amount'),
    render: exporterRenders.decimal(),
  },
  {
    name: 'currency',
    label: i18n('entities.deposit.fields.currency'),
  },
  {
    name: 'paymentMethod',
    label: i18n('entities.deposit.fields.paymentMethod'),
  },
  {
    name: 'protocol',
    label: i18n('entities.deposit.fields.protocol'),
  },
  {
    name: 'status',
    label: i18n('entities.deposit.fields.status'),
  },
  {
    name: 'createdAt',
    label: i18n('entities.deposit.fields.createdAt'),
    render: exporterRenders.datetime(),
  },
  {
    name: 'updatedAt',
    label: i18n('entities.deposit.fields.updatedAt'),
    render: exporterRenders.datetime(),
  },
];
