import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { i18n } from 'src/i18n';
import comboSelectors from 'src/modules/combo/comboSelectors';
import destroyActions from 'src/modules/combo/destroy/comboDestroyActions';
import destroySelectors from 'src/modules/combo/destroy/comboDestroySelectors';
import actions from 'src/modules/combo/list/comboListActions';
import selectors from 'src/modules/combo/list/comboListSelectors';
import ConfirmModal from 'src/view/shared/modals/ConfirmModal';
import Spinner from 'src/view/shared/Spinner';
import TableWrapper from 'src/view/shared/styles/TableWrapper';
import Pagination from 'src/view/shared/table/Pagination';
import { getHistory } from 'src/modules/store';

function ComboListTable(props) {
  const [recordIdToDestroy, setRecordIdToDestroy] = useState(null);
  const dispatch = useDispatch();

  const findLoading = useSelector(selectors.selectLoading);
  const destroyLoading = useSelector(destroySelectors.selectLoading);
  const loading = findLoading || destroyLoading;
  const rows = useSelector(selectors.selectRows);
  const pagination = useSelector(selectors.selectPagination);
  const selectedKeys = useSelector(selectors.selectSelectedKeys);
  const hasRows = useSelector(selectors.selectHasRows);
  const isAllSelected = useSelector(selectors.selectIsAllSelected);

  const hasPermissionToEdit = useSelector(
    comboSelectors.selectPermissionToEdit,
  );
  const hasPermissionToDestroy = useSelector(
    comboSelectors.selectPermissionToDestroy,
  );

  const doDestroy = (id) => {
    setRecordIdToDestroy(null);
    dispatch(destroyActions.doDestroy(id));
  };

  const doChangePagination = (pagination) => {
    dispatch(actions.doChangePagination(pagination));
  };

  const doToggleAllSelected = () => {
    dispatch(actions.doToggleAllSelected());
  };

  const doToggleOneSelected = (id) => {
    dispatch(actions.doToggleOneSelected(id));
  };

  return (
    <div className="combo-list-container">
      <TableWrapper>
        <div className="table-responsive">
          <table className="combo-list-table">
            <thead className="table-header">
              <tr>
                <th className="checkbox-column">
                  {hasRows && (
                    <div className="checkbox-wrapper">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        id="combo-table-header-checkbox"
                        checked={Boolean(isAllSelected)}
                        onChange={() => doToggleAllSelected()}
                      />
                    </div>
                  )}
                </th>
                <th className="image-header">
                  {i18n('entities.combo.fields.image')}
                </th>
                <th>{i18n('entities.combo.fields.title')}</th>
                <th className="text-right">
                  {i18n('entities.combo.fields.amount')}
                </th>
                <th className="combo-table-actions-header">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {loading && (
                <tr>
                  <td colSpan={5} className="loading-cell">
                    <div className="loading-container">
                      <Spinner />
                      <span className="loading-text">Loading data...</span>
                    </div>
                  </td>
                </tr>
              )}
              {!loading && !hasRows && (
                <tr>
                  <td colSpan={5} className="no-data-cell">
                    <div className="no-data-content">
                      <i className="fas fa-database no-data-icon"></i>
                      <p>{i18n('table.noData')}</p>
                    </div>
                  </td>
                </tr>
              )}
              {!loading &&
                rows.map((row) => (
                  <tr key={row.id} className="table-row">
                    <td className="checkbox-column">
                      <div className="checkbox-wrapper">
                        <input
                          type="checkbox"
                          className="form-checkbox"
                          id={`combo-table-row-checkbox-${row.id}`}
                          checked={selectedKeys.includes(row.id)}
                          onChange={() => doToggleOneSelected(row.id)}
                        />
                      </div>
                    </td>
                    <td className="table-cell image-column">
                      <img
                        className="combo-thumb"
                        src={
                          row.image ||
                          row.photo?.[0]?.downloadUrl ||
                          'https://via.placeholder.com/48'
                        }
                        alt={row.title}
                        loading="lazy"
                      />
                    </td>
                    <td className="table-cell">
                      <span className="combo-title">{row.title}</span>
                    </td>
                    <td className="table-cell text-right">
                      <span className="combo-amount">{row.amount}</span>
                      <span className="combo-amount-currency">USDT</span>
                    </td>
                    <td className="combo-table-actions">
                      <div className="combo-table-actions-content">
                        {hasPermissionToEdit && (
                          <button
                            className="combo-table-action-btn primary"
                            onClick={() => getHistory().push(`/combo/${row.id}/edit`)}
                          >
                            <i className="fas fa-edit combo-table-action-icon" />
                            Edit
                          </button>
                        )}
                        {hasPermissionToDestroy && (
                          <button
                            className="combo-table-action-btn danger"
                            onClick={() => setRecordIdToDestroy(row.id)}
                          >
                            <i className="fas fa-trash combo-table-action-icon" />
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="pagination-container">
          <Pagination
            onChange={doChangePagination}
            disabled={loading}
            pagination={pagination}
          />
        </div>
      </TableWrapper>

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
        .combo-list-container {
          width: 100%;
        }

        .text-right {
          text-align: right;
        }

        .checkbox-column {
          width: 40px;
          padding: 16px 8px !important;
        }

        .checkbox-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .form-checkbox {
          width: 16px;
          height: 16px;
          cursor: pointer;
        }

        .table-header {
          background: #f8fafc;
          border-bottom: 2px solid #e2e8f0;
        }

        .table-header th {
          padding: 16px 12px;
          font-weight: 600;
          color: #475569;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 2px solid #e2e8f0;
        }

        .table-body {
          background: white;
        }

        .table-row {
          transition: background-color 0.2s ease;
          border-bottom: 1px solid #f1f5f9;
        }

        .table-row:hover {
          background: #f8fafc;
        }

        .table-cell {
          padding: 16px 12px;
          font-size: 14px;
          color: #475569;
          vertical-align: middle;
        }

        .image-header {
          width: 68px;
        }

        .image-column {
          width: 68px;
        }

        .combo-thumb {
          width: 44px;
          height: 44px;
          border-radius: 8px;
          object-fit: cover;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
        }

        .combo-title {
          font-weight: 500;
          color: #334155;
        }

        .combo-amount {
          font-weight: 700;
          color: #2d3748;
          font-size: 16px;
        }

        .combo-amount-currency {
          color: #718096;
          font-size: 12px;
          margin-left: 4px;
        }

        .loading-cell {
          text-align: center;
          padding: 40px !important;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .loading-text {
          color: #6c757d;
          font-size: 14px;
        }

        .no-data-cell {
          text-align: center;
          padding: 60px 20px !important;
        }

        .no-data-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          color: #6c757d;
        }

        .no-data-icon {
          font-size: 48px;
          color: #adb5bd;
        }

        .no-data-content p {
          margin: 0;
          font-size: 14px;
        }

        .combo-table-actions-header {
          width: 160px;
        }

        .combo-table-actions {
          white-space: nowrap;
        }

        .combo-table-actions-content {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px;
        }

        .combo-table-action-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 6px 10px;
          border: none;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .combo-table-action-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }

        .combo-table-action-btn.primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .combo-table-action-btn.danger {
          background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
          color: white;
        }

        .combo-table-action-icon {
          margin-right: 4px;
          font-size: 10px;
        }

        .pagination-container {
          margin-top: 20px;
          display: flex;
          justify-content: center;
        }
      `}</style>
    </div>
  );
}

export default ComboListTable;
