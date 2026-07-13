import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Reveal, SectionLabel } from "../../components/layout/Reveal";

const items = [
  { title: "Verified student profiles", desc: "Reduce spam and make connections safer.", badge: "In progress" },
  { title: "Events that actually show up", desc: "Smart reminders and campus-wide visibility.", badge: "Planned" },
  { title: "Marketplace improvements", desc: "Better categories, filters, and reviews.", badge: "Planned" },
  { title: "Warren AI assistant", desc: "Answers for student life—fast and helpful.", badge: "Soon" },
];

export function Roadmap() {
  return (
    <section className="py-24 bg-secondary/20" id="roadmap">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionLabel>Roadmap</SectionLabel>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl font-semibold tracking-tight">
            Building in public, with the community.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 0.07}>
              <Card className="border-border bg-card rounded-3xl">
                <CardContent className="p-7">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-display text-2xl font-semibold">{it.title}</h3>
                    <Badge variant={it.badge === "In progress" ? "default" : "secondary"}>{it.badge}</Badge>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{it.desc}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

