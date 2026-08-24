import React from 'react';
import Spinner from 'src/view/shared/Spinner';
import ViewWrapper from 'src/view/shared/styles/ViewWrapper';
import { i18n } from 'src/i18n';
import TextViewItem from 'src/view/shared/view/TextViewItem';

function CouponsView(props) {
  const { record, loading } = props;

  if (loading || !record) {
    return <Spinner />;
  }

  return (
    <ViewWrapper>
      <TextViewItem
        label={i18n('entities.vip.fields.title')}
        value={record.title}
      />

      <TextViewItem
        label={i18n('entities.vip.fields.dailyorder')}
        value={record.dailyorder}
      />

      <TextViewItem
        label={i18n('entities.vip.fields.levelLimit')}
        value={
          record.min !== undefined && record.max !== undefined
            ? `${record.min} - ${record.max}`
            : null
        }
      />

      <TextViewItem
        label={i18n('entities.vip.fields.commissionrate')}
        value={
          record.comisionrate !== undefined
            ? `${record.comisionrate}%`
            : null
        }
      />
    </ViewWrapper>
  );
}

export default CouponsView;
