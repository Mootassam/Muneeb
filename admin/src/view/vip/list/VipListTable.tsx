import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { i18n } from 'src/i18n';
import couponsSelectors from 'src/modules/vip/vipSelectors';
import destroyActions from 'src/modules/vip/destroy/vipDestroyActions';
import destroySelectors from 'src/modules/vip/destroy/vipDestroySelectors';
import actions from 'src/modules/vip/list/vipListActions';
import selectors from 'src/modules/vip/list/vipListSelectors';
import ConfirmModal from 'src/view/shared/modals/ConfirmModal';
import Spinner from 'src/view/shared/Spinner';
import TableWrapper from 'src/view/shared/styles/TableWrapper';
import Pagination from 'src/view/shared/table/Pagination';

function CouponsListTable(props) {
  const [recordIdToDestroy, setRecordIdToDestroy] = useState(null);
  const dispatch = useDispatch();

  const findLoading = useSelector(selectors.selectLoading);
  const destroyLoading = useSelector(destroySelectors.selectLoading);
  const loading = findLoading || destroyLoading;
  const rows = useSelector(selectors.selectRows);
  const pagination = useSelector(selectors.selectPagination);
  const selectedKeys = useSelector(selectors.selectSelectedKeys);
  const hasRows = useSelector(selectors.selectHasRows);
  const sorter = useSelector(selectors.selectSorter);
  const isAllSelected = useSelector(selectors.selectIsAllSelected);
  
  const hasPermissionToEdit = useSelector(
    couponsSelectors.selectPermissionToEdit,
  );
  const hasPermissionToDestroy = useSelector(
    couponsSelectors.selectPermissionToDestroy,
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

  const doToggleAllSelected = () => {
    dispatch(actions.doToggleAllSelected());
  };

  const doToggleOneSelected = (id) => {
    dispatch(actions.doToggleOneSelected(id));
  };

  return (
    <div className="coupons-list-container">
      <TableWrapper>
        <div className="table-responsive">
          <table className="coupons-list-table">
            <thead className="table-header">
              <tr>
                <th className="checkbox-column">
                  {hasRows && (
                    <div className="checkbox-wrapper">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        id="table-header-checkbox"
                        checked={Boolean(isAllSelected)}
                        onChange={() => doToggleAllSelected()}
                      />
                    </div>
                  )}
                </th>
                <th className="image-header">
                  {i18n('entities.vip.fields.photo')}
                </th>
                <th
                  className="sortable-header"
                  onClick={() => doChangeSort('title')}
                >
                  {i18n('entities.vip.fields.title')}
                  {sorter.field === 'title' && (
                    <span className="sort-icon">
                      {sorter.order === 'ascend' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th 
                  className="sortable-header" 
                  onClick={() => doChangeSort('dailyorder')}
                >
                  {i18n('entities.vip.fields.dailyorder')}
                  {sorter.field === 'dailyorder' && (
                    <span className="sort-icon">
                      {sorter.order === 'ascend' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th 
                  className="sortable-header text-right" 
                  onClick={() => doChangeSort('comisionrate')}
                >
                  {i18n('entities.vip.fields.commissionrate')}
                  {sorter.field === 'comisionrate' && (
                    <span className="sort-icon">
                      {sorter.order === 'ascend' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th
                  className="sortable-header text-right"
                  onClick={() => doChangeSort('min')}
                >
                  {i18n('entities.vip.fields.levelLimit')}
                  {sorter.field === 'min' && (
                    <span className="sort-icon">
                      {sorter.order === 'ascend' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th className="actions-header coupons-table-actions-header">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="table-body">
              {loading && (
                <tr>
                  <td colSpan={7} className="loading-cell">
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
                  <td colSpan={7} className="no-data-cell">
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
                          id={`table-row-checkbox-${row.id}`}
                          checked={selectedKeys.includes(row.id)}
                          onChange={() => doToggleOneSelected(row.id)}
                        />
                      </div>
                    </td>
                    <td className="table-cell image-column">
                      <img
                        className="vip-thumb"
                        src={
                          row.photo?.[0]?.downloadUrl ||
                          'https://via.placeholder.com/44'
                        }
                        alt={row.title}
                        loading="lazy"
                      />
                    </td>
                    <td className="table-cell">
                      <div className="vip-title-cell">
                        <span className="vip-title">{row.title}</span>
                        {row.type && (
                          <span className="vip-type-badge">{row.type}</span>
                        )}
                      </div>
                    </td>
                    <td className="table-cell text-center">
                      <div className="daily-order-display">
                        <i className="fas fa-calendar-day daily-order-icon"></i>
                        <span className="daily-order-value">{row.dailyorder}</span>
                        <span className="daily-order-label">/day</span>
                      </div>
                    </td>
                    <td className="table-cell text-right">
                      <div className="commission-rate-display">
                        <span className="commission-rate-value">{row.comisionrate}</span>
                        <span className="commission-rate-unit">%</span>
                      </div>
                    </td>
                    <td className="table-cell text-right">
                      <div className="level-limit-display">
                        <i className="fas fa-layer-group level-limit-icon"></i>
                        <span className="level-limit-value">
                          {row.min} - {row.max}
                        </span>
                      </div>
                    </td>
                    <td className="coupons-table-actions">
                      <div className="coupons-table-actions-content">
                        <Link
                          className="coupons-table-action-btn info"
                          to={`/vip/${row.id}`}
                        >
                          <i className="fas fa-eye coupons-table-action-icon" />
                          View
                        </Link>
                        {hasPermissionToEdit && (
                          <Link
                            className="coupons-table-action-btn primary"
                            to={`/vip/${row.id}/edit`}
                          >
                            <i className="fas fa-edit coupons-table-action-icon" />
                            Edit
                          </Link>
                        )}
                        {hasPermissionToDestroy && (
                          <button
                            className="coupons-table-action-btn danger"
                            onClick={() => setRecordIdToDestroy(row.id)}
                          >
                            <i className="fas fa-trash coupons-table-action-icon" />
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
        .coupons-list-container {
          width: 100%;
        }

        .sort-icon {
          margin-left: 8px;
          font-size: 12px;
        }

        .text-right {
          text-align: right;
        }

        .text-center {
          text-align: center;
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

        .image-header {
          width: 64px;
        }

        .image-column {
          width: 64px;
        }

        .vip-thumb {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          object-fit: cover;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
        }

        .vip-title-cell {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .vip-title {
          font-weight: 500;
          color: #334155;
        }

        .vip-type-badge {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
        }

        .daily-order-display {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .daily-order-icon {
          color: #48bb78;
          font-size: 14px;
        }

        .daily-order-value {
          font-weight: 600;
          color: #2d3748;
          font-size: 16px;
        }

        .daily-order-label {
          color: #718096;
          font-size: 12px;
        }

        .commission-rate-display {
          display: flex;
          align-items: baseline;
          justify-content: flex-end;
          gap: 2px;
        }

        .commission-rate-value {
          font-weight: 700;
          color: #2d3748;
          font-size: 18px;
          background: linear-gradient(135deg, #f6ad55 0%, #ed8936 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .commission-rate-unit {
          color: #718096;
          font-size: 12px;
        }

        .level-limit-display {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 6px;
        }

        .level-limit-icon {
          color: #4299e1;
          font-size: 14px;
        }

        .level-limit-value {
          font-weight: 600;
          color: #2d3748;
          font-size: 16px;
        }

        .level-limit-label {
          color: #718096;
          font-size: 12px;
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

        .coupons-table-actions-header {
          background: #f8fafc;
        }

        .coupons-table-actions {
          position: sticky;
          right: 0;
          background: white;
          z-index: 10;
          min-width: 200px;
          white-space: nowrap;
          box-shadow: -2px 0 8px rgba(0,0,0,0.06);
          border-left: 2px solid #f1f5f9;
        }
        
        .coupons-table-actions-content {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: nowrap;
          padding: 8px;
        }
        
        .coupons-table-action-btn {
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
        
        .coupons-table-action-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
        
        .coupons-table-action-btn.primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        
        .coupons-table-action-btn.success {
          background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
          color: white;
        }
        
        .coupons-table-action-btn.warning {
          background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);
          color: white;
        }
        
        .coupons-table-action-btn.danger {
          background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
          color: white;
        }
        
        .coupons-table-action-btn.info {
          background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
          color: white;
        }
        
        .coupons-table-action-icon {
          margin-right: 4px;
          font-size: 10px;
          width: 10px;
        }

        /* Pagination Styles */
        .pagination-container {
          margin-top: 20px;
          display: flex;
          justify-content: center;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .coupons-table-actions-content {
            flex-direction: column;
            align-items: stretch;
          }
          
          .coupons-table-action-btn {
            justify-content: center;
            padding: 8px 12px;
          }
          
          .coupons-table-actions {
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
          
          .checkbox-column {
            padding: 12px 4px !important;
          }
          
          .vip-title-cell {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }
          
          .daily-order-display,
          .level-limit-display {
            flex-direction: column;
            gap: 2px;
          }
          
          .commission-rate-display {
            flex-direction: column;
            align-items: flex-end;
          }
        }
      `}</style>
    </div>
  );
}

export default CouponsListTable;