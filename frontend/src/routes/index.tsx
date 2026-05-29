import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { LoginCard } from "@/components/onboarding/LoginCard";
import { Dashboard } from "@/components/onboarding/Dashboard";
import type { AuthUser } from "@/lib/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Onboarding System – Login" },
      {
        name: "description",
        content:
          "Internes Onboarding-System: Aufgaben, Fortschritt und Adminbereich an einem Ort.",
      },
    ],
  }),
  component: OnboardingApp,
});

/**
 * Einstiegspunkt der App.
 * Solange kein User eingeloggt ist, wird die Login-Karte angezeigt –
 * sonst das Dashboard. State bewusst lokal (wie im Originalskript),
 * damit das Verhalten zum bestehenden Node.js-Backend identisch bleibt.
 */
function OnboardingApp() {
  const [user, setUser] = useState<AuthUser | null>(null);

  return (
    <>
      {user ? (
        <Dashboard user={user} onLogout={() => setUser(null)} />
      ) : (
        <LoginCard onLogin={setUser} />
      )}
      <Toaster richColors position="top-right" />
    </>
  );
}
