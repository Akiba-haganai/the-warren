import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Reveal, SectionLabel } from "../../components/layout/Reveal";
import { Briefcase, Building2, UserCircle, Target } from "lucide-react";

export function StitchShowcase() {
  const deals = [
    { icon: Briefcase, title: "Internships & Jobs", desc: "Opportunities tailored for students and fresh graduates." },
    { icon: Building2, title: "Verified Employers", desc: "Connect safely with vetted companies and recruiters." },
    { icon: UserCircle, title: "Public Profiles", desc: "Showcase your skills, headline, and academic experience." },
    { icon: Target, title: "Smart Matching", desc: "Find the perfect role based on your skills and location." },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionLabel>Careers</SectionLabel>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl font-semibold tracking-tight">
            Find opportunities. Build experience. Get hired.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {deals.map((d, i) => (
            <Reveal key={d.title} delay={i * 0.07}>
              <Card className="border-border bg-card rounded-3xl overflow-hidden">
                <CardContent className="p-7">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-glow">
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
          <Button asChild size="lg" className="rounded-full bg-indigo-600 hover:bg-indigo-700 shadow-glow font-semibold">
            <a href="https://warren-stitch.vercel.app" target="_blank" rel="noreferrer">
              Visit STITCH
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
