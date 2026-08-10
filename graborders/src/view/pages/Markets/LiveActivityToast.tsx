import React, { useEffect, useState } from "react";
import { i18n } from "../../../i18n";

const AVATAR_TONES = [
  { bg: "rgba(240, 185, 11, 0.16)", color: "#f0b90b" },
  { bg: "rgba(56, 189, 248, 0.16)", color: "#38bdf8" },
  { bg: "rgba(14, 203, 129, 0.16)", color: "#0ecb81" },
  { bg: "rgba(168, 85, 247, 0.16)", color: "#a855f7" },
];

const SHOW_DURATION = 4500;
const GAP_DURATION = 3000;
const INITIAL_DELAY = 1500;

function randomToast() {
  const digits = Math.floor(1000 + Math.random() * 9000);
  const amount = Math.floor(500 + Math.random() * 9500);
  const tone = AVATAR_TONES[Math.floor(Math.random() * AVATAR_TONES.length)];

  return {
    id: `${Date.now()}-${digits}`,
    masked: `****${digits}`,
    amount: amount.toLocaleString("en-US"),
    tone,
  };
}

function LiveActivityToast() {
  const [toast, setToast] = useState(randomToast);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let showTimer: ReturnType<typeof setTimeout>;
    let hideTimer: ReturnType<typeof setTimeout>;

    const cycle = (delay: number) => {
      showTimer = setTimeout(() => {
        if (cancelled) {
          return;
        }
        setToast(randomToast());
        setVisible(true);

        hideTimer = setTimeout(() => {
          if (cancelled) {
            return;
          }
          setVisible(false);
          cycle(GAP_DURATION);
        }, SHOW_DURATION);
      }, delay);
    };

    cycle(INITIAL_DELAY);

    return () => {
      cancelled = true;
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div className="lat__wrap">
      <div className={`lat__toast ${visible ? "lat__toast--visible" : ""}`}>
        <span
          className="lat__avatar"
          style={{ background: toast.tone.bg, color: toast.tone.color }}
        >
          <i className="fa-solid fa-user"></i>
        </span>

        <div className="lat__body">
          <div className="lat__line">
            {i18n("pages.home.liveToast.congrats")}
            <span className="lat__masked">{toast.masked}</span>
          </div>
          <div className="lat__line">
            {i18n("pages.home.liveToast.withdraw")}
            <span className="lat__amount">${toast.amount}</span>
          </div>
        </div>

        <button
          type="button"
          className="lat__close"
          onClick={() => setVisible(false)}
          aria-label="Dismiss notification"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>

      <style>{`
        .lat__wrap {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 74px;
          max-width: 400px;
          margin: 0 auto;
          padding: 0 14px;
          z-index: 90;
          pointer-events: none;
        }

        .lat__toast {
          pointer-events: none;
          display: flex;
          align-items: center;
          gap: 10px;
          background: #14151d;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          padding: 10px 12px;
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.45);
          opacity: 0;
          transform: translateY(14px) scale(0.97);
          transition: opacity 0.35s ease, transform 0.35s ease;
        }

        .lat__toast--visible {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: auto;
        }

        .lat__avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          flex-shrink: 0;
        }

        .lat__body {
          flex: 1;
          min-width: 0;
        }

        .lat__line {
          font-size: 12px;
          color: #848e9c;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .lat__masked {
          color: #eaecef;
          font-weight: 700;
          margin-left: 5px;
          font-family: 'Consolas', 'Courier New', monospace;
        }

        .lat__amount {
          color: #0ecb81;
          font-weight: 700;
          margin-left: 5px;
        }

        .lat__close {
          flex-shrink: 0;
          width: 22px;
          height: 22px;
          margin: 0;
          background: transparent;
          border: none;
          color: #5e6673;
          font-size: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .lat__close:hover {
          color: #848e9c;
        }
      `}</style>
    </div>
  );
}

export default LiveActivityToast;
