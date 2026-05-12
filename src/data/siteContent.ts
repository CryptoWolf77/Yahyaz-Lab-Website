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
  name: "Yahyaz Lab",
  tagline: "Independent game studio crafting action, puzzles, and playful worlds.",
  intro:
    "Yahyaz Lab is a solo game studio focused on energetic mobile games, character-driven worlds, and fast moments that feel good in the player’s hands.",
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
      "A fast side-scrolling adventure with ninja combat, coins, hazards, bosses, and quick reflex challenges.",
    longDescription:
      "White Ninja moves through forests, caves, lava chambers, and sci-fi rooms with a mix of jumping, attacking, collecting, and dodging. The website presents it as the studio’s kinetic action title.",
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
      "Fast combat and projectile attacks",
      "Coins, traps, spikes, lava, and moving hazards",
      "Multiple themed environments",
      "Cartoon character style with readable controls",
    ],
    stores: [
      { label: "Google Play" },
      { label: "App Store" },
    ],
  },
  {
    id: "puzzle-vs-zombie",
    title: "Puzzle VS Zombie",
    kicker: "Physics puzzle",
    description:
      "A puzzle game about solving block layouts, blasting bombs, collecting stars, and defeating zombies level by level.",
    longDescription:
      "Puzzle VS Zombie mixes spooky cartoon visuals with physics-style challenges. Each stage asks the player to read the structure, trigger the right tools, and clear the zombie threat.",
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
      "Spooky cartoon worlds and character variants",
      "Level-by-level challenge structure",
    ],
    stores: [
      { label: "Google Play" },
      { label: "App Store" },
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
