import { Button } from "../../components/ui/button";
import { Reveal } from "../../components/layout/Reveal";
import { ArrowRight } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="py-24 bg-blue-600 text-white">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium tracking-wide uppercase text-white/80">
            <span className="h-1.5 w-1.5 rounded-full bg-white/70 animate-pulse-glow" />
            Ready to join?
          </div>

          <h2 className="mt-4 font-display text-4xl sm:text-5xl font-semibold tracking-tight">
            Build your Warren journey—starting today.
          </h2>
          <p className="mt-6 text-white/80 max-w-2xl mx-auto">
            Join the community, explore the ecosystem, and get real opportunities without hunting for scraps.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="rounded-full bg-white text-blue-700 hover:bg-blue-50 font-semibold">
              <a href="/contact">
                Contact us <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full border-white/70 text-white hover:bg-white/10 font-semibold"
            >
              <a href="https://chat.whatsapp.com/I4TtoTKBGB9I4eVv4VKXGs" target="_blank" rel="noreferrer">
                Join WhatsApp Group
              </a>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

