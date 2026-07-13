import { PageShell } from "../components/layout/PageShell";

export default function Cookies() {
  return (
    <PageShell label="Legal" title={<>Cookie <span className="text-gradient-blue">Policy</span></>} subtitle="Last updated: January 2026.">
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <Section title="What are cookies">Cookies are small text files stored on your device that help sites remember your preferences and understand how you use them.</Section>
        <Section title="Essential cookies">Required to keep you signed in and secure. Cannot be disabled.</Section>
        <Section title="Analytics cookies">Help us understand which pages are popular and how to improve. You can opt out.</Section>
        <Section title="Advertising cookies">If Warren Hub enables third-party advertising in the future (e.g. Google AdSense), those providers may set cookies to personalize ads and measure performance.</Section>
        <Section title="Managing cookies">Most browsers let you refuse or delete cookies via settings. Doing so may affect functionality.</Section>
      </div>
    </PageShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-foreground">{title}</h2>
      <p className="mt-2">{children}</p>
    </div>
  );
}