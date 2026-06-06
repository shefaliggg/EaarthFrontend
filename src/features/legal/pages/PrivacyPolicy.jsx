import React, { useState, useEffect, useRef } from "react";
import ModernDataList from "../components/ModernDataList";
import ModernDataTable from "../components/ModernDataTable";
import ModernBulletList from "../components/ModernBulletList";

const sections = [
  {
    id: "controller",
    title: "1. Controller & Contact",
    content: (
      <>
        <p>
          <strong>Controller:</strong> Eaarth Ltd &nbsp;|&nbsp;{" "}
          <strong>Company No:</strong> 14940705
        </p>
        <p>
          <strong>Registered office:</strong> Little Mead, Leighton Road, Great
          Billington, Leighton Buzzard, LU7 9BJ, England
        </p>
        <p>
          <strong>Privacy contact:</strong>{" "}
          <a
            href="mailto:support@eaarth.app"
            className="text-primary no-underline border-b border-[#c5d9c3] hover:border-primary transition-colors"
          >
            support@eaarth.app
          </a>
        </p>
        <p>
          Eaarth Ltd is the data controller for the purposes of applicable data
          protection law.
        </p>
      </>
    ),
  },
  {
    id: "scope",
    title: "2. Scope & Overview",
    content: (
      <p>
        This Policy applies to personal data we collect when you use the Online
        Service, register an account, subscribe to paid plans, contact support,
        or otherwise interact with Eaarth. It explains what we collect, why, how
        long we keep it, who we share it with, and the rights you have.
      </p>
    ),
  },
  {
    id: "collection",
    title: "3. How We Collect & Use Your Personal Data",
    content: (
      <>
        <p>
          We collect only the personal data necessary to provide and improve the
          Online Service, manage accounts and subscriptions, respond to
          enquiries, and comply with legal obligations.
        </p>

        <ModernDataList
          accent="green"
          items={[
            {
              label: "Account information",
              desc: "Name, username, password, email, phone. Used to create and manage your account, authenticate access, and send service communications. Basis: contract performance; legitimate interests.",
            },
            {
              label: "Billing & subscription data",
              desc: "Billing address; payment details (processed by our payment provider). Used to process payments and manage subscriptions. Basis: contract performance.",
            },
            {
              label: "Support & feedback",
              desc: "Messages, attachments, files you submit to support. Used to respond to enquiries and improve the service. Basis: contract performance; legitimate interests.",
            },
            {
              label: "Project content",
              desc: "Files and information you upload or share with other users. Used to enable collaboration. Basis: your instructions; contract performance.",
            },
            {
              label: "Usage & technical data",
              desc: "IP address, device/browser info, log data, cookies. Used to operate, secure and improve the Online Service. Basis: legitimate interests; consent where required.",
            },
            {
              label: "Marketing preferences",
              desc: "Opt-in/opt-out choices. Used to send newsletters and marketing where consented. Basis: consent; legitimate interests.",
            },
          ]}
        />
      </>
    ),
  },
  {
    id: "collect-use",
    title: "4. What we collect, how we use it, and recipients",
    content: (
      <>
        <p>
          The table below explains what data we collect, how we use it, and
          which recipients it might be shared with.
        </p>

        <ModernDataTable
          cols={["Your data", "How we use it", "Recipients"]}
          rows={[
            [
              "Account information — name, username, password, email, phone",
              "Create and manage your account; authenticate sessions; send service and security communications",
              "Eaarth Ltd; hosting provider; authentication service; email provider",
            ],
            [
              "Subscription & billing — billing address, payment method, transaction records",
              "Process payments; manage subscriptions; issue receipts; tax and accounting",
              "Payment processor; accounting provider; Eaarth Ltd finance team",
            ],
            [
              "Support / enquiry data — messages, attachments, logs you send to support",
              "Respond to enquiries; troubleshoot; improve service",
              "Support platform provider; Eaarth support staff; third-party contractors (if needed)",
            ],
            [
              "Feedback / reviews / public content — images, comments, ratings you submit",
              "Publish feedback; improve product; marketing (with consent)",
              "Eaarth Ltd; website host; marketing/email platform (if consent given)",
            ],
          ]}
        />
      </>
    ),
  },
  {
    id: "collecting",
    title: "5. How We Collect Personal Data",
    content: (
      <>
        <p className="text-[13px] text-[#888] italic mt-3">
          We collect personal data:
        </p>
        <ModernBulletList
          accent="#2d5a27"
          items={[
            "directly from you when you register, subscribe, contact support, or upload content",
            "from your use of the Online Service (automatically, via logs and cookies)",
            "from your use of the Online Service (automatically, via logs and cookies)",
            "from your use of the Online Service (automatically, via logs and cookies)",
          ]}
        />
      </>
    ),
  },
  {
    id: "sharing",
    title: "6. How We Share Personal Data",
    content: (
      <>
        <p>
          We use personal data to provide and improve the Online Service, to
          manage accounts and subscriptions, to communicate with you, and to
          meet legal obligations.
        </p>
        <ModernDataList
          accent="green"
          items={[
            {
              label: "Service providers & subprocessors",
              desc: "hosting providers, payment processors, email and messaging providers, analytics and form services. We require subprocessors to process data only on our instructions and to implement appropriate safeguards.",
            },
            {
              label: "Project participants",
              desc: "When you upload or share Project Data, authorised users of that Project may access it.",
            },
            {
              label: "Legal & regulatory authorities",
              desc: "where required by law, to respond to lawful requests, or to protect rights and safety.",
            },
            {
              label: "Business transfers",
              desc: "in the event of a merger, sale, or reorganisation, personal data may be transferred as part of the transaction; we will notify affected users where required.",
            },
          ]}
        />
        <p className="text-[13px] text-[#888] italic mt-3">
          We do not sell personal data.
        </p>
      </>
    ),
  },
  {
    id: "transfers",
    title: "7. International Transfers",
    content: (
      <p>
        Our servers are located in the UK and EEA. Where we use processors
        outside the UK/EEA we implement appropriate safeguards (for example,
        standard contractual clauses) to ensure lawful transfers and protection
        of personal data. If you share data with other users in other countries,
        those users will be able to access it from those countries.
      </p>
    ),
  },
  {
    id: "retention",
    title: "8. Retention",
    content: (
      <>
        <p>
          We retain personal data only as long as necessary to fulfil the
          purposes described in this Policy, to meet legal obligations, resolve
          disputes, and enforce agreements.
        </p>
        <ModernDataTable
          cols={["Data type", "Retention period"]}
          rows={[
            ["Account data", "Active + 12 months after deletion"],
            ["Billing records", "7 years (tax & accounting)"],
            ["Support logs", "2 years"],
            ["Backups", "Limited period per recovery needs"],
          ]}
        />
        <p>
          If you require different retention periods for regulatory reasons,
          contact{" "}
          <a
            href="mailto:support@eaarth.app"
            className="text-primary no-underline border-b border-[#c5d9c3] hover:border-primary transition-colors"
          >
            support@eaarth.app
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: "security",
    title: "9. Security",
    content: (
      <>
        <p>
          We implement commercially reasonable technical and organisational
          measures, including:
        </p>

        <ModernBulletList
          accent="#2d5a27"
          items={[
            "Encryption in transit (TLS) and at rest where appropriate",
            "role based access controls and least privilege for administrative access",
            "Multi-factor authentication for administrative accounts",
            "Regular backups and secure storage",
            "Vulnerability scanning and periodic penetration testing",
            "Logging and monitoring of security events",
            "Incident response procedures and staff training",
          ]}
        />

        <p className="pt-4">
          We will notify you and relevant authorities of personal data breaches
          in accordance with applicable law.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "10. Cookies & Similar Technologies",
    content: (
      <>
        <p>
          We use cookies and similar technologies to operate the Online Service
          and improve your experience.
        </p>
        <ModernDataTable
          cols={["Cookie", "Duration", "Purpose"]}
          rows={[
            [
              "Authentication",
              "Session (20 min inactivity)",
              "Keeps you logged in and secures your session",
            ],
            [
              "Essential platform",
              "Session or persistent",
              "Core functionality of the Online Service",
            ],
            [
              "Analytics (if enabled)",
              "Persistent (e.g. 2 years)",
              "Aggregate usage statistics to improve the Service",
            ],
          ]}
        />
        <p>
          You can manage cookies through your browser settings (Chrome, Edge,
          Firefox, Opera, Safari). If we add analytics or advertising cookies we
          will update this section and provide choices.
        </p>
      </>
    ),
  },
  {
    id: "rights",
    title: "11. Your Rights",
    content: (
      <>
        <p>
          Under applicable data protection laws you have rights in relation to
          your personal data, including:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 my-4">
          {[
            {
              right: "Access",
              desc: "Obtain a copy of personal data we process about you.",
            },
            {
              right: "Rectification",
              desc: "Correct inaccurate or incomplete data.",
            },
            {
              right: "Erasure",
              desc: "Request deletion of your personal data.",
            },
            {
              right: "Restriction",
              desc: "Ask us to limit processing in certain circumstances.",
            },
            {
              right: "Objection",
              desc: "Object to processing, including for direct marketing.",
            },
            {
              right: "Portability",
              desc: "Receive a machine-readable copy of your personal data.",
            },
            {
              right: "Withdraw consent",
              desc: "Where processing is based on consent, withdraw at any time.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-5 bg-white border border-[#e0ddd6] rounded-md"
            >
              <span className="block font-medium text-[12.5px] text-primary tracking-[0.04em] mb-1.5">
                {item.right}
              </span>
              <span className="block text-[12.5px] text-[#666] leading-snug">
                {item.desc}
              </span>
            </div>
          ))}
        </div>
        <p>
          To exercise any right, email{" "}
          <a
            href="mailto:support@eaarth.app"
            className="text-primary no-underline border-b border-[#c5d9c3] hover:border-primary transition-colors"
          >
            support@eaarth.app
          </a>
          . We aim to respond without undue delay and, where required, within
          one month. You may also complain to the UK Information Commissioner’s
          Office at{" "}
          <a
            href="https://ico.org.uk/concerns/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary no-underline border-b border-[#c5d9c3] hover:border-primary transition-colors"
          >
            ico.org.uk/concerns
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: "data-subject",
    title: "12. Data subject requests, deletion and account closure",
    content: (
      <>
        <p>
          You may request deletion of your account by emailing{" "}
          <a
            href="mailto:support@eaarth.app"
            className="text-primary no-underline border-b border-[#c5d9c3] hover:border-primary transition-colors"
          >
            support@eaarth.app
          </a>
          . Some information may remain in our private records after deletion
          where required by law. We may retain aggregated, non identifying data
          derived from your personal data.
        </p>

        <p>
          When you request deletion, we will remove your personal data from
          active systems and, where applicable, delete or anonymise backups
          within a reasonable period consistent with recovery needs and legal
          obligations.
        </p>
      </>
    ),
  },
  {
    id: "subprocessor-third-party",
    title: "13. Subprocessors and third party services",
    content: (
      <>
        <p>
          We use third party service providers to host, operate and support the
          Online Service (for example cloud hosting, payment processors, email
          and form providers). We require subprocessors to meet appropriate
          security and confidentiality standards and to process data only on our
          instructions.
        </p>
        <p>
          We maintain a list of key subprocessors and will notify you of
          material changes. You may object to a new subprocessor on reasonable
          grounds relating to data protection; if we cannot reasonably
          accommodate the objection we may suspend or terminate the relevant
          Services.
        </p>
        <p>
          If you would like us to publish the named list of subprocessors (for
          example: Amazon Web Services, Stripe, Formstack, Squarespace, Mail
          provider), contact support@eaarth.app and we will add the current list
          to this Policy.
        </p>
      </>
    ),
  },
  {
    id: "automated",
    title: "14. Automated Decision-Making",
    content: (
      <p>
        We do not make automated decisions that produce legal or similarly
        significant effects about users without human intervention. If we
        introduce automated decision-making or profiling that has a significant
        effect, we will disclose the logic, significance and envisaged
        consequences and provide a means to obtain human review where required
        by law.
      </p>
    ),
  },
  {
    id: "children",
    title: "15. Children's Data",
    content: (
      <p>
        The Online Service is not directed at children under 16. If you are
        under 16, do not create an account or provide personal data without
        parental or guardian consent. If we become aware that we have collected
        personal data from a child under 16 without appropriate consent, we will
        take steps to delete that data.
      </p>
    ),
  },
  {
    id: "changes",
    title: "16. Changes to This Policy",
    content: (
      <p>
        We may update this Policy from time to time. Material changes will be
        posted on{" "}
        <a
          href="https://user.eaarth.app/privacy-policy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary no-underline border-b border-[#c5d9c3] hover:border-primary transition-colors"
        >
          eaarth.app/privacy
        </a>{" "}
        and, where appropriate, notified by email. Please check this page
        periodically to stay informed.
      </p>
    ),
  },
  {
    id: "contact",
    title: "17. Contact & Complaints",
    content: (
      <p>
        If you have questions about this Policy, wish to exercise your rights,
        or want to make a complaint, contact{" "}
        <a
          href="mailto:support@eaarth.app"
          className="text-primary no-underline border-b border-[#c5d9c3] hover:border-primary transition-colors"
        >
          support@eaarth.app
        </a>
        . You may also complain to the UK Information Commissioner's Office at{" "}
        <a
          href="https://ico.org.uk/concerns/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary no-underline border-b border-[#c5d9c3] hover:border-primary transition-colors"
        >
          ico.org.uk/concerns
        </a>
        .
      </p>
    ),
  },
  {
    id: "addtional-info",
    title: "18. Additional information for EU/UK data subjects",
    content: (
      <ModernDataList
        accent="green"
        items={[
          {
            label: "Legal bases",
            desc: "we rely on contract performance, legitimate interests, and consent where required.",
          },
          {
            label: "International transfers",
            desc: "where transfers outside the UK/EEA occur, we use appropriate safeguards such as standard contractual clauses.",
          },
          {
            label: "Data protection officer",
            desc: "if required by law or your contract, we will provide DPO contact details on request.",
          },
        ]}
      />
    ),
  },
  {
    id: "dpa",
    title: "19. Data Processing Addendum (DPA) — summary",
    content: (
      <>
        <p>
          Where Eaarth processes Project Personal Data on your behalf, the DPA
          (published as part of our Terms or available on request) sets out:
          roles and responsibilities, categories of data, processing purposes,
          security measures, subprocessors, international transfer safeguards,
          data subject request handling, retention and deletion obligations,
          audit/cooperation rights, and breach notification procedures.
        </p>
        <p>
          If you need the full DPA text appended to your contract or published
          on your site, request a copy at{" "}
          <a
            href="mailto:support@eaarth.app"
            className="text-primary no-underline border-b border-[#c5d9c3] hover:border-primary transition-colors"
          >
            support@eaarth.app
          </a>{" "}
          and we will provide the full Schedule.
        </p>
      </>
    ),
  },
];

function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState(null);
  const navContainerRef = useRef(null);
  const navItemRefs = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!activeSection) return;

    const activeEl = navItemRefs.current[activeSection];
    const container = navContainerRef.current;

    if (!activeEl || !container) return;

    activeEl.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [activeSection]);

  return (
    <div className="font-light text-foreground min-h-screen">
      {/* Hero */}
      <div className="pt-12 px-12 pb-6 mx-auto">
        <p className="text-[11px] font-medium tracking-[0.15em] uppercase text-primary mb-6">
          Eaarth Ltd · Legal
        </p>
        <h1
          className="font-normal leading-[1.05] tracking-[-0.02em] text-foreground mb-6"
          style={{ fontSize: "clamp(42px, 6vw, 72px)" }}
        >
          Privacy &amp; <em className="italic text-primary">Cookies</em> Policy
        </h1>
        <span className="text-[13px] text-muted-foreground tracking-[0.02em]">
          Last updated: September 2024 &nbsp;·&nbsp; Governing law: England
          &amp; Wales
        </span>
      </div>

      <p className="px-12 pb-6 text-muted-foreground leading-7">
        This Privacy and Cookies Policy (“<strong>Policy</strong>”) explains how
        Eaarth Ltd (“<strong>Eaarth</strong>”, “<strong>we</strong>”, “
        <strong>us</strong>” or “<strong>our</strong>”) collects, uses, stores
        and shares personal data when you use our application and services at{" "}
        <a
          href="https://user.eaarth.app"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
        >
          https://user.eaarth.app
        </a>{" "}
        (the <strong>Online Service</strong>). Please read this Policy
        carefully. If you have questions, contact{" "}
        <a
          href="mailto:support@eaarth.app"
          className="font-medium text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
        >
          support@eaarth.app
        </a>
      </p>

      <p className="border-b pb-12 px-12 text-muted-foreground leading-7">
        We collect and process information about you in accordance with this
        Policy and use information collected about you in accordance with
        applicable data protection laws including the EU/UK General Data
        Protection Regulation (GDPR) and the UK Data Protection Act 2018. You
        have the right to object to the processing of your personal data,
        including where your personal data is being processed for direct
        marketing purposes.
      </p>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] max-w-[1180px] mx-auto pb-6">
        {/* Sticky sidebar nav — hidden on mobile */}
        <nav className="hidden md:block px-6 pt-12 pb-12 sticky top-6 h-fit">
          <h4 className="text-[10px] font-medium tracking-[0.14em] uppercase text-muted-foreground mb-4">
            Contents
          </h4>
          <div
            ref={navContainerRef}
            className="overflow-y-auto max-h-[83svh] scrollbar-none"
          >
            {sections.map((s) => (
              <div ref={(el) => (navItemRefs.current[s.id] = el)}>
                <button
                  key={s.id}
                  onClick={() =>
                    document
                      .getElementById(s.id)
                      ?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                  className={`block w-full text-left text-[13px] py-1.5 pl-3 border-l-[1.5px] transition-all duration-200 leading-snug bg-transparent border-t-0 border-r-0 border-b-0 cursor-pointer
                ${
                  activeSection === s.id
                    ? "text-primary border-primary font-normal"
                    : "text-muted-foreground border-transparent hover:text-secondary hover:border-secondary font-light"
                }`}
                >
                  {s.title}
                </button>
              </div>
            ))}
          </div>
        </nav>

        {/* Main content */}
        <main className="px-6 md:px-12 py-12 border-l-0 md:border-l">
          {sections.map((s) => (
            <section
              key={s.id}
              id={s.id}
              className="py-10 border-b last:border-b-0"
            >
              <h2
                className="font-light text-[#111] mb-5 tracking-[-0.01em]"
                style={{ fontFamily: "'Fraunces', serif", fontSize: 22 }}
              >
                {s.title}
              </h2>
              <div
                className="[&_p]:text-[14.5px] [&_p]:leading-[1.75] [&_p]:text-[#444] [&_p]:mb-3.5
                           [&_strong]:font-medium [&_strong]:text-[#222]
                           [&_a]:text-primary [&_a]:no-underline [&_a]:border-b [&_a]:border-[#c5d9c3] [&_a]:transition-colors hover:[&_a]:border-primary"
              >
                {s.content}
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}

function ScrollProgress({ accentColor }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener("scroll", update);
    return () => window.removeEventListener("scroll", update);
  }, []);
  return (
    <div
      className="fixed top-0 left-0 h-[2px] z-[100] transition-[width] duration-100"
      style={{ width: `${progress}%`, background: accentColor }}
    />
  );
}

export default PrivacyPolicy;
