import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress as ProgressBar } from "@/components/ui/progress";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { CheckCircle2, ListTodo, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { completeTask, getProgress, getUserTasks } from "@/lib/api";

interface Props {
  userId: number;
}

/** Aufgaben + Fortschritt eines eingeloggten Users. */
export function TaskList({ userId }: Props) {
  const qc = useQueryClient();

  const tasksQ = useQuery({
    queryKey: ["tasks", userId],
    queryFn: () => getUserTasks(userId),
  });

  const progressQ = useQuery({
    queryKey: ["progress", userId],
    queryFn: () => getProgress(userId),
  });

  const completeMut = useMutation({
    mutationFn: (taskId: number) => completeTask(userId, taskId),
    onSuccess: () => {
      toast.success("Aufgabe als erledigt markiert");
      qc.invalidateQueries({ queryKey: ["tasks", userId] });
      qc.invalidateQueries({ queryKey: ["progress", userId] });
    },
    onError: (e) =>
      toast.error(e instanceof Error ? e.message : "Fehler beim Speichern"),
  });

  const total = progressQ.data?.total_tasks ?? 0;
  const done = progressQ.data?.completed_tasks ?? 0;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <Card className="p-6 sm:p-8 shadow-card">
      <header className="flex items-center gap-3 mb-6">
        <ListTodo className="size-6 text-primary" aria-hidden="true" />
        <h2 className="text-2xl font-semibold">Meine Aufgaben</h2>
      </header>

      <section
        aria-label="Fortschritt"
        className="mb-8 rounded-xl bg-secondary/60 p-5"
      >
        <div className="flex items-baseline justify-between mb-3">
          <p className="text-sm font-medium">Fortschritt</p>
          <p className="text-sm tabular-nums text-muted-foreground">
            {done} von {total} erledigt · {percent}%
          </p>
        </div>
        <ProgressBar
          value={percent}
          aria-label={`${percent} Prozent abgeschlossen`}
        />
      </section>

      {tasksQ.isLoading && (
        <p className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Lade Aufgaben…
        </p>
      )}

      {tasksQ.isError && (
        <p role="alert" className="text-destructive text-sm">
          Aufgaben konnten nicht geladen werden.
        </p>
      )}

      {tasksQ.data && tasksQ.data.length === 0 && (
        <p className="text-muted-foreground text-sm">
          Aktuell sind keine Aufgaben zugewiesen.
        </p>
      )}

      {tasksQ.data && tasksQ.data.length > 0 && (
        <Accordion type="multiple" className="space-y-3">
          {tasksQ.data.map((task) => {
            const isDone = task.status === "Erledigt";
            return (
              <AccordionItem
                key={task.task_id}
                value={`task-${task.task_id}`}
                className="border rounded-xl px-4 bg-card"
              >
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex flex-1 items-center justify-between gap-3 pr-3 text-left">
                    <div className="flex items-center gap-3 min-w-0">
                      {isDone && (
                        <CheckCircle2
                          className="size-5 text-success shrink-0"
                          aria-hidden="true"
                        />
                      )}
                      <span className="font-medium truncate">
                        {task.title}
                      </span>
                    </div>
                    <Badge
                      variant={isDone ? "secondary" : "outline"}
                      className="shrink-0"
                    >
                      {task.status}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-5">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <Badge variant="outline">
                        Priorität: {task.priority}
                      </Badge>
                      <span
                        className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-primary-foreground"
                        style={{ backgroundColor: task.category_color }}
                      >
                        {task.category}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {task.description}
                    </p>
                    {!isDone && (
                      <Button
                        size="sm"
                        onClick={() => completeMut.mutate(task.task_id)}
                        disabled={completeMut.isPending}
                      >
                        {completeMut.isPending && (
                          <Loader2 className="size-4 animate-spin" />
                        )}
                        Als erledigt markieren
                      </Button>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </Card>
  );
}
