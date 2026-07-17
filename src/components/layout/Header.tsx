import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Search, Menu, Sun, Moon, Laptop, ArrowUpRight } from "lucide-react";
import warrenLogo from "@/assets/warren_logo.png";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  getThemePreference,
  initThemeFromStorage,
  setThemePreference,
  getSystemTheme,
  type ThemePreference,
} from "@/lib/theme";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/ecosystem", label: "Ecosystem" },
  { to: "/products", label: "Products" },
  { to: "/podcasts", label: "Podcasts" },
  { to: "/contact", label: "Contact" },
];

const EXTERNAL_APPS = [
  {
    href: "https://warren-campus.vercel.app",
    label: "Warren Campus",
  },
  {
    href: "https://warren-market.vercel.app",
    label: "Warren Connect",
  },
];


// NOTE: "Get Started" previously pointed at /contact, duplicating the
// Contact nav item. Pointed it at the live flagship product instead —
// swap this to wherever you actually want new users to land
// (a signup page, a different product, etc.) if this isn't right.
const GET_STARTED_URL = "https://warren-campus.vercel.app";

const THEME_OPTIONS: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Laptop },
];

function InstallAppButton() {
  const { canInstall, promptInstall } = useInstallPrompt();
  if (!canInstall) return null;

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={promptInstall}
      className="rounded-full"
    >
      Install App
    </Button>
  );
}

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  // themePref = the stored preference ("light" | "dark" | "system")
  const [themePref, setThemePref] = useState<ThemePreference>(() =>
    typeof window === "undefined" ? "system" : getThemePreference(),
  );

  // resolvedDark = the ACTUAL applied theme, kept in React state (not read
  // ad-hoc from the DOM inside a useMemo) so it re-renders reliably,
  // including when "system" is selected and the OS theme changes live.
  // Used below to keep the mobile browser chrome color in sync.
  const [resolvedDark, setResolvedDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const pref = getThemePreference();
    return pref === "dark" || (pref === "system" && getSystemTheme() === "dark");
  });

  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    // Applies stored theme to <html> on mount and wires up the
    // matchMedia listener for live "system" updates.
    const cleanup = initThemeFromStorage();
    setThemePref(getThemePreference());
    setResolvedDark(document.documentElement.classList.contains("dark"));

    // Watch for class changes on <html> so resolvedDark always reflects
    // reality, no matter what triggered the change (this component,
    // system preference change, another tab, etc.)
    const observer = new MutationObserver(() => {
      setResolvedDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      cleanup?.();
      observer.disconnect();
    };
  }, []);

  // Keep the mobile browser chrome / status bar color matched to the
  // active theme. This is what resolvedDark actually drives.
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    const color = resolvedDark ? "#0f1420" : "#ffffff";
    if (meta) {
      meta.setAttribute("content", color);
    } else {
      const tag = document.createElement("meta");
      tag.name = "theme-color";
      tag.content = color;
      document.head.appendChild(tag);
    }
  }, [resolvedDark]);

  const isActive = (path: string) => location.pathname === path;

  const selectTheme = (pref: ThemePreference) => {
    setThemePref(pref);
    setThemePreference(pref);
    // setThemePreference applies the class synchronously, but the
    // MutationObserver above will also confirm/sync resolvedDark.
    setResolvedDark(
      pref === "dark" || (pref === "system" && getSystemTheme() === "dark"),
    );
  };

  const items = useMemo(() => nav, []);

  const navLinkClass = (path: string) =>
    `px-3 py-2 text-sm rounded-lg transition ${
      isActive(path)
        ? "text-primary bg-primary/10 font-medium"
        : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
    }`;

  const ThemeSelector = ({ compact = false }: { compact?: boolean }) => (
    <div
      className={`inline-flex items-center rounded-full border border-border/60 bg-muted/50 p-0.5 ${
        compact ? "w-full justify-between" : ""
      }`}
      role="radiogroup"
      aria-label="Theme"
    >
      {THEME_OPTIONS.map(({ value, label, icon: Icon }) => {
        const active = themePref === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            title={label}
            onClick={() => selectTheme(value)}
            className={`flex items-center justify-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium transition ${
              active
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            } ${compact ? "flex-1" : ""}`}
          >
            <Icon className="h-3.5 w-3.5" />
            {compact && <span>{label}</span>}
          </button>
        );
      })}
    </div>
  );

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-3">
        <div className="glass rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-glow">
              <img
                src={warrenLogo}
                alt="Warren Hub logo"
                className="h-4 w-4 sm:h-5 sm:w-5 object-contain"
              />
            </span>

            <span className="font-display text-lg font-semibold tracking-tight">Warren Hub</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {items.map((n) => (
              <Link key={n.to} to={n.to} className={navLinkClass(n.to)}>
                {n.label}
              </Link>
            ))}
            {EXTERNAL_APPS.map((app) => (
              <a
                key={app.href}
                href={app.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-3 py-2 text-sm rounded-lg transition text-muted-foreground hover:text-foreground hover:bg-accent/40`}
              >
                {app.label} ↗
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">

            <InstallAppButton />
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)} aria-label="Search">
              <Search className="h-4 w-4" />
            </Button>

            <ThemeSelector />

            <Button
              asChild
              size="sm"
              className="rounded-full text-white font-medium bg-gradient-sunset shadow-glow-coral hover:brightness-110 transition"
            >
              <a href={GET_STARTED_URL} target="_blank" rel="noreferrer">
                Get Started
                <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
              </a>
            </Button>
          </div>

          {/* Mobile: Sheet */}
          <div className="md:hidden flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)} aria-label="Search">
              <Search className="h-4 w-4" />
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[260px] sm:w-[320px] pt-10">
                <SheetHeader className="sr-only">
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>Site navigation and theme settings</SheetDescription>
                </SheetHeader>
                <nav className="flex flex-col gap-2">
                  {items.map((n) => (
                    <Link
                      key={n.to}
                      to={n.to}
                      className={navLinkClass(n.to)}
                      onClick={() => {
                        navigate(n.to);
                      }}
                    >
                      {n.label}
                    </Link>
                  ))}

                  <div className="mt-4 rounded-2xl border border-border/60 bg-card p-3">
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-medium">Theme</span>
                      <ThemeSelector compact />
                    </div>
                  </div>

                  <div className="mt-2 rounded-2xl border border-border/60 bg-card p-3">
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-medium">Our Apps</span>
                      {EXTERNAL_APPS.map((app) => (
                        <a
                          key={app.href}
                          href={app.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 text-sm rounded-lg transition text-muted-foreground hover:text-foreground hover:bg-accent/40"
                        >
                          {app.label} ↗
                        </a>
                      ))}
                    </div>
                  </div>


                  <Button
                    asChild
                    className="mt-2 rounded-full text-white font-semibold bg-gradient-royal shadow-glow hover:shadow-glow hover:brightness-125 transition-all duration-300"
                  >
                    <a href={GET_STARTED_URL} target="_blank" rel="noreferrer">
                      Get Started
                      <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                    </a>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Command search dialog */}
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Search pages..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Pages">
            {items.map((n) => (
              <CommandItem
                key={n.to}
                onSelect={() => {
                  navigate(n.to);
                  setSearchOpen(false);
                }}
              >
                {n.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </header>
  );
}