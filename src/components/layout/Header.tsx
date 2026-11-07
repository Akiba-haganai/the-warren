import { Link, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState, Suspense } from "react";
import { Search, Menu, Sun, Moon, Laptop, Headphones, Bookmark, ChevronDown, ExternalLink } from "lucide-react";
import warrenLogo from "@/assets/warren_logo.webp";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { SITE_CONFIG } from "@/config/site";

import {
  getThemePreference,
  initThemeFromStorage,
  setThemePreference,
  getSystemTheme,
  type ThemePreference,
} from "@/lib/theme";

import { lazyWithRetry } from "@/lib/lazyWithRetry";

const LazySearchDialog = lazyWithRetry(() =>
  import("@/components/layout/SearchDialog").then((m) => ({ default: m.SearchDialog }))
);

const nav = [
  { to: "/", label: "Home" },
  { to: "/blogs", label: "Stories" },
  { to: "/podcasts", label: "Podcasts" },
  { to: "/culture", label: "Culture" },
  { to: "/explore", label: "Explore" },
  { to: "/about", label: "About" },
];

const EXTERNAL_APPS = SITE_CONFIG.apps
  .filter((app) => app.isExternal)
  .map((app) => ({
    href: app.url,
    label: app.name,
    tagline: app.tagline,
  }));

const THEME_OPTIONS: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Laptop },
];

function InstallAppButton() {
  const { canInstall, isIOS, promptInstall } = useInstallPrompt();
  if (!canInstall) return null;

  const handleClick = () => {
    if (isIOS) {
      alert("To install Weave on iOS:\n1. Tap the Share button in Safari\n2. Scroll down and tap 'Add to Home Screen'");
    } else {
      promptInstall();
    }
  };

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleClick}
      className="rounded-full border-primary/30 text-primary hover:bg-primary/10"
    >
      Install App
    </Button>
  );
}

export function Header() {
  const location = useLocation();

  const [themePref, setThemePref] = useState<ThemePreference>(() =>
    typeof window === "undefined" ? "system" : getThemePreference()
  );

  const [resolvedDark, setResolvedDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const pref = getThemePreference();
    return pref === "dark" || (pref === "system" && getSystemTheme() === "dark");
  });

  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const cleanup = initThemeFromStorage();
    setThemePref(getThemePreference());
    setResolvedDark(document.documentElement.classList.contains("dark"));

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

  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    const color = resolvedDark ? "#1a1c29" : "#4f46e5";
    if (meta) {
      meta.setAttribute("content", color);
    } else {
      const tag = document.createElement("meta");
      tag.name = "theme-color";
      tag.content = color;
      document.head.appendChild(tag);
    }
  }, [resolvedDark]);

  useEffect(() => {
    if (!searchOpen) {
      setSearchQuery("");
    }
  }, [searchOpen]);

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const selectTheme = (pref: ThemePreference) => {
    setThemePref(pref);
    setThemePreference(pref);
    setResolvedDark(
      pref === "dark" || (pref === "system" && getSystemTheme() === "dark")
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
        <div className="glass rounded-2xl px-4 sm:px-6 py-2.5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-glow transition-transform group-hover:scale-105">
              <img
                src={warrenLogo}
                alt="Weave logo"
                className="h-5 w-5 object-contain"
              />
            </span>

            <div className="flex flex-col">
              <span className="font-display text-lg font-semibold tracking-tight">Weave</span>
              <span className="sr-only">Stories. Podcasts. Culture.</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {items.map((n) => (
              <Link key={n.to} to={n.to} className={navLinkClass(n.to)}>
                {n.label}
              </Link>
            ))}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 px-3 py-2 text-sm rounded-lg transition text-muted-foreground hover:text-foreground hover:bg-accent/40"
                >
                  Apps <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-1.5 rounded-xl">
                {EXTERNAL_APPS.map((app) => (
                  <DropdownMenuItem key={app.href} asChild className="rounded-lg cursor-pointer">
                    <a
                      href={app.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between w-full py-2 px-2.5"
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold text-xs">{app.label}</span>
                        <span className="text-[11px] text-muted-foreground">{app.tagline}</span>
                      </div>
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                    </a>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          <div className="hidden md:flex items-center gap-2.5">
            <InstallAppButton />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="h-9 w-9 rounded-full"
            >
              <Search className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              asChild
              aria-label="Saved articles"
              className="h-9 w-9 rounded-full"
            >
              <Link to="/saved">
                <Bookmark className="h-4 w-4" />
              </Link>
            </Button>

            <ThemeSelector />

            <Button
              asChild
              size="sm"
              className="rounded-full bg-primary text-primary-foreground font-medium shadow-glow hover:opacity-95 transition px-4"
            >
              <Link to="/podcasts">
                <Headphones className="mr-1.5 h-3.5 w-3.5" />
                Listen
              </Link>
            </Button>
          </div>

          {/* Mobile: Quick actions + Sheet */}
          <div className="md:hidden flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="h-10 w-10 rounded-full"
            >
              <Search className="h-4 w-4" />
            </Button>

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu" className="h-10 w-10 rounded-full">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[320px] pt-10 overflow-y-auto pb-24">
                <SheetHeader className="sr-only">
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>Site navigation and theme settings</SheetDescription>
                </SheetHeader>
                <nav className="flex flex-col gap-1.5" aria-label="Mobile navigation">
                  {items.map((n) => (
                    <SheetClose key={n.to} asChild>
                      <Link to={n.to} className={`${navLinkClass(n.to)} py-2.5 text-base`}>
                        {n.label}
                      </Link>
                    </SheetClose>
                  ))}
                  <SheetClose asChild>
                    <Link to="/saved" className={`${navLinkClass("/saved")} py-2.5 text-base flex items-center gap-2`}>
                      <Bookmark className="h-4 w-4" /> Saved Articles
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/contact" className={`${navLinkClass("/contact")} py-2.5 text-base`}>
                      Contact
                    </Link>
                  </SheetClose>

                  <SheetClose asChild>
                    <Button
                      asChild
                      className="mt-3 rounded-full bg-primary text-primary-foreground font-semibold shadow-glow py-5"
                    >
                      <Link to="/podcasts">
                        <Headphones className="mr-2 h-4 w-4" />
                        Listen to Podcasts
                      </Link>
                    </Button>
                  </SheetClose>

                  <div className="mt-4 rounded-2xl border border-border/60 bg-card p-3.5">
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Theme
                      </span>
                      <ThemeSelector compact />
                    </div>
                  </div>

                  <div className="mt-2 rounded-2xl border border-border/60 bg-card p-3.5">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                        Companion Apps
                      </span>
                      {EXTERNAL_APPS.map((app) => (
                        <a
                          key={app.href}
                          href={app.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between px-3 py-2 text-sm rounded-lg transition text-muted-foreground hover:text-foreground hover:bg-accent/40"
                        >
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">{app.label}</span>
                            <span className="text-xs text-muted-foreground">{app.tagline}</span>
                          </div>
                          <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {searchOpen && (
        <Suspense fallback={null}>
          <LazySearchDialog
            open={searchOpen}
            onOpenChange={setSearchOpen}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
          />
        </Suspense>
      )}
    </header>
  );
}
