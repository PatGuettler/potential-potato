import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { EmptyState, Loading } from "@/components/widgets";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { CalendarEvent } from "@shared/core/types";

function EventDialog({ onClose }: { onClose: () => void }) {
  const { toast } = useToast();
  const [form, setForm] = useState({ title: "", date: new Date().toISOString().slice(0, 10), startTime: "", endTime: "", location: "", description: "" });
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));
  const save = useMutation({
    mutationFn: () => apiRequest("POST", "/api/events", form),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/events"] }); onClose(); },
    onError: (e: Error) => toast({ title: "Couldn't add event", description: e.message, variant: "destructive" }),
  });
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>Add an event</DialogTitle></DialogHeader>
        <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); save.mutate(); }}>
          <div className="space-y-1.5"><Label>Title</Label><Input value={form.title} onChange={(e) => set("title")(e.target.value)} placeholder="Field trip: Science Center" required data-testid="event-title" /></div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5"><Label>Date</Label><Input type="date" value={form.date} onChange={(e) => set("date")(e.target.value)} required /></div>
            <div className="space-y-1.5"><Label>Start</Label><Input type="time" value={form.startTime} onChange={(e) => set("startTime")(e.target.value)} /></div>
            <div className="space-y-1.5"><Label>End</Label><Input type="time" value={form.endTime} onChange={(e) => set("endTime")(e.target.value)} /></div>
          </div>
          <div className="space-y-1.5"><Label>Location</Label><Input value={form.location} onChange={(e) => set("location")(e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Details</Label><Textarea value={form.description} onChange={(e) => set("description")(e.target.value)} rows={2} placeholder="What to bring, cost, who to contact" /></div>
          <DialogFooter><Button type="submit" disabled={save.isPending} data-testid="event-save">Add event</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const fmtTime = (t?: string) => (t ? new Date(`2000-01-01T${t}`).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }) : "");

export default function CalendarPage() {
  const { user } = useAuth();
  const staff = user?.role === "teacher" || user?.role === "admin";
  const [adding, setAdding] = useState(false);
  const [showPast, setShowPast] = useState(false);
  const { data: events = [], isLoading } = useQuery<CalendarEvent[]>({ queryKey: ["/api/events"] });
  const remove = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/events/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/events"] }),
  });
  const today = new Date().toISOString().slice(0, 10);
  const shown = events.filter((e) => showPast || e.date >= today);
  const months = new Map<string, CalendarEvent[]>();
  for (const e of shown) {
    const key = new Date(`${e.date}T12:00`).toLocaleDateString(undefined, { month: "long", year: "numeric" });
    months.set(key, [...(months.get(key) ?? []), e]);
  }

  return (
    <AppShell
      title="Co-op calendar"
      subtitle="Class days, field trips, and events"
      actions={
        <>
          <Button size="sm" variant="ghost" onClick={() => setShowPast((v) => !v)}>{showPast ? "Hide past" : "Show past"}</Button>
          {staff && <Button size="sm" onClick={() => setAdding(true)} data-testid="add-event"><i className="fas fa-plus mr-2" />Add event</Button>}
        </>
      }
    >
      {isLoading ? (
        <Loading />
      ) : shown.length === 0 ? (
        <Card><EmptyState icon="fas fa-calendar" title="Nothing scheduled">Upcoming co-op days and field trips will appear here.</EmptyState></Card>
      ) : (
        Array.from(months.entries()).map(([month, list]) => (
          <section key={month}>
            <h2 className="font-semibold mb-3">{month}</h2>
            <div className="space-y-3">
              {list.map((e) => {
                const d = new Date(`${e.date}T12:00`);
                return (
                  <Card key={e.id} className={e.date < today ? "opacity-60" : ""} data-testid={`event-${e.id}`}>
                    <CardContent className="p-4 flex gap-4">
                      <div className="w-14 shrink-0 text-center rounded-lg bg-primary/10 text-primary py-1.5">
                        <div className="text-xs uppercase">{d.toLocaleDateString(undefined, { weekday: "short" })}</div>
                        <div className="text-xl font-bold leading-none">{d.getDate()}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{e.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {[e.startTime && `${fmtTime(e.startTime)}${e.endTime ? `–${fmtTime(e.endTime)}` : ""}`, e.location].filter(Boolean).join(" · ")}
                        </div>
                        {e.description && <p className="text-sm mt-1">{e.description}</p>}
                      </div>
                      {staff && (user?.role === "admin" || e.createdBy === user?.id) && (
                        <Button size="icon" variant="ghost" onClick={() => confirm(`Delete "${e.title}"?`) && remove.mutate(e.id)} title="Delete"><i className="fas fa-trash text-muted-foreground" /></Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        ))
      )}
      {adding && <EventDialog onClose={() => setAdding(false)} />}
    </AppShell>
  );
}
