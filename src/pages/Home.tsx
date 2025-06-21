import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, Award, Clock, ArrowRight, MessageCircle, CheckCircle } from 'lucide-react';

const Home = () => {
  const services = [
    {
      id: 'accidentes-transito',
      title: 'Accidentes de Tránsito',
      description: 'Representación legal especializada en casos de accidentes vehiculares y reclamación de indemnizaciones.',
      icon: '🚗'
    },
    {
      id: 'negligencia-medica',
      title: 'Negligencia Médica',
      description: 'Defensa de víctimas de mala praxis médica y errores en atención sanitaria.',
      icon: '⚕️'
    },
    {
      id: 'danos-propiedad',
      title: 'Daños a la Propiedad',
      description: 'Recuperación de daños materiales y patrimoniales por responsabilidad de terceros.',
      icon: '🏠'
    },
    {
      id: 'responsabilidad-contractual',
      title: 'Responsabilidad Contractual',
      description: 'Asesoría en incumplimientos contractuales y reclamación de perjuicios.',
      icon: '📋'
    }
  ];

  const whyChooseUs = [
    {
      title: 'Asesoría Personalizada',
      description: 'Cada caso recibe atención individual y estrategias adaptadas a sus necesidades específicas.',
      icon: <Users className="h-8 w-8 text-blue-600" />
    },
    {
      title: 'Comunicación Transparente',
      description: 'Mantenemos informados a nuestros clientes en cada etapa del proceso legal.',
      icon: <MessageCircle className="h-8 w-8 text-blue-600" />
    },
    {
      title: 'Equipo Experto',
      description: 'Abogados especializados con amplia experiencia en responsabilidad civil.',
      icon: <Award className="h-8 w-8 text-blue-600" />
    },
    {
      title: 'Enfoque en Resultados',
      description: 'Trabajamos incansablemente para obtener la mejor compensación para nuestros clientes.',
      icon: <Shield className="h-8 w-8 text-blue-600" />
    }
  ];

  const testimonials = [
    {
      name: 'María González',
      text: 'Excelente atención y profesionalismo. Lograron una compensación justa por mi accidente.',
      case: 'Accidente de Tránsito'
    },
    {
      name: 'Carlos Rodríguez',
      text: 'El equipo de Prosejurix me acompañó durante todo el proceso con transparencia total.',
      case: 'Negligencia Médica'
    },
    {
      name: 'Ana Martínez',
      text: 'Profesionales comprometidos que realmente se preocupan por sus clientes.',
      case: 'Daños a la Propiedad'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Prosejurix: Tu Defensa Legal Experta en 
                <span className="text-yellow-400"> Responsabilidad Civil</span> en Manizales
              </h1>
              <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed">
                Protegiendo tus derechos y obteniendo la compensación justa que mereces. 
                Soluciones legales confiables y transparentes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/contacto"
                  className="bg-yellow-500 text-slate-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition-colors duration-200 text-center"
                >
                  Agenda tu Consulta Gratuita
                </Link>
                <a
                  href="https://wa.me/573001234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors duration-200 text-center flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Contáctanos por WhatsApp</span>
                </a>
              </div>
            </div>
            <div className="hidden lg:block">
              <img 
                src="/prosejurix.png" 
                alt="Prosejurix Logo" 
                className="w-full max-w-md mx-auto opacity-90"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Áreas Clave de Responsabilidad Civil que Manejamos
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Ofrecemos representación legal especializada en diversas áreas de responsabilidad civil, 
              con un enfoque integral y resultados comprobados.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 group">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                <p className="text-slate-600 mb-4 leading-relaxed">{service.description}</p>
                <Link
                  to={`/servicios/${service.id}`}
                  className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200"
                >
                  Ver más detalles
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Prosejurix: Compromiso, Experiencia y Resultados
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Nos distinguimos por nuestro enfoque personalizado y nuestro compromiso 
              inquebrantable con la justicia y los derechos de nuestros clientes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="text-center group">
                <div className="bg-blue-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-100 transition-colors duration-200">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Lo que Dicen Nuestros Clientes
            </h2>
            <p className="text-xl text-slate-600">
              La satisfacción de nuestros clientes es nuestro mayor logro
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center mb-4">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                  <span className="text-sm font-semibold text-blue-600">{testimonial.case}</span>
                </div>
                <p className="text-slate-700 mb-6 italic leading-relaxed">"{testimonial.text}"</p>
                <div className="font-semibold text-slate-900">{testimonial.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            ¿Necesitas Asesoría Urgente?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            No esperes más para defender tus derechos. Contáctanos hoy mismo 
            y obtén la representación legal que mereces.
          </p>
          <Link
            to="/contacto"
            className="bg-yellow-500 text-slate-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition-colors duration-200 inline-block"
          >
            Contáctanos Ahora
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;