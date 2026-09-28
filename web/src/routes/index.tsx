import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "../pages/login";
import { RegisterPage } from "../pages/register";
import { ConnectionsPage } from "../pages/connections";
import { ContactsPage } from "../pages/contacts";
import { MessagesPage } from "../pages/messages";
import { NotFoundPage } from "../pages/not-found";
import { PrivateRoute } from "../components/private-route";
import { PublicRoute } from "../components/public-route";
import { AuthenticatedLayout } from "../components/authenticated-layout";

export function AppRoutes() {
  return (
    <Routes>
      {/* Rotas Publicas */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      {/* Rotas Protegidas com Layout Autenticado */}
      <Route
        element={
          <PrivateRoute>
            <AuthenticatedLayout />
          </PrivateRoute>
        }
      >
        <Route path="/" element={<Navigate to="/connections" replace />} />
        <Route path="/connections" element={<ConnectionsPage />} />
        <Route path="/connections/:id/contacts" element={<ContactsPage />} />
        <Route path="/connections/:id/messages" element={<MessagesPage />} />
      </Route>

      {/* Rota 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
