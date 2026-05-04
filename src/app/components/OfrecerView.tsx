import { Building2, CheckCircle, TrendingUp, Users } from 'lucide-react';

export function OfrecerView() {
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
          <button className="rounded-xl bg-white px-6 py-3 font-medium text-[#007AFF] transition-transform hover:scale-105">
            Crear perfil empresarial →
          </button>
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

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-semibold text-[#1A1A1A]">Crea tu perfil empresarial</h3>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#1A1A1A]">
                Nombre de la empresa
              </label>
              <input
                type="text"
                placeholder="Ej: Construcciones Pro S.R.L."
                className="w-full rounded-xl border border-[#e5e5e5] bg-white px-4 py-3 text-[#1A1A1A] placeholder-[#666666] focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#1A1A1A]">
                Tipo de servicio
              </label>
              <select className="w-full rounded-xl border border-[#e5e5e5] bg-white px-4 py-3 text-[#1A1A1A] focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20">
                <option>Construcción</option>
                <option>Limpieza</option>
                <option>Catering</option>
                <option>Logística</option>
                <option>Tecnología</option>
                <option>Consultoría</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#1A1A1A]">
                Descripción de servicios
              </label>
              <textarea
                placeholder="Describe los servicios que ofrece tu empresa..."
                rows={4}
                className="w-full rounded-xl border border-[#e5e5e5] bg-white px-4 py-3 text-[#1A1A1A] placeholder-[#666666] focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#1A1A1A]">
                  NIT (opcional)
                </label>
                <input
                  type="text"
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
                  placeholder="+591 7XXXXXXX"
                  className="w-full rounded-xl border border-[#e5e5e5] bg-white px-4 py-3 text-[#1A1A1A] placeholder-[#666666] focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20"
                />
              </div>
            </div>

            <button className="w-full rounded-xl bg-[#007AFF] px-6 py-3 font-medium text-white transition-colors hover:bg-[#0066DD]">
              Registrar empresa
            </button>
          </div>
        </div>

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
