import { Card, CardContent } from "../../components/ui/card";
import { Reveal, SectionLabel } from "../../components/layout/Reveal";
import { HeartHandshake, Lightbulb, Shield, Users } from "lucide-react";

export function CoreValues() {
  const values = [
    { icon: Users, title: "Community-first", desc: "We connect students so support is never far away." },
    { icon: Shield, title: "Trust & clarity", desc: "Status labels and transparency keep things honest." },
    { icon: Lightbulb, title: "Practical learning", desc: "Tools and content that help you move forward now." },
    { icon: HeartHandshake, title: "Care for students", desc: "Built with empathy for real campus struggles." },
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
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-glow">
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

