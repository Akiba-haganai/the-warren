import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Reveal, SectionLabel } from "../../components/layout/Reveal";
import { Mic, PlayCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function PodcastSection() {
  const episodes = [
    { title: "Breakfast Stories", desc: "Mindset, faith and campus life." },
    { title: "From Class to Community", desc: "Clubs, events and belonging." },
    { title: "Jobs & Opportunities", desc: "Real paths to get moving." },
  ];

  return (
    <section id="podcasts" className="py-24 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionLabel>Podcasts</SectionLabel>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl font-semibold tracking-tight">
            Learn, laugh, and grow — on the go.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            Student‑led conversations about faith, career, relationships, and campus life. Powered by YouTube, played right here.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {episodes.map((ep, i) => (
            <Reveal key={ep.title} delay={i * 0.07}>
              <Card className="border-border bg-card rounded-3xl h-full flex flex-col">
                <CardContent className="p-7 flex flex-col h-full">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-glow">
                      <Mic className="h-5 w-5" />
                    </span>
                    <h3 className="font-display text-2xl font-semibold">{ep.title}</h3>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1">{ep.desc}</p>
                  <Button
                    asChild
                    variant="outline"
                    className="mt-6 rounded-full border-blue-500 text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950 font-semibold w-full"
                  >
                    <Link to="/podcasts">
                      <PlayCircle className="mr-2 h-4 w-4" />
                      Listen now
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button asChild variant="ghost" className="rounded-full text-blue-600 font-medium">
            <Link to="/podcasts">
              Browse all episodes <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}