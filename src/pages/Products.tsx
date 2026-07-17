import { PageShell } from "../components/layout/PageShell";
import {
  BookOpen,
  ShoppingBag,
  Podcast,
  ArrowRight,
  Shield,
  Zap,
  Map,
  GraduationCap,
  Check,
  Clock,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/layout/Reveal";

const apps = [
  {
    icon: BookOpen,
    title: "Warren Campus",
    description:
      "Social networking, study materials, tutoring, quizzes, campus map, and AMA sessions — the all‑in‑one student hub.",
    features: [
      { text: "Social feed & real‑time chat", icon: Zap, soon: false },
      {
        text: "Study hub with past papers & cram plans",
        icon: GraduationCap,
        soon: false,
      },
      { text: "Peer‑to‑peer tutoring marketplace", icon: Check, soon: false },
      { text: "Quiz battles & AMA sessions", icon: Check, soon: false },
      { text: "Interactive campus map", icon: Map, soon: false },
      { text: "Verified student badges", icon: Shield, soon: false },
    ],
    url: "https://warren-campus.vercel.app",
    color: "bg-blue-600",
    gradient: "from-blue-600 to-blue-800",
  },
  {
    icon: ShoppingBag,
    title: "Warren Connect",
    description:
      "Marketplace, housing, and roommate finder for Zambian students — buy, sell, rent, and connect safely.",
    features: [
      { text: "Buy & sell new/used items", icon: Check, soon: false },
      { text: "Find accommodation & roommates", icon: Map, soon: false },
      {
        text: "Landlord dashboard & occupancy tracking",
        icon: Check,
        soon: false,
      },
      {
        text: "Verified seller tiers & reputation scoring",
        icon: Shield,
        soon: false,
      },
      { text: "Mobile money escrow", icon: Clock, soon: true },
    ],
    url: "https://warren-market.vercel.app",
    color: "bg-teal-600",
    gradient: "from-teal-600 to-teal-800",
  },
  {
    icon: Podcast,
    title: "Warren Podcasts",
    description:
      "Student‑led conversations about faith, career, relationships, and campus life — powered by YouTube.",
    features: [
      { text: "Exclusive CBU student content", icon: Check, soon: false },
      { text: "Play directly in the app", icon: Zap, soon: false },
      { text: "Bookmark & continue listening", icon: Check, soon: false },
      { text: "New episodes added automatically", icon: Zap, soon: false },
      { text: "Free & always available", icon: Check, soon: false },
    ],
    url: "/podcasts",
    internal: true,
    color: "bg-purple-600",
    gradient: "from-purple-600 to-purple-800",
  },
];

export default function Products() {
  return (
    <PageShell
      label="Products"
      title={
        <>
          Made for the way <span className="text-gradient-blue">students live</span>.
        </>
      }
      subtitle="Three powerful platforms – one connected ecosystem for Copperbelt University."
    >
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {apps.map((app, i) => (
          <Reveal key={app.title} delay={i * 0.08}>
            <Card className="h-full border-border bg-card hover:shadow-glow transition flex flex-col group">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${app.color} text-white shadow-glow`}
                  >
                    <app.icon className="h-6 w-6" />
                  </span>
                  <h3 className="font-display text-2xl font-semibold">{app.title}</h3>
                </div>

                <div className="mb-4 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 aspect-video flex items-center justify-center text-sm text-muted-foreground border border-border/50">
                  App screenshot – coming soon
                </div>

                <p className="text-sm text-muted-foreground flex-1">{app.description}</p>

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
                          <feat.icon className="mt-0.5 h-4 w-4 text-green-500 shrink-0" />
                          {feat.text}
                        </>
                      )}
                    </li>
                  ))}
                </ul>

                <div className="mt-6">
                  {app.internal ? (
                    <Button asChild className="w-full rounded-full shadow-glow">
                      <a href={app.url}>
                        Explore {app.title} <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  ) : (
                    <div>
                      <Button
                        asChild
                        className={`w-full rounded-full bg-gradient-to-r ${app.gradient} text-white shadow-glow hover:opacity-90`}
                      >
                        <a href={app.url} target="_blank" rel="noopener noreferrer">
                          Open {app.title} <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                      <p className="mt-2 text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
                        <Shield className="h-3 w-3 text-blue-500" />
                        Verified student app
                      </p>
                    </div>
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

