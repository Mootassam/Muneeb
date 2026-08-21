import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import QRCode from "qrcode";
import SubHeader from "src/view/shared/Header/SubHeader";
import authSelectors from "src/modules/auth/authSelectors";
import DepositService from "src/modules/deposit/depositService";
import SettingsService from "src/modules/settings/settingsService";
import Errors from "src/modules/shared/error/errors";
import Message from "src/view/shared/message";
import { i18n } from "../../../i18n";

const DEFAULT_SYMBOL = "USDT";
const PAYMENT_METHOD = "USDT";
const PROTOCOL = "TRC-20";
const CURRENCY = "ALL";
const MIN_AMOUNT = 0.1;

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
      color: { dark: "#0f1111", light: "#ffffff" },
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

    if (!amount || Number(amount) < MIN_AMOUNT || !address) {
      return;
    }

    setSubmitting(true);

    try {
      await DepositService.create({
        user: currentUser ? currentUser.id : null,
        amount,
        currency: CURRENCY,
        paymentMethod: PAYMENT_METHOD,
        protocol: PROTOCOL,
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
          <div className="dep__optionGroup">
            <div className="dep__optionLabel">{i18n("pages.deposit.paymentMethod")}</div>
            <span className="dep__chip dep__chip--active">{PAYMENT_METHOD}</span>
          </div>

          <div className="dep__optionGroup">
            <div className="dep__optionLabel">{i18n("pages.deposit.selectProtocol")}</div>
            <span className="dep__chip dep__chip--active">{PROTOCOL}</span>
          </div>

          <div className="dep__optionGroup">
            <div className="dep__optionLabel">{i18n("pages.deposit.currencySelection")}</div>
            <span className="dep__chip dep__chip--active">{CURRENCY}</span>
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
              <div className="dep__amountHints">
                <div className="dep__amountHint">
                  {i18n("pages.deposit.minAmountHint", MIN_AMOUNT, PAYMENT_METHOD)}
                </div>
                <div className="dep__amountHint">
                  {i18n("pages.deposit.estimatedPayment", amount || 0, PAYMENT_METHOD)}
                </div>
                <div className="dep__amountHint">
                  {i18n("pages.deposit.referenceRate", PAYMENT_METHOD)}
                </div>
                <div className="dep__amountHint dep__amountHint--muted">
                  {i18n("pages.deposit.disclaimer")}
                </div>
              </div>
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
          background: var(--bg-page);
          display: flex;
          justify-content: center;
          padding: 20px 14px 100px;
          font-family: "Poppins", -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .dep__card {
          max-width: 400px;
          width: 100%;
          background: var(--bg-card);
          padding: 22px 18px 26px;
          border-radius: 22px;
          border: 1px solid var(--border);
          color: var(--text-primary);
        }

        .dep__optionGroup {
          margin-bottom: 16px;
        }

        .dep__optionLabel {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-muted);
          margin-bottom: 8px;
        }

        .dep__chip {
          display: inline-flex;
          align-items: center;
          padding: 7px 16px;
          border-radius: 999px;
          font-size: 12.5px;
          font-weight: 700;
          background: var(--bg-card-alt);
          border: 1px solid var(--border);
          color: var(--text-secondary);
        }

        .dep__chip--active {
          background: linear-gradient(180deg, var(--accent-grad-start), var(--accent-grad-end));
          border-color: transparent;
          color: var(--accent-text-on);
        }

        .dep__qrWrap {
          width: 176px;
          height: 176px;
          margin: 4px auto 14px;
          background: var(--bg-card-alt);
          border: 1px solid var(--border);
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
          color: var(--text-faint);
          font-size: 32px;
        }

        .dep__hint {
          text-align: center;
          font-size: 12px;
          color: var(--text-muted);
          margin-bottom: 18px;
        }

        .dep__addressBlock {
          background: var(--bg-card-alt);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 14px 16px;
          margin-bottom: 14px;
        }

        .dep__addressLabel {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--text-muted);
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
          color: var(--text-primary);
          word-break: break-all;
          line-height: 1.5;
        }

        .dep__copyBtn {
          flex-shrink: 0;
          margin: 0;
          background: linear-gradient(180deg, var(--accent-grad-start), var(--accent-grad-end));
          border: none;
          border-radius: 10px;
          color: var(--accent-text-on);
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
          background: var(--bg-tint);
          border: 1px solid var(--tint-border);
          border-radius: 12px;
          padding: 10px 12px;
          font-size: 12px;
          color: var(--tint-text);
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
          color: var(--text-muted);
          margin-bottom: 8px;
        }

        .dep__input {
          width: 100%;
          background: var(--bg-card-alt);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 12px 14px;
          font-size: 14px;
          color: var(--text-primary);
          outline: none;
        }

        .dep__input:focus {
          border-color: var(--accent);
        }

        .dep__input::placeholder {
          color: var(--placeholder);
        }

        .dep__amountHints {
          margin-top: 8px;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .dep__amountHint {
          font-size: 11px;
          color: var(--text-muted);
          line-height: 1.5;
        }

        .dep__amountHint--muted {
          color: var(--text-faint);
        }

        .dep__submitBtn {
          width: 100%;
          margin: 0;
          background: linear-gradient(180deg, var(--accent-grad-start), var(--accent-grad-end));
          border: none;
          border-radius: 14px;
          color: var(--accent-text-on);
          font-size: 15px;
          font-weight: 700;
          padding: 13px 0;
          cursor: pointer;
        }

        .dep__submitBtn:disabled {
          background: var(--bg-surface-2);
          color: var(--text-faint);
          cursor: not-allowed;
        }

        .dep__note {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin-top: 16px;
          font-size: 11px;
          color: var(--text-faint);
          line-height: 1.6;
        }

        .dep__note i {
          color: var(--text-muted);
          margin-top: 1px;
        }

        .dep__modalOverlay {
          position: fixed;
          inset: 0;
          background: var(--overlay);
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
          background: var(--bg-card);
          border: 1px solid var(--border);
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
          background: var(--bg-tint);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dep__modalIcon i {
          color: var(--accent);
          font-size: 22px;
        }

        .dep__modalTitle {
          font-size: 17px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 10px;
        }

        .dep__modalText {
          font-size: 13.5px;
          color: var(--text-muted);
          line-height: 1.6;
          margin: 0 0 22px;
        }

        .dep__modalConfirm {
          width: 100%;
          margin: 0;
          background: linear-gradient(180deg, var(--accent-grad-start), var(--accent-grad-end));
          border: none;
          border-radius: 12px;
          color: var(--accent-text-on);
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
