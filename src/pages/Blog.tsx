import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';

const Blog = () => {
  return (
    <div className="py-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Artículos Legales y Noticias
          </h1>
          <p className="text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto">
            Mantente informado sobre las últimas novedades en responsabilidad civil, 
            cambios legislativos y consejos legales útiles.
          </p>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-xl shadow-lg p-12">
            <div className="text-6xl mb-8">📝</div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              Próximamente
            </h2>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Estamos preparando contenido valioso para ti. Pronto encontrarás aquí artículos 
              especializados sobre responsabilidad civil, guías prácticas, análisis de casos 
              relevantes y las últimas novedades del derecho colombiano.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-6">
                <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-slate-900 mb-2">Análisis Legal</h3>
                <p className="text-sm text-slate-600">Casos relevantes y precedentes jurisprudenciales</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-6">
                <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-slate-900 mb-2">Guías Prácticas</h3>
                <p className="text-sm text-slate-600">Consejos útiles para víctimas de responsabilidad civil</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-6">
                <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-slate-900 mb-2">Novedades</h3>
                <p className="text-sm text-slate-600">Cambios legislativos y noticias del sector</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contacto"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 inline-flex items-center justify-center"
              >
                Consulta Legal
                <ArrowRight className="h-4 w-4 ml-2" />
              </a>
              <a
                href="/servicios"
                className="bg-slate-200 text-slate-700 px-8 py-3 rounded-lg font-semibold hover:bg-slate-300 transition-colors duration-200"
              >
                Ver Servicios
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Suscríbete a Nuestras Actualizaciones
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Sé el primero en recibir nuestros artículos legales y consejos especializados.
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
              <button className="bg-yellow-500 text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors duration-200">
                Suscribirse
              </button>
            </div>
            <p className="text-sm text-blue-200 mt-3">
              No spam. Solo contenido legal valioso.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;