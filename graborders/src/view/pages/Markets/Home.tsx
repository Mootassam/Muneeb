import React, { useEffect, useState, useCallback, memo } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import vipActions from "src/modules/vip/list/vipListActions";
import vipSelectors from "src/modules/vip/list/vipListSelectors";
import LoadingModal from "src/shared/LoadingModal";
import authSelectors from "src/modules/auth/authSelectors";
import authActions from "src/modules/auth/authActions";
import companyActions from "src/modules/company/list/companyListActions";
import companySelectors from "src/modules/company/list/companyListSelectors";
import { i18n } from "../../../i18n";
import logos from "src/shared/data/logos";
import productImages from "src/shared/data/images";
import LiveActivityToast from "./LiveActivityToast";

interface DataItem {
  id: string;
  image: string;
  title: string;
  Entrylimit: string;
  levellimit: string;
  dailyorder: string;
  comisionrate: string;
  commissionmergedata?: string;
  tasksperday?: string;
  photo?: Array<{ downloadUrl: string }>;
}

const HERO_SLIDES = productImages.slice(0, 6);
const FEATURED_PRODUCTS = productImages.slice(10, 18);

const QUICK_ACTIONS = [
  { icon: "fa-solid fa-headphones", label: "services", link: "/Online" },
  { icon: "fa-solid fa-calendar", label: "events", link: "/events" },
  { icon: "fa-regular fa-building", label: "about", link: "/company" },
  { icon: "fa-solid fa-file-contract", label: "terms", link: "/tc" },
  { icon: "fa-solid fa-certificate", label: "certificate", link: "/Certificate" },
  { icon: "fa-solid fa-circle-question", label: "faqs", link: "/faqs" },
];

const TRUST_ITEMS = [
  { icon: "fa-solid fa-shield-halved", titleKey: "secureTitle", textKey: "secureText" },
  { icon: "fa-solid fa-bolt", titleKey: "fastTitle", textKey: "fastText" },
  { icon: "fa-solid fa-headset", titleKey: "supportTitle", textKey: "supportText" },
  { icon: "fa-solid fa-circle-check", titleKey: "verifiedTitle", textKey: "verifiedText" },
];

const VipLevelCard = memo(({
  item,
  isCurrent,
  onShowModal,
}: {
  item: DataItem;
  isCurrent: boolean;
  onShowModal: (item: DataItem) => void;
}) => {
  return (
    <div
      className={`home__vipCard ${isCurrent ? "home__vipCard--current" : ""}`}
      onClick={() => onShowModal(item)}
    >
      <div className="home__vipBadge">
        {isCurrent ? (
          <span className="home__vipBadgeCurrent">
            <i className="fa-solid fa-crown"></i>
            {i18n("pages.home.currentLevel")}
          </span>
        ) : (
          <span className="home__vipBadgeUpgrade">{i18n("pages.home.upgrade")}</span>
        )}
      </div>

      <div className="home__vipImage">
        <img src={item?.photo?.[0]?.downloadUrl} alt={item?.title} loading="lazy" />
      </div>

      <div className="home__vipTitle">{item?.title}</div>

      <div className="home__vipFeature">
        <i className="fa-solid fa-chart-line"></i>
        {item.comisionrate}% {i18n("pages.home.profitNormal")}
      </div>
      <div className="home__vipFeature">
        <i className="fa-solid fa-star"></i>
        {item.commissionmergedata}% {i18n("pages.home.profitPremium")}
      </div>
      <div className="home__vipFeature">
        <i className="fa-solid fa-box"></i>
        {i18n("pages.home.maxOrders")} {item.tasksperday}
      </div>
    </div>
  );
});

VipLevelCard.displayName = "VipLevelCard";

function Home() {
  const dispatch = useDispatch();
  const record = useSelector(vipSelectors.selectRows);
  const loading = useSelector(vipSelectors.selectLoading);
  const currentUser = useSelector(authSelectors.selectCurrentUser);
  const companyRecord = useSelector(companySelectors.selectRows);
  const company = companyRecord?.[0];

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DataItem | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [showNotificationModal, setShowNotificationModal] = useState(
    !!currentUser?.notification
  );

  useEffect(() => {
    if (currentUser?.notification) {
      setShowNotificationModal(true);
    }
  }, [currentUser?.notification]);

  const fetchCompany = useCallback(() => {
    dispatch(companyActions.doFetch());
  }, [dispatch]);

  const fetchVipData = useCallback(() => {
    dispatch(vipActions.doFetch());
  }, [dispatch]);

  const hideModal = useCallback(() => {
    setModalOpen(false);
    setSelectedItem(null);
  }, []);

  const showModal = useCallback((item: DataItem) => {
    setSelectedItem(item);
    setModalOpen(true);
  }, []);

  const submitUpgrade = useCallback(
    (item: DataItem) => {
      dispatch(authActions.doUpdateProfileMobile({ vip: item }));
      setModalOpen(false);
      setSelectedItem(null);
    },
    [dispatch]
  );

  useEffect(() => {
    fetchCompany();
    fetchVipData();
  }, [fetchCompany, fetchVipData]);

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
      {/* Hero */}
      <div className="home__hero">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.url}
            className={`home__heroSlide ${index === currentSlide ? "home__heroSlide--active" : ""}`}
            style={{ backgroundImage: `url(${slide.url})` }}
          />
        ))}

        <div className="home__heroOverlay">
          <div className="home__heroText">
            <div className="home__heroGreeting">{greeting}</div>
            <div className="home__heroTagline">{i18n("pages.home.heroTagline")}</div>
          </div>
          <Link to="/vip" className="home__heroCta">
            {i18n("pages.home.viewAllVIP")}
            <i className="fa-solid fa-arrow-right"></i>
          </Link>
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
      </div>

      <div className="home__body">
        {/* Announcement */}
        <div className="home__announcement">
          <i className="fa-solid fa-volume-high"></i>
          <span>{i18n("pages.home.announcement")}</span>
        </div>

        {/* Quick actions */}
        <div className="home__actionsGrid">
          {QUICK_ACTIONS.map((item) => (
            <Link key={item.link} to={item.link} className="home__actionItem">
              <span className="home__actionIcon">
                <i className={item.icon}></i>
              </span>
              <span className="home__actionLabel">{i18n(`pages.home.${item.label}`)}</span>
            </Link>
          ))}
        </div>

        {/* Trust section */}
        <div className="home__sectionTitle">{i18n("pages.home.whyChooseUs")}</div>
        <div className="home__trustGrid">
          {TRUST_ITEMS.map((item) => (
            <div className="home__trustCard" key={item.titleKey}>
              <span className="home__trustIcon">
                <i className={item.icon}></i>
              </span>
              <div className="home__trustTitle">
                {i18n(`pages.home.trust.${item.titleKey}`)}
              </div>
              <div className="home__trustText">
                {i18n(`pages.home.trust.${item.textKey}`)}
              </div>
            </div>
          ))}
        </div>

        {/* VIP levels */}
        <div className="home__sectionHeader">
          <div>
            <div className="home__sectionTitle home__sectionTitle--noMargin">
              {i18n("pages.home.levels")}
            </div>
            <div className="home__sectionSubtitle">{i18n("pages.home.chooseLevel")}</div>
          </div>
          <Link to="/vip" className="home__sectionLink">
            {i18n("pages.home.viewAllVIP")}
          </Link>
        </div>

        {loading && <LoadingModal />}
        {!loading && record && record.length > 0 && (
          <div className="home__vipScroll">
            {record.map((item, index) => (
              <VipLevelCard
                key={item.id || index}
                item={item}
                isCurrent={currentUser?.vip?.id === item.id}
                onShowModal={showModal}
              />
            ))}
          </div>
        )}

        {/* Featured products */}
        <div className="home__sectionTitle">{i18n("pages.home.featuredTitle")}</div>
        <div className="home__sectionSubtitle home__sectionSubtitle--block">
          {i18n("pages.home.featuredSubtitle")}
        </div>
        <div className="home__productsScroll">
          {FEATURED_PRODUCTS.map((product) => (
            <div className="home__productCard" key={product.url}>
              <img src={product.url} alt="" loading="lazy" />
            </div>
          ))}
        </div>

        {/* About us */}
        <div className="home__aboutCard">
          <div className="home__sectionTitle home__sectionTitle--noMargin">
            {company?.name || i18n("pages.home.aboutTitle")}
          </div>
          {company?.companydetails ? (
            <div
              className="home__aboutText"
              dangerouslySetInnerHTML={{ __html: company.companydetails }}
            />
          ) : (
            <p className="home__aboutText">{i18n("pages.home.aboutFallback")}</p>
          )}
        </div>

        {/* Trusted partners */}
        <div className="home__logoSlider">
          <div className="home__logoTrack">
            {logos.map((logo, index) => (
              <div key={`a-${index}`} className="home__logoItem">
                <img src={logo.url} alt="" loading="lazy" />
              </div>
            ))}
            {logos.map((logo, index) => (
              <div key={`b-${index}`} className="home__logoItem">
                <img src={logo.url} alt="" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* VIP upgrade modal */}
      {selectedItem && modalOpen && (
        <div className="home__modalOverlay" onClick={hideModal}>
          <div className="home__modalCard" onClick={(e) => e.stopPropagation()}>
            <div className="home__modalHeader">
              <div className="home__modalTitle">{i18n("pages.home.modal.levelDetails")}</div>
              <i className="fa-solid fa-xmark home__modalClose" onClick={hideModal}></i>
            </div>

            <div className="home__modalImage">
              <img src={selectedItem?.photo?.[0]?.downloadUrl} alt={selectedItem?.title} loading="lazy" />
            </div>

            <div className="home__modalDetails">
              <div className="home__modalDetailRow">
                <i className="fa-solid fa-layer-group"></i>
                <span className="home__modalDetailLabel">{i18n("pages.home.modal.levelLimit")}</span>
                <span className="home__modalDetailValue">{selectedItem?.levellimit}</span>
              </div>
              <div className="home__modalDetailRow">
                <i className="fa-solid fa-calendar-day"></i>
                <span className="home__modalDetailLabel">{i18n("pages.home.modal.dailyOrders")}</span>
                <span className="home__modalDetailValue">{selectedItem?.dailyorder}</span>
              </div>
              <div className="home__modalDetailRow">
                <i className="fa-solid fa-percent"></i>
                <span className="home__modalDetailLabel">{i18n("pages.home.modal.commissionRate")}</span>
                <span className="home__modalDetailValue">{selectedItem?.comisionrate}%</span>
              </div>
            </div>

            <div className="home__modalActions">
              <button className="home__modalCancelBtn" onClick={hideModal}>
                {i18n("pages.home.modal.cancel")}
              </button>
              <button className="home__modalConfirmBtn" onClick={() => submitUpgrade(selectedItem)}>
                <i className="fa-solid fa-arrow-up"></i>
                {i18n("pages.home.modal.upgradeNow")}
              </button>
            </div>
          </div>
        </div>
      )}

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

      <LiveActivityToast />

      <style>{`
        .home__page {
          background: #06070b;
          color: #eaecef;
          font-family: "Poppins", -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        /* Hero */
        .home__hero {
          position: relative;
          height: 220px;
          overflow: hidden;
          border-radius: 0 0 22px 22px;
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

        .home__heroOverlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(6, 7, 11, 0.25) 0%, rgba(6, 7, 11, 0.92) 100%);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 16px;
          gap: 12px;
        }

        .home__heroGreeting {
          font-size: 17px;
          font-weight: 700;
          color: #f5f6f8;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .home__heroTagline {
          font-size: 12.5px;
          color: #c7cad1;
          margin-top: 3px;
        }

        .home__heroCta {
          align-self: flex-start;
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f0b90b;
          color: #0b0e11;
          font-size: 13px;
          font-weight: 700;
          padding: 9px 16px;
          border-radius: 20px;
          text-decoration: none;
        }

        .home__heroDots {
          position: absolute;
          top: 14px;
          right: 16px;
          display: flex;
          gap: 5px;
        }

        .home__heroDot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.35);
          border: none;
          margin: 0;
          padding: 0;
          cursor: pointer;
        }

        .home__heroDot--active {
          background: #f0b90b;
          width: 16px;
          border-radius: 4px;
        }

        /* Body */
        .home__body {
          padding: 16px 14px 24px;
        }

        .home__announcement {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #14151d;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 14px;
          padding: 11px 14px;
          font-size: 12px;
          color: #848e9c;
          margin-bottom: 16px;
        }

        .home__announcement i {
          color: #f0b90b;
          flex-shrink: 0;
        }

        .home__actionsGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 20px;
        }

        .home__actionItem {
          background: #14151d;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 14px;
          padding: 14px 6px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          text-decoration: none;
        }

        .home__actionIcon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: rgba(240, 185, 11, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .home__actionIcon i {
          color: #f0b90b;
          font-size: 15px;
        }

        .home__actionLabel {
          font-size: 11px;
          font-weight: 600;
          color: #c7cad1;
          text-align: center;
        }

        .home__sectionTitle {
          font-size: 15px;
          font-weight: 700;
          color: #f5f6f8;
          margin-bottom: 12px;
        }

        .home__sectionTitle--noMargin {
          margin-bottom: 3px;
        }

        .home__sectionSubtitle {
          font-size: 12px;
          color: #848e9c;
        }

        .home__sectionSubtitle--block {
          margin-bottom: 12px;
        }

        .home__sectionHeader {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 12px;
          gap: 10px;
        }

        .home__sectionLink {
          flex-shrink: 0;
          font-size: 11.5px;
          font-weight: 700;
          color: #f0b90b;
          text-decoration: none;
          padding-top: 2px;
        }

        /* Trust */
        .home__trustGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 24px;
        }

        .home__trustCard {
          background: #14151d;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 14px;
          padding: 14px;
        }

        .home__trustIcon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(14, 203, 129, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;
        }

        .home__trustIcon i {
          color: #0ecb81;
          font-size: 15px;
        }

        .home__trustTitle {
          font-size: 13px;
          font-weight: 700;
          color: #eaecef;
          margin-bottom: 4px;
        }

        .home__trustText {
          font-size: 11px;
          color: #848e9c;
          line-height: 1.5;
        }

        /* VIP scroll */
        .home__vipScroll {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding-bottom: 6px;
          margin-bottom: 24px;
          scrollbar-width: none;
        }

        .home__vipScroll::-webkit-scrollbar {
          display: none;
        }

        .home__vipCard {
          flex: 0 0 148px;
          background: #14151d;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          padding: 12px;
          cursor: pointer;
        }

        .home__vipCard--current {
          border-color: rgba(240, 185, 11, 0.4);
        }

        .home__vipBadge {
          margin-bottom: 8px;
        }

        .home__vipBadgeCurrent {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: rgba(240, 185, 11, 0.14);
          color: #f0b90b;
          font-size: 10px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 20px;
        }

        .home__vipBadgeUpgrade {
          display: inline-block;
          background: rgba(255, 255, 255, 0.06);
          color: #848e9c;
          font-size: 10px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 20px;
        }

        .home__vipImage {
          width: 100%;
          height: 84px;
          border-radius: 10px;
          overflow: hidden;
          background: #fff;
          margin-bottom: 10px;
        }

        .home__vipImage img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .home__vipTitle {
          font-size: 13px;
          font-weight: 700;
          color: #f5f6f8;
          margin-bottom: 8px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .home__vipFeature {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 10.5px;
          color: #848e9c;
          margin-bottom: 5px;
        }

        .home__vipFeature i {
          color: #f0b90b;
          font-size: 10px;
          width: 12px;
          flex-shrink: 0;
        }

        /* Featured products */
        .home__productsScroll {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding-bottom: 6px;
          margin-bottom: 24px;
          scrollbar-width: none;
        }

        .home__productsScroll::-webkit-scrollbar {
          display: none;
        }

        .home__productCard {
          flex: 0 0 100px;
          width: 100px;
          height: 100px;
          background: #f5f6f8;
          border-radius: 14px;
          padding: 8px;
          box-sizing: border-box;
        }

        .home__productCard img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        /* About */
        .home__aboutCard {
          background: #14151d;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 20px;
        }

        .home__aboutText {
          font-size: 12.5px;
          color: #848e9c;
          line-height: 1.7;
          margin: 0;
        }

        /* Logo slider */
        .home__logoSlider {
          background: #14151d;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          padding: 16px 0;
          overflow: hidden;
        }

        .home__logoTrack {
          display: flex;
          align-items: center;
          gap: 28px;
          width: max-content;
          animation: home__scroll 22s linear infinite;
        }

        .home__logoItem {
          flex-shrink: 0;
          height: 26px;
          display: flex;
          align-items: center;
        }

        .home__logoItem img {
          height: 100%;
          width: auto;
          object-fit: contain;
          opacity: 0.7;
          filter: grayscale(1) brightness(2);
        }

        @keyframes home__scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        /* Modals */
        .home__modalOverlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.65);
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
          background: #14151d;
          border: 1px solid rgba(255, 255, 255, 0.08);
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
          color: #f5f6f8;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .home__modalTitle i {
          color: #f0b90b;
        }

        .home__modalClose {
          color: #5e6673;
          cursor: pointer;
          font-size: 16px;
        }

        .home__modalClose:hover {
          color: #eaecef;
        }

        .home__modalImage {
          width: 100%;
          height: 140px;
          border-radius: 12px;
          overflow: hidden;
          background: #fff;
          margin-bottom: 14px;
        }

        .home__modalImage img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .home__modalDetails {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 18px;
        }

        .home__modalDetailRow {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #1a1c26;
          border-radius: 10px;
          padding: 10px 12px;
        }

        .home__modalDetailRow i {
          color: #f0b90b;
          font-size: 13px;
          width: 14px;
        }

        .home__modalDetailLabel {
          flex: 1;
          font-size: 12px;
          color: #848e9c;
        }

        .home__modalDetailValue {
          font-size: 13px;
          font-weight: 700;
          color: #eaecef;
        }

        .home__modalActions {
          display: flex;
          gap: 10px;
        }

        .home__modalCancelBtn {
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

        .home__modalConfirmBtn {
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

        .home__modalConfirmBtn--full {
          width: 100%;
        }

        .home__noticeText {
          font-size: 13.5px;
          color: #c7cad1;
          line-height: 1.7;
          white-space: pre-wrap;
          margin: 0 0 18px;
        }
      `}</style>
    </div>
  );
}

export default memo(Home);
