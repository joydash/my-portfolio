/**
 * Single source of truth for all portfolio content.
 * Edit any field here and the site updates automatically.
 * Content is drawn only from Joy Dash's CV and LinkedIn profile — add new
 * projects, certifications or roles by adding objects to the arrays below.
 */

export const site = {
  name: "Joy Dash",
  initials: "JD",
  url: "https://joydash.me",
  email: "info@joydash.me",
  linkedin: "https://www.linkedin.com/in/joy-dash/",
  github: "https://github.com/joydash",
  location: "Dhaka, Bangladesh",
  designation: "Support Engineer",
  focus: "Corporate Network Operations & Enterprise IT Infrastructure",
  availability: "AVAILABLE FOR BANKING & ENTERPRISE IT ROLES",
  /** Hero portrait: transparent cut-out so it blends with the dark background. Replace the file to swap it. */
  portrait: {
    src: "/images/portrait.webp",
    width: 816,
    height: 872,
    alt: "Portrait of Joy Dash, Support Engineer",
  },
  /** Bump the ?v= number whenever you replace public/cv.pdf so phones and browsers never show an old copy. */
  cvPath: "/cv.pdf?v=3",
  cvDownloadName: "Joy-Dash-CV.pdf",
  headline:
    "Support Engineer — Corporate Network Operations & Enterprise IT Infrastructure",
  valueProposition:
    "I keep enterprise connectivity available — MikroTik edge routing with BGP and OSPF, FTTH access networks and NOC incident response under strict SLAs. Backed by an MTCNA certification and a B.Sc. in Computer Science & Engineering, I bring a reliability-first, documentation-driven approach to Banking IT infrastructure.",
  description:
    "Joy Dash — Support Engineer specialising in corporate network operations, MikroTik BGP/OSPF routing, FTTH/OLT infrastructure and SLA-driven incident management. Seeking Banking & Enterprise IT infrastructure roles.",
} as const;

export const navLinks = [
  { id: "about", label: "About" },
  { id: "pillars", label: "Pillars" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "toolkit", label: "Toolkit" },
  { id: "certifications", label: "Certifications" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
] as const;

export const about = {
  paragraphs: [
    "I am a Support Engineer at Carnival Internet, a nationwide ISP and enterprise connectivity provider, where I handle Tier 2/3 support for corporate and retail subscribers. My day-to-day is the work banks depend on: isolating Layer 2/Layer 3 faults, diagnosing fiber and optical link incidents, coordinating NOC, field and gateway teams, and closing every incident with clear root-cause documentation.",
    "I configure core MikroTik routers with BGP and OSPF, apply PCC for multi-WAN load balancing and PCQ for fair bandwidth allocation, and administer BDCOM OLT platforms for FTTH access. Alongside the job I am completing a B.Sc. in Computer Science & Engineering, building the software and systems foundation to grow into Network & Infrastructure, IT Operations and Banking Technology roles.",
  ],
};

export const heroStats = [
  { label: "Tier 2/3", detail: "NOC & corporate support" },
  { label: "MTCNA", detail: "MikroTik certified" },
  { label: "B.Sc. CSE", detail: "Uttara University" },
] as const;

export type Highlight = {
  stat: string;
  title: string;
  text: string;
  icon: "activity" | "network" | "server" | "cap";
};

export const highlights: Highlight[] = [
  {
    stat: "TIER 2/3",
    title: "Corporate network operations",
    text: "SLA-bound support for corporate and retail subscribers at a nationwide ISP.",
    icon: "activity",
  },
  {
    stat: "BGP · OSPF",
    title: "High-availability routing",
    text: "MikroTik edge routing with PCC multi-WAN load balancing for maximum uptime.",
    icon: "network",
  },
  {
    stat: "GPON / EPON",
    title: "FTTH & data center operations",
    text: "BDCOM OLT/ONU provisioning, structured cabling and patch panel management.",
    icon: "server",
  },
  {
    stat: "B.Sc. CSE",
    title: "Engineering foundation",
    text: "B.Sc. in CSE at Uttara University — alongside MikroTik MTCNA certification.",
    icon: "cap",
  },
];

export type Pillar = {
  title: string;
  summary: string;
  points: string[];
  tags: string[];
  icon: "network" | "server" | "shield";
};

export const pillars: Pillar[] = [
  {
    title: "Enterprise Network & Uptime Reliability",
    summary:
      "Resilient routing and switching, diagnosed fast and escalated cleanly when SLAs are on the line.",
    points: [
      "MikroTik routing with BGP and OSPF",
      "PCC multi-WAN load balancing to maximise uptime",
      "VLAN segmentation and trunking, L2/L3 diagnostics",
      "SLA-driven incident resolution and escalation",
    ],
    tags: ["BGP", "OSPF", "VLAN", "PCC", "SLA"],
    icon: "network",
  },
  {
    title: "Access, FTTH & Data Center Operations",
    summary:
      "Physical-layer discipline: from optical power budgets to clean racks and labelled patch panels.",
    points: [
      "BDCOM OLT administration, GPON/EPON provisioning",
      "ONU registration and optical power-loss diagnosis",
      "Rack layouts, structured cabling and patch panels",
      "Fiber cut isolation with field and gateway teams",
    ],
    tags: ["OLT", "GPON/EPON", "Fiber", "Cabling"],
    icon: "server",
  },
  {
    title: "Monitoring, Incident Management & Documentation",
    summary:
      "Structured incident lifecycle and audit-friendly records — what regulated environments expect.",
    points: [
      "Network health monitoring with Zabbix and PRTG",
      "Severity classification, escalation and live status updates",
      "Post-incident root-cause analysis (RCA) reports",
      "Ticket logging and SLA compliance reporting",
    ],
    tags: ["Zabbix", "PRTG", "RCA", "ITSM"],
    icon: "shield",
  },
];

export type Experience = {
  id: string;
  role: string;
  company: string;
  companyNote?: string;
  logos?: { src: string; alt: string; width: number; height: number }[];
  period: string;
  location: string;
  current?: boolean;
  bullets: string[];
  tags: string[];
};

export const experience: Experience[] = [
  {
    id: "carnival",
    role: "Support Engineer",
    company: "Carnival Internet",
    companyNote: "A Brand of Systems Solutions & Development Technologies Ltd. (SSD-TECH)",
    logos: [
      { src: "/images/carnival.png", alt: "Carnival Internet logo", width: 157, height: 67 },
      { src: "/images/ssd-tech.png", alt: "SSD-TECH logo", width: 159, height: 50 },
    ],
    period: "Jan 2026 – Present",
    location: "Dhaka, Bangladesh",
    current: true,
    bullets: [
      "Provide Tier 2/3 technical support for high-value corporate and retail subscribers under strict SLA timelines.",
      "Configure and maintain core MikroTik routers — PCQ for equitable bandwidth allocation and PCC for multi-WAN load balancing to maximise uptime.",
      "Administer BDCOM OLT platforms: provision GPON/EPON interfaces, manage ONU registrations and diagnose optical power loss.",
      "Monitor network health alerts, isolate bottlenecks, and coordinate NOC, transmission, field and gateway teams on fiber cuts and upstream routing anomalies to shorten time-to-repair.",
      "Own the incident lifecycle: ticket logging, fault prioritisation, escalation, live status updates and post-incident root-cause documentation.",
      "Assist with data center integrity — rack layouts, structured cabling, patch panel management and proactive hardware health monitoring.",
    ],
    tags: ["MikroTik", "BGP", "OSPF", "PCC/PCQ", "BDCOM OLT", "SLA", "RCA"],
  },
  {
    id: "triangle",
    role: "Deputy Assistant Engineer (FCR)",
    company: "Triangle Services Limited",
    period: "Sep 2024 – Jan 2026",
    location: "Dhaka, Bangladesh",
    bullets: [
      "Diagnosed and resolved customer connectivity faults and L2/L3 issues, collaborating with NOC and field teams to escalate complex network faults.",
      "Monitored network performance and reported service disruptions, contributing to improved SLA compliance.",
      "Configured and maintained CPE devices (routers, modems) and guided customers through setup and diagnostics.",
      "Provisioned new connections and verified correct service activation.",
      "Maintained detailed ticket documentation, logs and reports to surface recurring problems and recommend improvements.",
    ],
    tags: ["Troubleshooting", "CPE", "FTTH/GPON", "Zabbix", "PRTG", "MikroTik", "Cisco"],
  },
  {
    id: "onesky",
    role: "Data Center Intern (Networking)",
    company: "One Sky Communications Limited",
    period: "Jul 2024 – Sep 2024",
    location: "Motijheel, Dhaka",
    bullets: [
      "Trained in OLT management, IPv4 addressing, subnetting, VLAN configuration and real-time NOC fault monitoring.",
      "Collaborated on a team project to design and implement a new network for a client.",
      "Practised MikroTik OS, hardware and network troubleshooting, with a focus on bandwidth management.",
      "Received positive feedback from trainers, colleagues and team leaders.",
    ],
    tags: ["OLT", "MikroTik", "VLAN", "Subnetting", "NOC"],
  },
];

export type ProjectCategory = "network" | "systems";

export type Project = {
  id: string;
  title: string;
  category: ProjectCategory;
  period: string;
  org?: string;
  challenge: string;
  architecture: string;
  impact: string;
  stack: string[];
  notes: string[];
  live?: string;
  repo?: string;
  /** Optional screenshot, e.g. "/images/projects/lan.png" */
  image?: string;
};

export const projectFilters: { id: "all" | ProjectCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "network", label: "Network Design & Infrastructure" },
  { id: "systems", label: "Systems & Security Operations" },
];

export const projects: Project[] = [
  {
    id: "lan-mikrotik-cisco",
    title: "LAN Design & Implementation with MikroTik Router & Cisco Switch",
    category: "network",
    period: "Sep 2024",
    org: "One Sky Communications Limited",
    challenge:
      "Bring up a working client-style network as a team project during the data center internship: WAN configured on a MikroTik router with the LAN built behind it.",
    architecture:
      "MikroTik router handling WAN configuration and gateway duties, with a Cisco switch forming the LAN layer.",
    impact:
      "Hands-on experience configuring and bringing up WAN and LAN segments across mixed MikroTik and Cisco hardware.",
    stack: ["MikroTik RouterOS", "Cisco Switch", "WAN/LAN", "VLAN"],
    notes: [
      "Delivered as a team project during the networking internship at One Sky Communications.",
      "WAN connectivity configured on a MikroTik router; LAN built on a Cisco switch.",
      "Reinforced IPv4 addressing, subnetting and VLAN fundamentals on real equipment.",
    ],
  },
  {
    id: "packet-tracer-org-network",
    title: "Organization Network Design with Cisco Packet Tracer",
    category: "network",
    period: "Aug 2024",
    org: "One Sky Communications Limited",
    challenge:
      "Design a multi-location organization network in simulation as CCNA practice, before working on production equipment.",
    architecture:
      "Multi-location topology modelled in Cisco Packet Tracer with routers, switches and end devices across several sites.",
    impact:
      "Built the routing and switching foundation later applied to day-to-day NOC and enterprise support work.",
    stack: ["Cisco Packet Tracer", "CCNA R&S", "Routing", "Switching"],
    notes: [
      "CCNA-oriented practice implementation of a full organization network design.",
      "Exercised topology planning, addressing and inter-site connectivity in a safe lab environment.",
    ],
  },
  {
    id: "comptia-a-plus-lab",
    title: "CompTIA A+ Hardware — Network & Server Practical Labs",
    category: "systems",
    period: "Jul 2024",
    org: "One Sky Communications Limited",
    challenge:
      "Build practical depth across the full stack — desktop hardware, operating systems, LAN/WAN, servers and monitoring.",
    architecture:
      "Lab coverage from PC assembly and multi-boot OS setup to LAN/WAN/Wi-Fi/IP-phone setup, L1/L2/L3 device connectivity (console/PuTTY), UTP/STP/optical cabling, Windows Server roles, RAID and monitoring.",
    impact:
      "Broad, hands-on infrastructure grounding spanning desktops, servers, cabling and monitoring tools.",
    stack: [
      "Windows Server",
      "Active Directory",
      "DNS / DHCP",
      "Group Policy",
      "RAID 0/1/5/10",
      "PRTG",
      "Zabbix",
      "Nmap / Zenmap",
      "Wireshark",
      "SolarWinds",
    ],
    notes: [
      "Server roles: Active Directory, DNS, DHCP, FTP, web server and Group Policy configuration.",
      "Software and hardware RAID configuration (0, 1, 5 and 10).",
      "Cabling: UTP, STP and optical fiber, including OTDR and power-meter concepts and cable management.",
      "CCTV configuration using DVR/NVR, plus network monitoring with PRTG, Nmap, Zenmap, Wireshark, SolarWinds and Zabbix.",
    ],
  },
  {
    id: "corporate-cctv",
    title: "Corporate Office CCTV Setup & Configuration",
    category: "systems",
    period: "Jul 2024",
    challenge:
      "Cover all key areas of a corporate office with reliable surveillance that can also be accessed securely from remote locations.",
    architecture:
      "Strategically placed cameras connected to a Network Video Recorder (NVR) with proper network settings and secure remote access.",
    impact:
      "Fully installed and configured system covering all key areas, regularly maintained to ensure optimal performance.",
    stack: ["IP cameras", "NVR", "Network configuration", "Secure remote access"],
    notes: [
      "Camera placement planned to cover all key areas of the office.",
      "Cameras connected to an NVR with correct network settings for stable recording.",
      "Secure remote access enabled, with ongoing maintenance to keep performance optimal.",
    ],
  },
];

export type SkillGroup = {
  title: string;
  description: string;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    title: "Enterprise Networking & Routing",
    description: "Edge routing, resilience and traffic engineering.",
    items: [
      "MikroTik RouterOS",
      "BGP",
      "OSPF",
      "PCC multi-WAN load balancing",
      "PCQ bandwidth management",
      "IPv4 / IPv6 & subnetting",
      "NAT & firewalls",
      "Cisco router configuration",
    ],
  },
  {
    title: "Access, Switching & Monitoring",
    description: "Layer 2 design, FTTH access and observability.",
    items: [
      "VLANs & trunking",
      "L2/L3 diagnostics",
      "Cisco switching",
      "BDCOM OLT · GPON / EPON",
      "ONU provisioning",
      "Fiber testing & splicing basics",
      "Zabbix · PRTG",
      "Wireshark · Nmap",
    ],
  },
  {
    title: "Systems, Servers & Data Center",
    description: "Server fundamentals and physical infrastructure.",
    items: [
      "Windows Server (AD, DNS, DHCP, GPO)",
      "RAID 0/1/5/10",
      "Windows & Linux OS setup",
      "Structured cabling",
      "Patch panels & rack layouts",
      "CCTV (DVR / NVR)",
      "CPE & IP telephony",
    ],
  },
  {
    title: "Security, Incident & Documentation Practices",
    description: "Disciplined operations for regulated environments.",
    items: [
      "Incident lifecycle & escalation",
      "Root-cause analysis (RCA)",
      "SLA tracking & reporting",
      "Ticketing systems",
      "VLAN segmentation & isolation",
      "Cybersecurity awareness",
      "Technical documentation",
    ],
  },
];

export type Certification = {
  title: string;
  issuer: string;
  type: "Vendor certification" | "Course";
  verifyUrl: string;
};

/** All verification links point to the LinkedIn profile, where credentials are listed. */
const verify = "https://www.linkedin.com/in/joy-dash/";

export const certifications: Certification[] = [
  {
    title: "MikroTik Certified Network Associate (MTCNA)",
    issuer: "MikroTik",
    type: "Vendor certification",
    verifyUrl: verify,
  },
  {
    title: "CompTIA A+",
    issuer: "New Vision Information Technology Limited",
    type: "Course",
    verifyUrl: verify,
  },
  {
    title: "Cybersecurity Awareness: Cybersecurity Terminology & The Cybersecurity Threat Landscape",
    issuer: "LinkedIn Learning",
    type: "Course",
    verifyUrl: verify,
  },
  {
    title: "Diploma in Computer Science (Short Course)",
    issuer: "Bangladesh Computer Education Development Society (BCEDS)",
    type: "Course",
    verifyUrl: verify,
  },
  {
    title: "Professional Graphic Design",
    issuer: "Creative IT Institute",
    type: "Course",
    verifyUrl: verify,
  },
  {
    title: "Professional Online Digital Marketing",
    issuer: "UY LAB",
    type: "Course",
    verifyUrl: verify,
  },
];

export type Education = {
  level: string;
  degree: string;
  institution: string;
  detail: string;
};

export const education: Education[] = [
  {
    level: "Bachelor's",
    degree: "B.Sc. in Computer Science & Engineering",
    institution: "Uttara University",
    detail: "Department of CSE, School of Science & Engineering",
  },
  {
    level: "Diploma",
    degree: "Diploma in Computer Engineering",
    institution: "Shamshun Nahar Haroon Private Polytechnic Institute",
    detail: "Department of Computer Technology · BTEB",
  },
  {
    level: "Higher Secondary",
    degree: "Higher Secondary Certificate (HSC) — Science",
    institution: "Bara Aulia University College",
    detail: "Science group",
  },
  {
    level: "Secondary",
    degree: "Secondary School Certificate (SSC) — Science",
    institution: "Khedar Mara High School",
    detail: "Science group",
  },
];

export type Tool = { no: string; name: string; role: string };

export const toolkit: Tool[] = [
  { no: "01", name: "WinBox", role: "MikroTik Management" },
  { no: "02", name: "Wireshark", role: "Packet Analysis" },
  { no: "03", name: "WinMTR", role: "Packet Loss" },
  { no: "04", name: "PRTG", role: "Network Monitoring" },
  { no: "05", name: "Zabbix", role: "NMS Monitoring" },
  { no: "06", name: "PuTTY", role: "SSH/Telnet" },
  { no: "07", name: "Advanced IP Scanner", role: "LAN Scanning" },
  { no: "08", name: "Nmap", role: "Port Scanning" },
  { no: "09", name: "The Dude", role: "Network Mapping" },
  { no: "10", name: "Grafana", role: "Dashboard" },
  { no: "11", name: "Draw.io", role: "Network Documentation" },
  { no: "12", name: "tftpd64", role: "File Transfer" },
  { no: "13", name: "iPerf3", role: "Throughput Testing" },
  { no: "14", name: "MobaXterm", role: "Multi-session Remote Access" },
  {
    no: "15",
    name: "PingPlotter",
    role: "Continuous Ping, Latency Graph, Packet Loss History, Jitter Analysis",
  },
  { no: "16", name: "OLT Management", role: "Web, GUI, CLI" },
];
