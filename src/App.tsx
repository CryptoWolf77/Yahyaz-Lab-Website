import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FlaskConical,
  Gamepad2,
  Mail,
  Play,
  Sparkles,
  X,
} from "lucide-react";
import { Game, games, studio } from "./data/siteContent";

const HeroScene = lazy(() => import("./components/HeroScene"));

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

function GameModal({ game, onClose }: { game: Game; onClose: () => void }) {
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
    <div className="modal-shell" role="dialog" aria-modal="true" aria-label={`${game.title} details`}>
      <button className="modal-backdrop" type="button" aria-label="Close details" onClick={onClose} />
      <article className="modal">
        <button className="icon-button modal__close" type="button" onClick={onClose} aria-label="Close details">
          <X size={20} />
        </button>
        <div className="modal__media">
          <img src={activeImage} alt={`${game.title} screenshot ${index + 1}`} />
          <div className="modal__controls" aria-label="Gallery controls">
            <button
              className="icon-button"
              type="button"
              onClick={() => setIndex((current) => (current - 1 + game.screenshots.length) % game.screenshots.length)}
              aria-label="Previous screenshot"
            >
              <ChevronLeft size={20} />
            </button>
            <span>{index + 1} / {game.screenshots.length}</span>
            <button
              className="icon-button"
              type="button"
              onClick={() => setIndex((current) => (current + 1) % game.screenshots.length)}
              aria-label="Next screenshot"
            >
              <ChevronRight size={20} />
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
            {game.stores.map((store) => (
              <button className="store-button" key={store.label} disabled={!store.href} type="button">
                {store.label}
              </button>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}

function GameShowcase({ game, reverse = false, onOpen }: { game: Game; reverse?: boolean; onOpen: () => void }) {
  const [activeShot, setActiveShot] = useState(0);
  const gallery = useMemo(() => game.screenshots.slice(0, 5), [game.screenshots]);

  return (
    <article className={reverse ? "game-showcase game-showcase--reverse" : "game-showcase"}>
      <div className="game-showcase__media">
        <div className="game-stage">
          <img className="game-stage__main" src={gallery[activeShot]} alt={`${game.title} gameplay`} loading="lazy" />
          {game.icon ? <img className="game-stage__icon" src={game.icon} alt="" loading="lazy" /> : null}
          <div className="game-stage__shine" />
        </div>
        <div className="thumb-row" aria-label={`${game.title} screenshots`}>
          {gallery.map((image, index) => (
            <button
              key={image}
              className={index === activeShot ? "thumb thumb--active" : "thumb"}
              type="button"
              onClick={() => setActiveShot(index)}
              aria-label={`Show ${game.title} screenshot ${index + 1}`}
            >
              <img src={image} alt="" loading="lazy" />
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
        <VideoPanel title={`${game.title} trailer`} src={game.trailer} poster={game.poster} />
        <div className="action-row">
          <button className="button button--primary" type="button" onClick={onOpen}>
            <Gamepad2 size={18} />
            Explore Game
          </button>
          <button className="button button--ghost" type="button" disabled>
            <ExternalLink size={18} />
            Store Links Soon
          </button>
        </div>
      </div>
    </article>
  );
}

function App() {
  const [activeGame, setActiveGame] = useState<Game | null>(null);

  return (
    <>
      <header className="site-header">
        <a href="#top" className="brand-mark" aria-label="Yahyaz Lab home">
          <img src={studio.logoTransparent} alt="" />
          <span>Yahyaz Lab</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#showreel">Showreel</a>
          <a href="#games">Games</a>
          <a href="#studio">Studio</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero section-band">
          <Suspense fallback={<div className="hero-scene hero-scene--loading" aria-hidden="true" />}>
            <HeroScene />
          </Suspense>
          <div className="hero__content">
            <p className="eyebrow">
              <FlaskConical size={16} />
              Individual Game Studio
            </p>
            <h1 className="sr-only">Yahyaz Lab</h1>
            <div className="hero-logo-wrap" aria-hidden="true">
              <img className="hero-logo" src={studio.logoTransparent} alt="" />
            </div>
            <p className="hero__tagline">{studio.tagline}</p>
            <div className="hero__actions">
              <a className="button button--primary" href="#games">
                <Gamepad2 size={18} />
                View Games
              </a>
              <a className="button button--secondary" href="#showreel">
                <Play size={18} />
                Watch Showreel
              </a>
            </div>
          </div>
          <div className="hero__signal" aria-hidden="true">
            <span>Action</span>
            <span>Puzzles</span>
            <span>Mobile Worlds</span>
          </div>
        </section>

        <section id="showreel" className="showreel section-band">
          <div className="section-heading">
            <p className="eyebrow">
              <Sparkles size={16} />
              Studio Reel
            </p>
            <h2>Gameplay first, logo loud, motion everywhere.</h2>
          </div>
          <div className="showreel-grid">
            <VideoPanel title="Yahyaz Lab identity reel" src={studio.showreel} poster={studio.logoSquare} featured />
            <VideoPanel title="White Ninja promo" src={games[0].trailer} poster={games[0].poster} />
            <VideoPanel title="Puzzle VS Zombie promo" src={games[1].trailer} poster={games[1].poster} />
          </div>
        </section>

        <section id="games" className="games section-band">
          <div className="section-heading section-heading--center">
            <p className="eyebrow">
              <Gamepad2 size={16} />
              Released Worlds
            </p>
            <h2>Two different games, one playful lab identity.</h2>
          </div>
          {games.map((game, index) => (
            <GameShowcase
              key={game.id}
              game={game}
              reverse={index % 2 === 1}
              onOpen={() => setActiveGame(game)}
            />
          ))}
        </section>

        <section id="studio" className="studio section-band">
          <div className="studio__visual">
            <img src={studio.logoTransparent} alt="Yahyaz Lab logo" loading="lazy" />
          </div>
          <div className="studio__content">
            <p className="eyebrow">
              <FlaskConical size={16} />
              Built by Yahya
            </p>
            <h2>A small studio identity with big game energy.</h2>
            <p>{studio.intro}</p>
            <div className="studio-metrics">
              <span><strong>2</strong> showcased games</span>
              <span><strong>3D</strong> portfolio feel</span>
              <span><strong>Solo</strong> studio voice</span>
            </div>
          </div>
        </section>

        <section id="contact" className="contact section-band">
          <p className="eyebrow">
            <Mail size={16} />
            Contact
          </p>
          <h2>Let’s build, publish, or collaborate.</h2>
          <p>Store, email, and social links can be connected when you are ready to publish the portfolio.</p>
          <a className="button button--primary" href="mailto:hello@yahyazlab.example">
            <Mail size={18} />
            Contact Yahyaz Lab
            <ArrowRight size={18} />
          </a>
        </section>
      </main>

      <footer className="site-footer">
        <img src={studio.logoTransparent} alt="" />
        <span>Yahyaz Lab</span>
        <a href="#top">Back to top</a>
      </footer>

      {activeGame ? <GameModal game={activeGame} onClose={() => setActiveGame(null)} /> : null}
    </>
  );
}

export default App;
