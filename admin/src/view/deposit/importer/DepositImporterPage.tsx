import React from 'react';
import { i18n } from 'src/i18n';
import actions from 'src/modules/deposit/importer/depositImporterActions';
import fields from 'src/modules/deposit/importer/depositImporterFields';
import selectors from 'src/modules/deposit/importer/depositImporterSelectors';
import ContentWrapper from 'src/view/layout/styles/ContentWrapper';
import Breadcrumb from 'src/view/shared/Breadcrumb';
import importerHoc from 'src/view/shared/importer/Importer';
import PageTitle from 'src/view/shared/styles/PageTitle';

function DepositImporterPage() {
  const Importer = importerHoc(
    selectors,
    actions,
    fields,
    i18n('entities.deposit.importer.hint'),
  );

  return (
    <>
      {/* <Breadcrumb
        items={[
          [i18n('dashboard.menu'), '/'],
          [i18n('entities.deposit.menu'), '/deposit'],
          [i18n('entities.deposit.importer.title')],
        ]}
      /> */}

      <ContentWrapper>
        <PageTitle>
          {i18n('entities.deposit.importer.title')}
        </PageTitle>

        <Importer />
      </ContentWrapper>
    </>
  );
}

export default DepositImporterPage;
