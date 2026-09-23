import { Suspense } from "react";
import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { Toaster } from "./components/layout/Toaster";
import { ScrollToTopOnNavigate } from "./lib/ScrollToTopOnNavigate";
import { LegacyAnchorRedirect } from "./components/routing/LegacyAnchorRedirect";
import { usePlayer } from "./contexts/PlayerContext";
import { lazyWithRetry } from "./lib/lazyWithRetry";

// Lazy load MiniPlayer so framer-motion is only bundled when a podcast is played
const LazyMiniPlayer = lazyWithRetry(() => 
  import("./components/player/MiniPlayer").then(module => ({ default: module.MiniPlayer }))
);
import { WhatsAppFAB } from "./components/layout/WhatsappFAB";
import { ScrollToTopButton } from "./components/layout/ScrollToTopButton";
import { InstallPWA } from "./components/layout/InstallPWA";
import { UpdatePrompt } from "./components/layout/UpdatePrompt";
import { RebrandBanner } from "./components/layout/RebrandBanner";

// Home is imported eagerly so the landing page renders without a chunk download waterfall.
// Other routes use lazyWithRetry so transient mobile packet drops retry automatically.
import Home from "./pages/Home";
const CampusPage      = lazyWithRetry(() => import("./pages/CampusPage"));
const Explore         = lazyWithRetry(() => import("./pages/Explore"));
const SubmitBlog      = lazyWithRetry(() => import("./pages/SubmitBlog"));
const BlogPreview     = lazyWithRetry(() => import("./pages/BlogPreview"));
const BlogsList       = lazyWithRetry(() => import("./pages/BlogsList"));
const BlogPage        = lazyWithRetry(() => import("./pages/BlogPage"));
const TopicPage       = lazyWithRetry(() => import("./pages/TopicPage"));
const AuthorPage      = lazyWithRetry(() => import("./pages/AuthorPage"));
const About           = lazyWithRetry(() => import("./pages/About"));
const Contact         = lazyWithRetry(() => import("./pages/Contact"));
const Privacy         = lazyWithRetry(() => import("./pages/Privacy"));
const Terms           = lazyWithRetry(() => import("./pages/Terms"));
const Cookies         = lazyWithRetry(() => import("./pages/Cookies"));
const Ecosystem       = lazyWithRetry(() => import("./pages/Ecosystem"));
const Products        = lazyWithRetry(() => import("./pages/Products"));
const Podcasts        = lazyWithRetry(() => import("./pages/Podcasts"));
const Culture         = lazyWithRetry(() => import("./pages/Culture"));
const SavedArticles   = lazyWithRetry(() => import("./pages/SavedArticles"));
const CampusDirectory = lazyWithRetry(() => import("./pages/CampusDirectory"));

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
  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-orange-500 to-amber-500 animate-pulse z-[100]" />
    </div>
  );
}

function App() {
  const { currentEpisode } = usePlayer();

  return (
    <>
      <ScrollToTopOnNavigate />
      <LegacyAnchorRedirect />
      <ScrollToTopButton />
      <RebrandBanner />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/campuses" element={<CampusDirectory />} />
          <Route path="/campuses/:slug" element={<CampusPage />} />
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
          <Route path="/culture" element={<Culture />} />
          <Route path="/saved" element={<SavedArticles />} />
        </Routes>
      </Suspense>
      {currentEpisode && (
        <Suspense fallback={null}>
          <LazyMiniPlayer />
        </Suspense>
      )}
      <WhatsAppFAB />
      <InstallPWA />
      <UpdatePrompt />
      <Toaster />
    </>
  );
}

export default App;