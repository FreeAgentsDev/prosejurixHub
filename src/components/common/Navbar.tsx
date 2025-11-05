import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, Shield, Home, Info, Briefcase, BookOpen, Mail } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Inicio', href: '/', icon: Home },
    { name: 'Sobre Nosotros', href: '/sobre-nosotros', icon: Info },
    { name: 'Servicios', href: '/servicios', icon: Briefcase },
    { name: 'Blog', href: '/blog', icon: BookOpen },
    { name: 'Contacto', href: '/contacto', icon: Mail },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-gradient-to-r from-white via-blue-50/30 to-white border-b border-blue-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header */}
        <div className="flex justify-between items-center py-4">
          {/* Logo Section - Rediseñado */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group flex-shrink-0"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-blue-100 rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              <img 
                src="/prosejurix-rounded.png" 
                alt="Prosejurix Logo" 
                className="h-12 sm:h-16 w-auto relative z-10 transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
                Prosejurix
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-tight font-medium hidden sm:block">
                Especialistas en Responsabilidad Civil
              </p>
            </div>
          </Link>

          {/* Desktop Navigation - Rediseñado */}
          <nav className="hidden lg:flex items-center space-x-1 ml-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group relative flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50/50'
                  }`}
                >
                  <Icon className={`h-4 w-4 transition-transform duration-200 ${isActive(item.href) ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span>{item.name}</span>
                  {isActive(item.href) && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-blue-600 rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA Section - Rediseñado */}
          <div className="hidden lg:flex items-center gap-3 ml-auto">
            {/* Portal Cliente */}
            <Link
              to="/portal"
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 text-blue-600 hover:bg-blue-50 ${
                isActive('/portal') ? 'bg-blue-50' : ''
              }`}
              title="Portal Cliente"
            >
              <User className="h-4 w-4" />
              <span className="hidden xl:inline">Cliente</span>
            </Link>

            {/* Panel Admin - Botón Destacado */}
            <Link
              to="/admin"
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 ${
                isActive('/admin') || isActive('/admin/dashboard') || isActive('/admin/procesos')
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700'
              }`}
              title="Panel Administrativo"
            >
              <Shield className="h-4 w-4" />
              <span>Admin</span>
            </Link>

          </div>

          {/* Mobile menu button - Rediseñado */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2.5 rounded-lg text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 flex-shrink-0"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation - Rediseñado */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-blue-100 mt-2 pb-4 animate-in slide-in-from-top">
            <nav className="flex flex-col space-y-1 pt-2">
              {/* Navigation Items */}
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 text-base font-medium transition-all duration-200 rounded-lg mx-2 ${
                      isActive(item.href)
                        ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600'
                        : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50/50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
              {/* Divider */}
              <div className="my-3 mx-6 border-t border-slate-200"></div>
              
              {/* Quick Links */}
              <div className="px-4 mb-3">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Accesos Rápidos
                </p>
                
                {/* Portal Cliente */}
                <Link
                  to="/portal"
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 text-base font-medium transition-all duration-200 rounded-lg mb-2 ${
                    isActive('/portal')
                      ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600'
                      : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50/50'
                  }`}
                >
                  <User className="h-5 w-5" />
                  <span>Portal Cliente</span>
                </Link>

                {/* Panel Admin - Destacado */}
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 text-base font-semibold transition-all duration-200 rounded-lg shadow-md mb-2 ${
                    isActive('/admin') || isActive('/admin/dashboard')
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                      : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700'
                  }`}
                >
                  <Shield className="h-5 w-5" />
                  <span>Panel Administrativo</span>
                </Link>

              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
