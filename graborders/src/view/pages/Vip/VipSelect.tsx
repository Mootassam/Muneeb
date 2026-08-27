import React, { useEffect, useCallback, memo } from "react";
import { useHistory, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import vipActions from "src/modules/vip/list/vipListActions";
import vipSelectors from "src/modules/vip/list/vipListSelectors";
import authSelectors from "src/modules/auth/authSelectors";
import LoadingModal from "src/shared/LoadingModal";
import { i18n, i18nExists } from "../../../i18n";

const t = (key, fallback) => (i18nExists(key) ? i18n(key) : fallback);

interface VipItem {
  id: string;
  title: string;
  min: string;
  max: string;
  dailyorder: string;
  comisionrate: string;
  photo?: Array<{ downloadUrl: string }>;
}

// VIP is fully automatic: a tier is "current" whenever the customer's
// balance falls within that tier's Level Limit [min, max] range.
function isBalanceInRange(balance: number, vip: VipItem) {
  const min = parseFloat(vip.min);
  const max = parseFloat(vip.max);
  if (isNaN(min) || isNaN(max)) {
    return false;
  }
  return balance >= min && balance <= max;
}

const VipSelectCard = memo(
  ({
    vip,
    isCurrent,
    onSelect,
  }: {
    vip: VipItem;
    isCurrent: boolean;
    onSelect: (vip: VipItem) => void;
  }) => {
    const photoUrl = vip?.photo?.[0]?.downloadUrl;

    return (
      <div
        className={`vsel__card ${isCurrent ? "vsel__card--active" : "vsel__card--locked"}`}
        onClick={() => isCurrent && onSelect(vip)}
        role={isCurrent ? "button" : undefined}
        aria-disabled={!isCurrent}
      >
        <div className="vsel__cardHead">
          <span className="vsel__badgeIcon">
            {photoUrl ? (
              <img src={photoUrl} alt={vip?.title} loading="lazy" />
            ) : (
              <i className={isCurrent ? "fa-solid fa-crown" : "fa-solid fa-lock"}></i>
            )}
            {!isCurrent && photoUrl && (
              <span className="vsel__badgeLock">
                <i className="fa-solid fa-lock"></i>
              </span>
            )}
          </span>

          <div className="vsel__cardHeadText">
            <div className="vsel__cardTitle">{vip?.title}</div>
            <span className={`vsel__ribbon ${isCurrent ? "vsel__ribbon--active" : "vsel__ribbon--locked"}`}>
              {isCurrent ? t("pages.vipSelect.activeBadge", "Active") : i18n("pages.vip.locked")}
            </span>
          </div>
        </div>

        <div className="vsel__cardBody">
          <div className="vsel__featureGrid">
            <div className="vsel__feature">
              <i className="fa-solid fa-percent"></i>
              <span>
                {vip.comisionrate}% {i18n("pages.vip.commission")}
              </span>
            </div>
            <div className="vsel__feature">
              <i className="fa-solid fa-box"></i>
              <span>
                {i18n("pages.vip.maxOrders")}: {vip.dailyorder}
              </span>
            </div>
            <div className="vsel__feature">
              <i className="fa-solid fa-layer-group"></i>
              <span>
                {i18n("pages.vip.levelLimit")}: {vip.min} - {vip.max}
              </span>
            </div>
          </div>

          {isCurrent ? (
            <button type="button" className="vsel__startBtn" onClick={() => onSelect(vip)}>
              {t("pages.vipSelect.tapToStart", "Start Task")}
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          ) : (
            <div className="vsel__requirement">
              <i className="fa-solid fa-circle-info"></i>
              {i18n(
                "pages.vipSelect.requiresBalance",
                vip.min,
                t("pages.vipSelect.currency", "USD")
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);

VipSelectCard.displayName = "VipSelectCard";

function VipSelect() {
  const dispatch = useDispatch();
  const history = useHistory();

  const vipRecords = useSelector(vipSelectors.selectRows);
  const loading = useSelector(vipSelectors.selectLoading);
  const currentUser = useSelector(authSelectors.selectCurrentUser);
  const balance = Number(currentUser?.balance) || 0;

  useEffect(() => {
    dispatch(vipActions.doFetch());
  }, [dispatch]);

  const sortedVipRecords: VipItem[] = [...(vipRecords || [])].sort(
    (a: VipItem, b: VipItem) => parseFloat(a.min || "0") - parseFloat(b.min || "0")
  );

  const goToGrap = useCallback(() => {
    history.push("/grap");
  }, [history]);

  const handleSelect = useCallback(
    (vip: VipItem) => {
      if (isBalanceInRange(balance, vip)) {
        goToGrap();
      }
    },
    [balance, goToGrap]
  );

  return (
    <div className="vsel__root">
      <div className="vsel__page">
        <h1 className="vsel__pageTitle">{t("pages.vipSelect.title", "Start Task")}</h1>

        {loading && <LoadingModal />}

        {!loading && sortedVipRecords.length > 0 && (
          <div className="vsel__list">
            {sortedVipRecords.map((vip: VipItem, index: number) => (
              <VipSelectCard
                key={vip.id || index}
                vip={vip}
                isCurrent={isBalanceInRange(balance, vip)}
                onSelect={handleSelect}
              />
            ))}
          </div>
        )}

        {!loading && sortedVipRecords.length === 0 && (
          <div className="vsel__empty">
            <i className="fa-solid fa-crown"></i>
            <div className="vsel__emptyTitle">
              {t("pages.vipSelect.noResults", "No VIP levels found")}
            </div>
          </div>
        )}

        <Link className="vsel__upsell" to="/vip">
          <div className="vsel__upsellText">
            <div className="vsel__upsellTitle">
              {t("pages.vipSelect.upsellTitle", "Want higher rewards?")}
            </div>
            <div className="vsel__upsellSub">
              {t("pages.vipSelect.upsellSub", "Explore all VIP levels and upgrade")}
            </div>
          </div>
          <i className="fa-solid fa-chevron-right"></i>
        </Link>
      </div>

      <style>{`
        .vsel__root {
          min-height: 100vh;
          background: var(--bg-page);
        }

        .vsel__page {
          max-width: 460px;
          margin: 0 auto;
          padding: 20px 14px 100px;
          font-family: "Poppins", "Helvetica Neue", Arial, sans-serif;
          box-sizing: border-box;
        }

        .vsel__page * {
          box-sizing: border-box;
        }

        .vsel__pageTitle {
          font-size: 22px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 4px 2px 16px;
        }

        .vsel__list {
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding-top: 4px;
        }

        .vsel__card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 2px 8px var(--shadow-color);
          transition: box-shadow 0.15s ease, border-color 0.15s ease, transform 0.1s ease;
        }

        .vsel__card--active {
          cursor: pointer;
          border-color: var(--accent-grad-start);
          box-shadow: 0 8px 20px -8px rgba(255, 138, 0, 0.4);
        }

        .vsel__card--active:active {
          transform: translateY(1px);
        }

        .vsel__card--locked {
          cursor: not-allowed;
        }

        .vsel__cardHead {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 16px 14px;
        }

        .vsel__badgeIcon {
          position: relative;
          width: 50px;
          height: 50px;
          flex-shrink: 0;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: linear-gradient(160deg, #ffb84d, #ff8a00);
          box-shadow: 0 6px 14px -6px rgba(255, 138, 0, 0.55);
        }

        .vsel__badgeIcon i {
          color: #fff;
          font-size: 18px;
        }

        .vsel__badgeIcon img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .vsel__card--locked .vsel__badgeIcon {
          background: var(--bg-surface-2);
          box-shadow: none;
        }

        .vsel__card--locked .vsel__badgeIcon i {
          color: var(--placeholder);
        }

        .vsel__card--locked .vsel__badgeIcon img {
          filter: grayscale(1);
          opacity: 0.6;
        }

        .vsel__badgeLock {
          position: absolute;
          right: -3px;
          bottom: -3px;
          width: 19px;
          height: 19px;
          border-radius: 50%;
          background: var(--text-tertiary);
          border: 2px solid var(--bg-card);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .vsel__badgeLock i {
          color: #fff;
          font-size: 8px;
        }

        .vsel__cardHeadText {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .vsel__cardTitle {
          font-size: 15.5px;
          font-weight: 700;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .vsel__card--locked .vsel__cardTitle {
          color: var(--text-tertiary);
        }

        .vsel__ribbon {
          display: inline-flex;
          align-self: flex-start;
          align-items: center;
          gap: 5px;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          padding: 3px 9px;
          border-radius: 20px;
        }

        .vsel__ribbon--active {
          background: var(--bg-tint);
          color: var(--accent-strong);
        }

        .vsel__ribbon--locked {
          background: var(--bg-surface-2);
          color: var(--text-muted);
        }

        .vsel__cardBody {
          padding: 14px 16px 16px;
          border-top: 1px solid var(--border-soft);
        }

        .vsel__featureGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 12px;
        }

        .vsel__feature {
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--bg-card-alt);
          border-radius: 8px;
          padding: 7px 9px;
          font-size: 10.5px;
          color: var(--text-secondary);
        }

        .vsel__feature:first-child {
          grid-column: 1 / -1;
        }

        .vsel__feature i {
          color: var(--accent-grad-end);
          font-size: 10.5px;
          flex-shrink: 0;
        }

        .vsel__card--locked .vsel__feature {
          color: var(--text-muted);
        }

        .vsel__card--locked .vsel__feature i {
          color: var(--placeholder);
        }

        .vsel__startBtn {
          width: 100%;
          border: none;
          border-radius: 10px;
          padding: 11px;
          font-weight: 700;
          font-size: 13.5px;
          color: #fff;
          background: linear-gradient(180deg, #ffb84d, #ff8a00);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
        }

        .vsel__requirement {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 11.5px;
          font-weight: 600;
          color: var(--text-muted);
          background: var(--bg-card-alt);
          border-radius: 10px;
          padding: 9px;
          margin-bottom: 10px;
        }

        .vsel__requirement--met {
          color: var(--success);
          background: var(--success-bg);
        }

        .vsel__joinBtn {
          width: 100%;
          border: none;
          border-radius: 10px;
          padding: 11px;
          font-weight: 700;
          font-size: 13.5px;
          color: #fff;
          background: linear-gradient(180deg, #ffb84d, #ff8a00);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
        }

        .vsel__joinBtn:disabled {
          background: var(--bg-surface-2);
          color: var(--text-muted);
          cursor: not-allowed;
        }

        .vsel__modalOverlay {
          position: fixed;
          inset: 0;
          background: var(--overlay);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 1200;
        }

        .vsel__modalCard {
          width: 100%;
          max-width: 340px;
          background: var(--bg-card);
          border-radius: 20px;
          padding: 28px 24px 24px;
          text-align: center;
          box-shadow: 0 25px 60px -15px rgba(15, 17, 17, 0.35);
        }

        .vsel__modalIcon {
          width: 56px;
          height: 56px;
          margin: 0 auto 16px;
          border-radius: 50%;
          background: var(--danger-bg);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .vsel__modalIcon i {
          color: var(--danger);
          font-size: 22px;
        }

        .vsel__modalTitle {
          font-size: 17px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 10px;
        }

        .vsel__modalText {
          font-size: 13px;
          color: var(--text-tertiary);
          line-height: 1.6;
          margin: 0 0 22px;
        }

        .vsel__modalActions {
          display: flex;
          gap: 10px;
        }

        .vsel__modalCancelBtn {
          flex: 1;
          margin: 0;
          border: 1px solid var(--border);
          background: var(--bg-card);
          border-radius: 12px;
          color: var(--text-primary);
          font-size: 13.5px;
          font-weight: 700;
          padding: 12px 0;
          cursor: pointer;
        }

        .vsel__modalDepositBtn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(180deg, #ffb84d, #ff8a00);
          border: none;
          border-radius: 12px;
          color: #fff;
          font-size: 13.5px;
          font-weight: 700;
          padding: 12px 0;
          text-decoration: none;
        }

        .vsel__upsell {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          background: var(--bg-card);
          border: 1px dashed var(--border-strong);
          border-radius: 14px;
          padding: 14px 16px;
          margin-top: 18px;
          text-decoration: none;
          transition: border-color 0.15s ease;
        }

        .vsel__upsell:hover {
          border-color: var(--accent);
        }

        .vsel__upsell i {
          color: var(--accent);
          font-size: 13px;
        }

        .vsel__upsellTitle {
          font-size: 13.5px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .vsel__upsellSub {
          font-size: 11.5px;
          color: var(--text-tertiary);
          margin-top: 2px;
        }

        .vsel__empty {
          text-align: center;
          padding: 50px 16px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
        }

        .vsel__empty i {
          font-size: 28px;
          color: #d8b877;
          margin-bottom: 12px;
        }

        .vsel__emptyTitle {
          font-size: 13.5px;
          font-weight: 700;
          color: var(--text-primary);
        }
      `}</style>
    </div>
  );
}

export default VipSelect;
