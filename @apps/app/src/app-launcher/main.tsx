import React from "react";
import ReactDOM from "react-dom/client";
import "../index.scss";
import "../ui/icons/index.scss";
import App from "./App";
import { MantineCommonProvider } from "../app-common";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineCommonProvider>
      <App />
    </MantineCommonProvider>
  </React.StrictMode>,
);
