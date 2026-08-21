import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { i18n } from 'src/i18n';
import actions from 'src/modules/withdraw/view/withdrawViewActions';
import selectors from 'src/modules/withdraw/view/withdrawViewSelectors';
import WithdrawView from 'src/view/withdraw/view/WithdrawView';
import WithdrawViewToolbar from 'src/view/withdraw/view/WithdrawViewToolbar';
import ContentWrapper from 'src/view/layout/styles/ContentWrapper';
import Breadcrumb from 'src/view/shared/Breadcrumb';
import PageTitle from 'src/view/shared/styles/PageTitle';

function WithdrawViewPage() {
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
          [i18n('entities.withdraw.menu'), '/product'],
          [i18n('entities.withdraw.view.title')],
        ]}
      /> */}

      <ContentWrapper>
        <PageTitle>
          {i18n('entities.withdraw.view.title')}
        </PageTitle>

        <WithdrawViewToolbar match={match} />

        <WithdrawView loading={loading} record={record} />
      </ContentWrapper>
    </>
  );
}

export default WithdrawViewPage;
