import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SubHeader from "src/view/shared/Header/SubHeader";
import actions from "src/modules/company/list/companyListActions";
import selectors from "src/modules/company/list/companyListSelectors";
import LoadingModal from "src/shared/LoadingModal";
import { i18n } from "../../i18n";

interface Props {
  title: string;
  icon: string;
  field: "companydetails" | "tc" | "faqs" | "cooperation";
}

function PlatformInfoPage({ title, icon, field }: Props) {
  const dispatch = useDispatch();

  const record = useSelector(selectors.selectRows);
  const loading = useSelector(selectors.selectLoading);

  useEffect(() => {
    dispatch(actions.doFetch());
  }, [dispatch]);

  const content = record?.[0]?.[field];

  return (
    <div>
      <SubHeader title={title} path="/" />

      <div className="pinfo__page">
        {loading && <LoadingModal />}

        {!loading && (
          <div className="pinfo__card">
            <span className="pinfo__icon">
              <i className={icon}></i>
            </span>
            <div className="pinfo__title">{title}</div>

            {content ? (
              <div
                className="pinfo__body"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <div className="pinfo__empty">
                {i18n("pages.home.platformIntro.emptyContent")}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .pinfo__page {
          min-height: 100vh;
          background: var(--bg-page);
          padding: 16px 14px 100px;
          font-family: "Poppins", -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .pinfo__card {
          max-width: 460px;
          margin: 0 auto;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 18px;
          padding: 22px 20px;
          box-shadow: 0 8px 20px var(--shadow-color);
        }

        .pinfo__icon {
          width: 46px;
          height: 46px;
          border-radius: 12px;
          background: var(--bg-tint);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
        }

        .pinfo__icon i {
          color: var(--accent);
          font-size: 18px;
        }

        .pinfo__title {
          font-size: 17px;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 14px;
        }

        .pinfo__body {
          font-size: 13.5px;
          color: var(--text-secondary);
          line-height: 1.8;
        }

        .pinfo__body p {
          margin: 0 0 12px;
        }

        .pinfo__body a {
          color: var(--accent);
        }

        .pinfo__empty {
          font-size: 13px;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}

export default PlatformInfoPage;
