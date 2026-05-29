import { useState, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createTask } from "@/lib/api";

interface Props {
  currentUserId: number;
}

const CATEGORIES = [
  { id: "1", label: "IT Setup" },
  { id: "2", label: "Unternehmen" },
  { id: "3", label: "Sicherheit" },
];

export function CreateTaskForm({ currentUserId }: Props) {
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("niedrig");
  const [categoryId, setCategoryId] = useState("1");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await createTask({
        title,
        description,
        priority,
        category_id: parseInt(categoryId, 10),
      });
      toast.success("Aufgabe erstellt");
      setTitle("");
      setDescription("");
      setPriority("niedrig");
      setCategoryId("1");
      // Eigene Aufgabenliste + Katalog ggf. neu laden
      qc.invalidateQueries({ queryKey: ["tasks", currentUserId] });
      qc.invalidateQueries({ queryKey: ["progress", currentUserId] });
      qc.invalidateQueries({ queryKey: ["all-tasks"] });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Aufgabe konnte nicht erstellt werden"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="taskTitle">Titel</Label>
        <Input
          id="taskTitle"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="taskDescription">Beschreibung</Label>
        <Textarea
          id="taskDescription"
          required
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="taskPriority">Priorität</Label>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger id="taskPriority">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="niedrig">Niedrig</SelectItem>
              <SelectItem value="mittel">Mittel</SelectItem>
              <SelectItem value="hoch">Hoch</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="taskCategory">Kategorie</Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger id="taskCategory">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading && <Loader2 className="size-4 animate-spin" />}
        Aufgabe erstellen
      </Button>
    </form>
  );
}
