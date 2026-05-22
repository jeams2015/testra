import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isValidEmail } from "../lib/rules";

/** Credencial de demo válida. */
const DEMO_EMAIL = "demo@nimbo.store";
const DEMO_PASSWORD = "nimbo123";

export function LoginPage({ onLogin }: { onLogin: (email: string) => void }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmailError(null);
    setFormError(null);

    if (!isValidEmail(email)) {
      setEmailError("Ingresa un correo válido.");
      return;
    }
    if (password.length < 6) {
      setFormError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (email.trim().toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      setFormError("Correo o contraseña incorrectos.");
      return;
    }
    onLogin(email.trim().toLowerCase());
    navigate("/checkout");
  }

  return (
    <div style={{ maxWidth: 380, margin: "0 auto" }}>
      <h1>Ingresar</h1>
      <p className="muted">Accede para completar tu compra.</p>

      <form className="panel mt" onSubmit={handleSubmit} data-testid="login-form">
        <div className="field">
          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            data-testid="login-email"
          />
          {emailError && (
            <div className="error" data-testid="login-email-error">
              {emailError}
            </div>
          )}
        </div>

        <div className="field">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            data-testid="login-password"
          />
        </div>

        {formError && (
          <div className="notice error" data-testid="login-error">
            {formError}
          </div>
        )}

        <button type="submit" style={{ width: "100%" }} data-testid="login-submit">
          Ingresar
        </button>

        <p className="muted mt" style={{ fontSize: 12 }}>
          Demo: {DEMO_EMAIL} / {DEMO_PASSWORD}
        </p>
      </form>
    </div>
  );
}
