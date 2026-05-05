/**
 * Componente de ejemplo: VenderView mejorado con integración AWS
 * Reemplazar el archivo actual: src/app/components/VenderView.tsx
 */

import { Camera, Package, DollarSign, MapPin, Upload, Sparkles, TrendingUp, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { productsService } from '@/services';
import type { CreateProductInput } from '@/types/models';

export function VenderView() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Electrónica',
    location: '',
  });

  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages([...images, ...files].slice(0, 3)); // Máximo 3 imágenes
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validaciones
      if (!formData.title.trim()) throw new Error('El título es requerido');
      if (!formData.description.trim()) throw new Error('La descripción es requerida');
      if (!formData.price) throw new Error('El precio es requerido');
      if (!formData.location.trim()) throw new Error('La ubicación es requerida');
      if (images.length === 0) throw new Error('Debes agregar al menos una imagen');

      // Crear producto
      const input: CreateProductInput = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        location: formData.location,
        images,
        sellerId: 'user-id', // TODO: Obtener del contexto de autenticación
      };

      await productsService.create(input);

      // Limpiar formulario
      setFormData({
        title: '',
        description: '',
        price: '',
        category: 'Electrónica',
        location: '',
      });
      setImages([]);
      setSuccess(true);

      // Mostrar mensaje de éxito
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message || 'Error al publicar el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-4 py-8 lg:py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
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
                Completa el formulario, sube fotos claras y tu producto será visible para miles de compradores.
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
                <p className="font-bold text-white">5 min</p>
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

        {/* Messages */}
        {error && (
          <div className="mb-6 flex gap-3 rounded-lg bg-red-50 p-4 text-red-700">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 flex gap-3 rounded-lg bg-emerald-50 p-4 text-emerald-700">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">¡Éxito!</p>
              <p className="text-sm">Tu producto ha sido publicado correctamente.</p>
            </div>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Form */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
            <h3 className="mb-4 text-xl font-bold text-slate-900">Crear nueva publicación</h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Imágenes */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">
                  Fotos del producto
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {/* Upload Button */}
                  <label className="flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-emerald-500 bg-emerald-50 text-emerald-700 transition-colors hover:bg-emerald-100 cursor-pointer">
                    <Camera className="h-6 w-6" />
                    <span className="text-xs">Agregar</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={images.length >= 3}
                      className="hidden"
                    />
                  </label>

                  {/* Uploaded Images */}
                  {images.map((img, i) => (
                    <div
                      key={i}
                      className="relative aspect-square rounded-2xl bg-slate-200 overflow-hidden"
                    >
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`Preview ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity"
                      >
                        <span className="text-white text-sm">Eliminar</span>
                      </button>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-xs text-slate-500">{images.length}/3 imágenes</p>
              </div>

              {/* Título */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">
                  Título del producto
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Ej: iPhone 12 Pro en excelente estado"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  required
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">
                  Descripción
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe tu producto, estado, características..."
                  rows={4}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  required
                />
              </div>

              {/* Precio y Categoría */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-900">
                    Precio (Bs.)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="150"
                      step="0.01"
                      min="0"
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-10 pr-4 text-slate-900 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-900">
                    Categoría
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    required
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

              {/* Ubicación */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">
                  Ubicación
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="La Paz, Zona Sur"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-10 pr-4 text-slate-900 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 font-semibold text-white shadow-md transition-all hover:from-emerald-700 hover:to-teal-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Publicando...
                  </>
                ) : (
                  <>
                    <Upload className="h-5 w-5" />
                    Publicar producto
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h4 className="mb-3 text-lg font-bold text-slate-900">Consejos para vender más</h4>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600 flex-shrink-0" />
                  Usa fotos claras y de buena calidad.
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600 flex-shrink-0" />
                  Describe el estado y beneficios con claridad.
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600 flex-shrink-0" />
                  Define un precio competitivo desde el inicio.
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600 flex-shrink-0" />
                  Responde rápido para no perder interesados.
                </li>
              </ul>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-slate-950 to-slate-800 p-6 text-white shadow-xl">
              <h4 className="mb-2 text-lg font-bold">Vista previa de anuncio</h4>
              <div className="mt-4 rounded-2xl bg-white/10 p-4 backdrop-blur">
                <div className="mb-3 aspect-[4/3] rounded-xl bg-white/10" />
                <p className="text-sm font-semibold text-white">
                  {formData.title || 'Tu título aquí'}
                </p>
                <p className="text-xs text-slate-300">
                  {formData.price && `Bs. ${formData.price}`}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
