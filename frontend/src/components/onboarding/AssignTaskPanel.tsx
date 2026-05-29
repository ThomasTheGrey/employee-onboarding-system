import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, UserPlus2 } from "lucide-react";
import { toast } from "sonner";
import { assignTask, getAllTasks, getAllUsers } from "@/lib/api";

/** Sucht Mitarbeiter:in + Aufgabe und weist sie zu (POST /tasks/assign). */
export function AssignTaskPanel() {
  const usersQ = useQuery({ queryKey: ["all-users"], queryFn: getAllUsers });
  const tasksQ = useQuery({ queryKey: ["all-tasks"], queryFn: getAllTasks });

  const [userSearch, setUserSearch] = useState("");
  const [taskSearch, setTaskSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const filteredUsers = useMemo(() => {
    if (!usersQ.data || !userSearch) return [];
    const s = userSearch.toLowerCase();
    return usersQ.data
      .filter(
        (u) =>
          u.firstname?.toLowerCase().includes(s) ||
          u.lastname?.toLowerCase().includes(s)
      )
      .slice(0, 5);
  }, [usersQ.data, userSearch]);

  const filteredTasks = useMemo(() => {
    if (!tasksQ.data || !taskSearch) return [];
    const s = taskSearch.toLowerCase();
    return tasksQ.data
      .filter((t) => t.title?.toLowerCase().includes(s))
      .slice(0, 5);
  }, [tasksQ.data, taskSearch]);

  async function handleAssign() {
    if (!selectedUserId || !selectedTaskId) {
      toast.warning("Bitte Nutzer:in und Aufgabe auswählen");
      return;
    }
    setLoading(true);
    try {
      await assignTask(selectedUserId, selectedTaskId);
      toast.success("Aufgabe erfolgreich zugewiesen");
      setUserSearch("");
      setTaskSearch("");
      setSelectedUserId(null);
      setSelectedTaskId(null);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Zuweisung fehlgeschlagen"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Mitarbeitersuche */}
      <div className="space-y-2">
        <Label htmlFor="userSearch">Mitarbeiter:in suchen</Label>
        <Input
          id="userSearch"
          placeholder="Name eingeben…"
          value={userSearch}
          onChange={(e) => {
            setUserSearch(e.target.value);
            setSelectedUserId(null);
          }}
          aria-controls="user-results"
        />
        {filteredUsers.length > 0 && (
          <ul
            id="user-results"
            role="listbox"
            aria-label="Suchergebnisse Mitarbeiter:innen"
            className="rounded-lg border bg-popover overflow-hidden"
          >
            {filteredUsers.map((u) => {
              const selected = selectedUserId === u.id;
              const label = `${u.firstname} ${u.lastname}`;
              return (
                <li key={u.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      setSelectedUserId(u.id);
                      setUserSearch(label);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-accent/30 focus:bg-accent/30 ${
                      selected ? "bg-accent/40 font-medium" : ""
                    }`}
                  >
                    {label}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Aufgabensuche */}
      <div className="space-y-2">
        <Label htmlFor="taskSearch">Aufgabe suchen</Label>
        <Input
          id="taskSearch"
          placeholder="Aufgabentitel eingeben…"
          value={taskSearch}
          onChange={(e) => {
            setTaskSearch(e.target.value);
            setSelectedTaskId(null);
          }}
          aria-controls="task-results"
        />
        {filteredTasks.length > 0 && (
          <ul
            id="task-results"
            role="listbox"
            aria-label="Suchergebnisse Aufgaben"
            className="rounded-lg border bg-popover overflow-hidden"
          >
            {filteredTasks.map((t) => {
              const selected = selectedTaskId === t.id;
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      setSelectedTaskId(t.id);
                      setTaskSearch(t.title);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-accent/30 focus:bg-accent/30 ${
                      selected ? "bg-accent/40 font-medium" : ""
                    }`}
                  >
                    {t.title}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <Button onClick={handleAssign} disabled={loading} className="gap-2">
        {loading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <UserPlus2 className="size-4" aria-hidden="true" />
        )}
        Aufgabe zuweisen
      </Button>
    </div>
  );
}
