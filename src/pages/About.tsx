import React from 'react';
import { Award, Users, Heart, Scale } from 'lucide-react';

const About = () => {
  const team = [
    {
      name: 'Dr. Giovanny Gallego',
      position: 'Socio Fundador',
      specialty: 'Especialista en Responsabilidad Civil',
      description: 'Con más de 15 años de experiencia en derecho civil, el Dr. Pérez ha liderado casos complejos de responsabilidad civil, obteniendo compensaciones millonarias para sus clientes.',
      image: 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      name: 'Dra. María Elena Rodríguez',
      position: 'Socia',
      specialty: 'Especialista en Negligencia Médica',
      description: 'Experta en casos de mala praxis médica con 12 años de experiencia. Ha representado exitosamente a víctimas de negligencia médica en hospitales y clínicas.',
      image: 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const values = [
    {
      title: 'Ética',
      description: 'Actuamos con integridad y transparencia en cada caso, manteniendo los más altos estándares profesionales.',
      icon: <Scale className="h-8 w-8 text-blue-600" />
    },
    {
      title: 'Integridad',
      description: 'Nuestro compromiso es con la verdad y la justicia, defendiendo los derechos de nuestros clientes con honestidad.',
      icon: <Award className="h-8 w-8 text-blue-600" />
    },
    {
      title: 'Empatía',
      description: 'Entendemos el dolor y la frustración de nuestros clientes, brindando apoyo humano además de legal.',
      icon: <Heart className="h-8 w-8 text-blue-600" />
    },
    {
      title: 'Excelencia',
      description: 'Buscamos la perfección en cada detalle, preparando meticulosamente cada caso para obtener los mejores resultados.',
      icon: <Users className="h-8 w-8 text-blue-600" />
    }
  ];

  return (
    <div className="py-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Quiénes Somos
          </h1>
          <p className="text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto">
            Conoce la historia, misión y valores que nos han convertido en 
            referentes en responsabilidad civil en Manizales
          </p>
        </div>
      </section>

      {/* History and Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Trayectoria y Visión en el Derecho
              </h2>
              <div className="space-y-6 text-lg text-slate-700 leading-relaxed">
                <p>
                  Prosejurix nació en 2010 con una visión clara: brindar representación legal 
                  de excelencia a las víctimas de responsabilidad civil en Manizales y toda 
                  la región de Caldas. Fundada por el Dr. Giovanny Gallego, nuestra firma 
                  ha crecido hasta convertirse en un referente regional.
                </p>
                <p>
                  Durante más de una década, hemos representado exitosamente a cientos de 
                  clientes en casos complejos de responsabilidad civil, recuperando millones 
                  de pesos en compensaciones justas. Nuestro enfoque se basa en la preparación 
                  meticulosa, la comunicación transparente y el compromiso inquebrantable con 
                  la justicia.
                </p>
                <p>
                  <strong>Nuestra Misión:</strong> Defender los derechos de las víctimas de 
                  responsabilidad civil, obteniendo la compensación justa que merecen a través 
                  de un servicio legal de excelencia, transparente y humano.
                </p>
                <p>
                  <strong>Nuestra Visión:</strong> Ser la firma líder en responsabilidad civil 
                  en Colombia, reconocida por nuestros resultados excepcionales y nuestro 
                  compromiso con la justicia social.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <img 
                src="https://images.pexels.com/photos/5668772/pexels-photo-5668772.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Oficina Prosejurix" 
                className="rounded-lg shadow-lg"
              />
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-slate-900 mb-3">Nuestros Logros</h3>
                <ul className="space-y-2 text-slate-700">
                  <li>• Más de 500 casos exitosos</li>
                  <li>• $15+ mil millones recuperados</li>
                  <li>• 98% de satisfacción del cliente</li>
                  <li>• 14 años de experiencia</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Conoce a Nuestros Abogados Expertos
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Un equipo de profesionales altamente calificados con amplia experiencia 
              en responsabilidad civil y un compromiso inquebrantable con sus clientes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-2/3 p-8">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{member.name}</h3>
                    <p className="text-blue-600 font-semibold mb-1">{member.position}</p>
                    <p className="text-slate-600 font-medium mb-4">{member.specialty}</p>
                    <p className="text-slate-700 leading-relaxed">{member.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Pilares de Nuestra Práctica Legal
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Los valores que guían cada decisión y acción en nuestra firma, 
              asegurando el mejor servicio para nuestros clientes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center group">
                <div className="bg-blue-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-100 transition-colors duration-200">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{value.title}</h3>
                <p className="text-slate-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            ¿Listo para Trabajar con Nosotros?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Conoce más sobre cómo podemos ayudarte a obtener la justicia que mereces.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contacto"
              className="bg-yellow-500 text-slate-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition-colors duration-200"
            >
              Agenda una Consulta
            </a>
            <a
              href="/servicios"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-slate-100 transition-colors duration-200"
            >
              Ver Nuestros Servicios
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;