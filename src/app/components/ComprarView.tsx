import { Search } from 'lucide-react';
import { ProductCard } from './ProductCard';

export function ComprarView() {
  const products = [
    {
      image: 'https://images.unsplash.com/photo-1569062980724-23e1063d8790?w=400',
      title: 'Ropa de segunda mano - Lote variado',
      price: 'Bs. 120',
      seller: 'María López',
      rating: 4.5,
      reviews: 23,
      location: 'La Paz, Zona Sur',
      badge: 'Nuevo'
    },
    {
      image: 'https://images.unsplash.com/photo-1569062980724-23e1063d8790?w=400',
      title: 'Gafas de sol originales',
      price: 'Bs. 250',
      seller: 'Tienda Sol & Estilo',
      rating: 5,
      reviews: 45,
      location: 'Santa Cruz, Centro',
      badge: 'Verificado'
    },
    {
      image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=400',
      title: 'Productos de hogar y cocina',
      price: 'Bs. 80',
      seller: 'Juan Pérez',
      rating: 4,
      reviews: 12,
      location: 'Cochabamba, Norte'
    },
    {
      image: 'https://images.unsplash.com/photo-1770364795029-20489cdf7b6f?w=400',
      title: 'Bolsos y accesorios artesanales',
      price: 'Bs. 180',
      seller: 'Artesanías Bolivia',
      rating: 4.8,
      reviews: 67,
      location: 'La Paz, Sopocachi'
    }
  ];

  return (
    <div className="w-full">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-8 rounded-[24px] border border-slate-200 bg-white px-4 py-4 shadow-[0_8px_28px_rgba(15,23,42,0.06)] sm:px-5">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Busca productos cerca de ti..."
              className="h-14 w-full rounded-[18px] border-0 bg-transparent pl-12 pr-4 text-[16px] text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-0"
            />
          </div>
        </div>

        <div className="mb-5">
          <h2 className="text-[28px] font-bold tracking-tight text-slate-900">Productos destacados</h2>
          <p className="mt-1 text-[16px] text-slate-500">Encuentra lo que necesitas cerca de ti</p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:gap-6">
          {products.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>
      </div>
    </div>
  );
}
