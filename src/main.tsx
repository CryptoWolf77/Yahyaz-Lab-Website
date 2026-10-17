import { StrictMode, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import App from "./App";
import PuzzleVsZombiePrivacyPage from "./PuzzleVsZombiePrivacyPage";
import WhiteNinjaPrivacyPage from "./WhiteNinjaPrivacyPage";
import "./styles.css";
import "./portfolio.css";

const sitePaths = new Set(["/", "/apps", "/games", "/privacy/white-ninja", "/privacy/puzzle-vs-zombie"]);
const normalizedPath = (pathname: string) => pathname.replace(/\/index\.html$/, "").replace(/\/+$/, "") || "/";
const getLocation = () => ({ pathname: normalizedPath(window.location.pathname), search: window.location.search });

function mapLegacyAnchor(url: URL) {
  if (normalizedPath(url.pathname) === "/" && (url.hash === "#games" || url.hash === "#showreel")) url.pathname = "/games";
  return url;
}

function focusDestination(hash: string, focus = true) {
  let id = "";
  try { id = decodeURIComponent(hash.slice(1)); } catch { /* Invalid fragments fall back to the page heading. */ }
  const target = id ? document.getElementById(id) : document.getElementById("page-title") ?? document.getElementById("privacy-title");
  if (hash && target) target.scrollIntoView({ behavior: "instant", block: "start" });
  else if (!hash) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  if (focus && target) { target.setAttribute("tabindex", "-1"); target.focus({ preventScroll: true }); }
}

function Website() {
  const [location, setLocation] = useState(getLocation);

  useEffect(() => {
    const initial = mapLegacyAnchor(new URL(window.location.href));
    if (initial.href !== window.location.href) {
      window.history.replaceState(null, "", initial);
      setLocation(getLocation());
    }
    if (initial.hash) requestAnimationFrame(() => focusDestination(initial.hash, false));

    const renderCurrentPage = () => {
      const destination = mapLegacyAnchor(new URL(window.location.href));
      if (destination.href !== window.location.href) window.history.replaceState(null, "", destination);
      // Commit the destination before the browser restores scroll on Back/Forward.
      flushSync(() => setLocation(getLocation()));
      if (destination.hash) requestAnimationFrame(() => focusDestination(destination.hash, false));
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
          ? event.target.closest<HTMLAnchorElement>("a[data-site-link], a[data-privacy-link], .privacy-page a[href]")
          : null;
      if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;

      const destination = mapLegacyAnchor(new URL(link.href));
      const destinationPath = normalizedPath(destination.pathname);
      if (destination.origin !== window.location.origin || !sitePaths.has(destinationPath)) return;
      if (destinationPath.startsWith("/privacy/") && destinationPath === normalizedPath(window.location.pathname) && destination.hash) return;

      event.preventDefault();
      if (destination.href !== window.location.href) window.history.pushState(null, "", destination);
      flushSync(() => setLocation(getLocation()));
      focusDestination(destination.hash);
    };

    document.addEventListener("click", onPrivacyLinkClick);
    window.addEventListener("popstate", renderCurrentPage);
    return () => {
      document.removeEventListener("click", onPrivacyLinkClick);
      window.removeEventListener("popstate", renderCurrentPage);
    };
  }, []);

  if (location.pathname === "/privacy/white-ninja") return <WhiteNinjaPrivacyPage />;
  if (location.pathname === "/privacy/puzzle-vs-zombie") return <PuzzleVsZombiePrivacyPage />;
  const page = location.pathname === "/apps" ? "apps" : location.pathname === "/games" ? "games" : "home";
  return <App page={page} />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Website />
  </StrictMode>,
);
