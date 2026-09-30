import { PageShell } from "../components/layout/PageShell";

export default function Privacy() {
  return (
    <PageShell label="Legal" title={<>Privacy <span className="text-gradient-blue">Policy</span></>} subtitle="Last updated: August 2026. This page describes what data Weave collects and how it is used.">
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <Section title="Information we collect">We collect information you provide when you submit a story (like your name or pen name and university details) and anonymous information generated automatically when you use our products, like device type and usage patterns.</Section>
        <Section title="How we use it">To operate, secure, and improve Weave products. To communicate about updates. To display relevant content within the platform.</Section>
        <Section title="Sharing">We do not sell personal data. We share limited data only with service providers who help us run Weave, under strict agreements.</Section>
        <Section title="Cookies & analytics">We use third-party analytics tools (like Google Analytics or Vercel Analytics) that may collect anonymous usage data using cookies to understand how the site is used. See our <a className="text-blue-600 underline" href="/cookies">Cookie Policy</a>.</Section>
        <Section title="Your rights">Under the Zambia Data Protection Act No. 3 of 2021, you have the right to access, correct or delete your data at any time by contacting <a className="text-blue-600 underline" href="mailto:chilengawarren307@gmail.com">chilengawarren307@gmail.com</a>.</Section>
        <Section title="Advertising">Weave may serve ads via third-party providers such as Google AdSense. When enabled, those providers use cookies to serve personalized ads based on your prior visits to this or other websites.</Section>
        <Section title="Contact">Questions about privacy? Email <a className="text-blue-600 underline" href="mailto:chilengawarren307@gmail.com">chilengawarren307@gmail.com</a>.</Section>
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
