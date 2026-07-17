import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Reveal, SectionLabel } from "../../components/layout/Reveal";
import { Store, Briefcase, Bike, ShieldCheck } from "lucide-react";

export function MarketShowcase() {
  const deals = [
    { icon: Store, title: "Services & goods", desc: "Student businesses and verified listings." },
    { icon: Briefcase, title: "Jobs & gigs", desc: "Opportunities matched to student schedules." },
    { icon: Bike, title: "Transport & delivery", desc: "Quick help for campus commutes." },
    { icon: ShieldCheck, title: "Trust built-in", desc: "Clear status labels and community feedback." },
  ];

  return (
    <section className="py-24 bg-secondary/20">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionLabel>Warren Market</SectionLabel>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl font-semibold tracking-tight">
            Buy, sell, work—without the chaos.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {deals.map((d, i) => (
            <Reveal key={d.title} delay={i * 0.07}>
              <Card className="border-border bg-card rounded-3xl overflow-hidden">
                <CardContent className="p-7">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-glow">
                        <d.icon className="h-5 w-5" />
                      </span>
                      <h3 className="font-display text-2xl font-semibold">{d.title}</h3>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{d.desc}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Button asChild size="lg" className="rounded-full bg-blue-600 hover:bg-blue-700 shadow-glow font-semibold">
            <a href="https://warren-market.vercel.app" target="_blank" rel="noreferrer">
              Visit Warren Connect
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

