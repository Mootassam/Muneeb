import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import authSelectors from "src/modules/auth/authSelectors";
import actions from "src/modules/product/list/productListActions";
import selector from "src/modules/product/list/productListSelectors";
import recordListAction from "src/modules/record/list/recordListActions";
import recordSelector from "src/modules/record/list/recordListSelectors";
import recordActions from "src/modules/record/form/recordFormActions";

import LoadingModal from "src/shared/LoadingModal";
import Dates from "src/view/shared/utils/Dates";
import Image from "src/shared/Images";
import GrapModal from "./GrapModal";
import PrizeModal from "./PrizeModal";
import { i18n } from "../../../i18n";
import Message from "src/view/shared/message";

const Grappage = () => {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showBalanceModal, setShowBalanceModal] = useState(false);

  const dispatch = useDispatch();

  const currentUser = useSelector(authSelectors.selectCurrentUser);
  const items = useSelector(selector.selectRows);
  const loading = useSelector(selector.selectLoading);
  const showModal = useSelector(selector.showModal);
  const totalperday = useSelector(recordSelector.selectTotalPerday);

  const [number] = useState(Dates.Number());

  // Initialize random images
  const initializeImages = async () => {
    try {
      const initialImages = await Promise.all(
        Array(12).fill(0).map(() => Image.randomImages())
      );
      setImages(initialImages);
      setIsInitialized(true);
    } catch (error) {
      console.error("Error loading images:", error);
      const fallback = "https://plus.unsplash.com/premium_photo-1664392147011-2a720f214e01?q=80&w=878&auto=format&fit=crop";
      setImages(Array(12).fill(fallback));
      setIsInitialized(true);
    }
  };

  // Get visible images (Left, Center, Right)
  const getVisibleImages = useCallback(() => {
    if (images.length === 0) return [];
    return [
      images[(currentIndex - 1 + images.length) % images.length],
      images[currentIndex % images.length],
      images[(currentIndex + 1) % images.length],
    ];
  }, [images, currentIndex]);

  const visibleImages = getVisibleImages();

  // Smooth next slide
  const slideToNext = useCallback(() => {
    if (isAnimating || !isInitialized || images.length === 0) return;

    setIsAnimating(true);

    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
      setTimeout(() => setIsAnimating(false), 700);
    }, 30);
  }, [isAnimating, isInitialized, images.length]);

  // Initialize data
  useEffect(() => {
    dispatch(recordListAction.doCount());
    dispatch(recordListAction.doCountDay());
    initializeImages();
  }, [dispatch]);

  // Auto-play slider
  useEffect(() => {
    if (!isInitialized) return;
    const interval = setInterval(slideToNext, 3200);
    return () => clearInterval(interval);
  }, [isInitialized, slideToNext]);

  // Balance and task warnings
  useEffect(() => {
    if ((currentUser?.balance || 0) < 0) {
      setShowBalanceModal(true);
    }
    if (currentUser?.tasksDone >= currentUser?.vip?.dailyorder) {
      Message.success("You have completed all available tasks. Please contact support to reset your account.");
    }
  }, [currentUser]);

   const rollAll = async () => {
     if (currentUser?.balance <= 0) {
       setShowBalanceModal(true);
       return;
     }
     if (currentUser?.tasksDone >= currentUser?.vip?.dailyorder) {
       Message.success("You have completed all available tasks. Please contact support to reset your account.");
       return;
     }

     // The server's grapOrders() endpoint already inspects productItemMappings
     // and returns the correct product for the current task position.
     // We just trigger the fetch — no extra filter needed from the client side.
     await dispatch(actions.doFetch());
   };

  const hideModal = () => {
    dispatch(actions.doCloseModal());
  };

  const submit = async () => {
    const values = {
      number,
      product: items?.id,
      price: items?.amount,
      commission: items?.commission,
      status: items?.type === "combo" ? "pending" : "completed",
      user: currentUser.id,
    };
    await dispatch(recordActions.doCreate(values));
  };

  const tasksDone = currentUser?.tasksDone || 0;
  const dailyOrders = currentUser?.vip?.dailyorder || 0;
  const progressPct = dailyOrders > 0 ? Math.min(100, (tasksDone / dailyOrders) * 100) : 0;

  const balanceDeficit = Math.abs(currentUser?.balance || 0).toFixed(2);

  return (
    <div className="grappage-container">
      <div className="grappage-glow" />

      {/* Header */}
      <div className="grappage-header">
        <div className="user-greeting">
          <div className="greeting-content">
            <img src="/images/user.png" alt="User" className="user-avatar" />
            <div className="greeting-text-wrap">
              <span className="greeting-text">
                {i18n("pages.grab.greeting", currentUser.fullName)}
              </span>
              <span className="greeting-sub">{i18n("pages.grab.exclusiveChannel")}</span>
            </div>
          </div>
          <div className="vip-badge">{currentUser.vip?.title}</div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-icon">
              <img src="/images/wallet.png" alt="Wallet" />
            </div>
            <div className="stat-info">
              <div className="stat-title">{i18n("pages.grab.totalAmount")}</div>
              <div className="stat-subtitle">{i18n("pages.grab.profitsAdded")}</div>
            </div>
          </div>
          <div className="stat-amount">
            <div className="amount-value">{currentUser.balance?.toFixed(2) || "0.00"}</div>
            <div className="amount-currency">{i18n("pages.grab.currency")}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-icon">
              <img src="/images/T.png" alt="Commission" />
            </div>
            <div className="stat-info">
              <div className="stat-title">{i18n("pages.grab.todaysCommission")}</div>
              <div className="stat-subtitle">{i18n("pages.grab.commissionEarned")}</div>
            </div>
          </div>
          <div className="stat-amount">
            <div className="amount-value">{totalperday || "0.00"}</div>
            <div className="amount-currency">{i18n("pages.grab.currency")}</div>
          </div>
        </div>
      </div>

      {/* Main Game Section */}
      <div className="game-grid-section">
        <div className="game-header">
          <div className="vip-info">
            <div className="vip-title">{currentUser?.vip?.title}</div>
            <div className="commission-rate">
              <span className="rate-label">{i18n("pages.grab.commissionRate")}: </span>
              <span className="rate-value">{currentUser?.vip?.comisionrate}%</span>
            </div>
          </div>
          <div className="progress-pill">
            {i18n("pages.grab.progressCount", tasksDone, dailyOrders)}
          </div>
        </div>

        {/* Progress bar */}
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progressPct}%` }} />
        </div>

        {/* Enhanced Slider */}
        <div className="slider-container">
          <div className="slider-wrapper">
            <div className={`slider-track ${isAnimating ? "sliding" : ""}`}>
              {visibleImages.map((src, index) => (
                <div
                  key={`slide-${currentIndex}-${index}`}
                  className={`slider-item ${index === 1 ? "active" : ""}`}
                  data-position={index}
                >
                  <div className="image-container">
                    <img
                      src={src}
                      alt={`Product ${index + 1}`}
                      className="slider-image"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <div className="game-grid">
            <button
              className={`start-button ${loading ? "loading" : ""}`}
              onClick={rollAll}
              disabled={loading}
            >
              <span className="button-text">
                {loading ? i18n("pages.grab.processing") : i18n("pages.grab.startButton")}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Notice */}
      <div className="notice-section">
        <div className="notice-header">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 9v4M12 16.5h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
          </svg>
          <b>{i18n("pages.grab.notice")}</b>
        </div>
        <ul className="notice-list">
          <li>{i18n("pages.grab.supportHours")}</li>
          <li>{i18n("pages.grab.contactSupport")}</li>
        </ul>
      </div>

      {/* Modals */}
      {loading && <LoadingModal />}
      {items && items.type === "prizes" && showModal && !loading && (
        <PrizeModal items={items} number={number} hideModal={hideModal} submit={submit} />
      )}
      {items && items.type !== "prizes" && showModal && !loading && (
        <GrapModal items={items} number={number} hideModal={hideModal} submit={submit} />
      )}

      {showBalanceModal && (
        <div className="balance-modal-overlay" onClick={() => setShowBalanceModal(false)}>
          <div className="balance-modal-card" onClick={(e) => e.stopPropagation()}>
            <span className="balance-modal-icon">
              <i className="fa-solid fa-triangle-exclamation"></i>
            </span>
            <div className="balance-modal-text">
              {i18n("pages.grab.insufficientBalance")}{" "}
              <span className="balance-modal-amount">
                {balanceDeficit} {i18n("pages.grab.currency")}
              </span>
            </div>
            <Link
              to="/deposit"
              className="balance-modal-btn"
              onClick={() => setShowBalanceModal(false)}
            >
              {i18n("pages.grab.depositNow")}
            </Link>
          </div>
        </div>
      )}

      {/* Theme */}
      <style>{`
        .grappage-container {
          position: relative;
          margin: 0 auto;
          max-width: 460px;
          padding: 16px 14px 100px;
          background: #eaeded;
          min-height: 100vh;
          overflow: hidden;
          box-sizing: border-box;
          font-family: "Poppins", -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .grappage-container * {
          box-sizing: border-box;
        }

        .grappage-glow {
          position: absolute;
          top: -160px;
          left: 50%;
          transform: translateX(-50%);
          width: 680px;
          height: 320px;
          background: radial-gradient(ellipse at center, rgba(255, 138, 0, 0.14), transparent 70%);
          filter: blur(20px);
          pointer-events: none;
          z-index: 0;
        }

        .grappage-header,
        .stats-grid,
        .game-grid-section,
        .notice-section {
          position: relative;
          z-index: 1;
        }

        .grappage-header { margin-bottom: 14px; }
        .user-greeting {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(160deg, #ffb84d, #ff8a00 75%);
          padding: 16px 18px;
          border-radius: 16px;
          box-shadow: 0 10px 24px -10px rgba(255, 106, 0, 0.45);
        }
        .greeting-content {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }
        .user-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.85);
          flex-shrink: 0;
          background: #fff;
        }
        .greeting-text-wrap {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }
        .greeting-text {
          font-size: 14.5px;
          font-weight: 700;
          color: #fff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .greeting-sub {
          font-size: 11.5px;
          color: rgba(255, 255, 255, 0.85);
        }
        .vip-badge {
          background: #fff;
          color: #d1650a;
          padding: 7px 14px;
          border-radius: 20px;
          font-weight: 800;
          font-size: 12.5px;
          flex-shrink: 0;
          box-shadow: 0 2px 6px rgba(15, 17, 17, 0.12);
        }

        .balance-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 17, 17, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 1200;
          animation: balanceModalFadeIn 0.15s ease-out;
        }

        .balance-modal-card {
          width: 100%;
          max-width: 340px;
          background: #fff;
          border-radius: 20px;
          padding: 28px 24px 24px;
          text-align: center;
          box-shadow: 0 25px 60px -15px rgba(15, 17, 17, 0.35);
          animation: balanceModalIn 0.18s ease-out;
        }

        .balance-modal-icon {
          width: 56px;
          height: 56px;
          margin: 0 auto 16px;
          border-radius: 50%;
          background: #fdecea;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .balance-modal-icon i {
          color: #d13212;
          font-size: 22px;
        }

        .balance-modal-text {
          font-size: 14.5px;
          font-weight: 700;
          color: #d13212;
          line-height: 1.5;
          margin-bottom: 20px;
        }

        .balance-modal-amount {
          font-size: 16.5px;
          font-weight: 800;
        }

        .balance-modal-btn {
          display: block;
          width: 100%;
          text-align: center;
          background: linear-gradient(180deg, #ffb84d, #ff8a00);
          border: 1px solid #d17f00;
          border-radius: 12px;
          color: #17130d;
          font-size: 14.5px;
          font-weight: 700;
          padding: 12px 0;
          text-decoration: none;
          box-shadow: 0 8px 18px -8px rgba(255, 138, 0, 0.5);
        }

        @keyframes balanceModalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes balanceModalIn {
          from {
            opacity: 0;
            transform: scale(0.94) translateY(6px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 14px;
        }
        .stat-card {
          background: #fff;
          padding: 14px;
          border-radius: 14px;
          border: 1px solid #e7e7e7;
          box-shadow: 0 2px 8px rgba(15, 17, 17, 0.05);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .stat-content { display: flex; align-items: center; gap: 10px; }
        .stat-icon {
          width: 38px;
          height: 38px;
          background: #fff2e5;
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .stat-icon img { width: 20px; height: 20px; }
        .stat-title { font-weight: 700; color: #0f1111; font-size: 12.5px; }
        .stat-subtitle { font-size: 10.5px; color: #9aa0a6; }
        .amount-value {
          font-size: 19px;
          font-weight: 800;
          color: #ff6a00;
          font-variant-numeric: tabular-nums;
        }
        .amount-currency { font-size: 11px; color: #9aa0a6; font-weight: 500; }

        .game-grid-section {
          background: #fff;
          padding: 20px 18px;
          border-radius: 18px;
          border: 1px solid #e7e7e7;
          box-shadow: 0 2px 10px rgba(15, 17, 17, 0.06);
          margin-bottom: 14px;
        }

        .game-header {
          margin-bottom: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }
        .vip-title { font-size: 16.5px; font-weight: 700; color: #0f1111; }
        .commission-rate { font-size: 12px; color: #767676; }
        .rate-value { color: #ff6a00; font-weight: 700; }

        .progress-pill {
          background: #fff2e5;
          color: #d1650a;
          padding: 6px 13px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
        }

        .progress-track {
          height: 6px;
          background: #f0f1f3;
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: 20px;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #ffb84d, #ff8a00);
          border-radius: 6px;
          transition: width 0.4s ease;
        }

        /* =============== SLIDER =============== */
        .slider-container {
          margin: 0 0 4px;
        }
        .slider-wrapper {
          position: relative;
          height: 230px;
          overflow: hidden;
          border-radius: 18px;
        }
        .slider-track {
          display: flex;
          height: 100%;
          transition: transform 0.75s cubic-bezier(0.34, 1.56, 0.64, 1);
          will-change: transform;
        }

        .slider-item {
          flex: 0 0 33.333%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 10px;
          transition: all 0.5s ease;
        }

        .slider-item[data-position="0"],
        .slider-item[data-position="2"] {
          transform: scale(0.78);
          opacity: 0.5;
          filter: brightness(0.95);
        }

        .slider-item[data-position="1"] {
          transform: scale(1.03);
          opacity: 1;
          z-index: 10;
        }

        .slider-item.active .image-container {
          border: 3px solid #ff8a00;
          box-shadow: 0 16px 34px -10px rgba(255, 138, 0, 0.4);
        }

        .image-container {
          width: 100%;
          max-width: 225px;
          height: 210px;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #e7e7e7;
          background: #f7f8fa;
          transition: all 0.4s ease;
        }

        .slider-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .slider-item.active .slider-image:hover {
          transform: scale(1.06);
        }

        .game-grid {
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }

        .start-button {
          width: 100%;
          max-width: 320px;
          height: 52px;
          background: linear-gradient(180deg, #ffb84d, #ff8a00);
          border: 1px solid #d17f00;
          border-radius: 12px;
          color: #17130d;
          font-size: 15.5px;
          font-weight: 700;
          cursor: pointer;
          transition: filter 0.15s ease, transform 0.1s ease;
          position: relative;
          overflow: hidden;
          box-shadow: 0 8px 18px -8px rgba(255, 138, 0, 0.5);
        }

        .start-button:hover:not(.loading) {
          filter: brightness(1.04);
        }

        .start-button:active:not(.loading) {
          transform: translateY(1px);
        }

        .start-button.loading {
          background: #f0f1f3;
          border-color: #d5d9d9;
          color: #9aa0a6;
          cursor: not-allowed;
          box-shadow: none;
        }

        .button-text {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .start-button.loading .button-text::before {
          content: '';
          width: 16px;
          height: 16px;
          border: 2px solid rgba(154, 160, 166, 0.35);
          border-top-color: #767676;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .notice-section {
          background: #fff;
          padding: 15px 18px;
          border-radius: 14px;
          border: 1px solid #e7e7e7;
          border-left: 3px solid #ff8a00;
          box-shadow: 0 2px 8px rgba(15, 17, 17, 0.05);
        }
        .notice-header {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #d1650a;
          margin-bottom: 8px;
          font-size: 13px;
        }
        .notice-list {
          color: #767676;
          font-size: 12px;
          line-height: 1.7;
          margin: 0;
          padding-left: 18px;
        }

        /* Responsive */
        @media (max-width: 480px) {
          .grappage-container { padding: 14px 12px 100px; }
          .slider-wrapper { height: 190px; }
          .image-container { max-width: 165px; height: 165px; }
          .amount-value { font-size: 17px; }
          .vip-badge { padding: 6px 12px; font-size: 11.5px; }
        }
      `}</style>
    </div>
  );
};

export default Grappage;
