import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import QRCode from "qrcode";
import SubHeader from "src/view/shared/Header/SubHeader";
import authSelectors from "src/modules/auth/authSelectors";
import TransactionService from "src/modules/transaction/transactionService";
import SettingsService from "src/modules/settings/settingsService";
import Errors from "src/modules/shared/error/errors";
import Message from "src/view/shared/message";
import { i18n } from "../../../i18n";

const SYMBOLS = ["USDT", "ETH", "BTC"];
const DEFAULT_SYMBOL = "USDT";

function Deposit() {
  const currentUser = useSelector(authSelectors.selectCurrentUser);

  const [symbol, setSymbol] = useState(DEFAULT_SYMBOL);
  const [addresses, setAddresses] = useState({ USDT: "", ETH: "", BTC: "" });
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await SettingsService.find();
        setAddresses({
          USDT: settings?.usdtWalletAddress || "",
          ETH: settings?.ethWalletAddress || "",
          BTC: settings?.btcWalletAddress || "",
        });
      } catch (error) {
        console.error(error);
      }
    };

    loadSettings();
  }, []);

  const address = addresses[symbol];

  useEffect(() => {
    if (!address) {
      setQrDataUrl("");
      return;
    }

    QRCode.toDataURL(address, {
      width: 168,
      margin: 1,
      color: { dark: "#f0b90b", light: "#1a1c26" },
    })
      .then(setQrDataUrl)
      .catch((error) => console.error(error));
  }, [address]);

  const copyAddress = () => {
    if (!address) {
      return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(address)
        .then(() => Message.success(i18n("pages.deposit.copied")))
        .catch((error) => console.error("Error copying to clipboard:", error));
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = address;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      Message.success(i18n("pages.deposit.copied"));
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!amount || Number(amount) <= 0 || !address) {
      return;
    }

    setSubmitting(true);

    try {
      await TransactionService.create({
        status: "pending",
        datetransaction: new Date(),
        user: currentUser ? currentUser.id : null,
        type: "deposit",
        amount,
        currency: symbol,
      });

      setShowReviewModal(true);
    } catch (error) {
      Errors.handle(error);
    } finally {
      setSubmitting(false);
    }
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setAmount("");
    setSymbol(DEFAULT_SYMBOL);
  };

  return (
    <div>
      <SubHeader title={i18n("pages.deposit.title")} path="/profile" />

      <div className="dep__page">
        <div className="dep__card">
          <div className="dep__tabs">
            {SYMBOLS.map((item) => (
              <button
                key={item}
                type="button"
                className={`dep__tab ${symbol === item ? "dep__tab--active" : ""}`}
                onClick={() => setSymbol(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="dep__qrWrap">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt={`${symbol} deposit address QR code`} className="dep__qr" />
            ) : (
              <div className="dep__qrPlaceholder">
                <i className="fa-solid fa-qrcode"></i>
              </div>
            )}
          </div>

          <div className="dep__hint">{i18n("pages.deposit.scanQr")}</div>

          <div className="dep__addressBlock">
            <div className="dep__addressLabel">
              {i18n("pages.deposit.depositAddress")} ({symbol})
            </div>
            <div className="dep__addressRow">
              <span className="dep__addressText">
                {address || i18n("pages.deposit.addressUnavailable")}
              </span>
              {address && (
                <button type="button" className="dep__copyBtn" onClick={copyAddress}>
                  <i className="fa-regular fa-copy"></i>
                  {i18n("pages.deposit.copy")}
                </button>
              )}
            </div>
          </div>

          <div className="dep__warning">
            <i className="fa-solid fa-triangle-exclamation"></i>
            {i18n("pages.deposit.warning", symbol)}
          </div>

          <form onSubmit={onSubmit}>
            <div className="dep__formGroup">
              <label className="dep__label" htmlFor="dep-amount">
                {i18n("pages.deposit.amount")}
              </label>
              <input
                id="dep-amount"
                type="number"
                min="0"
                step="any"
                inputMode="decimal"
                className="dep__input"
                placeholder={i18n("pages.deposit.amountPlaceholder")}
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="dep__submitBtn"
              disabled={submitting || !address}
            >
              {i18n("pages.deposit.submit")}
            </button>
          </form>

          <div className="dep__note">
            <i className="fa-solid fa-circle-info"></i>
            {i18n("pages.deposit.note")}
          </div>
        </div>
      </div>

      {showReviewModal && (
        <div className="dep__modalOverlay">
          <div className="dep__modalCard">
            <div className="dep__modalIcon">
              <i className="fa-solid fa-clock-rotate-left"></i>
            </div>
            <div className="dep__modalTitle">
              {i18n("pages.deposit.reviewModal.title")}
            </div>
            <p className="dep__modalText">
              {i18n("pages.deposit.reviewModal.message")}
            </p>
            <button
              type="button"
              className="dep__modalConfirm"
              onClick={closeReviewModal}
            >
              {i18n("pages.deposit.reviewModal.confirm")}
            </button>
          </div>
        </div>
      )}

      <style>{`
        .dep__page {
          min-height: 100vh;
          background: #06070b;
          display: flex;
          justify-content: center;
          padding: 20px 14px 100px;
          font-family: "Poppins", -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .dep__card {
          max-width: 400px;
          width: 100%;
          background: #14151d;
          padding: 22px 18px 26px;
          border-radius: 22px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          color: #eaecef;
        }

        .dep__tabs {
          display: flex;
          gap: 8px;
          background: #1a1c26;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 14px;
          padding: 4px;
          margin-bottom: 20px;
        }

        .dep__tab {
          flex: 1;
          margin: 0;
          background: transparent;
          border: none;
          border-radius: 10px;
          padding: 10px 0;
          font-size: 13.5px;
          font-weight: 700;
          color: #848e9c;
          cursor: pointer;
        }

        .dep__tab--active {
          background: #f0b90b;
          color: #0b0e11;
        }

        .dep__qrWrap {
          width: 176px;
          height: 176px;
          margin: 0 auto 14px;
          background: #1a1c26;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
        }

        .dep__qr {
          width: 100%;
          height: 100%;
          border-radius: 10px;
        }

        .dep__qrPlaceholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #5e6673;
          font-size: 32px;
        }

        .dep__hint {
          text-align: center;
          font-size: 12px;
          color: #848e9c;
          margin-bottom: 18px;
        }

        .dep__addressBlock {
          background: #1a1c26;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          padding: 14px 16px;
          margin-bottom: 14px;
        }

        .dep__addressLabel {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #848e9c;
          margin-bottom: 8px;
        }

        .dep__addressRow {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .dep__addressText {
          flex: 1;
          font-size: 13px;
          color: #f5f6f8;
          word-break: break-all;
          line-height: 1.5;
        }

        .dep__copyBtn {
          flex-shrink: 0;
          margin: 0;
          background: #f0b90b;
          border: none;
          border-radius: 10px;
          color: #0b0e11;
          font-size: 12px;
          font-weight: 700;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
        }

        .dep__warning {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          background: #241c0e;
          border: 1px solid rgba(240, 185, 11, 0.25);
          border-radius: 12px;
          padding: 10px 12px;
          font-size: 12px;
          color: #f0b90b;
          line-height: 1.5;
          margin-bottom: 20px;
        }

        .dep__warning i {
          margin-top: 1px;
        }

        .dep__formGroup {
          margin-bottom: 16px;
        }

        .dep__label {
          display: block;
          font-size: 12px;
          color: #848e9c;
          margin-bottom: 8px;
        }

        .dep__input {
          width: 100%;
          background: #1a1c26;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 12px 14px;
          font-size: 14px;
          color: #eaecef;
          outline: none;
        }

        .dep__input:focus {
          border-color: #f0b90b;
        }

        .dep__input::placeholder {
          color: #5e6673;
        }

        .dep__submitBtn {
          width: 100%;
          margin: 0;
          background: #f0b90b;
          border: none;
          border-radius: 14px;
          color: #0b0e11;
          font-size: 15px;
          font-weight: 700;
          padding: 13px 0;
          cursor: pointer;
        }

        .dep__submitBtn:disabled {
          background: #3a3d26;
          color: #6b6f5a;
          cursor: not-allowed;
        }

        .dep__note {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin-top: 16px;
          font-size: 11px;
          color: #5e6673;
          line-height: 1.6;
        }

        .dep__note i {
          color: #848e9c;
          margin-top: 1px;
        }

        .dep__modalOverlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 1000;
          animation: depFadeIn 0.15s ease-out;
        }

        .dep__modalCard {
          width: 100%;
          max-width: 320px;
          background: #14151d;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 20px;
          padding: 28px 24px 24px;
          text-align: center;
          animation: depModalIn 0.18s ease-out;
        }

        .dep__modalIcon {
          width: 56px;
          height: 56px;
          margin: 0 auto 16px;
          border-radius: 50%;
          background: rgba(240, 185, 11, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dep__modalIcon i {
          color: #f0b90b;
          font-size: 22px;
        }

        .dep__modalTitle {
          font-size: 17px;
          font-weight: 700;
          color: #f5f6f8;
          margin-bottom: 10px;
        }

        .dep__modalText {
          font-size: 13.5px;
          color: #848e9c;
          line-height: 1.6;
          margin: 0 0 22px;
        }

        .dep__modalConfirm {
          width: 100%;
          margin: 0;
          background: #f0b90b;
          border: none;
          border-radius: 12px;
          color: #0b0e11;
          font-size: 14px;
          font-weight: 700;
          padding: 12px 0;
          cursor: pointer;
        }

        @keyframes depFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes depModalIn {
          from {
            opacity: 0;
            transform: scale(0.94) translateY(6px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default Deposit;
