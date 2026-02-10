export const navLinks = [
  {
    id: 1,
    name: 'Home',
    href: '#home',
  },
  {
    id: 2,
    name: 'About',
    href: '#about',
  },
  {
    id: 3,
    name: 'Projects',
    href: '#Projects',
  },
  {
    id: 4,
    name: 'Certificates',
    href: '#certificates',
  },
  {
    id: 5,
    name: 'Contact',
    href: '#contact',
  },
];

export const myProjects = [
  {
    title: 'Either-Assistant',
    desc: 'EitherAssistant is a cross-platform desktop assistant designed to make everyday computer interaction more accessible and efficient. It enables reliable voice-controlled system actions while prioritizing user privacy and offline functionality.',
    subdesc:
        'Built as a cross-platform desktop application using Avalonia UI for the frontend and Python for the backend, EitherAssistant integrates real-time communication and system automation to deliver a responsive and privacy-focused user experience.',
    href: 'https://github.com/arthavgonda/Automation-Bot',
    texture: '/textures/project/project1.mp4',
    logo: '/assets/project-logo1.png',
    logoStyle: {
      backgroundColor: '#2A1816',
      border: '0.2px solid #36201D',
      boxShadow: '0px 0px 60px 0px #AA3C304D',
    },
    spotlight: '/assets/spotlight1.png',
    tags: [
      {
        id: 1,
        name: 'React.js',
        path: '/assets/react.svg',
      },
      {
        id: 2,
        name: 'TailwindCSS',
        path: 'assets/tailwindcss.png',
      },
      {
        id: 3,
        name: 'TypeScript',
        path: '/assets/typescript.png',
      },
      {
        id: 4,
        name: 'Framer Motion',
        path: '/assets/framer.png',
      },
    ],
  },
  {
    title: 'Advanced Steganography System with Fingerprint-Based Embedding',
    desc: 'A comprehensive steganography toolkit supporting images, audio, video, and text with Bitcoin-style encryption, fingerprint-based pattern embedding, and advanced algorithms (F5, Phase Coding, H.264).',
    subdesc:
        'A secure, multi-format steganography system that hides encrypted data inside images, audio, and video files while preserving their original quality.',
    href: 'https://github.com/arthavgonda/Advanced-Steganography-System-with-Fingerprint-Based-Embedding',
    texture: '/textures/project/project2.mp4',
    logo: '/assets/project-logo2.png',
    logoStyle: {
      backgroundColor: '#13202F',
      border: '0.2px solid #17293E',
      boxShadow: '0px 0px 60px 0px #2F6DB54D',
    },
    spotlight: '/assets/spotlight2.png',
    tags: [
      {
        id: 1,
        name: 'Python',
        path: '/assets/python.svg',
      },
      {
        id: 2,
        name: 'FFmpeg',
        path: 'assets/ffmpeg.svg',
      },
      {
        id: 3,
        name: 'Numpy',
        path: '/assets/numpy.svg',
      },
      {
        id: 4,
        name: 'Scipy',
        path: '/assets/scipy.png',
      },
    ],
  },
  {
    title: 'Smart Academic Scheduling',
    desc: 'A modern academic timetable system built for real institutional workflows.Designed to handle complexity with clarity, scale, and reliability.',
    subdesc:
        'Built using a robust full-stack architecture with FastAPI and React, the system combines intelligent scheduling logic with AI-assisted optimization to manage courses, teachers, classrooms, and institutional constraints—ensuring conflict-free timetables, balanced workloads, and a seamless administrative experience.',
    href: 'https://github.com/arthavgonda/AI_TimeTable',
    texture: '/textures/project/project4.mp4',
    logo: '/assets/project-logo4.png',
    logoStyle: {
      backgroundColor: '#0E1F38',
      border: '0.2px solid #0E2D58',
      boxShadow: '0px 0px 60px 0px #2F67B64D',
    },
    spotlight: '/assets/spotlight4.png',
    tags: [
      {
        id: 1,
        name: 'React.js',
        path: '/assets/react.svg',
      },
      {
        id: 2,
        name: 'TailwindCSS',
        path: 'assets/tailwindcss.png',
      },
      {
        id: 3,
        name: 'TypeScript',
        path: '/assets/python.svg',
      },
      {
        id: 4,
        name: 'Framer Motion',
        path: '/assets/FastAPI.png',
      },
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