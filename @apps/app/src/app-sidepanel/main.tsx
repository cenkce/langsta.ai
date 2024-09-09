import React from "react";
import ReactDOM from "react-dom/client";
import { SidepanelApp } from "./SidepanelApp";
import "../index.scss";
import { MantineCommonProvider } from "../app-common";

localStorage.removeItem("theme");

ReactDOM.createRoot(document.getElementById("sidepanel-root")!).render(
  <React.StrictMode>
    <MantineCommonProvider>
      <SidepanelApp />
    </MantineCommonProvider>
  </React.StrictMode>
);
