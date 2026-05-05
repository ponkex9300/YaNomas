/**
 * Componente de ejemplo: ComprarView mejorado con datos reales de AWS
 * Reemplazar el archivo actual: src/app/components/ComprarView.tsx
 */

import { Search, Loader2 } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { useProducts } from '@/hooks/useApi';
import { useState } from 'react';

export function ComprarView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);

  // Cargar productos desde AWS
  const { data, loading, error } = useProducts(page, 20, {
    ...(category && { category }),
    ...(searchQuery && { q: searchQuery }),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reiniciar a página 1 en búsqueda
  };

  return (
    <div className="w-full">
      <div className="mx-auto max-w-[1320px]">
        {/* Search Bar */}
        <form onSubmit={handleSearch}>
          <div className="mb-8 rounded-[24px] border border-slate-200 bg-white px-4 py-4 shadow-[0_8px_28px_rgba(15,23,42,0.06)] sm:px-5">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Busca productos cerca de ti..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 w-full rounded-[18px] border-0 bg-transparent pl-12 pr-4 text-[16px] text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-0"
              />
            </div>
          </div>
        </form>

        {/* Filters */}
        <div className="mb-8 flex gap-4">
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900"
          >
            <option value="">Todas las categorías</option>
            <option value="Electrónica">Electrónica</option>
            <option value="Ropa">Ropa</option>
            <option value="Hogar">Hogar</option>
            <option value="Deportes">Deportes</option>
          </select>
        </div>

        {/* Header */}
        <div className="mb-5">
          <h2 className="text-[28px] font-bold tracking-tight text-slate-900">
            Productos destacados
          </h2>
          <p className="mt-1 text-[16px] text-slate-500">
            {data?.total || 0} resultados encontrados
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-8 rounded-lg bg-red-50 p-4 text-red-700">
            <p className="font-semibold">Error al cargar productos</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && data && (
          <>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:gap-6">
              {data.items.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>

            {/* Pagination */}
            {data.hasMore || page > 1 && (
              <div className="mt-8 flex justify-center gap-4">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 disabled:opacity-50"
                >
                  Anterior
                </button>
                <span className="flex items-center px-4 text-slate-600">
                  Página {page}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={!data.hasMore}
                  className="rounded-lg border border-emerald-600 bg-emerald-600 px-4 py-2 text-white disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && !error && data?.items.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-slate-600">No hay productos que coincidan con tu búsqueda</p>
          </div>
        )}
      </div>
    </div>
  );
}
