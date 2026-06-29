import { useState, type FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck } from "lucide-react";
import { login } from "@/lib/api";
import type { AuthUser } from "@/lib/types";

interface Props {
  onLogin: (user: AuthUser) => void;
}

/** Login-Karte. Ruft POST /login auf und reicht den User nach oben weiter. */
export function LoginCard({ onLogin }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {

    e.preventDefault();

    setError(null);
    setLoading(true);
    try {
      

      const { user } = await login(email, password);
      onLogin(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-dvh grid lg:grid-cols-2">
      {/* Linke Hero-Spalte */}
      <section
        aria-hidden="true"
        className="hidden lg:flex flex-col justify-between p-12 bg-gradient-hero text-primary-foreground relative overflow-hidden"
      >
        <div className="flex items-center gap-2 text-sm font-medium tracking-wide uppercase opacity-90">
          <ShieldCheck className="size-5" />
          Onboarding System
        </div>
        <div>
          <h1 className="text-5xl xl:text-6xl font-semibold leading-tight">
            Willkommen<br />an Bord.
          </h1>
          <p className="mt-6 max-w-md text-base opacity-90">
            Strukturiertes Onboarding für neue Mitarbeiterinnen und
            Mitarbeiter — Aufgaben, Fortschritt und Verantwortlichkeiten an
            einem Ort.
          </p>
        </div>
        <p className="text-xs opacity-70">© Onboarding der BSR · Intern</p>
      </section>

      {/* Login-Formular */}
      <section className="flex items-center justify-center p-6 sm:p-12">
        <Card className="w-full max-w-md p-8 shadow-card">
          <header className="mb-8">
            <h2 className="text-3xl font-semibold">Anmelden</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Melde dich mit deinem Firmenkonto an.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail-Adresse</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
//                onChange={(e) => setEmail(e.target.value)}
onChange={(e) => {

  setEmail(e.target.value);
}}

                aria-invalid={!!error}
                aria-describedby={error ? "login-error" : undefined}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Passwort</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
//                onChange={(e) => setPassword(e.target.value)}
onChange={(e) => {
  console.log("CHECK 7 password:", e.target.value);
  setPassword(e.target.value);
}}
                aria-invalid={!!error}
                aria-describedby={error ? "login-error" : undefined}
              />
            </div>

            {error && (
              <p
                id="login-error"
                role="alert"
                className="text-sm text-destructive"
              >
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="size-4 animate-spin" />}
              {loading ? "Anmelden…" : "Anmelden"}
            </Button>
          </form>
        </Card>
      </section>
    </main>
  );
}
