import { MessageCircle, Users, Camera, PlaySquare } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Reveal, SectionLabel } from "../../components/layout/Reveal";

export function JoinCommunity() {
  return (
    <section id="community" className="py-24 bg-muted/30 dark:bg-muted/10 scroll-mt-24">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <Reveal>
          <SectionLabel>Get Involved</SectionLabel>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl font-semibold tracking-tight">
            Join the <span className="text-gradient-blue">community</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you want quick updates, deep conversations, or podcast content – we're everywhere you are.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* WhatsApp Channel */}
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
              WhatsApp Channel
            </a>
          </Button>

          {/* WhatsApp Group */}
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full border-2 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950 font-semibold"
          >
            <a
              href="https://chat.whatsapp.com/I4TtoTKBGB9I4eVv4VKXGs"
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              WhatsApp Group
            </a>
          </Button>

          {/* Facebook Group */}
          <Button
            asChild
            size="lg"
            className="rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-glow font-semibold"
          >
            <a
              href="https://web.facebook.com/groups/warrenstudenthub/"
              target="_blank"
              rel="noreferrer"
            >
              <Users className="mr-2 h-5 w-5" />
              Facebook Group
            </a>
          </Button>

          {/* Instagram */}
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full border-2 border-pink-500 text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-950 font-semibold"
          >
            <a
              href="https://instagram.com/warrenpodcasts_cbu"
              target="_blank"
              rel="noreferrer"
            >
              <Camera className="mr-2 h-5 w-5" />
              Instagram
            </a>
          </Button>

          {/* YouTube */}
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full border-2 border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 font-semibold"
          >
            <a
              href="https://youtube.com/channel/UCGKgsxYNTUESqdvySiMIQ1A"
              target="_blank"
              rel="noreferrer"
            >
              <PlaySquare className="mr-2 h-5 w-5" />
              YouTube
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}