import { ArrowRight, Briefcase, ShoppingBag, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EcosystemCTAProps {
  topics: { slug: string; title: string }[];
}

export function EcosystemCTA({ topics }: EcosystemCTAProps) {
  // Determine which ecosystem app to promote based on blog topics
  let appToPromote: "plawza" | "stitch" | "wave" | null = null;
  
  const topicSlugs = topics.map(t => t.slug.toLowerCase());
  
  if (topicSlugs.some(s => s.includes("hous") || s.includes("accommodat") || s.includes("market") || s.includes("sell"))) {
    appToPromote = "plawza";
  } else if (topicSlugs.some(s => s.includes("career") || s.includes("job") || s.includes("money") || s.includes("intern"))) {
    appToPromote = "stitch";
  } else if (topicSlugs.some(s => s.includes("social") || s.includes("friend") || s.includes("connect") || s.includes("date"))) {
    appToPromote = "wave";
  }

  if (!appToPromote) return null;

  const content = {
    plawza: {
      name: "PLAWZA",
      title: "Looking for Campus Housing?",
      description: "Find affordable student accommodation and buy/sell items easily on PLAWZA.",
      url: "https://warren-plawza.vercel.app",
      icon: <ShoppingBag className="h-6 w-6 text-orange-600" />,
      color: "border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-900",
      buttonClass: "bg-orange-600 hover:bg-orange-700 text-white"
    },
    stitch: {
      name: "STITCH",
      title: "Kickstart Your Career",
      description: "Discover internships, entry-level jobs, and career resources tailored for students on STITCH.",
      url: "https://warren-stitch.vercel.app",
      icon: <Briefcase className="h-6 w-6 text-emerald-600" />,
      color: "border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-900",
      buttonClass: "bg-emerald-600 hover:bg-emerald-700 text-white"
    },
    wave: {
      name: "WAVE",
      title: "Connect with Campus",
      description: "Join the conversation, find your tribe, and stay connected with students on WAVE.",
      url: "https://warren-wave.vercel.app",
      icon: <MessageCircle className="h-6 w-6 text-blue-600" />,
      color: "border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900",
      buttonClass: "bg-blue-600 hover:bg-blue-700 text-white"
    }
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
            <p className="text-muted-foreground mt-1 max-w-md">
              {content.description}
            </p>
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
