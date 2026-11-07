import { ArrowRight, Briefcase, ShoppingBag, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/config/site";

interface EcosystemCTAProps {
  topics: { slug: string; title: string }[];
}

export function EcosystemCTA({ topics }: EcosystemCTAProps) {
  let appToPromote: "plawza" | "stitch" | "wave" | null = null;

  const topicSlugs = topics.map((t) => t.slug.toLowerCase());

  if (
    topicSlugs.some(
      (s) => s.includes("hous") || s.includes("accommodat") || s.includes("market") || s.includes("sell")
    )
  ) {
    appToPromote = "plawza";
  } else if (
    topicSlugs.some(
      (s) => s.includes("career") || s.includes("job") || s.includes("money") || s.includes("intern")
    )
  ) {
    appToPromote = "stitch";
  } else if (
    topicSlugs.some(
      (s) => s.includes("social") || s.includes("friend") || s.includes("connect") || s.includes("date")
    )
  ) {
    appToPromote = "wave";
  }

  if (!appToPromote) return null;

  const content = {
    plawza: {
      name: "PLAWZA",
      title: "Looking for Housing or Deals?",
      description: "Find verified accommodation and buy or sell items easily on PLAWZA.",
      url: SITE_CONFIG.apps.find((a) => a.id === "plawza")?.url || "https://warren-plawza.vercel.app",
      icon: <ShoppingBag className="h-6 w-6 text-amber-600" />,
      color: "border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900",
      buttonClass: "bg-amber-600 hover:bg-amber-700 text-white",
    },
    stitch: {
      name: "STITCH",
      title: "Grow Your Career",
      description: "Discover internships, jobs, gigs, and career resources on STITCH.",
      url: SITE_CONFIG.apps.find((a) => a.id === "stitch")?.url || "https://warren-stitch.vercel.app",
      icon: <Briefcase className="h-6 w-6 text-emerald-600" />,
      color: "border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-900",
      buttonClass: "bg-emerald-600 hover:bg-emerald-700 text-white",
    },
    wave: {
      name: "WAVE",
      title: "Join the Community",
      description: "Join the conversation, meet people, and stay connected on WAVE.",
      url: SITE_CONFIG.apps.find((a) => a.id === "wave")?.url || "https://warren-wave.vercel.app",
      icon: <MessageCircle className="h-6 w-6 text-primary" />,
      color: "border-primary/20 bg-primary/5",
      buttonClass: "bg-primary hover:opacity-90 text-primary-foreground",
    },
  }[appToPromote];

  return (
    <Card className={`mt-10 overflow-hidden transition-all ${content.color}`}>
      <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="mt-1 flex-shrink-0 bg-background rounded-full p-3 shadow-sm">
            {content.icon}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{content.title}</h3>
            <p className="text-muted-foreground mt-1 max-w-md">{content.description}</p>
          </div>
        </div>
        <Button asChild className={`shrink-0 rounded-full shadow-md ${content.buttonClass}`}>
          <a href={content.url} target="_blank" rel="noopener noreferrer">
            Open {content.name} <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
