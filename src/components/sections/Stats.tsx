import { Card, CardContent } from "@/components/ui/card";
import { Reveal, SectionLabel } from "@/components/layout/Reveal";
import { Radio, Newspaper, Compass } from "lucide-react";

export function Stats() {
  const pillars = [
    {
      icon: <Radio className="h-6 w-6 text-primary" />,
      title: "Original Conversations",
      description:
        "Deep dives into entrepreneurship, faith, learning, and everyday perspectives.",
      badge: "Media & Audio",
    },
    {
      icon: <Newspaper className="h-6 w-6 text-primary" />,
      title: "Thoughtful Journalism",
      description:
        "Culture, essays, and community stories curated and reviewed by editorial contributors.",
      badge: "Stories & Culture",
    },
    {
      icon: <Compass className="h-6 w-6 text-primary" />,
      title: "Ecosystem Front Door",
      description:
        "Direct access to social communities, marketplace listings, and career opportunities.",
      badge: "Discovery",
    },
  ];

  return (
    <section className="py-24" id="stats">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionLabel>What drives us</SectionLabel>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl font-semibold tracking-tight">
            Built for curious minds.
          </h2>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
            A media network dedicated to amplifying real voices, culture, and meaningful dialogue for everyone.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {pillars.map((pillar, i) => (
            <Reveal key={pillar.title} delay={i * 0.1}>
              <Card className="border-border bg-card rounded-3xl h-full transition hover:border-primary/40 hover:shadow-glow">
                <CardContent className="p-8 flex flex-col justify-between h-full">
                  <div>
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-primary/10 mb-6">
                      {pillar.icon}
                    </div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-primary mb-2">
                      {pillar.badge}
                    </span>
                    <h3 className="font-display text-2xl font-semibold">{pillar.title}</h3>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {pillar.description}
                    </p>
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
