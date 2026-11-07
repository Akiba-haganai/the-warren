import { PageShell } from "../components/layout/PageShell";
import {
  BookOpen,
  ShoppingBag,
  Podcast,
  ArrowRight,
  Shield,
  Zap,
  Map,
  Check,
  Clock,
  ExternalLink,
  Briefcase,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/layout/Reveal";
import { SITE_CONFIG } from "@/config/site";

const apps = [
  {
    icon: BookOpen,
    title: "WAVE",
    description:
      "Social networking, shared learning resources, mentoring, quizzes, and live AMA sessions — an all‑in‑one community hub.",
    features: [
      { text: "Social feed & real‑time chat", icon: Zap, soon: false },
      { text: "Shared learning resources & guides", icon: Check, soon: false },
      { text: "Peer‑to‑peer mentoring & tutoring", icon: Check, soon: false },
      { text: "Quiz battles & AMA sessions", icon: Check, soon: false },
      { text: "Verified member badges", icon: Shield, soon: false },
    ],
    url: SITE_CONFIG.apps.find((a) => a.id === "wave")?.url || "https://warren-wave.vercel.app",
    color: "bg-primary",
  },
  {
    icon: ShoppingBag,
    title: "PLAWZA",
    description:
      "Marketplace, housing, and rental finder — buy, sell, rent, and connect safely with verified members.",
    features: [
      { text: "Buy & sell new or pre-owned items", icon: Check, soon: false },
      { text: "Find accommodation & rentals", icon: Map, soon: false },
      { text: "Property & occupancy dashboard", icon: Check, soon: false },
      { text: "Verified seller tiers & reputation scoring", icon: Shield, soon: false },
      { text: "Mobile money escrow", icon: Clock, soon: true },
    ],
    url: SITE_CONFIG.apps.find((a) => a.id === "plawza")?.url || "https://warren-plawza.vercel.app",
    color: "bg-teal-600",
  },
  {
    icon: Briefcase,
    title: "STITCH",
    description: "Find opportunities. Build experience. Get hired. The career and gigs hub for everyone.",
    features: [
      { text: "Find internships, gigs & jobs", icon: Check, soon: false },
      { text: "Showcase skills & build experience", icon: Check, soon: false },
      { text: "Connect with verified employers", icon: Shield, soon: false },
      { text: "Opportunity matching & alerts", icon: Zap, soon: false },
    ],
    url: SITE_CONFIG.apps.find((a) => a.id === "stitch")?.url || "https://warren-stitch.vercel.app",
    color: "bg-indigo-600",
  },
  {
    icon: Podcast,
    title: "Podcasts",
    description:
      "Original conversations about faith, career, relationships, and culture — powered by YouTube.",
    features: [
      { text: "Original audio & video episodes", icon: Check, soon: false },
      { text: "Play directly in the app", icon: Zap, soon: false },
      { text: "Bookmark & continue listening", icon: Check, soon: false },
      { text: "New episodes added automatically", icon: Zap, soon: false },
      { text: "Free & always available", icon: Check, soon: false },
    ],
    url: "/podcasts",
    internal: true,
    color: "bg-amber-600",
  },
];

export default function Products() {
  return (
    <PageShell
      label="Products"
      title={
        <>
          Built for the way <span className="text-gradient-blue">people connect</span>.
        </>
      }
      subtitle="Four connected platforms — one ecosystem for everyone."
    >
      <div className="grid gap-8 md:grid-cols-2">
        {apps.map((app, i) => (
          <Reveal key={app.title} delay={i * 0.08}>
            <Card className="h-full border-border bg-card hover:shadow-glow transition flex flex-col group rounded-3xl">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${app.color} text-white shadow-glow`}
                  >
                    <app.icon className="h-6 w-6" />
                  </span>
                  <h2 className="font-display text-2xl font-semibold">{app.title}</h2>
                </div>

                <p className="text-sm text-muted-foreground">{app.description}</p>

                <ul className="mt-4 space-y-2 flex-1">
                  {app.features.map((feat, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      {feat.soon ? (
                        <>
                          <Clock className="mt-0.5 h-4 w-4 text-amber-500 shrink-0" />
                          <span>{feat.text}</span>
                          <span className="ml-auto shrink-0 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 text-xs font-medium">
                            Soon
                          </span>
                        </>
                      ) : (
                        <>
                          <feat.icon className="mt-0.5 h-4 w-4 text-primary shrink-0" />
                          {feat.text}
                        </>
                      )}
                    </li>
                  ))}
                </ul>

                <div className="mt-6">
                  {app.internal ? (
                    <Button asChild className="w-full rounded-full shadow-glow">
                      <Link to={app.url}>
                        Explore {app.title} <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  ) : (
                    <Button asChild variant="outline" className="w-full rounded-full">
                      <a href={app.url} target="_blank" rel="noopener noreferrer">
                        Open {app.title} <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>
    </PageShell>
  );
}
