import React from "react";
import ReactDOM from "react-dom/client";
import { SidepanelApp } from "./StudySidepanelApp";
import { MantineCommonProvider } from "../app-common";
import "@mantine/core/styles.css";

localStorage.removeItem("theme");

ReactDOM.createRoot(document.getElementById("sidepanel-root")!).render(
  <React.StrictMode>
    <MantineCommonProvider>
      <SidepanelApp />
    </MantineCommonProvider>
  </React.StrictMode>,
);
