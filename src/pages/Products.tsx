import { PageShell } from "../components/layout/PageShell";
import { ArrowRight, GraduationCap, Store } from "lucide-react";

export default function Products() {
  return (
    <PageShell
      label="Products"
      title={<>Made for the way <span className="text-gradient-blue">students live</span>.</>}
      subtitle="Two flagship products, live today. More on the way."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <a href="https://warren-campus.vercel.app" target="_blank" rel="noreferrer" className="group relative overflow-hidden rounded-3xl bg-blue-700 p-8 text-white shadow-elegant hover:scale-[1.02] transition">
          <GraduationCap className="h-10 w-10" />
          <h3 className="mt-6 font-display text-3xl font-semibold">Warren Hub</h3>
          <p className="mt-2 text-white/70">Community, events, notes, podcasts, clubs and announcements — the pulse of CBU.</p>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium">Visit Hub <ArrowRight className="h-4 w-4" /></span>
        </a>
        <a href="https://warren-market.vercel.app" target="_blank" rel="noreferrer" className="group relative overflow-hidden rounded-3xl bg-blue-600 p-8 text-white shadow-glow hover:scale-[1.02] transition">
          <Store className="h-10 w-10" />
          <h3 className="mt-6 font-display text-3xl font-semibold">Warren Market</h3>
          <p className="mt-2 text-white/80">Accommodation, marketplace, services, student businesses and jobs.</p>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium">Visit Market <ArrowRight className="h-4 w-4" /></span>
        </a>
      </div>
    </PageShell>
  );
}