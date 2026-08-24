import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { i18n } from 'src/i18n';
import actions from 'src/modules/sequence/list/sequenceListActions';
import selectors from 'src/modules/sequence/list/sequenceListSelectors';
import sequenceSelectors from 'src/modules/sequence/sequenceSelectors';
import destroyActions from 'src/modules/sequence/destroy/sequenceDestroyActions';
import destroySelectors from 'src/modules/sequence/destroy/sequenceDestroySelectors';
import ContentWrapper from 'src/view/layout/styles/ContentWrapper';
import PageTitle from 'src/view/shared/styles/PageTitle';
import Spinner from 'src/view/shared/Spinner';
import ConfirmModal from 'src/view/shared/modals/ConfirmModal';
import { Col, Container, Row } from 'react-bootstrap';

function formatCurrency(value) {
  const num = parseFloat(value) || 0;
  return num.toLocaleString(undefined, {
    minimumFractionDigits: num % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

function SequenceListPage(props) {
  const dispatch = useDispatch();
  const [recordIdToDestroy, setRecordIdToDestroy] = useState(null);

  const loading = useSelector(selectors.selectLoading);
  const rows = useSelector(selectors.selectRows);
  const hasRows = useSelector(selectors.selectHasRows);
  const destroyLoading = useSelector(destroySelectors.selectLoading);

  const hasPermissionToCreate = useSelector(
    sequenceSelectors.selectPermissionToCreate,
  );
  const hasPermissionToEdit = useSelector(
    sequenceSelectors.selectPermissionToEdit,
  );
  const hasPermissionToDestroy = useSelector(
    sequenceSelectors.selectPermissionToDestroy,
  );

  useEffect(() => {
    dispatch(actions.doFetch());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const doDestroy = (id) => {
    setRecordIdToDestroy(null);
    dispatch(destroyActions.doDestroy(id));
  };

  return (
    <>
      <ContentWrapper>
        <Container fluid={true}>
          <Row>
            <Col xs={9}>
              <PageTitle>
                {i18n('entities.sequence.list.title')}
              </PageTitle>
            </Col>
            <Col md="auto">
              {hasPermissionToCreate && (
                <Link to="/sequence/new" className="sequence-add-link">
                  <button className="btn btn-primary sequence-add-btn" type="button">
                    <i className="fas fa-plus" />
                    &nbsp;{i18n('entities.sequence.new.title')}
                  </button>
                </Link>
              )}
            </Col>
          </Row>
        </Container>

        {loading && <Spinner />}

        {!loading && !hasRows && (
          <div className="sequence-empty">
            <i className="fas fa-list-ol sequence-empty-icon" />
            <p>{i18n('table.noData')}</p>
          </div>
        )}

        {!loading && hasRows && (
          <div className="sequence-grid">
            {rows.map((row) => (
              <div className="sequence-card" key={row.id}>
                <div className="sequence-card-header">
                  <span className="sequence-card-title">{row.title}</span>
                  <div className="sequence-card-actions">
                    {hasPermissionToEdit && (
                      <Link
                        to={`/sequence/${row.id}/edit`}
                        className="sequence-card-action-btn"
                        title={i18n('common.edit')}
                      >
                        <i className="fas fa-pen" />
                      </Link>
                    )}
                    {hasPermissionToDestroy && (
                      <button
                        type="button"
                        className="sequence-card-action-btn danger"
                        title={i18n('common.destroy')}
                        disabled={destroyLoading}
                        onClick={() => setRecordIdToDestroy(row.id)}
                      >
                        <i className="fas fa-trash" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="sequence-card-body">
                  <div className="sequence-card-stat">
                    {i18n('entities.sequence.fields.tasks')}:{' '}
                    <strong>{row.taskCount}</strong>
                  </div>
                  <div className="sequence-card-stat">
                    {i18n('entities.sequence.fields.productValue')}:{' '}
                    <strong>
                      {formatCurrency(row.productValue)} USDT
                    </strong>
                  </div>
                </div>

                {row.comboBadges?.length > 0 && (
                  <div className="sequence-card-badges">
                    {row.comboBadges.map((badge) => (
                      <span className="sequence-combo-badge" key={badge.id}>
                        {formatCurrency(badge.amount)}$
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {recordIdToDestroy && (
          <ConfirmModal
            title={i18n('common.areYouSure')}
            onConfirm={() => doDestroy(recordIdToDestroy)}
            onClose={() => setRecordIdToDestroy(null)}
            okText={i18n('common.yes')}
            cancelText={i18n('common.no')}
          />
        )}

        <style>{`
          .sequence-add-btn {
            font-weight: 600;
          }

          .sequence-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            padding: 0 12px;
          }

          @media (max-width: 1100px) {
            .sequence-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }

          @media (max-width: 700px) {
            .sequence-grid {
              grid-template-columns: 1fr;
            }
          }

          .sequence-card {
            background: #fff;
            border-radius: 12px;
            padding: 18px 20px;
            box-shadow: 0 1px 4px rgba(15, 23, 42, 0.08);
            border: 1px solid #eef1f5;
          }

          .sequence-card-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 8px;
            margin-bottom: 12px;
          }

          .sequence-card-title {
            font-size: 15px;
            font-weight: 700;
            color: #1a202c;
            line-height: 1.3;
          }

          .sequence-card-actions {
            display: flex;
            gap: 6px;
            flex-shrink: 0;
          }

          .sequence-card-action-btn {
            width: 28px;
            height: 28px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
            background: #fff;
            color: #475569;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.15s ease;
          }

          .sequence-card-action-btn:hover {
            background: #f8fafc;
            color: #1a202c;
          }

          .sequence-card-action-btn.danger:hover {
            background: #fef2f2;
            color: #e53e3e;
            border-color: #fecaca;
          }

          .sequence-card-action-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .sequence-card-body {
            display: flex;
            flex-direction: column;
            gap: 4px;
            color: #64748b;
            font-size: 13px;
            margin-bottom: 10px;
          }

          .sequence-card-body strong {
            color: #1a202c;
          }

          .sequence-card-badges {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
          }

          .sequence-combo-badge {
            background: #e53e3e;
            color: #fff;
            font-size: 12px;
            font-weight: 700;
            padding: 3px 10px;
            border-radius: 6px;
          }

          .sequence-empty {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
            padding: 60px 20px;
            color: #6c757d;
          }

          .sequence-empty-icon {
            font-size: 48px;
            color: #adb5bd;
          }
        `}</style>
      </ContentWrapper>
    </>
  );
}

export default SequenceListPage;
