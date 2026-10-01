"use client";

import { useActionState } from "react";
import { adminCreateCustomer, adminResetPassword } from "@/app/actions/account";

function Secret({ password }: { password: string }) {
  return (
    <div className="secret">
      <p>Startpasswort – wird nur jetzt angezeigt. Bitte sicher übermitteln:</p>
      <code>{password}</code>
    </div>
  );
}

export function ResetPasswordForm({ userId }: { userId: string }) {
  const [state, action, pending] = useActionState(adminResetPassword, undefined);
  return (
    <form action={action} className="stack">
      <input type="hidden" name="user_id" value={userId} />
      {state?.error && <p className="form-alert form-alert-error">{state.error}</p>}
      {state?.password && <Secret password={state.password} />}
      <button
        className="btn btn-ghost btn-sm"
        disabled={pending}
        onClick={(e) => {
          if (!window.confirm("Neues Passwort erzeugen? Die Person wird auf allen Geräten abgemeldet."))
            e.preventDefault();
        }}
      >
        Neues Passwort erzeugen
      </button>
    </form>
  );
}

export function CreateCustomerForm() {
  const [state, action, pending] = useActionState(adminCreateCustomer, undefined);
  return (
    <form action={action} className="stack">
      {state?.error && <p className="form-alert form-alert-error">{state.error}</p>}
      {state?.password && <Secret password={state.password} />}
      <label className="field">
        <span>Name</span>
        <input name="name" required />
      </label>
      <label className="field">
        <span>Einrichtung</span>
        <input name="organisation" />
      </label>
      <label className="field">
        <span>E-Mail</span>
        <input name="email" type="email" required />
      </label>
      <button className="btn btn-primary" disabled={pending}>
        Konto anlegen
      </button>
    </form>
  );
}
