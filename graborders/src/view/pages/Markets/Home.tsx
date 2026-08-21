import React, { useEffect, useState, useCallback, memo } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import authSelectors from "src/modules/auth/authSelectors";
import notificationActions from "src/modules/notification/list/notificationListActions";
import notificationSelectors from "src/modules/notification/list/notificationListSelectors";
import { i18n } from "../../../i18n";
import productImages from "src/shared/data/images";
import AnnouncementTicker from "./AnnouncementTicker";

const HERO_SLIDES = productImages.slice(0, 6);

const QUICK_ACTIONS = [
  { icon: "fa-solid fa-arrow-down", label: "recharge", link: "/deposit" },
  { icon: "fa-solid fa-arrow-up", label: "withdraw", link: "/withdraw" },
  { icon: "fa-solid fa-user-group", label: "teams", link: "/team" },
  { icon: "fa-solid fa-user-plus", label: "invitation", link: "/invitation" },
];

const PLATFORM_CARDS = [
  { icon: "fa-solid fa-shop", titleKey: "profileTitle", textKey: "profileText", link: "/company" },
  { icon: "fa-solid fa-scale-balanced", titleKey: "rulesTitle", textKey: "rulesText", link: "/tc" },
  { icon: "fa-solid fa-handshake", titleKey: "cooperationTitle", textKey: "cooperationText", link: "/cooperation" },
  { icon: "fa-solid fa-book-open", titleKey: "instructionsTitle", textKey: "instructionsText", link: "/faqs" },
];

function Home() {
  const dispatch = useDispatch();
  const currentUser = useSelector(authSelectors.selectCurrentUser);
  const unread = useSelector(notificationSelectors.selectUnread);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [showNotificationModal, setShowNotificationModal] = useState(
    !!currentUser?.notification
  );

  useEffect(() => {
    if (currentUser?.notification) {
      setShowNotificationModal(true);
    }
  }, [currentUser?.notification]);

  const fetchUnread = useCallback(() => {
    dispatch(notificationActions.fetchUnreadNotifications());
  }, [dispatch]);

  useEffect(() => {
    fetchUnread();
  }, [fetchUnread]);

  useEffect(() => {
    const sliderInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(sliderInterval);
  }, []);

  const greeting = currentUser?.fullName
    ? `${i18n("pages.home.welcome")}, ${currentUser.fullName}`
    : i18n("pages.home.welcomeGuest");

  return (
    <div className="home__page">
      {/* Top bar */}
      <div className="home__topbar">
        <div className="home__logo">
          <span className="home__logoBadge">E</span>
          <span className="home__logoWord">
            clicks<span className="home__logoDot">.</span>
          </span>
        </div>

        <div className="home__topActions">
          <Link to="/search" className="home__iconBtn" aria-label="Search">
            <i className="fa-solid fa-magnifying-glass"></i>
          </Link>
          <Link to="/notifications" className="home__iconBtn" aria-label="Notifications">
            <i className="fa-solid fa-bell"></i>
            {unread > 0 && <span className="home__iconBadge">{unread > 99 ? "99+" : unread}</span>}
          </Link>
        </div>
      </div>

      <div className="home__body">
        {/* Welcome + balance */}
        <div className="home__welcomeRow">
          <div className="home__welcomeText">
            <div className="home__greeting">{greeting}</div>
            <div className="home__subtitle">{i18n("pages.home.dashboardSubtitle")}</div>
          </div>

          <Link to="/wallet" className="home__balanceCard">
            <div className="home__balanceLabel">{i18n("pages.profile.balance")}</div>
            <div className="home__balanceValue">
              {currentUser?.balance?.toFixed(2) || "0.00"}
              <span className="home__balanceCurrency">USD</span>
            </div>
          </Link>
        </div>

        {/* Hero carousel */}
        <div className="home__hero">
          {HERO_SLIDES.map((slide, index) => (
            <div
              key={slide.url}
              className={`home__heroSlide ${index === currentSlide ? "home__heroSlide--active" : ""}`}
              style={{ backgroundImage: `url(${slide.url})` }}
            />
          ))}
        </div>
        <div className="home__heroDots">
          {HERO_SLIDES.map((slide, index) => (
            <button
              key={slide.url}
              type="button"
              className={`home__heroDot ${index === currentSlide ? "home__heroDot--active" : ""}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Quick actions */}
        <div className="home__actionsGrid">
          {QUICK_ACTIONS.map((item) => (
            <Link key={item.link} to={item.link} className="home__actionItem">
              <span className="home__actionIcon">
                <i className={item.icon}></i>
              </span>
              <span className="home__actionLabel">
                {i18n(`pages.home.quickActions.${item.label}`)}
              </span>
            </Link>
          ))}
        </div>

        {/* Withdraw ticker */}
        <AnnouncementTicker />

        {/* Platform introduction */}
        <div className="home__eyebrow">{i18n("pages.home.eyebrow.platform")}</div>
        <div className="home__sectionTitle">{i18n("pages.home.platformIntro.title")}</div>
        <div className="home__platformGrid">
          {PLATFORM_CARDS.map((item) => (
            <Link className="home__platformCard" key={item.titleKey} to={item.link}>
              <span className="home__platformIcon">
                <i className={item.icon}></i>
              </span>
              <div className="home__platformTitle">
                {i18n(`pages.home.platformIntro.${item.titleKey}`)}
              </div>
              <div className="home__platformText">
                {i18n(`pages.home.platformIntro.${item.textKey}`)}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Admin notification modal */}
      {showNotificationModal && currentUser?.notification && (
        <div className="home__modalOverlay" onClick={() => setShowNotificationModal(false)}>
          <div className="home__modalCard" onClick={(e) => e.stopPropagation()}>
            <div className="home__modalHeader">
              <div className="home__modalTitle">
                <i className="fa-solid fa-bell"></i>
                {i18n("common.notification") || "Important Notice"}
              </div>
              <i
                className="fa-solid fa-xmark home__modalClose"
                onClick={() => setShowNotificationModal(false)}
              ></i>
            </div>

            <p className="home__noticeText">{currentUser.notification}</p>

            <button
              className="home__modalConfirmBtn home__modalConfirmBtn--full"
              onClick={() => setShowNotificationModal(false)}
            >
              <i className="fa-solid fa-check"></i>
              I Understand
            </button>
          </div>
        </div>
      )}

      <style>{`
        .home__page {
          background: var(--bg-page);
          color: var(--text-primary);
          font-family: "Poppins", -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        /* Top bar */
        .home__topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 16px 0;
        }

        .home__logo {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .home__logoBadge {
          width: 30px;
          height: 30px;
          border-radius: 9px;
          background: linear-gradient(160deg, var(--accent-grad-start), var(--accent-grad-end));
          color: var(--accent-text-on);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 15px;
          box-shadow: 0 6px 14px -4px rgba(255, 138, 0, 0.55);
        }

        .home__logoWord {
          font-size: 19px;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.2px;
        }

        .home__logoDot {
          color: var(--accent);
        }

        .home__topActions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .home__iconBtn {
          position: relative;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: var(--bg-card);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px var(--shadow-color);
          text-decoration: none;
        }

        .home__iconBtn i {
          color: var(--text-primary);
          font-size: 14px;
        }

        .home__iconBadge {
          position: absolute;
          top: -3px;
          right: -4px;
          background: #f6465d;
          color: #fff;
          border-radius: 999px;
          min-width: 15px;
          height: 15px;
          padding: 0 3px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 8.5px;
          font-weight: 700;
          line-height: 1;
        }

        /* Body */
        .home__body {
          padding: 14px 14px 24px;
        }

        /* Welcome + balance */
        .home__welcomeRow {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 16px;
        }

        .home__greeting {
          font-size: 17px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .home__subtitle {
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 3px;
        }

        .home__balanceCard {
          flex-shrink: 0;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 9px 14px;
          text-align: right;
          text-decoration: none;
          box-shadow: 0 6px 16px var(--shadow-color);
        }

        .home__balanceLabel {
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--text-muted);
        }

        .home__balanceValue {
          font-size: 17px;
          font-weight: 800;
          color: var(--accent);
          margin-top: 2px;
        }

        .home__balanceCurrency {
          font-size: 10.5px;
          font-weight: 700;
          color: var(--text-muted);
          margin-left: 4px;
        }

        /* Hero carousel */
        .home__hero {
          position: relative;
          height: 190px;
          border-radius: 20px;
          overflow: hidden;
          background: var(--bg-card);
          border: 1px solid var(--border);
          box-shadow: 0 10px 24px var(--shadow-color);
        }

        .home__heroSlide {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          opacity: 0;
          transition: opacity 0.6s ease;
        }

        .home__heroSlide--active {
          opacity: 1;
        }

        .home__heroDots {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 5px;
          margin: 10px 0 18px;
        }

        .home__heroDot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--border-strong);
          border: none;
          margin: 0;
          padding: 0;
          cursor: pointer;
        }

        .home__heroDot--active {
          background: linear-gradient(180deg, var(--accent-grad-start), var(--accent-grad-end));
          width: 16px;
          border-radius: 4px;
        }

        /* Quick actions */
        .home__actionsGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin-bottom: 16px;
        }

        .home__actionItem {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 14px 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          box-shadow: 0 6px 16px var(--shadow-color);
        }

        .home__actionIcon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(160deg, var(--accent-grad-start), var(--accent-grad-end));
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 14px -4px rgba(255, 138, 0, 0.55);
        }

        .home__actionIcon i {
          color: var(--accent-text-on);
          font-size: 15px;
        }

        .home__actionLabel {
          font-size: 10.5px;
          font-weight: 700;
          color: var(--text-primary);
          text-align: center;
        }

        .home__eyebrow {
          font-size: 10.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--accent);
          margin-bottom: 5px;
        }

        .home__sectionTitle {
          font-size: 18px;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 14px;
        }

        /* Platform introduction */
        .home__platformGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .home__platformCard {
          display: block;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 6px 16px var(--shadow-color);
          text-decoration: none;
        }

        .home__platformIcon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: var(--bg-tint);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
        }

        .home__platformIcon i {
          color: var(--accent);
          font-size: 16px;
        }

        .home__platformTitle {
          font-size: 13.5px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 5px;
        }

        .home__platformText {
          font-size: 11.5px;
          color: var(--text-muted);
          line-height: 1.5;
        }

        /* Modal */
        .home__modalOverlay {
          position: fixed;
          inset: 0;
          background: var(--overlay);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 1000;
        }

        .home__modalCard {
          width: 100%;
          max-width: 360px;
          max-height: 86vh;
          overflow-y: auto;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 18px;
          padding: 20px;
        }

        .home__modalHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .home__modalTitle {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .home__modalTitle i {
          color: var(--accent);
        }

        .home__modalClose {
          color: var(--text-faint);
          cursor: pointer;
          font-size: 16px;
        }

        .home__modalClose:hover {
          color: var(--text-primary);
        }

        .home__modalConfirmBtn {
          flex: 1;
          margin: 0;
          background: linear-gradient(180deg, var(--accent-grad-start), var(--accent-grad-end));
          border: none;
          border-radius: 12px;
          color: var(--accent-text-on);
          font-size: 13px;
          font-weight: 700;
          padding: 12px 0;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .home__modalConfirmBtn--full {
          width: 100%;
        }

        .home__noticeText {
          font-size: 13.5px;
          color: var(--text-secondary);
          line-height: 1.7;
          white-space: pre-wrap;
          margin: 0 0 18px;
        }
      `}</style>
    </div>
  );
}

export default memo(Home);
