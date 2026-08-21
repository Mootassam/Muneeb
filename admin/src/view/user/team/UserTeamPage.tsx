import React, { useEffect, useState } from 'react';
import { useRouteMatch, useHistory, Link } from 'react-router-dom';
import ContentWrapper from 'src/view/layout/styles/ContentWrapper';
import PageTitle from 'src/view/shared/styles/PageTitle';
import Spinner from 'src/view/shared/Spinner';
import UserService from 'src/modules/user/userService';

function UserTeamPage() {
  const match = useRouteMatch<{ id: string }>();
  const history = useHistory();
  const userId = match.params.id;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    UserService.getTeam(userId)
      .then((response) => {
        if (mounted) {
          setData(response);
        }
      })
      .catch((error) => {
        console.error('Failed to load team', error);
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [userId]);

  const members = data?.members || [];
  const filteredMembers = members.filter((member) => {
    if (!search) {
      return true;
    }
    const q = search.toLowerCase();
    return (
      (member.fullName || '').toLowerCase().includes(q) ||
      (member.email || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="user-team-page">
      <style>{`
        .user-team-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 20px;
        }

        .user-team-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 8px 14px;
          font-size: 13px;
          font-weight: 600;
          color: #334155;
          cursor: pointer;
        }

        .user-team-back-btn:hover {
          background: #e2e8f0;
        }

        .user-team-parent-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px 18px;
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
        }

        .user-team-parent-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #94a3b8;
        }

        .user-team-parent-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #4f46e5;
          text-decoration: none;
        }

        .user-team-parent-link:hover {
          text-decoration: underline;
        }

        .user-team-parent-none {
          font-size: 13px;
          color: #94a3b8;
          font-style: italic;
        }

        .user-team-stats {
          display: grid;
          grid-template-columns: repeat(2, minmax(180px, 1fr));
          gap: 14px;
          margin-bottom: 20px;
        }

        .user-team-stat-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .user-team-stat-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: #ede9fe;
          color: #7c3aed;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
        }

        .user-team-stat-icon.earned {
          background: #dcfce7;
          color: #16a34a;
        }

        .user-team-stat-value {
          font-size: 22px;
          font-weight: 800;
          color: #1e293b;
        }

        .user-team-stat-value .unit {
          font-size: 12px;
          font-weight: 700;
          color: #94a3b8;
          margin-left: 4px;
        }

        .user-team-stat-label {
          font-size: 12px;
          color: #64748b;
        }

        .user-team-search {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 10px 14px;
          margin-bottom: 16px;
          max-width: 360px;
        }

        .user-team-search i {
          color: #94a3b8;
          font-size: 13px;
        }

        .user-team-search input {
          border: none;
          outline: none;
          flex: 1;
          font-size: 13.5px;
          color: #1e293b;
        }

        .user-team-table-wrap {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
        }

        .user-team-table {
          width: 100%;
          border-collapse: collapse;
        }

        .user-team-table thead th {
          text-align: left;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748b;
          background: #f8fafc;
          padding: 12px 16px;
          border-bottom: 1px solid #e2e8f0;
        }

        .user-team-table td {
          padding: 12px 16px;
          font-size: 13.5px;
          color: #334155;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
        }

        .user-team-table tr:last-child td {
          border-bottom: none;
        }

        .user-team-member-name {
          font-weight: 600;
          color: #1e293b;
        }

        .user-team-member-email {
          font-size: 12px;
          color: #94a3b8;
        }

        .text-right {
          text-align: right;
        }

        .user-team-earned {
          font-weight: 700;
          color: #16a34a;
        }

        .user-team-view-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12.5px;
          font-weight: 600;
          color: #4f46e5;
          text-decoration: none;
          white-space: nowrap;
        }

        .user-team-view-btn:hover {
          text-decoration: underline;
        }

        .user-team-empty {
          text-align: center;
          padding: 40px 16px !important;
          color: #94a3b8;
        }
      `}</style>

      <ContentWrapper>
        <div className="user-team-header">
          <button
            type="button"
            className="user-team-back-btn"
            onClick={() => history.goBack()}
          >
            <i className="fas fa-arrow-left"></i>
            Back
          </button>
          <PageTitle>
            Team{data?.user?.fullName ? ` — ${data.user.fullName}` : ''}
          </PageTitle>
        </div>

        {loading && <Spinner />}

        {!loading && data && (
          <>
            <div className="user-team-parent-card">
              <span className="user-team-parent-label">Invited By (Parent)</span>
              {data.parent ? (
                <Link
                  to={`/user/${data.parent.id}/team`}
                  className="user-team-parent-link"
                >
                  <i className="fas fa-user"></i>
                  {data.parent.fullName || data.parent.email}
                </Link>
              ) : (
                <span className="user-team-parent-none">
                  No parent — root account
                </span>
              )}
            </div>

            <div className="user-team-stats">
              <div className="user-team-stat-card">
                <span className="user-team-stat-icon">
                  <i className="fas fa-user-group"></i>
                </span>
                <div className="user-team-stat-value">{data.totalInvited}</div>
                <div className="user-team-stat-label">Total Invited</div>
              </div>

              <div className="user-team-stat-card">
                <span className="user-team-stat-icon earned">
                  <i className="fas fa-sack-dollar"></i>
                </span>
                <div className="user-team-stat-value">
                  {Number(data.totalEarned || 0).toFixed(2)}
                  <span className="unit">USD</span>
                </div>
                <div className="user-team-stat-label">Total Earned</div>
              </div>
            </div>

            <div className="user-team-search">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search invited customers..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <div className="user-team-table-wrap">
              <table className="user-team-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Invited</th>
                    <th className="text-right">Earned</th>
                    <th>Joined</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="user-team-empty">
                        No invited customers found.
                      </td>
                    </tr>
                  )}
                  {filteredMembers.map((member) => (
                    <tr key={member.id}>
                      <td>
                        <div className="user-team-member-name">
                          {member.fullName || '—'}
                        </div>
                        <div className="user-team-member-email">{member.email}</div>
                      </td>
                      <td>{member.invitedCount}</td>
                      <td className="text-right user-team-earned">
                        +{Number(member.earned || 0).toFixed(2)}
                      </td>
                      <td>
                        {member.createdAt
                          ? new Date(member.createdAt).toLocaleDateString()
                          : '-'}
                      </td>
                      <td>
                        <Link
                          className="user-team-view-btn"
                          to={`/user/${member.id}/team`}
                        >
                          View Team <i className="fas fa-chevron-right"></i>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </ContentWrapper>
    </div>
  );
}

export default UserTeamPage;
