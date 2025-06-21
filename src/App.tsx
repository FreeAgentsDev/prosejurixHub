import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import ClientPortal from './pages/ClientPortal';
import AdminPanel from './pages/AdminPanel';
import AdminLogin from './pages/AdminLogin';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          {/* Admin routes without header/footer */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/panel" element={<AdminPanel />} />
          
          {/* Client portal without header/footer */}
          <Route path="/portal" element={<ClientPortal />} />
          
          {/* Main website routes with header/footer */}
          <Route path="/*" element={
            <>
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/sobre-nosotros" element={<About />} />
                  <Route path="/servicios" element={<Services />} />
                  <Route path="/servicios/:serviceId" element={<ServiceDetail />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/contacto" element={<Contact />} />
                </Routes>
              </main>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;