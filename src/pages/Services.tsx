import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, FileText, Users, Clock } from 'lucide-react';

const Services = () => {
  const services = [
    {
      id: 'accidentes-transito',
      title: 'Responsabilidad Civil por Accidentes de Tránsito',
      description: 'Representación legal especializada en accidentes vehiculares, incluyendo colisiones, atropellos y daños materiales. Recuperamos compensaciones por lesiones personales, daños a vehículos, lucro cesante y daño emergente.',
      features: ['Evaluación gratuita del caso', 'Gestión con aseguradoras', 'Peritajes técnicos', 'Representación judicial'],
      icon: '🚗',
      color: 'bg-blue-500'
    },
    {
      id: 'negligencia-medica',
      title: 'Responsabilidad Médica',
      description: 'Defensa especializada en casos de mala praxis médica, errores de diagnóstico, negligencia hospitalaria y daños por tratamientos inadecuados. Protegemos los derechos de pacientes y familias.',
      features: ['Análisis de historias clínicas', 'Peritajes médicos', 'Evaluación de daños', 'Negociación con EPS'],
      icon: '⚕️',
      color: 'bg-green-500'
    },
    {
      id: 'responsabilidad-contractual',
      title: 'Responsabilidad Contractual',
      description: 'Asesoría y representación en incumplimientos contractuales, reclamación de perjuicios por breach de contrato y responsabilidad por daños derivados de relaciones contractuales.',
      features: ['Análisis contractual', 'Cuantificación de perjuicios', 'Mediación y arbitraje', 'Litigio comercial'],
      icon: '📋',
      color: 'bg-purple-500'
    },
    {
      id: 'responsabilidad-estado',
      title: 'Responsabilidad del Estado',
      description: 'Reclamaciones contra entidades públicas por daños causados por acción u omisión estatal. Defendemos a ciudadanos afectados por fallas en el servicio público.',
      features: ['Reparación directa', 'Falla del servicio', 'Daño especial', 'Procedimiento administrativo'],
      icon: '🏛️',
      color: 'bg-red-500'
    },
    {
      id: 'danos-propiedad',
      title: 'Daños a la Propiedad',
      description: 'Recuperación de daños materiales a bienes inmuebles y muebles causados por terceros, incluyendo daños por construcciones, inundaciones y otros eventos.',
      features: ['Avalúos técnicos', 'Inspecciones judiciales', 'Reclamación de lucro cesante', 'Gestión aseguradora'],
      icon: '🏠',
      color: 'bg-orange-500'
    },
    {
      id: 'responsabilidad-productos',
      title: 'Responsabilidad por Productos Defectuosos',
      description: 'Representación en casos de daños causados por productos defectuosos, incluyendo alimentos, medicamentos, electrodomésticos y otros bienes de consumo.',
      features: ['Análisis de productos', 'Cadena de responsabilidad', 'Pruebas técnicas', 'Reclamación integral'],
      icon: '📦',
      color: 'bg-teal-500'
    }
  ];

  const processSteps = [
    {
      step: '01',
      title: 'Consulta Inicial',
      description: 'Evaluamos tu caso sin costo y determinamos la viabilidad legal de tu reclamación.'
    },
    {
      step: '02',
      title: 'Investigación',
      description: 'Recopilamos pruebas, documentos y testimonios necesarios para fortalecer tu caso.'
    },
    {
      step: '03',
      title: 'Estrategia Legal',
      description: 'Desarrollamos una estrategia personalizada basada en las particularidades de tu caso.'
    },
    {
      step: '04',
      title: 'Negociación',
      description: 'Buscamos acuerdos favorables antes de llegar a instancias judiciales.'
    },
    {
      step: '05',
      title: 'Litigio',
      description: 'Si es necesario, representamos tus intereses ante los tribunales competentes.'
    },
    {
      step: '06',
      title: 'Resolución',
      description: 'Obtenemos la compensación justa y ejecutamos el cumplimiento de la sentencia.'
    }
  ];

  return (
    <div className="py-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Nuestros Servicios Legales Especializados
          </h1>
          <p className="text-xl lg:text-2xl text-blue-100 max-w-4xl mx-auto">
            Ofrecemos representación legal integral en todas las áreas de responsabilidad civil, 
            con la experiencia y dedicación que tu caso merece.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Áreas de Especialización
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Cada área de práctica cuenta con abogados especializados y un enfoque 
              estratégico adaptado a las particularidades del caso.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <div className={`${service.color} rounded-lg p-3 text-white text-2xl mr-4`}>
                      {service.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">{service.title}</h3>
                  </div>
                  
                  <p className="text-slate-600 mb-6 leading-relaxed">{service.description}</p>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-slate-900 mb-3">Servicios incluidos:</h4>
                    <ul className="space-y-2">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-slate-600">
                          <Shield className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Link
                    to={`/servicios/${service.id}`}
                    className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 group-hover:bg-blue-700"
                  >
                    Ver más detalles
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Nuestro Proceso Legal
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Un enfoque estructurado y transparente que garantiza la mejor 
              representación en cada etapa de tu caso.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-blue-50 rounded-xl p-6 h-full">
                  <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{step.description}</p>
                </div>
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-blue-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Casos Exitosos</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">$15B+</div>
              <div className="text-blue-100">Recuperados</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-blue-100">Satisfacción</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">14</div>
              <div className="text-blue-100">Años de Experiencia</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            ¿Necesitas Representación Legal?
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            No esperes más para defender tus derechos. Agenda una consulta gratuita 
            y descubre cómo podemos ayudarte.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contacto"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Agenda tu Consulta Gratuita
            </Link>
            <a
              href="https://wa.me/573001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors duration-200"
            >
              Contáctanos por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;