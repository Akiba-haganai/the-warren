import { Routes, Route } from "react-router-dom";

import ModerationQueuePage from "./pages/admin/ModerationQueuePage";

export function AppAdminRoutes() {
  return (
    <Routes>
      <Route path="/admin/moderation" element={<ModerationQueuePage />} />
    </Routes>
  );
}

