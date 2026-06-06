import React, { useState, useEffect, useRef } from "react";
import ModernBulletList from "../components/ModernBulletList";
import ModernDataTable from "../components/ModernDataTable";
import ModernDataList from "../components/ModernDataList";

/* ─── Section content data ───────────────────────────────────────── */

const ACCENT = "#9333ea";
const LINK_BORDER = "#b8ccd9";

const LinkStyle =
  "text-primary no-underline border-b border-[#b8ccd9] hover:border-primary transition-colors";

const sections = [
  {
    id: "definitions-interp",
    title: "1. Definitions & Interpretation",
    content: (
      <>
        <p>
          Except to the extent expressly provided otherwise, in these Terms of
          Use:
        </p>
        <ModernDataList
          items={[
            {
              label: "Definitions",
              desc: "Words and expressions defined in the Definitions section have the meanings given to them when used in these Terms of Use.",
            },
            {
              label: "Headings",
              desc: "Clause and schedule headings are for convenience only and do not affect interpretation.",
            },
            {
              label: "Plural and singular",
              desc: "Words in the singular include the plural and vice versa.",
            },
            {
              label: "Gender and persons",
              desc: "References to a gender include all genders; references to a person include natural persons, partnerships, companies, corporations, unincorporated associations and any other legal entities.",
            },
            {
              label: "Statutes",
              desc: "Words and expressions defined in the Definitions section have the meanings given to them when used in these Terms of Use.",
            },
            {
              label: "Writing",
              desc: 'A reference to "writing" or "written" includes email.',
            },
            {
              label: "Including",
              desc: 'The words "includes", "including" and similar expressions are illustrative and do not limit the generality of any preceding words.',
            },
            {
              label: "Time periods",
              desc: "Where a period of time is specified by reference to a number of days, the period shall be calculated by excluding the day on which the event occurs and including the last day of the period; if the last day is not a Business Day, the period shall end on the next Business Day.",
            },
            {
              label: "Currency",
              desc: 'References to "£", "pounds sterling" or "GBP" are to the lawful currency of the United Kingdom unless otherwise stated.',
            },
            {
              label: "Obligations not to do something",
              desc: "An obligation on a party not to do something includes an obligation not to allow that thing to be done.",
            },
            {
              label: "Contract references",
              desc: "A reference to these Terms, the Privacy Policy, the Data Processing Addendum (DPA), any order form, or any other agreement is to that document as amended, novated, supplemented or replaced from time to time.",
            },
            {
              label: "Business Days",
              desc: "“Business Days” means Monday to Friday excluding English bank and public holidays.",
            },
            {
              label: "Conflict",
              desc: "If there is any conflict or inconsistency between a defined term in the Definitions section and any other provision of these Terms, the Definitions section will prevail for the purpose of interpretation only to the extent necessary to resolve the inconsistency.",
            },
          ]}
        />
        <p>
          In these Terms, unless the context otherwise requires, references to
          clauses and schedules are to clauses and schedules of these Terms and
          references to a party include that party’s successors and permitted
          assigns.
        </p>
        <p>
          Nothing in this clause 1 limits or excludes any other provision of
          these Terms which expressly deals with interpretation or construction
        </p>
      </>
    ),
  },
  {
    id: "definitions",
    title: "2. Definitions",
    content: (
      <>
        <p>For the purposes of these Terms:</p>
        <ModernDataList
          items={[
            {
              label: "Account",
              desc: "means your registered user account on the Online Service.",
            },
            {
              label: "Agreement",
              desc: "means the contract between you and Eaarth made up of the Application (if any), these Terms, the Privacy Policy, the DPA and any order form or pricing schedule.",
            },
            {
              label: "Application",
              desc: "means any application submitted by a prospective user to create an Account.",
            },
            {
              label: "Business Day",
              desc: "has the meaning set out in clause 1.1.",
            },
            {
              label: "Confidential Information",
              desc: "means information that is marked confidential or that ought reasonably to be treated as confidential.",
            },
            {
              label: "DPA",
              desc: "means the Data Processing Addendum set out in Schedule 1.",
            },
            {
              label: "Eaarth, we, us, our",
              desc: "means Eaarth Ltd, company number 14940705, registered office Little Mead, Leighton Road, Great Billington, Leighton Buzzard, LU7 9BJ, England.",
            },
            {
              label: "Online Service",
              desc: "means the Eaarth web and mobile applications at https://www.eaarth.app/ and any related services.",
            },
            {
              label: "Project",
              desc: "means a workspace, folder, or collaborative area created on the Online Service for a specific production, project, or purpose.",
            },
            {
              label: "Project Data",
              desc: "means data, files, messages, and other content uploaded to or created within a Project.",
            },
            {
              label: "Services",
              desc: "means the features, tools and functionality provided through the Online Service.",
            },
            {
              label: "Work",
              desc: "means materials created by Eaarth in the course of providing the Services.",
            },
            {
              label: "Force Majeure Event",
              desc: "means an event outside a party’s reasonable control (including internet failures, attacks, epidemics, government action, power failures, industrial disputes, disasters, war).",
            },
            {
              label: "Subprocessor",
              desc: "means any third party engaged by Eaarth to process Project Data on Eaarth’s behalf.",
            },
          ]}
        />
      </>
    ),
  },
  {
    id: "scope",
    title: "3. Scope & Acceptance",
    content: (
      <>
        <p>
          These Terms, together with the Privacy Policy and the DPA, form the
          Agreement between you and Eaarth governing your use of the Online
          Service.
        </p>
        <p>
          By creating an Account, accepting these Terms, or using the Online
          Service you confirm you have authority to bind the organisation you
          represent.
        </p>
        <p>
          We may update these Terms from time to time. Material changes will be
          notified by email or via the Online Service. Continued use after
          notice constitutes acceptance of the updated Terms.
        </p>
      </>
    ),
  },
  {
    id: "licence",
    title: "4. Licence, Access & Account Security",
    content: (
      <ModernDataList
        items={[
          {
            label: "Licence",
            desc: "Subject to these Terms and payment of any applicable fees, Eaarth grants you a limited, non-exclusive, non-transferable licence to access and use the Services during the Term.",
          },
          {
            label: "Account security",
            desc: "You are responsible for maintaining the confidentiality of your Account credentials and for all activity that occurs under your Account. Notify support@eaarth.app immediately of any unauthorised use.",
          },
          {
            label: "Acceptable use",
            desc: "You must use the Services lawfully and professionally. Prohibited activities include (without limitation) unlawful conduct, uploading malicious code, impersonation, scraping or automated harvesting, sending spam, infringing others' rights, and overloading or interfering with the Services.",
          },
          {
            label: "Suspension",
            desc: "We may suspend or restrict access immediately if you breach these Terms, to protect the platform, other users, or to comply with law.",
          },
        ]}
      />
    ),
  },
  {
    id: "projects",
    title: "5. Projects, Collaboration & User Content",
    content: (
      <ModernDataList
        items={[
          {
            label: "Project administration",
            desc: "The User who creates a Project is the Project Administrator and is responsible for inviting participants, setting permissions, and ensuring compliance with law and these Terms. Eaarth does not monitor or moderate Project content except to enforce these Terms or as required by law.",
          },
          {
            label: "Licence to Eaarth",
            desc: "By uploading Project Data you grant Eaarth a non exclusive licence to copy, store, transmit, display and otherwise process that data as necessary to provide the Services and to exercise Eaarth’s rights under the Agreement. Eaarth may sub license these rights to hosting and infrastructure providers solely to deliver the Services.",
          },
          {
            label: "User warranties",
            desc: "You warrant that you have the rights to upload Project Data and that such use will not infringe third party rights or applicable law.",
          },
          {
            label: "Project transfers",
            desc: "Project administration may be transferred to another user only with required consents from Project Participants and, where applicable, agreement to pay Project Charges.",
          },
          {
            label: "Export and backup",
            desc: "You are responsible for exporting any Project Data you require prior to termination. Eaarth will provide reasonable export tools and, on termination, will retain or delete Project Data in accordance with the Privacy Policy and DPA.",
          },
        ]}
      />
    ),
  },
  {
    id: "support",
    title: "6. Support, Availability, Maintenance & Service Levels",
    content: (
      <ModernDataList
        items={[
          {
            label: "Support",
            desc: "Eaarth provides support by email and in app messaging during published support hours (current hours are published on the Online Service). Contact: support@eaarth.app.",
          },
          {
            label: "Maintenance",
            desc: "Eaarth will use reasonable commercial endeavours to schedule maintenance during low usage hours and to give at least two Business Days’ notice of planned maintenance likely to cause disruption.",
          },
          {
            label: "Availability target",
            desc: "Eaarth aims to provide monthly availability of at least 99%. Availability calculations exclude scheduled maintenance, Force Majeure Events, and outages caused by User equipment or networks.",
          },
          {
            label: "Remedies for downtime",
            desc: "For material, sustained failures to meet availability targets, Eaarth will provide service credits or other remedies as set out in the Service Level Agreement (SLA) published on the Online Service.",
          },
        ]}
      />
    ),
  },
  {
    id: "charges",
    title: "7. Charges, Billing & Payment",
    content: (
      <ModernDataList
        items={[
          {
            label: "Fees",
            desc: "Fees for paid profiles, projects or add-ons are set out on the Online Service or in your order. Fees are exclusive of VAT and other taxes unless stated.",
          },
          {
            label: "Billing and renewal",
            desc: "Subscriptions renew automatically unless cancelled in accordance with the cancellation terms published with each plan.",
          },
          {
            label: "Price changes",
            desc: "Eaarth may increase fees with at least 60 days' notice; for annual subscriptions, increases will not take effect until the next renewal period.",
          },
          {
            label: "Non-payment",
            desc: "Eaarth may suspend Services for overdue amounts after giving at least five Business Days' notice and an opportunity to remedy. . Interest on overdue amounts may be charged at a reasonable rate.",
          },
          {
            label: "Refunds",
            desc: "Refunds are provided only as set out in your order or as required by law.",
          },
        ]}
      />
    ),
  },
  {
    id: "ip",
    title: "8. Confidentiality & Intellectual Property",
    content: (
      <ModernDataList
        items={[
          {
            label: "Confidentiality",
            desc: "Each party will keep confidential information received from the other secure and will not disclose it except to employees, advisers or subcontractors who need to know and who are bound by confidentiality obligations.",
          },
          {
            label: "Exceptions",
            desc: "Confidentiality obligations do not apply to information that is public, already known, independently developed, or required to be disclosed by law.",
          },
          {
            label: "Eaarth IP",
            desc: "Eaarth retains all rights, title and interest in the Online Service, platform code, and any Work created by Eaarth. Eaarth grants Users a royalty free licence to use Work solely to the extent necessary to use the Services.",
          },
          {
            label: "User IP",
            desc: "You retain ownership of Project Data subject to the licence granted to Eaarth.",
          },
          {
            label: "Feedback",
            desc: "If you provide feedback, you grant Eaarth a perpetual, irrevocable, royalty free licence to use that feedback to improve the Services.",
          },
        ]}
      />
    ),
  },
  {
    id: "data",
    title: "9. Data Protection, Privacy & DPA",
    content: (
      <>
        <p>
          Eaarth processes personal data in accordance with the Privacy Policy
          and applicable Data Protection Laws. You are responsible for the
          personal data you upload to Projects and for ensuring you have lawful
          grounds to process that data.
        </p>
        <ModernDataList
          items={[
            {
              label: "Privacy compliance",
              desc: "Eaarth processes personal data in accordance with the Privacy Policy and applicable Data Protection Laws. You are responsible for the personal data you upload to Projects and for ensuring you have lawful grounds to process that data.",
            },
            {
              label: "DPA",
              desc: "The Data Processing Addendum at Schedule 1 sets out the respective obligations where Eaarth processes Project Data on your behalf. The DPA includes categories of data, processing purposes, security measures, subprocessors, international transfer safeguards, deletion and return obligations, and audit/cooperation rights.",
            },
            {
              label: "Subprocessors",
              desc: "Eaarth will maintain a current list of Subprocessors (hosting, payment, analytics, forms, email providers) and will notify Users of material additions. Subprocessors will be bound by written contracts requiring appropriate technical and organisational measures.",
            },
            {
              label: "International transfers",
              desc: "Data is stored on servers in the UK and EEA. Where Eaarth uses processors outside the UK/EEA, Eaarth will implement appropriate safeguards (for example, standard contractual clauses).",
            },
            {
              label: "Data subject rights",
              desc: "Eaarth will assist Users to respond to data subject requests where Eaarth acts as processor; Users should direct requests to support@eaarth.app for coordination.",
            },
            {
              label: "Automated decision making and profiling",
              desc: "If Eaarth performs any automated decision making or profiling that produces legal or similarly significant effects, Eaarth will disclose the logic, significance and envisaged consequences. If none occurs, Eaarth will state that no such automated decisions are made.",
            },
            {
              label: "Children’s data",
              desc: "The Services are not directed at children under 16. If Eaarth becomes aware that it has collected personal data of a child under the applicable age without parental consent, Eaarth will delete that data.",
            },
            {
              label: "Breach notification",
              desc: "In the event of a personal data breach affecting Project Data, Eaarth will notify the User without undue delay and provide reasonable information to enable the User to meet any regulatory obligations. Eaarth will also notify supervisory authorities where required by law.",
            },
          ]}
        />
      </>
    ),
  },
  {
    id: "security",
    title: "10. Security",
    content: (
      <>
        <p>
          <strong>Measures </strong>:- Eaarth implements commercially reasonable
          technical and organisational measures to protect personal data,
          including:
        </p>
        <ModernBulletList
          accent={ACCENT}
          items={[
            "Encryption in transit (TLS) and encryption at rest where appropriate",
            "Role-based access controls and least privilege for administrative access",
            "Multi-factor authentication for administrative accounts",
            "Regular backups and secure storage",
            "Vulnerability scanning and periodic penetration testing",
            "Logging and monitoring of security events",
            "Incident response procedures and staff training",
          ]}
        />
        <p>
          <strong>Audit and compliance </strong>:- Eaarth will provide
          reasonable information about its security measures on request and will
          cooperate with reasonable audits as set out in the DPA.
        </p>
      </>
    ),
  },
  {
    id: "subprocessors",
    title: "11. Subprocessors and Third party Services",
    content: (
      <>
        <p>
          Eaarth uses third party service providers to host, operate and support
          the Services (for example cloud hosting, payment processors, email and
          form providers). Eaarth requires subprocessors to meet appropriate
          security and confidentiality standards.
        </p>
        <p>
          Eaarth will publish a list of key subprocessors and notify you of
          material changes. You may object to a new subprocessor on reasonable
          grounds relating to data protection; if we cannot reasonably
          accommodate the objection we may suspend or terminate the relevant
          Services.
        </p>
        <p>
          You are responsible for reviewing and complying with the terms of any
          third party services you choose to integrate with via the Online
          Service.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "12. Cookies & Tracking",
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
              "Session or persistent (as required)",
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
          3 You can manage cookies through your browser settings (Chrome, Edge,
          Firefox, Opera, Safari). If we add analytics or advertising cookies we
          will update this section and provide choices
        </p>
      </>
    ),
  },
  {
    id: "retention",
    title: "13. Retention",
    content: (
      <>
        <p>
          We retain personal data only as long as necessary to fulfil the
          purposes described in the Privacy Policy, to meet legal obligations,
          resolve disputes, and enforce agreements.
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
          notify support@eaarth.app
        </p>
      </>
    ),
  },
  {
    id: "warranties",
    title: "14. Warranties, Disclaimers & Indemnities",
    content: (
      <ModernDataList
        items={[
          {
            label: "Mutual warranties",
            desc: "Each party warrants it has the authority to enter into the Agreement.",
          },
          {
            label: "Service warranty",
            desc: 'Eaarth will use commercially reasonable efforts to provide the Services in accordance with industry practice. Except as expressly stated, Services are provided "as is" and Eaarth disclaims all other warranties to the maximum extent permitted by law.',
          },
          {
            label: "User indemnity",
            desc: "You will indemnify and hold Eaarth harmless from claims, losses, damages, liabilities and costs arising from your breach of these Terms, your Project Data, or your use of the Services.",
          },
          {
            label: "Eaarth indemnity",
            desc: ". Eaarth will indemnify you for claims that the Services, as provided by Eaarth (excluding Project Data), infringe a third party’s intellectual property rights, subject to the limitations in clause 15.",
          },
        ]}
      />
    ),
  },
  {
    id: "liability",
    title: "15. Limitations & Exclusions of Liability",
    content: (
      <>
        <p>
          Nothing in these Terms limits liability for death or personal injury
          resulting from negligence, fraud, or any other liability that cannot
          be limited by law.
        </p>
        <p>
          Subject to the above, Eaarth's aggregate liability for direct loss
          arising from the Agreement is limited to the greater of: (a) the fees
          paid by you to Eaarth in the 12 months preceding the claim; or (b)
          £50,000. If you are a consumer, statutory rights apply.
        </p>
        <p>
          Neither party will be liable for indirect, special, or consequential
          losses (including loss of profits, business or goodwill) except where
          required by law.
        </p>
      </>
    ),
  },
  {
    id: "termination",
    title: "16. Term, Suspension & Termination",
    content: (
      <ModernDataList
        items={[
          {
            label: "Term",
            desc: "The Agreement starts when your Application is accepted or when you first use the Services and continues until terminated.",
          },
          {
            label: "Termination for convenience",
            desc: "You may cancel subscriptions in accordance with the cancellation terms published with each plan.",
          },
          {
            label: "Termination for cause",
            desc: "Either party may terminate for material breach if the breach is not remedied within a specified cure period. Eaarth may suspend or terminate access immediately for serious breaches or unlawful activity.",
          },
          {
            label: "Effect of termination",
            desc: "On termination, licences granted to you end and you must stop using the Services. Eaarth may delete or retain Project Data in accordance with the Privacy Policy and DPA; you should export any data you need before termination.",
          },
          {
            label: "Survival",
            desc: "Clauses that by their nature survive termination (including IP, confidentiality, liability, indemnities, data protection and payment obligations) will continue in force.",
          },
        ]}
      />
    ),
  },
  {
    id: "changes",
    title: "17. Changes to the Services",
    content: (
      <p>
        We may modify, enhance, or discontinue features of the Services. Where
        changes materially reduce functionality, we will provide reasonable
        notice and, where applicable, options for migration or termination.
      </p>
    ),
  },
  {
    id: "force-majeure",
    title: "18. Force Majeure",
    content: (
      <p>
        Neither party will be liable for failure or delay in performing
        obligations caused by a Force Majeure Event. The affected party must
        notify the other and use reasonable endeavours to mitigate the effect.
      </p>
    ),
  },
  {
    id: "governing-law",
    title: "19. Governing Law & Disputes",
    content: (
      <p>
        These Terms are governed by the laws of England and Wales. The courts of
        England and Wales have exclusive jurisdiction to resolve disputes
        arising under these Terms, unless otherwise agreed in writing.
      </p>
    ),
  },
  {
    id: "misc",
    title: "20. Miscellaneous",
    content: (
      <ModernDataList
        items={[
          {
            label: "Entire agreement",
            desc: "These Terms, the Privacy Policy, the DPA and any order form constitute the entire agreement between you and Eaarth regarding the Services.",
          },
          {
            label: "Severability",
            desc: "If any provision is found invalid, the remainder will continue in force.",
          },
          {
            label: "Assignment",
            desc: "You may not assign your rights under these Terms without Eaarth's prior written consent; Eaarth may assign to an affiliate or in connection with a business transfer.",
          },
          {
            label: "Notices",
            desc: "Notices to Eaarth should be sent to support@eaarth.app. Notices to you will be sent to the email address on your Account.",
          },
        ]}
      />
    ),
  },
];

const dpaBlocks = [
  {
    letter: "A",
    heading: "Roles & Scope",
    items: [
      {
        label: "Term",
        desc: "The Agreement starts when your Application is accepted or when you first use the Services and continues until terminated.",
      },
      {
        label: "Termination for convenience",
        desc: "You may cancel subscriptions in accordance with the cancellation terms published with each plan.",
      },
      {
        label: "Termination for cause",
        desc: "Either party may terminate for material breach if the breach is not remedied within a specified cure period. Eaarth may suspend or terminate access immediately for serious breaches or unlawful activity.",
      },
      {
        label: "Effect of termination",
        desc: "On termination, licences granted to you end and you must stop using the Services. Eaarth may delete or retain Project Data in accordance with the Privacy Policy and DPA; you should export any data you need before termination.",
      },
      {
        label: "Survival",
        desc: "Clauses that by their nature survive termination (including IP, confidentiality, liability, indemnities, data protection and payment obligations) will continue in force.",
      },
    ],
  },
  {
    letter: "B",
    heading: "Processor Obligations",
    items: [
      {
        label: "Process on instructions",
        desc: "Eaarth will process Project Personal Data only on documented instructions from you, including as set out in the Agreement.",
      },
      {
        label: "Confidentiality obligations",
        desc: "Eaarth will ensure personnel authorised to process Project Personal Data are bound by confidentiality obligations.",
      },
      {
        label: "Security measures",
        desc: "Eaarth will implement appropriate technical and organisational measures to protect Project Personal Data (see clause 10 of the Terms).",
      },
      {
        label: "Assistance with compliance",
        desc: "Eaarth will assist you in responding to data subject requests and in meeting obligations under Data Protection Laws.",
      },
      {
        label: "Breach notification",
        desc: "Eaarth will notify you without undue delay if it becomes aware of a personal data breach affecting Project Personal Data and provide reasonable details and assistance.",
      },
      {
        label: "Deletion or return",
        desc: "Eaarth will delete or return Project Personal Data at the end of the Agreement in accordance with your instructions, subject to backup retention requirements and legal obligations.",
      },
      {
        label: "International transfers",
        desc: "Eaarth will not transfer Project Personal Data to a third country or international organisation except in accordance with the Agreement and applicable Data Protection Laws and only where appropriate safeguards are in place.",
      },
    ],
  },
  {
    letter: "C",
    heading: "Subprocessors",
    items: [
      {
        label: "Authorisation to engage Subprocessors",
        desc: "You authorise Eaarth to engage Subprocessors to process Project Personal Data.",
      },
      {
        label: "Subprocessor list",
        desc: "Eaarth will maintain a list of Subprocessors and make it available on request or by publication on the Online Service.",
      },
      {
        label: "Equivalent obligations",
        desc: "Eaarth will ensure Subprocessors are bound by written contracts imposing equivalent data protection obligations.",
      },
      {
        label: "Notification and objection",
        desc: "Eaarth will notify you of any new Subprocessor and give you a reasonable period to object on legitimate grounds relating to data protection.",
      },
      {
        label: "Objection consequences",
        desc: "Where you reasonably object to a new Subprocessor and Eaarth cannot reasonably accommodate the objection, Eaarth may suspend or terminate the relevant Services.",
      },
      {
        label: "Responsibility for Subprocessors",
        desc: "Eaarth remains responsible for the acts and omissions of its Subprocessors to the same extent as if Eaarth had performed the processing itself.",
      },
    ],
  },
  {
    letter: "D",
    heading: "International Transfers",
    items: [
      {
        label: "Safeguards",
        desc: "Where Project Personal Data is transferred outside the UK/EEA, Eaarth will implement appropriate safeguards such as standard contractual clauses, binding corporate rules, or other lawful transfer mechanisms.",
      },
      {
        label: "Details on request",
        desc: "Eaarth will provide details of transfer mechanisms on request.",
      },
    ],
  },
  {
    letter: "E",
    heading: "Security & Audit",
    items: [
      {
        label: "Measures",
        desc: "Eaarth will maintain appropriate technical and organisational measures to protect Project Personal Data, including those described in clause 10 of the Terms.",
      },
      {
        label: "Audits",
        desc: "On reasonable notice and subject to confidentiality and cost recovery, Eaarth will permit audits or inspections by you or an independent auditor to verify compliance, limited to once per 12 months unless required by law. Audits will be conducted during normal business hours and in a manner that does not unreasonably disrupt Eaarth’s business.",
      },
      {
        label: "Remediation",
        desc: "Where an audit reveals non-compliance, Eaarth will promptly implement remedial measures at its cost.",
      },
    ],
  },
  {
    letter: "F",
    heading: "Breach Notification",
    items: [
      {
        label: "Breach notification",
        desc: "Eaarth will notify you without undue delay and provide reasonable details of any personal data breach affecting Project Personal Data, including the nature of the breach, categories and approximate number of data subjects and records affected, likely consequences, and remedial actions taken or proposed.",
      },
      {
        label: "Regulatory assistance",
        desc: "Eaarth will cooperate with you and provide reasonable assistance to enable you to meet any regulatory notification obligations.",
      },
    ],
  },
  {
    letter: "G",
    heading: "Data Subject Requests",
    items: [
      {
        label: "Data subject requests",
        desc: "Eaarth will promptly notify you of any data subject request relating to Project Personal Data and will assist you in responding to such requests, subject to reimbursement for reasonable costs if requests are excessive or manifestly unfounded.",
      },
      {
        label: "Direct responses",
        desc: "Where Eaarth is required by law to respond directly to a data subject request, Eaarth will inform you unless prohibited by law.",
      },
    ],
  },
  {
    letter: "H",
    heading: "Deletion & Return",
    items: [
      {
        label: "On termination",
        desc: "On termination or expiry of the Agreement, Eaarth will, at your choice, delete or return Project Personal Data within a reasonable period, except where retention is required by law. Eaarth may retain Project Personal Data in backups for a limited period for disaster recovery and legal compliance.",
      },
      {
        label: "Certification",
        desc: "Eaarth will provide certification of deletion on request.",
      },
    ],
  },
  {
    letter: "I",
    heading: "Miscellaneous",
    items: [
      {
        label: "DPA precedence",
        desc: "If any provision of this DPA is inconsistent with the Agreement, the DPA will prevail to the extent of the inconsistency in relation to data protection obligations.",
      },
      {
        label: "Additional measures",
        desc: "The parties will cooperate to implement any additional measures required by Data Protection Laws.",
      },
    ],
  },
];

function TermsAndConditions() {
  const [activeSection, setActiveSection] = useState(null);
  const navContainerRef = useRef(null);
  const navItemRefs = useRef({});

  const allNavIds = [...sections.map((s) => s.id), "schedule-1"];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    allNavIds.forEach((id) => {
      const el = document.getElementById(id);
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
      <div className="pt-12 px-12 pb-6 mx-auto  max-w-[1180px]">
        <p className="text-[11px] font-medium tracking-[0.15em] uppercase text-primary mb-6">
          Eaarth Ltd · Legal
        </p>
        <h1
          className="font-normal leading-[1.05] tracking-[-0.02em] text-foreground mb-6"
          style={{ fontSize: "clamp(42px, 6vw, 72px)" }}
        >
          Terms <em className="italic text-primary">of Use</em>
        </h1>
        <span className="text-[13px] text-[#888] tracking-[0.02em]">
          Last updated: June 2026 &nbsp;·&nbsp; Governing law: England &amp;
          Wales &nbsp;·&nbsp;{" "}
          <a
            href="https://www.eaarth.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary no-underline border-b  hover:border-[#888] transition-colors"
          >
            eaarth.app
          </a>
        </span>
      </div>

      <p className="border-b pb-12 px-12 text-muted-foreground leading-7">
        These <strong>Terms of Use</strong> (the <strong>Terms</strong>) govern
        your access to and use of the Eaarth Ltd online platform and services
        available at{" "}
        <a
          href="https://www.eaarth.app"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
        >
          https://www.eaarth.app
        </a>{" "}
        (the <strong>Online Service</strong>). By registering, creating an
        account, or using the Online Service, you agree to be bound by these
        Terms. If you do not agree, do not use the Online Service.
      </p>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] max-w-[1180px] mx-auto pb-[120px]">
        {/* Sticky sidebar nav — hidden on mobile */}
        <nav className="hidden md:block px-6 pt-12 pb-12 sticky top-6 h-fit">
          <p className="text-[10px] font-medium tracking-[0.14em] uppercase text-[#aaa] mb-4">
            Contents
          </p>
          <div
            ref={navContainerRef}
            className="overflow-y-auto max-h-[83svh] scrollbar-none"
          >
            {sections.map((s) => (
              <div ref={(el) => (navItemRefs.current[s.id] = el)}>
                <NavButton
                  ref={(el) => (navItemRefs.current[s.id] = el)}
                  key={s.id}
                  id={s.id}
                  label={s.title}
                  active={activeSection === s.id}
                  accent={ACCENT}
                />
              </div>
            ))}

            <div ref={(el) => (navItemRefs.current["schedule-1"] = el)}>
              <NavButton
                id="schedule-1"
                label="Schedule 1 — DPA"
                active={activeSection === "schedule-1"}
                accent={ACCENT}
              />
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="px-6 md:px-10 py-12 border-l-0 md:border-l border-[#e0ddd6]">
          {sections.map((s) => (
            <section
              key={s.id}
              id={s.id}
              className="py-10 border-b border-[#eeeae3] last:border-b-0"
            >
              <h2
                className="font-light text-[#111] mb-5 tracking-[-0.01em]"
                style={{ fontFamily: "'Fraunces', serif", fontSize: 22 }}
              >
                {s.title}
              </h2>
              <div
                className="[&_p]:text-[14.5px] [&_p]:leading-[1.75] [&_p]:text-[#444] [&_p]:mb-3.5
                           [&_a]:text-primary [&_a]:no-underline [&_a]:border-b [&_a]:border-[#b8ccd9] [&_a]:transition-colors hover:[&_a]:border-primary"
              >
                {s.content}
              </div>
            </section>
          ))}

          {/* Schedule 1 — DPA */}
          <div
            id="schedule-1"
            className="mt-16 pt-12 border-t-2 border-[#e0ddd6]"
          >
            <p
              className="text-[10px] font-medium tracking-[0.14em] uppercase text-[#aaa] mb-3"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Schedule 1
            </p>
            <h2
              className="font-light text-[#111] mb-2 tracking-[-0.01em]"
              style={{ fontFamily: "'Fraunces', serif", fontSize: 28 }}
            >
              Data Processing Addendum
            </h2>
            <p className="text-[13px] text-[#888] mb-8">
              This Schedule forms part of the Agreement and applies where Eaarth
              processes personal data on your behalf in connection with the
              Services.
            </p>

            {dpaBlocks.map((block) => (
              <div key={block.letter} className="mb-10">
                <h3
                  className="font-light text-[#111] mb-1 tracking-[-0.01em]"
                  style={{ fontFamily: "'Fraunces', serif", fontSize: 18 }}
                >
                  <span
                    className="text-[10px] font-medium tracking-[0.1em] uppercase text-primary mr-2.5"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Part {block.letter}
                  </span>
                  {block.heading}
                </h3>
                <ModernDataList items={block.items} />
              </div>
            ))}

            <p className="text-[13px] text-[#888] mt-8">
              Questions? Contact{" "}
              <a href="mailto:support@eaarth.app" className={LinkStyle}>
                support@eaarth.app
              </a>{" "}
              &nbsp;·&nbsp; Full documents at{" "}
              <a
                href="https://www.eaarth.app/terms"
                target="_blank"
                rel="noopener noreferrer"
                className={LinkStyle}
              >
                eaarth.app/terms
              </a>{" "}
              and{" "}
              <a
                href="https://www.eaarth.app/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className={LinkStyle}
              >
                eaarth.app/privacy
              </a>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

function NavButton({ id, label, active, accent }) {
  return (
    <button
      onClick={() =>
        document
          .getElementById(id)
          ?.scrollIntoView({ behavior: "smooth", block: "start" })
      }
      className={`block w-full text-left text-[12.5px] py-1.5 pl-3 border-l-[1.5px] transition-all duration-200 leading-snug bg-transparent border-t-0 border-r-0 border-b-0 cursor-pointer
        ${active ? "font-normal" : "text-[#999] border-transparent hover:text-[#333] hover: font-light"}`}
      style={{
        color: active ? accent : undefined,
        borderLeftColor: active ? accent : undefined,
      }}
    >
      {label}
    </button>
  );
}

export default TermsAndConditions;
