import type { ExhibitData } from '../store/useStore';

const baseUrl = import.meta.env.BASE_URL;

// Pictures spaced uniformly - 3.5 units apart
export const exhibits: ExhibitData[] = [
    // LEFT WALL
    {
        id: 'stanford-selection',
        title: 'Stanford University Selection',
        subtitle: 'Academic Selection',
        description: 'Selected for a Stanford academic program, validating global-level merit in technology and innovation.',
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
        description: 'Industry-recognized certification covering applied statistics, ML pipelines, and production-grade data science.',
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
        description: 'Shortlisted application for YC Winter X26 for OPS GenieAI, validating problem relevance and founder signal.',
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
        description: 'Selected through a competitive process for a Microsoft-aligned internship focused on SAP-integrated enterprise systems.',
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
        description: 'Active contributor to AsyncAPI (spec & generators), OpenTelemetry, and Linux Foundation–backed initiatives.',
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
        description: 'Ongoing technical research on optimizing large language model inference pipelines and architectural efficiency for edge-cloud hybrid systems.',
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
        description: 'Admitted with a $31,200 financial aid award (A.J. Drexel Scholarship: $9,600 + Drexel Grant: $21,600), recognizing academic excellence and long-term potential.',
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
        description: 'Certification focused on LLM systems, prompt engineering, enterprise GenAI use cases, and AI deployment patterns.',
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
        description: 'Organized a large-scale hackathon in Pune, leading planning, partnerships, execution, and developer engagement.',
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
        description: 'Built multiple production-grade AI systems including AI IDEs, cancer prediction, biomass forecasting, OCR scrapers, SMS spam detection, and the X-Ray Decision Transparency System.',
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
        description: 'Currently building a SaaS company focused on AI-powered browser extensions, targeting workflow automation and intelligence augmentation.',
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
        description: 'Serving as the Google AI Student Ambassador and currently working as a Software Engineer at Beta Craft Technologies, Pune, building next-gen scalable systems.',
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
