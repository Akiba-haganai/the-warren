import { PageShell } from "../components/layout/PageShell";
import { ForceRefreshButton } from "@/components/layout/ForceRefreshButton";
import { useVersionCheck } from "@/hooks/useVersionCheck";

export default function About() {
  const { isStale } = useVersionCheck();
  const currentVersion = typeof __APP_VERSION__ !== "undefined" ? __APP_VERSION__ : "dev";


  return (
    <PageShell
      label="About WAVE"
      title={<>We're building a <span className="text-gradient-blue">home</span> for university students.</>}
      subtitle="WAVE started with a simple observation: student life is fragmented. We're changing that — one product, one community, one milestone at a time."
    >
      <div className="grid gap-6 md:grid-cols-2 mb-12">
        {[
          { h: "Our mission", p: "To make student life on any campus more connected, more supported, and more meaningful." },
          { h: "Our beginning", p: "A group of students, tired of scattered information and hidden opportunities, decided to build the platform they wished existed." },
          { h: "Our approach", p: "Products that solve one real problem beautifully, then connect into an ecosystem larger than the sum of its parts." },
          { h: "Our home", p: "Rooted in Kitwe, built for students, designed to travel to every university one day." },
        ].map((b) => (
          <div key={b.h} className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-display text-xl font-semibold">{b.h}</h3>
            <p className="mt-2 text-muted-foreground">{b.p}</p>
          </div>
        ))}
      </div>
      
      <div className="pt-8 border-t">
        <ForceRefreshButton />
        <p className="text-xs text-neutral-400 mt-4 text-center">
          Version: {currentVersion}
          {isStale && (
            <span className="text-amber-600">
              {" "}· Newer version available — try Force Refresh above
            </span>
          )}

        </p>
      </div>
    </PageShell>
  );
}