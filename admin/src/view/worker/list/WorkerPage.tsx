import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { i18n } from 'src/i18n';
import ContentWrapper from 'src/view/layout/styles/ContentWrapper';
import PageTitle from 'src/view/shared/styles/PageTitle';
import WorkerTable from 'src/view/worker/list/WorkerTable';
import workerListActions from 'src/modules/worker/list/workerListActions';

function WorkerPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(workerListActions.doFetch());
  }, [dispatch]);

  return (
    <ContentWrapper>
      <PageTitle>{i18n('dashboard.worker')}</PageTitle>
      <WorkerTable />
    </ContentWrapper>
  );
}

export default WorkerPage;
