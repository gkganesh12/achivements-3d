import type { ExhibitData } from '../store/useStore';

const baseUrl = import.meta.env.BASE_URL;

// Pictures spaced uniformly - 3.5 units apart
export const exhibits: ExhibitData[] = [
    // LEFT WALL
    {
        id: 'stanford-selection',
        title: 'Stanford University Selection',
        subtitle: 'Academic Selection',
        description: 'Being shortlisted by Stanford represents recognition at a global benchmark of academic and innovation excellence. The evaluation acknowledged not only academic performance, but also hands-on engineering execution, problem-solving maturity, and product-oriented thinking. This milestone reinforces my commitment toward building high-impact, globally scalable technology platforms.',
        year: '2024',
        type: 'achievement',
        color: '#000000',
        position: { x: -3.5, z: 1.5 },
        wall: 'left',
        logo: `${baseUrl}stan.png`,
        documents: [
            {
                type: 'offer-letter',
                name: 'Stanford Offer Letter',
                url: '' // Upload path will be added here
            }
        ]
    },
    {
        id: 'oracle-data-science',
        title: 'Oracle Data Science Professional',
        subtitle: 'Professional Certification',
        description: 'Earning the Oracle Data Science Professional certification represents validated proficiency in applied machine learning, statistical modeling, and production-grade data workflows within enterprise environments. The certification emphasizes not just theoretical understanding, but real-world execution across data preparation, feature engineering, model evaluation, and scalable deployment pipelines — aligning strongly with my work in AI-driven products, intelligence systems, and automation platforms.',
        year: '2024',
        type: 'certification',
        color: '#000000',
        position: { x: -3.5, z: -2.0 },
        wall: 'left',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Oracle_logo.svg/200px-Oracle_logo.svg.png',
        externalLinks: [
            {
                label: 'View Certification',
                url: 'https://drive.google.com/file/d/1xH9KiXr1b4dH7FnxPkL0o_1gjvsSirXd/view?usp=sharing'
            }
        ]
    },
    {
        id: 'ycombinator-selection',
        title: 'Y Combinator Application Selection',
        subtitle: 'Startup Accelerator — Application Stage',
        description: 'Being selected through the Y Combinator application process for OpsGenie AI represents validation of product vision, technical execution, and real-world problem framing in AI-driven automation for small and mid-sized businesses. OpsGenie AI was designed as an intelligent automation platform that acts as a centralized operational brain for SMBs — monitoring signals across business tools, detecting actionable events, prioritizing tasks, and automatically orchestrating workflows using AI agents.',
        year: '2024',
        type: 'achievement',
        color: '#000000',
        position: { x: -3.5, z: -5.5 },
        wall: 'left'
    },
    {
        id: 'microsoft-internship',
        title: 'Microsoft SAP-Powered Internship',
        subtitle: 'Competitive Internship',
        description: 'Completed a three-month industry internship under a Microsoft–SAP powered program, focused on applying machine learning models to real-world enterprise data problems. Designed and implemented predictive models for SMS Spam Detection (classification pipelines for fraudulent messaging patterns) and Email Spam Detection (supervised learning for improved filtering accuracy). The work involved end-to-end model development including data preprocessing, feature engineering, model training, evaluation, and performance optimization — translating raw datasets into deployable intelligence systems.',
        year: '2024',
        type: 'achievement',
        color: '#000000',
        position: { x: -3.5, z: -9.0 },
        wall: 'left'
    },
    {
        id: 'open-source-contributor',
        title: 'Open Source Contributor',
        subtitle: 'Open Source / Standards',
        description: 'Active open-source contributor across high-impact projects including AsyncAPI, OpenTelemetry, and Metasploit, operating within globally maintained, production-grade codebases. Key contributions: AsyncAPI — authored and merged two production pull requests improving specification validation and security handling; Metasploit — delivered one accepted PR contributing to exploit framework stability; OpenTelemetry — participated in issue analysis and observability pipeline understanding. These contributions required deep codebase comprehension, secure coding practices, test-driven validation, and alignment with strict maintainer review processes.',
        year: '2024–2025',
        type: 'project',
        color: '#000000',
        position: { x: -3.5, z: -12.5 },
        wall: 'left',
        externalLinks: [
            {
                label: 'GitHub Profile',
                url: 'https://github.com/gkganesh12'
            }
        ]
    },
    {
        id: 'ai-research-publication',
        title: 'AI Research (In Progress)',
        subtitle: 'Advanced LLM Optimization',
        description: 'Applied AI research focused on combating large-scale counterfeiting within the medical supply chain, particularly falsification of pharmaceutical salts and traceability records. Building an end-to-end trust and intelligence platform integrating blockchain smart contracts for immutable provenance tracking, tamper-resistant verification workflows, LLM-powered inference pipelines for anomaly detection, and continual learning models. Leading blockchain architecture and smart contract development including lifecycle modeling, on-chain/off-chain integration, and security controls. This research contributes toward strengthening public health safety and pharmaceutical infrastructure resilience.',
        year: '2025',
        type: 'achievement',
        color: '#000000',
        position: { x: -3.5, z: -16.0 },
        wall: 'left'
    },

    // RIGHT WALL
    {
        id: 'drexel-selection',
        title: 'Drexel University Selection',
        subtitle: 'Academic Selection + Financial Aid',
        description: 'Selected by Drexel University through a competitive evaluation process and awarded a $31,200 merit-based scholarship, recognizing strong academic performance, technical capability, and demonstrated potential in engineering and applied technology. This award reflects consistent achievement across advanced coursework, hands-on engineering projects, open-source contributions, and entrepreneurial problem-solving — aligning with Drexels emphasis on experiential learning and industry-integrated education.',
        year: '2024',
        type: 'achievement',
        color: '#000000',
        position: { x: 3.5, z: 1.5 },
        wall: 'right',
        logo: `${baseUrl}dre.png`,
        externalLinks: [
            {
                label: 'View Details',
                url: 'https://ibb.co/nMMfh1NB'
            }
        ]
    },
    {
        id: 'oracle-genai',
        title: 'Oracle Generative AI Professional',
        subtitle: 'Professional Certification',
        description: 'Oracle Generative AI Professional certification validates applied expertise in designing, deploying, and optimizing large language model–driven systems within enterprise environments. Emphasizes real-world implementation across prompt engineering and orchestration pipelines, LLM integration into production applications, model evaluation and safety considerations, data grounding, retrieval augmentation, and reliability patterns. This strengthens end-to-end capability in building AI-native products that deliver measurable business impact, reliability, and long-term maintainability.',
        year: '2024',
        type: 'certification',
        color: '#000000',
        position: { x: 3.5, z: -2.0 },
        wall: 'right',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Oracle_logo.svg/200px-Oracle_logo.svg.png',
        externalLinks: [
            {
                label: 'View Certification',
                url: 'https://drive.google.com/file/d/1Nq-hCXnfKxTxc4ORitTkMHhb9plbf_28/view?usp=sharing'
            }
        ]
    },
    {
        id: 'hackeverse-organizer',
        title: 'Hackeverse Hackathon — Organizer',
        subtitle: 'Leadership / Community Building',
        description: 'Led the organization of a large-scale developer hackathon in Pune, driving end-to-end planning, partnerships, logistics, and execution while building strong engagement across the local tech community. Owned sponsorship coordination, participant onboarding, event operations, and developer experience — enabling a high-energy environment focused on innovation, collaboration, and real-world problem solving. This initiative strengthened leadership in cross-functional execution, stakeholder management, and community-driven ecosystem building.',
        year: '2024',
        type: 'achievement',
        color: '#000000',
        position: { x: 3.5, z: -5.5 },
        wall: 'right'
    },
    {
        id: 'ai-projects-portfolio',
        title: 'Applied AI Systems Portfolio',
        subtitle: 'Engineering / Research Projects',
        description: 'Built multiple production-grade AI systems spanning developer tooling, healthcare intelligence, forecasting, automation, and explainable decision systems. Key systems include: AI IDEs and developer productivity tooling, cancer prediction and diagnostic modeling pipelines, biomass forecasting systems for sustainability analytics, OCR-driven data extraction and automation pipelines, SMS spam detection and classification systems, and X-Ray Decision Transparency System for explainable AI validation. These projects demonstrate end-to-end ownership across data pipelines, model development, system integration, and deployment.',
        year: '2023–2025',
        type: 'project',
        color: '#000000',
        position: { x: 3.5, z: -9.0 },
        wall: 'right',
        externalLinks: [
            {
                label: 'GitHub Profile',
                url: 'https://github.com/gkganesh12'
            }
        ]
    },
    {
        id: 'founder-saas',
        title: 'Founder, AI Browser-Based SaaS',
        subtitle: 'Startup / Product Building',
        description: 'Currently building Aletheia, a browser-native AI SaaS platform focused on workflow automation and intelligence augmentation for knowledge workers, developers, and operational teams. The platform transforms the browser into an intelligent workspace by capturing live context across tabs, enabling AI agents to reason over real-time activity, automating repetitive operational tasks, and delivering persistent memory and contextual intelligence inside everyday web usage. Designed to move beyond chatbot-style interaction toward continuous, context-aware intelligence embedded directly into user workflows.',
        year: '2025',
        type: 'project',
        color: '#000000',
        position: { x: 3.5, z: -12.5 },
        wall: 'right'
    },
    {
        id: 'google-ai-ambassador',
        title: 'Google AI Student Ambassador',
        subtitle: 'Beta Craft Technologies | Pune',
        description: 'Selected as a Google AI Student Ambassador, representing and promoting applied AI learning, experimentation, and responsible technology adoption within the student developer community. Actively engaged in driving awareness of modern AI tools and best practices, organizing peer learning initiatives and workshops, supporting hands-on experimentation and real-world project adoption, and building community-driven learning ecosystems around emerging AI capabilities. This role strengthened leadership in technical advocacy, community enablement, and scalable knowledge sharing.',
        year: '2025',
        type: 'achievement',
        color: '#000000',
        position: { x: 3.5, z: -16.0 },
        wall: 'right'
    }
];

export const profileData = {
    name: 'Ganesh Khetawat',
    tagline: 'System, Journey, Outcomes',
    bio: [
        "I am Ganesh Khetawat. I build systems, products, and design workflows with clarity and intent. I focus on behavior, structure, and outcomes - not just visuals. Each milestone builds the next. Move through the space to see how I think, learn, and build forward momentum."
    ],
    position: { x: 0, z: -18.0 } // Moved back to fit more exhibits
};
