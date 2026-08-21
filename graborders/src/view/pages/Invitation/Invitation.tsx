import React, { useRef, useEffect } from "react";
import SubHeader from "src/view/shared/Header/SubHeader";
import authSelectors from "src/modules/auth/authSelectors";
import Message from "src/view/shared/message";
import selectors from "src/modules/company/list/companyListSelectors";
import listactions from "src/modules/company/list/companyListActions";
import { useDispatch, useSelector } from "react-redux";
import { i18n } from "../../../i18n";

const STEPS = [
  { icon: "fa-solid fa-share-nodes", titleKey: "shareTitle", textKey: "shareText" },
  { icon: "fa-solid fa-user-plus", titleKey: "joinTitle", textKey: "joinText" },
  { icon: "fa-solid fa-sack-dollar", titleKey: "earnTitle", textKey: "earnText" },
];

function Invitation() {
  const dispatch = useDispatch();

  const currentUser = useSelector(authSelectors.selectCurrentUser);
  const referenceCodeRef = useRef<any>(null);

  const copyToClipboard = () => {
    const referenceCode = referenceCodeRef.current.innerText;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(referenceCode)
        .then(() => Message.success(i18n("pages.profile.copied")))
        .catch((error) => {
          console.error("Error copying to clipboard:", error);
        });
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = referenceCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      Message.success(i18n("pages.profile.copied"));
    }
  };

  const logorecord = useSelector(selectors.selectRows);
  const company = logorecord?.[0];

  useEffect(() => {
    dispatch(listactions.doFetch());
  }, [dispatch]);

  return (
    <div>
      <SubHeader title={i18n("pages.invitation.title")} path="/profile" />

      <div className="inv__page">
        {company && (
          <div className="inv__brand">
            <img
              src={company?.photo?.[0]?.downloadUrl || "/images/invitation/logo.png"}
              alt=""
              className="inv__brandLogo"
            />
            <span className="inv__brandName">{company?.name}</span>
          </div>
        )}

        <div className="inv__hero">
          <span className="inv__heroIcon">
            <i className="fa-solid fa-gift"></i>
          </span>
          <div className="inv__heroTitle">{i18n("pages.invitation.heroTitle")}</div>
          <div className="inv__heroSubtitle">{i18n("pages.invitation.heroSubtitle")}</div>
        </div>

        <div className="inv__card">
          <div className="inv__codeLabel">{i18n("pages.invitation.codeLabel")}</div>
          <div className="inv__codeBox">
            <span className="inv__code" ref={referenceCodeRef}>
              {currentUser?.refcode}
            </span>
          </div>
          <button className="inv__copyBtn" onClick={copyToClipboard}>
            <i className="fa-regular fa-copy"></i>
            {i18n("pages.invitation.copyButton")}
          </button>
        </div>

        <div className="inv__eyebrow">{i18n("pages.invitation.howItWorks")}</div>
        <div className="inv__steps">
          {STEPS.map((step) => (
            <div className="inv__step" key={step.titleKey}>
              <span className="inv__stepIcon">
                <i className={step.icon}></i>
              </span>
              <div className="inv__stepText">
                <div className="inv__stepTitle">
                  {i18n(`pages.invitation.steps.${step.titleKey}`)}
                </div>
                <div className="inv__stepDesc">
                  {i18n(`pages.invitation.steps.${step.textKey}`)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .inv__page {
          min-height: 100vh;
          background: var(--bg-page);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px 14px 100px;
          font-family: "Poppins", -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .inv__brand {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 14px;
        }

        .inv__brandLogo {
          width: 24px;
          height: 24px;
          border-radius: 7px;
          object-fit: cover;
        }

        .inv__brandName {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .inv__hero {
          max-width: 400px;
          width: 100%;
          background: linear-gradient(135deg, var(--accent-grad-start), var(--accent-grad-end));
          border-radius: 22px;
          padding: 26px 22px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 16px;
          box-shadow: 0 12px 26px -8px rgba(255, 138, 0, 0.55);
        }

        .inv__heroIcon {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.22);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
        }

        .inv__heroIcon i {
          color: #fff;
          font-size: 21px;
        }

        .inv__heroTitle {
          font-size: 18px;
          font-weight: 800;
          color: #fff;
          margin-bottom: 6px;
        }

        .inv__heroSubtitle {
          font-size: 12.5px;
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.6;
          max-width: 280px;
        }

        .inv__card {
          max-width: 400px;
          width: 100%;
          background: var(--bg-card);
          border-radius: 20px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 8px 20px var(--shadow-color);
        }

        .inv__codeLabel {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-muted);
          margin-bottom: 10px;
        }

        .inv__codeBox {
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-card-alt);
          border: 1.5px dashed var(--border-strong);
          border-radius: 14px;
          padding: 16px;
          margin-bottom: 14px;
        }

        .inv__code {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: 2px;
          color: var(--accent);
          font-family: 'Consolas', 'Courier New', monospace;
          word-break: break-all;
          text-align: center;
        }

        .inv__copyBtn {
          width: 100%;
          margin: 0;
          border: none;
          border-radius: 14px;
          padding: 13px 0;
          background: linear-gradient(180deg, var(--accent-grad-start), var(--accent-grad-end));
          color: var(--accent-text-on);
          font-family: "Poppins", sans-serif;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .inv__copyBtn:active {
          transform: translateY(1px);
        }

        .inv__eyebrow {
          max-width: 400px;
          width: 100%;
          font-size: 10.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--accent);
          margin-bottom: 12px;
        }

        .inv__steps {
          max-width: 400px;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .inv__step {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--bg-card);
          border-radius: 16px;
          padding: 14px;
          box-shadow: 0 6px 16px var(--shadow-color);
        }

        .inv__stepIcon {
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: var(--bg-tint);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .inv__stepIcon i {
          color: var(--accent);
          font-size: 15px;
        }

        .inv__stepText {
          min-width: 0;
        }

        .inv__stepTitle {
          font-size: 13.5px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 3px;
        }

        .inv__stepDesc {
          font-size: 11.5px;
          color: var(--text-muted);
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}

export default Invitation;
