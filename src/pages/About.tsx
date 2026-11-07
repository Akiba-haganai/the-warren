import { PageShell } from "../components/layout/PageShell";
import { ForceRefreshButton } from "@/components/layout/ForceRefreshButton";
import { useVersionCheck } from "@/hooks/useVersionCheck";

declare const __APP_VERSION__: string | undefined;
declare const __APP_ENV__: string | undefined;
declare const __APP_BRANCH__: string | undefined;

export default function About() {
  const { isStale } = useVersionCheck();
  const currentVersion = typeof __APP_VERSION__ !== "undefined" ? __APP_VERSION__ : "dev";
  const envName = typeof __APP_ENV__ !== "undefined" ? __APP_ENV__ : "local";
  const branchName = typeof __APP_BRANCH__ !== "undefined" ? __APP_BRANCH__ : "unknown";
  return (
    <PageShell
      label="About Weave"
      title={
        <>
          We're building a connected <span className="text-gradient-blue">media &amp; community hub</span> for everyone.
        </>
      }
      subtitle="Weave started with a simple idea: great stories, thoughtful conversations, and everyday tools shouldn't be scattered across a dozen places."
    >
      <div className="grid gap-6 md:grid-cols-2 mb-12">
        {[
          {
            h: "Our mission",
            p: "To bring people together through honest stories, original podcasts, culture, and accessible digital tools.",
          },
          {
            h: "Developer acknowledgement",
            p: "Created and developed by Warren — built to turn scattered conversations and opportunities into one cohesive experience.",
          },
          {
            h: "Our approach",
            p: "Focused products that solve real everyday needs cleanly, connected through a single discovery front door.",
          },
          {
            h: "Where we're rooted",
            p: "Crafted in Kitwe, Zambia, and open to everyone, everywhere.",
          },
        ].map((b) => (
          <div key={b.h} className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-xl font-semibold">{b.h}</h2>
            <p className="mt-2 text-muted-foreground">{b.p}</p>
          </div>
        ))}
      </div>

      <div className="pt-8 border-t">
        <ForceRefreshButton />
        <p className="text-xs text-neutral-400 mt-4 text-center">
          Version: {currentVersion} ({envName} / {branchName})
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
