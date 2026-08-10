import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./styles/style.css";
import { i18n } from "../../i18n";


function TabBottomNavigator() {
  const location = useLocation();

  const isActive = (pathname) => location.pathname === pathname;

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
      path: "/grap",
      name: i18n('pages.tabBottomNavigator.grap'),
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
    <div className="tabbottomNavigator">
      {tabs.map((item, index) => (
        <Link key={index} to={item.path} className="tabLink">
          <div className="singleTab">
            <i
              className={`${item.icon} ${isActive(item.path) ? "active" : ""}`}
            ></i>
            <p className={`text__link ${isActive(item.path) ? "active" : ""}`}>
              {item.name}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default TabBottomNavigator;
