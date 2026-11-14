import { ExternalLink } from "lucide-react";
import wordmark from "../assets/ball-crusher-wordmark.png";
import type { Language } from "../data/appContent";

const copy = {
  en: {
    category: "3D arcade game",
    description: "Guide Rivet through three workshop worlds, dodge bouncing energy cores, and face three bosses.",
    action: "Visit Ball Crusher",
  },
  ar: {
    category: "لعبة أركيد ثلاثية الأبعاد",
    description: "رافق ريفيت عبر ثلاثة عوالم في الورشة، وتفادَ كرات الطاقة المرتدة، وواجه ثلاثة زعماء.",
    action: "زيارة موقع Ball Crusher",
  },
};

export default function BallCrusherProject({ language }: { language: Language }) {
  const project = copy[language];

  return (
    <a className="world-gateway ball-crusher-project" href="https://ballcrusher.yahyazlab.com/">
      <div className="world-gateway__inner content-width">
        <div className="world-gateway__copy">
          <span className="gateway-category reading-text">{project.category}</span>
          <h3 lang="en">Ball Crusher</h3>
          <p className="reading-text">{project.description}</p>
          <span className="gateway-link reading-text">{project.action}<ExternalLink size={19} aria-hidden="true" /></span>
        </div>
        <img
          className="ball-crusher-project__logo"
          src={wordmark}
          alt=""
          width={1280}
          height={600}
          loading="lazy"
          decoding="async"
        />
      </div>
    </a>
  );
}
