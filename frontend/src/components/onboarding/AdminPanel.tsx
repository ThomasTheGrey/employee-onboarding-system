import { Card } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ShieldAlert } from "lucide-react";
import { CreateUserForm } from "./CreateUserForm";
import { CreateTaskForm } from "./CreateTaskForm";
import { AssignTaskPanel } from "./AssignTaskPanel";
import type { Role } from "@/lib/types";

interface Props {
  currentUserId: number;
  requestingRole: Role | null;
}

/** Adminbereich: Nutzer anlegen, Aufgabe anlegen, Aufgabe zuweisen. */
export function AdminPanel({ currentUserId, requestingRole }: Props) {
  return (
    <Card className="p-6 sm:p-8 shadow-card">
      <header className="flex items-center gap-3 mb-6">
        <ShieldAlert className="size-6 text-accent" aria-hidden="true" />
        <h2 className="text-2xl font-semibold">Adminbereich</h2>
      </header>

      <Tabs defaultValue="user" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="user">Nutzer</TabsTrigger>
          <TabsTrigger value="task">Aufgabe</TabsTrigger>
          <TabsTrigger value="assign">Zuweisen</TabsTrigger>
        </TabsList>

        <TabsContent value="user" className="pt-6">
          <CreateUserForm requestingRole={requestingRole} />
        </TabsContent>

        <TabsContent value="task" className="pt-6">
          <CreateTaskForm currentUserId={currentUserId} />
        </TabsContent>

        <TabsContent value="assign" className="pt-6">
          <AssignTaskPanel />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
