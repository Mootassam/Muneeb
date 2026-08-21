import React from "react";
import PlatformInfoPage from "src/view/shared/PlatformInfoPage";
import { i18n } from "../../../i18n";

function Faqs() {
  return (
    <PlatformInfoPage
      title={i18n("pages.home.platformIntro.instructionsTitle")}
      icon="fa-solid fa-book-open"
      field="faqs"
    />
  );
}

export default Faqs;
