import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, Users, Shield, Phone } from 'lucide-react';

const ServiceDetail = () => {
  const { serviceId } = useParams();

  const serviceData: Record<string, any> = {
    'accidentes-transito': {
      title: 'Responsabilidad Civil por Accidentes de Tránsito',
      description: 'Representación legal especializada en accidentes vehiculares de todo tipo, desde colisiones menores hasta accidentes graves con lesiones personales. Nuestro equipo tiene amplia experiencia en la recuperación de compensaciones justas por daños materiales, lesiones corporales, lucro cesante y daño moral.',
      icon: '🚗',
      color: 'bg-blue-500',
      detailedInfo: `Los accidentes de tránsito pueden cambiar tu vida en segundos. Cuando eres víctima de un accidente causado por la negligencia de otro conductor, tienes derecho a una compensación justa que cubra todos los daños sufridos.

      En Prosejurix entendemos la complejidad de estos casos y trabajamos incansablemente para asegurar que recibas la compensación que mereces. Nuestro enfoque integral incluye la evaluación médica de lesiones, el análisis técnico del accidente, la negociación con aseguradoras y, si es necesario, la representación judicial.`,
      process: [
        'Evaluación inicial gratuita del caso',
        'Recopilación de evidencias y testimonios',
        'Análisis técnico del accidente',
        'Evaluación médica de lesiones',
        'Negociación con aseguradoras',
        'Presentación de demanda si es necesario',
        'Representación en audiencias',
        'Ejecución de la sentencia'
      ],
      faqs: [
        {
          question: '¿Qué debo hacer inmediatamente después de un accidente?',
          answer: 'Busca atención médica inmediata, documenta la escena con fotos, obtén información de contacto de testigos, no admitas culpabilidad y contacta a un abogado lo antes posible.'
        },
        {
          question: '¿Cuánto tiempo tengo para presentar una reclamación?',
          answer: 'En Colombia, el término general para reclamar por responsabilidad civil es de 3 años desde que ocurrió el daño o desde que se tuvo conocimiento del mismo.'
        },
        {
          question: '¿Qué tipos de daños puedo reclamar?',
          answer: 'Puedes reclamar daño emergente (gastos médicos, reparaciones), lucro cesante (pérdida de ingresos), daño moral (sufrimiento) y daño a la vida de relación.'
        },
        {
          question: '¿Necesito tener seguro para reclamar?',
          answer: 'No necesitas tener seguro para reclamar. La responsabilidad recae sobre quien causó el accidente y su aseguradora.'
        }
      ]
    },
    'negligencia-medica': {
      title: 'Responsabilidad Médica',
      description: 'Defensa especializada en casos de mala praxis médica, errores de diagnóstico, negligencia hospitalaria y daños por tratamientos inadecuados. Protegemos los derechos de pacientes y familias afectadas por errores médicos.',
      icon: '⚕️',
      color: 'bg-green-500',
      detailedInfo: `La confianza que depositamos en los profesionales de la salud es fundamental, pero cuando esa confianza se ve traicionada por negligencia o mala praxis, las consecuencias pueden ser devastadoras.

      En Prosejurix tenemos la experiencia y los recursos necesarios para enfrentar casos complejos de responsabilidad médica. Trabajamos con peritos médicos reconocidos y analizamos meticulosamente cada aspecto del tratamiento para determinar si hubo negligencia y cuáles fueron sus consecuencias.`,
      process: [
        'Análisis inicial de la historia clínica',
        'Consulta con peritos médicos especializados',
        'Evaluación de la atención recibida',
        'Determinación de la relación causal',
        'Cuantificación de daños y perjuicios',
        'Negociación con la institución médica',
        'Presentación de demanda si es necesario',
        'Seguimiento hasta la resolución final'
      ],
      faqs: [
        {
          question: '¿Qué constituye negligencia médica?',
          answer: 'La negligencia médica ocurre cuando un profesional de la salud no proporciona el estándar de atención esperado, causando daño al paciente.'
        },
        {
          question: '¿Cómo puedo obtener mi historia clínica?',
          answer: 'Tienes derecho a solicitar tu historia clínica completa a la institución médica. Nosotros te ayudamos en este proceso.'
        },
        {
          question: '¿Contra quién puedo demandar?',
          answer: 'Puedes demandar al médico tratante, la institución médica, la EPS o cualquier entidad responsable de la atención deficiente.'
        },
        {
          question: '¿Qué evidencia necesito para mi caso?',
          answer: 'Historia clínica completa, exámenes médicos, testimonios de otros médicos y documentación de todos los daños sufridos.'
        }
      ]
    },
    'responsabilidad-contractual': {
      title: 'Responsabilidad Contractual',
      description: 'Asesoría y representación en incumplimientos contractuales, reclamación de perjuicios por breach de contrato y responsabilidad por daños derivados de relaciones contractuales.',
      icon: '📋',
      color: 'bg-purple-500',
      detailedInfo: `Los contratos son la base de las relaciones comerciales y civiles. Cuando una de las partes incumple sus obligaciones contractuales, la parte afectada tiene derecho a reclamar una compensación por los perjuicios sufridos.

      En Prosejurix analizamos meticulosamente cada contrato para identificar las obligaciones incumplidas y cuantificar los daños resultantes. Nuestro objetivo es obtener una compensación integral que incluya tanto el daño emergente como el lucro cesante.`,
      process: [
        'Análisis detallado del contrato',
        'Identificación de obligaciones incumplidas',
        'Recopilación de evidencias del incumplimiento',
        'Cuantificación de perjuicios económicos',
        'Intento de solución extrajudicial',
        'Presentación de demanda contractual',
        'Representación en proceso judicial',
        'Ejecución de la sentencia'
      ],
      faqs: [
        {
          question: '¿Qué es el incumplimiento contractual?',
          answer: 'Es cuando una de las partes no cumple total o parcialmente con las obligaciones establecidas en el contrato.'
        },
        {
          question: '¿Qué puedo reclamar por incumplimiento?',
          answer: 'Puedes reclamar el cumplimiento del contrato, la resolución del mismo, y en ambos casos, indemnización de perjuicios.'
        },
        {
          question: '¿Cuándo prescribe la acción contractual?',
          answer: 'La acción contractual prescribe en 10 años desde el incumplimiento, salvo que la ley establezca un término menor.'
        },
        {
          question: '¿Necesito intentar arreglo antes de demandar?',
          answer: 'No es obligatorio, pero es recomendable intentar una solución amigable antes de acudir a los tribunales.'
        }
      ]
    },
    'responsabilidad-estado': {
      title: 'Responsabilidad del Estado',
      description: 'Reclamaciones contra entidades públicas por daños causados por acción u omisión estatal. Defendemos a ciudadanos afectados por fallas en el servicio público.',
      icon: '🏛️',
      color: 'bg-red-500',
      detailedInfo: `El Estado tiene la obligación de prestar servicios públicos de manera eficiente y segura. Cuando las entidades públicas causan daños a los ciudadanos por acción u omisión, existe responsabilidad estatal que debe ser reparada.

      En Prosejurix tenemos amplia experiencia en reclamaciones contra el Estado, conocemos los procedimientos especiales y los términos aplicables. Representamos a ciudadanos en casos de falla del servicio, daño especial y reparación directa.`,
      process: [
        'Evaluación de la responsabilidad estatal',
        'Identificación de la entidad responsable',
        'Agotamiento de la vía gubernativa',
        'Presentación de demanda de reparación directa',
        'Práctica de pruebas especializadas',
        'Audiencias ante el Tribunal Administrativo',
        'Seguimiento del proceso judicial',
        'Ejecución de la sentencia'
      ],
      faqs: [
        {
          question: '¿Cuándo es responsable el Estado?',
          answer: 'El Estado es responsable cuando causa daños por falla del servicio, daño especial o cuando actúa de manera antijurídica.'
        },
        {
          question: '¿Qué es la vía gubernativa?',
          answer: 'Es el procedimiento administrativo previo que debe agotarse antes de demandar al Estado en algunos casos.'
        },
        {
          question: '¿Cuánto tiempo tengo para demandar al Estado?',
          answer: 'El término general es de 2 años desde que ocurrió el daño o desde que se tuvo conocimiento del mismo.'
        },
        {
          question: '¿Contra qué entidades puedo demandar?',
          answer: 'Puedes demandar a cualquier entidad pública: ministerios, alcaldías, hospitales públicos, universidades públicas, etc.'
        }
      ]
    },
    'danos-propiedad': {
      title: 'Daños a la Propiedad',
      description: 'Recuperación de daños materiales a bienes inmuebles y muebles causados por terceros, incluyendo daños por construcciones, inundaciones y otros eventos.',
      icon: '🏠',
      color: 'bg-orange-500',
      detailedInfo: `Los daños a la propiedad pueden ocurrir por diversas causas: construcciones vecinas, inundaciones, incendios, vandalismo o negligencia de terceros. Cuando estos daños son causados por la acción u omisión de otros, tienes derecho a una compensación completa.

      En Prosejurix evaluamos integralmente los daños a tu propiedad, trabajamos con peritos especializados en avalúos y construcción, y luchamos por obtener una compensación que cubra tanto la reparación como los perjuicios adicionales.`,
      process: [
        'Inspección técnica de los daños',
        'Avalúo profesional de la propiedad',
        'Identificación de los responsables',
        'Documentación fotográfica y testimonial',
        'Cuantificación de daños y perjuicios',
        'Negociación con responsables y aseguradoras',
        'Presentación de demanda si es necesario',
        'Seguimiento hasta la reparación completa'
      ],
      faqs: [
        {
          question: '¿Qué tipos de daños a la propiedad puedo reclamar?',
          answer: 'Puedes reclamar daños estructurales, daños a contenidos, pérdida de uso de la propiedad y disminución del valor comercial.'
        },
        {
          question: '¿Necesito un avalúo profesional?',
          answer: 'Sí, es fundamental contar con un avalúo técnico que determine el valor real de los daños sufridos.'
        },
        {
          question: '¿Puedo reclamar por lucro cesante?',
          answer: 'Sí, si la propiedad generaba ingresos (arriendo, negocio), puedes reclamar por la pérdida de esos ingresos.'
        },
        {
          question: '¿Qué evidencia debo conservar?',
          answer: 'Fotos de los daños, facturas de reparaciones, testimonios de vecinos y cualquier documento que pruebe el valor de la propiedad.'
        }
      ]
    },
    'responsabilidad-productos': {
      title: 'Responsabilidad por Productos Defectuosos',
      description: 'Representación en casos de daños causados por productos defectuosos, incluyendo alimentos, medicamentos, electrodomésticos y otros bienes de consumo.',
      icon: '📦',
      color: 'bg-teal-500',
      detailedInfo: `Los consumidores tienen derecho a productos seguros y de calidad. Cuando un producto defectuoso causa daños, tanto el fabricante como el distribuidor pueden ser responsables de compensar a las víctimas.

      En Prosejurix manejamos casos de responsabilidad por productos defectuosos, desde alimentos contaminados hasta electrodomésticos peligrosos. Investigamos toda la cadena de producción y distribución para identificar a todos los responsables.`,
      process: [
        'Preservación del producto defectuoso',
        'Análisis técnico del defecto',
        'Identificación de la cadena de responsabilidad',
        'Evaluación médica de daños (si aplica)',
        'Investigación del proceso de fabricación',
        'Negociación con fabricantes y aseguradoras',
        'Presentación de demanda si es necesario',
        'Seguimiento hasta la compensación'
      ],
      faqs: [
        {
          question: '¿Qué constituye un producto defectuoso?',
          answer: 'Un producto es defectuoso cuando no cumple con los estándares de seguridad esperados o tiene fallas de diseño, fabricación o advertencia.'
        },
        {
          question: '¿Contra quién puedo demandar?',
          answer: 'Puedes demandar al fabricante, distribuidor, importador o vendedor del producto defectuoso.'
        },
        {
          question: '¿Necesito conservar el producto?',
          answer: 'Sí, es crucial conservar el producto defectuoso como evidencia para el análisis técnico.'
        },
        {
          question: '¿Qué daños puedo reclamar?',
          answer: 'Puedes reclamar daños personales, daños a la propiedad, gastos médicos y lucro cesante.'
        }
      ]
    }
  };

  const service = serviceData[serviceId || ''];

  if (!service) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Servicio no encontrado</h1>
        <Link to="/servicios" className="text-blue-600 hover:text-blue-700">
          Volver a servicios
        </Link>
      </div>
    );
  }

  return (
    <div className="py-16">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <Link 
          to="/servicios" 
          className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Servicios
        </Link>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <div className={`${service.color} rounded-lg p-4 text-white text-4xl mr-6`}>
              {service.icon}
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold">{service.title}</h1>
          </div>
          <p className="text-xl lg:text-2xl text-blue-100 max-w-4xl">
            {service.description}
          </p>
        </div>
      </section>

      {/* Detailed Information */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Información Detallada
              </h2>
              <div className="prose prose-lg text-slate-700 leading-relaxed">
                {service.detailedInfo.split('\n\n').map((paragraph: string, index: number) => (
                  <p key={index} className="mb-6">
                    {paragraph.trim()}
                  </p>
                ))}
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">
                ¿Necesitas ayuda con este tipo de caso?
              </h3>
              <div className="space-y-4 mb-8">
                <div className="flex items-center text-slate-700">
                  <Clock className="h-5 w-5 text-blue-600 mr-3" />
                  <span>Consulta gratuita</span>
                </div>
                <div className="flex items-center text-slate-700">
                  <Users className="h-5 w-5 text-blue-600 mr-3" />
                  <span>Equipo especializado</span>
                </div>
                <div className="flex items-center text-slate-700">
                  <Shield className="h-5 w-5 text-blue-600 mr-3" />
                  <span>Sin honorarios hasta ganar</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <Link
                  to="/contacto"
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 text-center block"
                >
                  Agenda tu Consulta
                </Link>
                <a
                  href="https://wa.me/573001234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 text-center block flex items-center justify-center"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            Proceso Legal para {service.title}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.process.map((step: string, index: number) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mb-4">
                  {index + 1}
                </div>
                <p className="text-slate-700 font-medium">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            Preguntas Frecuentes
          </h2>
          
          <div className="space-y-6">
            {service.faqs.map((faq: any, index: number) => (
              <div key={index} className="bg-slate-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  {faq.question}
                </h3>
                <p className="text-slate-700 leading-relaxed ml-9">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Inicia tu Reclamo Hoy
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            No esperes más para defender tus derechos. Cada día cuenta cuando se trata de tu caso.
          </p>
          <Link
            to="/contacto"
            className="bg-yellow-500 text-slate-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition-colors duration-200 inline-block"
          >
            Agenda tu Consulta Gratuita
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetail;