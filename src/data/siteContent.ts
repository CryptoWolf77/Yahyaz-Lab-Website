export type Game = {
  id: string;
  title: string;
  kicker: string;
  description: string;
  longDescription: string;
  theme: "ninja" | "zombie";
  icon?: string;
  featured: string;
  trailer: string;
  poster: string;
  screenshots: string[];
  tags: string[];
  features: string[];
  stores: {
    label: string;
    href?: string;
  }[];
};

const asset = (path: string) => `/assets/${path}`;

export const studio = {
  name: "YahyazLab",
  tagline: "I create polished game experiences with sharp gameplay, cinematic presentation, and a distinct visual identity.",
  intro:
    "YahyazLab is my personal space for presenting game projects, visual experiments, and interactive worlds shaped around clear mechanics, memorable characters, and a cinematic arcade feel.",
  logoTransparent: asset("brand/logo-transparent.webp"),
  logoSquare: asset("brand/logo-square.webp"),
  showreel: asset("videos/yahyaz-blackbg.mp4"),
};

export const games: Game[] = [
  {
    id: "white-ninja",
    title: "White Ninja",
    kicker: "Action platformer",
    description:
      "A fast side-scrolling action game built around ninja combat, sharp jumps, collectible coins, hazards, and boss encounters.",
    longDescription:
      "White Ninja moves through forests, caves, lava chambers, and sci-fi rooms with a focused rhythm of jumping, attacking, collecting, and dodging. It is one of my action-focused projects, designed around quick reactions and readable arcade combat.",
    theme: "ninja",
    icon: asset("white-ninja/icon.webp"),
    featured: asset("white-ninja/screen-2.webp"),
    trailer: asset("videos/white-ninja-promo.mp4"),
    poster: asset("white-ninja/screen-2.webp"),
    screenshots: [
      asset("white-ninja/screen-1.webp"),
      asset("white-ninja/screen-2.webp"),
      asset("white-ninja/screen-3.webp"),
      asset("white-ninja/screen-4.webp"),
      asset("white-ninja/screen-5.webp"),
      asset("white-ninja/screen-6.webp"),
      asset("white-ninja/screen-7.webp"),
    ],
    tags: ["Mobile", "Action", "Platformer", "Boss fights"],
    features: [
      "Fast combat with clear attack timing",
      "Coins, traps, spikes, lava, and moving hazards",
      "Multiple environments with distinct moods",
      "Cartoon character style with readable mobile controls",
    ],
    stores: [
      { label: "Google Play" },
      {
        label: "App Store",
        href: "https://apps.apple.com/gb/app/white-ninja-arcade-adventure/id1559261331",
      },
    ],
  },
  {
    id: "puzzle-vs-zombie",
    title: "Puzzle VS Zombie",
    kicker: "Physics puzzle",
    description:
      "A spooky puzzle game about reading each level, triggering the right tools, collecting stars, and clearing zombie threats.",
    longDescription:
      "Puzzle VS Zombie combines spooky cartoon visuals with physics-inspired level setups. Each stage asks the player to understand the structure, time the tools, collect stars, and solve the zombie challenge with the right move.",
    theme: "zombie",
    featured: asset("puzzle-vs-zombie/featured.webp"),
    trailer: asset("videos/puzzle-vs-zombie-promo.mp4"),
    poster: asset("puzzle-vs-zombie/featured.webp"),
    screenshots: [
      asset("puzzle-vs-zombie/screen-1.webp"),
      asset("puzzle-vs-zombie/screen-2.webp"),
      asset("puzzle-vs-zombie/screen-3.webp"),
      asset("puzzle-vs-zombie/screen-4.webp"),
      asset("puzzle-vs-zombie/screen-5.webp"),
      asset("puzzle-vs-zombie/screen-6.webp"),
      asset("puzzle-vs-zombie/feature-graphics.webp"),
    ],
    tags: ["Mobile", "Puzzle", "Physics", "Zombies"],
    features: [
      "Physics-inspired block and trap puzzles",
      "Bombs, saws, stars, crates, and destructible setups",
      "Spooky cartoon worlds with bold character designs",
      "Level-by-level challenges built for careful timing",
    ],
    stores: [
      { label: "Google Play" },
      {
        label: "App Store",
        href: "https://apps.apple.com/gb/app/puzzle-vs-zombie-puzzle-game/id1582694306",
      },
    ],
  },
];

export const heroImages = [
  studio.logoTransparent,
  games[0].screenshots[1],
  games[0].screenshots[4],
  games[1].screenshots[0],
  games[1].screenshots[3],
];
