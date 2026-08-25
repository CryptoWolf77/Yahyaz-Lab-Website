import { useEffect } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { studio } from "./data/siteContent";

const POLICY_TITLE = "White Ninja Privacy Policy | YahyazLab";
const POLICY_DESCRIPTION =
  "Privacy policy for White Ninja: 2D Adventure, explaining advertising, Google AdMob, consent choices, data processing, and contact information.";
const POLICY_URL = "https://yahyazlab.com/privacy/white-ninja";

const sectionLinks = [
  ["introduction", "Introduction"],
  ["direct-information", "Information collected directly"],
  ["third-party-information", "Third-party processing"],
  ["advertising", "Advertising"],
  ["consent", "Consent and regional requirements"],
  ["diagnostics", "Log and diagnostic data"],
  ["identifiers", "Identifiers and similar technologies"],
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
    setMeta('meta[property="og:image"]', "content", `${POLICY_URL.replace("/privacy/white-ninja", "")}${studio.logoSquare}`);
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

function WhiteNinjaPrivacyPage() {
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
              <p className="privacy-hero__product">White Ninja: 2D Adventure</p>
              <h1 id="privacy-title">White Ninja Privacy Policy</h1>
              <p className="privacy-hero__intro">
                A clear account of how advertising, consent, and information processing work in White Ninja.
              </p>
              <p className="privacy-updated">
                <span>Last updated</span>
                <time dateTime="2026-08-25">August 25, 2026</time>
              </p>
            </div>
            <div className="privacy-hero__art" aria-hidden="true">
              <span className="privacy-hero__icon-frame">
                <img src="/assets/white-ninja/icon.webp" alt="" width="168" height="168" />
              </span>
              <span className="privacy-hero__art-label">Official policy</span>
            </div>
          </div>
        </section>

        <section className="privacy-facts" aria-label="Privacy at a glance">
          <div className="privacy-facts__inner">
            <div>
              <CheckCircle2 size={19} aria-hidden="true" />
              <span><strong>No account required</strong>No registration or user profile.</span>
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

          <article className="privacy-article" aria-label="White Ninja Privacy Policy">
            <section id="introduction">
              <h2><span>01</span> Introduction</h2>
              <p>
                White Ninja: 2D Adventure is developed and published by YahyazLab. This Privacy Policy explains how information may be collected, used, processed, and shared when you use the app. White Ninja is supported through advertising.
              </p>
            </section>

            <section id="direct-information">
              <h2><span>02</span> Information YahyazLab Collects Directly</h2>
              <p>
                White Ninja does not provide account registration, user profiles, or an in-app form for submitting personal information to YahyazLab. YahyazLab does not directly ask you to provide personal information while playing the app.
              </p>
              <p>
                If you voluntarily email YahyazLab, we receive your email address, your message, and any information you choose to include. We use that information to respond to and manage your request.
              </p>
            </section>

            <section id="third-party-information">
              <h2><span>03</span> Information Third-Party Services May Process</h2>
              <p>Google advertising and related services may process the following information where applicable:</p>
              <ul>
                <li>Advertising identifiers and device identifiers.</li>
                <li>Device model or type, operating system, and app version.</li>
                <li>App interactions and advertising interactions.</li>
                <li>IP address, timestamps, and technical identifiers.</li>
                <li>Crash, diagnostic, and other technical information.</li>
                <li>Approximate location inferred from IP address or other network signals where applicable.</li>
              </ul>
              <p className="privacy-note">
                White Ninja does not request Android precise, coarse, or background location permissions and does not actively collect GPS location.
              </p>
            </section>

            <section id="advertising">
              <h2><span>04</span> Advertising</h2>
              <p>
                White Ninja uses Google AdMob through the Google Mobile Ads SDK. Google may use relevant device information and advertising identifiers to deliver and measure ads, personalize ads where permitted, limit how often ads are shown, prevent fraud, and provide advertising reports. This processing depends on your consent choices, applicable law, and your Google or device settings.
              </p>
              <p>
                Learn more through the <ExternalPrivacyLink href="https://policies.google.com/privacy">Google Privacy Policy</ExternalPrivacyLink> and <ExternalPrivacyLink href="https://policies.google.com/technologies/partner-sites">Google's information about partner sites and apps</ExternalPrivacyLink>.
              </p>
            </section>

            <section id="consent">
              <h2><span>05</span> Consent and Regional Privacy Requirements</h2>
              <p>
                White Ninja uses Google's User Messaging Platform (UMP). Users in regions where consent or privacy choices are required may be shown a consent or privacy message. This message is not necessarily shown to every user worldwide.
              </p>
              <p>
                Depending on the region and available options, you may be able to consent, decline, or manage specific privacy choices. Advertising behavior may depend on those choices. Where required, the app provides a way to reopen the available privacy options.
              </p>
            </section>

            <section id="diagnostics">
              <h2><span>06</span> Log and Diagnostic Data</h2>
              <p>
                Third-party services used by White Ninja may automatically receive technical and diagnostic details, such as device type, operating system, app version, crash or diagnostic information, timestamps, and technical identifiers. These details can help deliver services, diagnose problems, and maintain reliability. YahyazLab does not claim to directly store logs generated by third-party SDKs.
              </p>
            </section>

            <section id="identifiers">
              <h2><span>07</span> Identifiers and Similar Technologies</h2>
              <p>
                Mobile advertising SDKs generally use advertising IDs, device identifiers, local storage, and similar mobile technologies rather than traditional browser cookies. These technologies may support advertising delivery, measurement, consent choices, security, and fraud prevention.
              </p>
            </section>

            <section id="use">
              <h2><span>08</span> How Information Is Used</h2>
              <p>Information processed in connection with White Ninja may be used to:</p>
              <ul>
                <li>Operate, deliver, and measure advertising.</li>
                <li>Honor consent choices and advertising preferences.</li>
                <li>Protect services, prevent fraud, and maintain security.</li>
                <li>Diagnose technical problems and improve reliability.</li>
                <li>Respond to support or privacy emails sent to YahyazLab.</li>
                <li>Comply with applicable legal requirements.</li>
              </ul>
              <p>
                Google processes information according to its own policies and responsibilities. YahyazLab uses information received directly by email only as described in this policy.
              </p>
            </section>

            <section id="sharing">
              <h2><span>09</span> Data Sharing and Service Providers</h2>
              <p>
                Google, including Google AdMob, is the relevant third-party provider for advertising and related services in White Ninja. Information may be processed by Google as necessary to operate, advertise, measure, protect, and improve its services.
              </p>
              <p>
                Information may also be disclosed when required by law, legal process, or a valid governmental request, or when reasonably necessary to protect rights, safety, and the integrity of the app or its users.
              </p>
            </section>

            <section id="retention">
              <h2><span>10</span> Data Retention</h2>
              <p>
                Retention by third-party providers is governed by their own policies, user settings, legal requirements, and operational needs. YahyazLab does not set or promise a specific retention period for information processed independently by Google.
              </p>
              <p>
                Emails sent directly to YahyazLab are retained only for as long as reasonably necessary to answer and manage the request and meet legitimate legal or administrative needs.
              </p>
            </section>

            <section id="security">
              <h2><span>11</span> Security</h2>
              <p>
                YahyazLab and its service providers use reasonable measures intended to protect information. However, no method of electronic transmission or storage is completely secure, and absolute security cannot be guaranteed.
              </p>
            </section>

            <section id="children">
              <h2><span>12</span> Children's Privacy</h2>
              <p>
                White Ninja does not provide accounts or forms that ask children to submit personal information directly to YahyazLab. Google services may process limited information as described in this policy, subject to applicable law, settings, and consent requirements.
              </p>
              <p>
                If you are a parent or guardian and believe a child sent personal information directly to YahyazLab, please contact us so we can review the request and delete the information where appropriate. This section does not make a statement about the app's child-directed or target-audience classification.
              </p>
            </section>

            <section id="choices">
              <h2><span>13</span> Your Privacy Choices</h2>
              <p>Depending on your region, device, and available services, you may:</p>
              <ul>
                <li>Manage choices through the UMP consent or privacy options shown in the app.</li>
                <li>Reopen privacy options from the app where required and available.</li>
                <li>Manage Google advertising preferences through <ExternalPrivacyLink href="https://myadcenter.google.com/">My Ad Center</ExternalPrivacyLink>.</li>
                <li>Reset or manage advertising identifiers through your device settings where supported.</li>
                <li>Contact YahyazLab with privacy questions.</li>
              </ul>
            </section>

            <section id="external-links">
              <h2><span>14</span> External Links</h2>
              <p>
                White Ninja may link to app stores or other third-party services. Their content and privacy practices are governed by their own terms and privacy policies, which YahyazLab does not control.
              </p>
            </section>

            <section id="changes">
              <h2><span>15</span> Changes to This Policy</h2>
              <p>
                This Privacy Policy may be updated to reflect changes to White Ninja, its service providers, or applicable requirements. The latest version will be published on this webpage, and the "Last updated" date will be revised when changes are made.
              </p>
            </section>

            <section id="contact">
              <h2><span>16</span> Contact</h2>
              <p>For privacy questions or requests concerning White Ninja, contact:</p>
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
        <p>White Ninja: 2D Adventure · Privacy Policy</p>
        <a href="/">Back to portfolio</a>
      </footer>
    </div>
  );
}

export default WhiteNinjaPrivacyPage;
