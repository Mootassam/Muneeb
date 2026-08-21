import React, { useRef } from "react";
import { useSelector } from "react-redux";
import SubHeader from "src/view/shared/Header/SubHeader";
import authSelectors from "src/modules/auth/authSelectors";
import Message from "src/view/shared/message";
import { i18n } from "../../../i18n";

function Team() {
  const currentUser = useSelector(authSelectors.selectCurrentUser);
  const inviteCodeRef = useRef<any>(null);

  const photoUrl = currentUser?.passportPhoto?.[0]?.downloadUrl;
  const notAvailable = i18n("pages.team.notAvailable");

  const copyInviteCode = () => {
    const code = inviteCodeRef.current?.innerText;
    if (!code) {
      return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(code)
        .then(() => Message.success(i18n("pages.profile.copied")))
        .catch((error) => console.error("Error copying to clipboard:", error));
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      Message.success(i18n("pages.profile.copied"));
    }
  };

  const genderValue = currentUser?.gender;
  const genderLabel = genderValue
    ? i18n(`user.enumerators.gender.${genderValue}`)
    : i18n("pages.team.genderNotSpecified");

  const rows = [
    {
      icon: "fa-solid fa-user",
      label: i18n("pages.team.fullName"),
      value: currentUser?.fullName || notAvailable,
    },
    {
      icon: "fa-solid fa-envelope",
      label: i18n("pages.team.email"),
      value: currentUser?.email || notAvailable,
    },
    {
      icon: "fa-solid fa-phone",
      label: i18n("pages.team.phoneNumber"),
      value: currentUser?.phoneNumber || notAvailable,
    },
    {
      icon: "fa-solid fa-earth-americas",
      label: i18n("pages.team.country"),
      value: currentUser?.country || notAvailable,
    },
  ];

  return (
    <div>
      <SubHeader title={i18n("pages.team.title")} path="/profile" />

      <div className="tp__page">
        <div className="tp__card">
          <div className="tp__header">
            <div className="tp__avatar">
              {photoUrl ? (
                <img src={photoUrl} alt={currentUser?.fullName || "avatar"} />
              ) : (
                <i className="fa-solid fa-user"></i>
              )}
            </div>
            <div className="tp__headerText">
              <div className="tp__name">
                {currentUser?.fullName || notAvailable}
              </div>
              <div className="tp__email">
                {currentUser?.email || notAvailable}
              </div>
            </div>
          </div>

          <div className="tp__sectionTitle">
            {i18n("pages.team.personalInformation")}
          </div>

          <div className="tp__list">
            {rows.map((row, index) => (
              <div className="tp__row" key={index}>
                <span className="tp__rowIcon">
                  <i className={row.icon}></i>
                </span>
                <div className="tp__rowText">
                  <div className="tp__rowLabel">{row.label}</div>
                  <div className="tp__rowValue">{row.value}</div>
                </div>
              </div>
            ))}

            <div className="tp__row">
              <span className="tp__rowIcon">
                <i className="fa-solid fa-venus-mars"></i>
              </span>
              <div className="tp__rowText">
                <div className="tp__rowLabel">{i18n("pages.team.gender")}</div>
                <div className="tp__rowValue">
                  <span className={`tp__genderTag tp__genderTag--${genderValue || "unknown"}`}>
                    {genderLabel}
                  </span>
                </div>
              </div>
            </div>

            <div className="tp__row">
              <span className="tp__rowIcon">
                <i className="fa-solid fa-user-plus"></i>
              </span>
              <div className="tp__rowText">
                <div className="tp__rowLabel">
                  {i18n("pages.team.invitationCode")}
                </div>
                <div className="tp__rowValue tp__rowValue--mono" ref={inviteCodeRef}>
                  {currentUser?.invitationcode || notAvailable}
                </div>
              </div>
              {currentUser?.invitationcode && (
                <button
                  type="button"
                  className="tp__copyBtn"
                  onClick={copyInviteCode}
                >
                  <i className="fa-regular fa-copy"></i>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .tp__page {
          min-height: 100vh;
          background: var(--bg-page);
          display: flex;
          justify-content: center;
          padding: 20px 14px 100px;
          font-family: "Poppins", -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .tp__card {
          max-width: 400px;
          width: 100%;
          background: var(--bg-card);
          padding: 22px 18px 26px;
          border-radius: 22px;
          border: 1px solid var(--border);
          color: var(--text-primary);
        }

        .tp__header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 24px;
        }

        .tp__avatar {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: var(--bg-card-alt);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          overflow: hidden;
        }

        .tp__avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .tp__avatar i {
          color: var(--text-faint);
          font-size: 22px;
        }

        .tp__headerText {
          min-width: 0;
        }

        .tp__name {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .tp__email {
          font-size: 12.5px;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-top: 2px;
        }

        .tp__sectionTitle {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--text-faint);
          margin-bottom: 10px;
        }

        .tp__list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .tp__row {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--bg-card-alt);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 12px 14px;
        }

        .tp__rowIcon {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: var(--bg-tint);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .tp__rowIcon i {
          color: var(--accent);
          font-size: 14px;
        }

        .tp__rowText {
          flex: 1;
          min-width: 0;
        }

        .tp__rowLabel {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          color: var(--text-muted);
          margin-bottom: 3px;
        }

        .tp__rowValue {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .tp__rowValue--mono {
          font-family: 'Consolas', 'Courier New', monospace;
          letter-spacing: 0.5px;
        }

        .tp__genderTag {
          display: inline-block;
          font-size: 12px;
          font-weight: 700;
          text-transform: capitalize;
          padding: 3px 10px;
          border-radius: 20px;
        }

        .tp__genderTag--male {
          background: var(--info-bg);
          color: var(--info-text);
        }

        .tp__genderTag--female {
          background: rgba(236, 72, 153, 0.14);
          color: #ec4899;
        }

        .tp__genderTag--unknown {
          background: var(--bg-surface-2);
          color: var(--text-muted);
        }

        .tp__copyBtn {
          flex-shrink: 0;
          width: 34px;
          height: 34px;
          margin: 0;
          background: var(--bg-surface-2);
          border: 1px solid var(--border);
          border-radius: 10px;
          color: var(--text-muted);
          font-size: 13px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .tp__copyBtn:hover {
          color: var(--accent);
          border-color: var(--tint-border);
        }
      `}</style>
    </div>
  );
}

export default Team;
