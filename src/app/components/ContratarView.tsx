import { useEffect, useState } from 'react';
import { Search, Wrench, Zap, Building2, Sparkles, Camera, Palette, ChefHat, Truck } from 'lucide-react';
import { ServiceCard } from './ServiceCard';
import { servicesService } from '../../services/services.service';
import type { Service } from '../../types/models';

const categoryStyles: Record<string, { icon: typeof Wrench; color: string; activeColor: string }> = {
  'Plomería':     { icon: Wrench,      color: '#06b6d4', activeColor: '#0891b2' },
  'Electricidad': { icon: Zap,         color: '#eab308', activeColor: '#ca8a04' },
  'Construcción': { icon: Building2,   color: '#f97316', activeColor: '#ea580c' },
  'Limpieza':     { icon: Sparkles,    color: '#0ea5e9', activeColor: '#0284c7' },
  'Fotografía':   { icon: Camera,      color: '#ec4899', activeColor: '#db2777' },
  'Diseño':       { icon: Palette,     color: '#a855f7', activeColor: '#9333ea' },
  'Catering':     { icon: ChefHat,     color: '#22c55e', activeColor: '#16a34a' },
  'Logística':    { icon: Truck,       color: '#6366f1', activeColor: '#4f46e5' },
};

export function ContratarView() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    'Plomería',
    'Electricidad',
    'Construcción',
    'Limpieza',
    'Fotografía',
    'Diseño',
    'Catering',
    'Logística'
  ];

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await servicesService.getAll();
      setServices(response.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando servicios');
      console.error('Error loading services:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter(service =>
    (service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!selectedCategory || service.category === selectedCategory)
  );

  return (
    <div className="w-full pt-4">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-8">
          <h2 className="text-[28px] font-bold tracking-tight text-slate-900">Contrata profesionales</h2>
          <p className="mt-1 text-[16px] text-slate-500">Los mejores servicios verificados en tu ciudad</p>
        </div>

        <div className="mb-8 flex items-center gap-3 rounded-[24px] border border-slate-200 bg-white px-5 py-1 shadow-[0_8px_28px_rgba(15,23,42,0.06)]">
          <Search className="h-5 w-5 flex-shrink-0 text-slate-400" />
          <input
            type="text"
            placeholder="¿Qué servicio necesitas?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-14 flex-1 border-0 bg-transparent text-[16px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
          />
        </div>

        <div className="mb-8">
          <h3 className="text-[20px] font-bold tracking-tight text-slate-900">Categorías populares</h3>
          <div className="flex flex-wrap gap-4">
            {categories.map((category) => {
              const isActive = selectedCategory === category;
              const style = categoryStyles[category];
              const Icon = style.icon;

              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(isActive ? null : category)}
                  className="group flex items-center gap-3 rounded-[20px] border-2 px-5 py-3 text-sm font-bold shadow-sm transition-all duration-200 active:scale-95"
                  style={{
                    backgroundColor: isActive ? style.activeColor : '#ffffff',
                    borderColor: isActive ? style.activeColor : '#e2e8f0',
                    color: isActive ? '#ffffff' : '#475569',
                    transform: isActive ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: isActive
                      ? `0 4px 14px ${style.color}40`
                      : '0 1px 3px rgba(0,0,0,0.06)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = `${style.color}15`;
                      e.currentTarget.style.borderColor = style.color;
                      e.currentTarget.style.color = style.color;
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = '#ffffff';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.color = '#475569';
                      e.currentTarget.style.transform = 'scale(1)';
                    }
                  }}
                >
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-xl shadow-sm transition-transform duration-200 group-hover:scale-110"
                    style={{ backgroundColor: isActive ? '#ffffff33' : '#ffffff' }}
                  >
                    <Icon className="h-[18px] w-[18px]" style={{ color: isActive ? '#ffffff' : style.color }} />
                  </span>
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
            {error}
            <button 
              onClick={loadServices}
              className="ml-2 font-semibold underline hover:no-underline"
            >
              Reintentar
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-slate-500">Cargando servicios...</div>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-slate-500">
              {searchTerm || selectedCategory ? 'No se encontraron servicios' : 'No hay servicios disponibles'}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-12">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                image={service.imageUrl || 'https://via.placeholder.com/400'}
                name={service.title}
                service={service.description}
                rating={4.5}
                reviews={0}
                location="Bolivia"
                verified={false}
                priceRange={`Bs. ${service.price}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
