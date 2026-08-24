import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { i18n } from 'src/i18n';
import actions from 'src/modules/combo/list/comboListActions';
import ComboListTable from 'src/view/combo/list/ComboListTable';
import ComboListToolbar from 'src/view/combo/list/ComboListToolbar';
import ContentWrapper from 'src/view/layout/styles/ContentWrapper';
import PageTitle from 'src/view/shared/styles/PageTitle';
import { Col, Container, Row } from 'react-bootstrap';

function ComboListPage(props) {
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(actions.doFetch());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const doSearch = (value) => {
    setSearch(value);
    const filter = value ? { title: value } : {};
    dispatch(actions.doFetch(filter, filter));
  };

  return (
    <>
      <ContentWrapper>
        <Container fluid={true}>
          <Row>
            <Col xs={9}>
              <PageTitle>{i18n('entities.combo.list.title')}</PageTitle>
            </Col>
            <Col md="auto">
              <ComboListToolbar />
            </Col>
          </Row>
        </Container>

        <div className="combo-list-search">
          <i className="fas fa-search combo-list-search-icon" />
          <input
            type="text"
            className="combo-list-search-input"
            placeholder={i18n('entities.sequence.fields.searchByName')}
            value={search}
            onChange={(event) => doSearch(event.target.value)}
          />
        </div>

        <ComboListTable />

        <style>{`
          .combo-list-search {
            position: relative;
            max-width: 320px;
            margin: 0 0 16px 0;
          }

          .combo-list-search-icon {
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: #a0aec0;
            font-size: 13px;
          }

          .combo-list-search-input {
            width: 100%;
            padding: 9px 12px 9px 34px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            font-size: 14px;
          }

          .combo-list-search-input:focus {
            outline: none;
            border-color: #7c6cf0;
            box-shadow: 0 0 0 3px rgba(124, 108, 240, 0.15);
          }
        `}</style>
      </ContentWrapper>
    </>
  );
}

export default ComboListPage;
