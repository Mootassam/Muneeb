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
        label={i18n('entities.product.fields.title')}
        value={record.title}
      />

      <TextViewItem
        label={i18n('entities.product.fields.amount')}
        value={record.amount}
      />

      <TextViewItem
        label={i18n('entities.product.fields.active')}
        value={
          record.active === false
            ? i18n('entities.product.enumerators.status.disable')
            : i18n('entities.product.enumerators.status.enable')
        }
      />

      <TextViewItem
        label={i18n('entities.product.fields.image')}
        value={record.image}
      />
    </ViewWrapper>
  );
}

export default CouponsView;
