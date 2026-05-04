import { Star, MapPin, Verified, MessageCircle } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';

interface ServiceCardProps {
  image: string;
  name: string;
  service: string;
  rating: number;
  reviews: number;
  location: string;
  verified?: boolean;
  priceRange: string;
}

export function ServiceCard({
  image,
  name,
  service,
  rating,
  reviews,
  location,
  verified,
  priceRange
}: ServiceCardProps) {
  return (
    <div className="group overflow-hidden rounded-2xl card hover:shadow-xl transition-all duration-300">
      {/* Imagen */}
      <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300">
        <ImageWithFallback
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Badge de verificado */}
        {verified && (
          <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-1 text-xs font-bold text-white shadow-md">
            <Verified className="h-3 w-3" />
            Verificado
          </div>
        )}
        
        {/* Botón flotante */}
        <div className="absolute bottom-3 right-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white transition-all hover:bg-blue-700 shadow-md hover:shadow-lg hover:scale-110">
            <MessageCircle className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4">
        {/* Nombre y verificado */}
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="mb-1 flex items-center gap-2">
              <h3 className="font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                {name}
              </h3>
            </div>
            <p className="text-sm text-slate-600 truncate">{service}</p>
          </div>
        </div>

        {/* Rating */}
        <div className="mb-3 flex items-center gap-2">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 transition-colors ${
                  i < Math.floor(rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-slate-200 text-slate-200'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-medium text-slate-600">({reviews})</span>
        </div>

        {/* Precio y ubicación */}
        <div className="space-y-2">
          <p className="text-sm font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
            {priceRange}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
