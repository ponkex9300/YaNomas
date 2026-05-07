import { useState } from 'react';
import { Star, MapPin, Trash2 } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';

interface ProductCardProps {
  image: string;
  title: string;
  price: string;
  seller: string;
  rating: number;
  reviews: number;
  location: string;
  badge?: string;
  onDelete?: () => void;
  deleting?: boolean;
}

export function ProductCard({
  image,
  title,
  price,
  seller,
  rating,
  reviews,
  location,
  badge,
  onDelete,
  deleting,
}: ProductCardProps) {
  const [confirming, setConfirming] = useState(false);

  const handleDeleteClick = () => {
    if (!confirming) { setConfirming(true); return; }
    setConfirming(false);
    onDelete?.();
  };

  return (
    <article className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(15,23,42,0.12)]">
      <div className="relative aspect-[1.9/1] w-full overflow-hidden bg-slate-200">
        <ImageWithFallback
          src={image}
          alt={title}
          className="h-full w-full object-cover"
        />

        {badge && (
          <div className="absolute right-3 top-3 inline-flex items-center rounded-full bg-slate-900/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            {badge}
          </div>
        )}

        {onDelete && (
          <button
            onClick={handleDeleteClick}
            onBlur={() => setConfirming(false)}
            disabled={deleting}
            className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur transition-colors ${
              confirming
                ? 'bg-red-600 text-white'
                : 'bg-slate-900/70 text-white hover:bg-red-600'
            } disabled:opacity-50`}
          >
            <Trash2 className="h-3.5 w-3.5" />
            {deleting ? 'Borrando...' : confirming ? '¿Confirmar?' : 'Borrar'}
          </button>
        )}
      </div>

      <div className="space-y-2 p-4 md:p-5">
        <h3 className="line-clamp-2 text-[17px] font-semibold leading-snug text-slate-900">
          {title}
        </h3>

        <p className="text-[18px] font-semibold text-[#0b74ff]">
          {price}
        </p>

        <div className="flex items-center gap-1.5">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-slate-200 text-slate-200'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-slate-500">({reviews})</span>
        </div>

        <p className="text-[15px] text-slate-700">{seller}</p>

        <div className="flex items-center gap-1 text-[13px] text-slate-500">
          <MapPin className="h-3.5 w-3.5" />
          <span>{location}</span>
        </div>
      </div>
    </article>
  );
}
