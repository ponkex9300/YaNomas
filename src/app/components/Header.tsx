import { ShoppingBag, User } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 px-4 py-3 shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur-md">
      <div className="mx-auto flex max-w-[1320px] items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0b74ff] shadow-[0_10px_24px_rgba(11,116,255,0.28)]">
            <ShoppingBag className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">YaNomas</h1>
            <p className="text-[13px] leading-none text-slate-500">Todo en una plataforma</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-[#f7f8fc] text-slate-700 transition-colors hover:bg-white hover:shadow-sm" aria-label="Abrir perfil">
            <User className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
