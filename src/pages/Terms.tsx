import { PageShell } from "../components/layout/PageShell";
import { SITE_CONFIG } from "@/config/site";

export default function Terms() {
  return (
    <PageShell
      label="Legal"
      title={
        <>
          Terms of <span className="text-gradient-blue">Service</span>
        </>
      }
      subtitle="Last updated: November 2026. By using Weave you agree to these terms."
    >
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <S t="Using Weave">
          Weave is open to everyone. Certain interactive or community features may require verification or adherence to community guidelines.
        </S>
        <S t="Your content">
          You retain ownership of what you post. You grant Weave a limited license to display it within the platform. By posting, you agree that you are solely legally responsible for the content you submit.
        </S>
        <S t="Acceptable use">
          No harassment, hate speech, defamation, illegal activity, scams, spam, or copyright infringement. We enforce a strict policy against content that harms others in the community.
        </S>
        <S t="Moderation & Removal">
          Weave reserves the right to review, edit, or remove ANY content, for ANY reason, at ANY time, without prior notice. We do not guarantee the publication of any submitted content.
        </S>
        <S t="Copyright & DMCA">
          If you believe your copyrighted work has been posted on this platform without authorization, please email us immediately. We will promptly remove violating content in accordance with standard Safe Harbor principles.
        </S>
        <S t="Disclaimer of Liability">
          The views, opinions, and statements expressed in stories, comments, and episodes are solely those of the individual authors. They do not reflect the official policy, stance, or position of Weave or its creators. Weave acts solely as a neutral hosting platform.
        </S>
        <S t="Marketplace transactions">
          Companion platforms facilitate connections between members. Weave is not a party to transactions and is not responsible for the quality, safety, or legality of listed items.
        </S>
        <S t="Termination">
          We may block access for users who violate these terms.
        </S>
        <S t="Changes">
          We may update these terms and will notify users of material changes.
        </S>
        <S t="Contact & Abuse Reporting">
          Questions or need to report abusive/copyrighted content? Email{" "}
          <a className="text-primary underline" href={`mailto:${SITE_CONFIG.contact.email}`}>
            {SITE_CONFIG.contact.email}
          </a>
          .
        </S>
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
