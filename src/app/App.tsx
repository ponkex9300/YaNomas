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
    <div className="min-h-screen bg-gradient-to-b from-[#f0f4ff] via-[#f6f7fb] to-[#f0f4ff] text-slate-900">
      <Header />
      <main className="mx-auto flex w-full max-w-[1320px] flex-col px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <div className="mb-16">
          <UserTypeSelector selectedType={selectedType} onSelectType={setSelectedType} />
        </div>
        <div>
          {selectedType === 'comprar' && <ComprarView />}
          {selectedType === 'contratar' && <ContratarView />}
          {selectedType === 'vender' && <VenderView />}
          {selectedType === 'ofrecer' && <OfrecerView />}
        </div>
      </main>
    </div>
  );
}
