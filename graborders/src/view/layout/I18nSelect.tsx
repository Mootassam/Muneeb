import React, { useState } from 'react';
import { getLanguages, getLanguageCode, i18n } from '../../i18n';
import actions from 'src/modules/layout/layoutActions';

function I18nSelect() {
  const [search, setSearch] = useState('');
  const currentCode = getLanguageCode();

  const doChangeLanguage = (language) => {
    if (language === currentCode) {
      return;
    }
    actions.doChangeLanguage(language);
  };

  const query = search.trim().toLowerCase();
  const languages = getLanguages().filter((language) =>
    !query || language.label.toLowerCase().includes(query)
  );

  return (
    <div className="i18n__page">
      <div className="i18n__card">
        <div className="i18n__header">
          <span className="i18n__headerIcon">
            <i className="fa-solid fa-language"></i>
          </span>
          <div>
            <div className="i18n__headerTitle">
              {i18n('pages.language.selectLanguage')}
            </div>
            <div className="i18n__headerSubtitle">
              {i18n('pages.language.choosePreferred')}
            </div>
          </div>
        </div>

        <div className="i18n__searchBox">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={i18n('pages.language.searchPlaceholder')}
          />
        </div>

        <div className="i18n__list">
          {languages.map((language) => {
            const isActive = currentCode === language.id;

            return (
              <div
                key={language.id}
                onClick={() => doChangeLanguage(language.id)}
                className={`i18n__row ${isActive ? 'i18n__row--active' : ''}`}
              >
                <span className="i18n__flag">
                  <img src={language.flag} alt={language.label} />
                </span>
                <span className="i18n__name">{language.label}</span>
                {isActive && (
                  <span className="i18n__check">
                    <i className="fa-solid fa-check"></i>
                  </span>
                )}
              </div>
            );
          })}

          {languages.length === 0 && (
            <div className="i18n__noResults">
              {i18n('pages.language.noResults')}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .i18n__page {
          min-height: 100vh;
          background: #06070b;
          display: flex;
          justify-content: center;
          padding: 20px 14px 100px;
          font-family: "Poppins", -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .i18n__card {
          max-width: 400px;
          width: 100%;
          background: #14151d;
          padding: 22px 18px 26px;
          border-radius: 22px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          color: #eaecef;
        }

        .i18n__header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
          padding: 0 2px;
        }

        .i18n__headerIcon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: rgba(240, 185, 11, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .i18n__headerIcon i {
          color: #f0b90b;
          font-size: 17px;
        }

        .i18n__headerTitle {
          font-size: 16px;
          font-weight: 700;
          color: #f5f6f8;
        }

        .i18n__headerSubtitle {
          font-size: 12px;
          color: #848e9c;
          margin-top: 2px;
        }

        .i18n__searchBox {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #1a1c26;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 11px 14px;
          margin-bottom: 14px;
        }

        .i18n__searchBox i {
          color: #5e6673;
          font-size: 13px;
        }

        .i18n__searchBox input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #eaecef;
          font-size: 14px;
          min-width: 0;
        }

        .i18n__searchBox input::placeholder {
          color: #5e6673;
        }

        .i18n__list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .i18n__row {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #1a1c26;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 14px;
          padding: 11px 14px;
          cursor: pointer;
        }

        .i18n__row--active {
          border-color: rgba(240, 185, 11, 0.4);
          background: rgba(240, 185, 11, 0.06);
        }

        .i18n__flag {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .i18n__flag img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .i18n__name {
          flex: 1;
          font-size: 14px;
          font-weight: 600;
          color: #eaecef;
        }

        .i18n__row--active .i18n__name {
          color: #f5f6f8;
          font-weight: 700;
        }

        .i18n__check {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #f0b90b;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .i18n__check i {
          color: #0b0e11;
          font-size: 11px;
        }

        .i18n__noResults {
          text-align: center;
          padding: 30px 10px;
          color: #5e6673;
          font-size: 13px;
        }
      `}</style>
    </div>
  );
}

export default I18nSelect;
