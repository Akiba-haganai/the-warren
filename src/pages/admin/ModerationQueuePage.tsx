import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { reviewItem, type ModerationStatus } from "@/services/moderationService";

import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";




type ItemType =
  | "material_edit"
  | "tutor_listing"
  | "quiz_question"
  | "map_pin"
  | "ama_question";

type QueueRow = {
  id: string;
  item_type: ItemType;
  item_id: string;
  submitted_by: string | null;
  status: "pending" | "approved" | "rejected";
  reviewer_note: string | null;
  reviewed_by: string | null;
  created_at: string;
};

function statusBadgeVariant(status: QueueRow["status"]) {
  if (status === "approved") return "default";
  if (status === "rejected") return "destructive";
  return "secondary";
}

export default function ModerationQueuePage() {
  const [itemType, setItemType] = useState<ItemType | "all">("all");
  const [noteById, setNoteById] = useState<Record<string, string>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const [rows, setRows] = useState<QueueRow[]>([]);
  const [loading, setLoading] = useState(false);

  const filtered = useMemo(() => {
    if (itemType === "all") return rows;
    return rows.filter((r) => r.item_type === itemType);
  }, [rows, itemType]);

  async function fetchQueue() {
    if (!supabase) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("moderation_queue")
      .select(
        "id,item_type,item_id,submitted_by,status,reviewer_note,created_at,created_at"
      )
      .order("created_at", { ascending: false });

    setLoading(false);
    if (error) throw error;
    setRows((data ?? []) as QueueRow[]);
  }

  // Fetch on mount.
  useEffect(() => {
    fetchQueue().catch(() => {
      // no-op: page still renders
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onReview(queueId: string, status: ModerationStatus) {
    if (!supabase) return;
    setLoadingId(queueId);
    try {
      const note = noteById[queueId] ?? "";
      await reviewItem(queueId, status, note.trim() ? note.trim() : undefined);
      await fetchQueue();
    } finally {
      setLoadingId(null);
    }
  }

  const itemTypes: (ItemType | "all")[] = [
    "all",
    "material_edit",
    "tutor_listing",
    "quiz_question",
    "map_pin",
    "ama_question",
  ];

  return (
    <PageShell
      label={"Moderation"}
      title="Moderation Queue"
      subtitle="Review submitted content and approve or reject."
    >
      <Card className="bg-card/60">
        <CardHeader>
          <CardTitle className="text-lg">Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {itemTypes.map((t) => (
              <Button
                key={t}
                variant={itemType === t ? "default" : "outline"}
                size="sm"
                className="rounded-full"
                onClick={() => setItemType(t)}
              >
                {t === "all" ? "All" : t}
              </Button>
            ))}
          </div>

          <div className="space-y-3">
            {loading && <div className="text-sm text-muted-foreground">Loading…</div>}
            {!loading && filtered.length === 0 && (
              <div className="text-sm text-muted-foreground">No items found.</div>
            )}

            {filtered.map((r) => (
              <div
                key={r.id}
                className="rounded-xl border border-border/60 p-4 bg-muted/20"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant={statusBadgeVariant(r.status)}>
                        {r.status}
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        {r.item_type}
                      </div>
                    </div>
                    <div className="mt-2 text-sm">
                      <span className="text-muted-foreground">Item ID:</span> {r.item_id}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Submitted at: {new Date(r.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <Textarea
                    value={noteById[r.id] ?? ""}
                    onChange={(e) =>
                      setNoteById((prev) => ({ ...prev, [r.id]: e.target.value }))
                    }
                    placeholder="Reviewer note (optional)"
                    rows={3}
                  />
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    className="rounded-full"
                    disabled={loadingId === r.id}
                    onClick={() => onReview(r.id, "approved")}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    className="rounded-full"
                    disabled={loadingId === r.id}
                    onClick={() => onReview(r.id, "rejected")}
                  >
                    Reject
                  </Button>
                </div>

                {r.reviewed_by && r.status !== "pending" && r.reviewer_note && (
                  <div className="mt-3 text-sm text-muted-foreground">
                    <span className="font-medium">Note:</span> {r.reviewer_note}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}

