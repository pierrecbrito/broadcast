import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "../pages/login";
import { RegisterPage } from "../pages/register";
import { ConnectionsPage } from "../pages/connections";
import { ContactsPage } from "../pages/contacts";
import { MessagesPage } from "../pages/messages";
import { NotFoundPage } from "../pages/not-found";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<Navigate to="/connections" replace />} />
      <Route path="/connections" element={<ConnectionsPage />} />
      <Route path="/connections/:id/contacts" element={<ContactsPage />} />
      <Route path="/connections/:id/messages" element={<MessagesPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
