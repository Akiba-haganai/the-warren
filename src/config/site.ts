export interface EcosystemApp {
  id: string;
  name: string;
  tagline: string;
  description: string;
  url: string;
  status: "Live" | "Beta" | "Coming Soon";
  badgeColor?: string;
  isExternal: boolean;
}

export const SITE_CONFIG = {
  name: "Weave",
  brandName: "Weave",
  tagline: "Stories, Podcasts & Culture",
  description:
    "Discover original podcasts, thoughtful stories, culture, and conversations for everyone.",
  defaultOrigin: "https://weave.akiba-hara.workers.dev",
  contact: {
    email: "contact@thewarren.network",
    supportEmail: "support@thewarren.network",
    phoneDisplay: "+260 96 673 8707",
    whatsappNumber: "260966738707",
    whatsappLink: "https://wa.me/260966738707",
    location: "Kitwe, Zambia",
  },
  social: {
    youtubeChannelId: "UCGKgsxYNTUESqdvySiMIQ1A",
    youtubeUploadsPlaylistId: "UUGKgsxYNTUESqdvySiMIQ1A",
  },
  apps: [
    {
      id: "wave",
      name: "WAVE",
      tagline: "Community & Social",
      description: "Join conversations, connect with your community, and stay informed on WAVE.",
      url: "https://warren-wave.vercel.app",
      status: "Live",
      badgeColor: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      isExternal: true,
    },
    {
      id: "plawza",
      name: "PLAWZA",
      tagline: "Marketplace & Housing",
      description: "Find verified accommodation and buy or sell everyday goods securely.",
      url: "https://warren-plawza.vercel.app",
      status: "Live",
      badgeColor: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      isExternal: true,
    },
    {
      id: "stitch",
      name: "STITCH",
      tagline: "Jobs & Opportunities",
      description: "Discover verified jobs, gigs, and internships to grow your career.",
      url: "https://warren-stitch.vercel.app",
      status: "Live",
      badgeColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      isExternal: true,
    },
    {
      id: "weave",
      name: "Weave",
      tagline: "Audio & Culture Network",
      description: "The media and discovery hub connecting everyone through stories and conversations.",
      url: "/",
      status: "Live",
      badgeColor: "bg-primary/10 text-primary border-primary/20",
      isExternal: false,
    },
  ] as EcosystemApp[],
};
