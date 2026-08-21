import React from "react";
import PlatformInfoPage from "src/view/shared/PlatformInfoPage";
import { i18n } from "../../../i18n";

function Company() {
  return (
    <PlatformInfoPage
      title={i18n("pages.home.platformIntro.profileTitle")}
      icon="fa-solid fa-shop"
      field="companydetails"
    />
  );
}

export default Company;
