import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import ClienteLogin from './pages/cliente/Login';
import ClienteProceso from './pages/cliente/Proceso';
import ProcesoDetalleCliente from './pages/cliente/ProcesoDetalle';
import AdminLogin from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Procesos from './pages/admin/Procesos';
import ProcesoDetalle from './pages/admin/ProcesoDetalle';
import ScrollToTop from './components/common/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-white">
        <Routes>
          {/* Admin routes without header/footer */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/procesos" element={<Procesos />} />
          <Route path="/admin/procesos/:id" element={<ProcesoDetalle />} />
          
          {/* Client portal without header/footer */}
          <Route path="/portal" element={<ClienteLogin />} />
          <Route path="/portal/proceso" element={<ClienteProceso />} />
          <Route path="/portal/proceso/:id" element={<ProcesoDetalleCliente />} />
          
          {/* Main website routes with header/footer */}
          <Route path="/*" element={
            <>
              <Navbar />
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