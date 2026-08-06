import { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { Toaster } from "./components/layout/Toaster";
import { ScrollToTopOnNavigate } from "./lib/ScrollToTopOnNavigate";
import { LegacyAnchorRedirect } from "./components/routing/LegacyAnchorRedirect";
import { MiniPlayer } from "./components/player/MiniPlayer";
import { WhatsAppFAB } from "./components/layout/WhatsappFAB";
import { ScrollToTopButton } from "./components/layout/ScrollToTopButton";
import { InstallPWA } from "./components/layout/InstallPWA";
import { UpdatePrompt } from "./components/layout/UpdatePrompt";

// Lazy-load every page so only the current route's code is downloaded on first visit.
// This splits the 1.35 MB monolithic bundle into small per-route chunks.
const Home        = lazy(() => import("./pages/Home"));
const Explore     = lazy(() => import("./pages/Explore"));
const SubmitBlog  = lazy(() => import("./pages/SubmitBlog"));
const BlogPreview = lazy(() => import("./pages/BlogPreview"));
const BlogsList   = lazy(() => import("./pages/BlogsList"));
const BlogPage    = lazy(() => import("./pages/BlogPage"));
const TopicPage   = lazy(() => import("./pages/TopicPage"));
const AuthorPage  = lazy(() => import("./pages/AuthorPage"));
const About       = lazy(() => import("./pages/About"));
const Contact     = lazy(() => import("./pages/Contact"));
const Privacy     = lazy(() => import("./pages/Privacy"));
const Terms       = lazy(() => import("./pages/Terms"));
const Cookies     = lazy(() => import("./pages/Cookies"));
const Ecosystem   = lazy(() => import("./pages/Ecosystem"));
const Products    = lazy(() => import("./pages/Products"));
const Podcasts    = lazy(() => import("./pages/Podcasts"));

function StoryToBlogRedirect() {
  const params = useParams();
  return <Navigate to={`/blogs/${params.slug}`} replace />;
}

function StoryPreviewToBlogRedirect() {
  const params = useParams();
  return <Navigate to={`/blogs/preview/${params.token}`} replace />;
}

// Minimal inline fallback — just keeps the background colour so there's no
// white flash while a chunk loads. No spinner needed; chunks are tiny.
function PageFallback() {
  return <div className="min-h-screen bg-background" />;
}

function App() {
  return (
    <>
      <ScrollToTopOnNavigate />
      <LegacyAnchorRedirect />
      <ScrollToTopButton />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />

          {/* Blog Routes */}
          <Route path="/submit" element={<SubmitBlog />} />
          <Route path="/blogs" element={<BlogsList />} />
          <Route path="/blogs/:slug" element={<BlogPage />} />
          <Route path="/blogs/preview/:token" element={<BlogPreview />} />

          {/* Legacy Story Routes → Redirect to Blogs */}
          <Route path="/stories" element={<Navigate to="/blogs" replace />} />
          <Route path="/stories/:slug" element={<StoryToBlogRedirect />} />
          <Route path="/stories/preview/:token" element={<StoryPreviewToBlogRedirect />} />

          <Route path="/topics/:slug" element={<TopicPage />} />
          <Route path="/authors/:name" element={<AuthorPage />} />

          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/ecosystem" element={<Ecosystem />} />
          <Route path="/products" element={<Products />} />
          <Route path="/podcasts" element={<Podcasts />} />
        </Routes>
      </Suspense>
      <MiniPlayer />
      <WhatsAppFAB />
      <InstallPWA />
      <UpdatePrompt />
      <Toaster />
    </>
  );
}

export default App;