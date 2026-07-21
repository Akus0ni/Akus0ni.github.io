/**
 * Single source of truth for portfolio content, derived from
 * Akash Soni's resume. Swap the LINKS placeholders with real URLs.
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

export interface SkillGroup {
  group: string;
  items: { name: string; version: string }[];
}

export interface Credential {
  title: string;
  org: string;
  detail: string;
  when: string;
}

export const LINKS: SocialLinks = {
  email: 'asoni7667@gmail.com',
  linkedin: 'https://www.linkedin.com/in/akus0ni/',
  github: 'https://github.com/Akus0ni',
  resume: 'media/Akash_Soni_Resume.pdf',
  location: 'Raipur, Chhattisgarh, India',
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
    title: 'Software Engineer (Professional Engineer)',
    location: 'Pune, India',
    period: 'Sep 2021 — May 2025',
    from: '2021-09',
    to: '2025-05',
    scope: 'refactor(analytics): migrate SSAS analytics layer to AWS Redshift',
    stack: ['C#/.NET', 'AWS Redshift', 'Lambda', 'EC2', 'SSRS'],
    points: [
      'Designed and maintained high-throughput integration APIs in C#/.NET.',
      'Led the service-oriented platform modernization of the analytics layer, migrating from SSAS to AWS Redshift.',
      'Automated operational workflows using AWS Lambda, EC2, and Secrets Manager.',
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
      'Led the migration of enterprise analytics from a legacy SSAS stack to AWS Redshift.',
    points: [
      'Redesigned ETL pipelines and refactored the data-access layer.',
      'Introduced automated validation to de-risk the cutover.',
    ],
    tags: ['AWS Redshift', 'ETL', 'C#/.NET'],
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
    group: 'Languages',
    items: [
      { name: 'CSharp', version: '6+ yrs' },
      { name: 'DotNet', version: 'core+mvc' },
      { name: 'SQL', version: 'expert' },
      { name: 'TypeScript', version: 'stable' },
      { name: 'JavaScript', version: 'stable' },
    ],
  },
  {
    group: 'Cloud',
    items: [
      { name: 'AWS.Lambda', version: 'serverless' },
      { name: 'AWS.Redshift', version: 'analytics' },
      { name: 'AWS.CDK', version: 'iac' },
      { name: 'AWS.Cognito', version: 'authn' },
      { name: 'Azure', version: 'active' },
    ],
  },
  {
    group: 'Data',
    items: [
      { name: 'Redshift', version: 'warehouse' },
      { name: 'DynamoDB', version: 'nosql' },
      { name: 'SQLite', version: 'embedded' },
      { name: 'SSAS.SSRS', version: 'bi' },
      { name: 'ETL.Pipelines', version: 'prod' },
    ],
  },
  {
    group: 'Frontend',
    items: [
      { name: 'Angular', version: 'v19' },
      { name: 'Vue', version: 'v3' },
      { name: 'RxJS', version: 'reactive' },
      { name: 'HTML.CSS', version: 'craft' },
    ],
  },
  {
    group: 'Practices',
    items: [
      { name: 'API.Integration', version: 'high-throughput' },
      { name: 'CloudArchitecture', version: 'design' },
      { name: 'SecurityHardening', version: 'jwt+authz' },
      { name: 'StakeholderMgmt', version: 'delivery' },
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
  { title: 'Introduction to Cloud Computing', org: 'Certification', detail: '', when: 'Jun 2025' },
  { title: 'Prompt Engineering — How to Talk to the AI', org: 'Certification', detail: '', when: 'Jun 2025' },
];

/** Architecture diagram nodes for the signature hero pipeline (AI SaaS stack). */
export interface ArchNode { id: string; label: string; sub: string; x: number; y: number; kind: string; }
export interface ArchEdge { from: string; to: string; }

export const ARCH_NODES: ArchNode[] = [
  { id: 'client', label: 'Client', sub: 'QR · scan', x: 6, y: 50, kind: 'edge' },
  { id: 'cdn', label: 'CloudFront', sub: 'S3 + OAC', x: 27, y: 22, kind: 'cdn' },
  { id: 'api', label: 'API Gateway', sub: 'REST', x: 27, y: 78, kind: 'api' },
  { id: 'auth', label: 'Cognito', sub: 'JWT', x: 50, y: 50, kind: 'auth' },
  { id: 'lambda', label: 'Lambda', sub: 'Node 20 · ARM64', x: 72, y: 30, kind: 'compute' },
  { id: 'db', label: 'DynamoDB', sub: 'on-demand', x: 93, y: 20, kind: 'data' },
  { id: 'llm', label: 'LLM Client', sub: 'provider-agnostic', x: 93, y: 72, kind: 'ai' },
];

export const ARCH_EDGES: ArchEdge[] = [
  { from: 'client', to: 'cdn' },
  { from: 'client', to: 'api' },
  { from: 'api', to: 'auth' },
  { from: 'auth', to: 'lambda' },
  { from: 'lambda', to: 'db' },
  { from: 'lambda', to: 'llm' },
];
