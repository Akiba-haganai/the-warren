import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Reveal, SectionLabel } from "../../components/layout/Reveal";
import { GraduationCap, MapPin, Sparkles } from "lucide-react";

export function CampusShowcase() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionLabel>Campus life, simplified</SectionLabel>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl font-semibold tracking-tight">
            Everything you need—right where you study.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {[ 
            { icon: MapPin, title: "Find places", desc: "Accommodation spots, offices, and key locations." },
            { icon: GraduationCap, title: "Track opportunities", desc: "Jobs, internships, and student programs." },
            { icon: Sparkles, title: "Stay in sync", desc: "Events, announcements, and community updates." },
          ].map((it, i) => (
            <Reveal key={it.title} delay={i * 0.07}>
              <Card className="border-border bg-card rounded-3xl">
                <CardContent className="p-7">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-glow">
                      <it.icon className="h-5 w-5" />
                    </span>
                    <h3 className="font-display text-2xl font-semibold">{it.title}</h3>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{it.desc}</p>

                  <Button
                    asChild
                    variant="link"
                    className="mt-6 text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    <a href="https://warren-campus.vercel.app" target="_blank" rel="noreferrer">Learn more</a>
                  </Button>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

