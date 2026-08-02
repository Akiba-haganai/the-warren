import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { AdminLogin } from "@/pages/admin/AdminLogin";
import { Button } from "@/components/ui/button";
import { LogOut, ArrowLeft } from "lucide-react";

type Status = "checking" | "signed-out" | "not-admin" | "authorized";

export function RequireAdmin({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    let active = true;

    async function check() {
      if (!supabase) {
        if (active) setStatus("signed-out");
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        if (active) setStatus("signed-out");
        return;
      }

      const { data: isAdmin, error } = await supabase.rpc("is_admin");
      if (!active) return;
      setStatus(!error && isAdmin ? "authorized" : "not-admin");
    }

    check();

    if (supabase) {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(() => check());

      return () => {
        active = false;
        subscription.unsubscribe();
      };
    }
  }, []);

  if (status === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground bg-background">
        Checking access…
      </div>
    );
  }

  if (status === "signed-out") {
    return (
      <div>
        <div className="absolute top-4 left-4 z-10">
          <Button variant="ghost" size="sm" asChild className="rounded-full">
            <Link to="/">
              <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to site
            </Link>
          </Button>
        </div>
        <AdminLogin />
      </div>
    );
  }

  if (status === "not-admin") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center px-6 bg-background">
        <p className="text-lg font-medium">
          You're signed in, but this account isn't an admin.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" asChild className="rounded-full">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to site
            </Link>
          </Button>
          <Button
            variant="outline"
            onClick={() => supabase?.auth.signOut()}
            className="rounded-full"
          >
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
