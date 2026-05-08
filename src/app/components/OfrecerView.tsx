import { useState } from 'react';
import { Building2, CheckCircle, TrendingUp, Users } from 'lucide-react';
import { servicesService } from '../../services/services.service';
import type { CreateServiceInput } from '../../types/models';

export function OfrecerView() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Construcción',
    phone: '',
    nit: '',
  });

  const benefits = [
    {
      icon: Users,
      title: 'Alcance local',
      description: 'Llega a miles de clientes potenciales en tu ciudad'
    },
    {
      icon: TrendingUp,
      title: 'Crece tu negocio',
      description: 'Aumenta tus ventas y visibilidad digital'
    },
    {
      icon: CheckCircle,
      title: 'Perfil verificado',
      description: 'Genera confianza con la insignia de verificación'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.price) {
      setError('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const serviceInput: CreateServiceInput = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        providerId: 'current-provider-id', // En producción, usar ID real del usuario
        imageUrl: 'https://via.placeholder.com/400', // Placeholder por ahora
      };

      await servicesService.create(serviceInput);

      setSuccess(true);
      setFormData({
        title: '',
        description: '',
        price: '',
        category: 'Construcción',
        phone: '',
        nit: '',
      });

      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creando servicio');
      console.error('Error creating service:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full pt-4">
      <div className="mx-auto max-w-[1320px]">
        <div className="relative mb-8 overflow-hidden rounded-[24px] border border-slate-200 bg-gradient-to-b from-white to-[#eef2ff] px-6 py-8 shadow-[0_8px_28px_rgba(15,23,42,0.06)] lg:px-10 lg:py-10">
          <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-indigo-200/20 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-indigo-200/20 blur-xl" />
          <div className="relative z-10">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-indigo-700">
              <Building2 className="h-3.5 w-3.5" />
              Para empresas
            </span>
            <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
              <div>
                <h2 className="mb-2 text-[28px] font-bold leading-tight tracking-tight text-slate-900 sm:text-[34px]">
                  Lleva tu empresa al siguiente nivel
                </h2>
                <p className="max-w-xl text-[15px] leading-relaxed text-slate-500">
                  Únete al marketplace más grande de Bolivia y conecta con clientes que necesitan tus servicios
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/80 p-4 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-100/60 hover:shadow-sm">
                  <p className="text-xl font-bold text-slate-900">+32%</p>
                  <p className="text-indigo-600">más visibilidad</p>
                </div>
                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/80 p-4 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-100/60 hover:shadow-sm">
                  <p className="text-xl font-bold text-slate-900">3</p>
                  <p className="text-indigo-600">pasos simple</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="mb-5 text-[20px] font-bold tracking-tight text-slate-900">Beneficios para tu empresa</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="group rounded-[20px] border border-slate-200 bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_12px_32px_rgba(10,108,255,0.10)]">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#0A6CFF]/10 transition-colors duration-300 group-hover:bg-[#0A6CFF]">
                    <Icon className="h-6 w-6 text-[#0A6CFF] transition-colors duration-300 group-hover:text-white" />
                  </div>
                  <h4 className="mb-1 text-[16px] font-bold text-slate-900">{benefit.title}</h4>
                  <p className="text-sm leading-relaxed text-slate-500">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-semibold text-[#1A1A1A]">Registra tu servicio</h3>

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 rounded-lg bg-green-50 p-4 text-green-700">
              ¡Servicio registrado exitosamente!
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#1A1A1A]">
                Nombre del servicio
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Ej: Construcciones Pro S.R.L."
                className="w-full rounded-xl border border-[#e5e5e5] bg-white px-4 py-3 text-[#1A1A1A] placeholder-[#666666] focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#1A1A1A]">
                Tipo de servicio
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-[#e5e5e5] bg-white px-4 py-3 text-[#1A1A1A] focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20"
              >
                <option>Construcción</option>
                <option>Limpieza</option>
                <option>Catering</option>
                <option>Logística</option>
                <option>Tecnología</option>
                <option>Consultoría</option>
                <option>Plomería</option>
                <option>Electricidad</option>
                <option>Fotografía</option>
                <option>Diseño</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#1A1A1A]">
                Descripción de servicios
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe los servicios que ofrece tu empresa..."
                rows={4}
                className="w-full rounded-xl border border-[#e5e5e5] bg-white px-4 py-3 text-[#1A1A1A] placeholder-[#666666] focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20"
              ></textarea>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#1A1A1A]">
                Precio por servicio (Bs.)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="150"
                className="w-full rounded-xl border border-[#e5e5e5] bg-white px-4 py-3 text-[#1A1A1A] placeholder-[#666666] focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#1A1A1A]">
                  NIT (opcional)
                </label>
                <input
                  type="text"
                  name="nit"
                  value={formData.nit}
                  onChange={handleInputChange}
                  placeholder="123456789"
                  className="w-full rounded-xl border border-[#e5e5e5] bg-white px-4 py-3 text-[#1A1A1A] placeholder-[#666666] focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#1A1A1A]">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+591 7XXXXXXX"
                  className="w-full rounded-xl border border-[#e5e5e5] bg-white px-4 py-3 text-[#1A1A1A] placeholder-[#666666] focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#007AFF] px-6 py-3 font-medium text-white transition-colors hover:bg-[#0066DD] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Registrando...' : 'Registrar servicio'}
            </button>
          </div>
        </form>

        <div className="mt-6 rounded-xl border-2 border-[#007AFF]/20 bg-white p-4">
          <p className="text-center text-sm text-[#666666]">
            ¿Ya tienes una cuenta empresarial?{' '}
            <button className="font-medium text-[#007AFF] hover:underline">
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
