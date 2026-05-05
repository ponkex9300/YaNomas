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
    <div className="w-full bg-[#f5f5f5] px-4 py-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 overflow-hidden rounded-xl bg-gradient-to-br from-[#007AFF] to-[#0066DD] p-8 text-white shadow-lg">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
            <Building2 className="h-8 w-8" />
          </div>
          <h2 className="mb-2 text-2xl font-semibold">Lleva tu empresa al siguiente nivel</h2>
          <p className="mb-6 text-white/90">
            Únete al marketplace más grande de Bolivia y conecta con clientes que necesitan tus servicios
          </p>
        </div>

        <div className="mb-6">
          <h3 className="mb-4 font-semibold text-[#1A1A1A]">Beneficios para tu empresa</h3>
          <div className="grid gap-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="flex gap-4 rounded-xl bg-white p-4 shadow-sm">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#007AFF]/10">
                    <Icon className="h-6 w-6 text-[#007AFF]" />
                  </div>
                  <div>
                    <h4 className="mb-1 font-medium text-[#1A1A1A]">{benefit.title}</h4>
                    <p className="text-sm text-[#666666]">{benefit.description}</p>
                  </div>
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
