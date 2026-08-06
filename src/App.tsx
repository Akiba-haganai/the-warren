import { Routes, Route, Navigate, useParams } from "react-router-dom";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import SubmitBlog from "./pages/SubmitBlog";
import BlogPreview from "./pages/BlogPreview";
import BlogsList from "./pages/BlogsList";
import BlogPage from "./pages/BlogPage";
import TopicPage from "./pages/TopicPage";
import AuthorPage from "./pages/AuthorPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Cookies from "./pages/Cookies";
import Ecosystem from "./pages/Ecosystem";
import Products from "./pages/Products";
import Podcasts from "./pages/Podcasts";
import { Toaster } from "./components/layout/Toaster";
import { ScrollToTopOnNavigate } from "./lib/ScrollToTopOnNavigate";
import { LegacyAnchorRedirect } from "./components/routing/LegacyAnchorRedirect";
import { MiniPlayer } from "./components/player/MiniPlayer";
import { WhatsAppFAB } from "./components/layout/WhatsappFAB";
import { ScrollToTopButton } from "./components/layout/ScrollToTopButton";
import { InstallPWA } from "./components/layout/InstallPWA";
import { UpdatePrompt } from "./components/layout/UpdatePrompt";

function StoryToBlogRedirect() {
  const params = useParams();
  return <Navigate to={`/blogs/${params.slug}`} replace />;
}

function StoryPreviewToBlogRedirect() {
  const params = useParams();
  return <Navigate to={`/blogs/preview/${params.token}`} replace />;
}

function App() {
  return (
    <>
      <ScrollToTopOnNavigate />
      <LegacyAnchorRedirect />
      <ScrollToTopButton />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        
        {/* Blog Routes */}
        <Route path="/submit" element={<SubmitBlog />} />
        <Route path="/blogs" element={<BlogsList />} />
        <Route path="/blogs/:slug" element={<BlogPage />} />
        <Route path="/blogs/preview/:token" element={<BlogPreview />} />
        
        {/* Legacy Story Routes -> Redirect to Blogs */}
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
      <MiniPlayer />
      <WhatsAppFAB />
      <InstallPWA />
      <UpdatePrompt />
      <Toaster />
    </>
  );
}

export default App;