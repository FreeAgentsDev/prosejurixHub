import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';

interface AdminLoginFormProps {
  onLogin: (usuario: string, password: string) => void;
}

const AdminLoginForm = ({ onLogin }: AdminLoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    usuario: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(loginData.usuario, loginData.password);
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Usuario"
          type="text"
          id="usuario"
          value={loginData.usuario}
          onChange={(e) => setLoginData({ ...loginData, usuario: e.target.value })}
          required
          placeholder="Nombre de usuario"
        />

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
            Contraseña
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              required
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 pr-12"
              placeholder="Contraseña"
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

        <Button type="submit" variant="primary" className="w-full">
          Iniciar Sesión
        </Button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">Credenciales de prueba:</h4>
        <p className="text-sm text-blue-800">Usuario: admin</p>
        <p className="text-sm text-blue-800">Contraseña: prosejurix2024</p>
      </div>
    </div>
  );
};

export default AdminLoginForm;

