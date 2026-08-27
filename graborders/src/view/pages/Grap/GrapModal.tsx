import React from 'react';
import Dates from 'src/view/shared/utils/Dates';
import { getHistory } from 'src/modules/store';
import Message from 'src/view/shared/message';
import { i18n } from '../../../i18n';
import GrapProductList from './GrapProductList';

function GrapModal(props) {
  const { items, number, hideModal, submit, currentUser } = props;

  const productList =
    items?.type === 'combo'
      ? (items.products || []).map((p) => p.product).filter(Boolean)
      : [items];

  const orderAmount = parseFloat(items?.amount) || 0;
  const commissionRate = parseFloat(items?.commission) || 0;
  const commissionAmount = (orderAmount * commissionRate) / 100;
  const expectedIncome = orderAmount + commissionAmount;

  // A combo can only be submitted once the customer's balance already
  // covers its price — submitting never deducts anything, this is just a
  // qualifying-balance requirement to unlock the commission.
  const balance = parseFloat(currentUser?.balance) || 0;
  const isCombo = items?.type === 'combo';
  const insufficient = isCombo && orderAmount > balance;
  const deficit = (orderAmount - balance).toFixed(4);

  const doRedirectToDeposit = () => {
    hideModal();
    Message.success(i18n('pages.grapModal.redirectToDepositMessage'));
    getHistory().push('/deposit');
  };

  return (
    <div className="modal-overlay" onClick={hideModal}>
      <div
        className="product-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-contents">

          {/* INFO */}
          <div className="order-info order-info-top">
            <div className="info-row">
              <span className="info-label">
                {i18n('pages.grapModal.orderNumber')}
              </span>
              <span className="info-value">N{number}</span>
            </div>
          </div>

          {/* PRODUCTS */}
          <GrapProductList products={productList} />

          {/* SUMMARY */}
          <div className="order-details">
            <div className="detail-row">
              <span className="detail-label">
                {i18n('pages.grapModal.orderTime')}
              </span>
              <span className="detail-value">{Dates.current()}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">
                {i18n('pages.grapModal.totalOrderAmount')}
              </span>
              <span className="detail-value">
                {orderAmount.toFixed(2)}{i18n('pages.grapModal.currency')}
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">
                {i18n('pages.grapModal.commission')}
              </span>
              <span className="detail-value">
                {commissionAmount.toFixed(3)}{i18n('pages.grapModal.currency')}
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">
                {i18n('pages.grapModal.estimatedReturn')}
              </span>
              <span className="detail-value detail-value-highlight">
                {expectedIncome.toFixed(3)}{i18n('pages.grapModal.currency')}
              </span>
            </div>
          </div>

          {/* INSUFFICIENT BALANCE */}
          {insufficient && (
            <div className="insufficient-banner">
              {i18n('pages.grapModal.insufficientBalanceMessage', deficit)}
            </div>
          )}

          {/* ACTION */}
          <div className="modal-actions">
            <button
              className="submit-button"
              onClick={insufficient ? doRedirectToDeposit : submit}
            >
              {insufficient
                ? i18n('pages.grapModal.goToDeposit')
                : i18n('pages.grapModal.submit')}
            </button>
          </div>
        </div>
      </div>

      {/* STYLES */}
      <style>{`
        /* OVERLAY */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: var(--overlay);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          z-index: 1000;
          font-family: "Poppins", sans-serif;
        }

        /* MODAL */
        .product-modal {
          width: 100%;
          max-width: 420px;
        }

        .modal-contents {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 24px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 25px 60px -15px rgba(15, 17, 17, 0.35);
        }

        /* SUMMARY */
        .order-details {
          margin-bottom: 16px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding: 9px 0;
          border-bottom: 1px solid var(--border-soft);
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .detail-label {
          font-size: 13.5px;
          color: var(--text-tertiary);
        }

        .detail-value {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .detail-value-highlight {
          font-size: 20px;
          font-weight: 800;
          color: var(--accent);
        }

        /* INFO */
        .order-info {
          background: var(--bg-card-alt);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 10px 16px;
          margin-bottom: 16px;
        }

        .order-info-top {
          margin-bottom: 14px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 4px 0;
        }

        .info-label {
          color: var(--text-tertiary);
          font-size: 13px;
        }

        .info-value {
          font-weight: 600;
          color: var(--text-primary);
          font-size: 13px;
        }

        /* INSUFFICIENT BALANCE */
        .insufficient-banner {
          background: var(--danger-bg);
          border: 1px solid var(--danger);
          color: var(--danger);
          font-size: 13px;
          font-weight: 600;
          line-height: 1.5;
          text-align: center;
          border-radius: 10px;
          padding: 12px 14px;
          margin-bottom: 16px;
        }

        /* ACTION */
        .submit-button {
          width: 100%;
          min-height: 48px;
          border: 1px solid var(--accent-border);
          border-radius: 10px;
          background: linear-gradient(180deg, var(--accent-grad-start), var(--accent-grad-end));
          color: var(--accent-text-on);
          font-size: 15.5px;
          font-weight: 700;
          cursor: pointer;
          transition: filter 0.15s ease, transform 0.1s ease;
        }

        .submit-button:hover {
          filter: brightness(1.04);
        }

        .submit-button:active {
          transform: translateY(1px);
        }
      `}</style>
    </div>
  );
}

export default GrapModal;
