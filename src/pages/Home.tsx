import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Hero } from "../components/sections/Hero";
import { WhyWarren } from "../components/sections/WhyWarren";
import { JoinCommunity } from "../components/sections/JoinCommunity";
import { AdUnit } from "../components/ads/AdUnit";
import { JourneyTimeline } from "../components/sections/JourneyTimeline";
import { EcosystemMap } from "../components/sections/EcosystemMap";
import { CampusShowcase } from "../components/sections/CampusShowcase";
import { MarketShowcase } from "../components/sections/MarketShowcase";
import { FounderNote } from "../components/sections/FounderNote";
import { CoreValues } from "../components/sections/CoreValues";
import { Roadmap } from "../components/sections/Roadmap";
import { Stats } from "../components/sections/Stats";
import { FinalCTA } from "../components/sections/FinalCTA";
import { ArrowRight, Podcast } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal, SectionLabel } from "@/components/layout/Reveal";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="relative">
      <Header />
      <main>
        <Hero />
        <WhyWarren />
        <JoinCommunity />

        {/* Ad unit between sections */}
        <div className="mx-auto max-w-7xl px-6 mt-2">
          <AdUnit slot="1234567890" format="auto" className="my-8" />
        </div>

        <JourneyTimeline />
        <EcosystemMap />
        <CampusShowcase />
        <MarketShowcase />

        {/* NEW: Podcast teaser section replacing the old Coming Soon block */}
        <section className="py-24 bg-muted/30">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <Reveal>
              <SectionLabel>Podcasts</SectionLabel>
              <h2 className="mt-4 font-display text-4xl sm:text-5xl font-semibold tracking-tight">
                Listen to <span className="text-gradient-blue">Warren Podcasts</span>
              </h2>
              <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
                Conversations on faith, mindset, career, and campus stories – all powered by YouTube, right here.
              </p>
            </Reveal>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="rounded-full bg-blue-600 hover:bg-blue-700 shadow-glow font-semibold">
                <Link to="/podcasts">
                  <Podcast className="mr-2 h-5 w-5" />
                  Browse Episodes
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <Link to="/podcasts">
                  Explore Podcasts
                </Link>
              </Button>
            </div>
          </div>
        </section>

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