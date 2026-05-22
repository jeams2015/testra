import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { Header } from "./components/Header";
import { LoginPage } from "./pages/LoginPage";
import { CatalogPage } from "./pages/CatalogPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { ConfirmationPage } from "./pages/ConfirmationPage";

export default function App() {
  // Auth simple en memoria — suficiente para la demo.
  const [user, setUser] = useState<string | null>(null);

  return (
    <>
      <Header user={user} onLogout={() => setUser(null)} />
      <main className="app">
        <Routes>
          <Route path="/login" element={<LoginPage onLogin={setUser} />} />
          <Route path="/" element={<CatalogPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route
            path="/checkout"
            element={
              user ? <CheckoutPage /> : <Navigate to="/login" replace />
            }
          />
          <Route path="/confirmation" element={<ConfirmationPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}
