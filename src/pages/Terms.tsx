import { PageShell } from "../components/layout/PageShell";

export default function Terms() {
  return (
    <PageShell label="Legal" title={<>Terms of <span className="text-gradient-blue">Service</span></>} subtitle="Last updated: January 2026. By using WEAVE you agree to these terms.">
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <S t="Using Commons">You must be a student, alumnus, or approved partner of a university or an affiliated institution to use certain features.</S>
        <S t="Your content">You retain ownership of what you post. You grant Commons a limited license to display it within the platform. By posting, you agree that you are solely legally responsible for the content you submit.</S>
        <S t="Acceptable use">No harassment, hate speech, defamation, illegal activity, scams, spam, or copyright infringement. We enforce a strict policy against content that harms other students.</S>
        <S t="Moderation & Removal">Commons reserves the right to review, edit, or remove ANY content, for ANY reason, at ANY time, without prior notice. We do not guarantee the publication of any submitted content.</S>
        <S t="Copyright & DMCA">If you believe your copyrighted work has been posted on this platform without authorization, please email us immediately. We will promptly remove violating content in accordance with standard Safe Harbor principles.</S>
        <S t="Disclaimer of Liability">The views, opinions, and statements expressed in stories and blogs are solely those of the individual authors. They do not reflect the official policy, stance, or position of Commons, its creators, or any affiliated institution. Commons acts solely as a neutral hosting platform.</S>
        <S t="Marketplace transactions">Commons facilitates connections between students. We are not a party to transactions and are not responsible for the quality, safety or legality of listed items.</S>
        <S t="Termination">We may suspend accounts that violate these terms. You may delete your account at any time.</S>
        <S t="Changes">We may update these terms. We'll notify users of material changes.</S>
        <S t="Contact & Abuse Reporting">Questions or need to report abusive/copyrighted content? Email <a className="text-blue-600 underline" href="mailto:chilengawarren307@gmail.com">chilengawarren307@gmail.com</a>.</S>
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