import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!supabase) {
      setError("Supabase client is not initialized.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message);
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 bg-hero">
      <Card className="w-full max-w-sm border-border bg-card">
        <CardContent className="p-8">
          <h1 className="font-display text-2xl font-semibold text-center mb-1">
            Warren Admin
          </h1>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Sign in to manage content
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full rounded-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
