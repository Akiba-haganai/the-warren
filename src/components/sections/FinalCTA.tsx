import { Button } from "../../components/ui/button";
import { Reveal } from "../../components/layout/Reveal";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function FinalCTA() {
  return (
    <section className="py-24 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium tracking-wide uppercase text-white/90">
            <span className="h-1.5 w-1.5 rounded-full bg-white/80 animate-pulse-glow" />
            Join the conversation
          </div>

          <h2 className="mt-4 font-display text-4xl sm:text-5xl font-semibold tracking-tight">
            Explore Weave — starting today.
          </h2>
          <p className="mt-6 text-white/85 max-w-2xl mx-auto">
            Tune into original episodes, read community stories, and discover companion apps built for everyone.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="rounded-full bg-white text-slate-900 hover:bg-white/90 font-semibold">
              <Link to="/podcasts">
                Listen to Podcasts <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full border-white/70 text-white hover:bg-white/10 font-semibold"
            >
              <Link to="/contact">
                Contact Us
              </Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
