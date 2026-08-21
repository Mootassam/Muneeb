import React, { useState, useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { i18n } from 'src/i18n';
import ContentWrapper from 'src/view/layout/styles/ContentWrapper';
import Breadcrumb from 'src/view/shared/Breadcrumb';
import PageTitle from 'src/view/shared/styles/PageTitle';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import ButtonIcon from 'src/view/shared/ButtonIcon';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'src/modules/company/form/companyFormActions';
import listactions from 'src/modules/company/list/companyListActions';
import selectors from 'src/modules/company/list/companyListSelectors';
import Spinner from 'src/view/shared/Spinner';

function CompanyDetails() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [cooperationEditorState, setCooperationEditorState] = useState(EditorState.createEmpty());
  const record = useSelector(selectors.selectRows);
  const loading = useSelector(selectors.selectLoading);
  const [recordContent, setRecordContent] = useState('');
  const [cooperationContent, setCooperationContent] = useState('');

  const dispatch = useDispatch();

  const doSubmit = () => {
    const htmlContent = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    const cooperationHtml = draftToHtml(convertToRaw(cooperationEditorState.getCurrentContent()));
    const values = {
      companydetails: htmlContent,
      cooperation: cooperationHtml,
    };
    dispatch(actions.doCreate(values));
  };

  const doFetch = () => {
    dispatch(listactions.doFetch());
  };

  useEffect(() => {
    if (record && record[0]?.companydetails) {
      setRecordContent(record[0].companydetails);
    }
    if (record && record[0]?.cooperation) {
      setCooperationContent(record[0].cooperation);
    }
  }, [record]);

  useEffect(() => {
    doFetch();

    if (recordContent) {
      const contentBlock = htmlToDraft(recordContent);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const newEditorState = EditorState.createWithContent(contentState);
        setEditorState(newEditorState);
      }
    }
  }, [recordContent]);

  useEffect(() => {
    if (cooperationContent) {
      const contentBlock = htmlToDraft(cooperationContent);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const newEditorState = EditorState.createWithContent(contentState);
        setCooperationEditorState(newEditorState);
      }
    }
  }, [cooperationContent]);

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const onCooperationEditorStateChange = (newEditorState) => {
    setCooperationEditorState(newEditorState);
  };

  return (
    <>
      {/* <Breadcrumb
        items={[
          [i18n('dashboard.menu'), '/'],
          [i18n('company.menu'), '/company'],
          [i18n('company.title')],
        ]}
      /> */}

      <ContentWrapper>
        {loading && <Spinner />}
        {!loading && record && (
          <Container fluid={true}>
            <Row>
              <Col xs={9}>
                <PageTitle>{i18n('company.title')}</PageTitle>
              </Col>
              <Col md="auto">
                <button
                  className="btn btn-primary"
                  type="button"
                  style={{ width: 250 }}
                  onClick={doSubmit}
                >
                  <ButtonIcon iconClass="far fa-save" /> &nbsp;
                  {i18n('common.save')}
                </button>
              </Col>
            </Row>

            <Editor
              editorState={editorState}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              onEditorStateChange={onEditorStateChange}
            />

            <h5 style={{ marginTop: 30, marginBottom: 10 }}>
              {i18n('company.cooperationTitle')}
            </h5>

            <Editor
              editorState={cooperationEditorState}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              onEditorStateChange={onCooperationEditorStateChange}
            />
          </Container>
        )}
      </ContentWrapper>
    </>
  );
}

export default CompanyDetails;
