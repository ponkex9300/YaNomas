import { Search, MapPin, Briefcase } from 'lucide-react';
import { ServiceCard } from './ServiceCard';

export function ContratarView() {
  const services = [
    {
      image: 'https://images.unsplash.com/photo-1622426385889-4fc93a72423a?w=400',
      name: 'Carlos Rojas',
      service: 'Plomero certificado',
      rating: 5,
      reviews: 89,
      location: 'La Paz, Toda la ciudad',
      verified: true,
      priceRange: 'Bs. 150 - 300/servicio'
    },
    {
      image: 'https://images.unsplash.com/photo-1659353591742-9fa64d94738e?w=400',
      name: 'Construcciones Pro',
      service: 'Empresa de construcción',
      rating: 4.8,
      reviews: 124,
      location: 'Santa Cruz',
      verified: true,
      priceRange: 'Presupuesto personalizado'
    },
    {
      image: 'https://images.unsplash.com/photo-1659353591752-2208c607a79f?w=400',
      name: 'Jorge Mamani',
      service: 'Electricista residencial',
      rating: 4.7,
      reviews: 56,
      location: 'La Paz, Zona Sur',
      verified: false,
      priceRange: 'Bs. 100 - 250/servicio'
    },
    {
      image: 'https://images.unsplash.com/photo-1659353591753-dac60f2f7896?w=400',
      name: 'Limpieza Total',
      service: 'Servicio de limpieza profesional',
      rating: 4.9,
      reviews: 203,
      location: 'Cochabamba',
      verified: true,
      priceRange: 'Bs. 200 - 500/día'
    }
  ];

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
                className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-slate-600" />
            <select className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-all hover:border-slate-400">
              <option>Todas las ciudades</option>
              <option>La Paz</option>
              <option>Santa Cruz</option>
              <option>Cochabamba</option>
            </select>
          </div>
          <select className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-all hover:border-slate-400">
            <option>Más valorados</option>
            <option>Más reseñas</option>
            <option>Precio: menor a mayor</option>
            <option>Precio: mayor a menor</option>
            <option>Más recientes</option>
          </select>
        </div>

        {/* Encabezado de resultados */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-blue-600" />
            <p className="text-sm font-medium text-slate-600">
              Mostrando <span className="font-bold text-slate-900">{services.length}</span> profesionales
            </p>
          </div>
        </div>

        {/* Grid de servicios */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <button className="btn-primary">
            Ver más profesionales
          </button>
        </div>
      </div>
    </div>
  );
}
