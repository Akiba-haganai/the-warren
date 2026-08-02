import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import SubmitStory from "./pages/SubmitStory";
import StoryPreview from "./pages/StoryPreview";
import StoriesList from "./pages/StoriesList";
import StoryPage from "./pages/StoryPage";
import TopicPage from "./pages/TopicPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Cookies from "./pages/Cookies";
import Ecosystem from "./pages/Ecosystem";
import Products from "./pages/Products";
import Podcasts from "./pages/Podcasts";
import { RequireAdmin } from "./components/admin/RequireAdmin";
import { AdminInbox } from "./pages/admin/AdminInbox";
import { AdminComposer } from "./pages/admin/AdminComposer";
import { Toaster } from "./components/layout/Toaster";
import { ScrollToTopOnNavigate } from "./lib/ScrollToTopOnNavigate";
import { LegacyAnchorRedirect } from "./components/routing/LegacyAnchorRedirect";
import { MiniPlayer } from "./components/player/MiniPlayer";
import { WhatsAppFAB } from "./components/layout/WhatsappFAB";
import { ScrollToTopButton } from "./components/layout/ScrollToTopButton";
import { InstallPWA } from "./components/layout/InstallPWA";

function App() {
  return (
    <>
      <ScrollToTopOnNavigate />
      <LegacyAnchorRedirect />
      <ScrollToTopButton />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/submit" element={<SubmitStory />} />
        <Route path="/stories" element={<StoriesList />} />
        <Route path="/stories/:slug" element={<StoryPage />} />
        <Route path="/stories/preview/:token" element={<StoryPreview />} />
        <Route path="/topics/:slug" element={<TopicPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/ecosystem" element={<Ecosystem />} />
        <Route path="/products" element={<Products />} />
        <Route path="/podcasts" element={<Podcasts />} />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminInbox />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/new"
          element={
            <RequireAdmin>
              <AdminComposer />
            </RequireAdmin>
          }
        />
      </Routes>
      <MiniPlayer />
      <WhatsAppFAB />
      <InstallPWA />
      <Toaster />
    </>
  );
}

export default App;