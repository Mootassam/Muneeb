import React from 'react';
import Spinner from 'src/view/shared/Spinner';
import TextViewItem from 'src/view/shared/view/TextViewItem';
import ViewWrapper from 'src/view/shared/styles/ViewWrapper';
import { i18n } from 'src/i18n';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import VipViewItem from 'src/view/vip/view/VipViewItem';

function WalletViewItem(props) {
  const { user, loading } = props;

  if (loading || !user) {
    return <Spinner />;
  }

  return (
    <ViewWrapper>
      <Row
        style={{
          paddingBottom: '10px',
        }}
      >
        <Col sm={4}>
          <TextViewItem
            label={i18n('Username Wallet')}
            value={user.usernamewallet}
          />
        </Col>

        <Col sm={4}>
          <TextViewItem
            label={i18n('Wallet Name')}
            value={user.walletname}
          />
        </Col>

        <Col sm={4}>
          <VipViewItem
            label={i18n('VIP')}
            value={user.vip}
          />
        </Col>
      </Row>
      <Row
        style={{
          paddingBottom: '10px',
        }}
      >
        <Col sm={6}>
          <TextViewItem
            label={i18n('Wallet Address')}
            value={user.trc20}
          />
        </Col>
        <Col sm={6}>
          <TextViewItem
            label={i18n('Balance')}
            value={user.balance}
          />
        </Col>
      </Row>
    </ViewWrapper>
  );
}

export default WalletViewItem;
