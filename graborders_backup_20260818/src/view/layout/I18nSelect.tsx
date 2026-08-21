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
      <div className="i18n__wrap">
        <div className="i18n__hero">
          <span className="i18n__heroIcon">
            <i className="fa-solid fa-language"></i>
          </span>
          <div className="i18n__heroTitle">
            {i18n('pages.language.selectLanguage')}
          </div>
          <p className="i18n__heroText">
            {i18n('pages.language.choosePreferred')}
          </p>
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
          display: flex;
          justify-content: center;
          padding: 16px 14px 100px;
          font-family: "Poppins", "Helvetica Neue", Arial, sans-serif;
          box-sizing: border-box;
        }

        .i18n__page * {
          box-sizing: border-box;
        }

        .i18n__wrap {
          max-width: 400px;
          width: 100%;
        }

        .i18n__hero {
          text-align: center;
          padding: 24px 20px;
          background: linear-gradient(160deg, #ff9900, #ff5c00 75%);
          border-radius: 16px;
          margin-bottom: 14px;
          box-shadow: 0 10px 24px -10px rgba(255, 106, 0, 0.45);
        }

        .i18n__heroIcon {
          width: 52px;
          height: 52px;
          margin: 0 auto 12px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.22);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .i18n__heroIcon i {
          color: #fff;
          font-size: 21px;
        }

        .i18n__heroTitle {
          font-size: 17px;
          font-weight: 700;
          color: #fff;
        }

        .i18n__heroText {
          font-size: 12.5px;
          color: rgba(255, 255, 255, 0.9);
          margin: 4px 0 0;
        }

        .i18n__searchBox {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--bg-card);
          border: 1px solid var(--border-strong);
          border-radius: 10px;
          padding: 11px 14px;
          margin-bottom: 14px;
        }

        .i18n__searchBox:focus-within {
          border-color: #ff6a00;
          box-shadow: 0 0 0 3px rgba(255, 106, 0, 0.16);
        }

        .i18n__searchBox i {
          color: var(--text-muted);
          font-size: 13px;
        }

        .i18n__searchBox input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-primary);
          font-size: 14px;
          min-width: 0;
          font-family: inherit;
        }

        .i18n__searchBox input::placeholder {
          color: var(--placeholder);
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
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 12px 14px;
          cursor: pointer;
          transition: border-color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease;
        }

        .i18n__row:hover {
          box-shadow: 0 4px 12px -6px rgba(15, 17, 17, 0.15);
        }

        .i18n__row--active {
          border-color: #ffb84d;
          background: var(--bg-tint-soft);
        }

        .i18n__flag {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
          border: 1px solid var(--border-soft);
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
          color: var(--text-primary);
        }

        .i18n__row--active .i18n__name {
          color: var(--text-primary);
          font-weight: 700;
        }

        .i18n__check {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: linear-gradient(180deg, #ffb84d, #ff8a00);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .i18n__check i {
          color: #fff;
          font-size: 11px;
        }

        .i18n__noResults {
          text-align: center;
          padding: 30px 10px;
          color: var(--text-tertiary);
          font-size: 13px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 14px;
        }
      `}</style>
    </div>
  );
}

export default I18nSelect;
