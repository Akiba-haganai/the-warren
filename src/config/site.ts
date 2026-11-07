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
  name: "WEAVE",
  brandName: "Warren Weave",
  tagline: "Audio, Culture & Stories",
  description:
    "Discover university podcasts, student journalism, campus culture, and stories connecting students across Zambia.",
  defaultOrigin: "https://thewarren.network", // Or fallback to window.location.origin
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
      tagline: "Campus Community & Social",
      description: "Join campus conversations, connect with your tribe, and stay informed on WAVE.",
      url: "https://warren-wave.vercel.app",
      status: "Live",
      badgeColor: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      isExternal: true,
    },
    {
      id: "plawza",
      name: "PLAWZA",
      tagline: "Student Marketplace & Housing",
      description: "Find verified student accommodation and buy or sell student goods securely.",
      url: "https://warren-plawza.vercel.app",
      status: "Live",
      badgeColor: "bg-orange-500/10 text-orange-600 border-orange-500/20",
      isExternal: true,
    },
    {
      id: "stitch",
      name: "STITCH",
      tagline: "Student Jobs & Internships",
      description: "Discover verified student jobs, paid internships, and launch your career.",
      url: "https://warren-stitch.vercel.app",
      status: "Live",
      badgeColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      isExternal: true,
    },
    {
      id: "weave",
      name: "WEAVE",
      tagline: "Audio & Culture Network",
      description: "The media and discovery front door connecting students through stories and conversations.",
      url: "/",
      status: "Live",
      badgeColor: "bg-purple-500/10 text-purple-600 border-purple-500/20",
      isExternal: false,
    },
  ] as EcosystemApp[],
};
