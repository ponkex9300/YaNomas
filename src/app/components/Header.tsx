import { ShoppingBag, User } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-indigo-100/60 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-[1320px] items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#0b74ff] to-[#4361ee] shadow-lg shadow-blue-500/25">
            <ShoppingBag className="h-6 w-6 text-white drop-shadow-sm" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              YaNomas
              <span className="ml-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-blue-500">Beta</span>
            </h1>
            <p className="text-[12px] leading-none text-slate-400">Todo en una plataforma</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md active:scale-95" aria-label="Abrir perfil">
            <User className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
