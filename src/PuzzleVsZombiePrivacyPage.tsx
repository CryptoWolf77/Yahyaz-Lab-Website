import { useEffect } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { studio } from "./data/siteContent";

const POLICY_TITLE = "Puzzle VS Zombie Privacy Policy | YahyazLab";
const POLICY_DESCRIPTION =
  "Privacy policy for Puzzle VS Zombie, explaining Google AdMob advertising, consent choices, in-app purchases, data processing, and contact information.";
const POLICY_URL = "https://yahyazlab.com/privacy/puzzle-vs-zombie";

const sectionLinks = [
  ["introduction", "Introduction"],
  ["direct-information", "Information collected directly"],
  ["third-party-information", "Third-party processing"],
  ["advertising", "Advertising"],
  ["consent", "Consent and regional requirements"],
  ["purchases", "In-app purchases"],
  ["diagnostics", "Log and diagnostic data"],
  ["identifiers", "Identifiers and similar technologies"],
  ["location", "Location information"],
  ["use", "How information is used"],
  ["sharing", "Data sharing and service providers"],
  ["retention", "Data retention"],
  ["security", "Security"],
  ["children", "Children's privacy"],
  ["choices", "Your privacy choices"],
  ["external-links", "External links"],
  ["changes", "Changes to this policy"],
  ["contact", "Contact"],
] as const;

function usePrivacyMetadata() {
  useEffect(() => {
    const previousTitle = document.title;
    const previousLanguage = document.documentElement.lang;
    const previousDirection = document.documentElement.dir;
    const cleanup: Array<() => void> = [];

    document.title = POLICY_TITLE;
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";

    const setMeta = (selector: string, attribute: string, value: string) => {
      let element = document.head.querySelector<HTMLMetaElement>(selector);
      const wasCreated = !element;

      if (!element) {
        element = document.createElement("meta");
        const propertyMatch = selector.match(/meta\[property="([^"]+)"\]/);
        const nameMatch = selector.match(/meta\[name="([^"]+)"\]/);
        if (propertyMatch) element.setAttribute("property", propertyMatch[1]);
        if (nameMatch) element.setAttribute("name", nameMatch[1]);
        document.head.appendChild(element);
      }

      const previousValue = element.getAttribute(attribute);
      element.setAttribute(attribute, value);
      cleanup.push(() => {
        if (wasCreated) {
          element?.remove();
        } else if (previousValue === null) {
          element?.removeAttribute(attribute);
        } else {
          element?.setAttribute(attribute, previousValue);
        }
      });
    };

    setMeta('meta[name="description"]', "content", POLICY_DESCRIPTION);
    setMeta('meta[property="og:type"]', "content", "website");
    setMeta('meta[property="og:title"]', "content", POLICY_TITLE);
    setMeta('meta[property="og:description"]', "content", POLICY_DESCRIPTION);
    setMeta('meta[property="og:url"]', "content", POLICY_URL);
    setMeta(
      'meta[property="og:image"]',
      "content",
      `${POLICY_URL.replace("/privacy/puzzle-vs-zombie", "")}${studio.logoSquare}`,
    );
    setMeta('meta[name="twitter:title"]', "content", POLICY_TITLE);
    setMeta('meta[name="twitter:description"]', "content", POLICY_DESCRIPTION);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const canonicalWasCreated = !canonical;
    const previousCanonical = canonical?.href;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = POLICY_URL;

    return () => {
      document.title = previousTitle;
      document.documentElement.lang = previousLanguage;
      document.documentElement.dir = previousDirection;
      cleanup.reverse().forEach((restore) => restore());
      if (canonicalWasCreated) {
        canonical?.remove();
      } else if (canonical && previousCanonical) {
        canonical.href = previousCanonical;
      }
    };
  }, []);
}

function ExternalPrivacyLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      className="privacy-link"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${String(children)} (opens in a new tab)`}
    >
      {children}
      <ExternalLink size={15} aria-hidden="true" />
    </a>
  );
}

function PuzzleVsZombiePrivacyPage() {
  usePrivacyMetadata();

  return (
    <div className="privacy-page" lang="en" dir="ltr">
      <a className="skip-link" href="#privacy-content">
        Skip to privacy policy
      </a>

      <header className="privacy-header">
        <div className="privacy-header__inner">
          <a className="brand-mark" href="/" aria-label="YahyazLab home">
            <img src={studio.logoTransparent} alt="" width="42" height="32" />
            <span>YahyazLab</span>
          </a>
          <a className="privacy-back-link" href="/">
            <ArrowLeft size={17} aria-hidden="true" />
            Back to YahyazLab
          </a>
        </div>
      </header>

      <main id="privacy-content">
        <section className="privacy-hero" aria-labelledby="privacy-title">
          <div className="privacy-hero__inner">
            <div className="privacy-hero__copy">
              <p className="eyebrow">
                <ShieldCheck size={16} aria-hidden="true" />
                Privacy &amp; data
              </p>
              <p className="privacy-hero__product">Puzzle VS Zombie</p>
              <h1 id="privacy-title">Puzzle VS Zombie Privacy Policy</h1>
              <p className="privacy-hero__intro">
                A clear account of how advertising, consent, purchases, and information processing work in Puzzle VS Zombie.
              </p>
              <p className="privacy-updated">
                <span>Last updated</span>
                <time dateTime="2026-10-01">October 1, 2026</time>
              </p>
            </div>
            <div className="privacy-hero__art" aria-hidden="true">
              <span className="privacy-hero__icon-frame privacy-hero__icon-frame--landscape">
                <img
                  src="/assets/puzzle-vs-zombie/feature-graphics.webp"
                  alt=""
                  width="320"
                  height="156"
                />
              </span>
              <span className="privacy-hero__art-label">Official policy</span>
            </div>
          </div>
        </section>

        <section className="privacy-facts" aria-label="Privacy at a glance">
          <div className="privacy-facts__inner">
            <div>
              <CheckCircle2 size={19} aria-hidden="true" />
              <span><strong>No location permission</strong>No precise, coarse, or background location access.</span>
            </div>
            <div>
              <CheckCircle2 size={19} aria-hidden="true" />
              <span><strong>Google advertising</strong>Ads are provided through Google AdMob.</span>
            </div>
            <div>
              <CheckCircle2 size={19} aria-hidden="true" />
              <span><strong>Consent controls</strong>UMP privacy choices appear where required.</span>
            </div>
          </div>
        </section>

        <div className="privacy-layout">
          <aside className="privacy-toc" aria-label="Privacy policy contents">
            <p>On this page</p>
            <ol>
              {sectionLinks.map(([id, label]) => (
                <li key={id}><a href={`#${id}`}>{label}</a></li>
              ))}
            </ol>
          </aside>

          <article className="privacy-article" aria-label="Puzzle VS Zombie Privacy Policy">
            <section id="introduction">
              <h2><span>01</span> Introduction</h2>
              <p>
                Puzzle VS Zombie (package name <strong>com.puzzlevszombie.horror.kill.games</strong>) is developed and published by YahyazLab. This Privacy Policy explains how information may be collected, used, processed, and shared when you use the game. Puzzle VS Zombie is supported through advertising and offers in-app purchases.
              </p>
            </section>

            <section id="direct-information">
              <h2><span>02</span> Information YahyazLab Collects Directly</h2>
              <p>
                Puzzle VS Zombie does not provide account registration, user profiles, or an in-game form for submitting personal information to YahyazLab. YahyazLab does not directly ask you to provide personal information while playing the game.
              </p>
              <p>
                If you voluntarily email YahyazLab, we receive your email address, your message, and any information you choose to include. We use that information to respond to and manage your request.
              </p>
            </section>

            <section id="third-party-information">
              <h2><span>03</span> Information Third-Party Services May Process</h2>
              <p>Google advertising, billing, consent, and related services may process the following information where applicable:</p>
              <ul>
                <li>Advertising identifiers and other device or app identifiers.</li>
                <li>Basic device information, operating system, app version, and language.</li>
                <li>App interactions, advertising interactions, and purchase-related events.</li>
                <li>IP address, timestamps, and network or technical identifiers.</li>
                <li>Crash, diagnostic, performance, and other technical information.</li>
                <li>Coarse information inferred from IP address or network signals where applicable.</li>
              </ul>
              <p className="privacy-note">
                Puzzle VS Zombie does not request Android precise, coarse, or background location permissions and does not collect device location.
              </p>
            </section>

            <section id="advertising">
              <h2><span>04</span> Advertising</h2>
              <p>
                Puzzle VS Zombie uses Google AdMob through the Google Mobile Ads SDK. Google may process device or other identifiers, including advertising identifiers where available, ad and app interactions, basic device information, diagnostics, and network or IP-derived coarse information. This processing supports ad delivery and measurement, frequency limiting, fraud prevention, security, and advertising reports. Personalized advertising depends on your consent choices, applicable law, and your Google or device settings.
              </p>
              <p>
                Learn more through the <ExternalPrivacyLink href="https://policies.google.com/privacy">Google Privacy Policy</ExternalPrivacyLink>, <ExternalPrivacyLink href="https://policies.google.com/technologies/partner-sites">Google's information about partner sites and apps</ExternalPrivacyLink>, and <ExternalPrivacyLink href="https://support.google.com/admob/answer/6128543">AdMob privacy information</ExternalPrivacyLink>.
              </p>
            </section>

            <section id="consent">
              <h2><span>05</span> Consent and Regional Privacy Requirements</h2>
              <p>
                Puzzle VS Zombie uses Google's User Messaging Platform (UMP). Users in regions where consent or privacy choices are required may be shown a consent or privacy message. This message is not necessarily shown to every user worldwide.
              </p>
              <p>
                Depending on the region and available options, you may be able to consent, decline, or manage specific privacy choices. Advertising behavior may depend on those choices. When Google requires it, the game makes Privacy Options available so you can reopen the UMP privacy choices.
              </p>
            </section>

            <section id="purchases">
              <h2><span>06</span> In-App Purchases</h2>
              <p>
                Puzzle VS Zombie uses Google Play Billing for in-app purchases. Google Play processes the transaction and associated purchase information under Google's terms and privacy practices. YahyazLab may receive purchase status, product, transaction, and entitlement information needed to complete or restore a purchase, but does not receive your full payment-card details.
              </p>
            </section>

            <section id="diagnostics">
              <h2><span>07</span> Log and Diagnostic Data</h2>
              <p>
                Third-party services used by Puzzle VS Zombie may automatically receive technical and diagnostic details, such as device type, operating system, app version, crash or performance information, timestamps, and technical identifiers. These details can help deliver services, diagnose problems, prevent abuse, and maintain reliability. YahyazLab does not claim to directly store logs generated independently by third-party SDKs.
              </p>
            </section>

            <section id="identifiers">
              <h2><span>08</span> Identifiers and Similar Technologies</h2>
              <p>
                Mobile advertising and service SDKs may use advertising IDs, app or device identifiers, local storage, and similar mobile technologies rather than traditional browser cookies. These technologies may support advertising delivery, measurement, consent choices, billing, security, and fraud prevention.
              </p>
            </section>

            <section id="location">
              <h2><span>09</span> Location Information</h2>
              <p>
                Puzzle VS Zombie does not request <strong>ACCESS_FINE_LOCATION</strong>, <strong>ACCESS_COARSE_LOCATION</strong>, or <strong>ACCESS_BACKGROUND_LOCATION</strong>, and the game does not collect GPS or device location. Google services may infer broad, coarse information from an IP address or network signal where applicable; this is not GPS access and does not require Android location permission from the game.
              </p>
            </section>

            <section id="use">
              <h2><span>10</span> How Information Is Used</h2>
              <p>Information processed in connection with Puzzle VS Zombie may be used to:</p>
              <ul>
                <li>Operate, deliver, personalize where permitted, and measure advertising.</li>
                <li>Honor consent choices and advertising preferences.</li>
                <li>Process and restore in-app purchases.</li>
                <li>Protect services, prevent fraud, and maintain security.</li>
                <li>Diagnose technical problems and improve reliability.</li>
                <li>Respond to support or privacy emails sent to YahyazLab.</li>
                <li>Comply with applicable legal requirements.</li>
              </ul>
            </section>

            <section id="sharing">
              <h2><span>11</span> Data Sharing and Service Providers</h2>
              <p>
                YahyazLab does not sell personal information. Google, including Google AdMob, UMP, and Google Play Billing, may receive and process information as a service provider or independent controller under its applicable terms. Data may be processed as needed to operate, advertise, measure, bill, protect, and improve those services.
              </p>
              <p>
                Information may also be disclosed when required by law, legal process, or a valid governmental request, or when reasonably necessary to protect rights, safety, and the integrity of the game or its users.
              </p>
            </section>

            <section id="retention">
              <h2><span>12</span> Data Retention</h2>
              <p>
                Retention by Google and other third-party providers is governed by their own policies, user settings, legal requirements, and operational needs. YahyazLab does not set or promise a specific retention period for information processed independently by Google.
              </p>
              <p>
                Emails sent directly to YahyazLab are retained only for as long as reasonably necessary to answer and manage the request and meet legitimate legal or administrative needs.
              </p>
            </section>

            <section id="security">
              <h2><span>13</span> Security</h2>
              <p>
                YahyazLab and its service providers use reasonable measures intended to protect information. However, no method of electronic transmission or storage is completely secure, and absolute security cannot be guaranteed.
              </p>
            </section>

            <section id="children">
              <h2><span>14</span> Children's Privacy</h2>
              <p>
                Puzzle VS Zombie does not provide accounts or forms that ask children to submit personal information directly to YahyazLab. Google services may process limited information as described in this policy, subject to applicable law, settings, and consent requirements.
              </p>
              <p>
                If you are a parent or guardian and believe a child sent personal information directly to YahyazLab, please contact us so we can review the request and delete the information where appropriate. This section does not make a statement about the game's child-directed or target-audience classification.
              </p>
            </section>

            <section id="choices">
              <h2><span>15</span> Your Privacy Choices</h2>
              <p>Depending on your region, device, and available services, you may:</p>
              <ul>
                <li>Manage choices through the UMP consent message shown in the game.</li>
                <li>Reopen Privacy Options from the game when Google requires and provides that option.</li>
                <li>Manage Google advertising preferences through <ExternalPrivacyLink href="https://myadcenter.google.com/">My Ad Center</ExternalPrivacyLink>.</li>
                <li>Reset, delete, or manage advertising identifiers through Android settings where supported.</li>
                <li>Review and control app permissions through Android device settings.</li>
                <li>Contact YahyazLab with privacy questions or requests.</li>
              </ul>
            </section>

            <section id="external-links">
              <h2><span>16</span> External Links</h2>
              <p>
                Puzzle VS Zombie may link to app stores or other third-party services. Their content and privacy practices are governed by their own terms and privacy policies, which YahyazLab does not control.
              </p>
            </section>

            <section id="changes">
              <h2><span>17</span> Changes to This Policy</h2>
              <p>
                This Privacy Policy may be updated to reflect changes to Puzzle VS Zombie, its service providers, or applicable requirements. The latest version will be published on this webpage, and the "Last updated" date will be revised when changes are made.
              </p>
            </section>

            <section id="contact">
              <h2><span>18</span> Contact</h2>
              <p>For privacy questions or requests concerning Puzzle VS Zombie, contact:</p>
              <address className="privacy-contact">
                <strong>YahyazLab</strong>
                <a href="mailto:admin@yahyazlab.com">
                  <Mail size={17} aria-hidden="true" />
                  admin@yahyazlab.com
                </a>
              </address>
            </section>
          </article>
        </div>
      </main>

      <footer className="privacy-footer">
        <div>
          <img src={studio.logoTransparent} alt="" width="58" height="34" loading="lazy" />
          <span>YahyazLab</span>
        </div>
        <p>Puzzle VS Zombie · Privacy Policy</p>
        <a href="/">Back to portfolio</a>
      </footer>
    </div>
  );
}

export default PuzzleVsZombiePrivacyPage;
