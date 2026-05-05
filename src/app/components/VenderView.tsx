import { useState } from 'react';
import { Camera, Package, DollarSign, MapPin, Upload, Sparkles, TrendingUp, CheckCircle2 } from 'lucide-react';
import { productsService } from '../../services/products.service';
import type { CreateProductInput } from '../../types/models';

export function VenderView() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Electrónica',
    location: '',
    images: [] as File[],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files].slice(0, 3)
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
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

      const productInput: CreateProductInput = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        location: formData.location,
        sellerId: 'current-user-id', // En producción, usar ID real del usuario
        images: formData.images,
      };

      await productsService.create(productInput);
      
      setSuccess(true);
      setFormData({
        title: '',
        description: '',
        price: '',
        category: 'Electrónica',
        location: '',
        images: [],
      });

      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creando producto');
      console.error('Error creating product:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-4 py-8 lg:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-slate-900 px-6 py-8 text-white shadow-xl">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-100 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                Modo vendedor profesional
              </span>
              <h2 className="mb-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Publica rápido, con mejor presencia y más conversiones.
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-emerald-50/90 sm:text-base">
                Conecta con los mejores compradores en la plataforma de manera fácil y rápida.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-2xl bg-white/10 p-4 text-center backdrop-blur">
                <TrendingUp className="mx-auto mb-2 h-5 w-5 text-white" />
                <p className="font-bold text-white">+32%</p>
                <p className="text-emerald-100">visibilidad</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4 text-center backdrop-blur">
                <Package className="mx-auto mb-2 h-5 w-5 text-white" />
                <p className="font-bold text-white">3 pasos</p>
                <p className="text-emerald-100">publicación</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4 text-center backdrop-blur">
                <CheckCircle2 className="mx-auto mb-2 h-5 w-5 text-white" />
                <p className="font-bold text-white">Simple</p>
                <p className="text-emerald-100">y rápido</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
            <h3 className="mb-4 text-xl font-bold text-slate-900">Crear nueva publicación</h3>
            
            {error && (
              <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 rounded-lg bg-green-50 p-4 text-green-700">
                ¡Producto publicado exitosamente!
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#1A1A1A]">
                  Fotos del producto (máx. 3)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <label className="flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-emerald-500 bg-emerald-50 text-emerald-700 transition-colors hover:bg-emerald-100 cursor-pointer">
                    <Camera className="h-6 w-6" />
                    <span className="text-xs">Agregar</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  {formData.images.map((image, idx) => (
                    <div key={idx} className="relative aspect-square rounded-2xl bg-slate-200 overflow-hidden">
                      <img
                        src={URL.createObjectURL(image)}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#1A1A1A]">
                  Título del producto
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Ej: iPhone 12 Pro en excelente estado"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#1A1A1A]">
                  Descripción
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe tu producto, estado, características..."
                  rows={4}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#1A1A1A]">
                    Precio (Bs.)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#666666]" />
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="150"
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-10 pr-4 text-slate-900 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#1A1A1A]">
                    Categoría
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option>Electrónica</option>
                    <option>Ropa</option>
                    <option>Hogar</option>
                    <option>Deportes</option>
                    <option>Libros</option>
                    <option>Otros</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#1A1A1A]">
                  Ubicación
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#666666]" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="La Paz, Zona Sur"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-10 pr-4 text-slate-900 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 font-semibold text-white shadow-md transition-all hover:from-emerald-700 hover:to-teal-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="h-5 w-5" />
                {loading ? 'Publicando...' : 'Publicar producto'}
              </button>
            </div>
          </form>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h4 className="mb-3 text-lg font-bold text-slate-900">Consejos para vender más</h4>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex gap-3"><CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" /> Usa fotos claras y de buena calidad.</li>
                <li className="flex gap-3"><CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" /> Describe el estado y beneficios con claridad.</li>
                <li className="flex gap-3"><CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" /> Define un precio competitivo desde el inicio.</li>
                <li className="flex gap-3"><CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" /> Responde rápido para no perder interesados.</li>
              </ul>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-slate-950 to-slate-800 p-6 text-white shadow-xl">
              <h4 className="mb-2 text-lg font-bold">Vista previa de anuncio</h4>
              <div className="mt-4 rounded-2xl bg-white/10 p-4 backdrop-blur">
                <div className="mb-3 aspect-[4/3] rounded-xl bg-white/10" />
                <p className="text-sm font-semibold text-white">{formData.title || 'Producto destacado'}</p>
                <p className="text-xs text-slate-300">{formData.category} · Bs. {formData.price || '0'}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
