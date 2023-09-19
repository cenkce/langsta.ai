import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./app/App";
import { RecoilRoot } from "recoil";
import { RecoilSync } from "recoil-sync";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RecoilRoot>
      <RecoilSync storeKey="common-store">
        <App />
      </RecoilSync>
    </RecoilRoot>
  </React.StrictMode>
);
