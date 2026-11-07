import { Card, CardContent } from "../../components/ui/card";
import { Reveal, SectionLabel } from "../../components/layout/Reveal";
import { HeartHandshake, Lightbulb, Shield, Users } from "lucide-react";

export function CoreValues() {
  const values = [
    { icon: Users, title: "Community-first", desc: "We connect people so meaningful conversation and support are never far away." },
    { icon: Shield, title: "Trust & clarity", desc: "Clear status labels and editorial transparency keep everything honest." },
    { icon: Lightbulb, title: "Practical insight", desc: "Tools, stories, and episodes that help you move forward every day." },
    { icon: HeartHandshake, title: "Built with care", desc: "Crafted with empathy for real everyday questions, growth, and culture." },
  ];

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionLabel>Core values</SectionLabel>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl font-semibold tracking-tight">
            The way we build is the way we serve.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.07}>
              <Card className="border-border bg-card rounded-3xl">
                <CardContent className="p-7">
                  <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-glow shrink-0">
                      <v.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-display text-2xl font-semibold">{v.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                    </div>
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
