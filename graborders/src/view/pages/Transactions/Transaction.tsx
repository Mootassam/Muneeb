import React, { useEffect, useState } from "react";
import SubHeader from "src/view/shared/Header/SubHeader";
import action from 'src/modules/transaction/list/transactionListActions'
import selector from 'src/modules/transaction/list/transactionListSelectors'
import { useDispatch, useSelector } from 'react-redux';
import Dates from "src/view/shared/utils/Dates";
import LoadingModal from "src/shared/LoadingModal";
import Nodata from "src/view/shared/Nodata";
import { i18n } from "../../../i18n";

const FILTERS = [
  { key: "", icon: "fa-solid fa-list", label: "pages.transaction.filters.all" },
  { key: "withdraw", icon: "fa-solid fa-arrow-up", label: "pages.transaction.filters.withdraw" },
  { key: "deposit", icon: "fa-solid fa-arrow-down", label: "pages.transaction.filters.deposit" },
];

function Transaction() {
  const [active, setActive] = useState("withdraw");
  const dispatch = useDispatch();
  const loading = useSelector(selector.selectLoading);
  const selectHasRows = useSelector(selector.selectHasRows);
  const record = useSelector(selector.selectRows);

  useEffect(() => {
    const values = { type: active };
    dispatch(action.doFetchByUser(values, values));
  }, [dispatch, active]);

  const getTransactionIcon = (type) => {
    return type === "deposit" ? "fa-solid fa-arrow-down" : "fa-solid fa-arrow-up";
  };

  const getStatusMeta = (status) => {
    const config = {
      success: { className: "tx__status--success", text: i18n("pages.transaction.status.completed") },
      pending: { className: "tx__status--pending", text: i18n("pages.transaction.status.processing") },
      canceled: { className: "tx__status--canceled", text: i18n("pages.transaction.status.canceled") },
    };

    return config[status] || config.pending;
  };

  const getAmountText = (item) => {
    if (item.status === "canceled") {
      return i18n("pages.transaction.amount.canceled", item?.amount);
    }

    return item.type === "deposit"
      ? i18n("pages.transaction.amount.deposit", item?.amount)
      : i18n("pages.transaction.amount.withdraw", item?.amount);
  };

  const getAmountClassName = (item) => {
    if (item.status === "canceled") {
      return "tx__amount--canceled";
    }
    if (item.status === "pending") {
      return "tx__amount--pending";
    }
    return item.type === "deposit" ? "tx__amount--deposit" : "tx__amount--withdraw";
  };

  const getTransactionTypeText = (type) => {
    return type === "deposit"
      ? i18n("pages.transaction.types.deposit")
      : i18n("pages.transaction.types.withdrawal");
  };

  const onSelectFilter = (key) => {
    setActive(key);
  };

  return (
    <div>
      <SubHeader title={i18n("pages.transaction.title")} path="/profile" />

      <div className="tx__page">
        <div className="tx__card">
          <div className="tx__tabs">
            {FILTERS.map((filter) => (
              <button
                key={filter.key || "all"}
                type="button"
                className={`tx__tab ${active === filter.key ? "tx__tab--active" : ""}`}
                onClick={() => onSelectFilter(filter.key)}
              >
                <i className={filter.icon}></i>
                {i18n(filter.label)}
              </button>
            ))}
          </div>

          {!loading && record && record.length > 0 && (
            <div className="tx__listHeader">
              <span className="tx__listTitle">
                {i18n("pages.transaction.recentTransactions")}
              </span>
              <span className="tx__listCount">
                {i18n("pages.transaction.transactionCount", record.length)}
              </span>
            </div>
          )}

          <div className="tx__list">
            {loading && (
              <div className="tx__loading">
                <LoadingModal />
              </div>
            )}

            {!loading &&
              record &&
              record.map((item, index) => {
                const status = getStatusMeta(item.status);

                return (
                  <div className="tx__row" key={item.id || index}>
                    <span className={`tx__rowIcon tx__rowIcon--${item.status}`}>
                      <i className={getTransactionIcon(item.type)}></i>
                    </span>

                    <div className="tx__rowMain">
                      <div className="tx__rowType">
                        {getTransactionTypeText(item.type)}
                        {item.currency && (
                          <span className="tx__rowCurrency">{item.currency}</span>
                        )}
                      </div>
                      <div className="tx__rowDate">
                        <i className="fa-regular fa-clock"></i>
                        {Dates.Date(item?.createdAt)}
                      </div>
                    </div>

                    <div className="tx__rowRight">
                      <div className={`tx__amount ${getAmountClassName(item)}`}>
                        {getAmountText(item)}
                      </div>
                      <div className={`tx__status ${status.className}`}>
                        {status.text}
                      </div>
                    </div>
                  </div>
                );
              })}

            {!loading && !selectHasRows && (
              <div className="tx__empty">
                <Nodata />
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .tx__page {
          min-height: 100vh;
          background: #06070b;
          display: flex;
          justify-content: center;
          padding: 20px 14px 100px;
          font-family: "Poppins", -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .tx__card {
          max-width: 400px;
          width: 100%;
          background: #14151d;
          padding: 22px 18px 26px;
          border-radius: 22px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          color: #eaecef;
        }

        .tx__tabs {
          display: flex;
          gap: 6px;
          background: #1a1c26;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 14px;
          padding: 4px;
          margin-bottom: 18px;
        }

        .tx__tab {
          flex: 1;
          margin: 0;
          background: transparent;
          border: none;
          border-radius: 10px;
          padding: 10px 4px;
          font-size: 12.5px;
          font-weight: 700;
          color: #848e9c;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .tx__tab i {
          font-size: 11px;
        }

        .tx__tab--active {
          background: #f0b90b;
          color: #0b0e11;
        }

        .tx__listHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
          padding: 0 2px;
        }

        .tx__listTitle {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #5e6673;
        }

        .tx__listCount {
          font-size: 11px;
          font-weight: 600;
          color: #848e9c;
          background: #1a1c26;
          border: 1px solid rgba(255, 255, 255, 0.06);
          padding: 3px 9px;
          border-radius: 20px;
        }

        .tx__list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .tx__row {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #1a1c26;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 14px;
          padding: 12px 14px;
        }

        .tx__rowIcon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 14px;
        }

        .tx__rowIcon--success {
          background: rgba(14, 203, 129, 0.12);
          color: #0ecb81;
        }

        .tx__rowIcon--pending {
          background: rgba(240, 185, 11, 0.12);
          color: #f0b90b;
        }

        .tx__rowIcon--canceled {
          background: rgba(246, 70, 93, 0.12);
          color: #f6465d;
        }

        .tx__rowMain {
          flex: 1;
          min-width: 0;
        }

        .tx__rowType {
          font-size: 14px;
          font-weight: 700;
          color: #f5f6f8;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .tx__rowCurrency {
          font-size: 10.5px;
          font-weight: 700;
          color: #848e9c;
          background: rgba(255, 255, 255, 0.06);
          padding: 1px 6px;
          border-radius: 20px;
        }

        .tx__rowDate {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11.5px;
          color: #848e9c;
          margin-top: 3px;
        }

        .tx__rowRight {
          text-align: right;
          flex-shrink: 0;
        }

        .tx__amount {
          font-size: 14.5px;
          font-weight: 700;
          font-variant-numeric: tabular-nums;
        }

        .tx__amount--deposit {
          color: #0ecb81;
        }

        .tx__amount--withdraw {
          color: #eaecef;
        }

        .tx__amount--pending {
          color: #f0b90b;
        }

        .tx__amount--canceled {
          color: #5e6673;
          text-decoration: line-through;
        }

        .tx__status {
          display: inline-block;
          margin-top: 5px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          padding: 3px 8px;
          border-radius: 20px;
        }

        .tx__status--success {
          background: rgba(14, 203, 129, 0.12);
          color: #0ecb81;
        }

        .tx__status--pending {
          background: rgba(240, 185, 11, 0.12);
          color: #f0b90b;
        }

        .tx__status--canceled {
          background: rgba(246, 70, 93, 0.12);
          color: #f6465d;
        }

        .tx__loading {
          padding: 40px 0;
          display: flex;
          justify-content: center;
        }

        .tx__empty {
          padding: 20px 0 4px;
        }

        .tx__empty span {
          color: #848e9c !important;
        }
      `}</style>
    </div>
  );
}

export default Transaction;
