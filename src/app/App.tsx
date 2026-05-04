import { useState } from 'react';
import { Header } from './components/Header';
import { UserTypeSelector } from './components/UserTypeSelector';
import { ComprarView } from './components/ComprarView';
import { ContratarView } from './components/ContratarView';
import { VenderView } from './components/VenderView';
import { OfrecerView } from './components/OfrecerView';

export default function App() {
  const [selectedType, setSelectedType] = useState<'comprar' | 'contratar' | 'vender' | 'ofrecer'>('comprar');

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-slate-900">
      <Header />
      <main className="mx-auto flex w-full max-w-[1320px] flex-col gap-8 px-4 pb-10 pt-5 sm:px-6 lg:px-8">
        <section className="pt-2 sm:pt-4">
          <UserTypeSelector selectedType={selectedType} onSelectType={setSelectedType} />
        </section>

        <section>
          {selectedType === 'comprar' && <ComprarView />}
          {selectedType === 'contratar' && <ContratarView />}
          {selectedType === 'vender' && <VenderView />}
          {selectedType === 'ofrecer' && <OfrecerView />}
        </section>
      </main>
    </div>
  );
}
