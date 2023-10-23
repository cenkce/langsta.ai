import React from "react";
import ReactDOM from "react-dom/client";
import { SidepanelApp } from "./SidepanelApp";
import "../index.scss";
localStorage.removeItem('theme')

ReactDOM.createRoot(document.getElementById("sidepanel-root")!).render(
  <React.StrictMode>
    <SidepanelApp />
  </React.StrictMode>
);
