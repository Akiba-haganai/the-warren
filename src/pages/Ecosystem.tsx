
import { PageShell } from "../components/layout/PageShell";
import { ArrowRight, GraduationCap, Store, Home, Briefcase, Podcast, UserPlus, Sparkles, Building2 } from "lucide-react";

const products = [
  { icon: GraduationCap, name: "Warren Hub", desc: "The student feed. Community, events, notes, podcasts, clubs.", url: "https://warren-campus.vercel.app", status: "Live" },
  { icon: Store, name: "Warren Market", desc: "Marketplace, services, student businesses and jobs.", url: "https://warren-market.vercel.app", status: "Live" },
  { icon: Home, name: "Warren Homes", desc: "Verified student accommodation near campus.", status: "Soon" },
  { icon: Briefcase, name: "Warren Jobs", desc: "Student gigs, internships, opportunities.", status: "Soon" },
  { icon: Podcast, name: "Breakfast Podcast", desc: "Conversations on faith, mindset and campus stories.", status: "Soon" },
  { icon: UserPlus, name: "Warren Alumni", desc: "Life after graduation — a network that lasts.", status: "Soon" },
  { icon: Building2, name: "Warren Business", desc: "Tools for student founders and small businesses.", status: "Soon" },
  { icon: Sparkles, name: "Warren AI", desc: "An assistant for everything student life.", status: "Soon" },
];

export default function Ecosystem() {
  return (
    <PageShell
      label="The Ecosystem"
      title={<>One <span className="text-gradient-blue">ecosystem</span>. Every part of student life.</>}
      subtitle="Each Warren Hub product solves a real problem. Together, they become the digital home of student life at CBU."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <div key={p.name} className="group rounded-2xl border border-border bg-card p-6 flex flex-col">
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-glow">
                <p.icon className="h-5 w-5" />
              </span>
              <span className={`text-xs font-medium rounded-full px-2 py-0.5 ${p.status === "Live" ? "bg-blue-100 text-blue-700" : "bg-muted text-muted-foreground"}`}>
                {p.status}
              </span>
            </div>
            <h3 className="mt-4 font-display text-xl font-semibold">{p.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground flex-1">{p.desc}</p>
            {p.url && (
              <a href={p.url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600">
                Visit <ArrowRight className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        ))}
      </div>
    </PageShell>
  );
}