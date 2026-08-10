import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import categoryService from 'src/modules/category/categoryService';
import { i18n } from "../../../i18n";

function CsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [response, setResponse] = useState<any[]>([]);

  const fetchCsInfo = async () => {
    try {
      const result = await categoryService.listCs();
      setResponse(result.rows);
    } catch (error) {
      console.error('Error fetching Customer Support Info:', error);
    }
  };

  useEffect(() => {
    fetchCsInfo();
  }, []);

  const closeModal = () => setIsModalOpen(false);

  const handleContactClick = (cs) => {
    const number = cs.number.replace(/\D/g, '');
    const message = "Hello, I need help with...";

    if (cs.type.toLowerCase() === 'whatsapp') {
      window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank');
    } else if (cs.type.toLowerCase() === 'telegram') {
      window.open(`https://t.me/${number}`, '_blank');
    }

    closeModal();
  };

  const getPlatformIcon = (type) => {
    const platform = type.toLowerCase();
    if (platform === 'whatsapp') {
      return 'fa-brands fa-whatsapp';
    }
    if (platform === 'telegram') {
      return 'fa-brands fa-telegram';
    }
    return 'fa-solid fa-headset';
  };

  const getPlatformName = (type) => {
    const platform = type.toLowerCase();
    if (platform === 'whatsapp') {
      return i18n('pages.csPage.platformNames.whatsapp');
    }
    if (platform === 'telegram') {
      return i18n('pages.csPage.platformNames.telegram');
    }
    return type;
  };

  return (
    <div className="csw__root">
      <button
        type="button"
        className="csw__fab"
        onClick={() => setIsModalOpen(true)}
        aria-label="Customer support"
      >
        <i className="fa-solid fa-headset"></i>
      </button>

      {isModalOpen && (
        <div className="csw__overlay" onClick={closeModal}>
          <div className="csw__modal" onClick={(event) => event.stopPropagation()}>
            <div className="csw__header">
              <span className="csw__headerIcon">
                <i className="fa-solid fa-headset"></i>
              </span>
              <div className="csw__headerText">
                <div className="csw__title">{i18n('pages.csPage.customerSupport')}</div>
                <div className="csw__subtitle">{i18n('pages.csPage.hereToHelp')}</div>
              </div>
              <i className="fa-solid fa-xmark csw__close" onClick={closeModal}></i>
            </div>

            <p className="csw__prompt">{i18n('pages.csPage.howCanWeHelp')}</p>

            <div className="csw__list">
              <Link to="/Chat" className="csw__row" onClick={closeModal}>
                <span className="csw__avatar csw__avatar--live">
                  <i className="fa-solid fa-comment-dots"></i>
                </span>
                <span className="csw__rowInfo">
                  <span className="csw__rowName">Live Chat</span>
                  <span className="csw__rowMeta">Get instant help from our team</span>
                </span>
                <i className="fa-solid fa-chevron-right csw__rowArrow"></i>
              </Link>

              {response && response.map((cs, index) => {
                const photoUrl = cs?.photo?.[0]?.downloadUrl;

                return (
                  <div
                    key={index}
                    className="csw__row"
                    onClick={() => handleContactClick(cs)}
                  >
                    <span className="csw__avatar">
                      {photoUrl ? (
                        <img src={photoUrl} alt="" />
                      ) : (
                        <i className={getPlatformIcon(cs.type)}></i>
                      )}
                    </span>
                    <span className="csw__rowInfo">
                      <span className="csw__rowName">
                        <i className={getPlatformIcon(cs.type)}></i>
                        {getPlatformName(cs.type)}
                      </span>
                      <span className="csw__rowMeta">{cs.number}</span>
                    </span>
                    <i className="fa-solid fa-chevron-right csw__rowArrow"></i>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .csw__fab {
          position: fixed;
          bottom: 24px;
          right: 20px;
          z-index: 1000;
          width: 54px;
          height: 54px;
          margin: 0;
          border-radius: 50%;
          background: #f0b90b;
          border: none;
          box-shadow: 0 10px 24px rgba(240, 185, 11, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .csw__fab i {
          color: #0b0e11;
          font-size: 21px;
        }

        .csw__overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.65);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 2000;
        }

        .csw__modal {
          width: 100%;
          max-width: 380px;
          max-height: 86vh;
          overflow-y: auto;
          background: #14151d;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 20px;
        }

        .csw__header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .csw__headerIcon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: rgba(240, 185, 11, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .csw__headerIcon i {
          color: #f0b90b;
          font-size: 17px;
        }

        .csw__headerText {
          flex: 1;
          min-width: 0;
        }

        .csw__title {
          font-size: 15.5px;
          font-weight: 700;
          color: #f5f6f8;
        }

        .csw__subtitle {
          font-size: 11.5px;
          color: #848e9c;
          margin-top: 2px;
        }

        .csw__close {
          flex-shrink: 0;
          color: #5e6673;
          cursor: pointer;
          font-size: 16px;
        }

        .csw__close:hover {
          color: #eaecef;
        }

        .csw__prompt {
          font-size: 12.5px;
          color: #848e9c;
          text-align: center;
          margin: 0 0 16px;
          line-height: 1.5;
        }

        .csw__list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .csw__row {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #1a1c26;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 14px;
          padding: 12px;
          cursor: pointer;
          text-decoration: none;
        }

        .csw__avatar {
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #21232e;
          border: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .csw__avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .csw__avatar i {
          color: #848e9c;
          font-size: 15px;
        }

        .csw__avatar--live {
          background: rgba(240, 185, 11, 0.14);
          border-color: rgba(240, 185, 11, 0.3);
        }

        .csw__avatar--live i {
          color: #f0b90b;
        }

        .csw__rowInfo {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .csw__rowName {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13.5px;
          font-weight: 700;
          color: #eaecef;
        }

        .csw__rowName i {
          font-size: 12px;
          color: #f0b90b;
        }

        .csw__rowMeta {
          font-size: 11.5px;
          color: #848e9c;
        }

        .csw__rowArrow {
          flex-shrink: 0;
          color: #5e6673;
          font-size: 12px;
        }

        @media (max-width: 480px) {
          .csw__fab {
            bottom: 20px;
            right: 16px;
            width: 50px;
            height: 50px;
          }
        }
      `}</style>
    </div>
  );
}

export default CsPage;
