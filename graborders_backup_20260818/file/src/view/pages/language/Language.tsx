import React, { useState } from "react";
import I18nSelect from "src/view/layout/I18nSelect";
import SubHeader from "src/view/shared/Header/SubHeader";
import { i18n } from "../../../i18n";

function LanguagePage() {
  return (
    <div>
      <SubHeader title={i18n('pages.language.title')} path="/profile" />
      <I18nSelect />
    </div>
  );
}

export default LanguagePage;