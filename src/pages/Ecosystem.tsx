import { PageShell } from "../components/layout/PageShell";
import {
  ArrowRight,
  Users,
  Store,
  Briefcase,
  Podcast,
  UserPlus,
  Building2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/config/site";

const products = [
  {
    icon: Users,
    name: "WAVE",
    desc: "Social networking, shared learning hub, mentoring marketplace, quizzes, and live AMA sessions.",
    url: SITE_CONFIG.apps.find((a) => a.id === "wave")?.url || "https://warren-wave.vercel.app",
    status: "Live",
  },
  {
    icon: Store,
    name: "PLAWZA",
    desc: "Marketplace, accommodation & rental finder, property dashboard, verified seller tiers, and escrow (coming soon).",
    url: SITE_CONFIG.apps.find((a) => a.id === "plawza")?.url || "https://warren-plawza.vercel.app",
    status: "Live",
  },
  {
    icon: Podcast,
    name: "Podcasts",
    desc: "Original audio & video conversations — faith, career, relationships, and everyday stories. Streamed inside Weave.",
    url: "/podcasts",
    status: "Live",
  },
  {
    icon: Briefcase,
    name: "STITCH",
    desc: "Find opportunities. Build experience. Get hired. The career and gigs hub for everyone.",
    url: SITE_CONFIG.apps.find((a) => a.id === "stitch")?.url || "https://warren-stitch.vercel.app",
    status: "Live",
  },
  {
    icon: UserPlus,
    name: "Mentors & Network",
    desc: "A network that lasts — connect with experienced professionals, mentors, and collaborators.",
    status: "Soon",
  },
  {
    icon: Building2,
    name: "Creators & Founders",
    desc: "Tools for independent founders and creators: storefronts, analytics, and audience reach.",
    status: "Soon",
  },
];

export default function Ecosystem() {
  return (
    <PageShell
      label="The Ecosystem"
      title={
        <>
          One <span className="text-gradient-blue">ecosystem</span>. Built for everyone.
        </>
      }
      subtitle="Each platform solves a real everyday need. Together, they form a connected digital home."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <div
            key={p.name}
            className="group rounded-2xl border border-border bg-card p-6 flex flex-col"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-glow">
                <p.icon className="h-5 w-5" />
              </span>
              <Badge
                variant={p.status === "Live" ? "default" : "secondary"}
                className="text-xs"
              >
                {p.status}
              </Badge>
            </div>
            <h2 className="mt-4 font-display text-xl font-semibold">{p.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground flex-1">{p.desc}</p>
            {p.url && (
              <Button
                asChild
                variant="link"
                className="mt-4 p-0 h-auto justify-start text-primary hover:opacity-80"
              >
                <a
                  href={p.url}
                  target={p.url.startsWith("http") ? "_blank" : undefined}
                  rel={p.url.startsWith("http") ? "noreferrer" : undefined}
                  className="inline-flex items-center gap-1 text-sm font-medium"
                >
                  Visit <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </Button>
            )}
          </div>
        ))}
      </div>
    </PageShell>
  );
}
