import { PageShell } from "../components/layout/PageShell";

export default function Terms() {
  return (
    <PageShell label="Legal" title={<>Terms of <span className="text-gradient-blue">Service</span></>} subtitle="Last updated: January 2026. By using Warren Hub you agree to these terms.">
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <S t="Using Warren Hub">You must be a student, alumnus, or approved partner of Copperbelt University or an affiliated institution to use certain features.</S>
        <S t="Your content">You retain ownership of what you post. You grant Warren Hub a limited license to display it within the platform.</S>
        <S t="Acceptable use">No harassment, illegal activity, scams, spam or content that harms other students. Violations lead to account removal.</S>
        <S t="Marketplace transactions">Warren Hub facilitates connections between students. We are not a party to transactions and are not responsible for the quality, safety or legality of listed items.</S>
        <S t="Termination">We may suspend accounts that violate these terms. You may delete your account at any time.</S>
        <S t="Changes">We may update these terms. We'll notify users of material changes.</S>
        <S t="Contact">Questions? Email <a className="text-blue-600 underline" href="mailto:hello@warrenhub.app">hello@warrenhub.app</a>.</S>
      </div>
    </PageShell>
  );
}

function S({ t, children }: { t: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-foreground">{t}</h2>
      <p className="mt-2">{children}</p>
    </div>
  );
}