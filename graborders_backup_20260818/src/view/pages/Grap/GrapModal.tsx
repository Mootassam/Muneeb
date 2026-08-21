import React from 'react';
import Dates from 'src/view/shared/utils/Dates';
import { i18n } from '../../../i18n';

function GrapModal(props) {
  const { items, number, hideModal, submit } = props;

  const calculateProfit = (price, commission) => {
    const p = parseFloat(price) || 0;
    const c = parseFloat(commission) || 0;
    return ((p * c) / 100).toFixed(3);
  };

  return (
    <div className="modal-overlay" onClick={hideModal}>
      <div
        className="product-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-contents">
        

          {/* PRODUCT */}
          <div className="product-display">
            <div className="product-image-container">
              <img
                src={
                  items?.image ||
                  items?.photo?.[0]?.downloadUrl ||
                  'https://via.placeholder.com/150'
                }
                alt={items?.title}
                loading="lazy"
                className="product-image"
              />
            </div>

            <div className="product-details">
              <div className="product-name">{items?.title}</div>
            </div>
          </div>

          {/* SUMMARY */}
          <div className="order-summary">
            <div className="summary-row">
              <span className="summary-label">
                {i18n('pages.grapModal.totalOrderAmount')}
              </span>
              <span className="summary-value">
                {items?.amount} {i18n('pages.grapModal.currency')}
              </span>
            </div>

            <div className="summary-row">
              <span className="summary-label">
                {i18n('pages.grapModal.estimatedReturn')}
              </span>
              <span className="summary-value">
                {calculateProfit(
                  items?.price ?? items?.amount,
                  items?.commission
                )}{' '}
                {i18n('pages.grapModal.currency')}
              </span>
            </div>
          </div>

          {/* INFO */}
          <div className="order-info">
            <div className="info-row">
              <span className="info-label">
                {i18n('pages.grapModal.orderTime')}
              </span>
              <span className="info-value">{Dates.current()}</span>
            </div>

            <div className="info-row">
              <span className="info-label">
                {i18n('pages.grapModal.orderNumber')}
              </span>
              <span className="info-value">N{number}</span>
            </div>
          </div>

          {/* ACTION */}
          <div className="modal-actions">
            <button className="submit-button" onClick={submit}>
              {i18n('pages.grapModal.submit')}
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
          background: rgba(0, 0, 0, 0.7);
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
          background: #fff;
          border: 1px solid #e7e7e7;
          border-radius: 16px;
          padding: 24px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 25px 60px -15px rgba(15, 17, 17, 0.35);
        }

        /* HEADER */
        .modal-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .modal-title {
          font-size: 22px;
          font-weight: 700;
          color: #0f1111;
        }

        /* PRODUCT */
        .product-display {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          margin-bottom: 22px;
        }

        .product-image-container {
          width: 100px;
          aspect-ratio: 1 / 1;
          border-radius: 14px;
          overflow: hidden;
          border: 2px solid #ff8a00;
          background: #f7f8fa;
          flex-shrink: 0;
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .product-name {
          font-size: 17px;
          font-weight: 600;
          color: #0f1111;
          text-align: center;
        }

        /* SUMMARY */
        .order-summary {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 16px;
        }

        .summary-row {
          flex: 1;
          min-width: 140px;
          background: #fff2e5;
          border: 1px solid #ffe0b8;
          border-radius: 10px;
          padding: 14px;
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 6px;
        }

        .summary-label {
          font-size: 12.5px;
          color: #9a6a2e;
        }

        .summary-value {
          font-size: 17px;
          font-weight: 700;
          color: #d1650a;
        }

        /* INFO */
        .order-info {
          background: #f7f8fa;
          border: 1px solid #e7e7e7;
          border-radius: 10px;
          padding: 14px 16px;
          margin-bottom: 22px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
        }

        .info-label {
          color: #767676;
          font-size: 13px;
        }

        .info-value {
          font-weight: 600;
          color: #0f1111;
          font-size: 13px;
        }

        /* ACTION */
        .submit-button {
          width: 100%;
          min-height: 48px;
          border: 1px solid #d17f00;
          border-radius: 10px;
          background: linear-gradient(180deg, #ffb84d, #ff8a00);
          color: #17130d;
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
