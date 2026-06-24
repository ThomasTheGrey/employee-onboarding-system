import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAllUsers } from "@/lib/api";
import { Button } from "../ui/button";

/** Sucht Mitarbeiter:in + Aufgabe und weist sie zu (POST /tasks/assign). */
export function DeleteUserForm() {
  const usersQ = useQuery({ queryKey: ["all-users"], queryFn: getAllUsers });
  
  const [userSearch, setUserSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
 
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

  const selectedUser = usersQ.data?.find(
    (u) => u.id === selectedUserId
  );



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

        <Button
            disabled={!selectedUserId}
        >
            Benutzer löschen
        </Button>
    </div>


  );
}
