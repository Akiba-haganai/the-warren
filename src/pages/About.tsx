import { PageShell } from "../components/layout/PageShell";

export default function About() {
  return (
    <PageShell
      label="About Warren Hub"
      title={<>We're building a <span className="text-gradient-blue">home</span> for CBU students.</>}
      subtitle="Warren Hub started with a simple observation: student life is fragmented. We're changing that — one product, one community, one milestone at a time."
    >
      <div className="grid gap-6 md:grid-cols-2">
        {[
          { h: "Our mission", p: "To make student life at Copperbelt University more connected, more supported, and more meaningful." },
          { h: "Our beginning", p: "A group of students, tired of scattered information and hidden opportunities, decided to build the platform they wished existed." },
          { h: "Our approach", p: "Products that solve one real problem beautifully, then connect into an ecosystem larger than the sum of its parts." },
          { h: "Our home", p: "Rooted in Kitwe, built for CBU, designed to travel to every campus in Zambia one day." },
        ].map((b) => (
          <div key={b.h} className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-display text-xl font-semibold">{b.h}</h3>
            <p className="mt-2 text-muted-foreground">{b.p}</p>
          </div>
        ))}
      </div>
    </PageShell>
  );
}