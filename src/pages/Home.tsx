import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Hero } from "../components/sections/Hero";
import { WhyWarren } from "../components/sections/WhyWarren";
import { JourneyTimeline } from "../components/sections/JourneyTimeline";
import { EcosystemMap } from "../components/sections/EcosystemMap";
import { CampusShowcase } from "../components/sections/CampusShowcase";
import { MarketShowcase } from "../components/sections/MarketShowcase";
import { PodcastSection } from "../components/sections/PodcastSection";
import { FounderNote } from "../components/sections/FounderNote";
import { CoreValues } from "../components/sections/CoreValues";
import { Roadmap } from "../components/sections/Roadmap";
import { Stats } from "../components/sections/Stats";
import { FinalCTA } from "../components/sections/FinalCTA";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal, SectionLabel } from "@/components/layout/Reveal";

import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Check,
  GraduationCap,
  Map,
  Podcast,
  Shield,
  ShoppingBag,
  Zap,
  MessageCircle,
  Users,
  Camera,
  PlaySquare,
} from "lucide-react";

const WARREN_CAMPUS_URL = "https://warren-campus.vercel.app";
const WARREN_CONNECT_URL = "https://warren-market.vercel.app";

export default function Home() {
  return (
    <div className="relative">
      <Header />
      <main>
        <Hero />
        <OurApps />
        <WhyWarren />
        <JoinCommunity />
        <JourneyTimeline />
        <EcosystemMap />
        <CampusShowcase />
        <MarketShowcase />
        <PodcastSection />
        <FounderNote />
        <CoreValues />
        <Roadmap />
        <Stats />
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
      title: "Warren Campus",
      description:
        "Social networking, study materials, tutoring, quizzes, campus map, and AMA sessions — the all‑in‑one student hub.",
      features: [
        { text: "Social feed & real‑time chat", icon: Zap },
        { text: "Study hub with past papers & cram plans", icon: GraduationCap },
        { text: "Peer‑to‑peer tutoring marketplace", icon: Check },
        { text: "Quiz battles & AMA sessions", icon: Check },
        { text: "Interactive campus map", icon: Map },
        { text: "Verified student badges", icon: Shield },
      ],
      url: WARREN_CAMPUS_URL,
      internal: false,
      color: "bg-blue-600",
      gradient: "from-blue-600 to-blue-800",
    },
    {
      icon: ShoppingBag,
      title: "Warren Connect",
      description:
        "Marketplace, housing, and roommate finder for Zambian students — buy, sell, rent, and connect safely.",
      features: [
        { text: "Buy & sell new/used items", icon: Check },
        { text: "Find accommodation & roommates", icon: Map },
        { text: "Landlord dashboard & occupancy tracking", icon: Check },
        { text: "Verified seller tiers & reputation scoring", icon: Shield },
        { text: "Fast mobile money escrow (coming soon)", icon: Zap },
      ],
      url: WARREN_CONNECT_URL,
      internal: false,
      color: "bg-teal-600",
      gradient: "from-teal-600 to-teal-800",
    },
    {
      icon: Podcast,
      title: "Warren Podcasts",
      description:
        "Student‑led conversations about faith, career, relationships, and campus life — powered by YouTube.",
      features: [
        { text: "Exclusive CBU student content", icon: Check },
        { text: "Play directly in the app", icon: Zap },
        { text: "Bookmark & continue listening", icon: Check },
        { text: "New episodes added automatically", icon: Zap },
        { text: "Free & always available", icon: Check },
      ],
      url: "/podcasts",
      internal: true,
      color: "bg-purple-600",
      gradient: "from-purple-600 to-purple-800",
    },
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="text-center">
            <SectionLabel>Our Platforms</SectionLabel>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl font-semibold tracking-tight">
              Three powerful apps, <span className="text-gradient-blue">one hub</span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything a CBU student needs — social, study, marketplace, housing, and podcasts — all in one place.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {apps.map((app, i) => (
            <Reveal key={app.title} delay={i * 0.1}>
              <Card className="h-full border-border bg-card hover:shadow-glow transition flex flex-col">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${app.color} text-white`}
                    >
                      <app.icon className="h-6 w-6" />
                    </span>
                    <h3 className="font-display text-2xl font-semibold">{app.title}</h3>
                  </div>

                  <p className="text-sm text-muted-foreground flex-1">{app.description}</p>

                  <ul className="mt-4 space-y-2 flex-1">
                    {app.features.map((feat) => (
                      <li
                        key={feat.text}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <feat.icon className="mt-0.5 h-4 w-4 text-green-500 shrink-0" />
                        {feat.text}
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
                      <Button
                        asChild
                        className={`w-full rounded-full bg-gradient-to-r ${app.gradient} text-white shadow-glow hover:opacity-90`}
                      >
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

function JoinCommunity() {
  return (
    <section id="community" className="py-24 bg-muted/30 dark:bg-muted/10 scroll-mt-24">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <Reveal>
          <SectionLabel>Get Involved</SectionLabel>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl font-semibold tracking-tight">
            Join the <span className="text-gradient-blue">community</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you want quick updates, deep conversations, or podcast content – we're everywhere you are.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* WhatsApp Channel */}
          <Button
            asChild
            size="lg"
            className="rounded-full bg-green-500 hover:bg-green-600 text-white shadow-glow font-semibold"
          >
            <a
              href="https://whatsapp.com/channel/0029Vb8NY5f84OmCRIr9K91V"
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              WhatsApp Channel
            </a>
          </Button>

          {/* WhatsApp Group */}
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full border-2 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950 font-semibold"
          >
            <a
              href="https://chat.whatsapp.com/I4TtoTKBGB9I4eVv4VKXGs"
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              WhatsApp Group
            </a>
          </Button>

          {/* Facebook Group */}
          <Button
            asChild
            size="lg"
            className="rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-glow font-semibold"
          >
            <a
              href="https://web.facebook.com/groups/warrenstudenthub/"
              target="_blank"
              rel="noreferrer"
            >
              <Users className="mr-2 h-5 w-5" />
              Facebook Group
            </a>
          </Button>

          {/* Instagram */}
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full border-2 border-pink-500 text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-950 font-semibold"
          >
            <a
              href="https://instagram.com/warrenpodcasts_cbu"
              target="_blank"
              rel="noreferrer"
            >
              <Camera className="mr-2 h-5 w-5" />
              Instagram
            </a>
          </Button>

          {/* YouTube */}
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full border-2 border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 font-semibold"
          >
            <a
              href="https://youtube.com/channel/UCGKgsxYNTUESqdvySiMIQ1A"
              target="_blank"
              rel="noreferrer"
            >
              <PlaySquare className="mr-2 h-5 w-5" />
              YouTube
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}