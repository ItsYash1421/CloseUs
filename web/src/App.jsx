import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import Roadmap from './pages/Roadmap';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import EarlyAccess from './pages/EarlyAccess';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/early-access" element={<EarlyAccess />} />
      </Routes>
    </Router>
  );
}

export default App;
