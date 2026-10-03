import { StrictMode, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import App from "./App";
import PuzzleVsZombiePrivacyPage from "./PuzzleVsZombiePrivacyPage";
import WhiteNinjaPrivacyPage from "./WhiteNinjaPrivacyPage";
import "./styles.css";

const privacyPaths = new Set(["/privacy/white-ninja", "/privacy/puzzle-vs-zombie"]);
const getPathname = () => window.location.pathname.replace(/\/+$/, "") || "/";

function Website() {
  const [pathname, setPathname] = useState(getPathname);
  const [portfolioLanguage, setPortfolioLanguage] = useState<"en" | "ar">();

  useEffect(() => {
    const renderCurrentPage = () => {
      // Commit the destination before the browser restores scroll on Back/Forward.
      flushSync(() => setPathname(getPathname()));
    };

    const onPrivacyLinkClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const link =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>("a[data-privacy-link]")
          : null;
      if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;

      const destination = new URL(link.href);
      const destinationPath = destination.pathname.replace(/\/+$/, "");
      if (destination.origin !== window.location.origin || !privacyPaths.has(destinationPath)) return;

      event.preventDefault();
      const currentLanguage = document.documentElement.lang;
      window.history.pushState(null, "", destination);
      flushSync(() => {
        setPortfolioLanguage(currentLanguage === "ar" ? "ar" : "en");
        setPathname(getPathname());
      });
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });

      const heading = document.getElementById("privacy-title");
      heading?.setAttribute("tabindex", "-1");
      heading?.focus({ preventScroll: true });
    };

    document.addEventListener("click", onPrivacyLinkClick);
    window.addEventListener("popstate", renderCurrentPage);
    return () => {
      document.removeEventListener("click", onPrivacyLinkClick);
      window.removeEventListener("popstate", renderCurrentPage);
    };
  }, []);

  if (pathname === "/privacy/white-ninja") return <WhiteNinjaPrivacyPage />;
  if (pathname === "/privacy/puzzle-vs-zombie") return <PuzzleVsZombiePrivacyPage />;
  return <App initialLanguage={portfolioLanguage} />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Website />
  </StrictMode>,
);
