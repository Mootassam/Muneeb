import React, { useEffect, useState, useCallback, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import vipActions from "src/modules/vip/list/vipListActions";
import vipSelectors from "src/modules/vip/list/vipListSelectors";
import LoadingModal from "src/shared/LoadingModal";
import authSelectors from "src/modules/auth/authSelectors";
import authActions from "src/modules/auth/authActions";
import SubHeader from "src/view/shared/Header/SubHeader";
import { i18n } from "../../../i18n";

interface VipItem {
  id: string;
  title: string;
  Entrylimit: string;
  levellimit: string;
  dailyorder: string;
  comisionrate: string;
  commissionmergedata?: string;
  tasksperday?: string;
  setperday?: string;
  photo?: Array<{ downloadUrl: string }>;
  description?: string;
  benefits?: string[];
  price?: string;
}

const VipLevelCard = memo(
  ({
    vip,
    isCurrent,
    canUpgrade,
    isLoading,
    onSelect,
  }: {
    vip: VipItem;
    isCurrent: boolean;
    canUpgrade: boolean;
    isLoading: boolean;
    onSelect: (vip: VipItem) => void;
  }) => {
    const photoUrl = vip?.photo?.[0]?.downloadUrl;

    return (
      <div
        className={`vip__card ${isCurrent ? "vip__card--current" : ""} ${
          !canUpgrade ? "vip__card--locked" : ""
        }`}
        onClick={() => canUpgrade && onSelect(vip)}
      >
        {isLoading && (
          <div className="vip__cardLoading">
            <div className="vip__spinner"></div>
          </div>
        )}

        <div className="vip__cardImage">
          {photoUrl ? (
            <img src={photoUrl} alt={vip?.title} loading="lazy" />
          ) : (
            <i className="fa-solid fa-crown vip__cardImagePlaceholder"></i>
          )}

          <span
            className={`vip__ribbon ${
              isCurrent
                ? "vip__ribbon--current"
                : !canUpgrade
                ? "vip__ribbon--locked"
                : "vip__ribbon--upgrade"
            }`}
          >
            {isCurrent ? (
              <>
                <i className="fa-solid fa-crown"></i>
                {i18n("pages.vip.currentLevel")}
              </>
            ) : !canUpgrade ? (
              <>
                <i className="fa-solid fa-lock"></i>
                {i18n("pages.vip.locked")}
              </>
            ) : (
              i18n("pages.vip.upgrade")
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

            {vip.commissionmergedata && (
              <div className="vip__feature">
                <i className="fa-solid fa-star"></i>
                <span>
                  {vip.commissionmergedata}% {i18n("pages.vip.premiumCommission")}
                </span>
              </div>
            )}

            <div className="vip__feature">
              <i className="fa-solid fa-box"></i>
              <span>
                {i18n("pages.vip.maxOrders")}: {vip.tasksperday}
              </span>
            </div>

            <div className="vip__feature">
              <i className="fa-solid fa-calendar-day"></i>
              <span>
                {i18n("pages.vip.setperday")}: {vip.setperday}
              </span>
            </div>
          </div>

          {vip.price && (
            <div className="vip__price">
              <i className="fa-solid fa-tag"></i>
              {vip.price}
            </div>
          )}
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

  const [selectedVip, setSelectedVip] = useState<VipItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [upgradingVipId, setUpgradingVipId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(vipActions.doFetch());
  }, [dispatch]);

  const filteredVipRecords: VipItem[] =
    vipRecords?.filter(
      (vip: VipItem) =>
        vip.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vip.description?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const handleShowModal = useCallback((vip: VipItem) => {
    setSelectedVip(vip);
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setSelectedVip(null);
  }, []);

  const handleUpgrade = useCallback(
    async (vip: VipItem) => {
      setUpgradingVipId(vip.id);
      try {
        await dispatch(authActions.doUpdateProfileMobile({ vip }));
        setShowModal(false);
      } catch (error) {
        console.error("Upgrade failed:", error);
      } finally {
        setUpgradingVipId(null);
      }
    },
    [dispatch]
  );

  const canUpgradeTo = useCallback(
    (vip: VipItem) => {
      if (!currentUser?.vip?.id) {
        return true;
      }

      const currentLevel = vipRecords?.find((v: VipItem) => v.id === currentUser.vip.id);

      if (currentLevel && vip) {
        return (
          parseInt(vip.levellimit) > parseInt(currentLevel.levellimit) ||
          parseInt(vip.dailyorder) > parseInt(currentLevel.dailyorder)
        );
      }

      return true;
    },
    [currentUser, vipRecords]
  );

  return (
    <div>
      <SubHeader title={i18n("pages.vip.title")} path="/" />

      <div className="vip__page">
        <div className="vip__intro">
          <p className="vip__introText">{i18n("pages.vip.subtitle")}</p>
          {currentUser?.vip && (
            <span className="vip__currentChip">
              <i className="fa-solid fa-crown"></i>
              {i18n("pages.vip.currentlyOn")}: {currentUser.vip.title}
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
                isCurrent={currentUser?.vip?.id === vip.id}
                canUpgrade={canUpgradeTo(vip)}
                isLoading={upgradingVipId === vip.id}
                onSelect={handleShowModal}
              />
            ))}
          </div>
        )}
      </div>

      {selectedVip && showModal && (
        <div className="vip__modalOverlay" onClick={handleCloseModal}>
          <div className="vip__modalCard" onClick={(event) => event.stopPropagation()}>
            <div className="vip__modalHeader">
              <div className="vip__modalTitle">
                {i18n("pages.vip.upgradeTo")} {selectedVip.title}
              </div>
              <i className="fa-solid fa-xmark vip__modalClose" onClick={handleCloseModal}></i>
            </div>

            <div className="vip__modalImage">
              {selectedVip?.photo?.[0]?.downloadUrl ? (
                <img src={selectedVip.photo[0].downloadUrl} alt={selectedVip?.title} loading="lazy" />
              ) : (
                <i className="fa-solid fa-crown vip__cardImagePlaceholder"></i>
              )}
            </div>

            {selectedVip.description && (
              <p className="vip__modalDesc">{selectedVip.description}</p>
            )}

            <div className="vip__modalDetails">
              <div className="vip__modalDetailRow">
                <i className="fa-solid fa-layer-group"></i>
                <span className="vip__modalDetailLabel">{i18n("pages.vip.levelLimit")}</span>
                <span className="vip__modalDetailValue">{selectedVip.levellimit}</span>
              </div>
              <div className="vip__modalDetailRow">
                <i className="fa-solid fa-calendar-day"></i>
                <span className="vip__modalDetailLabel">{i18n("pages.vip.setperday")}</span>
                <span className="vip__modalDetailValue">{selectedVip.setperday}</span>
              </div>
              <div className="vip__modalDetailRow">
                <i className="fa-solid fa-percent"></i>
                <span className="vip__modalDetailLabel">{i18n("pages.vip.commissionRate")}</span>
                <span className="vip__modalDetailValue">{selectedVip.comisionrate}%</span>
              </div>
              {selectedVip.commissionmergedata && (
                <div className="vip__modalDetailRow">
                  <i className="fa-solid fa-star"></i>
                  <span className="vip__modalDetailLabel">{i18n("pages.vip.premiumCommission")}</span>
                  <span className="vip__modalDetailValue">{selectedVip.commissionmergedata}%</span>
                </div>
              )}
              <div className="vip__modalDetailRow">
                <i className="fa-solid fa-box"></i>
                <span className="vip__modalDetailLabel">{i18n("pages.vip.maxOrders")}</span>
                <span className="vip__modalDetailValue">{selectedVip.tasksperday}</span>
              </div>
            </div>

            {selectedVip.benefits && selectedVip.benefits.length > 0 && (
              <div className="vip__modalBenefits">
                <div className="vip__modalBenefitsTitle">{i18n("pages.vip.benefits")}</div>
                <ul className="vip__benefitsList">
                  {selectedVip.benefits.map((benefit, index) => (
                    <li key={index} className="vip__benefitItem">
                      <i className="fa-solid fa-check"></i>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="vip__modalActions">
              <button className="vip__cancelBtn" onClick={handleCloseModal}>
                {i18n("pages.vip.cancel")}
              </button>
              <button
                className="vip__confirmBtn"
                onClick={() => handleUpgrade(selectedVip)}
                disabled={upgradingVipId === selectedVip.id}
              >
                {upgradingVipId === selectedVip.id ? (
                  <>
                    <div className="vip__spinner vip__spinner--dark"></div>
                    {i18n("pages.vip.upgrading")}
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-arrow-up"></i>
                    {i18n("pages.vip.upgradeNow")}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .vip__page {
          min-height: 100vh;
          background: #06070b;
          color: #eaecef;
          padding: 16px 14px 100px;
          font-family: "Poppins", -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .vip__intro {
          margin-bottom: 16px;
        }

        .vip__introText {
          font-size: 12.5px;
          color: #848e9c;
          line-height: 1.6;
          margin: 0 0 10px;
        }

        .vip__currentChip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(240, 185, 11, 0.12);
          border: 1px solid rgba(240, 185, 11, 0.3);
          color: #f0b90b;
          font-size: 12px;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 20px;
        }

        .vip__searchBox {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #14151d;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 11px 14px;
          margin-bottom: 18px;
        }

        .vip__searchBox i {
          color: #5e6673;
          font-size: 13px;
        }

        .vip__searchBox input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #eaecef;
          font-size: 14px;
          min-width: 0;
        }

        .vip__searchBox input::placeholder {
          color: #5e6673;
        }

        .vip__searchClear {
          flex-shrink: 0;
          margin: 0;
          background: transparent;
          border: none;
          color: #5e6673;
          cursor: pointer;
          font-size: 12px;
        }

        .vip__searchClear:hover {
          color: #848e9c;
        }

        .vip__list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .vip__card {
          background: #14151d;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 18px;
          overflow: hidden;
          cursor: pointer;
          position: relative;
          box-shadow: 0 10px 22px rgba(0, 0, 0, 0.28);
        }

        .vip__card--current {
          border-color: rgba(240, 185, 11, 0.4);
        }

        .vip__card--locked {
          cursor: not-allowed;
          opacity: 0.55;
        }

        .vip__cardLoading {
          position: absolute;
          inset: 0;
          background: rgba(6, 7, 11, 0.6);
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
          background: #f0b90b;
          color: #0b0e11;
        }

        .vip__ribbon--upgrade {
          background: rgba(11, 14, 17, 0.75);
          color: #f5f6f8;
        }

        .vip__ribbon--locked {
          background: rgba(11, 14, 17, 0.75);
          color: #848e9c;
        }

        .vip__cardBody {
          padding: 14px 16px 16px;
        }

        .vip__cardTitle {
          font-size: 16px;
          font-weight: 700;
          color: #f5f6f8;
          margin-bottom: 4px;
        }

        .vip__cardDesc {
          font-size: 12px;
          color: #848e9c;
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
          background: #1a1c26;
          border-radius: 10px;
          padding: 8px 10px;
          font-size: 11px;
          color: #c7cad1;
        }

        .vip__feature i {
          color: #f0b90b;
          font-size: 11px;
          flex-shrink: 0;
        }

        .vip__price {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 700;
          color: #0ecb81;
        }

        /* Empty state */
        .vip__empty {
          text-align: center;
          padding: 60px 16px;
          background: #14151d;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
        }

        .vip__empty i {
          font-size: 30px;
          color: #3a3d47;
          margin-bottom: 14px;
        }

        .vip__emptyTitle {
          font-size: 14px;
          font-weight: 700;
          color: #eaecef;
          margin-bottom: 6px;
        }

        .vip__emptyText {
          font-size: 12.5px;
          color: #848e9c;
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
          background: #14151d;
          border: 1px solid rgba(255, 255, 255, 0.08);
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
          color: #f5f6f8;
        }

        .vip__modalClose {
          color: #5e6673;
          cursor: pointer;
          font-size: 16px;
        }

        .vip__modalClose:hover {
          color: #eaecef;
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
          color: #848e9c;
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
          background: #1a1c26;
          border-radius: 10px;
          padding: 10px 12px;
        }

        .vip__modalDetailRow i {
          color: #f0b90b;
          font-size: 13px;
          width: 14px;
        }

        .vip__modalDetailLabel {
          flex: 1;
          font-size: 12px;
          color: #848e9c;
        }

        .vip__modalDetailValue {
          font-size: 13px;
          font-weight: 700;
          color: #eaecef;
        }

        .vip__modalBenefits {
          margin-bottom: 16px;
        }

        .vip__modalBenefitsTitle {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          color: #5e6673;
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
          color: #c7cad1;
          line-height: 1.5;
        }

        .vip__benefitItem i {
          color: #0ecb81;
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
          background: #1a1c26;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          color: #eaecef;
          font-size: 13px;
          font-weight: 700;
          padding: 12px 0;
          cursor: pointer;
        }

        .vip__confirmBtn {
          flex: 1;
          margin: 0;
          background: #f0b90b;
          border: none;
          border-radius: 12px;
          color: #0b0e11;
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
          border-top-color: #f0b90b;
          border-radius: 50%;
          animation: vip__spin 0.8s linear infinite;
        }

        .vip__spinner--dark {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(11, 14, 17, 0.25);
          border-top-color: #0b0e11;
        }

        @keyframes vip__spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default VipPage;
