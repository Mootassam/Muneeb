import React from 'react';
import { i18n } from 'src/i18n';
import actions from 'src/modules/withdraw/importer/withdrawImporterActions';
import fields from 'src/modules/withdraw/importer/withdrawImporterFields';
import selectors from 'src/modules/withdraw/importer/withdrawImporterSelectors';
import ContentWrapper from 'src/view/layout/styles/ContentWrapper';
import Breadcrumb from 'src/view/shared/Breadcrumb';
import importerHoc from 'src/view/shared/importer/Importer';
import PageTitle from 'src/view/shared/styles/PageTitle';

function WithdrawImporterPage() {
  const Importer = importerHoc(
    selectors,
    actions,
    fields,
    i18n('entities.withdraw.importer.hint'),
  );

  return (
    <>
      {/* <Breadcrumb
        items={[
          [i18n('dashboard.menu'), '/'],
          [i18n('entities.withdraw.menu'), '/withdraw'],
          [i18n('entities.withdraw.importer.title')],
        ]}
      /> */}

      <ContentWrapper>
        <PageTitle>
          {i18n('entities.withdraw.importer.title')}
        </PageTitle>

        <Importer />
      </ContentWrapper>
    </>
  );
}

export default WithdrawImporterPage;
