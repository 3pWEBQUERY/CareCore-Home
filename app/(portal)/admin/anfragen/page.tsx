import type { Metadata } from "next";
import { adminDemoStatus } from "@/app/actions/account";
import SubmitButton from "@/app/components/submit-button";
import { Badge, Card, Empty, Flash, PageHeader } from "@/app/components/ui";
import { requireAdmin } from "@/lib/auth";
import { query } from "@/lib/db";
import { dateTime } from "@/lib/format";
import { demoStatus, demoTone } from "@/lib/labels";

export const metadata: Metadata = { title: "Demo-Anfragen" };

type Request = {
  id: string;
  name: string;
  organisation: string;
  role_title: string;
  email: string;
  phone: string;
  beds: string;
  message: string;
  status: string;
  created_at: Date;
};

export default async function RequestsPage({ searchParams }: PageProps<"/admin/anfragen">) {
  await requireAdmin();
  const requests = await query<Request>(
    "select * from demo_requests order by case status when 'neu' then 0 when 'kontaktiert' then 1 else 2 end, created_at desc limit 300",
  );
  return (
    <>
      <PageHeader eyebrow="Vertrieb" title="Demo-Anfragen" lead="Anfragen aus dem Kontaktformular der Website." />
      <Flash params={await searchParams} />
      {requests.length ? (
        <div className="stack">
          {requests.map((r) => (
            <Card key={r.id}>
              <div className="request" id={r.id}>
                <div className="request-main">
                  <p className="request-title">
                    <b>{r.organisation}</b>{" "}
                    <Badge tone={demoTone[r.status]}>{demoStatus[r.status as keyof typeof demoStatus]}</Badge>
                  </p>
                  <p className="muted-text">
                    {r.name}
                    {r.role_title && ` · ${r.role_title}`} · <a href={`mailto:${r.email}`}>{r.email}</a>
                    {r.phone && ` · ${r.phone}`}
                    {r.beds && ` · ${r.beds} Plätze`}
                  </p>
                  {r.message && <p className="pre request-msg">{r.message}</p>}
                  <p className="card-note">Eingegangen {dateTime(r.created_at)}</p>
                </div>
                <form action={adminDemoStatus} className="request-actions">
                  <input type="hidden" name="id" value={r.id} />
                  <select name="status" defaultValue={r.status} aria-label="Status">
                    {Object.entries(demoStatus).map(([v, l]) => (
                      <option key={v} value={v}>
                        {l}
                      </option>
                    ))}
                  </select>
                  <SubmitButton className="btn btn-ghost btn-sm">Speichern</SubmitButton>
                  <SubmitButton
                    className="btn btn-danger-link"
                    name="action"
                    value="delete"
                    confirm="Anfrage endgültig löschen?"
                  >
                    Löschen
                  </SubmitButton>
                </form>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <Empty title="Noch keine Anfragen" text="Anfragen aus dem Formular „Demo vereinbaren“ erscheinen hier." />
        </Card>
      )}
    </>
  );
}
