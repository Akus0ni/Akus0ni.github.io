/**
 * Single source of truth for portfolio content, derived from
 * Akash Soni's resume.
 */

export interface SocialLinks {
  email: string;
  linkedin: string;
  github: string;
  resume: string;
  location: string;
}

export interface Role {
  company: string;
  title: string;
  location: string;
  period: string;
  from: string;
  to: string;
  scope: string;        // git-log style subject line
  stack: string[];
  points: string[];
}

export interface Project {
  id: string;
  name: string;
  kind: string;
  blurb: string;
  points: string[];
  tags: string[];
  featured?: boolean;
}

export type SkillKind =
  | 'method' | 'class' | 'field' | 'variable' | 'interface' | 'event' | 'snippet';

export interface Skill { name: string; meta: string; note: string; }
/** `short` is the compact label used by the skills chips and the SQL console. */
export interface SkillGroup { group: string; short: string; kind: SkillKind; items: Skill[]; }

export interface Credential {
  title: string;
  org: string;
  when: string;
  link: string;
}

export const LINKS: SocialLinks = {
  email: 'asoni7667@gmail.com',
  linkedin: 'https://www.linkedin.com/in/akus0ni/',
  github: 'https://github.com/Akus0ni',
  resume: 'media/Akash_Soni_Resume.pdf',
  location: 'Raipur, Chhattisgarh, India',
};

export interface Profile {
  name: string;
  role: string;
  locationShort: string;
  timezone: string;
  /** used in the contact terminal ("open to …") */
  availability: string;
  /** used in the hero code comment ("available for …") */
  availabilityComment: string;
  /** the small link caption under the hero photo */
  ctaCaption: string;
  /** rotating phrases for the hero typewriter */
  typewriter: string[];
}

/** Single source of truth for identity/availability copy reused across sections. */
export const PROFILE: Profile = {
  name: 'Akash Soni',
  role: 'Full-stack Software Engineer',
  locationShort: 'Raipur, IN',
  timezone: 'UTC+5:30',
  availability: 'open to backend, full-stack and/or cloud engineering roles',
  availabilityComment: 'available for backend, full-stack and/or cloud roles',
  ctaCaption: "let's build something",
  typewriter: [
    'Full-stack Software Engineer',
    '.NET / C# · AWS & Azure',
    'I connect systems.',
    'Cloud data-platform builder',
  ],
};

export const SUMMARY =
  'Software engineer with 6+ years delivering technical solutions for enterprise ' +
  'clients — from cloud data-platform migrations to API integrations used by ' +
  'healthcare and energy partners. Proven track record in SQL database engineering, ' +
  'AWS & Azure cloud architecture, and building reusable tools adopted across product lines.';

export const STATS = [
  { value: '6+', label: 'years shipping', hint: 'since 2020' },
  { value: '3', label: 'industries', hint: 'energy · healthcare · SaaS' },
  { value: '1', label: 'HIPAA-adjacent platform hardened', hint: 'JWT auth + session fixes' },
  { value: '∞', label: 'systems connected', hint: 'integrations are the throughline' },
];

export const ROLES: Role[] = [
  {
    company: 'Energy Exemplar',
    title: 'Software Engineer',
    location: 'Pune, India',
    period: 'Jun 2025 — Mar 2026',
    from: '2025-06',
    to: '2026-03',
    scope: 'feat(plexos-cloud): ship Import/Export subsystem as a reusable NuGet library',
    stack: ['C#/.NET', 'NuGet', 'SQLite', 'Vue.js', 'CLI'],
    points: [
      'Designed and delivered the Import/Export integration subsystem for PLEXOS Cloud in C#/.NET, packaging core logic as a reusable NuGet service library with a clean interface contract.',
      'Built a cross-platform CLI on top of the NuGet library, transforming PTI Raw files into SQLite databases.',
      'Developed a desktop-style Excel Add-In (Vue.js UI) integrating with the backend library.',
      'Contributed to the EE Marketplace front-end using Vue.js.',
    ],
  },
  {
    company: 'eGain Communications',
    title: 'Software Engineer',
    location: 'Pune, India',
    period: 'Sep 2021 — May 2025',
    from: '2021-09',
    to: '2025-05',
    scope: 'refactor(analytics): migrate SSAS analytics layer to AWS Redshift',
    stack: ['.NET Framework 4.8', '.Net Core', 'AWS Redshift', 'Apache NiFi', 'Lambda', 'EC2', 'SSRS'],
    points: [
      'Designed and maintained high-throughput integration APIs in C#.',
      'Worked on the service-oriented platform modernization of the analytics layer, migrating from SSAS to AWS Redshift — working with Apache NiFi data flows.',
      'Automated operational workflows using .Net Core, AWS Lambda, EC2, and Secrets Manager.',
      'Produced and customized SSRS reports delivering stakeholder-facing insights.',
    ],
  },
  {
    company: 'IKS Health',
    title: 'Software Developer',
    location: 'Mumbai, India',
    period: 'Feb 2020 — Sep 2021',
    from: '2020-02',
    to: '2021-09',
    scope: 'fix(security): harden access control with JWT auth on the Scribble WFM platform',
    stack: ['Angular', '.NET MVC', 'JWT', 'Redox API'],
    points: [
      'Hardened access control for the Scribble WFM platform by engineering a JWT-based authentication module.',
      'Integrated the platform with the Redox API for real-time EHR data exchange.',
      'Developed a generic CSV/Excel bulk-upload integration using Angular with .NET MVC.',
      'Designed a performance leaderboard to drive continuous improvement metrics.',
    ],
  },
];

export const PROJECTS: Project[] = [
  {
    id: 'ai-review',
    name: 'AI-Powered Review Intelligence',
    kind: 'Serverless SaaS · solo build',
    blurb:
      'End-to-end full-stack SaaS, designed and shipped solo — customers scan a QR, ' +
      'tap a star, and get 5 AI-generated review suggestions in under 30 seconds.',
    points: [
      'Architected a serverless AWS stack with AWS CDK — API Gateway, Lambda (Node.js 20, ARM64), DynamoDB on-demand, S3 + CloudFront with OAC, Cognito JWT, Secrets Manager.',
      'Built a provider-agnostic LLM client — hot-swap Claude / Gemini / any OpenAI-compatible endpoint without redeploy.',
      'Plus-tier owner dashboard with scan analytics, QR generator, and self-service shop config.',
      'Block-all-public S3 + JWT-derived shopId (never trusted from the request body) for hardened multi-tenant isolation.',
    ],
    tags: ['AWS CDK', 'Lambda', 'DynamoDB', 'Cognito', 'CloudFront', 'LLM'],
    featured: true,
  },
  {
    id: 'import-export',
    name: 'Import / Export Service Library & CLI',
    kind: 'Reusable .NET library',
    blurb:
      'A reusable NuGet service library and cross-platform CLI packaging the core ' +
      'integration logic for PTI Raw file transformation.',
    points: [
      'Clean interface contract so multiple product surfaces (CLI, Excel Add-In, cloud) reuse one core.',
      'Transforms PTI Raw files into queryable SQLite databases.',
    ],
    tags: ['C#/.NET', 'NuGet', 'SQLite', 'CLI'],
  },
  {
    id: 'analytics',
    name: 'Analytics Platform Modernization',
    kind: 'SSAS → AWS Redshift migration',
    blurb:
      'Worked on the migration of enterprise analytics from a legacy SSAS stack to AWS Redshift.',
    points: [
      'Redesigned ETL pipelines and refactored the data-access layer.',
      'Introduced automated validation to de-risk the cutover.',
    ],
    tags: ['AWS Redshift', 'Apache NiFi', 'ETL', 'C#/.NET'],
  },
  {
    id: 'jwt-hardening',
    name: 'JWT Auth Hardening for Healthcare SaaS',
    kind: 'Security engineering',
    blurb:
      'Resolved critical security vulnerabilities across a HIPAA-adjacent clinical ' +
      'SaaS platform.',
    points: [
      'Engineered JWT authentication and corrected session-management flaws.',
      'Secured document-management services against unauthorized access.',
    ],
    tags: ['JWT', 'Security', 'HIPAA-adjacent'],
  },
];

export const SKILLS: SkillGroup[] = [
  {
    group: 'Languages & Frameworks',
    short: 'Languages',
    kind: 'method',
    items: [
      { name: 'CSharp', meta: '.NET · 6+ yrs', note: 'Primary language across every role — services, integrations, CLIs and desktop add-ins.' },
      { name: 'DotNet.Core', meta: 'core', note: '.NET Core services and Web APIs in production.' },
      { name: 'DotNet.Framework', meta: '4.8', note: 'Built and maintained the eGain analytics platform on classic .NET Framework 4.8.' },
      { name: 'SQL', meta: 'expert', note: 'Database engineering, query tuning and data modeling — a core strength.' },
      { name: 'TypeScript', meta: 'stable', note: 'Typed front-ends (this site) and Node Lambda handlers.' },
      { name: 'JavaScript', meta: 'stable', note: 'Browser and serverless runtimes.' },
      { name: 'HtmlCss', meta: 'craft', note: 'Hand-built, responsive, accessible UI.' },
    ],
  },
  {
    group: 'Cloud — AWS & Azure',
    short: 'Cloud',
    kind: 'class',
    items: [
      { name: 'Aws.Lambda', meta: 'Node 20 · ARM64', note: 'Serverless compute; automated operational workflows.' },
      { name: 'Aws.ApiGateway', meta: 'REST', note: 'Front door for the serverless SaaS.' },
      { name: 'Aws.Redshift', meta: 'warehouse', note: 'Led migration of analytics from legacy SSAS to Redshift.' },
      { name: 'Aws.DynamoDB', meta: 'on-demand', note: 'Multi-tenant NoSQL data store.' },
      { name: 'Aws.S3.CloudFront', meta: 'OAC', note: 'Block-all-public buckets served via CloudFront with Origin Access Control.' },
      { name: 'Aws.Cognito', meta: 'JWT', note: 'Token auth; shopId derived from the JWT, never the request body.' },
      { name: 'Aws.SecretsManager', meta: 'secrets', note: 'Runtime secret management for Lambdas.' },
      { name: 'Aws.CDK', meta: 'IaC', note: 'Entire stack defined as code.' },
      { name: 'Aws.EC2', meta: 'compute', note: 'Operational workflows and hosting.' },
      { name: 'Azure', meta: 'active', note: 'Cloud work across the Microsoft ecosystem.' },
    ],
  },
  {
    group: 'Data & Analytics',
    short: 'Data',
    kind: 'field',
    items: [
      { name: 'DatabaseEngineering', meta: 'core', note: 'Schema design, tuning and data-access architecture.' },
      { name: 'SSAS', meta: 'analysis', note: 'Legacy analytics layer, later modernized to Redshift.' },
      { name: 'SSRS', meta: 'reporting', note: 'Customized, stakeholder-facing reports.' },
      { name: 'EtlPipelines', meta: 'prod', note: 'Redesigned pipelines and added automated validation for the cutover.' },
      { name: 'SQLite', meta: 'embedded', note: 'PTI Raw files transformed into queryable SQLite databases.' },
      { name: 'ApacheNiFi', meta: 'used', note: "Used in the SSAS→Redshift migration under an architect's design — not the author of the flow." },
    ],
  },
  {
    group: 'Frontend',
    short: 'Frontend',
    kind: 'variable',
    items: [
      { name: 'Angular', meta: 'v19', note: 'Bulk-upload UI at IKS Health; this portfolio.' },
      { name: 'Vue', meta: 'v3', note: 'EE Marketplace front-end and the Excel Add-In UI.' },
      { name: 'RxJS', meta: 'reactive', note: 'Reactive state and streams in Angular.' },
      { name: 'ExcelAddIn', meta: 'Office JS', note: 'Desktop-style add-in over the .NET library.' },
    ],
  },
  {
    group: 'Integration & APIs',
    short: 'Integration',
    kind: 'interface',
    items: [
      { name: 'IntegrationApis', meta: 'high-throughput', note: 'Designed and maintained high-throughput integration APIs in C#/.NET.' },
      { name: 'RedoxApi', meta: 'EHR', note: 'Real-time EHR data exchange for a healthcare platform.' },
      { name: 'BulkUpload', meta: 'CSV · Excel', note: 'Generic, reusable bulk-upload integration.' },
      { name: 'NuGetPackaging', meta: 'library', note: 'Core logic packaged as a reusable NuGet service library, reused across surfaces.' },
      { name: 'CliTooling', meta: 'cross-platform', note: 'Cross-platform CLI built on top of the NuGet core.' },
    ],
  },
  {
    group: 'Security',
    short: 'Security',
    kind: 'event',
    items: [
      { name: 'JwtAuth', meta: 'authn', note: 'Engineered JWT authentication modules from the ground up.' },
      { name: 'SessionManagement', meta: 'fixes', note: 'Corrected critical session-management flaws.' },
      { name: 'AccessControl', meta: 'authz', note: 'Hardened access control on clinical platforms.' },
      { name: 'MultiTenantIsolation', meta: 'hardened', note: 'JWT-derived tenant scoping — never trust the client.' },
      { name: 'SecurityHardening', meta: 'HIPAA-adjacent', note: 'Resolved critical vulnerabilities on a HIPAA-adjacent SaaS.' },
    ],
  },
  {
    group: 'Practices',
    short: 'Practices',
    kind: 'snippet',
    items: [
      { name: 'SolidPrinciples', meta: 'applied', note: 'Applied SOLID design principles across services throughout my career.' },
      { name: 'SystemDesign', meta: 'design', note: 'System-design principles for scalable, maintainable services.' },
      { name: 'Microservices', meta: 'architecture', note: 'Service-oriented / microservices architecture on platform modernization.' },
      { name: 'TDD', meta: 'automated tests', note: "Test-driven development — automated tests that define a feature's behavior first." },
      { name: 'DSA', meta: 'fundamentals', note: 'Data structures & algorithms as everyday problem-solving fundamentals.' },
      { name: 'CloudArchitecture', meta: 'design', note: 'Architected serverless stacks end-to-end.' },
      { name: 'Troubleshooting', meta: 'production', note: 'Hands-on technical troubleshooting under real load.' },
      { name: 'StakeholderMgmt', meta: 'delivery', note: 'Delivered outcomes that map to stakeholder goals.' },
      { name: 'EndToEndDelivery', meta: 'solo', note: 'Designed and shipped a full SaaS product solo.' },
      { name: 'LlmIntegration', meta: 'provider-agnostic', note: 'Hot-swap Claude / Gemini / any OpenAI-compatible endpoint without redeploy.' },
      { name: 'PromptEngineering', meta: 'certified', note: 'Certified; pairs with AI tooling to ship faster.' },
    ],
  },
];

export const EDUCATION = [
  {
    school: 'CDAC ACTS, Pune',
    detail: 'Post Graduate Diploma in Advanced Computing',
    score: '80.5%',
    year: '2020',
  },
  {
    school: 'NIT Raipur',
    detail: 'B.Tech in Information Technology',
    score: 'CGPA 7.55 / 10',
    year: '2017',
  },
];

export const CERTS: Credential[] = [
  {
    title: 'Introduction to Cloud Computing',
    org: 'Coursera',
    when: 'Jan 2024',
    link: 'https://coursera.org/share/9f9dadcd3bd598680ca162b99c59422a',
  },
  {
    title: 'Prompt Engineering — How to Talk to the AI',
    org: 'LinkedIn Learning',
    when: 'Aug 2025',
    link: 'https://www.linkedin.com/learning/certificates/9cd04a21d015da0d47760d274d6550121ff2176f000d811516337fe0329a62fe',
  },
];

/**
 * Signature-build architecture, modelled as two selectable request flows through
 * the real serverless AWS stack shipped for the AI review SaaS (KanReview):
 *   1. `review`    — the public customer path (QR scan → AI reviews), no auth.
 *   2. `dashboard` — the Plus-tier owner path, gated by a Cognito JWT authorizer.
 * The diagram component renders one flow at a time and steps a caption through
 * `steps`, lighting the referenced nodes so the "how it works" reads on its own.
 */
export type ArchKind =
  | 'edge' | 'cdn' | 'api' | 'auth' | 'compute' | 'data' | 'ai' | 'secret' | 'storage';

/** `x`/`y` are percentages of the diagram canvas (0–100). */
export interface ArchNode { id: string; label: string; sub: string; x: number; y: number; kind: ArchKind; }
/** `bidir` draws a read/write (two-way) relationship. */
export interface ArchEdge { from: string; to: string; bidir?: boolean; }
/** One narration beat: `at` node ids light up while `text` is shown. */
export interface ArchStep { at: string[]; text: string; }
export interface ArchFlow {
  id: string;
  name: string;      // tab label
  tagline: string;   // one-line summary under the tabs
  nodes: ArchNode[];
  edges: ArchEdge[];
  steps: ArchStep[];
}

export const ARCH_FLOWS: ArchFlow[] = [
  {
    id: 'review',
    name: 'Review flow',
    tagline: 'Public · no sign-up — QR scan to five AI review drafts in under 30s',
    nodes: [
      { id: 'client', label: 'Customer',        sub: 'scan QR · mobile',   x: 4,  y: 50, kind: 'edge' },
      { id: 'cdn',    label: 'CloudFront',       sub: 'S3 · Next.js',       x: 22, y: 50, kind: 'cdn' },
      { id: 'api',    label: 'API Gateway',      sub: 'HTTP v2 · public',   x: 40, y: 50, kind: 'api' },
      { id: 'lGet',   label: 'GetShopDetails',   sub: 'λ · Node 20',        x: 62, y: 15, kind: 'compute' },
      { id: 'lGen',   label: 'GenerateFeedback', sub: 'λ · Node 20',        x: 62, y: 50, kind: 'compute' },
      { id: 'lScan',  label: 'RecordScan',       sub: 'λ · Node 20',        x: 62, y: 85, kind: 'compute' },
      { id: 'shops',  label: 'DynamoDB',         sub: 'Shops',              x: 90, y: 15, kind: 'data' },
      { id: 'secret', label: 'Secrets Mgr',      sub: 'provider + key',     x: 90, y: 38, kind: 'secret' },
      { id: 'llm',    label: 'LLM Provider',     sub: 'Claude · swappable', x: 90, y: 62, kind: 'ai' },
      { id: 'scans',  label: 'DynamoDB',         sub: 'ScanAnalytics',      x: 90, y: 85, kind: 'data' },
    ],
    edges: [
      { from: 'client', to: 'cdn' },
      { from: 'cdn',    to: 'api' },
      { from: 'api',    to: 'lGet' },
      { from: 'api',    to: 'lGen' },
      { from: 'api',    to: 'lScan' },
      { from: 'lGet',   to: 'shops' },
      { from: 'lGen',   to: 'secret' },
      { from: 'lGen',   to: 'llm' },
      { from: 'lScan',  to: 'scans' },
    ],
    steps: [
      { at: ['client'],           text: 'Customer scans the QR at the counter' },
      { at: ['cdn'],              text: 'CloudFront serves the static Next.js app from a locked-down S3 bucket' },
      { at: ['api'],              text: 'The app calls the public HTTP API — no login required' },
      { at: ['lGet', 'shops'],    text: 'GetShopDetails reads the shop config from the Shops table' },
      { at: ['lGen', 'secret'],   text: 'GenerateFeedback first reads the provider + key from Secrets Manager' },
      { at: ['lGen', 'llm'],      text: 'then calls that LLM provider directly — Claude, Gemini, any endpoint — for 5 drafts' },
      { at: ['lScan', 'scans'],   text: 'RecordScan writes the star rating to the analytics table' },
    ],
  },
  {
    id: 'dashboard',
    name: 'Owner dashboard',
    tagline: 'Plus-tier · Cognito JWT — shopId is derived from the token, never the request body',
    nodes: [
      { id: 'owner',   label: 'Shop Owner',   sub: 'Plus · desktop',    x: 4,  y: 50, kind: 'edge' },
      { id: 'cognito', label: 'Cognito',      sub: 'JWT sign-in',       x: 24, y: 50, kind: 'auth' },
      { id: 'api',     label: 'API Gateway',  sub: 'JWT authorizer',    x: 44, y: 50, kind: 'api' },
      { id: 'plus',    label: 'PlusOwnerFns', sub: 'λ · /owner/*',      x: 66, y: 50, kind: 'compute' },
      { id: 'shops',   label: 'DynamoDB',     sub: 'Shops · r/w',       x: 91, y: 18, kind: 'data' },
      { id: 'scans',   label: 'DynamoDB',     sub: 'Analytics · read',  x: 91, y: 50, kind: 'data' },
      { id: 'qr',      label: 'S3',           sub: 'QR code PNGs',      x: 91, y: 82, kind: 'storage' },
    ],
    edges: [
      { from: 'owner',   to: 'cognito' },
      { from: 'cognito', to: 'api' },
      { from: 'api',     to: 'plus' },
      { from: 'plus',    to: 'shops', bidir: true },
      { from: 'plus',    to: 'scans' },
      { from: 'plus',    to: 'qr', bidir: true },
    ],
    steps: [
      { at: ['owner'],                   text: 'Plus owner signs in from the dashboard' },
      { at: ['cognito'],                 text: 'Cognito checks the credentials and issues a JWT' },
      { at: ['api'],                     text: 'API Gateway verifies the JWT on every /owner/* request' },
      { at: ['plus'],                    text: 'shopId is resolved from the token via a GSI — never trusted from the body' },
      { at: ['plus', 'shops', 'scans'],  text: 'The Lambda reads/writes the shop record and reads its scan analytics' },
      { at: ['plus', 'qr'],              text: 'QR codes are written to a private S3 bucket, then served back as presigned URLs' },
    ],
  },
];
