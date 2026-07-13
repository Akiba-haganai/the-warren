import { PageShell } from "../components/layout/PageShell";

export default function Privacy() {
  return (
    <PageShell label="Legal" title={<>Privacy <span className="text-gradient-blue">Policy</span></>} subtitle="Last updated: January 2026. This page describes what data Warren Hub collects and how it is used.">
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <Section title="Information we collect">We collect information you provide when you create an account — name, email, university details — and information generated automatically when you use our products, like device type and usage patterns.</Section>
        <Section title="How we use it">To operate, secure, and improve Warren Hub products. To communicate about updates. To display relevant content within the platform.</Section>
        <Section title="Sharing">We do not sell personal data. We share limited data only with service providers who help us run Warren Hub, under strict agreements.</Section>
        <Section title="Cookies & analytics">We use cookies to keep you signed in and to understand how the site is used. See our <a className="text-blue-600 underline" href="/cookies">Cookie Policy</a>.</Section>
        <Section title="Your rights">You may access, correct or delete your data at any time by contacting <a className="text-blue-600 underline" href="mailto:hello@warrenhub.app">hello@warrenhub.app</a>.</Section>
        <Section title="Advertising">Warren Hub may serve ads in the future via third-party providers such as Google AdSense. When enabled, those providers may use cookies to personalize ads.</Section>
        <Section title="Contact">Questions about privacy? Email <a className="text-blue-600 underline" href="mailto:hello@warrenhub.app">hello@warrenhub.app</a>.</Section>
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