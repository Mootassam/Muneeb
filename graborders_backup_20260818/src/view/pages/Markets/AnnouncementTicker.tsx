import React, { useEffect, useState } from "react";
import { i18n } from "../../../i18n";

interface WithdrawItem {
  id: string;
  masked: string;
  amount: string;
}

const WITHDRAW_DURATION = 4200;

function randomWithdraw(): WithdrawItem {
  const digits = Math.floor(1000 + Math.random() * 9000);
  const amount = Math.floor(500 + Math.random() * 9500);

  return {
    id: `${Date.now()}-${digits}`,
    masked: `****${digits}`,
    amount: amount.toLocaleString("en-US"),
  };
}

function AnnouncementTicker() {
  const [item, setItem] = useState<WithdrawItem>(randomWithdraw);

  useEffect(() => {
    const interval = setInterval(() => {
      setItem(randomWithdraw());
    }, WITHDRAW_DURATION);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="atk__bar">
      <span className="atk__iconWrap" key={`icon-${item.id}`}>
        <i className="fa-solid fa-gift"></i>
      </span>

      <span className="atk__textWrap">
        <span className="atk__text" key={`text-${item.id}`}>
          <span className="atk__masked">{item.masked}</span>{" "}
          {i18n("pages.home.liveToast.justWithdrew")}{" "}
          <span className="atk__amount">${item.amount}</span>
        </span>
      </span>

      <style>{`
        .atk__bar {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--bg-tint);
          border: 1px solid var(--tint-border);
          border-radius: 14px;
          padding: 11px 14px;
          margin-bottom: 16px;
        }

        .atk__iconWrap {
          flex-shrink: 0;
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: atk__pop 0.35s ease;
        }

        .atk__iconWrap i {
          color: var(--accent);
          font-size: 14px;
        }

        .atk__textWrap {
          flex: 1;
          min-width: 0;
          overflow: hidden;
        }

        .atk__text {
          display: block;
          font-size: 12px;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          animation: atk__slideIn 0.45s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .atk__masked {
          color: var(--text-primary);
          font-weight: 700;
          font-family: 'Consolas', 'Courier New', monospace;
        }

        .atk__amount {
          color: var(--success);
          font-weight: 700;
        }

        @keyframes atk__slideIn {
          from {
            opacity: 0;
            transform: translateY(65%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes atk__pop {
          from {
            opacity: 0;
            transform: scale(0.5) rotate(-10deg);
          }
          to {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }
      `}</style>
    </div>
  );
}

export default AnnouncementTicker;
