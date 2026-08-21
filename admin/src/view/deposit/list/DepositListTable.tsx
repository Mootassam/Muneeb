import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { i18n } from 'src/i18n';
import depositSelectors from 'src/modules/deposit/depositSelectors';
import destroyActions from 'src/modules/deposit/destroy/depositDestroyActions';
import destroySelectors from 'src/modules/deposit/destroy/depositDestroySelectors';
import actions from 'src/modules/deposit/list/depositListActions';
import selectors from 'src/modules/deposit/list/depositListSelectors';
import ConfirmModal from 'src/view/shared/modals/ConfirmModal';
import Spinner from 'src/view/shared/Spinner';
import TableWrapper from 'src/view/shared/styles/TableWrapper';
import Pagination from 'src/view/shared/table/Pagination';
import actionsForm from 'src/modules/deposit/form/depositFormActions';

function DepositListTable(props) {
  const [recordIdToDestroy, setRecordIdToDestroy] = useState(null);
  const dispatch = useDispatch();

  const findLoading = useSelector(selectors.selectLoading);
  const destroyLoading = useSelector(destroySelectors.selectLoading);
  const loading = findLoading || destroyLoading;
  const rows = useSelector(selectors.selectRows);
  const pagination = useSelector(selectors.selectPagination);
  const hasRows = useSelector(selectors.selectHasRows);
  const sorter = useSelector(selectors.selectSorter);

  const hasPermissionToEdit = useSelector(
    depositSelectors.selectPermissionToEdit,
  );
  const hasPermissionToDestroy = useSelector(
    depositSelectors.selectPermissionToDestroy,
  );

  const doDestroy = (id) => {
    setRecordIdToDestroy(null);
    dispatch(destroyActions.doDestroy(id));
  };

  const doChangeSort = (field) => {
    const order =
      sorter.field === field && sorter.order === 'ascend'
        ? 'descend'
        : 'ascend';

    dispatch(
      actions.doChangeSort({
        field,
        order,
      }),
    );
  };

  const doChangePagination = (pagination) => {
    dispatch(actions.doChangePagination(pagination));
  };

  const handleStatusChange = (id, newStatus) => {
    let data = {
      status: newStatus,
      id: id
    };
    dispatch(actionsForm.doUpdateStatus(data));
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'success':
        return 'status-success';
      case 'pending':
        return 'status-pending';
      case 'canceled':
        return 'status-canceled';
      default:
        return 'status-unknown';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return 'fas fa-check-circle';
      case 'pending':
        return 'fas fa-clock';
      case 'canceled':
        return 'fas fa-times-circle';
      default:
        return 'fas fa-question-circle';
    }
  };

  return (
    <div className="deposit-list-container">
      <TableWrapper>
        <div className="table-responsive">
          <table className="deposit-list-table">
            <thead className="table-header">
              <tr>
                <th
                  className="sortable-header"
                  onClick={() => doChangeSort('user')}
                >
                  {i18n('entities.deposit.fields.user')}
                  {sorter.field === 'user' && (
                    <span className="sort-icon">
                      {sorter.order === 'ascend' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th className="sortable-header">
                  {i18n('entities.deposit.fields.paymentMethod')}
                </th>
                <th
                  className="sortable-header text-right"
                  onClick={() => doChangeSort('amount')}
                >
                  {i18n('entities.deposit.fields.amount')}
                  {sorter.field === 'amount' && (
                    <span className="sort-icon">
                      {sorter.order === 'ascend' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th
                  className="sortable-header"
                  onClick={() => doChangeSort('status')}
                >
                  {i18n('entities.deposit.fields.status')}
                  {sorter.field === 'status' && (
                    <span className="sort-icon">
                      {sorter.order === 'ascend' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th
                  className="sortable-header"
                  onClick={() => doChangeSort('createdAt')}
                >
                  Date
                  {sorter.field === 'createdAt' && (
                    <span className="sort-icon">
                      {sorter.order === 'ascend' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th className="actions-header deposit-table-actions-header">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="table-body">
              {loading && (
                <tr>
                  <td colSpan={6} className="loading-cell">
                    <div className="loading-container">
                      <Spinner />
                      <span className="loading-text">
                        Loading data...
                      </span>
                    </div>
                  </td>
                </tr>
              )}
              {!loading && !hasRows && (
                <tr>
                  <td colSpan={6} className="no-data-cell">
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
                    <td className="table-cell">
                      <div className="deposit-user-cell">
                        {row.user ? (
                          <div className="deposit-user-info">
                            <div className="deposit-user-name">
                              {row.user.fullName || row.user.email}
                            </div>
                            {row.user.email && (
                              <div className="deposit-user-email">{row.user.email}</div>
                            )}
                          </div>
                        ) : (
                          <span className="no-user">No user</span>
                        )}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="deposit-method-badge">
                        <i className="fas fa-arrow-down deposit-method-icon"></i>
                        <span className="deposit-method-text">
                          {row.paymentMethod}
                        </span>
                      </div>
                      {row.protocol && (
                        <div className="deposit-protocol">{row.protocol}</div>
                      )}
                    </td>
                    <td className="table-cell text-right">
                      <div className="deposit-amount">
                        <span className="amount-symbol">+</span>
                        <span className="amount-value">${row.amount}</span>
                        {row.currency && (
                          <span className="amount-currency">{row.currency}</span>
                        )}
                      </div>
                    </td>
                    <td className="table-cell">
                      {row.status === 'pending' ? (
                        <div className="deposit-status-buttons">
                          <button
                            className="status-btn success"
                            onClick={() => handleStatusChange(row.id, 'success')}
                          >
                            <i className="fas fa-check status-btn-icon"></i>
                            Accept
                          </button>
                          <button
                            className="status-btn danger"
                            onClick={() => handleStatusChange(row.id, 'canceled')}
                          >
                            <i className="fas fa-times status-btn-icon"></i>
                            Reject
                          </button>
                        </div>
                      ) : (
                        <div className={`status-badge ${getStatusClass(row.status)}`}>
                          <i className={`status-icon ${getStatusIcon(row.status)}`}></i>
                          <span className="status-text">
                            {row.status === 'success' ? 'Success' :
                             row.status === 'canceled' ? 'Canceled' :
                             row.status}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="table-cell">
                      <div className="deposit-date">
                        <div className="deposit-date-day">
                          {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '-'}
                        </div>
                        <div className="deposit-date-time">
                          {row.createdAt ? new Date(row.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </div>
                      </div>
                    </td>
                    <td className="deposit-table-actions">
                      <div className="deposit-table-actions-content">
                        <Link
                          className="deposit-table-action-btn info"
                          to={`/deposit/${row.id}`}
                        >
                          <i className="fas fa-eye deposit-table-action-icon" />
                          View
                        </Link>
                        {hasPermissionToEdit && (
                          <Link
                            className="deposit-table-action-btn primary"
                            to={`/deposit/${row.id}/edit`}
                          >
                            <i className="fas fa-edit deposit-table-action-icon" />
                            Edit
                          </Link>
                        )}
                        {hasPermissionToDestroy && (
                          <button
                            className="deposit-table-action-btn danger"
                            onClick={() => setRecordIdToDestroy(row.id)}
                          >
                            <i className="fas fa-trash deposit-table-action-icon" />
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
        .deposit-list-container {
          width: 100%;
        }

        .sort-icon {
          margin-left: 8px;
          font-size: 12px;
        }

        .text-right {
          text-align: right;
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

        .sortable-header {
          cursor: pointer;
          transition: background-color 0.2s ease;
          user-select: none;
        }

        .sortable-header:hover {
          background: #f1f5f9;
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

        .deposit-user-cell {
          display: flex;
          align-items: center;
        }

        .deposit-user-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .deposit-user-name {
          font-weight: 500;
          color: #334155;
        }

        .deposit-user-email {
          font-size: 12px;
          color: #64748b;
        }

        .no-user {
          color: #94a3b8;
          font-style: italic;
        }

        .deposit-method-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
          color: white;
        }

        .deposit-method-icon {
          font-size: 10px;
        }

        .deposit-protocol {
          font-size: 12px;
          color: #64748b;
          margin-top: 4px;
        }

        .deposit-amount {
          font-weight: 700;
          font-size: 16px;
          display: flex;
          align-items: baseline;
          justify-content: flex-end;
          gap: 2px;
          color: #38a169;
        }

        .amount-symbol {
          font-size: 14px;
        }

        .amount-value {
          font-weight: 700;
        }

        .amount-currency {
          font-size: 12px;
          color: #64748b;
          margin-left: 2px;
        }

        .deposit-status-buttons {
          display: flex;
          gap: 8px;
          justify-content: center;
        }

        .status-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 6px 12px;
          border: none;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .status-btn:hover {
          transform: translateY(-1px);
        }

        .status-btn.success {
          background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
          color: white;
        }

        .status-btn.danger {
          background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
          color: white;
        }

        .status-btn-icon {
          font-size: 10px;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }

        .status-success {
          background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
          color: white;
        }

        .status-pending {
          background: linear-gradient(135deg, #f6ad55 0%, #ed8936 100%);
          color: white;
        }

        .status-canceled {
          background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
          color: white;
        }

        .status-unknown {
          background: #e2e8f0;
          color: #475569;
        }

        .status-icon {
          font-size: 10px;
        }

        .status-text {
          text-transform: capitalize;
        }

        .deposit-date {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .deposit-date-day {
          font-weight: 500;
          color: #334155;
        }

        .deposit-date-time {
          font-size: 12px;
          color: #64748b;
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

        .actions-header {
          width: 200px;
        }

        .deposit-table-actions-header {
          background: #f8fafc;
        }

        .deposit-table-actions {
          position: sticky;
          right: 0;
          background: white;
          z-index: 10;
          min-width: 200px;
          white-space: nowrap;
          box-shadow: -2px 0 8px rgba(0,0,0,0.06);
          border-left: 2px solid #f1f5f9;
        }

        .deposit-table-actions-content {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: nowrap;
          padding: 8px;
        }

        .deposit-table-action-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 6px 10px;
          border: none;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          min-width: auto;
          white-space: nowrap;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .deposit-table-action-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }

        .deposit-table-action-btn.primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .deposit-table-action-btn.danger {
          background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
          color: white;
        }

        .deposit-table-action-btn.info {
          background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
          color: white;
        }

        .deposit-table-action-icon {
          margin-right: 4px;
          font-size: 10px;
          width: 10px;
        }

        .pagination-container {
          margin-top: 20px;
          display: flex;
          justify-content: center;
        }

        @media (max-width: 768px) {
          .deposit-table-actions-content {
            flex-direction: column;
            align-items: stretch;
          }

          .deposit-table-action-btn {
            justify-content: center;
            padding: 8px 12px;
          }

          .deposit-table-actions {
            min-width: 150px;
          }

          .table-header th {
            padding: 12px 8px;
            font-size: 10px;
          }

          .table-cell {
            padding: 12px 8px;
            font-size: 12px;
          }

          .deposit-status-buttons {
            flex-direction: column;
            gap: 4px;
          }

          .status-btn {
            padding: 4px 8px;
            font-size: 10px;
          }

          .deposit-amount {
            font-size: 14px;
          }

          .deposit-method-badge {
            padding: 4px 8px;
            font-size: 10px;
          }

          .deposit-date-day {
            font-size: 12px;
          }

          .deposit-date-time {
            font-size: 10px;
          }
        }
      `}</style>
    </div>
  );
}

export default DepositListTable;
