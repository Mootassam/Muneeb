import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import actions from "src/modules/record/list/recordListActions";
import selectors from "src/modules/record/list/recordListSelectors";
import recordFormActions from "src/modules/record/form/recordFormActions";
import LoadingModal from "src/shared/LoadingModal";
import Dates from "src/view/shared/utils/Dates";
import Nodata from "src/view/shared/Nodata";
import { i18n } from "../../../i18n";
import GrapProductList from "src/view/pages/Grap/GrapProductList";

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
            <div className="ord__cardHead">
              <span className={`ord__badge ord__badge--${item?.status}`}>
                {i18n(`pages.portfolio.status.${item?.status}`)}
              </span>
              <span className="ord__orderNumber">
                {i18n("pages.portfolio.orderNumber")} #{item.number}
              </span>
            </div>

            {productType === "combo" ? (
              <GrapProductList
                products={(item?.product?.products || []).map(
                  (p) => p.product,
                )}
              />
            ) : (
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
                  <div className="ord__productDate">
                    <i className="fa-regular fa-clock"></i>
                    {Dates.currentDate(item?.date)}
                  </div>
                </div>
              </div>
            )}

            <div className="ord__divider" />

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

              <div className="ord__stat ord__stat--right">
                <span className="ord__statLabel">
                  {i18n("pages.portfolio.estimatedReturn")}
                </span>
                <span className="ord__statValue ord__statValue--accent">
                  +{estimatedReturn} {i18n("pages.portfolio.currency")}
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
      <div className="ord__wrap">
        <h1 className="ord__title">{i18n("pages.portfolio.title")}</h1>

        <div className="ord__tabs">
          <button
            className={`ord__tab ${active === "completed" ? "ord__tab--active" : ""}`}
            onClick={() => setActive("completed")}
          >
            <i className="fa-solid fa-circle-check"></i>
            {i18n("pages.portfolio.completed")}
          </button>
          <button
            className={`ord__tab ${active === "pending" ? "ord__tab--active" : ""}`}
            onClick={() => setActive("pending")}
          >
            <i className="fa-solid fa-hourglass-half"></i>
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

        .ord__wrap {
          position: relative;
          max-width: 400px;
          margin: 0 auto;
          padding: 0 16px;
        }

        .ord__title {
          font-size: 26px;
          font-weight: 800;
          color: var(--text-primary);
          margin: 4px 0 16px;
        }

        .ord__tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 18px;
        }

        .ord__tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin: 0;
          border: 1px solid var(--border);
          background: var(--bg-card);
          color: var(--text-muted);
          font-family: "Poppins", sans-serif;
          font-size: 12px;
          font-weight: 700;
          padding: 12px 0;
          border-radius: 999px;
          cursor: pointer;
          box-shadow: 0 4px 12px var(--shadow-color);
          transition: background-color 0.15s ease, color 0.15s ease;
        }

        .ord__tab i {
          font-size: 11.5px;
        }

        .ord__tab--active {
          border-color: transparent;
          background: linear-gradient(180deg, var(--accent-grad-start), var(--accent-grad-end));
          color: var(--accent-text-on);
        }

        .ord__list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .ord__card {
          background: var(--bg-card);
          border-radius: 20px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          box-shadow: 0 8px 20px var(--shadow-color);
        }

        .ord__cardHead {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .ord__badge {
          flex-shrink: 0;
          padding: 4px 12px;
          border-radius: 999px;
          font-size: 10.5px;
          font-weight: 800;
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

        .ord__orderNumber {
          font-size: 11.5px;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          min-width: 0;
        }

        .ord__product {
          display: flex;
          gap: 14px;
          align-items: center;
        }

        .ord__thumb {
          width: 58px;
          height: 58px;
          border-radius: 12px;
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
          gap: 5px;
          min-width: 0;
        }

        .ord__productName {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .ord__productQty {
          font-size: 12px;
          color: var(--text-muted);
        }

        .ord__productDate {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11.5px;
          color: var(--text-muted);
        }

        .ord__productDate i {
          font-size: 11px;
          color: var(--text-faint);
        }

        .ord__divider {
          position: relative;
          border-top: 1px dashed var(--border-strong);
        }

        .ord__divider::before,
        .ord__divider::after {
          content: "";
          position: absolute;
          top: 50%;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--bg-page);
          transform: translateY(-50%);
        }

        .ord__divider::before {
          left: -24px;
        }

        .ord__divider::after {
          right: -24px;
        }

        .ord__stats {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 8px;
        }

        .ord__stat {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .ord__stat--right {
          align-items: flex-end;
          text-align: right;
        }

        .ord__statLabel {
          font-size: 11px;
          color: var(--text-muted);
        }

        .ord__statValue {
          font-size: 13.5px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .ord__statValue--accent {
          color: var(--success);
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
      `}</style>
    </div>
  );
}

export default Portfolio;
