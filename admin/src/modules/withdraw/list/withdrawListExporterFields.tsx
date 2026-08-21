import { i18n } from 'src/i18n';
import exporterRenders from 'src/modules/shared/exporter/exporterRenders';

export default [
  {
    name: 'id',
    label: i18n('entities.withdraw.fields.id'),
  },
  {
    name: 'amount',
    label: i18n('entities.withdraw.fields.amount'),
    render: exporterRenders.decimal(),
  },
  {
    name: 'currency',
    label: i18n('entities.withdraw.fields.currency'),
  },
  {
    name: 'protocol',
    label: i18n('entities.withdraw.fields.protocol'),
  },
  {
    name: 'address',
    label: i18n('entities.withdraw.fields.address'),
  },
  {
    name: 'status',
    label: i18n('entities.withdraw.fields.status'),
  },
  {
    name: 'createdAt',
    label: i18n('entities.withdraw.fields.createdAt'),
    render: exporterRenders.datetime(),
  },
  {
    name: 'updatedAt',
    label: i18n('entities.withdraw.fields.updatedAt'),
    render: exporterRenders.datetime(),
  },
];
