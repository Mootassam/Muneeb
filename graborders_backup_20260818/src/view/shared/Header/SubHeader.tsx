import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from 'react-router-dom';
import actions from 'src/modules/notification/list/notificationListActions';
import selectors from 'src/modules/notification/list/notificationListSelectors';
import { Link } from "react-router-dom";
function SubHeader(props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const unread = useSelector(selectors.selectUnread);
  const loading = useSelector(selectors.UnreadLoading);


  useEffect(() => {
    dispatch(actions.fetchUnreadNotifications())
  }, [dispatch])

  const goBack = () => {
    history.goBack();
  };


  return (
    <div className="subheader-container">
      <div className="subheader-content">
        <div className="back-button" onClick={goBack}>
          <i className="fa-solid fa-arrow-left back-icon"></i>
        </div>
        <h3 className="subheader-title">{props?.title}</h3>
        <Link to="/notifications" className="notification-container">
          <div className="notification-icons">
            <i className="fa-solid fa-bell"></i>
            {unread > 0 && !loading && (
              <div className="notification-badge">
                {unread > 99 ? '99+' : unread}
              </div>
            )}
          </div>
        </Link>
      </div>

      <style>{`
        .subheader-container {
          background: var(--bg-card);
          border-bottom: 1px solid var(--border);
          padding: 13px 16px;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .subheader-content {
          display: flex;
          align-items: center;
          max-width: 400px;
          margin: 0 auto;
        }

        .back-button,
        .notification-container {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          cursor: pointer;
          flex-shrink: 0;
        }

        .notification-container {
          justify-content: flex-end;
          text-decoration: none;
        }

        .notification-icons {
          position: relative;
          display: flex;
          align-items: center;
        }

        .back-icon,
        .notification-icons i {
          color: var(--text-primary);
          font-size: 18px;
        }

        @media (hover: hover) {
          .back-button:hover .back-icon,
          .notification-container:hover .notification-icons i {
            color: #ff6a00;
          }
        }

        .back-button:active .back-icon,
        .notification-container:active .notification-icons i {
          opacity: 0.5;
        }

        .subheader-title {
          color: var(--text-primary);
          font-size: 16px;
          font-weight: 600;
          margin: 0;
          flex: 1;
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          padding: 0 10px;
        }

        .notification-badge {
          position: absolute;
          top: -3px;
          right: -6px;
          background: #f6465d;
          color: #fff;
          border-radius: 999px;
          min-width: 15px;
          height: 15px;
          padding: 0 3px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          font-weight: 700;
          line-height: 1;
        }
      `}</style>
    </div>
  );
}

export default SubHeader;
