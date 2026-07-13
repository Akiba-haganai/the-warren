import { motion } from "framer-motion";
import { Megaphone, Home, Briefcase, BookOpen, Users } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Reveal, SectionLabel } from "../../components/layout/Reveal";

const items = [
  { icon: Megaphone, title: "Information is scattered", desc: "..." },
  { icon: Home, title: "Accommodation is difficult", desc: "..." },
  { icon: Briefcase, title: "Jobs are hidden", desc: "..." },
  { icon: BookOpen, title: "Learning is fragmented", desc: "..." },
  { icon: Users, title: "Communities are disconnected", desc: "..." },
];

export function WhyWarren() {
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionLabel>Why Warren Hub exists</SectionLabel>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl font-semibold tracking-tight max-w-3xl">
            Students shouldn't have to <span className="text-gradient-blue">figure it all out alone</span>.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 0.08}>
              <motion.div whileHover={{ y: -6 }}>
                <Card className="group relative overflow-hidden border-border bg-card h-full transition hover:shadow-glow">
                  <CardContent className="p-6">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-blue-100 via-transparent to-blue-200" />
                    <div className="relative">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                        <it.icon className="h-5 w-5" />
                      </span>
                      <h3 className="mt-4 text-lg font-semibold">{it.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{it.desc}</p>
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