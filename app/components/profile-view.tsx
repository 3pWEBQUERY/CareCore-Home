import { changePassword, logoutOthers, updateProfile } from "@/app/actions/account";
import SubmitButton from "@/app/components/submit-button";
import { Card, Flash, PageHeader } from "@/app/components/ui";
import { currentSessionHash, type SessionUser } from "@/lib/auth";
import { query, queryOne } from "@/lib/db";
import { dateTime } from "@/lib/format";

type Profile = {
  name: string;
  email: string;
  organisation: string;
  role_title: string;
  phone: string;
  street: string;
  zip_city: string;
  country: string;
  created_at: Date;
};

function device(agent: string) {
  const browser = /Edg\//.test(agent)
    ? "Edge"
    : /Firefox\//.test(agent)
      ? "Firefox"
      : /Chrome\//.test(agent)
        ? "Chrome"
        : /Safari\//.test(agent)
          ? "Safari"
          : "Browser";
  const os = /iPhone/.test(agent)
    ? "iPhone"
    : /iPad/.test(agent)
      ? "iPad"
      : /Android/.test(agent)
        ? "Android"
        : /Windows/.test(agent)
          ? "Windows"
          : /Mac OS X/.test(agent)
            ? "macOS"
            : /Linux/.test(agent)
              ? "Linux"
              : "";
  return os ? `${browser} · ${os}` : browser;
}

export default async function ProfileView({
  user,
  back,
  params,
}: {
  user: SessionUser;
  back: string;
  params: Record<string, string | string[] | undefined>;
}) {
  const [profile, sessions, current] = await Promise.all([
    queryOne<Profile>(
      "select name, email, organisation, role_title, phone, street, zip_city, country, created_at from app_users where id = $1",
      [user.id],
    ),
    query<{ token_hash: string; user_agent: string; created_at: Date; last_seen_at: Date }>(
      "select token_hash, user_agent, created_at, last_seen_at from app_sessions where user_id = $1 and expires_at > now() order by last_seen_at desc",
      [user.id],
    ),
    currentSessionHash(),
  ]);
  if (!profile) return null;
  return (
    <>
      <PageHeader
        eyebrow="Konto"
        title="Profil & Sicherheit"
        lead={`Kundenkonto seit ${dateTime(profile.created_at)}`}
      />
      <Flash params={params} />
      <div className="grid-2 grid-top">
        <Card title="Kontakt & Rechnungsadresse">
          <form action={updateProfile} className="stack">
            <input type="hidden" name="back" value={back} />
            <div className="field-grid">
              <label className="field">
                <span>Name</span>
                <input name="name" required defaultValue={profile.name} autoComplete="name" />
              </label>
              <label className="field">
                <span>Funktion</span>
                <input name="role_title" defaultValue={profile.role_title} />
              </label>
            </div>
            <label className="field">
              <span>Einrichtung</span>
              <input name="organisation" defaultValue={profile.organisation} autoComplete="organization" />
            </label>
            <div className="field-grid">
              <label className="field">
                <span>E-Mail</span>
                <input value={profile.email} disabled readOnly />
              </label>
              <label className="field">
                <span>Telefon</span>
                <input name="phone" defaultValue={profile.phone} autoComplete="tel" />
              </label>
            </div>
            <label className="field">
              <span>Strasse, Nr.</span>
              <input name="street" defaultValue={profile.street} autoComplete="street-address" />
            </label>
            <div className="field-grid">
              <label className="field">
                <span>PLZ, Ort</span>
                <input name="zip_city" defaultValue={profile.zip_city} />
              </label>
              <label className="field">
                <span>Land</span>
                <input name="country" defaultValue={profile.country} autoComplete="country-name" />
              </label>
            </div>
            <p className="field-hint">Die E-Mail-Adresse ändert der Support auf Anfrage.</p>
            <div className="form-actions">
              <SubmitButton>Speichern</SubmitButton>
            </div>
          </form>
        </Card>
        <div className="stack-lg">
          <Card title="Passwort ändern">
            <form action={changePassword} className="stack">
              <input type="hidden" name="back" value={back} />
              <label className="field">
                <span>Aktuelles Passwort</span>
                <input name="current" type="password" autoComplete="current-password" required />
              </label>
              <div className="field-grid">
                <label className="field">
                  <span>Neues Passwort</span>
                  <input name="password" type="password" autoComplete="new-password" minLength={10} required />
                </label>
                <label className="field">
                  <span>Wiederholen</span>
                  <input name="password2" type="password" autoComplete="new-password" minLength={10} required />
                </label>
              </div>
              <p className="field-hint">Andere Geräte werden danach abgemeldet.</p>
              <div className="form-actions">
                <SubmitButton>Passwort ändern</SubmitButton>
              </div>
            </form>
          </Card>
          <Card
            title="Angemeldete Geräte"
            actions={
              sessions.length > 1 ? (
                <form action={logoutOthers}>
                  <input type="hidden" name="back" value={back} />
                  <SubmitButton className="btn btn-ghost btn-sm">Andere abmelden</SubmitButton>
                </form>
              ) : null
            }
            flush
          >
            <ul className="list">
              {sessions.map((s) => (
                <li key={s.token_hash}>
                  <div className="list-row">
                    <span className="list-main">
                      <b>
                        {device(s.user_agent)}
                        {s.token_hash === current ? " · dieses Gerät" : ""}
                      </b>
                      <small>
                        Angemeldet {dateTime(s.created_at)} · zuletzt aktiv {dateTime(s.last_seen_at)}
                      </small>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
