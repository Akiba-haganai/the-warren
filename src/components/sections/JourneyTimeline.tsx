import { motion } from "framer-motion";
import { Card, CardContent } from "../../components/ui/card";
import { Reveal, SectionLabel } from "../../components/layout/Reveal";

const steps = [
  { title: "Discover", desc: "Find what you need: community, accommodation, jobs, and student updates." },
  { title: "Connect", desc: "Join clubs and campus conversations in one place." },
  { title: "Apply", desc: "Explore opportunities and verified pathways for student growth." },
  { title: "Thrive", desc: "Build your Warren journey—together with other CBU students." },
];

export function JourneyTimeline() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionLabel>Our Journey</SectionLabel>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl font-semibold tracking-tight">
            From scattered info to a <span className="text-gradient-blue">connected campus</span>.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08}>
              <motion.div whileHover={{ y: -6 }}>
                <Card className="border-border bg-card rounded-3xl overflow-hidden">
                  <CardContent className="p-7">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-glow">
                        <span className="text-lg font-bold">{i + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-display text-2xl font-semibold">{s.title}</h3>
                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

