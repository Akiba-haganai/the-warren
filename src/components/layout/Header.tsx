import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Compass, Search, Menu, Sun, Moon } from "lucide-react";


import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";







const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/ecosystem", label: "Ecosystem" },
  { to: "/products", label: "Products" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const [dark, setDark] = useState(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("dark"),
  );
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);


  const isActive = (path: string) => location.pathname === path;

  const toggleDark = () => setDark((v) => !v);


  const items = useMemo(() => nav, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-3">
        <div className="glass rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-glow">
              <Compass className="h-4 w-4" />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">Warren Hub</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {items.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={`px-3 py-2 text-sm rounded-lg transition ${
                  isActive(n.to)
                    ? "text-blue-600 bg-blue-50 font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
                }`}
              >
                {n.label}
              </Link>
            ))}

          </nav>

          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)} aria-label="Search">
              <Search className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-muted-foreground" />
              <Switch checked={dark} onCheckedChange={toggleDark} />
              <Moon className="h-4 w-4 text-muted-foreground" />
            </div>

            <Button
              asChild
              size="sm"
              className="rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-glow font-medium"
            >
              <Link to="/contact">Get Started</Link>
            </Button>
          </div>

          {/* Mobile: Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[260px] sm:w-[320px] pt-10">
              <nav className="flex flex-col gap-2">
                {items.map((n) => (
                  <Link
                    key={n.to}
                    to={n.to}
                    className={`px-3 py-2 text-sm rounded-lg transition ${
                      isActive(n.to) ? "text-blue-600 bg-blue-50 font-medium" : "hover:bg-accent/40"
                    }`}
                    onClick={() => {
                      // allow Sheet to close via route change
                      navigate(n.to);
                    }}
                  >
                    {n.label}
                  </Link>
                ))}

                <div className="mt-4 rounded-2xl border border-border/60 bg-card p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium">Theme</span>
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4 text-muted-foreground" />
                      <Switch checked={dark} onCheckedChange={toggleDark} />
                      <Moon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                <Button asChild className="mt-2 rounded-full bg-blue-600 text-white shadow-glow font-semibold">
                  <Link to="/contact">Get Started</Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
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

