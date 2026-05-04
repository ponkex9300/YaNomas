import { ShoppingCart, Store, Briefcase, Package } from 'lucide-react';

interface UserTypeSelectorProps {
  selectedType: 'comprar' | 'contratar' | 'vender' | 'ofrecer';
  onSelectType: (type: 'comprar' | 'contratar' | 'vender' | 'ofrecer') => void;
}

export function UserTypeSelector({ selectedType, onSelectType }: UserTypeSelectorProps) {
  const userTypes = [
    {
      id: 'comprar' as const,
      label: 'Comprar',
      description: 'Encuentra productos locales',
      icon: ShoppingCart,
      accent: 'blue'
    },
    {
      id: 'contratar' as const,
      label: 'Contratar',
      description: 'Servicios verificados',
      icon: Briefcase,
      accent: 'amber'
    },
    {
      id: 'vender' as const,
      label: 'Vender',
      description: 'Publica en minutos',
      icon: Package,
      accent: 'emerald'
    },
    {
      id: 'ofrecer' as const,
      label: 'Ofrecer empresa',
      description: 'Perfil empresarial pro',
      icon: Store,
      accent: 'slate'
    }
  ];

  return (
    <div className="w-full">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-6 text-center">
          <h2 className="text-[34px] font-bold tracking-tight text-slate-900 sm:text-[36px]">¿Qué deseas hacer?</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {userTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedType === type.id;

            return (
              <button
                key={type.id}
                onClick={() => onSelectType(type.id)}
                className={`group relative flex min-h-[148px] items-center justify-center overflow-hidden rounded-2xl border px-6 py-5 text-left transition-all duration-300 ${
                  isSelected
                    ? 'border-[#0b74ff] bg-[#edf5ff] shadow-[0_10px_30px_rgba(11,116,255,0.12)]'
                    : 'border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)] hover:border-slate-300 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)]'
                }`}
              >
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-full ${isSelected ? 'bg-[#0b74ff] text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <div>
                    <p className={`text-[18px] font-bold transition-colors duration-300 ${isSelected ? 'text-[#0b74ff]' : 'text-slate-900'}`}>
                      {type.label}
                    </p>
                    <p className="mt-1 text-[15px] font-medium text-slate-600">
                      {type.description}
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-[#0b74ff]/10" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
