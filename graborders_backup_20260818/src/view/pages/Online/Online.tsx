import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import actions from "src/modules/category/list/categoryListActions";
import selector from "src/modules/category/list/categoryListSelectors";
import LoadingModal from "src/shared/LoadingModal";
import SubHeader from "src/view/shared/Header/SubHeader";
import { i18n } from "../../../i18n";

function Online() {
  const dispatch = useDispatch();

  const record = useSelector(selector.selectRows);
  const loading = useSelector(selector.selectLoading);

  useEffect(() => {
    dispatch(actions.doFetch());
    // eslint-disable-next-line
  }, [dispatch]);

  return (
    <div>
      <SubHeader title={i18n("pages.online.title")} path="/" />

      <div className="hlp__page">
        {/* Hero */}
        <div className="hlp__hero">
          <span className="hlp__heroIcon">
            <i className="fa-solid fa-headset"></i>
          </span>
          <div className="hlp__heroTitle">We're here to help</div>
          <p className="hlp__heroText">{i18n("pages.online.description")}</p>
        </div>

        {/* Live chat, elevated as the primary channel */}
        <Link to="/LiveChat" className="hlp__liveChat">
          <span className="hlp__liveChatPulse">
            <i className="fa-solid fa-comment-dots"></i>
          </span>
          <span className="hlp__liveChatBody">
            <span className="hlp__liveChatTitle">
              Live Chat
              <span className="hlp__onlineDot"></span>
            </span>
            <span className="hlp__liveChatSubtitle">Fastest way to reach our team</span>
          </span>
          <i className="fa-solid fa-chevron-right hlp__liveChatArrow"></i>
        </Link>

        {loading && <LoadingModal />}

        {!loading && record && record.length > 0 && (
          <>
            <div className="hlp__eyebrow">Support</div>
            <div className="hlp__sectionTitle">Contact a Specialist</div>

            <div className="hlp__agentGrid">
              {record.map((item, index) => {
                const photoUrl = item?.photo?.[0]?.downloadUrl;
                const isWhatsApp = item.type === "whatsApp";
                const href = isWhatsApp
                  ? `https://wa.me/${item.number}`
                  : `https://t.me/${item.number}`;

                return (
                  <a
                    href={href}
                    key={index}
                    className="hlp__agentTile"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="hlp__agentAvatar">
                      {photoUrl ? (
                        <img src={photoUrl} alt={item?.name} />
                      ) : (
                        <i className="fa-solid fa-user"></i>
                      )}
                      <span
                        className={`hlp__agentPlatform hlp__agentPlatform--${item.type}`}
                      >
                        <i className={isWhatsApp ? "fa-brands fa-whatsapp" : "fa-brands fa-telegram"}></i>
                      </span>
                    </div>
                    <div className="hlp__agentName">{item?.name}</div>
                    <div className="hlp__agentAction">
                      {isWhatsApp
                        ? i18n("pages.online.contactWhatsApp")
                        : i18n("pages.online.contactTelegram")}
                    </div>
                  </a>
                );
              })}
            </div>
          </>
        )}
      </div>

      <style>{`
        .hlp__page {
          min-height: 100vh;
          background: var(--bg-page);
          color: var(--text-primary);
          padding: 18px 14px 100px;
          font-family: "Poppins", -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .hlp__hero {
          display: none;
          text-align: center;
          padding: 26px 16px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 20px;
          margin-bottom: 14px;
        }

        .hlp__heroIcon {
          width: 56px;
          height: 56px;
          margin: 0 auto 14px;
          border-radius: 50%;
          background: var(--bg-tint);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hlp__heroIcon i {
          color: var(--accent);
          font-size: 22px;
        }

        .hlp__heroTitle {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .hlp__heroText {
          font-size: 12.5px;
          color: var(--text-muted);
          line-height: 1.6;
          margin: 0;
          max-width: 300px;
          margin-left: auto;
          margin-right: auto;
        }

        .hlp__liveChat {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--bg-tint);
          border: 1px solid var(--tint-border);
          border-radius: 16px;
          padding: 14px;
          text-decoration: none;
          margin-bottom: 24px;
        }

        .hlp__liveChatPulse {
          flex-shrink: 0;
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: linear-gradient(180deg, var(--accent-grad-start), var(--accent-grad-end));
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hlp__liveChatPulse i {
          color: var(--accent-text-on);
          font-size: 19px;
        }

        .hlp__liveChatBody {
          flex: 1;
          min-width: 0;
        }

        .hlp__liveChatTitle {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 15px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .hlp__onlineDot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--success);
          box-shadow: 0 0 0 3px rgba(14, 203, 129, 0.18);
        }

        .hlp__liveChatSubtitle {
          display: block;
          font-size: 11.5px;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .hlp__liveChatArrow {
          flex-shrink: 0;
          color: var(--accent);
          font-size: 13px;
        }

        .hlp__eyebrow {
          font-size: 10.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--accent);
          margin-bottom: 5px;
        }

        .hlp__sectionTitle {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 14px;
        }

        .hlp__agentGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .hlp__agentTile {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 16px 12px;
          text-align: center;
          text-decoration: none;
        }

        .hlp__agentAvatar {
          position: relative;
          width: 58px;
          height: 58px;
          margin: 0 auto 10px;
          border-radius: 50%;
          background: var(--bg-card-alt);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .hlp__agentAvatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hlp__agentAvatar i {
          font-size: 22px;
          color: var(--text-faint);
        }

        .hlp__agentPlatform {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          color: var(--accent-text-on);
          border: 2px solid var(--bg-card);
        }

        .hlp__agentPlatform--whatsApp {
          background: #25d366;
        }

        .hlp__agentPlatform--telegram {
          background: #38bdf8;
        }

        .hlp__agentName {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .hlp__agentAction {
          font-size: 11px;
          font-weight: 600;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}

export default Online;
