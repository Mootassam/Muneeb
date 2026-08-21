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

const schema = yup.object().shape({
  passportPhoto: yupFormSchemas.images(i18n("inputs.passportPhoto"), {
    max: 1,
  }),
});

function Profile() {
  const dispatch = useDispatch();
  const history = useHistory();
  const totalperday = useSelector(selectors.selectTotalPerday);
  const currentUser = useSelector(authSelectors.selectCurrentUser);

  const referenceCodeRef = useRef<any>(null);

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
      icon: "fa-solid fa-user",
      name: i18n('pages.profile.profile'),
      url: "/myprofile"
    },
    {
      icon: "fa-solid fa-list-check",
      name: i18n('pages.profile.tasksHistory'),
      url: "/order"
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

  return (
    <div className="prf__page">
      <div className="prf__card">
        {/* User head */}
        <div className="prf__userHead">
          <div className="prf__avatarRing">
            <div className="prf__avatarInner">
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
            {currentUser?.vip?.title && (
              <span className="prf__vipBadge">
                <i className="fa-solid fa-crown"></i>
                {currentUser.vip.title}
              </span>
            )}
          </div>

          <div className="prf__userMeta">
            <div className="prf__emailText">
              {currentUser?.email || currentUser?.fullName}
            </div>
            <span className="prf__inviteChip" onClick={copyToClipboardCoupon}>
              <span className="prf__inviteLabel">{i18n('pages.profile.invitationCode')}</span>
              <span className="prf__inviteCode" ref={referenceCodeRef}>{currentUser?.refcode}</span>
              <i className="fa-regular fa-copy"></i>
            </span>
          </div>
        </div>

        {/* Balance + credit */}
        <div className="prf__balanceCard">
          <div className="prf__balanceLeft">
            <div className="prf__label">{i18n('pages.profile.balance')}</div>
            <div className="prf__amount">
              {balance} <span className="prf__amountUnit">{i18n('pages.profile.usd')}</span>
            </div>
          </div>
          <div className="prf__scoreRing">
            <div className="prf__scoreRingInner">
              <div className="prf__scoreValue">{scorePct}%</div>
              <div className="prf__scoreLabel">{i18n('pages.profile.creditScore')}</div>
            </div>
          </div>
        </div>

        {/* Profit + frozen */}
        <div className="prf__statsRow">
          <div className="prf__statBlock">
            <div className="prf__statLabel">
              <i className="fa-solid fa-chart-line prf__iconGreen"></i>
              {i18n('pages.profile.todayProfit')}
            </div>
            <div className="prf__statValue">{totalperday} {i18n('pages.profile.usd')}</div>
          </div>
          <div className="prf__statBlock">
            <div className="prf__statLabel">
              <i className="fa-solid fa-snowflake prf__iconBlue"></i>
              {i18n('pages.profile.frozenAmount')}
            </div>
            <div className="prf__statValue">
              {currentUser?.freezeblance?.toFixed(2) || "0.00"} {i18n('pages.profile.usd')}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="prf__actionRow">
          <div className="prf__actionBtn" onClick={() => goto("/deposit")}>
            <span className="prf__actionIcon">
              <i className="fa-solid fa-dollar-sign"></i>
            </span>
            {i18n('pages.profile.recharge')}
          </div>
          <div className="prf__actionBtn" onClick={() => goto("/withdraw")}>
            <span className="prf__actionIcon">
              <i className="fa-solid fa-money-check"></i>
            </span>
            {i18n('pages.profile.withdraw')}
          </div>
        </div>

        {/* Quick links */}
        <div className="prf__sectionTitle">{i18n('pages.profile.myDetails')}</div>
        <div className="prf__linkList">
          {links.map((item, index) => (
            <Link key={index} to={item.url} className="prf__linkRow">
              <span className="prf__linkIcon">
                <i className={item.icon}></i>
              </span>
              <span className="prf__linkName">{item.name}</span>
              <i className="fa-solid fa-chevron-right prf__linkArrow"></i>
            </Link>
          ))}
        </div>

        <div className="prf__divider" />

        {/* Logout */}
        <div className="prf__logoutRow" onClick={doSignout}>
          <i className="fa-solid fa-arrow-right-from-bracket"></i>
          <span>{i18n('pages.profile.logout')}</span>
        </div>

        <div className="prf__footerNote">
          <i className="fa-solid fa-shield-halved"></i>
          {i18nExists('pages.profile.secureNote') ? i18n('pages.profile.secureNote') : 'Secured · 256-bit encryption'}
        </div>
      </div>

      <style>{`
        .prf__page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 15% 0%, rgba(240, 185, 11, 0.10), transparent 42%),
            radial-gradient(circle at 85% 8%, rgba(139, 92, 246, 0.14), transparent 45%),
            #06070b;
          display: flex;
          justify-content: center;
          padding: 20px 14px 100px;
          font-family: "Poppins", -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .prf__card {
          max-width: 400px;
          width: 100%;
          background: #14151d;
          padding: 22px 18px 26px;
          border-radius: 22px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.55);
          color: #eaecef;
        }

        /* user head */
        .prf__userHead {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 22px;
        }

        .prf__avatarRing {
          position: relative;
          width: 76px;
          height: 76px;
          border-radius: 50%;
          padding: 3px;
          background: conic-gradient(from 180deg, #f0b90b, #a855f7, #38bdf8, #f0b90b);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .prf__avatarInner {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: #14151d;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .profile-avatar {
          display: flex;
        }

        .avatar-placeholder {
          width: 100% !important;
          height: 100% !important;
          border-radius: 50% !important;
          background: #1e2029 !important;
          border: none !important;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 30px;
          font-weight: 700;
          color: #6b7280;
          transition: opacity 0.15s ease;
        }

        .avatar-placeholder:hover {
          opacity: 0.85;
        }

        .prf__avatarInner .img-card {
          width: 100% !important;
          height: 100% !important;
          border: none !important;
          border-radius: 50% !important;
        }

        .prf__avatarInner .header__profile__image {
          width: 100% !important;
          height: 100% !important;
          border-radius: 50% !important;
        }

        .prf__vipBadge {
          position: absolute;
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #ffd668, #f0a500);
          border: 3px solid #14151d;
          color: #1a1200;
          font-weight: 800;
          font-size: 10px;
          padding: 2px 10px 2px 8px;
          border-radius: 20px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
          box-shadow: 0 2px 6px rgba(240, 185, 11, 0.45);
        }

        .prf__vipBadge i {
          font-size: 9px;
        }

        .prf__userMeta {
          flex: 1;
          min-width: 0;
        }

        .prf__emailText {
          font-size: 15px;
          font-weight: 700;
          color: #f5f6f8;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 8px;
        }

        .prf__inviteChip {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 11px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          max-width: 100%;
        }

        .prf__inviteLabel {
          color: #848e9c;
        }

        .prf__inviteCode {
          color: #f0b90b;
          font-weight: 700;
          letter-spacing: 0.3px;
        }

        .prf__inviteChip i {
          color: #848e9c;
          font-size: 11px;
        }

        /* balance card */
        .prf__balanceCard {
          background: #1a1c26;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 18px;
          padding: 18px 18px;
          margin-bottom: 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .prf__label {
          font-size: 11px;
          text-transform: uppercase;
          color: #848e9c;
          letter-spacing: 0.6px;
          margin-bottom: 6px;
        }

        .prf__amount {
          font-size: 30px;
          font-weight: 800;
          color: #f7c948;
          line-height: 1;
        }

        .prf__amountUnit {
          font-size: 13px;
          font-weight: 700;
          color: #848e9c;
        }

        .prf__scoreRing {
          width: 68px;
          height: 68px;
          border-radius: 50%;
          padding: 3px;
          background: conic-gradient(from 180deg, #f0b90b, #a855f7, #38bdf8, #f0b90b);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .prf__scoreRingInner {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: #1a1c26;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .prf__scoreValue {
          font-size: 15px;
          font-weight: 800;
          color: #f5f6f8;
        }

        .prf__scoreLabel {
          font-size: 6px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          color: #848e9c;
          margin-top: 1px;
        }

        /* stats row */
        .prf__statsRow {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 14px;
        }

        .prf__statBlock {
          background: #1a1c26;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          padding: 12px 10px;
          text-align: center;
        }

        .prf__statLabel {
          font-size: 11px;
          color: #848e9c;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }

        .prf__iconGreen { color: #0ecb81; }
        .prf__iconBlue { color: #38bdf8; }

        .prf__statValue {
          font-size: 16px;
          font-weight: 700;
          margin-top: 4px;
          color: #f5f6f8;
        }

        /* action buttons */
        .prf__actionRow {
          display: flex;
          gap: 10px;
          margin-bottom: 22px;
        }

        .prf__actionBtn {
          flex: 1;
          background: #1a1c26;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          padding: 12px 14px;
          font-weight: 700;
          font-size: 14px;
          color: #eaecef;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: background-color 0.15s ease, border-color 0.15s ease;
          cursor: pointer;
          text-decoration: none;
        }

        .prf__actionIcon {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(240, 185, 11, 0.14);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .prf__actionIcon i {
          color: #f0b90b;
          font-size: 14px;
        }

        .prf__actionBtn:hover {
          background: #21232e;
          border-color: rgba(255, 255, 255, 0.1);
        }

        /* details list */
        .prf__sectionTitle {
          font-size: 15px;
          font-weight: 700;
          color: #b7bdc6;
          margin-bottom: 10px;
        }

        .prf__linkList {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 6px;
        }

        .prf__linkRow {
          background: #1a1c26;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 14px;
          padding: 12px 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          transition: background-color 0.1s ease, border-color 0.1s ease;
        }

        .prf__linkIcon {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: linear-gradient(160deg, rgba(240, 185, 11, 0.22), rgba(240, 185, 11, 0.05) 65%);
          border: 1px solid rgba(240, 185, 11, 0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .prf__linkIcon i {
          font-size: 14px;
          color: #f0b90b;
          background: linear-gradient(135deg, #ffe27a, #f0b90b 55%, #d68e00);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .prf__linkName {
          flex: 1;
          font-size: 13.5px;
          color: #eaecef;
          font-weight: 500;
        }

        .prf__linkArrow {
          font-size: 11px;
          color: #5e6673;
        }

        .prf__linkRow:hover {
          background: #21232e;
          border-color: rgba(255, 255, 255, 0.1);
        }

        /* divider */
        .prf__divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.06);
          margin: 16px 0;
        }

        /* logout */
        .prf__logoutRow {
          background: #1a1c26;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 14px;
          padding: 12px 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: background-color 0.1s ease, border-color 0.1s ease;
        }

        .prf__logoutRow:hover {
          background: #21232e;
          border-color: rgba(255, 255, 255, 0.1);
        }

        .prf__logoutRow i {
          color: #f6465d;
          font-size: 15px;
        }

        .prf__logoutRow span {
          color: #f6465d;
          font-size: 13px;
          font-weight: 600;
        }

        /* footer */
        .prf__footerNote {
          margin-top: 12px;
          text-align: center;
          font-size: 10px;
          color: #5e6673;
          letter-spacing: 0.3px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          padding-top: 14px;
        }

        .prf__footerNote i {
          color: #f0b90b;
          margin-right: 4px;
        }

        /* responsive */
        @media (max-width: 380px) {
          .prf__card {
            padding: 18px 14px 20px;
          }
          .prf__amount {
            font-size: 24px;
          }
          .prf__statValue {
            font-size: 14px;
          }
          .prf__actionBtn {
            font-size: 12px;
            padding: 10px 12px;
          }
          .prf__avatarRing {
            width: 64px;
            height: 64px;
          }
        }
      `}</style>
    </div>
  );
}

export default Profile;
