import React from "react";
import { Link, useLocation } from "react-router-dom";
import { i18n } from "../../i18n";

function TabBottomNavigator() {
  const location = useLocation();

  const isActive = (pathname, alsoMatch?: string[]) =>
    location.pathname === pathname || Boolean(alsoMatch?.includes(location.pathname));

  const tabs = [
    {
      icon: "fas fa-home",
      path: "/",
      name: i18n('pages.tabBottomNavigator.home'),
    },
    {
      icon: "fa-solid fa-clipboard-list",
      path: "/Order",
      name: i18n('pages.tabBottomNavigator.records'),
    },
    {
      icon: "fas fa-flag",
      path: "/vip-select",
      name: i18n('pages.tabBottomNavigator.grap'),
      isCenter: true,
      alsoMatch: ["/grap"],
    },
    {
      icon: "fas fa-phone-alt",
      path: "/Online",
      name: i18n('pages.tabBottomNavigator.customerService'),
    },
    {
      icon: "fas fa-user-circle",
      path: "/profile",
      name: i18n('pages.tabBottomNavigator.myProfile'),
    },
  ];

  return (
    <div className="tnav__bar">
      {tabs.map((item, index) =>
        item.isCenter ? (
          <Link key={index} to={item.path} className="tnav__link tnav__link--center">
            <span className="tnav__centerBtn">
              <i className={item.icon}></i>
            </span>
            <span className={`tnav__label tnav__label--center ${isActive(item.path, item.alsoMatch) ? "is-active" : ""}`}>
              {item.name}
            </span>
          </Link>
        ) : (
          <Link key={index} to={item.path} className="tnav__link">
            <span className={`tnav__iconWrap ${isActive(item.path) ? "is-active" : ""}`}>
              <i className={item.icon}></i>
            </span>
            <span className={`tnav__label ${isActive(item.path) ? "is-active" : ""}`}>
              {item.name}
            </span>
          </Link>
        )
      )}

      <style>{`
        .tnav__bar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 100;
          max-width: 400px;
          margin: 0 auto;
          display: flex;
          align-items: flex-end;
          justify-content: space-around;
          height: 64px;
          padding: 0 6px env(safe-area-inset-bottom, 0);
          background: var(--bg-card);
          border-top: 1px solid var(--border-soft);
          border-radius: 18px 18px 0 0;
          box-shadow: 0 -8px 24px -14px rgba(15, 17, 17, 0.25);
          font-family: "Poppins", "Helvetica Neue", Arial, sans-serif;
        }

        .tnav__link {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          min-width: 0;
          height: 100%;
          padding-top: 8px;
          color: inherit;
          text-decoration: none;
        }

        .tnav__iconWrap {
          width: 34px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          color: var(--text-muted);
          transition: color 0.15s ease, background-color 0.15s ease;
        }

        .tnav__iconWrap i {
          font-size: 17px;
        }

        .tnav__iconWrap.is-active {
          color: #ff6a00;
          background: var(--bg-tint);
        }

        .tnav__label {
          font-size: 9.5px;
          line-height: 1.2;
          font-weight: 500;
          color: var(--text-muted);
          max-width: 100%;
          transition: color 0.15s ease;
        }

        .tnav__label.is-active {
          color: #ff6a00;
          font-weight: 700;
        }

        /* center raised action button */
        .tnav__link--center {
          position: relative;
          padding-top: 0;
          gap: 2px;
        }

        .tnav__centerBtn {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(160deg, #ffb84d, #ff6a00);
          color: #fff;
          box-shadow: 0 8px 16px -4px rgba(255, 106, 0, 0.5);
          border: 3px solid var(--bg-card);
          transform: translateY(-16px);
          margin-bottom: -10px;
        }

        .tnav__centerBtn i {
          font-size: 19px;
        }

        .tnav__label--center {
          margin-top: -4px;
        }

        .tnav__label--center.is-active {
          color: #ff6a00;
        }
      `}</style>
    </div>
  );
}

export default TabBottomNavigator;
