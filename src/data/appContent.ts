export type Language = "en" | "ar";
export type PortfolioPage = "home" | "apps" | "games";

type Localized = Record<Language, string>;

export type AppScreenshot = {
  src: string;
  width: number;
  height: number;
  label: Localized;
};

export type Application = {
  id: string;
  name: string;
  order: number;
  website: string;
  icon: string;
  accent: "cyan" | "green";
  category: Localized;
  description: Localized;
  features: { title: Localized; body: Localized }[];
  screenshots: AppScreenshot[];
  platformLinks: { label: string; href: string }[];
};

export const applications: Application[] = ([
  {
    id: "apexload",
    name: "ApexLoad",
    order: 1,
    website: "https://apexload.org/",
    icon: "/assets/apps/apexload/icon.webp",
    accent: "cyan",
    category: { en: "Download. Organize. Create.", ar: "حمّل. نظّم. أبدع." },
    description: {
      en: "A practical way to save social media, keep downloads organized, and make quick edits in one place.",
      ar: "طريقة عملية لحفظ محتوى التواصل الاجتماعي وتنظيم التنزيلات وإجراء تعديلات سريعة في مكان واحد.",
    },
    features: [
      {
        title: { en: "Flexible downloads", ar: "تنزيلات مرنة" },
        body: { en: "Video, images, audio and quality options, depending on the source.", ar: "خيارات للفيديو والصور والصوت والجودة بحسب المصدر." },
      },
      {
        title: { en: "Everything in order", ar: "كل شيء في مكانه" },
        body: { en: "Keep your downloaded media organized and easy to find.", ar: "احتفظ بوسائطك المنزّلة منظّمة وسهلة الوصول." },
      },
      {
        title: { en: "Quick editing tools", ar: "أدوات تعديل سريعة" },
        body: { en: "Practical tools for the finishing touches, without switching apps.", ar: "أدوات عملية للمسات الأخيرة دون التنقل بين التطبيقات." },
      },
    ],
    screenshots: [
      { src: "/assets/apps/apexload/overview.webp", width: 1386, height: 1115, label: { en: "Overview", ar: "نظرة عامة" } },
    ],
    platformLinks: [{ label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.yahyazlab.apexload" }],
  },
  {
    id: "quranhaven",
    name: "QuranHaven",
    order: 2,
    website: "https://quranhaven.org/",
    icon: "/assets/apps/quranhaven/icon.webp",
    accent: "green",
    category: { en: "Read. Listen. Reflect.", ar: "اقرأ. استمع. تدبّر." },
    description: {
      en: "A calm space to read and listen to the Quran, explore Tafsir and translations, and build a daily practice.",
      ar: "مساحة هادئة لقراءة القرآن والاستماع إليه، واستكشاف التفسير والترجمات، وبناء ورد يومي.",
    },
    features: [
      {
        title: { en: "Reading & listening", ar: "القراءة والاستماع" },
        body: { en: "Browse Surahs and make time for the Quran.", ar: "تصفّح السور وخصّص وقتًا للقرآن." },
      },
      {
        title: { en: "Explore & understand", ar: "البحث والفهم" },
        body: { en: "Tafsir, translations and search to support your reading.", ar: "تفسير وترجمات وبحث لدعم قراءتك." },
      },
      {
        title: { en: "A daily practice", ar: "ورد يومي" },
        body: { en: "Khatmah and memorization plans to support a steady routine.", ar: "خطط للختمة والحفظ تساعدك على الاستمرار." },
      },
    ],
    screenshots: [
      { src: "/assets/apps/quranhaven/desktop.webp", width: 1440, height: 1000, label: { en: "Home", ar: "الرئيسية" } },
      { src: "/assets/apps/quranhaven/mobile.webp", width: 414, height: 896, label: { en: "Mobile", ar: "الجوال" } },
      { src: "/assets/apps/quranhaven/surahs.webp", width: 1440, height: 1000, label: { en: "Mushaf reader", ar: "قارئ المصحف" } },
    ],
    platformLinks: [{ label: "Google Play", href: "https://play.google.com/store/apps/details?id=org.quranflutter.quran_flutter" }],
  },
] satisfies Application[]).sort((a, b) => a.order - b.order);
