import { MessageCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Reveal, SectionLabel } from "../../components/layout/Reveal";

export function JoinCommunity() {
  return (
    <section className="py-24 bg-blue-50">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <Reveal>
          <SectionLabel>Get Involved</SectionLabel>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl font-semibold tracking-tight">
            Connect with us on <span className="text-gradient-blue">WhatsApp</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Join our WhatsApp Channel for updates or chat with other CBU students in the group.
          </p>
        </Reveal>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-green-500 hover:bg-green-600 text-white shadow-glow font-semibold"
          >
            <a
              href="https://whatsapp.com/channel/0029Vb8NY5f84OmCRIr9K91V"
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Join WhatsApp Channel
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full border-2 border-green-500 text-green-600 hover:bg-green-50 font-semibold"
          >
            <a
              href="https://chat.whatsapp.com/I4TtoTKBGB9I4eVv4VKXGs"
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Join WhatsApp Group
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

