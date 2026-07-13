import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Reveal, SectionLabel } from "./Reveal";

export function PageShell({
  label,
  title,
  subtitle,
  children,
}: {
  label: string;
  title: ReactNode;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <Header />
      <main className="pt-32 pb-24">
        <section className="mx-auto max-w-4xl px-6">
          <Reveal>
            <SectionLabel>{label}</SectionLabel>
            <h1 className="mt-4 font-display text-5xl sm:text-6xl font-semibold tracking-tight">{title}</h1>
            {subtitle && <p className="mt-6 text-lg text-muted-foreground max-w-2xl">{subtitle}</p>}
          </Reveal>
          <div className="mt-16 prose-styled">{children}</div>
        </section>
      </main>
      <Footer />
    </div>
  );
}