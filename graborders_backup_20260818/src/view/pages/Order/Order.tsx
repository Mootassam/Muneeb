import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import actions from "src/modules/record/list/recordListActions";
import selectors from "src/modules/record/list/recordListSelectors";
import recordFormActions from "src/modules/record/form/recordFormActions";
import LoadingModal from "src/shared/LoadingModal";
import Dates from "src/view/shared/utils/Dates";
import Nodata from "src/view/shared/Nodata";
import { i18n } from "../../../i18n";

function Portfolio() {
  const [active, setActive] = useState("completed");
  const dispatch = useDispatch();
  const records = useSelector(selectors.selectRows);
  const loading = useSelector(selectors.selectLoading);
  const selectHasRows = useSelector(selectors.selectHasRows);

  useEffect(() => {
    const filter = { status: active };
    dispatch(actions.doFetch(filter, filter));
  }, [dispatch, active]);

  const submitStatus = (id) => {
    const data = { status: "completed" };
    dispatch(recordFormActions.doChangeStatus(id, data));
  };

  const calculateProfit = (price, commission) => {
    const p = parseFloat(price) || 0;
    const c = parseFloat(commission) || 0;
    const total = (p * c) / 100;
    return total.toFixed(3);
  };

  const renderRecords = () => (
    <>
      {records.map((item, index) => {
        const productType = item?.product?.type;

        const displayAmount =
          item?.price ?? item?.product?.amount ?? 0;

        const displayCommission =
          item?.commission ??
          (productType !== "prizes" ? item?.product?.commission : 0);

        const estimatedReturn =
          productType === "prizes"
            ? item?.product?.amount ?? 0
            : calculateProfit(displayAmount, displayCommission);

        return (
          <div className="ord__card" key={`${item.id}-${index}`}>
            <div className={`ord__badge ord__badge--${item?.status}`}>
              {i18n(`pages.portfolio.status.${item?.status}`)}
            </div>

            <div className="ord__meta">
              <span>
                {i18n("pages.portfolio.orderTime")}: {Dates.currentDate(item?.date)}
              </span>
              <span>
                {i18n("pages.portfolio.orderNumber")}: {item.number}
              </span>
            </div>

            <div className="ord__product">
              <div className="ord__thumb">
                {item?.product && (
                  <img
                    src={
                      item?.product?.image ||
                      item?.product?.photo?.[0]?.downloadUrl ||
                      "https://via.placeholder.com/70x70/181a20/f0b90b?text=%20"
                    }
                    alt={item?.title || item?.product?.title}
                    loading="lazy"
                  />
                )}
              </div>
              <div className="ord__productInfo">
                <div className="ord__productName">{item?.product?.title}</div>
                <div className="ord__productQty">
                  {i18n("pages.portfolio.quantity")}
                </div>
              </div>
            </div>

            <div className="ord__stats">
              <div className="ord__stat">
                <span className="ord__statLabel">
                  {i18n("pages.portfolio.totalOrderAmount")}
                </span>
                <span className="ord__statValue">
                  {displayAmount} {i18n("pages.portfolio.currency")}
                </span>
              </div>

              <div className="ord__stat">
                <span className="ord__statLabel">
                  {i18n("pages.portfolio.commission")}
                </span>
                <span className="ord__statValue">
                  {displayCommission}
                  {productType !== "prizes" && !item?.commission && "%"}
                </span>
              </div>

              <div className="ord__stat">
                <span className="ord__statLabel">
                  {i18n("pages.portfolio.estimatedReturn")}
                </span>
                <span className="ord__statValue ord__statValue--accent">
                  {estimatedReturn} {i18n("pages.portfolio.currency")}
                </span>
              </div>
            </div>

            {item?.status === "pending" && (
              <button
                className="ord__submitBtn"
                onClick={() => submitStatus(item.id)}
              >
                {i18n("pages.portfolio.submit")}
              </button>
            )}
          </div>
        );
      })}
    </>
  );

  return (
    <div className="ord__page">
      <div className="ord__glow" />

      <div className="ord__wrap">
        <div className="ord__tabs">
          <button
            className={`ord__tab ${active === "completed" ? "ord__tab--active" : ""}`}
            onClick={() => setActive("completed")}
          >
            {i18n("pages.portfolio.completed")}
          </button>
          <button
            className={`ord__tab ${active === "pending" ? "ord__tab--active" : ""}`}
            onClick={() => setActive("pending")}
          >
            {i18n("pages.portfolio.pending")}
          </button>
        </div>

        <div className="ord__list">
          {loading && <LoadingModal />}
          {!loading && records && renderRecords()}
        </div>

        {!loading && !selectHasRows && <Nodata />}
      </div>

      <style>{`
        .ord__page {
          position: relative;
          min-height: 100vh;
          background: var(--bg-page);
          padding: 20px 0 40px;
          font-family: "Poppins", -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .ord__glow {
          position: absolute;
          top: -140px;
          left: 50%;
          transform: translateX(-50%);
          width: 680px;
          height: 320px;
          background: radial-gradient(ellipse at center, var(--bg-tint), transparent 70%);
          filter: blur(20px);
          pointer-events: none;
          z-index: 0;
        }

        .ord__wrap {
          position: relative;
          z-index: 1;
          max-width: 400px;
          margin: 0 auto;
          padding: 0 16px;
        }

        .ord__tabs {
          display: flex;
          gap: 6px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 5px;
          margin-bottom: 18px;
        }

        .ord__tab {
          flex: 1;
          margin: 0;
          border: none;
          background: transparent;
          color: var(--text-muted);
          font-family: "Poppins", sans-serif;
          font-size: 13.5px;
          font-weight: 600;
          padding: 10px 0;
          border-radius: 9px;
          cursor: pointer;
          transition: background-color 0.15s ease, color 0.15s ease;
        }

        .ord__tab--active {
          background: linear-gradient(180deg, var(--accent-grad-start), var(--accent-grad-end));
          color: var(--accent-text-on);
        }

        .ord__list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .ord__card {
          position: relative;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .ord__badge {
          position: absolute;
          top: 14px;
          right: 14px;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .ord__badge--completed {
          background: var(--success-bg);
          color: var(--success);
        }

        .ord__badge--pending {
          background: var(--bg-tint);
          color: var(--accent);
        }

        .ord__badge--canceled,
        .ord__badge--frozen {
          background: var(--danger-bg);
          color: var(--danger);
        }

        .ord__meta {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 12px;
          color: var(--text-faint);
          max-width: 75%;
        }

        .ord__product {
          display: flex;
          gap: 14px;
          align-items: center;
          padding: 12px;
          background: var(--bg-card-alt);
          border: 1px solid var(--border);
          border-radius: 12px;
        }

        .ord__thumb {
          width: 60px;
          height: 60px;
          border-radius: 10px;
          overflow: hidden;
          background: var(--bg-card-alt);
          flex-shrink: 0;
        }

        .ord__thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .ord__productInfo {
          display: flex;
          flex-direction: column;
          gap: 6px;
          min-width: 0;
        }

        .ord__productName {
          font-size: 14.5px;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .ord__productQty {
          font-size: 12px;
          color: var(--text-faint);
        }

        .ord__stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .ord__stat {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .ord__statLabel {
          font-size: 11px;
          color: var(--text-faint);
        }

        .ord__statValue {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .ord__statValue--accent {
          color: var(--accent);
        }

        .ord__submitBtn {
          width: 100%;
          margin: 0;
          border: none;
          border-radius: 14px;
          padding: 11px;
          background: linear-gradient(180deg, var(--accent-grad-start), var(--accent-grad-end));
          color: var(--accent-text-on);
          font-family: "Poppins", sans-serif;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: background-color 0.15s ease, transform 0.1s ease;
        }

        .ord__submitBtn:hover {
          background: var(--accent-grad-start);
        }

        .ord__submitBtn:active {
          transform: translateY(1px);
        }

        @media (max-width: 480px) {
          .ord__stats {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}

export default Portfolio;
