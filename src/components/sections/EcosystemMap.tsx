import { Badge } from "../../components/ui/badge";
import { Card, CardContent } from "../../components/ui/card";
import { Reveal, SectionLabel } from "../../components/layout/Reveal";

type EcoNode = {
  title: string;
  desc: string;
  badge: string;
};

const nodes: EcoNode[] = [
  { title: "Warren Hub", desc: "Community, events, podcasts and updates.", badge: "Live" },
  { title: "Warren Market", desc: "Accommodation, services, jobs and student businesses.", badge: "Live" },
  { title: "Warren Homes", desc: "Verified student accommodation pathways.", badge: "Soon" },
  { title: "Warren Jobs", desc: "Opportunities, internships and gigs.", badge: "Soon" },
  { title: "Warren Alumni", desc: "A network that lasts after graduation.", badge: "Soon" },
];

export function EcosystemMap() {
  return (
    <section id="ecosystem" className="py-24 bg-secondary/20">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionLabel>The Ecosystem</SectionLabel>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl font-semibold tracking-tight">
            Every Warren product connects to <span className="text-gradient-blue">student life</span>.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {nodes.map((n, i) => (
            <Reveal key={n.title} delay={i * 0.06}>
              <Card className="rounded-3xl overflow-hidden border-border bg-card">
                <CardContent className="p-7">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-display text-2xl font-semibold">{n.title}</h3>
                    <Badge variant={n.badge === "Live" ? "default" : "secondary"}>{n.badge}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{n.desc}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 text-center text-muted-foreground">
          Hover, explore, and discover what’s available now.
        </div>
      </div>
    </section>
  );
}

