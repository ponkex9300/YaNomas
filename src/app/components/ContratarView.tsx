import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { ServiceCard } from './ServiceCard';
import { servicesService } from '../../services/services.service';
import type { Service } from '../../types/models';

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
    <div className="w-full px-4 py-8">
      <div className="mx-auto max-w-6xl">
        {/* Encabezado */}
        <div className="mb-8">
          <h2 className="mb-2 text-2xl font-bold text-slate-900">Contrata profesionales</h2>
          <p className="text-slate-600">Los mejores servicios verificados en tu ciudad</p>
        </div>

        {/* Barra de búsqueda */}
        <div className="mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="¿Qué servicio necesitas?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-12 pr-4 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>

        {/* Categorías */}
        <div className="mb-8">
          <h3 className="mb-4 text-lg font-bold text-slate-900">Categorías populares</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                className={`rounded-xl border transition-all px-3 py-2.5 text-sm font-medium ${
                  selectedCategory === category
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'border-slate-300 bg-white text-slate-700 hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
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

        {/* Servicios */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-slate-600">Cargando servicios...</div>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-slate-600">
              {searchTerm || selectedCategory ? 'No se encontraron servicios' : 'No hay servicios disponibles'}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                image={service.imageUrl || 'https://via.placeholder.com/400'}
                name={service.providerId}
                service={service.title}
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
