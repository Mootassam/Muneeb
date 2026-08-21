import React from "react";
import PlatformInfoPage from "src/view/shared/PlatformInfoPage";
import { i18n } from "../../../i18n";

function Cooperation() {
  return (
    <PlatformInfoPage
      title={i18n("pages.home.platformIntro.cooperationTitle")}
      icon="fa-solid fa-handshake"
      field="cooperation"
    />
  );
}

export default Cooperation;
