import { Link } from "react-router-dom";
import {
  Mail,
  MessageCircle,
  ExternalLink,
  Users,
  Camera,
  PlaySquare,
} from "lucide-react";
import warrenLogo from "@/assets/warren_logo.png";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-6 py-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
              <img
                src={warrenLogo}
                alt="Warren logo"
                className="h-4 w-4 sm:h-5 sm:w-5 object-contain"
              />
            </span>
            <span className="font-display text-xl font-semibold">Weave</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Stories. Culture. What's happening.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Built with ❤️ for students.
          </p>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-sm font-semibold text-foreground">Company</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground transition">About</Link></li>
            <li><Link to="/contact" className="hover:text-foreground transition">Contact</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-sm font-semibold text-foreground">Legal</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/privacy" className="hover:text-foreground transition">Privacy</Link></li>
            <li><Link to="/terms" className="hover:text-foreground transition">Terms</Link></li>
            <li><Link to="/cookies" className="hover:text-foreground transition">Cookies</Link></li>
          </ul>
        </div>

        {/* Connect */}
        <div>
          <h4 className="text-sm font-semibold text-foreground">Connect</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <a
                href="mailto:chilengawarren307@gmail.com"
                className="inline-flex items-center gap-1.5 hover:text-foreground transition"
              >
                <Mail className="h-3.5 w-3.5" />
                Email Us
              </a>
            </li>
            <li>
              <a
                href="https://whatsapp.com/channel/0029Vb8NY5f84OmCRIr9K91V"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-foreground transition"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                WhatsApp Channel
              </a>
            </li>
            <li>
              <a
                href="https://chat.whatsapp.com/I4TtoTKBGB9I4eVv4VKXGs"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-foreground transition"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                WhatsApp Group
              </a>
            </li>

            <li className="pt-2 border-t border-border/60">
              <span className="text-xs font-semibold uppercase text-muted-foreground">
                Follow Us
              </span>
            </li>

            <li>
              <a
                href="https://web.facebook.com/groups/warrenstudenthub/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-foreground transition"
              >
                <Users className="h-3.5 w-3.5" />
                Facebook Group
              </a>
            </li>

            <li>
              <a
                href="https://instagram.com/warrenpodcasts_cbu"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-foreground transition"
              >
                <Camera className="h-3.5 w-3.5" />
                Instagram (coming soon)
              </a>
            </li>

            <li>
              <a
                href="https://youtube.com/channel/UCGKgsxYNTUESqdvySiMIQ1A"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-foreground transition"
              >
                <PlaySquare className="h-3.5 w-3.5" />
                YouTube
              </a>
            </li>

            <li className="pt-2 border-t border-border/60">
              <span className="text-xs font-semibold uppercase text-muted-foreground">
                Our Apps
              </span>
            </li>
            <li>
              <a
                href="https://warren-campus.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-foreground transition"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Campus
              </a>
            </li>
            <li>
              <a
                href="https://warren-market.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-foreground transition"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Market
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col gap-4 text-xs text-muted-foreground">
          <p className="max-w-4xl opacity-80 leading-relaxed">
            <strong>Disclaimer:</strong> The views and opinions expressed in stories and blogs on this platform are solely those of the individual authors. They do not necessarily reflect the official policy, stance, or position of Commons, its creators, or Copperbelt University. Commons is an independent platform built for student expression and acts solely as a neutral host for user-generated content.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 border-t border-border/40 pt-4">
            <p>© {new Date().getFullYear()} Weave. All rights reserved.</p>
            <p>Built with care in Kitwe, Zambia. <span className="opacity-0 select-none" aria-hidden="true">Voice of the unheard.</span></p>
          </div>
        </div>
      </div>
    </footer>
  );
}