import React from 'react';
import Spinner from 'src/view/shared/Spinner';
import ViewWrapper from 'src/view/shared/styles/ViewWrapper';
import { i18n } from 'src/i18n';
import TextViewItem from 'src/view/shared/view/TextViewItem';

function WithdrawView(props) {
  const { record, loading } = props;

  if (loading || !record) {
    return <Spinner />;
  }

  return (
    <ViewWrapper>
      <TextViewItem
        label={i18n('entities.withdraw.fields.user')}
        value={record.user?.fullName || record.user?.email}
      />

      <TextViewItem
        label={i18n('entities.withdraw.fields.amount')}
        value={record.amount}
      />

      <TextViewItem
        label={i18n('entities.withdraw.fields.currency')}
        value={record.currency}
      />

      <TextViewItem
        label={i18n('entities.withdraw.fields.protocol')}
        value={record.protocol}
      />

      <TextViewItem
        label={i18n('entities.withdraw.fields.address')}
        value={record.address}
      />

      <TextViewItem
        label={i18n('entities.withdraw.fields.status')}
        value={
          record.status &&
          i18n(
            `entities.withdraw.enumerators.status.${record.status}`,
          )
        }
      />
    </ViewWrapper>
  );
}

export default WithdrawView;
