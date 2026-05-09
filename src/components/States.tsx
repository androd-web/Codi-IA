import * as LucideIcons from 'lucide-react';

export const LoadingState = () => {
  return (
    <div className="text-center py-15 fade-in">
      <div className="w-20 h-20 mx-auto mb-6 relative">
        <img src="/assets/img/codi.webp" alt="Loading" className="w-full h-full object-cover rounded-2xl animate-float" />
        <div className="absolute -inset-2.5 border-2 border-transparent border-t-vert rounded-full animate-spin-slow" />
      </div>
      <div className="font-mono text-sm text-vert tracking-[2px] animate-pulse uppercase">
        Analyse en cours...
      </div>
      <div className="text-muted text-sm mt-4">L'IA construit ta feuille de route personnalisée</div>
      <div className="text-muted text-[12px] mt-1.5 opacity-70">Cela peut prendre 30 à 60 secondes</div>
    </div>
  );
};

export const IntroView = ({ onStart }: { onStart: () => void }) => {
  return (
    <div className="text-center fade-in">
      <button onClick={onStart} className="btn btn-primary text-lg px-10 py-4 flex items-center gap-2 mx-auto">
        Commencer le diagnostic <LucideIcons.Play size={18} />
      </button>
    </div>
  );
};
