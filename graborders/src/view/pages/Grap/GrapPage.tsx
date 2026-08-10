import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

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
    if (currentUser?.balance <= 0) {
      Message.error("Insufficient balance. Please top up your account to continue.");
    }
    if (currentUser?.tasksDone >= currentUser?.vip?.dailyorder) {
      Message.success("You have completed all available tasks. Please contact support to reset your account.");
    }
  }, [currentUser]);

   const rollAll = async () => {
     if (currentUser?.balance <= 0) {
       Message.error("Insufficient balance. Please top up your account to continue.");
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

      {/* Theme */}
      <style>{`
        .grappage-container {
          position: relative;
          margin: 0 auto;
          padding: 20px;
          background: #0b0e11;
          min-height: 100vh;
          overflow: hidden;
          font-family: "Poppins", -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .grappage-glow {
          position: absolute;
          top: -140px;
          left: 50%;
          transform: translateX(-50%);
          width: 680px;
          height: 320px;
          background: radial-gradient(ellipse at center, rgba(240, 185, 11, 0.10), transparent 70%);
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

        .grappage-header { margin-bottom: 16px; }
        .user-greeting {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #181a20;
          padding: 16px 20px;
          border-radius: 14px;
          border: 1px solid #23262c;
        }
        .greeting-content {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 0;
        }
        .user-avatar {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          border: 2px solid #f0b90b;
          flex-shrink: 0;
        }
        .greeting-text-wrap {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }
        .greeting-text {
          font-size: 15.5px;
          font-weight: 600;
          color: #eaecef;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .greeting-sub {
          font-size: 12px;
          color: #5e6673;
        }
        .vip-badge {
          background: #f0b90b;
          color: #181a20;
          padding: 7px 16px;
          border-radius: 20px;
          font-weight: 700;
          font-size: 13px;
          flex-shrink: 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 16px;
        }
        .stat-card {
          background: #181a20;
          padding: 16px;
          border-radius: 14px;
          border: 1px solid #23262c;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .stat-content { display: flex; align-items: center; gap: 12px; }
        .stat-icon {
          width: 42px;
          height: 42px;
          background: rgba(240, 185, 11, 0.12);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .stat-icon img { width: 22px; height: 22px; }
        .stat-title { font-weight: 600; color: #eaecef; font-size: 13.5px; }
        .stat-subtitle { font-size: 11.5px; color: #5e6673; }
        .amount-value {
          font-size: 20px;
          font-weight: 700;
          color: #f0b90b;
          font-variant-numeric: tabular-nums;
        }
        .amount-currency { font-size: 11.5px; color: #5e6673; font-weight: 500; }

        .game-grid-section {
          background: #181a20;
          padding: 22px 20px;
          border-radius: 16px;
          border: 1px solid #23262c;
          margin-bottom: 16px;
        }

        .game-header {
          margin-bottom: 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }
        .vip-title { font-size: 17px; font-weight: 700; color: #eaecef; }
        .commission-rate { font-size: 12.5px; color: #848e9c; }
        .rate-value { color: #f0b90b; font-weight: 700; }

        .progress-pill {
          background: rgba(240, 185, 11, 0.12);
          color: #f0b90b;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12.5px;
          font-weight: 700;
        }

        .progress-track {
          height: 6px;
          background: #23262c;
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: 22px;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #f0b90b, #f8d12f);
          border-radius: 6px;
          transition: width 0.4s ease;
        }

        /* =============== SLIDER =============== */
        .slider-container {
          margin: 0 0 6px;
        }
        .slider-wrapper {
          position: relative;
          height: 240px;
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
          opacity: 0.55;
          filter: brightness(0.8);
        }

        .slider-item[data-position="1"] {
          transform: scale(1.02);
          opacity: 1;
          z-index: 10;
        }

        .slider-item.active .image-container {
          border: 3px solid #f0b90b;
          box-shadow: 0 16px 40px rgba(240, 185, 11, 0.25);
        }

        .image-container {
          width: 100%;
          max-width: 230px;
          height: 220px;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #23262c;
          background: #101317;
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
          margin-top: 22px;
        }

        .start-button {
          width: 100%;
          max-width: 320px;
          height: 54px;
          background: #f0b90b;
          border: none;
          border-radius: 12px;
          color: #181a20;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: background-color 0.15s ease, transform 0.1s ease;
          position: relative;
          overflow: hidden;
        }

        .start-button:hover:not(.loading) {
          background: #f8d12f;
        }

        .start-button:active:not(.loading) {
          transform: translateY(1px);
        }

        .start-button.loading {
          background: #2b3139;
          color: #5e6673;
          cursor: not-allowed;
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
          border: 2px solid rgba(94, 102, 115, 0.4);
          border-top-color: #848e9c;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .notice-section {
          background: #181a20;
          padding: 16px 20px;
          border-radius: 14px;
          border: 1px solid #23262c;
          border-left: 3px solid #f0b90b;
        }
        .notice-header {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #f0b90b;
          margin-bottom: 8px;
          font-size: 13.5px;
        }
        .notice-list {
          color: #848e9c;
          font-size: 12.5px;
          line-height: 1.7;
          margin: 0;
          padding-left: 18px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
          .slider-wrapper { height: 220px; }
          .image-container { max-width: 200px; height: 200px; }
        }

        @media (max-width: 480px) {
          .grappage-container { padding: 14px; }
          .slider-wrapper { height: 190px; }
          .image-container { max-width: 165px; height: 165px; }
          .amount-value { font-size: 17px; }
          .vip-badge { padding: 6px 12px; font-size: 12px; }
        }
      `}</style>
    </div>
  );
};

export default Grappage;
