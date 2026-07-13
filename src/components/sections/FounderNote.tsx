import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Reveal, SectionLabel } from "../../components/layout/Reveal";
import { ArrowRight } from "lucide-react";

export function FounderNote() {
  return (
    <section className="py-24 bg-secondary/20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 md:grid-cols-2 items-center">
          <div>
            <Reveal>
              <SectionLabel>Founder note</SectionLabel>
              <h2 className="mt-4 font-display text-4xl sm:text-5xl font-semibold tracking-tight">
                Built by a student. For students.
              </h2>
              <p className="mt-6 text-base text-muted-foreground leading-relaxed">
                Warren Hub exists because the “right info” shouldn’t take months to discover. I built this space so every
                CBU student can move faster—toward community, opportunities, and real support.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild size="lg" className="rounded-full bg-blue-600 hover:bg-blue-700 shadow-glow font-semibold">
                  <a href="#ecosystem">
                    Explore the ecosystem <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full border-green-500 text-green-600 hover:bg-green-50 font-semibold">
                  <a href="/contact">Contact me</a>
                </Button>
              </div>
            </Reveal>
          </div>

          <div className="relative">
            <Reveal>
              <div className="rounded-3xl border border-border bg-card p-8 shadow-elegant">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 rounded-2xl bg-blue-600 text-white">
                    <AvatarFallback className="text-xl">W</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-display text-2xl font-semibold">Warren</p>
                    <p className="text-sm text-muted-foreground">CBU Student • Builder</p>
                  </div>
                </div>
                <p className="mt-6 text-sm text-muted-foreground leading-relaxed">
                  If you have ideas, partnerships, or improvements—send a note. This hub grows with the community.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

