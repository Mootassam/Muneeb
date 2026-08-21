import React from "react";
import I18nSelect from "src/view/layout/I18nSelect";
import SubHeader from "src/view/shared/Header/SubHeader";
import { i18n } from "../../../i18n";

function LanguagePage() {
  return (
    <div className="lng__root">
      <SubHeader title={i18n('pages.language.title')} path="/profile" />
      <I18nSelect />

      <style>{`
        .lng__root {
          min-height: 100vh;
          background: var(--bg-page);
        }
      `}</style>
    </div>
  );
}

export default LanguagePage;
