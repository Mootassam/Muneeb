import React, { useEffect, useState, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import SubHeader from "src/view/shared/Header/SubHeader";
import TeamService from "src/modules/team/teamService";
import Errors from "src/modules/shared/error/errors";
import LoadingModal from "src/shared/LoadingModal";
import Dates from "src/view/shared/utils/Dates";
import { i18n } from "../../../i18n";

function TeamNetwork() {
  const { id } = useParams<{ id?: string }>();
  const history = useHistory();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  const fetchTeam = useCallback(async () => {
    setLoading(true);
    try {
      const response = await TeamService.find(id);
      setData(response);
    } catch (error) {
      Errors.handle(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  const goToMember = (memberId: string) => {
    history.push(`/team/${memberId}`);
  };

  const title = id && data?.user?.fullName
    ? data.user.fullName
    : i18n("pages.teamNetwork.title");

  return (
    <div>
      <SubHeader title={title} path="/profile" />

      <div className="tmn__page">
        {loading && <LoadingModal />}

        {!loading && data && (
          <>
            <div className="tmn__statsGrid">
              <div className="tmn__statCard">
                <span className="tmn__statIcon">
                  <i className="fa-solid fa-user-group"></i>
                </span>
                <div className="tmn__statValue">{data.totalInvited}</div>
                <div className="tmn__statLabel">
                  {i18n("pages.teamNetwork.totalInvited")}
                </div>
              </div>

              <div className="tmn__statCard">
                <span className="tmn__statIcon">
                  <i className="fa-solid fa-sack-dollar"></i>
                </span>
                <div className="tmn__statValue">
                  {Number(data.totalEarned || 0).toFixed(2)}
                  <span className="tmn__statUnit">
                    {i18n("pages.teamNetwork.currency")}
                  </span>
                </div>
                <div className="tmn__statLabel">
                  {i18n("pages.teamNetwork.totalEarned")}
                </div>
              </div>
            </div>

            <div className="tmn__sectionHeader">
              <div>
                <div className="tmn__eyebrow">
                  {i18n("pages.teamNetwork.eyebrow")}
                </div>
                <div className="tmn__sectionTitle">
                  {i18n("pages.teamNetwork.membersTitle")}
                </div>
              </div>
              <span className="tmn__memberCount">{data.members.length}</span>
            </div>

            {data.members.length === 0 && (
              <div className="tmn__empty">
                <span className="tmn__emptyIcon">
                  <i className="fa-solid fa-user-group"></i>
                </span>
                <div className="tmn__emptyTitle">
                  {i18n("pages.teamNetwork.emptyTitle")}
                </div>
                <div className="tmn__emptySubtitle">
                  {i18n("pages.teamNetwork.emptySubtitle")}
                </div>
              </div>
            )}

            {data.members.length > 0 && (
              <div className="tmn__list">
                {data.members.map((member) => (
                  <div
                    key={member.id}
                    className="tmn__card"
                    onClick={() => goToMember(member.id)}
                  >
                    <span className="tmn__avatar">
                      <i className="fa-solid fa-user"></i>
                    </span>

                    <div className="tmn__cardBody">
                      <div className="tmn__cardName">
                        {member.fullName || member.email}
                      </div>
                      <div className="tmn__cardMeta">
                        <span>
                          <i className="fa-solid fa-user-group"></i>
                          {member.invitedCount} {i18n("pages.teamNetwork.invited")}
                        </span>
                        <span>
                          <i className="fa-regular fa-calendar"></i>
                          {i18n("pages.teamNetwork.joined")} {Dates.NewsDate(member.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="tmn__cardRight">
                      <div className="tmn__cardEarned">
                        +{Number(member.earned || 0).toFixed(2)}
                      </div>
                      <i className="fa-solid fa-chevron-right tmn__cardChevron"></i>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        .tmn__page {
          min-height: 100vh;
          background: var(--bg-page);
          padding: 16px 14px 100px;
          font-family: "Poppins", -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .tmn__statsGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 20px;
        }

        .tmn__statCard {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 6px 16px var(--shadow-color);
        }

        .tmn__statIcon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: var(--bg-tint);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;
        }

        .tmn__statIcon i {
          color: var(--accent);
          font-size: 14px;
        }

        .tmn__statValue {
          font-size: 19px;
          font-weight: 800;
          color: var(--text-primary);
        }

        .tmn__statUnit {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-muted);
          margin-left: 4px;
        }

        .tmn__statLabel {
          font-size: 11px;
          color: var(--text-muted);
          margin-top: 4px;
        }

        .tmn__sectionHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .tmn__eyebrow {
          font-size: 10.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--accent);
          margin-bottom: 3px;
        }

        .tmn__sectionTitle {
          font-size: 17px;
          font-weight: 800;
          color: var(--text-primary);
        }

        .tmn__memberCount {
          font-size: 12px;
          font-weight: 700;
          color: var(--accent);
          background: var(--bg-tint);
          padding: 4px 11px;
          border-radius: 20px;
        }

        .tmn__list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .tmn__card {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 14px;
          box-shadow: 0 6px 16px var(--shadow-color);
          cursor: pointer;
        }

        .tmn__avatar {
          flex-shrink: 0;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: var(--bg-tint);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .tmn__avatar i {
          color: var(--accent);
          font-size: 16px;
        }

        .tmn__cardBody {
          flex: 1;
          min-width: 0;
        }

        .tmn__cardName {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 4px;
        }

        .tmn__cardMeta {
          display: flex;
          flex-direction: column;
          gap: 3px;
          font-size: 11px;
          color: var(--text-muted);
        }

        .tmn__cardMeta span {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .tmn__cardMeta i {
          font-size: 10px;
          color: var(--text-faint);
          width: 11px;
        }

        .tmn__cardRight {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .tmn__cardEarned {
          font-size: 13.5px;
          font-weight: 700;
          color: var(--success);
        }

        .tmn__cardChevron {
          color: var(--text-faint);
          font-size: 12px;
        }

        .tmn__empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 30px 20px;
        }

        .tmn__emptyIcon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: var(--bg-card-alt);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
        }

        .tmn__emptyIcon i {
          font-size: 22px;
          color: var(--text-faint);
        }

        .tmn__emptyTitle {
          font-size: 14.5px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .tmn__emptySubtitle {
          font-size: 12px;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}

export default TeamNetwork;
