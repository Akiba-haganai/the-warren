
import { PageShell } from "../components/layout/PageShell";
import {
  ArrowRight,
  GraduationCap,
  Store,
  Briefcase,
  Podcast,
  UserPlus,
  Building2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";


const products = [
  {
    icon: GraduationCap,
    name: "WAVE",
    desc: "Social networking, study hub, tutoring marketplace, quiz battles, campus map, and AMA sessions.",
    url: "https://warren-wave.vercel.app",
    status: "Live",
  },
  {
    icon: Store,
    name: "PLAWZA",
    desc: "Marketplace, housing, roommate finder, landlord dashboard, verified seller tiers, and escrow (coming soon).",
    url: "https://warren-plawza.vercel.app",
    status: "Live",
  },
  {
    icon: Podcast,
    name: "Podcasts",
    desc: "Student‑led audio conversations – faith, career, relationships, campus stories. Listen inside Commons.",
    url: "/podcasts",
    status: "Live",
  },
  {
    icon: Briefcase,
    name: "STITCH",
    desc: "Find opportunities. Build experience. Get hired. The career hub for students.",
    url: "https://warren-stitch.vercel.app",
    status: "Live",
  },
  {
    icon: UserPlus,
    name: "Alumni",
    desc: "A network that lasts – connect with graduates, mentors, and career opportunities.",
    status: "Soon",
  },
  {
    icon: Building2,
    name: "Business",
    desc: "Tools for student founders: storefronts, analytics, and promotion.",
    status: "Soon",
  },
];

export default function Ecosystem() {
  return (
    <PageShell
      label="The Ecosystem"
      title={
        <>
          One <span className="text-gradient-blue">ecosystem</span>. Every part of student life.
        </>
      }
      subtitle="Each product solves a real problem. Together, they become the digital home of student life."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <div
            key={p.name}
            className="group rounded-2xl border border-border bg-card p-6 flex flex-col"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-glow">
                <p.icon className="h-5 w-5" />
              </span>
              <Badge
                variant={p.status === "Live" ? "default" : "secondary"}
                className="text-xs"
              >
                {p.status}
              </Badge>
            </div>
            <h3 className="mt-4 font-display text-xl font-semibold">{p.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground flex-1">{p.desc}</p>
            {p.url && (
              <Button
                asChild
                variant="link"
                className="mt-4 p-0 h-auto justify-start text-blue-600 hover:text-blue-700"
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

