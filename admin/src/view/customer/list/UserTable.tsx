import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import selectors from 'src/modules/user/list/userListSelectors';
import actions from 'src/modules/user/list/userListActions';
import { i18n } from 'src/i18n';
import Pagination from 'src/view/shared/table/Pagination';
import Spinner from 'src/view/shared/Spinner';
import TableColumnHeader from 'src/view/shared/table/TableColumnHeader';
import Roles from 'src/security/roles';
import UserStatusView from 'src/view/customer/view/UserStatusView';
import Avatar from 'src/view/shared/Avatar';
import TableWrapper from 'src/view/shared/styles/TableWrapper';
import recordListActions from 'src/modules/record/list/recordListActions';
import selectorTaskdone from 'src/modules/record/list/recordListSelectors';

function UserTable() {
  const dispatch = useDispatch();
  const [totalTask, setTotalTasks] = useState('');
  const tasksdone = useSelector(
    selectorTaskdone.selectCountRecord,
  );
  const LoadingTasksDone = useSelector(
    selectorTaskdone.selectLoading,
  );
  const loading = useSelector(selectors.selectLoading);
  const rows = useSelector(selectors.selectRows);
  const pagination = useSelector(
    selectors.selectPagination,
  );
  const selectedKeys = useSelector(
    selectors.selectSelectedKeys,
  );
  const [showTask, setShowTask] = useState(false)
  const hasRows = useSelector(selectors.selectHasRows);
  const sorter = useSelector(selectors.selectSorter);
  const isAllSelected = useSelector(
    selectors.selectIsAllSelected,
  );

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

  const showThecurrentRecord = async (id, totaltask?) => {
    setShowTask(true)
    await dispatch(recordListActions.doTasksDone(id));
    setTotalTasks(totaltask);
  };

  useEffect(() => { }, [dispatch, tasksdone]);

  return (
    <div className="user-list-container">
      <TableWrapper>
        <div className="table-responsive">
          <table className="user-list-table">
            <thead className="table-header">
              <tr>
             
                <th className="sortable-header" onClick={() => doChangeSort('email')}>
                  {i18n('user.fields.email')}
                  {sorter.field === 'email' && (
                    <span className="sort-icon">
                      {sorter.order === 'ascend' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                
                <th className="sortable-header" onClick={() => doChangeSort('invitationcode')}>
                  {i18n('user.fields.invitationcode')}
                  {sorter.field === 'invitationcode' && (
                    <span className="sort-icon">
                      {sorter.order === 'ascend' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th className="sortable-header" onClick={() => doChangeSort('refcode')}>
                  {i18n('user.fields.refcode')}
                  {sorter.field === 'refcode' && (
                    <span className="sort-icon">
                      {sorter.order === 'ascend' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
         
                <th className="table-header">
                  {i18n('user.fields.roles')}
                </th>
                <th className="table-header text-center">
                  {i18n('user.fields.status')}
                </th>
                <th className="table-header text-center">
                  {i18n('user.fields.country')}
                </th>
                <th className="actions-header user-table-actions-header">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {loading && (
                <tr>
                  <td colSpan={10} className="loading-cell">
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
                  <td colSpan={10} className="no-data-cell">
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
                
                    <td className="table-cell">{row.email}</td>
                    <td className="table-cell">
                      <div className="parent-code-cell">
                        <span className="parent-code-value">{row.invitationcode}</span>
                        {row.parentUser && (
                          <span className="parent-code-name">
                            {row.parentUser.fullName || row.parentUser.email}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="parent-code-cell">
                        <span className="parent-code-value">{row.refcode}</span>
                        <span className="parent-code-name">
                          {row.fullName || row.email}
                        </span>
                      </div>
                    </td>

                    <td className="table-cell">
                      {row.roles.map((roleId) => (
                        <div key={roleId}>
                          <span>{Roles.labelOf(roleId)}</span>
                        </div>
                      ))}
                    </td>
                    <td className="table-cell text-center">
                      <UserStatusView value={row.status} />
                    </td>
                    <td className="table-cell text-center">
                      <span>{row.country} <br />{row.ipAddress}</span>
                    </td>
                 <td className="user-table-actions">
  <div className="user-table-actions-content">

    {/* Tasks */}
    <button
      className="user-table-action-btn success"
      onClick={() =>
        showThecurrentRecord(
          row.id,
          row?.vip?.dailyorder,
        )
      }
    >
      <i className="fas fa-tasks user-table-action-icon" />
      Tasks
    </button>

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

      {!LoadingTasksDone && showTask && (
        <div className="user-table-modal-overlay">
          <div className="user-table-modal-content">
            <button
              className="user-table-modal-close"
              onClick={() => setShowTask(false)}
            >
              <i className="fas fa-times" />
            </button>
            <h3 className="user-table-modal-text">Task Progress</h3>
            <div className="user-table-progress">
              {tasksdone} / {totalTask}
            </div>
            <div style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
              Tasks Completed
            </div>
          </div>
        </div>
      )}

      <style>{`
        .user-list-container {
          width: 100%;
        }

        .sort-icon {
          margin-left: 8px;
          font-size: 12px;
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

        .parent-code-cell {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .parent-code-value {
          font-family: 'Consolas', 'Courier New', monospace;
          font-size: 12px;
          color: #94a3b8;
        }

        .parent-code-name {
          font-weight: 500;
          color: #334155;
        }

        .text-center {
          text-align: center;
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

        .user-table-actions-header {
          background: #f8fafc;
        }

        .user-table-actions {
          position: sticky;
          right: 0;
          background: white;
          z-index: 10;
          min-width: 280px;
          white-space: nowrap;
          box-shadow: -2px 0 8px rgba(0,0,0,0.06);
          border-left: 2px solid #f1f5f9;
        }
        
        .user-table-actions-content {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: nowrap;
          padding: 8px;
        }
        
        .user-table-action-btn {
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
        
        .user-table-action-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
        
        .user-table-action-btn.primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        
        .user-table-action-btn.success {
          background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
          color: white;
        }
        
        .user-table-action-btn.warning {
          background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);
          color: white;
        }
        
        .user-table-action-btn.danger {
          background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
          color: white;
        }
        
        .user-table-action-btn.info {
          background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
          color: white;
        }
        
        .user-table-action-icon {
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

        /* Modal Styles */
        .user-table-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }
        
        .user-table-modal-content {
          background: white;
          padding: 30px;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
          position: relative;
          min-width: 300px;
          text-align: center;
          animation: modalSlideIn 0.3s ease-out;
        }
        
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .user-table-modal-close {
          position: absolute;
          top: 15px;
          right: 15px;
          background: #f8fafc;
          border: none;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          font-size: 14px;
          cursor: pointer;
          color: #64748b;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .user-table-modal-close:hover {
          background: #e2e8f0;
          color: #475569;
        }
        
        .user-table-modal-text {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 15px 0;
        }
        
        .user-table-progress {
          font-size: 32px;
          font-weight: bold;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 10px 0;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .user-table-actions-content {
            flex-direction: column;
            align-items: stretch;
          }
          
          .user-table-action-btn {
            justify-content: center;
            padding: 8px 12px;
          }
          
          .user-table-modal-content {
            margin: 10px;
            max-width: calc(100vw - 20px);
          }
          
          .user-table-actions {
            min-width: 200px;
          }
        }
      `}</style>
    </div>
  );
}

export default UserTable;