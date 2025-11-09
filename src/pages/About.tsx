import React from 'react';
import { Award, Users, Heart, Scale } from 'lucide-react';
import LandingLayout from '../components/common/LandingLayout';

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
      icon: <Scale className="h-8 w-8 text-blue-200" />
    },
    {
      title: 'Integridad',
      description: 'Nuestro compromiso es con la verdad y la justicia, defendiendo los derechos de nuestros clientes con honestidad.',
      icon: <Award className="h-8 w-8 text-blue-200" />
    },
    {
      title: 'Empatía',
      description: 'Entendemos el dolor y la frustración de nuestros clientes, brindando apoyo humano además de legal.',
      icon: <Heart className="h-8 w-8 text-blue-200" />
    },
    {
      title: 'Excelencia',
      description: 'Buscamos la perfección en cada detalle, preparando meticulosamente cada caso para obtener los mejores resultados.',
      icon: <Users className="h-8 w-8 text-blue-200" />
    }
  ];

  return (
    <LandingLayout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_transparent_55%)]" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8 lg:py-28">
          <span className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-blue-200/80">
            Nuestra Historia
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            Quiénes Somos
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-blue-100">
            Conoce la historia, misión y valores que nos han convertido en referentes en responsabilidad civil en Manizales.
          </p>
        </div>
      </section>

      <section className="relative py-24">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/10 via-white/0 to-white/0" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-10 shadow-[0_35px_70px_rgba(15,23,42,0.35)] backdrop-blur">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">Trayectoria y Visión en el Derecho</h2>
              <div className="mt-8 space-y-6 text-base leading-relaxed text-blue-100">
                <p>
                  Prosejurix nació en 2010 con una visión clara: brindar representación legal de excelencia a las víctimas de responsabilidad civil en Manizales y toda la región de Caldas. Fundada por el Dr. Giovanny Gallego, nuestra firma ha crecido hasta convertirse en un referente regional.
                </p>
                <p>
                  Durante más de una década, hemos representado exitosamente a cientos de clientes en casos complejos de responsabilidad civil, recuperando millones de pesos en compensaciones justas. Nuestro enfoque se basa en la preparación meticulosa, la comunicación transparente y el compromiso inquebrantable con la justicia.
                </p>
                <p>
                  <strong>Nuestra Misión:</strong> Defender los derechos de las víctimas de responsabilidad civil, obteniendo la compensación justa que merecen a través de un servicio legal de excelencia, transparente y humano.
                </p>
                <p>
                  <strong>Nuestra Visión:</strong> Ser la firma líder en responsabilidad civil en Colombia, reconocida por nuestros resultados excepcionales y nuestro compromiso con la justicia social.
                </p>
              </div>
            </div>
            <div className="space-y-8">
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-lg shadow-slate-950/40">
              <img 
                src="https://images.pexels.com/photos/5668772/pexels-photo-5668772.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Oficina Prosejurix" 
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-8 shadow-inner shadow-blue-900/40 backdrop-blur">
                <h3 className="text-xl font-semibold text-white">Nuestros Logros</h3>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-blue-100/90">
                  <div className="rounded-2xl bg-white/5 p-4 text-center">
                    <p className="text-3xl font-bold text-white">500+</p>
                    <p>Casos exitosos</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-4 text-center">
                    <p className="text-3xl font-bold text-white">$15B+</p>
                    <p>Recuperados</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-4 text-center">
                    <p className="text-3xl font-bold text-white">98%</p>
                    <p>Satisfacción</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-4 text-center">
                    <p className="text-3xl font-bold text-white">14</p>
                    <p>Años de experiencia</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-24">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/0 via-white/8 to-white/0" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <span className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-blue-200/80">
              Equipo Estratégico
            </span>
            <h2 className="mt-6 text-3xl font-bold text-white sm:text-4xl">Conoce a Nuestros Abogados</h2>
            <p className="mt-4 text-lg text-blue-100">
              Un equipo de profesionales altamente calificados con amplia experiencia en responsabilidad civil y un compromiso inquebrantable con sus clientes.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            {team.map((member) => (
              <div key={member.name} className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_25px_55px_rgba(15,23,42,0.4)] backdrop-blur">
                <div className="grid gap-0 md:grid-cols-[0.45fr_0.55fr]">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-indigo-500/20 to-transparent" />
                    <img src={member.image} alt={member.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-white">{member.name}</h3>
                    <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-blue-200">{member.position}</p>
                    <p className="mt-1 text-sm text-blue-200/70">{member.specialty}</p>
                    <p className="mt-6 text-sm leading-relaxed text-blue-100/90">{member.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative pb-24 pt-12">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/0 via-white/6 to-white/10" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <span className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-blue-200/80">
              Nuestros Pilares
            </span>
            <h2 className="mt-6 text-3xl font-bold text-white sm:text-4xl">Los Valores que Nos Definen</h2>
            <p className="mt-4 text-lg text-blue-100">
              Los principios que guían cada decisión y acción en nuestra firma, asegurando el mejor servicio para nuestros clientes.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="group flex h-full flex-col items-center rounded-3xl border border-white/10 bg-slate-950/60 px-8 py-10 text-center shadow-2xl shadow-slate-950/40 transition hover:border-white/20 hover:bg-slate-900/60"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-inner shadow-blue-900/30 backdrop-blur">
                  {value.icon}
                </div>
                <h3 className="mt-6 text-xl font-semibold text-white">{value.title}</h3>
                <p className="mt-4 text-sm text-blue-100/90">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </LandingLayout>
  );
};

export default About;