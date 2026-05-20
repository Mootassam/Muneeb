import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import selectors from 'src/modules/worker/list/workerListSelectors';
import actions from 'src/modules/worker/list/workerListActions';
import { Link } from 'react-router-dom';
import { i18n } from 'src/i18n';
import Pagination from 'src/view/shared/table/Pagination';
import Spinner from 'src/view/shared/Spinner';
import ConfirmModal from 'src/view/shared/modals/ConfirmModal';
import UserStatusView from 'src/view/user/view/UserStatusView';
import TableWrapper from 'src/view/shared/styles/TableWrapper';
import Roles from 'src/security/roles';

function WorkerTable() {
  const dispatch = useDispatch();
  const [recordIdToFreeze, setRecordIdToFreeze] = useState<string | null>(null);
  const [recordIdToDelete, setRecordIdToDelete] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState('');

  const loading = useSelector(selectors.selectLoading);
  const rows = useSelector(selectors.selectRows);
  const pagination = useSelector(selectors.selectPagination);
  const hasRows = useSelector(selectors.selectHasRows);
  const sorter = useSelector(selectors.selectSorter);

  const doFreeze = (id: string) => {
    setRecordIdToFreeze(null);
    dispatch(actions.doDestroy(id));
  };

  const doDelete = (id: string) => {
    setRecordIdToDelete(null);
    dispatch(actions.doDestroyAllFull(id));
  };

  const doChangeSort = (field: string) => {
    const order =
      sorter.field === field && sorter.order === 'ascend' ? 'descend' : 'ascend';
    dispatch(actions.doChangeSort({ field, order }));
  };

  const doChangePagination = (pagination: any) => {
    dispatch(actions.doChangePagination(pagination));
  };

  const doSearch = () => {
    dispatch(actions.doSearchByEmail(emailInput.trim()));
  };

  const doClearSearch = () => {
    setEmailInput('');
    dispatch(actions.doSearchByEmail(''));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') doSearch();
  };

  return (
    <>
      <style>{`
        .worker-search-bar {
          display: flex;
          gap: 8px;
          align-items: center;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }
        .worker-search-input {
          padding: 6px 12px;
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          font-size: 14px;
          min-width: 260px;
          outline: none;
        }
        .worker-search-input:focus { border-color: #1890ff; }
        .worker-search-btn {
          padding: 6px 16px;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          font-weight: 500;
        }
        .worker-search-btn.primary { background: #1890ff; color: #fff; }
        .worker-search-btn.light   { background: #f0f0f0; color: #333; }
        .worker-table { width: 100%; border-collapse: collapse; }
        .worker-table th {
          white-space: nowrap; padding: 10px 8px;
          border-bottom: 2px solid #f0f0f0; text-align: left;
        }
        .worker-table td { padding: 8px; border-bottom: 1px solid #f0f0f0; }
        .worker-actions { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
        .worker-btn {
          display: inline-flex; align-items: center; gap: 4px;
          white-space: nowrap; padding: 4px 10px;
          border: 1px solid #ccc; border-radius: 4px;
          background: #f9f9f9; color: #333;
          font-size: 0.85rem; text-decoration: none;
          cursor: pointer; transition: opacity 0.2s;
        }
        .worker-btn:hover { opacity: 0.82; }
        .worker-btn.info    { background: #13c2c2; border-color: #13c2c2; color: #fff; }
        .worker-btn.primary { background: #1890ff; border-color: #1890ff; color: #fff; }
        .worker-btn.warning { background: #faad14; border-color: #faad14; color: #fff; }
        .worker-btn.danger  { background: #ff4d4f; border-color: #ff4d4f; color: #fff; }
      `}</style>

      {/* Email Search Bar */}
      <div className="worker-search-bar">
        <input
          className="worker-search-input"
          type="text"
          placeholder="Search by email..."
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="worker-search-btn primary" onClick={doSearch}>
          <i className="fas fa-search" /> Search
        </button>
        <button className="worker-search-btn light" onClick={doClearSearch}>
          <i className="fas fa-undo" /> Clear
        </button>
      </div>

      <TableWrapper>
        <div className="table-responsive">
          <table className="worker-table">
            <thead>
              <tr>
                <th onClick={() => doChangeSort('email')} style={{ cursor: 'pointer' }}>
                  {i18n('user.fields.email')}
                  {sorter.field === 'email' && (
                    <span>{sorter.order === 'ascend' ? ' ↑' : ' ↓'}</span>
                  )}
                </th>
                <th>{i18n('user.fields.roles')}</th>
                <th>{i18n('user.fields.status')}</th>
                <th>{i18n('user.fields.country')}</th>
                <th>IP Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 24 }}>
                    <Spinner />
                  </td>
                </tr>
              )}
              {!loading && !hasRows && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 24 }}>
                    {i18n('table.noData')}
                  </td>
                </tr>
              )}
              {!loading &&
                rows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.email}</td>
                    <td>
                      {(row.roles || []).map((roleId) => (
                        <div key={roleId}>
                          <span>{Roles.labelOf(roleId)}</span>
                        </div>
                      ))}
                    </td>
                    <td>
                      <UserStatusView value={row.status} />
                    </td>
                    <td>{row.country || '—'}</td>
                    <td>{row.ipAddress || '—'}</td>
                    <td>
                      <div className="worker-actions">
                        <Link
                          className="worker-btn info"
                          to={`/password-reset/${row.id}`}
                        >
                          <i className="fas fa-key" /> Password
                        </Link>

                        <Link
                          className="worker-btn primary"
                          to={`/user/${row.id}/edit`}
                        >
                          <i className="fas fa-edit" /> Edit
                        </Link>

                        <button
                          className="worker-btn warning"
                          onClick={() => setRecordIdToFreeze(row.id)}
                        >
                          <i className="fas fa-lock" /> Freeze
                        </button>

                        <button
                          className="worker-btn danger"
                          onClick={() => setRecordIdToDelete(row.id)}
                        >
                          <i className="fas fa-trash-alt" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </TableWrapper>

      <Pagination
        onChange={doChangePagination}
        disabled={loading}
        pagination={pagination}
      />

      {recordIdToFreeze && (
        <ConfirmModal
          title={i18n('common.areYouSure')}
          onConfirm={() => doFreeze(recordIdToFreeze)}
          onClose={() => setRecordIdToFreeze(null)}
          okText={i18n('common.yes')}
          cancelText={i18n('common.no')}
        />
      )}

      {recordIdToDelete && (
        <ConfirmModal
          title={i18n('common.areYouSure')}
          message={i18n('user.doDestroyAllFullConfirm')}
          onConfirm={() => doDelete(recordIdToDelete)}
          onClose={() => setRecordIdToDelete(null)}
          okText={i18n('common.yes')}
          cancelText={i18n('common.no')}
        />
      )}
    </>
  );
}

export default WorkerTable;
