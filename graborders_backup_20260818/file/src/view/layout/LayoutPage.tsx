import React from "react";
import TabBottomNavigator from "./TabBottomNavigator";
import "./styles/style.css";
import Footer from "../shared/Footer";
function LayoutPage(props) {
  return (
    <div className="">
      <div className="children__content">{props.children}</div>
      <TabBottomNavigator />
    </div>
  );
}

export default LayoutPage;
