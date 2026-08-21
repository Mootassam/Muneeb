import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { i18n } from 'src/i18n';
import actions from 'src/modules/deposit/view/depositViewActions';
import selectors from 'src/modules/deposit/view/depositViewSelectors';
import DepositView from 'src/view/deposit/view/DepositView';
import DepositViewToolbar from 'src/view/deposit/view/DepositViewToolbar';
import ContentWrapper from 'src/view/layout/styles/ContentWrapper';
import Breadcrumb from 'src/view/shared/Breadcrumb';
import PageTitle from 'src/view/shared/styles/PageTitle';

function DepositViewPage() {
  const dispatch = useDispatch();
  const match = useRouteMatch();

  const loading = useSelector(selectors.selectLoading);
  const record = useSelector(selectors.selectRecord);

  useEffect(() => {
    dispatch(actions.doFind(match.params.id));
  }, [dispatch, match.params.id]);

  return (
    <>
      {/* <Breadcrumb
        items={[
          [i18n('dashboard.menu'), '/'],
          [i18n('entities.deposit.menu'), '/product'],
          [i18n('entities.deposit.view.title')],
        ]}
      /> */}

      <ContentWrapper>
        <PageTitle>
          {i18n('entities.deposit.view.title')}
        </PageTitle>

        <DepositViewToolbar match={match} />

        <DepositView loading={loading} record={record} />
      </ContentWrapper>
    </>
  );
}

export default DepositViewPage;
