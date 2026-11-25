// Verified site content (EN/AR): text, links and media for every page.
// Carried over from the previous React site (src/App.tsx, src/data/*, PORTFOLIO.md).
//
// Media: /assets/* is served from public/assets. The Ball Crusher wordmark is imported
// so Vite fingerprints it with each production build.
//
import ballCrusherWordmark from "../assets/ball-crusher-wordmark.png";

// Rules: do not invent claims (ratings, download counts, testimonials, "4K", iOS for ApexLoad).
// Heavy video: white-ninja-promo.mp4 is 49.6 MB -> load only after an explicit play click,
// preload="none", never as an autoplaying background or WebGL texture.

export const languages = ["en", "ar"];

export const studio = {
  name: "YahyazLab",
  since: 2021,
  email: "admin@yahyazlab.com",
  logo: { src: "/assets/brand/logo-transparent.webp", width: 1228, height: 596, alpha: true },
  logoSquare: { src: "/assets/brand/logo-square.webp", width: 512, height: 512 },
  logoBackground: { src: "/assets/brand/logo-bg.webp", width: 2000, height: 2000 },
  favicon: "/favicon.ico",
  showreel: { src: "/assets/videos/yahyaz-blackbg.mp4", sizeMB: 1.6, poster: "/assets/brand/logo-square.webp" },
  role: { en: "Independent Apps & Games Developer", ar: "مطوّر تطبيقات وألعاب مستقل" },
  tagline: {
    en: "I create useful apps and polished game experiences with thoughtful details and a distinct visual identity.",
    ar: "أصمّم تطبيقات مفيدة وتجارب ألعاب متقنة تجمع بين الاهتمام بالتفاصيل وهوية بصرية مميزة.",
  },
  intro: {
    en: "YahyazLab is my personal space for building useful applications and engaging games. I design and develop each project with care, from tools that simplify your day to interactive worlds made to explore.",
    ar: "YahyazLab مساحتي الشخصية لبناء تطبيقات مفيدة وألعاب ممتعة. أصمّم وأطوّر كل مشروع باهتمام بالتفاصيل، من الأدوات التي تسهّل يومك إلى العوالم التي تستمتع باستكشافها.",
  },
  aboutTitle: { en: "One maker. Two worlds.", ar: "مطوّر واحد. عالمان." },
  metrics: [
    { value: "05", label: { en: "projects, built with care", ar: "مشاريع بُنيت بعناية" } },
    { value: "02", label: { en: "worlds to explore", ar: "عالمان للاستكشاف" } },
    { value: "Solo", label: { en: "independent developer", ar: "مطوّر مستقل" } },
  ],
  contact: {
    title: { en: "Interested in my work?", ar: "مهتم بأعمالي؟" },
    body: {
      en: "For questions about YahyazLab projects, portfolio work, or future updates, you can contact me here.",
      ar: "للاطلاع أو الاستفسار عن مشاريع YahyazLab، أو أعمالي المعروضة هنا، أو التحديثات القادمة، يمكنك التواصل معي من هنا.",
    },
  },
};

export const worlds = {
  apps: {
    number: "01",
    label: { en: "Apps development", ar: "تطوير التطبيقات" },
    title: { en: "A little more useful.", ar: "أدوات لحياة أبسط." },
    body: { en: "Thoughtful applications for the things that matter in your everyday.", ar: "تطبيقات مدروسة لأشياء تهمك كل يوم." },
    cta: { en: "Explore Apps", ar: "استكشف التطبيقات" },
  },
  games: {
    number: "02",
    label: { en: "Games development", ar: "تطوير الألعاب" },
    title: { en: "A little more adventure.", ar: "مساحة لمزيد من اللعب." },
    body: { en: "Quick reactions, clever puzzles, and worlds worth getting lost in.", ar: "تحديات سريعة، وألغاز ذكية، وعوالم تستحق الاستكشاف." },
    cta: { en: "Explore Games", ar: "استكشف الألعاب" },
  },
  heading: { en: "Two worlds. One eye for detail.", ar: "عالمان. اهتمام واحد بالتفاصيل." },
};

export const apps = [
  {
    id: "apexload",
    name: "ApexLoad",
    accent: "#2ef4ff",
    website: "https://apexload.org/",
    icon: { src: "/assets/apps/apexload/icon.webp", width: 192, height: 192 },
    category: { en: "Download. Organize. Create.", ar: "حمّل. نظّم. أبدع." },
    description: {
      en: "A practical way to save social media, keep downloads organized, and make quick edits in one place.",
      ar: "طريقة عملية لحفظ محتوى التواصل الاجتماعي وتنظيم التنزيلات وإجراء تعديلات سريعة في مكان واحد.",
    },
    features: [
      { title: { en: "Flexible downloads", ar: "تنزيلات مرنة" }, body: { en: "Video, images, audio and quality options, depending on the source.", ar: "خيارات للفيديو والصور والصوت والجودة بحسب المصدر." } },
      { title: { en: "Everything in order", ar: "كل شيء في مكانه" }, body: { en: "Keep your downloaded media organized and easy to find.", ar: "احتفظ بوسائطك المنزّلة منظّمة وسهلة الوصول." } },
      { title: { en: "Quick editing tools", ar: "أدوات تعديل سريعة" }, body: { en: "Practical tools for the finishing touches, without switching apps.", ar: "أدوات عملية للمسات الأخيرة دون التنقل بين التطبيقات." } },
    ],
    // Authentic captures. home/editor are real Android phone screens (good for 3D phone mockups).
    // overview is approved marketing artwork that contains Arabic text: never mirror or crop its text.
    screenshots: [
      { src: "/assets/apps/apexload/home.webp", width: 738, height: 1600, kind: "phone", label: { en: "Home", ar: "الرئيسية" } },
      { src: "/assets/apps/apexload/editor.webp", width: 738, height: 1600, kind: "phone", label: { en: "Quick editor", ar: "المحرر السريع" } },
      { src: "/assets/apps/apexload/overview.webp", width: 1386, height: 1115, kind: "artwork", label: { en: "Overview", ar: "نظرة عامة" } },
    ],
    // Android only. The iPhone release is not out: do not show an App Store button for ApexLoad.
    platformLinks: [{ label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.yahyazlab.apexload" }],
  },
  {
    id: "quranhaven",
    name: "QuranHaven",
    accent: "#75ff6d",
    website: "https://quranhaven.org/",
    icon: { src: "/assets/apps/quranhaven/icon.webp", width: 192, height: 192 },
    category: { en: "Read. Listen. Reflect.", ar: "اقرأ. استمع. تدبّر." },
    description: {
      en: "A calm space to read and listen to the Quran, explore Tafsir and translations, and build a daily practice.",
      ar: "مساحة هادئة لقراءة القرآن والاستماع إليه، واستكشاف التفسير والترجمات، وبناء ورد يومي.",
    },
    features: [
      { title: { en: "Reading & listening", ar: "القراءة والاستماع" }, body: { en: "Browse Surahs and make time for the Quran.", ar: "تصفّح السور وخصّص وقتًا للقرآن." } },
      { title: { en: "Explore & understand", ar: "البحث والفهم" }, body: { en: "Tafsir, translations and search to support your reading.", ar: "تفسير وترجمات وبحث لدعم قراءتك." } },
      { title: { en: "A daily practice", ar: "ورد يومي" }, body: { en: "Khatmah and memorization plans to support a steady routine.", ar: "خطط للختمة والحفظ تساعدك على الاستمرار." } },
    ],
    // Quran text appears in these captures: show them respectfully, never distort, scramble,
    // shatter, or use them as decorative particle/animated effects. Keep them upright and legible.
    screenshots: [
      { src: "/assets/apps/quranhaven/desktop.webp", width: 1440, height: 1000, kind: "desktop", label: { en: "Home", ar: "الرئيسية" } },
      { src: "/assets/apps/quranhaven/mobile.webp", width: 414, height: 896, kind: "phone", label: { en: "Mobile", ar: "الجوال" } },
      { src: "/assets/apps/quranhaven/surahs.webp", width: 1440, height: 1000, kind: "desktop", label: { en: "Mushaf reader", ar: "قارئ المصحف" } },
    ],
    platformLinks: [
      { label: "Google Play", href: "https://play.google.com/store/apps/details?id=org.quranflutter.quran_flutter" },
      { label: "App Store", href: "https://apps.apple.com/us/app/quran-haven/id6823268805" },
    ],
  },
];

export const games = [
  {
    id: "white-ninja",
    title: "White Ninja",
    accent: "#2ef4ff",
    kicker: { en: "Action platformer", ar: "لعبة منصات أكشن" },
    description: {
      en: "A fast side-scrolling action game built around ninja combat, sharp jumps, collectible coins, hazards, and boss encounters.",
      ar: "لعبة أكشن جانبية سريعة تتمحور حول قتال النينجا، والقفزات الدقيقة، وجمع العملات، وتجاوز المخاطر، ومواجهات الزعماء.",
    },
    longDescription: {
      en: "White Ninja moves through forests, caves, lava chambers, and sci-fi rooms with a focused rhythm of jumping, attacking, collecting, and dodging. It is one of my action-focused projects, designed around quick reactions and readable arcade combat.",
      ar: "يتنقل White Ninja عبر الغابات والكهوف وغرف الحمم والمساحات المستقبلية بإيقاع مركز يجمع بين القفز، والهجوم، والجمع، والمراوغة. هذا أحد مشاريعي التي تركز على الأكشن، وصُمم حول ردود فعل سريعة وقتال آركيد واضح القراءة.",
    },
    tags: { en: ["Mobile", "Action", "Platformer", "Boss fights"], ar: ["موبايل", "أكشن", "منصات", "زعماء"] },
    features: {
      en: ["Fast combat with clear attack timing", "Coins, traps, spikes, lava, and moving hazards", "Multiple environments with distinct moods", "Cartoon character style with readable mobile controls"],
      ar: ["قتال سريع بتوقيت هجمات واضح", "عملات وفخاخ وأشواك وحمم ومخاطر متحركة", "بيئات متعددة لكل منها أجواء مختلفة", "أسلوب شخصيات كرتوني مع تحكم واضح مناسب للموبايل"],
    },
    icon: { src: "/assets/white-ninja/icon.webp", width: 512, height: 512 },
    poster: { src: "/assets/white-ninja/screen-2.webp", width: 1731, height: 965 },
    trailer: { src: "/assets/videos/white-ninja-promo.mp4", sizeMB: 49.6, heavy: true },
    screenshots: [
      { src: "/assets/white-ninja/screen-1.webp", width: 1731, height: 969 },
      { src: "/assets/white-ninja/screen-2.webp", width: 1731, height: 965 },
      { src: "/assets/white-ninja/screen-3.webp", width: 1727, height: 967 },
      { src: "/assets/white-ninja/screen-4.webp", width: 1731, height: 968 },
      { src: "/assets/white-ninja/screen-5.webp", width: 1730, height: 969 },
      { src: "/assets/white-ninja/screen-6.webp", width: 1731, height: 967 },
      { src: "/assets/white-ninja/screen-7.webp", width: 1731, height: 970 },
    ],
    stores: [
      { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.b.ninja.jump.run.battle.adventure" },
      { label: "App Store", href: "https://apps.apple.com/gb/app/white-ninja-arcade-adventure/id1559261331" },
    ],
    privacy: "/privacy/white-ninja",
  },
  {
    id: "puzzle-vs-zombie",
    title: "Puzzle VS Zombie",
    accent: "#ff3f8c",
    kicker: { en: "Physics puzzle", ar: "ألغاز فيزيائية" },
    description: {
      en: "A spooky puzzle game about reading each level, triggering the right tools, collecting stars, and clearing zombie threats.",
      ar: "لعبة ألغاز بأجواء كرتونية مخيفة تدور حول قراءة كل مرحلة، وتفعيل الأدوات المناسبة، وجمع النجوم، والتخلص من تهديدات الزومبي.",
    },
    longDescription: {
      en: "Puzzle VS Zombie combines spooky cartoon visuals with physics-inspired level setups. Each stage asks the player to understand the structure, time the tools, collect stars, and solve the zombie challenge with the right move.",
      ar: "تمزج Puzzle VS Zombie بين رسوم كرتونية مخيفة وتركيبات مراحل مستوحاة من الفيزياء. في كل مرحلة يحتاج اللاعب إلى فهم بنية المستوى، وتوقيت استخدام الأدوات، وجمع النجوم، وحل تحدي الزومبي بالحركة المناسبة.",
    },
    tags: { en: ["Mobile", "Puzzle", "Physics", "Zombies"], ar: ["موبايل", "ألغاز", "فيزياء", "زومبي"] },
    features: {
      en: ["Physics-inspired block and trap puzzles", "Bombs, saws, stars, crates, and destructible setups", "Spooky cartoon worlds with bold character designs", "Level-by-level challenges built for careful timing"],
      ar: ["ألغاز كتل وفخاخ مستوحاة من الفيزياء", "قنابل ومناشير ونجوم وصناديق وتركيبات قابلة للتدمير", "عوالم كرتونية مخيفة بشخصيات جريئة وواضحة", "تحديات مرحلة بعد مرحلة مبنية على التوقيت الدقيق"],
    },
    icon: null,
    poster: { src: "/assets/puzzle-vs-zombie/featured.webp", width: 1024, height: 500 },
    featureGraphic: { src: "/assets/puzzle-vs-zombie/feature-graphics.webp", width: 1024, height: 500 },
    trailer: { src: "/assets/videos/puzzle-vs-zombie-promo.mp4", sizeMB: 6.8, heavy: true },
    screenshots: [
      { src: "/assets/puzzle-vs-zombie/screen-1.webp", width: 1920, height: 1080 },
      { src: "/assets/puzzle-vs-zombie/screen-2.webp", width: 1920, height: 1080 },
      { src: "/assets/puzzle-vs-zombie/screen-3.webp", width: 1920, height: 1080 },
      { src: "/assets/puzzle-vs-zombie/screen-4.webp", width: 1920, height: 1080 },
      { src: "/assets/puzzle-vs-zombie/screen-5.webp", width: 1920, height: 1080 },
      { src: "/assets/puzzle-vs-zombie/screen-6.webp", width: 1920, height: 1080 },
    ],
    stores: [
      { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.puzzlevszombie.horror.kill.games" },
      { label: "App Store", href: "https://apps.apple.com/gb/app/puzzle-vs-zombie-puzzle-game/id1582694306" },
    ],
    privacy: "/privacy/puzzle-vs-zombie",
  },
  {
    id: "ball-crusher",
    title: "Ball Crusher",
    accent: "#ffd448",
    kicker: { en: "3D arcade game", ar: "لعبة أركيد ثلاثية الأبعاد" },
    description: {
      en: "Guide Rivet through three workshop worlds, dodge bouncing energy cores, and face three bosses.",
      ar: "رافق ريفيت عبر ثلاثة عوالم في الورشة، وتفادَ كرات الطاقة المرتدة، وواجه ثلاثة زعماء.",
    },
    // Only a wordmark exists locally (no screenshots or trailer). It is a web game.
    wordmark: { src: ballCrusherWordmark, width: 1280, height: 600, alpha: true },
    website: "https://ballcrusher.yahyazlab.com/",
    cta: { en: "Visit Ball Crusher", ar: "زيارة موقع Ball Crusher" },
    stores: [],
  },
];

export const privacyLinks = [
  { href: "/privacy/white-ninja", label: { en: "White Ninja Privacy", ar: "خصوصية White Ninja" } },
  { href: "/privacy/puzzle-vs-zombie", label: { en: "Puzzle VS Zombie Privacy", ar: "خصوصية Puzzle VS Zombie" } },
];

// Common interface strings. Pages may add their own copy, but must not add product claims.
export const ui = {
  nav: {
    home: { en: "Home", ar: "الرئيسية" },
    apps: { en: "Apps", ar: "التطبيقات" },
    games: { en: "Games", ar: "الألعاب" },
    about: { en: "About", ar: "عني" },
    contact: { en: "Contact", ar: "تواصل" },
  },
  since: { en: "Since", ar: "منذ" },
  watchReel: { en: "Watch Reel", ar: "شاهد العرض" },
  reelTitle: { en: "YahyazLab portfolio reel", ar: "عرض أعمال YahyazLab" },
  visit: { en: "Visit", ar: "زيارة" },
  playTrailer: { en: "Play trailer", ar: "تشغيل العرض التشويقي" },
  screenshots: { en: "Screenshots", ar: "لقطات الشاشة" },
  close: { en: "Close", ar: "إغلاق" },
  previous: { en: "Previous", ar: "السابق" },
  next: { en: "Next", ar: "التالي" },
  opensNewTab: { en: "opens in a new tab", ar: "يفتح في علامة تبويب جديدة" },
  skip: { en: "Skip to content", ar: "انتقل إلى المحتوى" },
  backToTop: { en: "Back to top", ar: "العودة للأعلى" },
  language: { en: "Language", ar: "اللغة" },
};

// Helper: read the initial language from ?lang=ar|en, then localStorage, else English.
// Same key as the previous site, so returning visitors keep their language.
export const LANGUAGE_KEY = "yahyaz-language";
export function initialLanguage() {
  const requested = new URLSearchParams(location.search).get("lang");
  if (requested === "ar" || requested === "en") return requested;
  try {
    const saved = localStorage.getItem(LANGUAGE_KEY);
    if (saved === "ar" || saved === "en") return saved;
  } catch { /* storage may be unavailable */ }
  return "en";
}
export function rememberLanguage(lang) {
  try { localStorage.setItem(LANGUAGE_KEY, lang); } catch { /* ignore */ }
}
