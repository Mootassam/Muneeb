import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SubHeader from "src/view/shared/Header/SubHeader";
import selectors from 'src/modules/notification/list/notificationListSelectors';
import actions from 'src/modules/notification/list/notificationListActions';
import actionsForm from 'src/modules/notification/form/notificationFormActions';
import LoadingModal from "src/shared/LoadingModal";
import { i18n } from "../../../i18n";

const FILTERS = [
  { key: "all", icon: "fa-solid fa-bell" },
  { key: "deposit", icon: "fa-solid fa-arrow-down" },
  { key: "withdraw", icon: "fa-solid fa-arrow-up" },
];

const HAS_AMOUNT_TYPES = [
  "deposit_success",
  "deposit_canceled",
  "withdraw_success",
  "withdraw_canceled",
];

function Notifications() {
  const [filter, setFilter] = useState("all");
  const dispatch = useDispatch();
  const rows = useSelector(selectors.selectRows);
  const loading = useSelector(selectors.selectLoading);

  useEffect(() => {
    dispatch(actions.doFetch());
  }, [dispatch]);

  const asRead = (id) => {
    dispatch(actionsForm.doMarkAsRead(id));
  };

  const filteredNotifications = rows.filter((notification) => {
    if (filter === "deposit") {
      return notification.type.includes("deposit");
    }
    if (filter === "withdraw") {
      return notification.type.includes("withdraw");
    }
    return true;
  });

  const unreadCount = rows.filter((n) => n.status === "unread").length;

  const getNotificationMessage = (notification) => {
    const amount = notification.amount || "0";

    switch (notification.type) {
      case "deposit_success":
        return i18n("pages.notifications.messages.deposit_success", amount);
      case "deposit_canceled":
        return i18n("pages.notifications.messages.deposit_canceled", amount);
      case "withdraw_success":
        return i18n("pages.notifications.messages.withdraw_success", amount);
      case "withdraw_canceled":
        return i18n("pages.notifications.messages.withdraw_canceled", amount);
      case "system":
        return i18n("pages.notifications.messages.system");
      case "alert":
        return i18n("pages.notifications.messages.alert");
      default:
        return i18n("pages.notifications.messages.default");
    }
  };

  const getNotificationTitle = (type) => {
    switch (type) {
      case "deposit_success":
        return i18n("pages.notifications.types.deposit_success");
      case "deposit_canceled":
        return i18n("pages.notifications.types.deposit_canceled");
      case "withdraw_success":
        return i18n("pages.notifications.types.withdraw_success");
      case "withdraw_canceled":
        return i18n("pages.notifications.types.withdraw_canceled");
      case "system":
        return i18n("pages.notifications.types.system");
      case "alert":
        return i18n("pages.notifications.types.alert");
      default:
        return i18n("pages.notifications.types.default");
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "deposit_success":
      case "withdraw_success":
        return "fa-solid fa-circle-check";
      case "deposit_canceled":
      case "withdraw_canceled":
        return "fa-solid fa-circle-xmark";
      case "system":
        return "fa-solid fa-gear";
      case "alert":
        return "fa-solid fa-triangle-exclamation";
      default:
        return "fa-solid fa-bell";
    }
  };

  const getNotificationColorClass = (type) => {
    switch (type) {
      case "deposit_success":
      case "withdraw_success":
        return "ntf__icon--success";
      case "deposit_canceled":
      case "withdraw_canceled":
        return "ntf__icon--canceled";
      case "system":
        return "ntf__icon--system";
      case "alert":
        return "ntf__icon--alert";
      default:
        return "ntf__icon--default";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      <SubHeader title={i18n("pages.notifications.title")} />

      <div className="ntf__page">
        <div className="ntf__card">
          <div className="ntf__tabs">
            {FILTERS.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`ntf__tab ${filter === item.key ? "ntf__tab--active" : ""}`}
                onClick={() => setFilter(item.key)}
              >
                <i className={item.icon}></i>
                {i18n(`pages.notifications.filters.${item.key}`)}
              </button>
            ))}
          </div>

          {!loading && (
            <div className="ntf__listHeader">
              <span className="ntf__listTitle">
                {i18n("pages.notifications.totalCount", filteredNotifications.length)}
              </span>
              {unreadCount > 0 && (
                <span className="ntf__listCount">
                  {i18n("pages.notifications.unreadCount", unreadCount)}
                </span>
              )}
            </div>
          )}

          {loading && (
            <div className="ntf__loading">
              <LoadingModal />
            </div>
          )}

          {!loading && filteredNotifications.length === 0 && (
            <div className="ntf__empty">
              <i className="fa-solid fa-bell-slash"></i>
              <span className="ntf__emptyTitle">
                {i18n("pages.notifications.emptyState.title")}
              </span>
              <p className="ntf__emptyText">
                {i18n(
                  "pages.notifications.emptyState.description",
                  filter !== "all" ? i18n(`pages.notifications.filters.${filter}`) : ""
                )}
              </p>
            </div>
          )}

          {!loading && filteredNotifications.length > 0 && (
            <div className="ntf__list">
              {filteredNotifications.map((notification) => {
                const isUnread = notification.status === "unread";
                const showAmount =
                  notification.amount && HAS_AMOUNT_TYPES.includes(notification.type);

                return (
                  <div
                    key={notification.id}
                    className="ntf__row"
                    onClick={() => isUnread && asRead(notification.id)}
                  >
                    <span className={`ntf__icon ${getNotificationColorClass(notification.type)}`}>
                      <i className={getNotificationIcon(notification.type)}></i>
                    </span>

                    <div className="ntf__body">
                      <div className="ntf__titleRow">
                        {isUnread && <span className="ntf__dot"></span>}
                        <span className="ntf__title">
                          {getNotificationTitle(notification.type)}
                        </span>
                      </div>

                      <p className="ntf__message">
                        {getNotificationMessage(notification)}
                      </p>

                      <div className="ntf__meta">
                        {showAmount && (
                          <span className="ntf__amount">
                            <i className="fa-solid fa-coins"></i>
                            {notification.amount} USDT
                          </span>
                        )}
                        <span className="ntf__date">
                          {formatDate(notification.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .ntf__page {
          min-height: 100vh;
          background: #06070b;
          display: flex;
          justify-content: center;
          padding: 20px 14px 100px;
          font-family: "Poppins", -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .ntf__card {
          max-width: 400px;
          width: 100%;
          background: #14151d;
          padding: 18px;
          border-radius: 22px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          color: #eaecef;
        }

        .ntf__tabs {
          display: flex;
          gap: 6px;
          background: #1a1c26;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 14px;
          padding: 4px;
          margin-bottom: 18px;
        }

        .ntf__tab {
          flex: 1;
          margin: 0;
          background: transparent;
          border: none;
          border-radius: 10px;
          padding: 10px 4px;
          font-size: 12.5px;
          font-weight: 700;
          color: #848e9c;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .ntf__tab i {
          font-size: 11px;
        }

        .ntf__tab--active {
          background: #f0b90b;
          color: #0b0e11;
        }

        .ntf__listHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
          padding: 0 2px;
        }

        .ntf__listTitle {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #5e6673;
        }

        .ntf__listCount {
          font-size: 11px;
          font-weight: 600;
          color: #f0b90b;
          background: rgba(240, 185, 11, 0.12);
          padding: 3px 9px;
          border-radius: 20px;
        }

        .ntf__list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .ntf__row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: #1a1c26;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 14px;
          padding: 13px 14px;
          cursor: pointer;
        }

        .ntf__icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 14px;
          margin-top: 1px;
        }

        .ntf__icon--success {
          background: rgba(14, 203, 129, 0.12);
          color: #0ecb81;
        }

        .ntf__icon--canceled {
          background: rgba(246, 70, 93, 0.12);
          color: #f6465d;
        }

        .ntf__icon--system {
          background: rgba(56, 189, 248, 0.12);
          color: #38bdf8;
        }

        .ntf__icon--alert {
          background: rgba(240, 185, 11, 0.12);
          color: #f0b90b;
        }

        .ntf__icon--default {
          background: rgba(132, 142, 156, 0.12);
          color: #848e9c;
        }

        .ntf__body {
          flex: 1;
          min-width: 0;
        }

        .ntf__titleRow {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .ntf__dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #f0b90b;
          flex-shrink: 0;
        }

        .ntf__title {
          font-size: 14px;
          font-weight: 700;
          color: #f5f6f8;
        }

        .ntf__message {
          font-size: 12.5px;
          color: #848e9c;
          line-height: 1.5;
          margin: 4px 0 8px;
        }

        .ntf__meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding-top: 8px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .ntf__amount {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
          color: #eaecef;
        }

        .ntf__amount i {
          color: #f0b90b;
          font-size: 11px;
        }

        .ntf__date {
          font-size: 11px;
          color: #5e6673;
          margin-left: auto;
        }

        .ntf__loading {
          padding: 40px 0;
          display: flex;
          justify-content: center;
        }

        .ntf__empty {
          text-align: center;
          padding: 46px 16px 30px;
        }

        .ntf__empty i {
          font-size: 32px;
          color: #3a3d47;
          margin-bottom: 14px;
        }

        .ntf__emptyTitle {
          display: block;
          font-size: 14px;
          font-weight: 700;
          color: #eaecef;
          margin-bottom: 6px;
        }

        .ntf__emptyText {
          font-size: 12.5px;
          color: #848e9c;
          margin: 0;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}

export default Notifications;
