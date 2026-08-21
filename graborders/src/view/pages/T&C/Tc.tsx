import React from "react";
import PlatformInfoPage from "src/view/shared/PlatformInfoPage";
import { i18n } from "../../../i18n";

function Tc() {
  return (
    <PlatformInfoPage
      title={i18n("pages.home.platformIntro.rulesTitle")}
      icon="fa-solid fa-scale-balanced"
      field="tc"
    />
  );
}

export default Tc;
