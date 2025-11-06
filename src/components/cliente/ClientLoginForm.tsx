import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, ArrowLeft } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';

interface ClientLoginFormProps {
  onLogin: (clienteId: string) => void;
}

const ClientLoginForm = ({ onLogin }: ClientLoginFormProps) => {
  const [clienteId, setClienteId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(clienteId);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-slate-100">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="ID del Cliente"
          type="number"
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
          required
          placeholder="Ingresa tu ID de cliente"
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 border-0 shadow-md hover:shadow-lg transition-all"
        >
          <span className="inline-flex items-center justify-center gap-2">
            <LogIn className="h-5 w-5" />
            <span className="font-semibold">Ingresar al Portal</span>
          </span>
        </Button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">Información:</h4>
        <p className="text-sm text-blue-800">Ingresa tu ID de cliente para acceder a tus procesos legales.</p>
        <p className="text-sm text-blue-700 mt-2">Si no conoces tu ID, contacta al administrador.</p>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-slate-600 mb-2">
          ¿Necesitas ayuda o no tienes tu ID de cliente?
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

      <div className="mt-6 flex justify-center">
        <Link
          to="/"
          aria-label="Volver al sitio web"
          title="Volver"
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 shadow-sm hover:shadow transition-all"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
};

export default ClientLoginForm;

