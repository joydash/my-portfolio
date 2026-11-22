/**
 * Floating orbit gallery in the hero.
 * To add or swap a visual: drop a square image (about 512×512, webp/png/jpg) into
 * public/images/showcase/ and add or edit an entry below. Any number of items works —
 * they are spaced evenly around the orbit (4–6 looks best).
 */
export type ShowcaseItem = {
  id: string;
  /** Short caption shown on larger screens (keep it under ~9 characters) */
  label: string;
  src: string;
  alt: string;
};

export const showcase: ShowcaseItem[] = [
  {
    id: "topology",
    label: "TOPOLOGY",
    src: "/images/showcase/topology.webp",
    alt: "Network topology with core, edge and WAN nodes",
  },
  {
    id: "routing",
    label: "ROUTING",
    src: "/images/showcase/routing.webp",
    alt: "BGP and OSPF routing between core, edge and ISP nodes",
  },
  {
    id: "infra-panel",
    label: "INFRA",
    src: "/images/showcase/infra-panel.webp",
    alt: "Core switch, router, firewall and access layer panel",
  },
  {
    id: "ftth",
    label: "FTTH",
    src: "/images/showcase/ftth.webp",
    alt: "OLT, splitter and ONU layout of a GPON/EPON access network",
  },
  {
    id: "monitor",
    label: "MONITOR",
    src: "/images/showcase/monitor.webp",
    alt: "Latency and uptime monitoring graph",
  },
];
