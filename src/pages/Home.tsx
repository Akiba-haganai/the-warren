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
import { PodcastSection } from "../components/sections/PodcastSection";
import { FounderNote } from "../components/sections/FounderNote";
import { CoreValues } from "../components/sections/CoreValues";
import { Roadmap } from "../components/sections/Roadmap";
import { Stats } from "../components/sections/Stats";
import { FinalCTA } from "../components/sections/FinalCTA";

export default function Home() {
  return (
    <div className="relative">
      <Header />
      <main>
        <Hero />
        <WhyWarren />
        <JoinCommunity />
        <div className="mx-auto max-w-7xl px-6 mt-2">
          <AdUnit slot="1234567890" format="auto" className="my-8" />
        </div>

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