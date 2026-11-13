// ─── Types ────────────────────────────────────────────────────────────────────

export type ProjectCategory = 'Cybersecurity' | 'AI-ML' | 'Web Dev' | 'Systems';

export interface Project {
  id: string;
  title: string;
  short: string;
  description: string;
  longDescription: string;
  highlights: string[];
  tags: string[];
  category: ProjectCategory;
  image: string;
  featured?: boolean;
  githubUrl?: string;
  liveUrl?: string;
  accent: string;
  metric?: { value: string; label: string };
}

export interface SkillCategory {
  id: string;
  title: string;
  blurb: string;
  image: string;
  color: string;
  skills: string[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  org: string;
  location: string;
  period: string;
  type: 'work' | 'education';
  bullets: string[];
  accent: string;
  current?: boolean;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  year?: string;
  image: string;
  color: string;
  focus: string;
  verifyUrl?: string;
}

// ─── Identity ─────────────────────────────────────────────────────────────────

export const profile = {
  name: 'Umair Ahmad',
  handle: 'umair.sec',
  title: 'Security Engineer',
  location: 'Islamabad, Pakistan',
  email: '18umair24@gmail.com',
  phone: '+92 335 5569684',
  github: 'https://github.com/100-1824',
  linkedin: 'https://linkedin.com/in/umair1824',
  whatsapp: 'https://wa.me/923355569684',
  resume: '/resume.pdf',
  roles: ['Cybersecurity Specialist', 'AI/ML Engineer', 'Full-Stack Developer', 'DevOps Engineer'],
};

// ─── Projects ─────────────────────────────────────────────────────────────────

export const projects: Project[] = [
  {
    id: 'dids',
    title: 'DIDS — Distributed Intrusion Detection System',
    short: 'DIDS',
    description:
      'Cloud-based distributed IDS combining Suricata with CNN/LSTM neural networks and Double DQN reinforcement learning for 99% detection accuracy.',
    longDescription:
      'Final Year Project. Suricata captures network traffic; CNN/LSTM pipelines classify threats in real time; a Double DQN agent adapts detection thresholds on the fly. Split into traffic-capture, signature-detection and anomaly-detection microservices, provisioned on Azure Kubernetes Service with Terraform, with a Flask monitoring dashboard.',
    highlights: [
      'Suricata sensors stream packet metadata into a deep-learning classification pipeline',
      'CNN + LSTM models detect anomalous flows with 99% accuracy',
      'Double DQN agent tunes detection thresholds to cut false positives',
      'Three containerised microservices on AKS, provisioned with Terraform',
      'Flask dashboard with authenticated admin access for live monitoring',
    ],
    tags: ['Python', 'Suricata', 'Deep Learning', 'Docker', 'Kubernetes', 'Terraform', 'Azure'],
    githubUrl: 'https://github.com/100-1824/DIDS',
    category: 'Cybersecurity',
    image: '/art/projects/dids.webp',
    featured: true,
    accent: '#3DF5C4',
    metric: { value: '99%', label: 'Detection accuracy' },
  },
  {
    id: 'cyberhawk',
    title: 'CyberHawk — Security Operations Platform',
    short: 'CyberHawk',
    description:
      'All-in-one SOC platform with ML malware analysis, ransomware monitoring, live network-flow detection, automated IP blocking, threat intelligence and reporting.',
    longDescription:
      'A PHP MVC web platform backed by a Python detection engine. Uploaded samples are scanned by a malware classifier trained on PE features such as section entropy; a watchdog-based monitor flags ransomware behaviour from suspicious extensions and high-entropy file writes and quarantines threats; Scapy captures live traffic into flows that a trained model classifies by attack type; malicious IPs are null-routed automatically. Email security alerts, reporting and a built-in assistant round out the analyst workflow.',
    highlights: [
      'Malware analyzer — Random Forest / Gradient Boosting on PE + entropy features, with quarantine',
      'Ransomware monitor — real-time file watching with entropy and extension heuristics',
      'Network analytics — Scapy flow capture classified by a trained IDS model',
      'Automated response — malicious IPs null-routed, with email security alerts',
      'Role-based dashboards, admin panel, reporting and threat-intelligence views',
    ],
    tags: ['PHP', 'Python', 'scikit-learn', 'Scapy', 'MySQL', 'MVC'],
    category: 'Cybersecurity',
    image: '/art/projects/cyberhawk.webp',
    featured: true,
    accent: '#FF5A4E',
    metric: { value: '5', label: 'Security modules' },
  },
  {
    id: 'legal-intel',
    title: 'Legal Demand Intelligence',
    short: 'Legal Intel',
    description:
      'AI-powered Reddit scraper using Gemini 1.5 Flash to identify legal leads, with a real-time dashboard, MongoDB storage, and email/webhook alerts.',
    longDescription:
      'A Flask backend scrapes Reddit for legal intent signals; Gemini 1.5 Flash summarises and scores each lead; MongoDB stores results; email and webhook notifications fire on high-score leads.',
    highlights: [
      'Intent detection and lead scoring with Gemini 1.5 Flash',
      'Real-time dashboard for triaging scored leads',
      'Email + webhook alerting on high-confidence matches',
    ],
    tags: ['Flask', 'Python', 'Gemini', 'MongoDB'],
    category: 'AI-ML',
    image: '/art/projects/legal-intel.webp',
    featured: true,
    accent: '#A98BFF',
  },
  {
    id: 'iuj',
    title: 'IUJ Website — Islamabad Union of Journalists',
    short: 'IUJ',
    description:
      'Official website for the Islamabad Union of Journalists featuring press releases, photo albums, member database, and admin panel with cPanel–GitHub sync.',
    longDescription:
      'Built with Laravel, PHP and MySQL. A full admin panel manages press releases, photo albums and the member database, with an automated cPanel–GitHub deployment pipeline.',
    highlights: [
      'Admin panel for press releases, albums and members',
      'Automated cPanel ⇄ GitHub deployment pipeline',
      'Production site for a national journalist union',
    ],
    tags: ['Laravel', 'PHP', 'MySQL', 'Bootstrap'],
    category: 'Web Dev',
    image: '/art/projects/iuj.webp',
    githubUrl: 'https://github.com/100-1824/Journalist',
    featured: true,
    accent: '#6E8BFF',
  },
  {
    id: 'ticktock',
    title: 'TickTock — Timesheet Management App',
    short: 'TickTock',
    description:
      'Production-style timesheet app built for a technical assessment: authenticated dashboards, weekly timesheets, entry management and 57 automated tests.',
    longDescription:
      'Next.js 14 App Router app in TypeScript with next-auth JWT sessions and route-protecting middleware. Users browse weekly timesheets, add and delete entries through validated modals, and filter by status. After submission I ran a self-driven review pass that hardened API error handling, fixed a delete-flow state bug and expanded test coverage.',
    highlights: [
      '57 Jest + React Testing Library tests across UI, features, pages and logic',
      'next-auth JWT sessions with middleware-protected routes',
      'Validated add / delete flows with graceful failure states',
      'Deployed live on Vercel',
    ],
    tags: ['Next.js', 'TypeScript', 'Tailwind', 'next-auth', 'Jest'],
    category: 'Web Dev',
    image: '/art/projects/ticktock.webp',
    githubUrl: 'https://github.com/100-1824/ticktock',
    liveUrl: 'https://ticktock-tentwenty.vercel.app',
    accent: '#6E8BFF',
    metric: { value: '57', label: 'Automated tests' },
  },
  {
    id: 'pos',
    title: 'Unique Hardware — Point of Sale System',
    short: 'POS',
    description:
      'Laravel point-of-sale and inventory system for a hardware store: products, sales, expenses and reporting, containerised and deployed to the cloud.',
    longDescription:
      'A Laravel application covering product catalogue and stock, multi-item sales, expense tracking and business reports behind authenticated access. Dockerised and deployed on Render, with scripted database export and an alternative shared-hosting deployment path.',
    highlights: [
      'Products, sales (multi-item), expenses and reporting modules',
      'Authenticated access for store staff',
      'Docker image deployed on Render with health checks',
    ],
    tags: ['Laravel', 'PHP', 'MySQL', 'Docker', 'Render'],
    category: 'Web Dev',
    image: '/art/projects/pos.webp',
    githubUrl: 'https://github.com/100-1824/Inventory_Project',
    accent: '#3DF5C4',
  },
  {
    id: 'aircraft-viz',
    title: 'Aircraft Trajectory Visualization',
    short: 'Trajectory',
    description:
      '3D animated aircraft trajectory system with friendly/hostile detection and ML-based collision avoidance.',
    longDescription:
      'Real-time 3D visualisation of flight paths. An ML classifier distinguishes friendly from hostile aircraft, and a collision-avoidance algorithm re-routes dynamically.',
    highlights: [
      'Real-time 3D flight-path rendering',
      'ML friend/foe classification',
      'Dynamic collision-avoidance re-routing',
    ],
    tags: ['Python', 'ML', '3D Viz'],
    category: 'AI-ML',
    image: '/art/projects/aircraft-viz.webp',
    accent: '#FFB547',
  },
  {
    id: 'restaurant',
    title: 'Restaurant Ordering System',
    short: 'Restaurant Ops',
    description:
      'Full-stack restaurant management platform with order management, authentication, and a feature-rich admin panel.',
    longDescription:
      'Laravel, PHP and MySQL. Customer-facing ordering UI, role-based auth, and an admin panel for menu management, order tracking and reporting.',
    highlights: ['Customer ordering flow', 'Role-based authentication', 'Admin reporting and menu management'],
    tags: ['Laravel', 'PHP', 'MySQL'],
    category: 'Web Dev',
    image: '/art/projects/restaurant.webp',
    accent: '#FFB547',
  },
  {
    id: 'reddit-scraper',
    title: 'Reddit Legal Scraper',
    short: 'Scraper',
    description:
      'Automated Reddit scraper with CSV/MongoDB export and Gemini AI summarisation for legal intelligence gathering.',
    longDescription:
      'Uses PRAW to scrape targeted subreddits; the Gemini API summarises and classifies posts; results export to CSV and MongoDB for downstream analysis.',
    highlights: ['Targeted subreddit collection with PRAW', 'Gemini summarisation and classification', 'CSV + MongoDB export'],
    tags: ['Python', 'PRAW', 'Gemini'],
    category: 'AI-ML',
    image: '/art/projects/reddit-scraper.webp',
    accent: '#FF7A45',
  },
  {
    id: 'hdfs',
    title: 'Mini-HDFS — Distributed File System in Python',
    short: 'HDFS',
    description:
      'A simplified Hadoop-style distributed file system: a master server tracks file metadata while multiple data nodes store and serve files over TCP.',
    longDescription:
      'Implements the core HDFS roles from scratch in Python. The master keeps the namespace and file-to-node map; data nodes store and serve file contents; a client asks the master where a file lives, then uploads to or downloads from the right node. Master and data nodes are multi-threaded socket servers using a JSON request protocol.',
    highlights: [
      'Master / data-node architecture with centralised metadata',
      'Multi-threaded TCP socket servers handling concurrent clients',
      'JSON request protocol for upload, lookup and download',
    ],
    tags: ['Python', 'Sockets', 'Distributed Systems'],
    category: 'Systems',
    image: '/art/projects/hdfs.webp',
    githubUrl: 'https://github.com/100-1824/HDFS',
    accent: '#A98BFF',
  },
];

// ─── Skills ───────────────────────────────────────────────────────────────────

export const skillCategories: SkillCategory[] = [
  {
    id: 'cybersecurity',
    title: 'Offensive & Defensive Security',
    blurb: 'Assessing, breaking and hardening networks — from enumeration to detection engineering.',
    image: '/art/skills/cybersecurity.webp',
    color: '#3DF5C4',
    skills: ['Penetration Testing', 'Vulnerability Assessment', 'Network Security', 'Suricata IDS', 'Packet Capture', 'Hardening'],
  },
  {
    id: 'aiml',
    title: 'AI / ML for Security',
    blurb: 'Models that spot what rules miss.',
    image: '/art/skills/aiml.webp',
    color: '#A98BFF',
    skills: ['Anomaly Detection', 'CNN', 'LSTM', 'Random Forest', 'Double DQN', 'Gemini/GPT'],
  },
  {
    id: 'devops',
    title: 'Cloud & DevOps',
    blurb: 'Shipping and operating infrastructure safely.',
    image: '/art/skills/devops.webp',
    color: '#FFB547',
    skills: ['Docker', 'Kubernetes / AKS', 'AWS', 'Terraform', 'CI/CD', 'Linux'],
  },
  {
    id: 'programming',
    title: 'Programming',
    blurb: 'Automation, tooling and glue.',
    image: '/art/skills/programming.webp',
    color: '#6E8BFF',
    skills: ['Python', 'Bash', 'PHP', 'JavaScript', 'HTML/CSS'],
  },
  {
    id: 'webdev',
    title: 'Full-Stack Web',
    blurb: 'Secure-by-default applications.',
    image: '/art/skills/webdev.webp',
    color: '#3DF5C4',
    skills: ['Laravel', 'Flask', 'REST APIs', 'Full-Stack'],
  },
  {
    id: 'databases',
    title: 'Data',
    blurb: 'Storage for telemetry and apps.',
    image: '/art/skills/databases.webp',
    color: '#6E8BFF',
    skills: ['MongoDB', 'MySQL'],
  },
];

export const toolbelt = [
  'Suricata', 'Wireshark', 'Nmap', 'Burp Suite', 'Metasploit', 'Kali Linux', 'Python', 'TensorFlow',
  'Docker', 'Kubernetes', 'AWS', 'Terraform', 'Laravel', 'Flask', 'MongoDB', 'MySQL', 'Git', 'Linux',
];

// ─── Experience ───────────────────────────────────────────────────────────────

export const experience: ExperienceItem[] = [
  {
    id: 'cis-webhosting',
    role: 'Web Hosting Engineer',
    org: 'COMSATS Internet Services — Technology Park',
    location: 'Islamabad, Pakistan',
    period: '2026 — Present',
    type: 'work',
    current: true,
    bullets: [
      'Managing web hosting infrastructure in the Technology Park Web Hosting Department',
      'Handling server administration, domain management, and client hosting environments',
      'Applying cybersecurity practices to harden hosting environments',
    ],
    accent: '#3DF5C4',
  },
  {
    id: 'nastp',
    role: 'AI/ML Intern',
    org: 'NASTP',
    location: 'Rawalpindi, Pakistan',
    period: 'Jul 2024 — Sep 2024',
    type: 'work',
    bullets: [
      'Developed and trained ML models for real-world defense data',
      'Performed data preprocessing, feature engineering, and model evaluation',
      'Conducted AI research and presented findings to engineering team',
    ],
    accent: '#A98BFF',
  },
  {
    id: 'cis',
    role: 'Cybersecurity Analyst (Intern)',
    org: 'CIS',
    location: 'Islamabad, Pakistan',
    period: 'Aug 2023 — Sep 2023',
    type: 'work',
    bullets: [
      'Conducted vulnerability assessments for enterprise clients',
      'Produced comprehensive OGDCL vulnerability assessment report',
      'Performed network scanning, enumeration, and risk documentation',
    ],
    accent: '#FF5A4E',
  },
  {
    id: 'comsats',
    role: 'BS Software Engineering',
    org: 'COMSATS University Islamabad — Wah Campus',
    location: 'Wah, Pakistan',
    period: '2022 — 2026',
    type: 'education',
    bullets: [
      'Specialisation in Cybersecurity, AI/ML, and Full-Stack Development',
      'Final Year Project: Distributed Intrusion Detection System (DIDS) — 99% detection accuracy',
    ],
    accent: '#6E8BFF',
  },
];

// ─── Certifications ───────────────────────────────────────────────────────────

export const certifications: Certification[] = [
  {
    id: 'isc2-cc',
    title: 'Certified in Cybersecurity (CC)',
    issuer: 'ISC2',
    image: '/art/certs/isc2-cc.webp',
    color: '#A98BFF',
    focus: 'Security principles, incident response & BC/DR, access control, network security, security operations',
  },
  {
    id: 'google-cybersec',
    title: 'Google Professional Cybersecurity',
    issuer: 'Google / Coursera',
    year: '2023',
    image: '/art/certs/google-cybersec.webp',
    color: '#3DF5C4',
    focus: 'SIEM, incident response, network security, Linux & Python for security',
  },
  {
    id: 'cap',
    title: 'Certified AppSec Practitioner',
    issuer: 'The SecOps Group',
    year: '2023',
    image: '/art/certs/cap.webp',
    color: '#6E8BFF',
    focus: 'OWASP Top 10, injection, auth flaws, secure application design',
  },
];

// ─── Stats ────────────────────────────────────────────────────────────────────

export const stats = [
  { label: 'IDS detection accuracy', value: 99, suffix: '%' },
  { label: 'Shipped projects', value: 10, suffix: '+' },
  { label: 'Industry roles', value: 3, suffix: '' },
  { label: 'Certifications', value: 3, suffix: '' },
];

// ─── Navigation ───────────────────────────────────────────────────────────────

export const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#capabilities', label: 'Capabilities' },
  { href: '#work', label: 'Work' },
  { href: '#experience', label: 'Experience' },
  { href: '#credentials', label: 'Credentials' },
  { href: '#contact', label: 'Contact' },
];
