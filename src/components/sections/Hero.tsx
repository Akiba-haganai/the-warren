import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Reveal } from "../../components/layout/Reveal";
import { FloatingOrbs } from "./HeroFloatingOrbs";
import { NetworkGrid } from "./HeroNetworkGrid";
import { FloatingCards } from "./HeroFloatingCards";



export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen bg-hero overflow-hidden pt-32 pb-24">
      <FloatingOrbs />
      <NetworkGrid />

      <motion.div style={{ y, opacity }} className="relative mx-auto max-w-7xl px-6 text-center">
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-card/70 backdrop-blur px-4 py-1.5 text-xs font-medium text-blue-600">
            <Sparkles className="h-3.5 w-3.5" />
            Built for Copperbelt University
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h1 className="mt-6 font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold tracking-tight text-balance leading-[1.02]">
            The Digital Home of<br />
            <span className="text-gradient-blue">Student Life</span>
            <br className="hidden sm:inline" />
            <span className="text-muted-foreground text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal">
              at Copperbelt University
            </span>
          </h1>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-6 mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground">
            Hi, I’m <span className="font-semibold text-blue-600">Warren</span> — a CBU student who built this space to make university life easier, connected, and a little more fun.
          </p>
        </Reveal>

        <Reveal delay={0.25}>
          <p className="mt-3 mx-auto max-w-2xl text-base text-muted-foreground">
            Join hundreds of students already using Warren Hub for community, accommodation, jobs, and everything in between.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="rounded-full bg-blue-600 hover:bg-blue-700 shadow-glow font-semibold">
              <a href="#ecosystem">
                Explore Hub <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full border-green-500 text-green-600 hover:bg-green-50 font-semibold">
              <a href="https://chat.whatsapp.com/I4TtoTKBGB9I4eVv4VKXGs" target="_blank" rel="noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" />
                Join WhatsApp Group
              </a>
            </Button>
          </div>
        </Reveal>

        <FloatingCards />
      </motion.div>
    </section>
  );
}