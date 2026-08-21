import React from 'react';
import Spinner from 'src/view/shared/Spinner';
import ViewWrapper from 'src/view/shared/styles/ViewWrapper';
import { i18n } from 'src/i18n';
import TextViewItem from 'src/view/shared/view/TextViewItem';

function DepositView(props) {
  const { record, loading } = props;

  if (loading || !record) {
    return <Spinner />;
  }

  return (
    <ViewWrapper>
      <TextViewItem
        label={i18n('entities.deposit.fields.user')}
        value={record.user?.fullName || record.user?.email}
      />

      <TextViewItem
        label={i18n('entities.deposit.fields.amount')}
        value={record.amount}
      />

      <TextViewItem
        label={i18n('entities.deposit.fields.currency')}
        value={record.currency}
      />

      <TextViewItem
        label={i18n('entities.deposit.fields.paymentMethod')}
        value={record.paymentMethod}
      />

      <TextViewItem
        label={i18n('entities.deposit.fields.protocol')}
        value={record.protocol}
      />

      <TextViewItem
        label={i18n('entities.deposit.fields.status')}
        value={
          record.status &&
          i18n(
            `entities.deposit.enumerators.status.${record.status}`,
          )
        }
      />
    </ViewWrapper>
  );
}

export default DepositView;
