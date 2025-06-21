import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, FileText, Calendar, LogOut, Eye, EyeOff } from 'lucide-react';

const ClientPortal = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    cedula: '',
    codigo: ''
  });
  const [clientData, setClientData] = useState<any>(null);

  // Mock client data
  const mockClientData = {
    nombre: 'María González Pérez',
    cedula: '12345678',
    procesos: [
      {
        id: 1,
        estado: 'En investigación',
        observaciones: 'Estamos recopilando las pruebas necesarias para su caso. El peritaje del vehículo está programado para la próxima semana.',
        fechaIngreso: '2024-01-15',
        tipo: 'Accidente de Tránsito'
      },
      {
        id: 2,
        estado: 'En negociación',
        observaciones: 'Hemos presentado la reclamación a la aseguradora. Esperamos respuesta en los próximos 15 días hábiles.',
        fechaIngreso: '2023-11-20',
        tipo: 'Responsabilidad Civil'
      }
    ]
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock authentication
    if (loginData.cedula === '12345678' && loginData.codigo === 'ABC123') {
      setIsLoggedIn(true);
      setClientData(mockClientData);
    } else {
      alert('Credenciales incorrectas. Use: Cédula: 12345678, Código: ABC123');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setClientData(null);
    setLoginData({ cedula: '', codigo: '' });
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link to="/" className="inline-block mb-8">
              <img 
                src="/prosejurix-rounded.png" 
                alt="Prosejurix Logo" 
                className="h-20 mx-auto"
              />
            </Link>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Portal del Cliente</h2>
            <p className="text-slate-600">Accede para consultar el estado de tus procesos legales</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="cedula" className="block text-sm font-medium text-slate-700 mb-2">
                  Cédula / NIT
                </label>
                <input
                  type="text"
                  id="cedula"
                  value={loginData.cedula}
                  onChange={(e) => setLoginData({ ...loginData, cedula: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Ingresa tu número de cédula"
                />
              </div>

              <div>
                <label htmlFor="codigo" className="block text-sm font-medium text-slate-700 mb-2">
                  Código de Proceso
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="codigo"
                    value={loginData.codigo}
                    onChange={(e) => setLoginData({ ...loginData, codigo: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 pr-12"
                    placeholder="Código proporcionado por Prosejurix"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
              >
                Ingresar al Portal
              </button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Datos de prueba:</h4>
              <p className="text-sm text-blue-800">Cédula: 12345678</p>
              <p className="text-sm text-blue-800">Código: ABC123</p>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600 mb-2">
                ¿No tienes tu código de acceso?
              </p>
              <a
                href="https://wa.me/573001234567"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Contáctanos por WhatsApp
              </a>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/"
                className="text-slate-600 hover:text-slate-700 text-sm"
              >
                ← Volver al sitio web
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/prosejurix-rounded.png" 
                alt="Prosejurix Logo" 
                className="h-10 w-10"
              />
              <div>
                <h1 className="text-xl font-bold text-slate-900">Portal del Cliente</h1>
                <p className="text-sm text-slate-600">Prosejurix</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors duration-200"
            >
              <LogOut className="h-5 w-5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 rounded-full p-3">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Bienvenido, {clientData.nombre}
              </h2>
              <p className="text-slate-600">
                Cédula: {clientData.cedula}
              </p>
            </div>
          </div>
        </div>

        {/* Processes Section */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-slate-900 flex items-center">
            <FileText className="h-6 w-6 mr-3 text-blue-600" />
            Mis Procesos Legales
          </h3>

          {clientData.procesos.map((proceso: any) => (
            <div key={proceso.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-semibold text-slate-900 mb-2">
                      Proceso #{proceso.id} - {proceso.tipo}
                    </h4>
                    <div className="flex items-center space-x-4 text-sm text-slate-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Fecha de ingreso: {new Date(proceso.fechaIngreso).toLocaleDateString('es-CO')}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 lg:mt-0">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      proceso.estado === 'En investigación' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : proceso.estado === 'En negociación'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {proceso.estado}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <h5 className="font-semibold text-slate-900 mb-2">Última Actualización:</h5>
                  <p className="text-slate-700 leading-relaxed">{proceso.observaciones}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-blue-50 rounded-xl p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4">
            ¿Tienes Preguntas sobre tu Caso?
          </h3>
          <p className="text-slate-700 mb-4">
            Nuestro equipo está disponible para resolver cualquier duda que tengas sobre el estado de tu proceso.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://wa.me/573001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 text-center"
            >
              Contactar por WhatsApp
            </a>
            <a
              href="tel:+573001234567"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 text-center"
            >
              Llamar Ahora
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientPortal;