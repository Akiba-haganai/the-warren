import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
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
import { MiniPlayer } from "./components/player/MiniPlayer";
import { WhatsAppFAB } from "./components/layout/WhatsappFAB";
import { ScrollToTopButton } from "./components/layout/ScrollToTopButton";




function App() {
  return (
    <>
      <ScrollToTopOnNavigate />
      <ScrollToTopButton />
      <Routes>
        <Route path="/" element={<Home />} />
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
      <Toaster />
    </>
  );
}

export default App;