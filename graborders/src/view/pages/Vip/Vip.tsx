import React, { useEffect, useState, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import vipActions from "src/modules/vip/list/vipListActions";
import vipSelectors from "src/modules/vip/list/vipListSelectors";
import LoadingModal from "src/shared/LoadingModal";
import authSelectors from "src/modules/auth/authSelectors";
import SubHeader from "src/view/shared/Header/SubHeader";
import { i18n } from "../../../i18n";

interface VipItem {
  id: string;
  title: string;
  min: string;
  max: string;
  dailyorder: string;
  comisionrate: string;
  photo?: Array<{ downloadUrl: string }>;
  description?: string;
  benefits?: string[];
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

const VipLevelCard = memo(
  ({ vip, isCurrent }: { vip: VipItem; isCurrent: boolean }) => {
    const photoUrl = vip?.photo?.[0]?.downloadUrl;

    return (
      <div
        className={`vip__card ${isCurrent ? "vip__card--current" : "vip__card--locked"}`}
      >
        <div className="vip__cardImage">
          {photoUrl ? (
            <img src={photoUrl} alt={vip?.title} loading="lazy" />
          ) : (
            <i className="fa-solid fa-crown vip__cardImagePlaceholder"></i>
          )}

          <span
            className={`vip__ribbon ${
              isCurrent ? "vip__ribbon--current" : "vip__ribbon--locked"
            }`}
          >
            {isCurrent ? (
              <>
                <i className="fa-solid fa-crown"></i>
                {i18n("pages.vip.currentLevel")}
              </>
            ) : (
              <>
                <i className="fa-solid fa-lock"></i>
                {i18n("pages.vip.locked")}
              </>
            )}
          </span>
        </div>

        <div className="vip__cardBody">
          <div className="vip__cardTitle">{vip?.title}</div>

          {vip.description && <p className="vip__cardDesc">{vip.description}</p>}

          <div className="vip__featureGrid">
            <div className="vip__feature">
              <i className="fa-solid fa-percent"></i>
              <span>
                {vip.comisionrate}% {i18n("pages.vip.commission")}
              </span>
            </div>

            <div className="vip__feature">
              <i className="fa-solid fa-box"></i>
              <span>
                {i18n("pages.vip.maxOrders")}: {vip.dailyorder}
              </span>
            </div>

            <div className="vip__feature">
              <i className="fa-solid fa-layer-group"></i>
              <span>
                {i18n("pages.vip.levelLimit")}: {vip.min} - {vip.max}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

VipLevelCard.displayName = "VipLevelCard";

function VipPage() {
  const dispatch = useDispatch();

  const vipRecords = useSelector(vipSelectors.selectRows);
  const loading = useSelector(vipSelectors.selectLoading);
  const currentUser = useSelector(authSelectors.selectCurrentUser);

  const [searchTerm, setSearchTerm] = useState("");
  const balance = Number(currentUser?.balance) || 0;

  useEffect(() => {
    dispatch(vipActions.doFetch());
  }, [dispatch]);

  const filteredVipRecords: VipItem[] =
    vipRecords?.filter(
      (vip: VipItem) =>
        vip.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vip.description?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const currentVip = vipRecords?.find((vip: VipItem) =>
    isBalanceInRange(balance, vip)
  );

  return (
    <div>
      <SubHeader title={i18n("pages.vip.title")} path="/" />

      <div className="vip__page">
        <div className="vip__intro">
          <p className="vip__introText">{i18n("pages.vip.subtitle")}</p>
          {currentVip && (
            <span className="vip__currentChip">
              <i className="fa-solid fa-crown"></i>
              {i18n("pages.vip.currentlyOn")}: {currentVip.title}
            </span>
          )}
        </div>

        <div className="vip__searchBox">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={i18n("pages.vip.searchPlaceholder")}
          />
          {searchTerm && (
            <button type="button" className="vip__searchClear" onClick={() => setSearchTerm("")}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>

        {loading && <LoadingModal />}

        {!loading && filteredVipRecords.length === 0 && (
          <div className="vip__empty">
            <i className="fa-solid fa-magnifying-glass"></i>
            <div className="vip__emptyTitle">{i18n("pages.vip.noResults")}</div>
            <p className="vip__emptyText">{i18n("pages.vip.noResultsDesc")}</p>
          </div>
        )}

        {!loading && filteredVipRecords.length > 0 && (
          <div className="vip__list">
            {filteredVipRecords.map((vip: VipItem, index: number) => (
              <VipLevelCard
                key={vip.id || index}
                vip={vip}
                isCurrent={isBalanceInRange(balance, vip)}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .vip__page {
          min-height: 100vh;
          background: var(--bg-page);
          color: var(--text-primary);
          padding: 16px 14px 100px;
          font-family: "Poppins", -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .vip__intro {
          margin-bottom: 16px;
        }

        .vip__introText {
          font-size: 12.5px;
          color: var(--text-muted);
          line-height: 1.6;
          margin: 0 0 10px;
        }

        .vip__currentChip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--bg-tint);
          border: 1px solid var(--tint-border);
          color: var(--accent);
          font-size: 12px;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 20px;
        }

        .vip__searchBox {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 11px 14px;
          margin-bottom: 18px;
        }

        .vip__searchBox i {
          color: var(--text-faint);
          font-size: 13px;
        }

        .vip__searchBox input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-primary);
          font-size: 14px;
          min-width: 0;
        }

        .vip__searchBox input::placeholder {
          color: var(--text-faint);
        }

        .vip__searchClear {
          flex-shrink: 0;
          margin: 0;
          background: transparent;
          border: none;
          color: var(--text-faint);
          cursor: pointer;
          font-size: 12px;
        }

        .vip__searchClear:hover {
          color: var(--text-muted);
        }

        .vip__list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .vip__card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 18px;
          overflow: hidden;
          cursor: pointer;
          position: relative;
          box-shadow: 0 10px 22px rgba(0, 0, 0, 0.28);
        }

        .vip__card--current {
          border-color: var(--accent-grad-start);
        }

        .vip__card--locked {
          cursor: not-allowed;
          opacity: 0.55;
        }

        .vip__cardLoading {
          position: absolute;
          inset: 0;
          background: var(--overlay);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }

        .vip__cardImage {
          position: relative;
          width: 100%;
          height: 140px;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .vip__cardImage img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .vip__cardImagePlaceholder {
          font-size: 34px;
          color: #d7ccb0;
        }

        .vip__ribbon {
          position: absolute;
          top: 10px;
          right: 10px;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 10.5px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          padding: 4px 10px;
          border-radius: 20px;
        }

        .vip__ribbon--current {
          background: linear-gradient(180deg, var(--accent-grad-start), var(--accent-grad-end));
          color: var(--accent-text-on);
        }

        .vip__ribbon--upgrade {
          background: rgba(11, 14, 17, 0.75);
          color: var(--text-primary);
        }

        .vip__ribbon--locked {
          background: rgba(11, 14, 17, 0.75);
          color: var(--text-muted);
        }

        .vip__cardBody {
          padding: 14px 16px 16px;
        }

        .vip__cardTitle {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .vip__cardDesc {
          font-size: 12px;
          color: var(--text-muted);
          line-height: 1.5;
          margin: 0 0 12px;
        }

        .vip__featureGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 10px;
        }

        .vip__feature {
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--bg-card-alt);
          border-radius: 10px;
          padding: 8px 10px;
          font-size: 11px;
          color: var(--text-secondary);
        }

        .vip__feature i {
          color: var(--accent);
          font-size: 11px;
          flex-shrink: 0;
        }

        .vip__price {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 700;
          color: var(--success);
        }

        /* Empty state */
        .vip__empty {
          text-align: center;
          padding: 60px 16px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
        }

        .vip__empty i {
          font-size: 30px;
          color: var(--text-faint);
          margin-bottom: 14px;
        }

        .vip__emptyTitle {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 6px;
        }

        .vip__emptyText {
          font-size: 12.5px;
          color: var(--text-muted);
          margin: 0;
        }

        /* Modal */
        .vip__modalOverlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.65);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 1000;
        }

        .vip__modalCard {
          width: 100%;
          max-width: 360px;
          max-height: 86vh;
          overflow-y: auto;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 18px;
          padding: 20px;
        }

        .vip__modalHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .vip__modalTitle {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .vip__modalClose {
          color: var(--text-faint);
          cursor: pointer;
          font-size: 16px;
        }

        .vip__modalClose:hover {
          color: var(--text-primary);
        }

        .vip__modalImage {
          width: 100%;
          height: 140px;
          border-radius: 12px;
          overflow: hidden;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
        }

        .vip__modalImage img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .vip__modalDesc {
          font-size: 12.5px;
          color: var(--text-muted);
          line-height: 1.6;
          margin: 0 0 14px;
        }

        .vip__modalDetails {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 14px;
        }

        .vip__modalDetailRow {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--bg-card-alt);
          border-radius: 10px;
          padding: 10px 12px;
        }

        .vip__modalDetailRow i {
          color: var(--accent);
          font-size: 13px;
          width: 14px;
        }

        .vip__modalDetailLabel {
          flex: 1;
          font-size: 12px;
          color: var(--text-muted);
        }

        .vip__modalDetailValue {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .vip__modalBenefits {
          margin-bottom: 16px;
        }

        .vip__modalBenefitsTitle {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          color: var(--text-faint);
          margin-bottom: 8px;
        }

        .vip__benefitsList {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .vip__benefitItem {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 12.5px;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .vip__benefitItem i {
          color: var(--success);
          font-size: 11px;
          margin-top: 3px;
          flex-shrink: 0;
        }

        .vip__modalActions {
          display: flex;
          gap: 10px;
        }

        .vip__cancelBtn {
          flex: 1;
          margin: 0;
          background: var(--bg-card-alt);
          border: 1px solid var(--border);
          border-radius: 12px;
          color: var(--text-primary);
          font-size: 13px;
          font-weight: 700;
          padding: 12px 0;
          cursor: pointer;
        }

        .vip__confirmBtn {
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

        .vip__confirmBtn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .vip__spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.25);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: vip__spin 0.8s linear infinite;
        }

        .vip__spinner--dark {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(11, 14, 17, 0.25);
          border-top-color: var(--accent-text-on);
        }

        @keyframes vip__spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default VipPage;
