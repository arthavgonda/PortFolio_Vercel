// Self-hosted Draco decoder (was fetched from gstatic.com on every visit).
export const DRACO_PATH = '/draco/';

export const EMAIL = 'anoopnegi311@gmail.com';
export const LOCATION = 'Dehradun, India';

export const socials = [
  { label: 'GitHub', href: 'https://github.com/arthavgonda', icon: '/assets/github.svg' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/anoopsnegi/', icon: '/assets/linkedin.svg' },
  { label: 'Instagram', href: 'https://www.instagram.com/__anoopn', icon: '/assets/instagram.svg' },
];

export const navLinks = [
  { id: 1, name: 'Home', href: '#home' },
  { id: 2, name: 'About', href: '#about' },
  { id: 3, name: 'Experience', href: '#experience' },
  { id: 4, name: 'Projects', href: '#projects' },
  { id: 5, name: 'Certificates', href: '#certificates' },
  { id: 6, name: 'Contact', href: '#contact' },
];

// From Anoop's résumé, most recent first. **text** renders as emphasis.
export const experience = [
  {
    company: 'Infosys',
    role: 'iOS Engineering Intern',
    period: 'Jun 2026 – Jul 2026',
    start: '2026-06', // machine-readable months for the 3D timeline (end inclusive)
    end: '2026-07',
    tape: 'INFOSYS',
    location: 'On-site',
    points: [
      'Designed the UI for a Retail Management Store app, seamlessly integrating 4 distinct user roles (admin, sales associate, manager and end worker) into a unified application.',
      'Implemented client-server API communication using Supabase Functions and **type-safe request/response models**, ensuring reliable data synchronization and achieving **zero crash reports**.',
      'Leveraged **Jira** to assign and track tasks across team members over three sessions, ensuring efficient workload distribution and maintaining **zero task backlog**.',
    ],
    tags: ['iOS', 'Supabase', 'Jira'],
  },
  {
    company: 'Graphic Era University',
    team: 'iOS Development Center',
    role: 'iOS Developer (Training Program)',
    period: 'Aug 2025 – May 2026',
    start: '2025-08',
    end: '2026-05',
    tape: 'GRAPHIC ERA  ·  iOS DEVELOPMENT CENTER',
    location: 'Dehradun, India',
    points: [
      'Selected for a year-long advanced iOS development program focused on **Swift, UIKit, REST APIs, AWS** and App Store deployment, graduating among the **Top 100** participants.',
      'Developed **Blooma**, a personalized pregnancy companion app built with UIKit, Firebase and S3, supporting **100+ beta users**.',
      'Designed REST APIs, integrated **AWS S3** cloud storage, and led release engineering within a **4-member team**, successfully deploying builds through TestFlight.',
    ],
    tags: ['Swift', 'UIKit', 'Firebase', 'AWS S3', 'TestFlight'],
  },
];

// Copy is drawn from each repository's README. Monitor videos: Setu is the
// repo's own demo recording, GRAP pans over its architecture diagram, and
// CoolCommute is a title card until a screen recording of the app exists.
export const myProjects = [
  {
    title: 'Setu',
    desc: 'An open-source, local-first AI voice assistant for Linux, Windows and macOS. Say “Hey Setu” and it operates almost any app on your computer, from browsers and IDEs to media, windows and system settings, with speech recognition, the language model and the voice all running on-device.',
    subdesc:
        'A Rust daemon handles the microphone, wake word, routing and tools, and starts sandboxed engines for speech-to-text, a local LLM through llama.cpp and text-to-speech. A Qt 6 / QML shell draws the notch UI, and apps are driven through each OS’s accessibility layer (UI Automation, AX, AT-SPI).',
    href: 'https://github.com/arthavgonda/SETU',
    texture: '/textures/project/setu.mp4',
    logo: '/assets/projects/setu.svg',
    logoStyle: {
      backgroundColor: '#2A1816',
      border: '0.2px solid #36201D',
      boxShadow: '0px 0px 60px 0px #B93E0B4D',
    },
    spotlight: '/assets/spotlight1.webp',
    tags: [
      { id: 1, name: 'Rust', path: '/assets/tech/rust.svg' },
      { id: 2, name: 'Qt 6 / QML', path: '/assets/tech/qt.svg' },
      { id: 3, name: 'C++', path: '/assets/tech/cplusplus.svg' },
    ],
  },
  {
    title: 'GRAP',
    desc: 'A parametric income-insurance platform for India’s gig delivery workers. When objective signals such as rainfall, air quality or a city-wide shutdown cross their thresholds, claims trigger and pay out automatically: no forms, no phone calls, no waiting.',
    subdesc:
        'An event-driven microservice system. Weather and AQI feeds stream into Kafka, Flink jobs score ward-level risk in real time, a 9-state claim automaton and a 4-layer fraud engine validate every claim, and a Tweedie GLM reprices weekly premiums. Node.js and Python services on MongoDB and Redis, with a React dashboard.',
    href: 'https://github.com/arthavgonda/GRAP',
    texture: '/textures/project/grap.mp4',
    logo: '/assets/projects/grap.svg',
    logoStyle: {
      backgroundColor: '#0F2A1E',
      border: '0.2px solid #14382A',
      boxShadow: '0px 0px 60px 0px #1E9E624D',
    },
    spotlight: '/assets/spotlight3.webp',
    tags: [
      { id: 1, name: 'Apache Kafka', path: '/assets/tech/apachekafka.svg' },
      { id: 2, name: 'Python', path: '/assets/python.svg' },
      { id: 3, name: 'Node.js', path: '/assets/tech/nodedotjs.svg' },
      { id: 4, name: 'React', path: '/assets/react.svg' },
    ],
  },
  {
    title: 'CoolCommute',
    desc: 'A cross-platform app that helps people in hot, polluted cities choose commute routes that cut their exposure to heat and dirty air, and nudges them towards public transport so fewer private vehicles end up on the road.',
    subdesc:
        'One Expo / React Native codebase for iOS, Android and web, with a glassmorphism UI drawn in React Native Skia and Lottie-animated onboarding. Sign-in runs on AWS Cognito, and user profiles sync through Amazon API Gateway.',
    href: 'https://github.com/arthavgonda/CoolCommute',
    texture: '/textures/project/coolcommute.mp4',
    logo: '/assets/projects/coolcommute.svg',
    logoStyle: {
      backgroundColor: '#1B1530',
      border: '0.2px solid #261D45',
      boxShadow: '0px 0px 60px 0px #7C5CFF4D',
    },
    spotlight: '/assets/spotlight5.webp',
    tags: [
      { id: 1, name: 'React Native', path: '/assets/react.svg' },
      { id: 2, name: 'Expo', path: '/assets/tech/expo.svg' },
      { id: 3, name: 'TypeScript', path: '/assets/typescript.png' },
      { id: 4, name: 'AWS', path: '/assets/tech/amazonaws.svg' },
    ],
  },
];

export const calculateSizes = (isSmall, isMobile, isTablet) => {
  return {
    deskScale: isSmall ? 0.05 : isMobile ? 0.06 : 0.065,
    deskPosition: isMobile ? [0.5, -4.5, 0] : [0.25, -5.5, 0],
    cubePosition: isSmall ? [4, -5, 0] : isMobile ? [5, -5, 0] : isTablet ? [5, -5, 0] : [9, -5.5, 0],
    reactLogoPosition: isSmall ? [3, 4, 0] : isMobile ? [5, 4, 0] : isTablet ? [5, 4, 0] : [10, 3, 0],
    ringPosition: isSmall ? [9, 6, 0] : isMobile ? [-9, 6, 0] : isTablet ? [-12, 6, 0] : [-9, 6, 0],
    targetPosition: isSmall ? [-5, -10, -10] : isMobile ? [-9, -10, -10] : isTablet ? [-11, -7, -10] : [-13, -13, -10],
  };
};

export const workExperiences = [
  {
    id: 1,
    name: 'Framer',
    pos: 'Lead Web Developer',
    duration: '2022 - Present',
    title: "Framer serves as my go-to tool for creating interactive prototypes. I use it to bring designs to  life, allowing stakeholders to experience the user flow and interactions before development.",
    icon: '/assets/framer.svg',
    animation: 'victory',
  },
  {
    id: 2,
    name: 'Figma',
    pos: 'Web Developer',
    duration: '2020 - 2022',
    title: "Figma is my collaborative design platform of choice. I utilize it to work seamlessly with team members and clients, facilitating real-time feedback and design iterations. Its cloud-based.",
    icon: '/assets/figma.svg',
    animation: 'clapping',
  },
  {
    id: 3,
    name: 'Notion',
    pos: 'Junior Web Developer',
    duration: '2019 - 2020',
    title: "Notion helps me keep my projects organized. I use it for project management, task tracking, and as a central hub for documentation, ensuring that everything from design notes to.",
    icon: '/assets/notion.svg',
    animation: 'salute',
  },
];

// Shown in the About section's tech orbit. Drawn from the project tags above.
export const techStack = {
  inner: [
    { name: 'Python', icon: '/assets/python.svg' },
    { name: 'React', icon: '/assets/react.svg' },
    { name: 'TypeScript', icon: '/assets/typescript.png' },
  ],
  outer: [
    { name: 'Rust', icon: '/assets/tech/rust.svg' },
    { name: 'Qt', icon: '/assets/tech/qt.svg' },
    { name: 'C++', icon: '/assets/tech/cplusplus.svg' },
    { name: 'Kafka', icon: '/assets/tech/apachekafka.svg' },
    { name: 'Node.js', icon: '/assets/tech/nodedotjs.svg' },
    { name: 'AWS', icon: '/assets/tech/amazonaws.svg' },
  ],
};

export const certificateImages = [1, 2, 3, 4, 5].map((n) => `/certificates-${n}.webp`);
