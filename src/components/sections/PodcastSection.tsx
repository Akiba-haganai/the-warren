import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Reveal, SectionLabel } from "../../components/layout/Reveal";
import { Mic, PlayCircle } from "lucide-react";

export function PodcastSection() {
  const episodes = [
    { title: "Breakfast Stories", desc: "Mindset, faith and campus life." },
    { title: "From Class to Community", desc: "Clubs, events and belonging." },
    { title: "Jobs & Opportunities", desc: "Real paths to get moving." },
  ];

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionLabel>Podcasts</SectionLabel>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl font-semibold tracking-tight">
            Learn, laugh, and grow—on the go.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {episodes.map((ep, i) => (
            <Reveal key={ep.title} delay={i * 0.07}>
              <Card className="border-border bg-card rounded-3xl">
                <CardContent className="p-7">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-glow">
                      <Mic className="h-5 w-5" />
                    </span>
                    <h3 className="font-display text-2xl font-semibold">{ep.title}</h3>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{ep.desc}</p>
                  <Button
                    asChild
                    variant="outline"
                    className="mt-6 rounded-full border-blue-500 text-blue-700 hover:bg-blue-50 font-semibold w-full"
                  >
                    <a href="#" onClick={(e) => e.preventDefault()}>
                      <PlayCircle className="mr-2 h-4 w-4" />
                      Play
                    </a>
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

