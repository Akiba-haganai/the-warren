import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Reveal, SectionLabel } from "@/components/layout/Reveal";
import { Link } from "react-router-dom";
import { MapPin, ArrowRight, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface University {
  slug: string;
  name: string;
  description: string;
  location: string;
}

// Eventually fetched from Sanity — hardcoded here for the initial directory release
const UNIVERSITIES: University[] = [
  {
    slug: "cbu",
    name: "Copperbelt University",
    description: "Science, Technology, Business and Social Sciences.",
    location: "Kitwe, Copperbelt Province",
  },
  {
    slug: "unza",
    name: "University of Zambia",
    description: "Zambia's flagship public research university.",
    location: "Lusaka, Lusaka Province",
  },
  {
    slug: "mulungushi",
    name: "Mulungushi University",
    description: "Multi-disciplinary learning in the heart of Kabwe.",
    location: "Kabwe, Central Province",
  },
  {
    slug: "zcas",
    name: "ZCAS University",
    description: "Accountancy, Business and Technology.",
    location: "Lusaka, Lusaka Province",
  },
];

export default function CampusDirectory() {
  return (
    <>
      <Header />
      <main className="pt-32 pb-24 bg-background min-h-screen">
        <section className="mx-auto max-w-4xl px-6">
          <Reveal>
            <SectionLabel>Campuses</SectionLabel>
            <h1 className="mt-4 font-display text-4xl sm:text-5xl font-semibold tracking-tight">
              WEAVE across Zambia
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              WEAVE is your student media network — wherever you study. Select your university to see news, polls, podcasts and culture from your campus.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {UNIVERSITIES.map((uni, i) => (
              <Reveal key={uni.slug} delay={i * 0.06}>
                <Link to={`/campuses/${uni.slug}`}>
                  <Card className="h-full border-border bg-card hover:shadow-glow hover:-translate-y-1 transition-all duration-300 group overflow-hidden">
                    <CardContent className="p-6 flex flex-col gap-3 h-full">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-blue-600/10 flex items-center justify-center">
                          <GraduationCap className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                          <h2 className="font-semibold text-base leading-snug group-hover:text-blue-600 transition-colors">
                            {uni.name}
                          </h2>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3" /> {uni.location}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground flex-1">{uni.description}</p>
                      <div className="flex items-center gap-1 text-xs font-medium text-blue-600 group-hover:gap-2 transition-all">
                        View campus <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-12 rounded-2xl border border-border bg-muted/30 p-6 text-center">
              <p className="text-muted-foreground text-sm">
                Don't see your university?{" "}
                <Link to="/contact" className="text-blue-600 hover:underline font-medium">
                  Get in touch
                </Link>{" "}
                — we're expanding across Zambia.
              </p>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
