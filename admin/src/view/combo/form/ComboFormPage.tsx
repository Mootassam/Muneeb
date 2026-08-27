import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { i18n } from 'src/i18n';
import actions from 'src/modules/combo/form/comboFormActions';
import selectors from 'src/modules/combo/form/comboFormSelectors';
import { getHistory } from 'src/modules/store';
import ComboForm from 'src/view/combo/form/ComboForm';
import ContentWrapper from 'src/view/layout/styles/ContentWrapper';
import Spinner from 'src/view/shared/Spinner';
import PageTitle from 'src/view/shared/styles/PageTitle';

function ComboFormPage(props) {
  const [dispatched, setDispatched] = useState(false);
  const dispatch = useDispatch();
  const match = useRouteMatch();

  const initLoading = useSelector(selectors.selectInitLoading);
  const saveLoading = useSelector(selectors.selectSaveLoading);
  const record = useSelector(selectors.selectRecord);

  const isEditing = Boolean(match.params.id);
  const title = isEditing
    ? i18n('entities.combo.edit.title')
    : i18n('entities.combo.new.title');

  useEffect(() => {
    dispatch(actions.doInit(match.params.id));
    setDispatched(true);
  }, [dispatch, match.params.id]);

  const doSubmit = (id, data) => {
    if (isEditing) {
      dispatch(actions.doUpdate(id, data));
    } else {
      dispatch(actions.doCreate(data));
    }
  };

  return (
    <>
      <ContentWrapper>
        <div className="combo-form-header">
          <PageTitle>{title}</PageTitle>
          <button
            type="button"
            className="btn btn-light"
            onClick={() => getHistory().push('/combo')}
          >
            <i className="fas fa-arrow-left" />
            &nbsp;{i18n('common.back')}
          </button>
        </div>

        {initLoading && <Spinner />}

        {dispatched && !initLoading && (
          <ComboForm
            saveLoading={saveLoading}
            record={record}
            isEditing={isEditing}
            onSubmit={doSubmit}
          />
        )}

        <style>{`
          .combo-form-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 16px;
          }
        `}</style>
      </ContentWrapper>
    </>
  );
}

export default ComboFormPage;
