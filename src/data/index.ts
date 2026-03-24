// ─── Types ────────────────────────────────────────────────────────────────────

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  tags: string[];
  category: 'Cybersecurity' | 'AI-ML' | 'Web Dev';
  featured?: boolean;
  githubUrl?: string;
  liveUrl?: string;
  accent: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  icon: string;
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
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  year: string;
  icon: string;
  color: string;
  verifyUrl?: string;
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export const projects: Project[] = [
  {
    id: 'dids',
    title: 'DIDS — Distributed Intrusion Detection System',
    description:
      'Cloud-based distributed IDS combining Suricata with CNN/LSTM neural networks and Double DQN reinforcement learning for 99% detection accuracy.',
    longDescription:
      'Final Year Project. Suricata captures network traffic; CNN/LSTM pipelines classify threats in real time; Double DQN agent adapts detection thresholds. Deployed on Kubernetes with Docker, live monitoring dashboard.',
    tags: ['Python', 'Suricata', 'Deep Learning', 'Docker', 'Kubernetes'],
    category: 'Cybersecurity',
    featured: true,
    accent: '#38BDF8',
  },
  {
    id: 'iuj',
    title: 'IUJ Website — Islamabad Union of Journalists',
    description:
      'Official website for the Islamabad Union of Journalists featuring press releases, photo albums, member database, and admin panel with cPanel–GitHub sync.',
    longDescription:
      'Built with Laravel + PHP + MySQL. Full admin panel for press releases, photo management, and member database. Automated cPanel–GitHub deployment pipeline.',
    tags: ['Laravel', 'PHP', 'MySQL', 'Bootstrap'],
    category: 'Web Dev',
    featured: true,
    accent: '#10B981',
  },
  {
    id: 'legal-intel',
    title: 'Legal Demand Intelligence',
    description:
      'AI-powered Reddit scraper using Gemini 1.5 Flash to identify legal leads, with a real-time dashboard, MongoDB storage, and email/webhook alerts.',
    longDescription:
      'Flask backend scrapes Reddit for legal intent signals; Gemini 1.5 Flash summarizes and scores leads; MongoDB stores results; email and webhook notifications on high-score leads.',
    tags: ['Flask', 'Python', 'Gemini', 'MongoDB'],
    category: 'AI-ML',
    featured: true,
    accent: '#8B5CF6',
  },
  {
    id: 'aircraft-viz',
    title: 'Aircraft Trajectory Visualization',
    description:
      '3D animated aircraft trajectory system with friendly/hostile detection and ML-based collision avoidance.',
    longDescription:
      'Real-time 3D visualization of flight paths. ML classifier distinguishes friendly from hostile aircraft. Collision avoidance algorithm with dynamic re-routing.',
    tags: ['Python', 'ML', '3D Viz'],
    category: 'AI-ML',
    accent: '#F59E0B',
  },
  {
    id: 'restaurant',
    title: 'Restaurant Ordering System',
    description:
      'Full-stack restaurant management platform with order management, authentication, and a feature-rich admin panel.',
    longDescription:
      'Laravel + PHP + MySQL. Customer-facing ordering UI, role-based auth, admin panel for menu management, order tracking, and reporting.',
    tags: ['Laravel', 'PHP', 'MySQL'],
    category: 'Web Dev',
    accent: '#10B981',
  },
  {
    id: 'reddit-scraper',
    title: 'Reddit Legal Scraper',
    description:
      'Automated Reddit scraper with CSV/MongoDB export and Gemini AI summarization for legal intelligence gathering.',
    longDescription:
      'Uses PRAW to scrape targeted subreddits; Gemini API summarizes and classifies posts; exports to CSV and MongoDB for downstream analysis.',
    tags: ['Python', 'PRAW', 'Gemini'],
    category: 'AI-ML',
    accent: '#F97316',
  },
];

// ─── Skills ───────────────────────────────────────────────────────────────────

export const skillCategories: SkillCategory[] = [
  {
    id: 'programming',
    title: 'Programming',
    icon: '⌨',
    color: '#38BDF8',
    skills: ['Python', 'PHP', 'Laravel', 'JavaScript', 'Bash', 'HTML/CSS'],
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity',
    icon: '🛡',
    color: '#EF4444',
    skills: [
      'Penetration Testing',
      'Network Security',
      'Suricata',
      'Packet Capture',
    ],
  },
  {
    id: 'aiml',
    title: 'AI / ML',
    icon: '🧠',
    color: '#8B5CF6',
    skills: [
      'Anomaly Detection',
      'Random Forest',
      'LSTM',
      'CNN',
      'Gemini/GPT Analysis',
    ],
  },
  {
    id: 'devops',
    title: 'DevOps',
    icon: '⚙',
    color: '#F59E0B',
    skills: ['Docker', 'Git', 'Linux', 'CI/CD', 'AKS', 'AWS', 'Terraform'],
  },
  {
    id: 'webdev',
    title: 'Web Dev',
    icon: '🌐',
    color: '#10B981',
    skills: ['Full-Stack', 'REST APIs', 'Flask', 'Laravel'],
  },
  {
    id: 'databases',
    title: 'Databases',
    icon: '🗄',
    color: '#06B6D4',
    skills: ['MongoDB', 'MySQL'],
  },
];

// ─── Experience ───────────────────────────────────────────────────────────────

export const experience: ExperienceItem[] = [
  {
    id: 'cis-webhosting',
    role: 'Web Hosting Engineer',
    org: 'COMSATS Internet Services — Technology Park',
    location: 'Islamabad, Pakistan',
    period: '2026 – Present',
    type: 'work',
    bullets: [
      'Managing web hosting infrastructure in the Technology Park Web Hosting Department',
      'Handling server administration, domain management, and client hosting environments',
      'Applying cybersecurity practices to harden hosting environments',
    ],
    accent: '#38BDF8',
  },
  {
    id: 'nastp',
    role: 'AI/ML Intern',
    org: 'NASTP',
    location: 'Rawalpindi, Pakistan',
    period: 'Jul 2024 – Sep 2024',
    type: 'work',
    bullets: [
      'Developed and trained ML models for real-world defense data',
      'Performed data preprocessing, feature engineering, and model evaluation',
      'Conducted AI research and presented findings to engineering team',
    ],
    accent: '#38BDF8',
  },
  {
    id: 'cis',
    role: 'Cybersecurity Analyst (Intern)',
    org: 'CIS',
    location: 'Islamabad, Pakistan',
    period: 'Aug 2023 – Sep 2023',
    type: 'work',
    bullets: [
      'Conducted vulnerability assessments for enterprise clients',
      'Produced comprehensive OGDCL vulnerability assessment report',
      'Performed network scanning, enumeration, and risk documentation',
    ],
    accent: '#EF4444',
  },
  {
    id: 'comsats',
    role: 'BS Software Engineering',
    org: 'COMSATS University Islamabad — Wah Campus',
    location: 'Wah, Pakistan',
    period: '2022 – 2026',
    type: 'education',
    bullets: [
      'Graduated with specialization in Cybersecurity, AI/ML, and Full-Stack Development',
      'Final Year Project: Distributed Intrusion Detection System (DIDS) — 99% detection accuracy',
    ],
    accent: '#10B981',
  },
];

// ─── Certifications ───────────────────────────────────────────────────────────

export const certifications: Certification[] = [
  {
    id: 'google-cybersec',
    title: 'Google Professional Cybersecurity',
    issuer: 'Google / Coursera',
    year: '2023',
    icon: 'G',
    color: '#38BDF8',
  },
  {
    id: 'cap',
    title: 'Certified AppSec Practitioner',
    issuer: 'SecOps Group',
    year: '2023',
    icon: 'S',
    color: '#10B981',
  },
];

// ─── Stats ────────────────────────────────────────────────────────────────────

export const stats = [
  { label: 'Projects', value: 6, suffix: '+' },
  { label: 'Experience', value: 3, suffix: '' },
  { label: 'Certifications', value: 2, suffix: '' },
];

// ─── Navigation ───────────────────────────────────────────────────────────────

export const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#certifications', label: 'Certs' },
  { href: '#contact', label: 'Contact' },
];
