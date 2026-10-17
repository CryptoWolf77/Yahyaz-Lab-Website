import { useEffect, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Expand, Smartphone, X } from "lucide-react";
import type { Application, Language } from "../data/appContent";
import { useModalFocus } from "./useModalFocus";

function AppGallery({ app, language, initialIndex, onClose }: {
  app: Application; language: Language; initialIndex: number; onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  const ref = useModalFocus(onClose);
  const shot = app.screenshots[index];
  const move = (step: number) => setIndex((current) => (current + step + app.screenshots.length) % app.screenshots.length);
  useEffect(() => {
    if (app.screenshots.length < 2) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") setIndex((current) => (current + 1) % app.screenshots.length);
      if (event.key === "ArrowLeft") setIndex((current) => (current - 1 + app.screenshots.length) % app.screenshots.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [app.screenshots.length]);
  const close = language === "ar" ? "إغلاق المعرض" : "Close gallery";
  return (
    <div className="modal-shell app-gallery-shell" role="dialog" aria-modal="true" aria-label={`${app.name} ${language === "ar" ? "معرض الصور" : "gallery"}`} ref={ref}>
      <div className="modal-backdrop" onClick={onClose} aria-hidden="true" />
      <div className={`app-gallery${app.id === "apexload" ? " app-gallery--apexload" : ""}`}>
        <header className="app-gallery__header">
          <div><strong><bdi>{app.name}</bdi></strong><span>{shot.label[language]}</span></div>
          <button className="icon-button" onClick={onClose} aria-label={close} title={close}><X size={20} /></button>
        </header>
        <div className="app-gallery__image"><img src={shot.src} alt={`${app.name}: ${shot.label[language]}`} width={shot.width} height={shot.height} decoding="async" /></div>
        {app.screenshots.length > 1 && <div className="app-gallery__controls" dir="ltr">
          <button className="icon-button" onClick={() => move(-1)} aria-label={language === "ar" ? "الصورة السابقة" : "Previous screenshot"} title={language === "ar" ? "الصورة السابقة" : "Previous screenshot"}><ChevronLeft size={20} /></button>
          <span>{index + 1} / {app.screenshots.length}</span>
          <button className="icon-button" onClick={() => move(1)} aria-label={language === "ar" ? "الصورة التالية" : "Next screenshot"} title={language === "ar" ? "الصورة التالية" : "Next screenshot"}><ChevronRight size={20} /></button>
        </div>}
      </div>
    </div>
  );
}

export default function AppShowcase({ app, language }: { app: Application; language: Language }) {
  const [active, setActive] = useState(0);
  const [gallery, setGallery] = useState<number | null>(null);
  const screenshot = app.screenshots[active];
  const visit = language === "ar" ? `زيارة ${app.name}` : `Visit ${app.name}`;
  const expand = app.screenshots.length === 1
    ? (language === "ar" ? `تكبير صورة ${app.name}` : `Expand ${app.name} image`)
    : (language === "ar" ? `تكبير صور ${app.name}` : `Expand ${app.name} screenshots`);
  return (
    <article className={`app-project app-project--${app.accent}${app.id === "apexload" ? " app-project--apexload" : ""}`} id={app.id} aria-labelledby={`${app.id}-title`}>
      <div className="app-project__inner content-width">
        <div className="app-project__identity">
          <div className="app-project__topline"><span className="project-number">0{app.order}</span><span className="eyebrow reading-text">{app.category[language]}</span></div>
          <div className="app-project__name"><img src={app.icon} alt="" width="80" height="80" loading="lazy" decoding="async" /><h2 id={`${app.id}-title`} dir="ltr" lang="en">{app.name}</h2></div>
          <p className="app-project__description reading-text">{app.description[language]}</p>
          <a className="button button--app" href={app.website} target="_blank" rel="noopener noreferrer" aria-label={`${visit} (${language === "ar" ? "يفتح في علامة تبويب جديدة" : "opens in a new tab"})`}><span>{language === "ar" ? <>زيارة <bdi lang="en">{app.name}</bdi></> : visit}</span><ArrowUpRight size={21} aria-hidden="true" /></a>
          {app.platformLinks.length > 0 && <div className="app-platform-links">{app.platformLinks.map((link) => <a href={link.href} key={link.href} target="_blank" rel="noopener noreferrer" aria-label={`${app.name}: ${link.label} (${language === "ar" ? "يفتح في علامة تبويب جديدة" : "opens in a new tab"})`}><Smartphone size={19} aria-hidden="true" /><bdi lang="en">{link.label}</bdi><ArrowUpRight size={18} aria-hidden="true" /></a>)}</div>}
        </div>
        <div className={`app-project__preview ${screenshot.width < screenshot.height ? "app-project__preview--portrait" : ""}`}>
          <div className="preview-toolbar" dir="ltr"><span className="preview-dots" aria-hidden="true"><i /><i /><i /></span><span>{new URL(app.website).hostname}</span><button className="preview-expand" type="button" onClick={() => setGallery(active)} aria-label={expand} title={expand}><Expand size={19} /></button></div>
          <button className="app-project__screen" type="button" onClick={() => setGallery(active)} aria-label={expand} dir="ltr">
            <img src={screenshot.src} alt={`${app.name}: ${screenshot.label[language]}`} width={screenshot.width} height={screenshot.height} loading="lazy" decoding="async" />
          </button>
          {app.screenshots.length > 1 && <div className="app-project__tabs" role="group" aria-label={`${app.name} ${language === "ar" ? "صور التطبيق" : "screenshots"}`}>
            {app.screenshots.map((shot, index) => <button key={shot.src} type="button" aria-pressed={active === index} className={active === index ? "is-active" : ""} onClick={() => setActive(index)}>{shot.label[language]}</button>)}
          </div>}
        </div>
        <dl className="app-project__features">
          {app.features.map((feature, index) => <div key={feature.title.en}><span className="feature-index" aria-hidden="true">0{index + 1}</span><div className="reading-text"><dt>{feature.title[language]}</dt><dd>{feature.body[language]}</dd></div></div>)}
        </dl>
      </div>
      {gallery !== null && <AppGallery app={app} language={language} initialIndex={gallery} onClose={() => setGallery(null)} />}
    </article>
  );
}
