import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import WhiteNinjaPrivacyPage from "./WhiteNinjaPrivacyPage";
import "./styles.css";

const pathname = window.location.pathname.replace(/\/+$/, "") || "/";
const page = pathname === "/privacy/white-ninja" ? <WhiteNinjaPrivacyPage /> : <App />;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {page}
  </StrictMode>,
);
