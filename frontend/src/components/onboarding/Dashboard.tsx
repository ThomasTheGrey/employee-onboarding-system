import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogOut, Building2, UserRound } from "lucide-react";
import { TaskList } from "./TaskList";
import { AdminPanel } from "./AdminPanel";
import type { AuthUser } from "@/lib/types";

interface Props {
  user: AuthUser;
  onLogout: () => void;
}

export function Dashboard({ user, onLogout }: Props) {
  const isAdmin = user.role === "admin";

  return (
    <div className="min-h-dvh bg-background">
      {/* Header */}
      <header className="border-b bg-card/60 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-10 rounded-xl bg-gradient-hero shadow-elegant shrink-0" />
            <div className="min-w-0">
              <h1 className="text-lg font-semibold leading-tight truncate">
                Onboarding System
              </h1>
              <p className="text-xs text-muted-foreground truncate">
                Willkommen zurück, {user.contact_firstname}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="gap-2"
          >
            <LogOut className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* User-Info-Karte */}
        <Card className="p-6 sm:p-8 shadow-card bg-gradient-hero text-primary-foreground border-0">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <Badge
                variant="secondary"
                className="mb-3 bg-white/15 text-primary-foreground border-0"
              >
                {isAdmin ? "Administrator:in" : "Mitarbeiter:in"}
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-semibold">
                Dein Onboarding
              </h2>
              <p className="opacity-90 mt-2 max-w-xl">
                Behalte Aufgaben und Fortschritt im Blick — alles an einem Ort.
              </p>
            </div>
            <dl className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <Building2 className="size-5 mt-0.5 opacity-80" aria-hidden="true" />
                <div>
                  <dt className="opacity-75 text-xs uppercase tracking-wide">
                    Abteilung
                  </dt>
                  <dd className="font-medium">{user.department}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <UserRound className="size-5 mt-0.5 opacity-80" aria-hidden="true" />
                <div>
                  <dt className="opacity-75 text-xs uppercase tracking-wide">
                    Ansprechpartner:in
                  </dt>
                  <dd className="font-medium">
                    {user.contact_firstname} {user.contact_lastname}
                  </dd>
                </div>
              </div>
            </dl>
          </div>
        </Card>

        {/* Aufgaben + Admin */}
        <div
          className={`grid gap-8 ${
            isAdmin ? "lg:grid-cols-[1fr_1fr]" : "lg:grid-cols-1"
          }`}
        >
          <TaskList userId={user.id} />
          {isAdmin && (
            <AdminPanel
              currentUserId={user.id}
              requestingRole={user.role}
            />
          )}
        </div>
      </main>
    </div>
  );
}
