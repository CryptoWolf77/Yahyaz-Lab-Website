import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FlaskConical,
  Gamepad2,
  Languages,
  Mail,
  Play,
  Sparkles,
  X,
} from "lucide-react";
import { Game, games, studio } from "./data/siteContent";

const HeroScene = lazy(() => import("./components/HeroScene"));

type Language = "en" | "ar";

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
      title: "A personal portfolio for game projects with bold visual identity.",
      since: "Since 2021",
      intro: studio.intro,
      metrics: [
        { value: "2", label: "featured projects" },
        { value: "3D", label: "cinematic presentation" },
        { value: "Solo", label: "personal creative direction" },
      ],
    },
    contact: {
      eyebrow: "Contact",
      title: "Interested in my work?",
      body: "For questions about YahyazLab projects, portfolio work, or future updates, you can contact me here.",
    },
    footer: {
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
      title: "ملف شخصي لمشاريع ألعاب بهوية بصرية جريئة.",
      since: "منذ 2021",
      intro:
        "YahyazLab هو مساحتي الشخصية لعرض مشاريع الألعاب، والتجارب البصرية، والعوالم التفاعلية التي تُبنى حول آليات لعب واضحة، وشخصيات راسخة في الذاكرة، وإحساس آركيد سينمائي.",
      metrics: [
        { value: "2", label: "مشاريع مميزة" },
        { value: "3D", label: "تقديم سينمائي ثلاثي الأبعاد" },
        { value: "Solo", label: "توجّه إبداعي شخصي" },
      ],
    },
    contact: {
      eyebrow: "تواصل",
      title: "مهتم بأعمالي؟",
      body: "للاطلاع أو الاستفسار عن مشاريع YahyazLab، أو أعمالي المعروضة هنا، أو التحديثات القادمة، يمكنك التواصل معي من هنا.",
    },
    footer: {
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
  const saved = window.localStorage.getItem("yahyaz-language");
  return saved === "ar" || saved === "en" ? saved : "en";
};

function useActiveVideo(enabled = true) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !enabled) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { threshold: 0.45 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [enabled]);

  return videoRef;
}

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
  const videoRef = useActiveVideo(featured);

  const play = () => videoRef.current?.play().catch(() => undefined);
  const pause = () => {
    if (!featured) videoRef.current?.pause();
  };

  return (
    <figure className={featured ? "video-panel video-panel--featured" : "video-panel"}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        onMouseEnter={play}
        onMouseLeave={pause}
      />
      <figcaption>
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
    <div className="modal-shell" role="dialog" aria-modal="true" aria-label={`${game.title} ${ui.details}`}>
      <button className="modal-backdrop" type="button" aria-label={ui.close} onClick={onClose} />
      <article className="modal">
        <button className="icon-button modal__close" type="button" onClick={onClose} aria-label={ui.close}>
          <X size={20} />
        </button>
        <div className="modal__media">
          <img src={activeImage} alt={`${game.title} ${ui.screenshots} ${index + 1}`} />
          <div className="modal__controls" aria-label={`${game.title} ${ui.screenshots}`}>
            <button
              className="icon-button"
              type="button"
              onClick={() => setIndex((current) => (current - 1 + game.screenshots.length) % game.screenshots.length)}
              aria-label={ui.previous}
            >
              {language === "ar" ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
            <span>{index + 1} / {game.screenshots.length}</span>
            <button
              className="icon-button"
              type="button"
              onClick={() => setIndex((current) => (current + 1) % game.screenshots.length)}
              aria-label={ui.next}
            >
              {language === "ar" ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          </div>
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
  const appStore = game.stores.find((store) => store.label === "App Store");

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
          {appStore?.href ? (
            <a
              className="button button--ghost"
              href={appStore.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={ui.openStore(game.title, appStore.label)}
            >
              <ExternalLink size={18} />
              {appStore.label}
            </a>
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

function App() {
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const copy = translations[language];
  const localizedGames = useMemo(() => games.map((game) => localizeGame(game, language)), [language]);
  const isArabic = language === "ar";

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = "ltr";
    window.localStorage.setItem("yahyaz-language", language);
  }, [language]);

  return (
    <div className={isArabic ? "app-shell app-shell--rtl" : "app-shell"}>
      <header className="site-header">
        <a href="#top" className="brand-mark" aria-label={copy.brandHome}>
          <img src={studio.logoTransparent} alt="" loading="eager" decoding="async" />
          <span>YahyazLab</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#showreel">{copy.nav.showreel}</a>
          <a href="#games">{copy.nav.games}</a>
          <a href="#studio">{copy.nav.studio}</a>
          <a href="#contact">{copy.nav.contact}</a>
        </nav>
        <div className="language-switcher" role="group" aria-label={copy.language.label}>
          <Languages size={16} aria-hidden="true" />
          <button
            className={language === "en" ? "language-switcher__option language-switcher__option--active" : "language-switcher__option"}
            type="button"
            onClick={() => setLanguage("en")}
            aria-pressed={language === "en"}
          >
            {copy.language.en}
          </button>
          <button
            className={language === "ar" ? "language-switcher__option language-switcher__option--active" : "language-switcher__option"}
            type="button"
            onClick={() => setLanguage("ar")}
            aria-pressed={language === "ar"}
          >
            {copy.language.ar}
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero section-band">
          <Suspense fallback={<div className="hero-scene hero-scene--loading" aria-hidden="true" />}>
            <HeroScene />
          </Suspense>
          <div className="hero__content">
            <p className="eyebrow">
              <FlaskConical size={16} />
              {copy.hero.eyebrow}
            </p>
            <h1 className="sr-only">YahyazLab</h1>
            <div className="hero-logo-wrap" aria-hidden="true">
              <img
                className="hero-logo"
                src={studio.logoTransparent}
                alt=""
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            </div>
            <div className="since-badge" aria-label={`${copy.hero.since} 2021`}>
              <span>{copy.hero.since}</span>
              <strong>2021</strong>
            </div>
            <p className="hero__tagline">{copy.hero.tagline}</p>
            <div className="hero__actions">
              <a className="button button--primary" href="#games">
                <Gamepad2 size={18} />
                {copy.hero.viewGames}
              </a>
              <a className="button button--secondary" href="#showreel">
                <Play size={18} />
                {copy.hero.watchShowreel}
              </a>
            </div>
          </div>
          <div className="hero__signal" aria-hidden="true">
            {copy.hero.signals.map((signal) => (
              <span key={signal}>{signal}</span>
            ))}
          </div>
        </section>

        <section id="showreel" className="showreel section-band">
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
        </section>

        <section id="games" className="games section-band">
          <div className="section-heading section-heading--center">
            <p className="eyebrow">
              <Gamepad2 size={16} />
              {copy.games.eyebrow}
            </p>
            <h2>{copy.games.title}</h2>
          </div>
          {localizedGames.map((game, index) => (
            <GameShowcase
              key={game.id}
              game={game}
              reverse={index % 2 === 1}
              ui={copy.games}
              onOpen={() => setActiveGame(game)}
            />
          ))}
        </section>

        <section id="studio" className="studio section-band">
          <div className="studio__visual">
            <img src={studio.logoTransparent} alt="YahyazLab logo" loading="lazy" decoding="async" />
          </div>
          <div className="studio__content">
            <p className="eyebrow">
              <FlaskConical size={16} />
              {copy.studio.eyebrow}
            </p>
            <h2>{copy.studio.title}</h2>
            <div className="studio__since">{copy.studio.since}</div>
            <p>{copy.studio.intro}</p>
            <div className="studio-metrics">
              {copy.studio.metrics.map((metric) => (
                <span key={metric.label}><strong>{metric.value}</strong> {metric.label}</span>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="contact section-band">
          <p className="eyebrow">
            <Mail size={16} />
            {copy.contact.eyebrow}
          </p>
          <h2>{copy.contact.title}</h2>
          <p>{copy.contact.body}</p>
          <a className="button button--primary" href="mailto:admin@yahyazlab.com">
            <Mail size={18} />
            admin@yahyazlab.com
            <ArrowRight size={18} />
          </a>
        </section>
      </main>

      <footer className="site-footer">
        <img src={studio.logoTransparent} alt="" loading="lazy" decoding="async" />
        <span>YahyazLab</span>
        <a href="#top">{copy.footer.backToTop}</a>
      </footer>

      {activeGame ? (
        <GameModal game={activeGame} language={language} ui={copy.games} onClose={() => setActiveGame(null)} />
      ) : null}
    </div>
  );
}

export default App;
