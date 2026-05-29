import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createUser } from "@/lib/api";
import type { Role } from "@/lib/types";

interface Props {
  requestingRole: Role | null;
}

const DEPARTMENTS = [
  { id: "1", label: "IT" },
  { id: "2", label: "HR" },
  { id: "3", label: "Marketing" },
];

export function CreateUserForm({ requestingRole }: Props) {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("user");
  const [departmentId, setDepartmentId] = useState("1");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await createUser({
        firstname,
        lastname,
        email,
        password,
        role,
        department_id: parseInt(departmentId, 10),
        requestingRole,
      });
      toast.success("Nutzer:in erfolgreich erstellt");
      setFirstname("");
      setLastname("");
      setEmail("");
      setPassword("");
      setRole("user");
      setDepartmentId("1");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Nutzer:in konnte nicht erstellt werden"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstname">Vorname</Label>
          <Input
            id="firstname"
            required
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            autoComplete="given-name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastname">Nachname</Label>
          <Input
            id="lastname"
            required
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            autoComplete="family-name"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="userEmail">E-Mail</Label>
        <Input
          id="userEmail"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="userPassword">Passwort</Label>
        <Input
          id="userPassword"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="userRole">Rolle</Label>
          <Select value={role} onValueChange={(v) => setRole(v as Role)}>
            <SelectTrigger id="userRole">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="department">Fachabteilung</Label>
          <Select value={departmentId} onValueChange={setDepartmentId}>
            <SelectTrigger id="department">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DEPARTMENTS.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading && <Loader2 className="size-4 animate-spin" />}
        Nutzer:in erstellen
      </Button>
    </form>
  );
}
