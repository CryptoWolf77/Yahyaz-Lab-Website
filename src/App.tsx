import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FlaskConical,
  Gamepad2,
  Mail,
  MonitorSmartphone,
  Play,
  Sparkles,
  X,
} from "lucide-react";
import { Game, games, studio } from "./data/siteContent";
import { applications, type Language, type PortfolioPage } from "./data/appContent";
import AppShowcase from "./components/AppShowcase";
import PortfolioHeader from "./components/PortfolioHeader";
import { useModalFocus } from "./components/useModalFocus";

const HeroScene = lazy(() => import("./components/HeroScene"));

const translations = {
  en: {
    dir: "ltr",
    brandHome: "YahyazLab home",
    nav: {
      showreel: "Showreel",
      games: "Projects",
      studio: "About",
      contact: "Contact",
    },
    language: {
      label: "Language",
      en: "EN",
      ar: "عربي",
    },
    hero: {
      eyebrow: "Independent Game Developer",
      since: "Since",
      tagline: studio.tagline,
      viewGames: "Explore Projects",
      watchShowreel: "Watch Reel",
      signals: ["Action", "Puzzles", "Visual Worlds"],
    },
    showreel: {
      eyebrow: "Portfolio Reel",
      title: "A quick look at the motion, tone, and visual identity behind my game projects.",
      identity: "YahyazLab portfolio reel",
      whiteNinja: "White Ninja promo",
      puzzleZombie: "Puzzle VS Zombie promo",
    },
    games: {
      eyebrow: "Selected Projects",
      title: "Game projects shaped with action, puzzles, characters, and cinematic arcade energy.",
      explore: "Explore Game",
      storeSoon: "Store Links Soon",
      openStore: (gameTitle: string, storeName: string) => `Open ${gameTitle} on ${storeName}`,
      trailer: "trailer",
      details: "details",
      screenshots: "screenshots",
      showScreenshot: "Show",
      close: "Close details",
      previous: "Previous screenshot",
      next: "Next screenshot",
    },
    studio: {
      eyebrow: "About YahyazLab",
      title: "One maker. Two worlds.",
      since: "Since 2021",
      intro: studio.intro,
      metrics: [
        { value: "04", label: "projects, built with care" },
        { value: "02", label: "worlds to explore" },
        { value: "Solo", label: "independent developer" },
      ],
    },
    contact: {
      eyebrow: "Contact",
      title: "Interested in my work?",
      body: "For questions about YahyazLab projects, portfolio work, or future updates, you can contact me here.",
    },
    footer: {
      puzzlePrivacy: "Puzzle VS Zombie Privacy",
      whiteNinjaPrivacy: "White Ninja Privacy",
      backToTop: "Back to top",
    },
  },
  ar: {
    dir: "rtl",
    brandHome: "العودة إلى الصفحة الرئيسية لـ YahyazLab",
    nav: {
      showreel: "العرض",
      games: "المشاريع",
      studio: "عني",
      contact: "تواصل",
    },
    language: {
      label: "اللغة",
      en: "EN",
      ar: "عربي",
    },
    hero: {
      eyebrow: "مطور ألعاب مستقل",
      since: "منذ",
      tagline: "أصمّم تجارب ألعاب متقنة تجمع بين أسلوب لعب محكم، وطابع سينمائي، وهوية بصرية مميزة.",
      viewGames: "استكشف المشاريع",
      watchShowreel: "شاهد العرض",
      signals: ["أكشن", "ألغاز", "عوالم بصرية"],
    },
    showreel: {
      eyebrow: "عرض مختصر للأعمال",
      title: "لمحة سريعة عن الحركة، والإحساس العام، والهوية البصرية وراء مشاريعي في الألعاب.",
      identity: "عرض أعمال YahyazLab",
      whiteNinja: "عرض White Ninja",
      puzzleZombie: "عرض Puzzle VS Zombie",
    },
    games: {
      eyebrow: "مشاريعي",
      title: "مشاريع ألعاب تجمع بين الأكشن، والألغاز، والشخصيات، وطاقة الأركيد السينمائية.",
      explore: "استكشف اللعبة",
      storeSoon: "روابط المتاجر قريبًا",
      openStore: (gameTitle: string, storeName: string) => `فتح ${gameTitle} على ${storeName}`,
      trailer: "العرض التشويقي",
      details: "التفاصيل",
      screenshots: "لقطات الشاشة",
      showScreenshot: "عرض",
      close: "إغلاق التفاصيل",
      previous: "الصورة السابقة",
      next: "الصورة التالية",
    },
    studio: {
      eyebrow: "عن YahyazLab",
      title: "مطوّر واحد. عالمان.",
      since: "منذ 2021",
      intro:
        "YahyazLab مساحتي الشخصية لبناء تطبيقات مفيدة وألعاب ممتعة. أصمّم وأطوّر كل مشروع باهتمام بالتفاصيل، من الأدوات التي تسهّل يومك إلى العوالم التي تستمتع باستكشافها.",
      metrics: [
        { value: "04", label: "مشاريع بُنيت بعناية" },
        { value: "02", label: "عالمان للاستكشاف" },
        { value: "Solo", label: "مطوّر مستقل" },
      ],
    },
    contact: {
      eyebrow: "تواصل",
      title: "مهتم بأعمالي؟",
      body: "للاطلاع أو الاستفسار عن مشاريع YahyazLab، أو أعمالي المعروضة هنا، أو التحديثات القادمة، يمكنك التواصل معي من هنا.",
    },
    footer: {
      puzzlePrivacy: "خصوصية Puzzle VS Zombie",
      whiteNinjaPrivacy: "خصوصية White Ninja",
      backToTop: "العودة للأعلى",
    },
  },
} as const;

const gameTranslations: Record<Language, Record<string, Partial<Game>>> = {
  en: {},
  ar: {
    "white-ninja": {
      kicker: "لعبة منصات أكشن",
      description:
        "لعبة أكشن جانبية سريعة تتمحور حول قتال النينجا، والقفزات الدقيقة، وجمع العملات، وتجاوز المخاطر، ومواجهات الزعماء.",
      longDescription:
        "يتنقل White Ninja عبر الغابات والكهوف وغرف الحمم والمساحات المستقبلية بإيقاع مركز يجمع بين القفز، والهجوم، والجمع، والمراوغة. هذا أحد مشاريعي التي تركز على الأكشن، وصُمم حول ردود فعل سريعة وقتال آركيد واضح القراءة.",
      tags: ["موبايل", "أكشن", "منصات", "زعماء"],
      features: [
        "قتال سريع بتوقيت هجمات واضح",
        "عملات وفخاخ وأشواك وحمم ومخاطر متحركة",
        "بيئات متعددة لكل منها أجواء مختلفة",
        "أسلوب شخصيات كرتوني مع تحكم واضح مناسب للموبايل",
      ],
    },
    "puzzle-vs-zombie": {
      kicker: "ألغاز فيزيائية",
      description:
        "لعبة ألغاز بأجواء كرتونية مخيفة تدور حول قراءة كل مرحلة، وتفعيل الأدوات المناسبة، وجمع النجوم، والتخلص من تهديدات الزومبي.",
      longDescription:
        "تمزج Puzzle VS Zombie بين رسوم كرتونية مخيفة وتركيبات مراحل مستوحاة من الفيزياء. في كل مرحلة يحتاج اللاعب إلى فهم بنية المستوى، وتوقيت استخدام الأدوات، وجمع النجوم، وحل تحدي الزومبي بالحركة المناسبة.",
      tags: ["موبايل", "ألغاز", "فيزياء", "زومبي"],
      features: [
        "ألغاز كتل وفخاخ مستوحاة من الفيزياء",
        "قنابل ومناشير ونجوم وصناديق وتركيبات قابلة للتدمير",
        "عوالم كرتونية مخيفة بشخصيات جريئة وواضحة",
        "تحديات مرحلة بعد مرحلة مبنية على التوقيت الدقيق",
      ],
    },
  },
};

const localizeGame = (game: Game, language: Language): Game => ({
  ...game,
  ...gameTranslations[language][game.id],
});

const getInitialLanguage = (): Language => {
  if (typeof window === "undefined") return "en";
  const requested = new URLSearchParams(window.location.search).get("lang");
  if (requested === "ar" || requested === "en") return requested;
  try {
    const saved = window.localStorage.getItem("yahyaz-language");
    return saved === "ar" || saved === "en" ? saved : "en";
  } catch { return "en"; }
};

function VideoPanel({
  title,
  src,
  poster,
  featured = false,
}: {
  title: string;
  src: string;
  poster: string;
  featured?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const playRequested = useRef(false);
  const play = () => {
    playRequested.current = true;
    setLoaded(true);
    if (videoRef.current?.getAttribute("src")) videoRef.current.play().catch(() => undefined);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) video.pause();
    }, { threshold: 0.1 });
    const visibility = () => { if (document.hidden) video.pause(); };
    observer.observe(video);
    document.addEventListener("visibilitychange", visibility);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", visibility); };
  }, []);

  useEffect(() => {
    if (loaded && playRequested.current) videoRef.current?.play().catch(() => undefined);
  }, [loaded]);

  return (
    <figure className={featured ? "video-panel video-panel--featured" : "video-panel"}>
      <video
        ref={videoRef}
        src={loaded ? src : undefined}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        controls={loaded}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      {!playing && !loaded && <button className="video-play" type="button" onClick={play} aria-label={`Play ${title}`} title={`Play ${title}`}><Play size={24} fill="currentColor" /></button>}
      <figcaption hidden={loaded}>
        <span>
          <Play size={16} aria-hidden="true" />
          {title}
        </span>
      </figcaption>
    </figure>
  );
}

function GameModal({
  game,
  language,
  ui,
  onClose,
}: {
  game: Game;
  language: Language;
  ui: (typeof translations)[Language]["games"];
  onClose: () => void;
}) {
  const [index, setIndex] = useState(0);
  const activeImage = game.screenshots[index];
  const modalRef = useModalFocus(onClose);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") setIndex((current) => (current + 1) % game.screenshots.length);
      if (event.key === "ArrowLeft") {
        setIndex((current) => (current - 1 + game.screenshots.length) % game.screenshots.length);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [game.screenshots.length, onClose]);

  return (
    <div className="modal-shell" ref={modalRef} role="dialog" aria-modal="true" aria-label={`${game.title} ${ui.details}`}>
      <div className="modal-backdrop" aria-hidden="true" onClick={onClose} />
      <article className="modal game-modal">
        <header className="game-modal__toolbar">
          <span className="game-modal__label">{game.title}</span>
          <div className="modal__controls" aria-label={`${game.title} ${ui.screenshots}`}>
            <button
              className="icon-button"
              type="button"
              onClick={() => setIndex((current) => (current - 1 + game.screenshots.length) % game.screenshots.length)}
              aria-label={ui.previous}
            >
              <ChevronLeft size={20} />
            </button>
            <span>{index + 1} / {game.screenshots.length}</span>
            <button
              className="icon-button"
              type="button"
              onClick={() => setIndex((current) => (current + 1) % game.screenshots.length)}
              aria-label={ui.next}
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <button className="icon-button modal__close" type="button" onClick={onClose} aria-label={ui.close}>
            <X size={20} />
          </button>
        </header>
        <div className="game-modal__body">
        <div className="modal__media">
          <img src={activeImage} alt={`${game.title} ${ui.screenshots} ${index + 1}`} width="1280" height="720" decoding="async" />
        </div>
        <div className="modal__content">
          <p className="eyebrow">{game.kicker}</p>
          <h2>{game.title}</h2>
          <p>{game.longDescription}</p>
          <div className="tag-row">
            {game.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <ul className="feature-list">
            {game.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
          <div className="store-row">
            {game.stores.map((store) =>
              store.href ? (
                <a
                  className="store-button"
                  href={store.href}
                  key={store.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={ui.openStore(game.title, store.label)}
                >
                  {store.label}
                </a>
              ) : (
                <button className="store-button" key={store.label} disabled type="button">
                  {store.label}
                </button>
              ),
            )}
          </div>
        </div>
        </div>
      </article>
    </div>
  );
}

function GameShowcase({
  game,
  reverse = false,
  ui,
  onOpen,
}: {
  game: Game;
  reverse?: boolean;
  ui: (typeof translations)[Language]["games"];
  onOpen: () => void;
}) {
  const [activeShot, setActiveShot] = useState(0);
  const gallery = useMemo(() => game.screenshots.slice(0, 5), [game.screenshots]);
  const availableStores = game.stores.filter((store) => store.href);

  return (
    <article className={reverse ? "game-showcase game-showcase--reverse" : "game-showcase"}>
      <div className="game-showcase__media">
        <div className="game-stage">
          <img
            className="game-stage__main"
            src={gallery[activeShot]}
            alt={`${game.title} gameplay`}
            loading="lazy"
            decoding="async"
            width="1280"
            height="720"
          />
          {game.icon ? (
            <img className="game-stage__icon" src={game.icon} alt="" loading="lazy" decoding="async" />
          ) : null}
          <div className="game-stage__shine" />
        </div>
        <div className="thumb-row" aria-label={`${game.title} ${ui.screenshots}`}>
          {gallery.map((image, index) => (
            <button
              key={image}
              className={index === activeShot ? "thumb thumb--active" : "thumb"}
              type="button"
              onClick={() => setActiveShot(index)}
              aria-label={`${ui.showScreenshot} ${game.title} ${ui.screenshots} ${index + 1}`}
              aria-pressed={index === activeShot}
            >
              <img src={image} alt="" loading="lazy" decoding="async" />
            </button>
          ))}
        </div>
      </div>

      <div className="game-showcase__content">
        <p className="eyebrow">{game.kicker}</p>
        <h3>{game.title}</h3>
        <p>{game.description}</p>
        <div className="tag-row">
          {game.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <VideoPanel title={`${game.title} ${ui.trailer}`} src={game.trailer} poster={game.poster} />
        <div className="action-row">
          <button className="button button--primary" type="button" onClick={onOpen}>
            <Gamepad2 size={18} />
            {ui.explore}
          </button>
          {availableStores.length > 0 ? (
            availableStores.map((store) => (
              <a
                className="button button--ghost"
                href={store.href}
                key={store.label}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={ui.openStore(game.title, store.label)}
              >
                <ExternalLink size={18} />
                {store.label}
              </a>
            ))
          ) : (
            <button className="button button--ghost" type="button" disabled>
              <ExternalLink size={18} />
              {ui.storeSoon}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function App({ page = "home", initialLanguage }: { page?: PortfolioPage; initialLanguage?: Language }) {
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [language, setLanguage] = useState<Language>(() => initialLanguage ?? getInitialLanguage());
  const copy = translations[language];
  const localizedGames = useMemo(() => games.map((game) => localizeGame(game, language)), [language]);
  const isArabic = language === "ar";

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = "ltr";
    try { window.localStorage.setItem("yahyaz-language", language); } catch { /* Private browsing may disable storage. */ }
    const url = new URL(window.location.href);
    if (url.searchParams.has("lang")) {
      url.searchParams.set("lang", language);
      window.history.replaceState(window.history.state, "", url);
    }
  }, [language, isArabic]);

  useEffect(() => { setActiveGame(null); }, [page]);

  useEffect(() => {
    const title = page === "home" ? "YahyazLab | Apps & Games by an Independent Developer" : page === "apps" ? "Apps I Build | YahyazLab" : "Games I Build | YahyazLab";
    const description = page === "home" ? "I build useful applications and engaging games at YahyazLab. Explore ApexLoad, QuranHaven, White Ninja and Puzzle VS Zombie." : page === "apps" ? "Explore ApexLoad and QuranHaven: thoughtfully built applications for everyday use, independently developed at YahyazLab." : "Explore White Ninja and Puzzle VS Zombie: mobile game projects, screenshots, trailers and store links by YahyazLab.";
    const canonical = `https://yahyazlab.com${page === "home" ? "/" : `/${page}`}`;
    document.title = title;
    const setMeta = (key: string, value: string, property = false) => {
      const attribute = property ? "property" : "name";
      let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
      if (!element) { element = document.createElement("meta"); element.setAttribute(attribute, key); document.head.append(element); }
      element.content = value;
    };
    setMeta("description", description);
    setMeta("og:title", title, true);
    setMeta("og:description", description, true);
    setMeta("og:type", "website", true);
    setMeta("og:url", canonical, true);
    setMeta("og:image", "https://yahyazlab.com/assets/brand/logo-square.webp", true);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setMeta("twitter:image", "https://yahyazlab.com/assets/brand/logo-square.webp");
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) { link = document.createElement("link"); link.rel = "canonical"; document.head.append(link); }
    link.href = canonical;
  }, [page]);

  const exploreApps = isArabic ? "استكشف التطبيقات" : "Explore Apps";
  const exploreGames = isArabic ? "استكشف الألعاب" : "Explore Games";

  return (
    <div className={`app-shell app-shell--${page}${isArabic ? " app-shell--rtl" : ""}`}>
      <a className="skip-link" href="#main-content">{isArabic ? "انتقل إلى المحتوى" : "Skip to content"}</a>
      <PortfolioHeader page={page} language={language} setLanguage={setLanguage} />
      <main id="main-content">
        {page === "home" && <>
          <section className="hero section-band" id="top" aria-labelledby="page-title">
            <Suspense fallback={<div className="hero-scene hero-scene--loading" aria-hidden="true" />}><HeroScene /></Suspense>
            <div className="hero__content">
              <p className="eyebrow"><FlaskConical size={16} aria-hidden="true" />{isArabic ? "مطوّر تطبيقات وألعاب مستقل" : "Independent Apps & Games Developer"}</p>
              <h1 id="page-title" tabIndex={-1} className="sr-only">YahyazLab</h1>
              <div className="hero-logo-wrap" aria-hidden="true"><img className="hero-logo" src={studio.logoTransparent} alt="" loading="eager" decoding="async" fetchPriority="high" /></div>
              <div className="since-badge" aria-label={`${copy.hero.since} 2021`}><span>{copy.hero.since}</span><strong>2021</strong></div>
              <p className="hero__tagline">{isArabic ? "أصمّم تطبيقات مفيدة وتجارب ألعاب متقنة تجمع بين الاهتمام بالتفاصيل وهوية بصرية مميزة." : "I create useful apps and polished game experiences with thoughtful details and a distinct visual identity."}</p>
              <div className="hero__actions">
                <a className="button button--primary" href="/apps" data-site-link><MonitorSmartphone size={18} aria-hidden="true" />{exploreApps}</a>
                <a className="button button--primary" href="/games" data-site-link><Gamepad2 size={18} aria-hidden="true" />{exploreGames}</a>
                <a className="button button--secondary" href="/games#showreel" data-site-link><Play size={18} aria-hidden="true" />{copy.hero.watchShowreel}</a>
              </div>
            </div>
            <div className="hero__signal" aria-hidden="true">{(isArabic ? ["تطبيقات", "أكشن", "ألغاز"] : ["Apps", "Action", "Puzzles"]).map((signal) => <span key={signal}>{signal}</span>)}</div>
          </section>

          <section className="world-gateways" id="worlds">
              <div className="section-heading gateway-heading content-width"><p className="eyebrow">{isArabic ? "أعمال مختارة" : "Selected work"}</p><h2 className="reading-text">{isArabic ? "عالمان. اهتمام واحد بالتفاصيل." : "Two worlds. One eye for detail."}</h2></div>
              <a className="world-gateway world-gateway--apps" href="/apps" data-site-link>
                <div className="world-gateway__inner content-width">
                <div className="world-gateway__copy"><span className="gateway-category"><span className="gateway-number">01</span><MonitorSmartphone size={21} /><span>{isArabic ? "تطوير التطبيقات" : "Apps development"}</span></span><h3 className="reading-text">{isArabic ? <>أدوات لحياة<br className="gateway-heading-break" /> أبسط.</> : <>A little more<br />useful.</>}</h3><p className="reading-text">{isArabic ? "تطبيقات مدروسة لأشياء تهمك كل يوم." : "Thoughtful applications for the things that matter in your everyday."}</p><div className="gateway-projects" dir="ltr"><img src={applications[0].icon} alt="" width="32" height="32" loading="lazy" /><span>ApexLoad</span><span className="gateway-divider">/</span><img src={applications[1].icon} alt="" width="32" height="32" loading="lazy" /><span>QuranHaven</span></div><span className="gateway-link">{exploreApps}<ArrowRight size={23} /></span></div>
                <div className="gateway-app-art" aria-hidden="true" dir="ltr"><img className="gateway-app-art__desktop" src="/assets/apps/quranhaven/desktop.webp" alt="" width="1440" height="1000" loading="lazy" decoding="async" /><img className="gateway-app-art__overview" src={applications[0].screenshots[0].src} alt="" width={applications[0].screenshots[0].width} height={applications[0].screenshots[0].height} loading="lazy" decoding="async" /></div>
                </div>
              </a>
              <a className="world-gateway world-gateway--games" href="/games" data-site-link>
                <div className="world-gateway__inner content-width">
                <div className="world-gateway__copy"><span className="gateway-category"><span className="gateway-number">02</span><Gamepad2 size={22} /><span>{isArabic ? "تطوير الألعاب" : "Games development"}</span></span><h3 className="reading-text">{isArabic ? <>مساحة لمزيد<br className="gateway-heading-break" /> من اللعب.</> : <>A little more<br />adventure.</>}</h3><p className="reading-text">{isArabic ? "تحديات سريعة، وألغاز ذكية، وعوالم تستحق الاستكشاف." : "Quick reactions, clever puzzles, and worlds worth getting lost in."}</p><div className="gateway-projects" dir="ltr"><span>White Ninja</span><span className="gateway-divider">/</span><span>Puzzle VS Zombie</span></div><span className="gateway-link">{exploreGames}<ArrowRight size={23} /></span></div>
                <div className="gateway-game-art" aria-hidden="true" dir="ltr"><img src={games[0].featured} alt="" width="1280" height="720" loading="lazy" decoding="async" /><img src={games[1].screenshots[0]} alt="" width="1920" height="1080" loading="lazy" decoding="async" /></div>
                </div>
              </a>
          </section>
          <section id="studio" className="studio section-band">
            <div className="content-width studio__inner"><div className="studio__visual"><img src={studio.logoTransparent} alt="YahyazLab logo" width="600" height="380" loading="lazy" decoding="async" /><span className="studio__since">{copy.studio.since}</span></div><div className="studio__content"><p className="eyebrow"><FlaskConical size={16} />{copy.studio.eyebrow}</p><h2 className="reading-text">{copy.studio.title}</h2><p>{copy.studio.intro}</p><div className="studio-metrics">{copy.studio.metrics.map((metric) => <span key={metric.label}><strong>{metric.value}</strong>{metric.label}</span>)}</div></div></div>
          </section>
          <section id="contact" className="contact section-band"><div className="content-width contact__inner"><div><p className="eyebrow"><Mail size={18} />{copy.contact.eyebrow}</p><h2>{copy.contact.title}</h2><p>{copy.contact.body}</p></div><a className="button button--primary" href="mailto:admin@yahyazlab.com"><Mail size={20} /><bdi>admin@yahyazlab.com</bdi><ArrowRight size={20} /></a></div></section>
        </>}

        {page === "apps" && <>
          <section className="page-intro page-intro--apps" id="top"><div className="page-intro__inner content-width"><div><p className="eyebrow"><MonitorSmartphone size={21} />{isArabic ? "01 / عالم التطبيقات" : "01 / The apps world"}</p><h1 id="page-title" tabIndex={-1} className="reading-text">{isArabic ? "تطبيقات أبنيها" : "Apps I Build"}<span className="brand-period">.</span></h1><p className="reading-text">{isArabic ? "تطبيقات مدروسة للاستخدام اليومي." : "Thoughtfully built applications for everyday use."}</p></div><div className="page-intro__index"><a href="#apexload"><img src={applications[0].icon} alt="" width="36" height="36" /><bdi>ApexLoad</bdi><ArrowRight size={19} /></a><a href="#quranhaven"><img src={applications[1].icon} alt="" width="36" height="36" /><bdi>QuranHaven</bdi><ArrowRight size={19} /></a></div></div></section>
          {applications.map((app) => <AppShowcase key={app.id} app={app} language={language} />)}
          <section className="category-crosslink content-width"><span className="reading-text">{isArabic ? "من الأدوات اليومية إلى العوالم التفاعلية." : "From everyday tools to interactive worlds."}</span><a href="/games" data-site-link>{exploreGames}<Gamepad2 size={20} /><ArrowRight size={19} /></a></section>
        </>}

        {page === "games" && <>
          <section className="page-intro page-intro--games" id="top"><div className="page-intro__inner content-width"><div><p className="eyebrow"><Gamepad2 size={22} />{isArabic ? "02 / عالم الألعاب" : "02 / The games world"}</p><h1 id="page-title" tabIndex={-1} className="reading-text">{isArabic ? "ألعاب أبنيها" : "Games I Build"}<span className="brand-period">.</span></h1><p className="reading-text">{isArabic ? "تحديات ممتعة. شخصيات لا تُنسى. عوالم من خيالي." : "Playful challenges. Memorable characters. Worlds of my own."}</p></div><a href="#showreel" className="button button--secondary"><Play size={20} />{copy.hero.watchShowreel}</a></div></section>
        <section id="games" className="games section-band">
          <div className="content-width">
          <div className="section-heading games-heading"><p className="eyebrow"><Gamepad2 size={16} />{copy.games.eyebrow}</p><h2>{copy.games.title}</h2></div>
          {localizedGames.map((game, index) => <GameShowcase key={game.id} game={game} reverse={index % 2 === 1} ui={copy.games} onOpen={() => setActiveGame(game)} />)}
          </div>
        </section>
        <section id="showreel" className="showreel section-band"><div className="content-width">
          <div className="section-heading section-heading--center">
            <p className="eyebrow">
              <Sparkles size={16} />
              {copy.showreel.eyebrow}
            </p>
            <h2>{copy.showreel.title}</h2>
          </div>
          <div className="showreel-grid">
            <VideoPanel title={copy.showreel.identity} src={studio.showreel} poster={studio.logoSquare} featured />
            <VideoPanel title={copy.showreel.whiteNinja} src={localizedGames[0].trailer} poster={localizedGames[0].poster} />
            <VideoPanel title={copy.showreel.puzzleZombie} src={localizedGames[1].trailer} poster={localizedGames[1].poster} />
          </div>
        </div></section>
        <section className="category-crosslink content-width"><span className="reading-text">{isArabic ? "ويوجد عالم آخر للاستكشاف." : "There’s another side to the lab."}</span><a href="/apps" data-site-link>{exploreApps}<MonitorSmartphone size={20} /><ArrowRight size={19} /></a></section>
        </>}
      </main>

      <footer className="site-footer">
        <div className="site-footer__inner content-width"><a className="brand-mark" href="/" data-site-link><img src={studio.logoTransparent} alt="" width="42" height="32" loading="lazy" decoding="async" /><span>YahyazLab</span></a><a className="footer-email" href="mailto:admin@yahyazlab.com">admin@yahyazlab.com</a><div className="footer-policies"><a href="/privacy/white-ninja" data-privacy-link>{copy.footer.whiteNinjaPrivacy}</a><a href="/privacy/puzzle-vs-zombie" data-privacy-link>{copy.footer.puzzlePrivacy}</a></div><a className="footer-top" href="#top">{copy.footer.backToTop}<ArrowRight size={14} /></a></div>
      </footer>

      {activeGame ? (
        <GameModal game={activeGame} language={language} ui={copy.games} onClose={() => setActiveGame(null)} />
      ) : null}
    </div>
  );
}

export default App;
