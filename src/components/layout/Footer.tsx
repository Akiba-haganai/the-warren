import { Link } from "react-router-dom";
import {
  Mail,
  MessageCircle,
  ExternalLink,
  Users,
  Camera,
  PlaySquare,
} from "lucide-react";
import warrenLogo from "@/assets/warren_logo.webp";
import { SITE_CONFIG } from "@/config/site";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-6 py-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-glow">
              <img
                src={warrenLogo}
                alt="Weave logo"
                className="h-5 w-5 object-contain"
              />
            </span>
            <span className="font-display text-xl font-semibold">Weave</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Stories, podcasts, and culture for everyone.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Crafted by Warren.
          </p>
        </div>

        {/* Explore */}
        <div>
          <h3 className="text-sm font-semibold text-foreground">Explore</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/blogs" className="hover:text-foreground transition">Stories</Link></li>
            <li><Link to="/podcasts" className="hover:text-foreground transition">Podcasts</Link></li>
            <li><Link to="/culture" className="hover:text-foreground transition">Culture</Link></li>
            <li><Link to="/about" className="hover:text-foreground transition">About</Link></li>
            <li><Link to="/contact" className="hover:text-foreground transition">Contact</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-sm font-semibold text-foreground">Legal</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/privacy" className="hover:text-foreground transition">Privacy</Link></li>
            <li><Link to="/terms" className="hover:text-foreground transition">Terms</Link></li>
            <li><Link to="/cookies" className="hover:text-foreground transition">Cookies</Link></li>
          </ul>
        </div>

        {/* Connect */}
        <div>
          <h3 className="text-sm font-semibold text-foreground">Connect</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <a
                href={`mailto:${SITE_CONFIG.contact.email}`}
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
                WhatsApp Community
              </a>
            </li>
            <li>
              <a
                href="https://web.facebook.com/groups/warrenstudenthub/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-foreground transition"
              >
                <Users className="h-3.5 w-3.5" />
                Facebook Community
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com/warrenpodcasts"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-foreground transition"
              >
                <Camera className="h-3.5 w-3.5" />
                Instagram
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
                Companion Apps
              </span>
            </li>
            {SITE_CONFIG.apps
              .filter((app) => app.isExternal)
              .map((app) => (
                <li key={app.id}>
                  <a
                    href={app.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 hover:text-foreground transition"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    {app.name}
                  </a>
                </li>
              ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border/40 bg-background/50">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Weave. All rights reserved.</p>
          <p>Stories • Podcasts • Culture</p>
        </div>
      </div>
    </footer>
  );
}
