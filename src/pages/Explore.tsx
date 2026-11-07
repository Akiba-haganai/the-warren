import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Hero } from "../components/sections/Hero";
import { PodcastSection } from "../components/sections/PodcastSection";
import { CoreValues } from "../components/sections/CoreValues";
import { FinalCTA } from "../components/sections/FinalCTA";
import { JoinCommunity } from "../components/sections/JoinCommunity";
import { Stats } from "../components/sections/Stats";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal, SectionLabel } from "@/components/layout/Reveal";

import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Check,
  Map,
  Podcast,
  Shield,
  ShoppingBag,
  Zap,
  Briefcase,
} from "lucide-react";

import { SITE_CONFIG } from "@/config/site";

const WAVE_URL =
  SITE_CONFIG.apps.find((a) => a.id === "wave")?.url || "https://warren-wave.vercel.app";
const PLAWZA_URL =
  SITE_CONFIG.apps.find((a) => a.id === "plawza")?.url || "https://warren-plawza.vercel.app";
const STITCH_URL =
  SITE_CONFIG.apps.find((a) => a.id === "stitch")?.url || "https://warren-stitch.vercel.app";

export default function Explore() {
  return (
    <div className="relative">
      <Header />
      <main>
        <Hero />
        <OurApps />
        <Stats />
        <PodcastSection />
        <CoreValues />
        <JoinCommunity />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

function OurApps() {
  const apps = [
    {
      icon: BookOpen,
      title: "WAVE",
      description:
        "Social networking, shared learning resources, live discussions, and community spaces for everyone.",
      features: [
        { text: "Social feed & real‑time chat", icon: Zap },
        { text: "Learning hub & shared study resources", icon: Check },
        { text: "Peer‑to‑peer mentoring & Q&A", icon: Check },
        { text: "Interactive quizzes & AMA sessions", icon: Check },
        { text: "Verified member badges", icon: Shield },
      ],
      url: WAVE_URL,
      internal: false,
      color: "bg-primary",
    },
    {
      icon: ShoppingBag,
      title: "PLAWZA",
      description:
        "Marketplace and accommodation finder — buy, sell, rent, and connect safely with verified members.",
      features: [
        { text: "Buy & sell new or pre-owned items", icon: Check },
        { text: "Find accommodation & rentals", icon: Map },
        { text: "Property & listing management", icon: Check },
        { text: "Verified seller tiers & reputation scoring", icon: Shield },
      ],
      url: PLAWZA_URL,
      internal: false,
      color: "bg-teal-600",
    },
    {
      icon: Briefcase,
      title: "STITCH",
      description:
        "Find opportunities. Build experience. Get hired. The career and gigs hub for everyone.",
      features: [
        { text: "Discover internships, gigs & jobs", icon: Check },
        { text: "Showcase skills & build your portfolio", icon: Check },
        { text: "Connect with verified employers", icon: Shield },
        { text: "Opportunity matching & alerts", icon: Zap },
      ],
      url: STITCH_URL,
      internal: false,
      color: "bg-indigo-600",
    },
    {
      icon: Podcast,
      title: "Podcasts",
      description:
        "Original conversations about faith, career, relationships, and everyday life — streamed inside Weave.",
      features: [
        { text: "Original video & audio episodes", icon: Check },
        { text: "Play directly with mini-player", icon: Zap },
        { text: "Bookmark & resume where you left off", icon: Check },
        { text: "New episodes synced automatically", icon: Zap },
      ],
      url: "/podcasts",
      internal: true,
      color: "bg-amber-600",
    },
  ];

  return (
    <section id="ecosystem" className="py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="text-center">
            <SectionLabel>Our Platforms</SectionLabel>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl font-semibold tracking-tight">
              Connected apps, <span className="text-gradient-blue">one hub</span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Community, marketplace, housing, career opportunities, and podcasts — all brought together in one place.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {apps.map((app, i) => (
            <Reveal key={app.title} delay={i * 0.08}>
              <Card className="h-full border-border bg-card hover:shadow-glow transition flex flex-col rounded-3xl">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${app.color} text-white`}
                    >
                      <app.icon className="h-5 w-5" />
                    </span>
                    <h3 className="font-display text-xl font-semibold leading-tight">{app.title}</h3>
                  </div>

                  <p className="text-sm text-muted-foreground">{app.description}</p>

                  <ul className="mt-4 space-y-2 flex-1">
                    {app.features.map((feat) => (
                      <li
                        key={feat.text}
                        className="flex items-start gap-2 text-xs text-muted-foreground"
                      >
                        <feat.icon className="mt-0.5 h-3.5 w-3.5 text-primary shrink-0" />
                        {feat.text}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6">
                    {app.internal ? (
                      <Button asChild className="w-full rounded-full">
                        <Link to={app.url}>
                          Explore {app.title} <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    ) : (
                      <Button asChild variant="outline" className="w-full rounded-full">
                        <a href={app.url} target="_blank" rel="noopener noreferrer">
                          Open {app.title} <ArrowRight className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
