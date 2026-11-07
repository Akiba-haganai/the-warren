import { ArrowRight, Headphones, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Reveal } from "../../components/layout/Reveal";
import { FloatingOrbs } from "./HeroFloatingOrbs";
import { NetworkGrid } from "./HeroNetworkGrid";

export function Hero() {
  return (
    <section className="relative min-h-[82vh] flex items-center bg-hero overflow-hidden pt-32 pb-20">
      <FloatingOrbs />
      <NetworkGrid />

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/70 backdrop-blur px-4 py-1.5 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Built for everyone
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h1 className="mt-6 font-display text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-balance leading-[1.05]">
            Where Stories, Culture &amp;{" "}
            <span className="text-gradient-blue">Community</span> Meet
          </h1>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-6 mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground">
            Hi, I’m <span className="font-semibold text-foreground">Warren</span> — the developer behind Weave, a connected space built to make discovering stories, conversations, and everyday opportunities simpler for everyone.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground hover:opacity-95 shadow-glow font-semibold">
              <Link to="/podcasts">
                <Headphones className="mr-2 h-4 w-4" />
                Listen to Podcasts
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full font-semibold">
              <Link to="/blogs">
                Read Stories <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
