import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import userSelectors from 'src/modules/user/userSelectors';
import selectors from 'src/modules/user/list/userListSelectors';
import actions from 'src/modules/user/list/userListActions';
import { Link } from 'react-router-dom';
import { i18n } from 'src/i18n';
import Pagination from 'src/view/shared/table/Pagination';
import Spinner from 'src/view/shared/Spinner';
import TableColumnHeader from 'src/view/shared/table/TableColumnHeader';
import ConfirmModal from 'src/view/shared/modals/ConfirmModal';
import Roles from 'src/security/roles';
import UserStatusView from 'src/view/user/view/UserStatusView';
import Avatar from 'src/view/shared/Avatar';
import TableWrapper from 'src/view/shared/styles/TableWrapper';
import recordListActions from 'src/modules/record/list/recordListActions';
import selectorTaskdone from 'src/modules/record/list/recordListSelectors';
import UserService from 'src/modules/user/userService';
import Message from 'src/view/shared/message';

// ---------- types ----------
interface MinusRecord {
  id: string;
  email: string;
  balance: number;   // the negative amount (e.g. -15.500)
}

function UserTable() {
  const dispatch = useDispatch();
  const [recordIdToDestroy, setRecordIdToDestroy] = useState<string | null>(null);
  const [recordIdToTotalDestroy, setRecordIdToTotalDestroy] = useState<string | null>(null);
  const [recordIdToResetTask, setRecordIdToResetTask] = useState<string | null>(null);
  const [resettingTask, setResettingTask] = useState(false);
  const [totalTask, setTotalTasks] = useState<string>('');
  const tasksdone = useSelector(selectorTaskdone.selectCountRecord);
  const LoadingTasksDone = useSelector(selectorTaskdone.selectLoading);
  const loading = useSelector(selectors.selectLoading);
  const rows = useSelector(selectors.selectRows);
  const pagination = useSelector(selectors.selectPagination);
  const selectedKeys = useSelector(selectors.selectSelectedKeys);
  const [showTask, setShowTask] = useState(false);
  const hasRows = useSelector(selectors.selectHasRows);
  const sorter = useSelector(selectors.selectSorter);
  const isAllSelected = useSelector(selectors.selectIsAllSelected);
  const hasPermissionToEdit = useSelector(userSelectors.selectPermissionToEdit);
  const hasPermissionToDestroy = useSelector(
    userSelectors.selectPermissionToDestroy,
  );

  // State for the custom minus‑balance modal
  const [minusRecord, setMinusRecord] = useState<MinusRecord | null>(null);
  const [clearingMinus, setClearingMinus] = useState(false);

  const doDestroy = (id: string) => {
    setRecordIdToDestroy(null);
    dispatch(actions.doDestroy(id));
  };

  const doTotalDestroy = (id: string) => {
    setRecordIdToTotalDestroy(null);
    dispatch(actions.doDestroyAllFull(id));
  };

  const doResetTask = async (id: string) => {
    try {
      setResettingTask(true);
      await UserService.resetTasks(id);
      setRecordIdToResetTask(null);
      dispatch(actions.doFetchCurrentFilter());
      Message.success('Task reset successfully.');
    } catch (error) {
      console.error('Failed to reset task', error);
    } finally {
      setResettingTask(false);
    }
  };

  const doClearMinus = async (id: string) => {
    try {
      setClearingMinus(true);
      await UserService.clearMinus(id);
      setMinusRecord(null);
      dispatch(actions.doFetchCurrentFilter());
      Message.success('Minus balance cleared successfully.');
    } catch (error) {
      console.error('Failed to clear minus balance', error);
    } finally {
      setClearingMinus(false);
    }
  };

  const doChangeSort = (field: string) => {
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

  const doChangePagination = (pagination: any) => {
    dispatch(actions.doChangePagination(pagination));
  };

  const doToggleAllSelected = () => {
    dispatch(actions.doToggleAllSelected());
  };

  const doToggleOneSelected = (id: string) => {
    dispatch(actions.doToggleOneSelected(id));
  };

  const showThecurrentRecord = async (id: string, totaltask?: string) => {
    setShowTask(true);
    await dispatch(recordListActions.doTasksDone(id));
    setTotalTasks(totaltask ?? '');
  };

  useEffect(() => {}, [dispatch, tasksdone]);

  const oneClick = async (id: string) => {
    await UserService.doOneClickLogin(id);
  };

  return (
    <>
      {/* ---------- Styles ---------- */}
      <style>{`
        /* Container for the whole table wrapper */
        .user-list-container .table-responsive {
          overflow-x: auto;
        }

        /* Sticky Actions Column (both header and body cells) */
        .actions-header,
        .user-table-actions {
          position: sticky;
          right: 0;
          background-color: #fff;
          z-index: 2;
        }

        /* Ensure the header is above body cells */
        .actions-header {
          z-index: 3;
        }

        /* Actions wrapper: display flex, horizontal row, centered */
        .user-table-actions-content {
          display: flex;
          gap: 8px;
          align-items: center;
          justify-content: flex-start;
        }

        /* Base button/link styling for actions */
        .user-table-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
          padding: 4px 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
          background: #f9f9f9;
          color: #333;
          font-size: 0.85rem;
          text-decoration: none;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .user-table-action-btn:hover {
          background: #e9e9e9;
        }

        /* Optional color overrides */
        .user-table-action-btn.primary { background: #1890ff; border-color: #1890ff; color: white; }
        .user-table-action-btn.success { background: #52c41a; border-color: #52c41a; color: white; }
        .user-table-action-btn.info { background: #13c2c2; border-color: #13c2c2; color: white; }
        .user-table-action-btn.warning { background: #faad14; border-color: #faad14; color: white; }
        .user-table-action-btn.danger { background: #ff4d4f; border-color: #ff4d4f; color: white; }
        .user-table-action-btn.dark { background: #262626; border-color: #262626; color: white; }
        .user-table-action-btn.teal { background: #8B5CF6; border-color: #8B5CF6; color: white; }
        .user-table-action-btn.orange { background: #F59E0B; border-color: #F59E0B; color: white; }
        .user-table-action-btn:hover {
          opacity: 0.85;
        }

        /* Modal overlay (used by tasks and the new minus‑balance modal) */
        .user-table-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .user-table-modal-content {
          background: #fff;
          border-radius: 8px;
          padding: 24px;
          min-width: 260px;
          max-width: 90%;
          text-align: center;
          position: relative;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        .user-table-modal-close {
          position: absolute;
          top: 12px;
          right: 12px;
          background: transparent;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #666;
        }

        .user-table-modal-text {
          margin: 0 0 16px;
          font-size: 1.2rem;
          font-weight: 600;
        }

        .user-table-progress {
          font-size: 2rem;
          font-weight: bold;
          color: #1890ff;
        }

        /* Styling for the custom minus‑balance modal */
        .minus-modal-body {
          margin: 20px 0;
          font-size: 1rem;
          line-height: 1.6;
        }
        .minus-modal-body .amount {
          font-weight: bold;
          color: #ff4d4f;
        }
        .minus-modal-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin-top: 20px;
        }
        .minus-modal-btn {
          padding: 8px 20px;
          border: none;
          border-radius: 6px;
          font-size: 0.9rem;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.2s, opacity 0.2s;
        }
        .minus-modal-btn.yes {
          background: #ff4d4f;
          color: white;
        }
        .minus-modal-btn.no {
          background: #ccc;
          color: #333;
        }
        .minus-modal-btn:hover {
          opacity: 0.85;
        }

        /* General table improvements */
        .user-list-table {
          width: 100%;
          border-collapse: collapse;
        }
        .table-header th {
          white-space: nowrap;
        }
        .table-cell {
          padding: 8px;
          border-bottom: 1px solid #f0f0f0;
        }
      `}</style>

      <div className="user-list-container">
        <TableWrapper>
          <div className="table-responsive">
            <table className="user-list-table">
              <thead className="table-header">
                <tr>
                  <th
                    className="sortable-header"
                    onClick={() => doChangeSort('email')}
                  >
                    {i18n('user.fields.email')}
                    {sorter.field === 'email' && (
                      <span className="sort-icon">
                        {sorter.order === 'ascend' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th
                    className="sortable-header"
                    onClick={() => doChangeSort('invitationcode')}
                  >
                    {i18n('user.fields.invitationcode')}
                    {sorter.field === 'invitationcode' && (
                      <span className="sort-icon">
                        {sorter.order === 'ascend' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th
                    className="sortable-header"
                    onClick={() => doChangeSort('refcode')}
                  >
                    {i18n('user.fields.refcode')}
                    {sorter.field === 'refcode' && (
                      <span className="sort-icon">
                        {sorter.order === 'ascend' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>

                  <th className="table-header">
                    {i18n('user.fields.balance')}
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
                  {/* Sticky Actions header */}
                  <th className="actions-header text-center">
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
                      <td className="table-cell">{row.email}</td>
                      <td className="table-cell">{row.invitationcode}</td>
                      <td className="table-cell">{row.refcode}</td>
                      <td className="table-cell">
                        {row.balance < 0 ? (
                          <span
                            style={{
                              color: '#ff4d4f',
                              fontWeight: 'bold',
                              cursor: 'pointer',
                            }}
                            onClick={() =>
                              setMinusRecord({
                                id: row.id,
                                email: row.email,
                                balance: row.balance,
                              })
                            }
                            title="Click to clear minus balance"
                          >
                            {row.balance.toFixed(3)}
                          </span>
                        ) : (
                          row.balance.toFixed(3)
                        )}
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
                        <span>
                          {row.country} <br />
                          {row.ipAddress}
                        </span>
                      </td>
                      {/* Sticky Actions cell */}
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

                          {/* Password */}
                          <Link
                            className="user-table-action-btn info"
                            to={`/password-reset/${row.id}`}
                          >
                            <i className="fas fa-key user-table-action-icon" />
                            Password
                          </Link>

                          {/* View */}
                          <Link
                            className="user-table-action-btn warning"
                            to={`/user/${row.id}`}
                          >
                            <i className="fas fa-eye user-table-action-icon" />
                            View
                          </Link>

                          {/* Edit */}
                          <Link
                            className="user-table-action-btn primary"
                            to={`/user/${row.id}/edit`}
                          >
                            <i className="fas fa-edit user-table-action-icon" />
                            Edit
                          </Link>

                          {/* Team */}
                          <Link
                            className="user-table-action-btn teal"
                            to={`/user/${row.id}/team`}
                          >
                            <i className="fas fa-people-group user-table-action-icon" />
                            Team
                          </Link>

                          {/* Reset Task */}
                          <button
                            className="user-table-action-btn orange"
                            onClick={() =>
                              setRecordIdToResetTask(row.id)
                            }
                          >
                            <i className="fas fa-rotate-left user-table-action-icon" />
                            Reset Task
                          </button>

                          {/* Total Delete */}
                          <button
                            className="user-table-action-btn dark"
                            onClick={() =>
                              setRecordIdToTotalDestroy(row.id)
                            }
                          >
                            <i className="fas fa-trash-alt user-table-action-icon" />
                            Total Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </TableWrapper>

        <div className="pagination-container">
          <Pagination
            onChange={doChangePagination}
            disabled={loading}
            pagination={pagination}
          />
        </div>

        {/* Existing confirm modals (freeze, total delete) */}
        {recordIdToDestroy && (
          <ConfirmModal
            title={i18n('common.areYouSure')}
            onConfirm={() => doDestroy(recordIdToDestroy)}
            onClose={() => setRecordIdToDestroy(null)}
            okText={i18n('common.yes')}
            cancelText={i18n('common.no')}
          />
        )}

        {recordIdToTotalDestroy && (
          <ConfirmModal
            title={i18n('common.areYouSure')}
            message={i18n('user.doDestroyAllFullConfirm')}
            onConfirm={() => doTotalDestroy(recordIdToTotalDestroy)}
            onClose={() => setRecordIdToTotalDestroy(null)}
            okText={i18n('common.yes')}
            cancelText={i18n('common.no')}
          />
        )}

        {recordIdToResetTask && (
          <ConfirmModal
            title={i18n('common.areYouSure')}
            message="This will reset the user's completed tasks count back to 0."
            onConfirm={() => doResetTask(recordIdToResetTask)}
            onClose={() => !resettingTask && setRecordIdToResetTask(null)}
            okText={i18n('common.yes')}
            cancelText={i18n('common.no')}
          />
        )}

        {/* ---------- Custom modal for clearing minus balance ---------- */}
        {minusRecord && (
          <div className="user-table-modal-overlay">
            <div className="user-table-modal-content" style={{ maxWidth: '400px' }}>
              <button
                className="user-table-modal-close"
                onClick={() => setMinusRecord(null)}
              >
                <i className="fas fa-times" />
              </button>
              <h3 className="user-table-modal-text" style={{ marginBottom: '10px' }}>
                Clear Minus Balance
              </h3>
              <div className="minus-modal-body">
                <p>
                  Customer: <strong>{minusRecord.email}</strong>
                </p>
                <p>
                  Amount:{' '}
                  <span className="amount">
                    {minusRecord.balance} USD
                  </span>
                </p>
                <p style={{ marginTop: '15px' }}>
                  Are you sure you want to clear this minus?
                </p>
              </div>
              <div className="minus-modal-actions">
                <button
                  className="minus-modal-btn yes"
                  disabled={clearingMinus}
                  onClick={() => doClearMinus(minusRecord.id)}
                >
                  {clearingMinus ? 'Processing...' : 'Yes, clear it'}
                </button>
                <button
                  className="minus-modal-btn no"
                  onClick={() => setMinusRecord(null)}
                >
                  No, cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Task progress modal (unchanged) */}
        {!LoadingTasksDone && showTask && (
          <div className="user-table-modal-overlay">
            <div className="user-table-modal-content">
              <button
                className="user-table-modal-close"
                onClick={() => setShowTask(false)}
              >
                <i className="fas fa-times" />
              </button>
              <h3 className="user-table-modal-text">
                Task Progress
              </h3>
              <div className="user-table-progress">
                {tasksdone} / {totalTask}
              </div>
              <div
                style={{
                  marginTop: '15px',
                  fontSize: '14px',
                  color: '#666',
                }}
              >
                Tasks Completed
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default UserTable;