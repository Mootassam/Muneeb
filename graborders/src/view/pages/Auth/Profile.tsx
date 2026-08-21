import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import "../styles/styles.css";
import authActions from "src/modules/auth/authActions";
import authSelectors from "src/modules/auth/authSelectors";
import actions from "src/modules/record/list/recordListActions";
import selectors from "src/modules/record/list/recordListSelectors";
import Message from "src/view/shared/message";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import yupFormSchemas from "src/modules/shared/yup/yupFormSchemas";
import { i18n, i18nExists } from "../../../i18n";
import ImagesFormItem from "src/shared/form/ImagesFormItems";
import Storage from "src/security/storage";
import { getTheme, toggleTheme } from "src/theme";

const schema = yup.object().shape({
  passportPhoto: yupFormSchemas.images(i18n("inputs.passportPhoto"), {
    max: 1,
  }),
});

const QUICK_ACCESS = [
  { icon: "fa-solid fa-people-group", label: "Teams", url: "/team" },
  { icon: "fa-solid fa-chart-simple", label: "Record", url: "/order" },
  { icon: "fa-solid fa-wallet", label: "Wallet", url: "/wallet" },
  { icon: "fa-solid fa-link", label: "Invite", url: "/invitation" },
];

function Profile() {
  const dispatch = useDispatch();
  const history = useHistory();
  const totalperday = useSelector(selectors.selectTotalPerday);
  const currentUser = useSelector(authSelectors.selectCurrentUser);

  const referenceCodeRef = useRef<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => getTheme() === "dark");

  const handleToggleTheme = () => {
    setIsDarkMode(toggleTheme() === "dark");
  };

  useEffect(() => {
    const values = { status: "completed" };
    dispatch(actions.doCountDay());
    dispatch(actions.doFetch(values, values));
  }, [dispatch]);

  const doSignout = () => {
    dispatch(authActions.doSignout());
  };

  const [initialValues] = useState(() => {
    const record = currentUser || {};

    return {
      passportPhoto: record.passportPhoto || [],
    };
  });

  const form = useForm({
    resolver: yupResolver(schema),
    mode: "all",
    defaultValues: initialValues,
  });

  const goto = (param) => {
    history.push(param);
  };

  const copyToClipboardCoupon = () => {
    const referenceCode = referenceCodeRef.current.innerText;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(referenceCode)
        .then(() => Message.success(i18n('pages.profile.copied')))
        .catch((error) => console.error("Error copying to clipboard:", error));
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = referenceCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      Message.success(i18n('pages.profile.copied'));
    }
  };

  const links = [
    {
      icon: "fa-solid fa-clock-rotate-left",
      name: i18n('pages.profile.history'),
      url: "/transacation"
    },
    {
      icon: "fa-solid fa-headset",
      name: i18n('pages.profile.contactUs'),
      url: "/online"
    },
    {
      icon: "fa-solid fa-shield",
      name: i18n('pages.profile.security'),
      url: "/security"
    },
    {
      icon: "fa-solid fa-bell",
      name: i18n('pages.profile.notifications'),
      url: "/notifications"
    },
    {
      icon: "fa-solid fa-globe",
      name: i18n('pages.profile.languages'),
      url: "/languages"
    }
  ];

  const scorePct = currentUser?.score || 100;
  const balance = currentUser?.balance?.toFixed(2) || "0.00";
  const frozen = currentUser?.freezeblance?.toFixed(2) || "0.00";

  return (
    <div className="acc__page">
      <div className="acc__wrap">
        {/* Identity card */}
        <div className="acc__identity">
          <div className="acc__avatar">
            <FormProvider {...form}>
              <form>
                <ImagesFormItem
                  name="passportPhoto"
                  storage={Storage.values.userAvatarsProfiles}
                  max={1}
                />
              </form>
            </FormProvider>
          </div>
          <div className="acc__identityText">
            <div className="acc__nameRow">
              <span className="acc__name">
                {currentUser?.fullName || currentUser?.email}
              </span>
              {currentUser?.vip?.title && (
                <span className="acc__vipTag">
                  <i className="fa-solid fa-crown"></i>
                  {currentUser.vip.title}
                </span>
              )}
            </div>
            <div className="acc__email">{currentUser?.email}</div>
            <button className="acc__codeChip" onClick={copyToClipboardCoupon}>
              <span ref={referenceCodeRef}>{currentUser?.refcode}</span>
              <i className="fa-regular fa-copy"></i>
            </button>
          </div>
          <Link to="/security" className="acc__gear" aria-label="Account settings">
            <i className="fa-solid fa-gear"></i>
          </Link>
        </div>

        {/* Balance strip */}
        <div className="acc__statStrip">
          <div className="acc__statCol">
            <div className="acc__statValue acc__statValue--lg">{balance}</div>
            <div className="acc__statLabel">{i18n('pages.profile.balance')} (USD)</div>
          </div>
          <div className="acc__statCol">
            <div className="acc__statValue">{scorePct}%</div>
            <div className="acc__statLabel">{i18n('pages.profile.creditScore')}</div>
          </div>
          <div className="acc__statCol">
            <div className="acc__statValue">{totalperday}</div>
            <div className="acc__statLabel">{i18n('pages.profile.todayProfit')}</div>
          </div>
          <div className="acc__statCol">
            <div className="acc__statValue">{frozen}</div>
            <div className="acc__statLabel">{i18n('pages.profile.frozenAmount')}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="acc__actionRow">
          <button className="acc__primaryBtn" onClick={() => goto("/deposit")}>
            <i className="fa-solid fa-plus"></i>
            {i18n('pages.profile.recharge')}
          </button>
          <button className="acc__secondaryBtn" onClick={() => goto("/withdraw")}>
            <i className="fa-solid fa-arrow-right-arrow-left"></i>
            {i18n('pages.profile.withdraw')}
          </button>
        </div>

        {/* Quick access rail */}
        <div className="acc__rail">
          {QUICK_ACCESS.map((item) => (
            <Link key={item.url} to={item.url} className="acc__railItem">
              <span className="acc__railIcon">
                <i className={item.icon}></i>
              </span>
              <span className="acc__railLabel">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Account list */}
        <div className="acc__groupLabel">Account</div>
        <div className="acc__list">
          {links.map((item, index) => (
            <Link key={index} to={item.url} className="acc__listRow">
              <span className="acc__listIcon">
                <i className={item.icon}></i>
              </span>
              <span className="acc__listLabel">{item.name}</span>
              <i className="fa-solid fa-chevron-right acc__listChevron"></i>
            </Link>
          ))}

          <div className="acc__listRow acc__listRow--static">
            <span className="acc__listIcon">
              <i className={isDarkMode ? "fa-solid fa-moon" : "fa-solid fa-sun"}></i>
            </span>
            <span className="acc__listLabel">
              {i18nExists('pages.profile.appTheme') ? i18n('pages.profile.appTheme') : 'App Theme'}
            </span>
            <button
              type="button"
              className={`acc__switch ${isDarkMode ? "is-dark" : ""}`}
              role="switch"
              aria-checked={isDarkMode}
              onClick={handleToggleTheme}
            >
              <span className="acc__switchThumb">
                <i className={isDarkMode ? "fa-solid fa-moon" : "fa-solid fa-sun"}></i>
              </span>
            </button>
          </div>

          <div className="acc__listDivider" />

          <button className="acc__listRow acc__listRow--danger" onClick={doSignout}>
            <span className="acc__listIcon acc__listIcon--danger">
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
            </span>
            <span className="acc__listLabel acc__listLabel--danger">
              {i18n('pages.profile.logout')}
            </span>
          </button>
        </div>

        <div className="acc__footerNote">
          <i className="fa-solid fa-shield-halved"></i>
          {i18nExists('pages.profile.secureNote') ? i18n('pages.profile.secureNote') : 'Secured · 256-bit encryption'}
        </div>
      </div>

      <style>{`
        .acc__page {
          min-height: 100vh;
          width: 100%;
          overflow-x: hidden;
          background: var(--bg-page);
          font-family: "Poppins", "Helvetica Neue", Arial, sans-serif;
          padding: 18px 0 100px;
          box-sizing: border-box;
        }

        .acc__page *,
        .acc__page *::before,
        .acc__page *::after {
          box-sizing: border-box;
        }

        .acc__wrap {
          max-width: 420px;
          margin: 0 auto;
          padding: 0 16px;
        }

        /* identity */
        .acc__identity {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 12px;
          box-shadow: 0 2px 8px -4px rgba(15, 17, 17, 0.08);
        }

        .acc__avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: var(--bg-tint-strong);
          border: 2px solid #ff9900;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
        }

        .profile-avatar {
          display: flex;
        }

        .avatar-placeholder {
          width: 64px !important;
          height: 64px !important;
          border-radius: 50% !important;
          background: var(--bg-tint-strong) !important;
          border: none !important;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: #ff8a00;
        }

        .acc__avatar .img-card {
          width: 64px !important;
          height: 64px !important;
          border: none !important;
          border-radius: 50% !important;
        }

        .acc__avatar .header__profile__image {
          width: 64px !important;
          height: 64px !important;
          border-radius: 50% !important;
        }

        .acc__identityText {
          flex: 1;
          min-width: 0;
          padding-top: 2px;
        }

        .acc__nameRow {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .acc__name {
          font-size: 15.5px;
          font-weight: 700;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .acc__vipTag {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: linear-gradient(135deg, #ffd668, #ff9900);
          color: #1a1200;
          font-size: 9.5px;
          font-weight: 800;
          padding: 3px 9px 3px 7px;
          border-radius: 999px;
        }

        .acc__vipTag i {
          font-size: 8px;
        }

        .acc__email {
          font-size: 11.5px;
          color: var(--text-tertiary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-top: 1px;
        }

        .acc__codeChip {
          margin-top: 9px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--bg-tint-soft);
          border: 1px solid var(--tint-border);
          border-radius: 999px;
          padding: 4px 10px;
          font-size: 11px;
          font-weight: 700;
          color: var(--tint-text);
          font-family: 'Consolas', 'Courier New', monospace;
          cursor: pointer;
        }

        .acc__codeChip i {
          color: #ff6a00;
          font-size: 10px;
        }

        .acc__gear {
          flex-shrink: 0;
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: var(--bg-card-alt);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-tertiary);
          text-decoration: none;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .acc__gear:hover {
          color: #ff6a00;
          border-color: #ff6a00;
        }

        /* stat strip */
        .acc__statStrip {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 16px 8px;
          margin-bottom: 12px;
          box-shadow: 0 2px 8px -4px rgba(15, 17, 17, 0.08);
        }

        .acc__statCol {
          text-align: center;
          padding: 0 4px;
          border-left: 1px solid var(--border-soft);
        }

        .acc__statCol:first-child {
          border-left: none;
        }

        .acc__statValue {
          font-size: 14px;
          font-weight: 800;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .acc__statValue--lg {
          font-size: 17px;
          color: #ff6a00;
        }

        .acc__statLabel {
          font-size: 9.5px;
          color: var(--text-muted);
          margin-top: 4px;
          line-height: 1.3;
        }

        /* actions */
        .acc__actionRow {
          display: flex;
          gap: 10px;
          margin-bottom: 16px;
        }

        .acc__primaryBtn,
        .acc__secondaryBtn {
          flex: 1;
          border-radius: 10px;
          padding: 12px;
          font-weight: 700;
          font-size: 13.5px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: filter 0.15s ease, border-color 0.15s ease, color 0.15s ease;
        }

        .acc__primaryBtn {
          border: 1px solid #d17f00;
          background: linear-gradient(180deg, #ffb84d, #ff8a00);
          color: #17130d;
        }

        .acc__primaryBtn:hover {
          filter: brightness(1.04);
        }

        .acc__secondaryBtn {
          border: 1px solid var(--border-strong);
          background: var(--bg-card);
          color: var(--text-primary);
        }

        .acc__secondaryBtn:hover {
          border-color: #ff6a00;
          color: #ff6a00;
        }

        /* quick access rail */
        .acc__rail {
          display: flex;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 14px 8px;
          margin-bottom: 20px;
          box-shadow: 0 2px 8px -4px rgba(15, 17, 17, 0.08);
        }

        .acc__railItem {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          text-decoration: none;
        }

        .acc__railIcon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--bg-tint-strong);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ff6a00;
          font-size: 16px;
          transition: background-color 0.15s ease, transform 0.15s ease;
        }

        .acc__railItem:hover .acc__railIcon {
          background: linear-gradient(180deg, #ffb84d, #ff8a00);
          color: #fff;
        }

        .acc__railLabel {
          font-size: 10.5px;
          font-weight: 600;
          color: var(--text-secondary);
        }

        /* account list */
        .acc__groupLabel {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          color: var(--text-muted);
          margin: 0 4px 8px;
        }

        .acc__list {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 0 14px;
          margin-bottom: 16px;
          box-shadow: 0 2px 8px -4px rgba(15, 17, 17, 0.08);
        }

        .acc__listRow {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px 0;
          border-bottom: 1px solid var(--border-soft);
          text-decoration: none;
          background: none;
          border-left: none;
          border-right: none;
          border-top: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
          margin: 0;
        }

        .acc__listRow--static {
          cursor: default;
        }

        .acc__listIcon {
          width: 30px;
          height: 30px;
          border-radius: 9px;
          background: var(--bg-tint-strong);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #ff6a00;
          font-size: 13px;
        }

        .acc__listLabel {
          flex: 1;
          min-width: 0;
          font-size: 13.5px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .acc__listChevron {
          flex-shrink: 0;
          font-size: 11px;
          color: var(--text-faint);
        }

        .acc__switch {
          position: relative;
          flex-shrink: 0;
          width: 46px;
          height: 26px;
          border-radius: 999px;
          border: 1px solid var(--border-strong);
          background: var(--bg-surface-2);
          padding: 0;
          cursor: pointer;
          transition: background-color 0.2s ease, border-color 0.2s ease;
        }

        .acc__switch.is-dark {
          background: #20232c;
          border-color: #20232c;
        }

        .acc__switchThumb {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
          transition: transform 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ff8a00;
          font-size: 10px;
        }

        .acc__switch.is-dark .acc__switchThumb {
          transform: translateX(20px);
          color: #4b5875;
        }

        .acc__listDivider {
          height: 8px;
        }

        .acc__listRow--danger {
          border-bottom: none;
        }

        .acc__listIcon--danger {
          background: var(--danger-bg);
          color: var(--danger);
        }

        .acc__listLabel--danger {
          color: var(--danger);
        }

        /* footer */
        .acc__footerNote {
          text-align: center;
          font-size: 11px;
          color: var(--text-tertiary);
          letter-spacing: 0.2px;
        }

        .acc__footerNote i {
          color: #ff6a00;
          margin-right: 4px;
        }

        @media (max-width: 380px) {
          .acc__statValue--lg {
            font-size: 15px;
          }
          .acc__statValue {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}

export default Profile;
