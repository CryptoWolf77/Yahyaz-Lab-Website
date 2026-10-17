import { useEffect, useRef, useState } from "react";
import { Languages, Menu, X } from "lucide-react";
import { studio } from "../data/siteContent";
import type { Language, PortfolioPage } from "../data/appContent";

export default function PortfolioHeader({ page, language, setLanguage }: {
  page: PortfolioPage; language: Language; setLanguage: (language: Language) => void;
}) {
  const [open, setOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const ar = language === "ar";
  const links = [
    { href: "/", key: "home", label: ar ? "الرئيسية" : "Home" },
    { href: "/apps", key: "apps", label: ar ? "التطبيقات" : "Apps" },
    { href: "/games", key: "games", label: ar ? "الألعاب" : "Games" },
    { href: "/#studio", key: "studio", label: ar ? "عني" : "About" },
    { href: "/#contact", key: "contact", label: ar ? "تواصل" : "Contact" },
  ];
  useEffect(() => setOpen(false), [page, language]);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    const outside = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", outside);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", outside);
    };
  }, [open]);
  return (
    <header className={`site-header ${open ? "site-header--open" : ""}`} ref={header} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
      <div className="site-header__inner content-width">
        <a href="/" data-site-link className="brand-mark" aria-label={ar ? "الصفحة الرئيسية لـ YahyazLab" : "YahyazLab home"}><img src={studio.logoTransparent} alt="" width="42" height="32" /><span>YAHYAZLAB</span></a>
        <nav className="desktop-nav" aria-label={ar ? "التنقل الرئيسي" : "Primary navigation"}>
          {links.map((link) => <a href={link.href} data-site-link key={link.key} aria-current={page === link.key ? "page" : undefined}>{link.label}</a>)}
        </nav>
        <div className="header-actions">
          <div className="language-switcher" role="group" aria-label={ar ? "اللغة" : "Language"} dir="ltr">
            <Languages size={16} aria-hidden="true" />
            <button type="button" onClick={() => setLanguage("en")} aria-pressed={language === "en"} lang="en" className={language === "en" ? "language-switcher__option language-switcher__option--active" : "language-switcher__option"}>EN</button>
            <button type="button" onClick={() => setLanguage("ar")} aria-pressed={language === "ar"} lang="ar" className={language === "ar" ? "language-switcher__option language-switcher__option--active" : "language-switcher__option"}>عربي</button>
          </div>
          <button className="icon-button menu-toggle" type="button" ref={toggle} aria-label={open ? (ar ? "إغلاق القائمة" : "Close menu") : (ar ? "فتح القائمة" : "Open menu")} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen((current) => !current)}>{open ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
      </div>
      <nav id="mobile-navigation" className="mobile-nav content-width" aria-label={ar ? "قائمة التنقل" : "Mobile navigation"} hidden={!open}>
        {links.map((link, index) => <a href={link.href} data-site-link key={link.key} aria-current={page === link.key ? "page" : undefined} onClick={() => setOpen(false)}><span className="mobile-nav__index" aria-hidden="true">0{index + 1}</span>{link.label}</a>)}
      </nav>
    </header>
  );
}
