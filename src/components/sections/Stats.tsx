import { Card, CardContent } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { Reveal, SectionLabel } from "../../components/layout/Reveal";

export function Stats() {
  return (
    <section className="py-24" id="stats">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionLabel>Community progress</SectionLabel>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl font-semibold tracking-tight">
            Momentum you can feel.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <Card className="border-border bg-card rounded-3xl">
            <CardContent className="p-7">
              <h3 className="font-display text-2xl font-semibold">Students connected</h3>
              <p className="mt-2 text-sm text-muted-foreground">Growing week by week.</p>
              <div className="mt-6">
                <Progress value={62} />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">62% toward next milestone</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card rounded-3xl">
            <CardContent className="p-7">
              <h3 className="font-display text-2xl font-semibold">Verified info</h3>
              <p className="mt-2 text-sm text-muted-foreground">Clear status labels.</p>
              <div className="mt-6">
                <Progress value={48} />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">48% toward next milestone</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card rounded-3xl">
            <CardContent className="p-7">
              <h3 className="font-display text-2xl font-semibold">Opportunities posted</h3>
              <p className="mt-2 text-sm text-muted-foreground">More gigs, jobs and programs.</p>
              <div className="mt-6">
                <Progress value={73} />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">73% toward next milestone</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

