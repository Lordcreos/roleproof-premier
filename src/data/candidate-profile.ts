import type { CandidateProfile } from "../types/domain";

export const candidateProfile: CandidateProfile = {
  id: "leonardo-sanchez",
  slug: "leonardo-sanchez",
  name: "Leonardo Sánchez",
  title: "Frontend & Full-Stack Product Engineer",
  location: "Potsdam · Berlin",
  availability: "Open to product engineering roles",
  workAuthorization: "Based in Germany",
  summary:
    "Frontend and full-stack developer based in the Potsdam/Berlin area, currently studying a Master's in Artificial Intelligence and Data Science. Experienced in React, Next.js, TypeScript, Node.js and NestJS, with a focus on reusable frontend systems, configuration-driven interfaces and practical AI-enabled products.",
  skills: {
    Frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Design systems"],
    Backend: ["Node.js", "NestJS", "Express", "REST APIs", "GraphQL"],
    Product: ["Product prototyping", "Configuration-driven UI", "Microfrontends"],
    "AI & data": ["AI-assisted development", "Data visualization", "Supabase"],
    Quality: ["Jest", "Git", "Accessible UI", "Reusable architecture"],
  },
  experiences: [
    {
      id: "exp-frontend-systems",
      company: "Product engineering work",
      role: "Frontend & Full-Stack Developer",
      period: "Selected professional experience",
      summary:
        "Built reusable, configuration-driven interfaces and full-stack product workflows across multiple domains.",
      highlights: [
        "Designed reusable component systems for complex product interfaces.",
        "Connected React frontends to Node.js and NestJS services.",
        "Worked across product discovery, implementation and iterative delivery.",
      ],
      technologies: ["React", "TypeScript", "Next.js", "Node.js", "NestJS"],
    },
  ],
  projects: [
    {
      id: "project-dynamic-pages",
      name: "Dynamic Pages Platform",
      summary:
        "A configuration-driven platform that renders complex pages and forms from structured definitions.",
      contribution: [
        "Built dynamic forms with conditional validation.",
        "Created reusable UI components and server actions.",
        "Structured the application within a monorepo.",
      ],
      technologies: ["Next.js 14", "TypeScript", "Server Actions", "Monorepo"],
      outcomes: ["Reusable page architecture", "Consistent validation flows"],
    },
    {
      id: "project-erp",
      name: "ERP Platform",
      summary:
        "An operational platform spanning employee onboarding, contracts, payroll and project workflows.",
      contribution: [
        "Developed React microfrontends.",
        "Integrated NestJS microservices.",
        "Connected exchange-rate data to product workflows.",
      ],
      technologies: ["React", "NestJS", "Microfrontends", "Microservices"],
      outcomes: ["Unified operational workflows", "Modular frontend delivery"],
    },
    {
      id: "project-interview-automation",
      name: "Interview Automation Platform",
      summary:
        "An interview experience with recording, permissions, camera and screen handling.",
      contribution: [
        "Implemented complex permission and media flows.",
        "Worked with a dedicated recording microservice.",
        "Added Markdown and KaTeX content support.",
      ],
      technologies: ["React", "TypeScript", "Node.js", "C#", "KaTeX"],
      outcomes: ["Reliable multi-step media UX", "Rich technical content support"],
    },
    {
      id: "project-teacher-dashboard",
      name: "Teacher Dashboard",
      summary:
        "A reading analytics dashboard for teachers managing classes and book assignments.",
      contribution: [
        "Built reading analytics views.",
        "Created heatmap visualizations.",
        "Implemented class and book assignment flows.",
      ],
      technologies: ["Next.js", "Node.js", "GraphQL", "Data visualization"],
      outcomes: ["Actionable reading insights", "Clear class management workflows"],
    },
    {
      id: "project-ai-sales-copilot",
      name: "AI Sales Copilot Prototype",
      summary:
        "A product prototype for AI-assisted lead communication and sales workflows.",
      contribution: [
        "Designed email, SMS and call-script generation flows.",
        "Mapped a practical sales workflow around AI assistance.",
        "Built the concept for rapid hackathon validation.",
      ],
      technologies: ["AI-assisted development", "Product prototyping", "React"],
      outcomes: ["Testable AI product concept", "Multi-channel workflow design"],
    },
  ],
  education: [
    {
      id: "edu-ai-data-science",
      institution: "Master's studies",
      degree: "Artificial Intelligence and Data Science",
      period: "Current",
      detail:
        "Graduate studies focused on practical AI and data-driven product development.",
    },
  ],
  evidence: [
    {
      id: "exp-frontend-systems",
      sourceType: "experience",
      sourceId: "exp-frontend-systems",
      title: "Reusable frontend systems",
      statement:
        "Leonardo has built reusable frontend systems and configuration-driven interfaces with React and TypeScript.",
      technologies: ["React", "TypeScript", "Next.js"],
      tags: ["frontend-architecture", "product-engineering", "reusability"],
    },
    {
      id: "project-dynamic-pages",
      sourceType: "project",
      sourceId: "project-dynamic-pages",
      title: "Dynamic Pages Platform",
      statement:
        "Built a Next.js 14 platform with configuration-driven rendering, dynamic forms, conditional validation and reusable components.",
      technologies: ["Next.js 14", "TypeScript", "Server Actions"],
      tags: ["frontend-architecture", "forms", "monorepo"],
    },
    {
      id: "project-erp",
      sourceType: "project",
      sourceId: "project-erp",
      title: "ERP Platform",
      statement:
        "Worked across React microfrontends and NestJS microservices for operational workflows.",
      technologies: ["React", "NestJS", "Microfrontends", "Microservices"],
      tags: ["full-stack", "distributed-systems", "enterprise-product"],
    },
    {
      id: "project-interview-automation",
      sourceType: "project",
      sourceId: "project-interview-automation",
      title: "Interview Automation Platform",
      statement:
        "Implemented recording, permission, camera and screen workflows across React, Node.js and C# services.",
      technologies: ["React", "TypeScript", "Node.js", "C#"],
      tags: ["media", "permissions", "complex-ux"],
    },
    {
      id: "project-teacher-dashboard",
      sourceType: "project",
      sourceId: "project-teacher-dashboard",
      title: "Teacher Dashboard",
      statement:
        "Built GraphQL-powered reading analytics, heatmaps and class assignment workflows.",
      technologies: ["Next.js", "Node.js", "GraphQL"],
      tags: ["analytics", "visualization", "education"],
    },
    {
      id: "project-ai-sales-copilot",
      sourceType: "project",
      sourceId: "project-ai-sales-copilot",
      title: "AI Sales Copilot",
      statement:
        "Prototyped AI-assisted email, SMS and call-script generation around a real sales workflow.",
      technologies: ["AI-assisted development", "React"],
      tags: ["ai-product", "prototyping", "sales"],
    },
    {
      id: "edu-ai-data-science",
      sourceType: "education",
      sourceId: "edu-ai-data-science",
      title: "AI & Data Science Master's",
      statement:
        "Leonardo is currently studying a Master's in Artificial Intelligence and Data Science.",
      technologies: [],
      tags: ["ai", "data", "education"],
    },
  ],
  links: [
    { label: "GitHub", url: "https://github.com/" },
    { label: "LinkedIn", url: "https://www.linkedin.com/" },
  ],
};
