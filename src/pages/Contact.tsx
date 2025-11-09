import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle } from 'lucide-react';
import LandingLayout from '../components/common/LandingLayout';

const Contact = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    tipoCaso: '',
    mensaje: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const tiposCaso = [
    'Accidentes de Tránsito',
    'Negligencia Médica',
    'Responsabilidad Contractual',
    'Responsabilidad del Estado',
    'Daños a la Propiedad',
    'Responsabilidad por Productos',
    'Otro'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
    setFormData({
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      tipoCaso: '',
      mensaje: ''
    });
  };

  return (
    <LandingLayout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_transparent_55%)]" />
        <div className="relative mx-auto flex max-w-5xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8 lg:py-28">
          <span className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-blue-200/80">
            Agenda tu Consulta
          </span>
          <h1 className="mt-6 text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            Contáctanos para Asesoría Legal
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-blue-100">
            Estamos aquí para ayudarte. Agenda tu consulta gratuita y descubre cómo podemos defender tus derechos con transparencia y resultados.
          </p>
        </div>
      </section>

      <section className="relative pb-24 pt-8">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/10 via-white/0 to-white/0" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-10 shadow-[0_35px_80px_rgba(15,23,42,0.45)] backdrop-blur">
              <h2 className="text-3xl font-bold text-white">Envíanos tu Consulta</h2>
              <p className="mt-3 text-sm text-blue-200/80">
                Completa el formulario y nos pondremos en contacto contigo en menos de 24 horas.
              </p>

              {isSubmitted && (
                <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                  <CheckCircle className="h-5 w-5" />
                  ¡Mensaje enviado exitosamente! Te contactaremos pronto.
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-8 space-y-6 text-blue-100/90">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <label className="flex flex-col gap-2 text-sm font-medium">
                    Nombre *
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-blue-200/60 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300/60"
                      placeholder="Tu nombre"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-medium">
                    Apellido *
                    <input
                      type="text"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleChange}
                      required
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-blue-200/60 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300/60"
                      placeholder="Tu apellido"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <label className="flex flex-col gap-2 text-sm font-medium">
                    Correo Electrónico *
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-blue-200/60 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300/60"
                      placeholder="tu@email.com"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-medium">
                    Teléfono *
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      required
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-blue-200/60 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300/60"
                      placeholder="300 123 4567"
                    />
                  </label>
                </div>

                <label className="flex flex-col gap-2 text-sm font-medium">
                  Tipo de Caso *
                  <select
                    name="tipoCaso"
                    value={formData.tipoCaso}
                    onChange={handleChange}
                    required
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300/60"
                  >
                    <option value="" className="bg-slate-900 text-white">Selecciona el tipo de caso</option>
                    {tiposCaso.map((tipo) => (
                      <option key={tipo} value={tipo} className="bg-slate-900 text-white">
                        {tipo}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium">
                  Describe tu Caso *
                  <textarea
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-blue-200/60 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300/60"
                    placeholder="Cuéntanos los detalles de tu caso..."
                  />
                </label>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 px-6 py-4 text-sm font-semibold text-white shadow-[0_20px_45px_rgba(37,99,235,0.35)] transition hover:from-blue-400 hover:via-indigo-500 hover:to-blue-400 hover:shadow-[0_25px_60px_rgba(37,99,235,0.45)]"
                >
                  <Send className="h-5 w-5" /> Enviar Consulta
                </button>
              </form>
            </div>

            <div className="space-y-8">
              <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-10 shadow-[0_30px_70px_rgba(15,23,42,0.45)] backdrop-blur">
                <h3 className="text-2xl font-bold text-white">Información de Contacto Directo</h3>
                <div className="mt-8 space-y-6 text-sm text-blue-100/90">
                  <div className="flex items-start gap-4 rounded-2xl border border-white/5 bg-white/5 p-4">
                    <div className="rounded-xl border border-blue-200/40 bg-blue-500/20 p-2">
                      <Phone className="h-5 w-5 text-blue-100" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Teléfono</p>
                      <p>(+57) 300 123 4567</p>
                      <p className="text-xs text-blue-200/70">Línea directa 24/7</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 rounded-2xl border border-white/5 bg-white/5 p-4">
                    <div className="rounded-xl border border-green-200/40 bg-green-500/20 p-2">
                      <MessageCircle className="h-5 w-5 text-green-100" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">WhatsApp</p>
                      <a
                        href="https://wa.me/573001234567"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-200 hover:text-green-100"
                      >
                        Enviar mensaje
                      </a>
                      <p className="text-xs text-blue-200/70">Respuesta inmediata</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 rounded-2xl border border-white/5 bg-white/5 p-4">
                    <div className="rounded-xl border border-purple-200/40 bg-purple-500/20 p-2">
                      <Mail className="h-5 w-5 text-purple-100" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Email</p>
                      <p>info@prosejurix.com</p>
                      <p className="text-xs text-blue-200/70">Respuesta en 24 horas</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 rounded-2xl border border-white/5 bg-white/5 p-4">
                    <div className="rounded-xl border border-amber-200/40 bg-amber-500/20 p-2">
                      <MapPin className="h-5 w-5 text-amber-100" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Dirección</p>
                      <p>
                        Carrera 23 #58-42, Oficina 301
                        <br />
                        Manizales, Caldas, Colombia
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-blue-100 shadow-[0_30px_70px_rgba(15,23,42,0.4)] backdrop-blur">
                <h3 className="text-2xl font-bold text-white">Horarios de Atención</h3>
                <div className="mt-6 space-y-4 text-sm">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-blue-200" />
                    <div>
                      <p className="font-semibold text-white">Lunes - Viernes</p>
                      <p>8:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-blue-200" />
                    <div>
                      <p className="font-semibold text-white">Sábados</p>
                      <p>9:00 AM - 1:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-blue-200/70" />
                    <div>
                      <p className="font-semibold text-white">Domingos</p>
                      <p>Cerrado</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 rounded-2xl border border-blue-300/30 bg-blue-500/10 px-4 py-3 text-xs text-blue-100/80">
                  <strong>Emergencias:</strong> Para casos urgentes, contáctanos por WhatsApp las 24 horas del día.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-24">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/0 via-white/8 to-white/0" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold sm:text-4xl">Nuestra Ubicación</h2>
            <p className="mt-4 text-lg text-blue-100">Visítanos en nuestras oficinas en el centro de Manizales</p>
          </div>
          <div className="mt-10 flex items-center justify-center rounded-3xl border border-white/10 bg-slate-950/70 p-10 text-center text-blue-100 shadow-[0_35px_80px_rgba(15,23,42,0.45)] backdrop-blur">
            <div>
              <MapPin className="mx-auto h-16 w-16 text-blue-200" />
              <p className="mt-4 text-lg">Mapa de Google Maps se integrará aquí</p>
              <p className="text-sm text-blue-200/80">Carrera 23 #58-42, Oficina 301, Manizales, Caldas</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative pb-24 pt-8">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/0 via-white/14 to-white/8" />
        <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-gradient-to-r from-blue-600/40 via-indigo-600/40 to-blue-600/40 px-6 py-16 text-center shadow-[0_35px_80px_rgba(15,23,42,0.55)] backdrop-blur sm:px-12">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">¿Prefieres Hablar Directamente?</h2>
          <p className="mt-4 text-lg text-blue-100">
            Llámanos ahora para una consulta inmediata o agenda una cita presencial.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="tel:+573001234567"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-blue-700 shadow-lg shadow-white/20 transition hover:-translate-y-0.5 hover:bg-blue-50"
            >
              <Phone className="h-5 w-5" /> Llamar Ahora
            </a>
            <a
              href="https://wa.me/573001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-8 py-4 text-base font-semibold text-white transition hover:border-white/60 hover:bg-white/10"
            >
              <MessageCircle className="h-5 w-5" /> WhatsApp
            </a>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
};

export default Contact;