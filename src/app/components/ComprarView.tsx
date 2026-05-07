import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { productsService } from '../../services/products.service';
import type { Product } from '../../types/models';

export function ComprarView() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productsService.getAll();
      const raw = response as any;
      const items: Product[] = raw?.data?.items ?? raw?.items ?? raw?.data ?? [];

      // Workaround: inyectar imágenes guardadas en localStorage mientras el Lambda no las devuelve
      let localImages: Record<string, string> = {};
      try {
        localImages = JSON.parse(localStorage.getItem('yanomas_images') || '{}');
      } catch { /* ignore */ }

      const enriched = items.map((p) =>
        localImages[p.id]
          ? { ...p, imageUrl: p.imageUrl || p.images?.[0] || localImages[p.id] }
          : p
      );

      setProducts(enriched);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando productos');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await productsService.delete(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      // Limpiar imagen del localStorage
      try {
        const stored = JSON.parse(localStorage.getItem('yanomas_images') || '{}');
        delete stored[id];
        localStorage.setItem('yanomas_images', JSON.stringify(stored));
      } catch { /* ignore */ }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al borrar el producto');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-8 rounded-[24px] border border-slate-200 bg-white px-4 py-4 shadow-[0_8px_28px_rgba(15,23,42,0.06)] sm:px-5">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Busca productos cerca de ti..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-14 w-full rounded-[18px] border-0 bg-transparent pl-12 pr-4 text-[16px] text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-0"
            />
          </div>
        </div>

        <div className="mb-5">
          <h2 className="text-[28px] font-bold tracking-tight text-slate-900">Productos destacados</h2>
          <p className="mt-1 text-[16px] text-slate-500">
            {loading ? 'Cargando productos...' : `Encontrados ${filteredProducts.length} productos`}
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
            {error}
            <button 
              onClick={loadProducts}
              className="ml-2 font-semibold underline hover:no-underline"
            >
              Reintentar
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-slate-600">Cargando productos...</div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-slate-600">
              {searchTerm ? 'No se encontraron productos con esa búsqueda' : 'No hay productos disponibles'}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id}
                image={product.imageUrl || product.images?.[0] || 'https://via.placeholder.com/400'}
                title={product.title}
                price={`Bs. ${product.price}`}
                seller={product.sellerId}
                rating={4.5}
                reviews={0}
                location="Bolivia"
                badge="Nuevo"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
