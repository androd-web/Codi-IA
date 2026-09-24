import React from 'react';

interface LoadingScreenProps {
  message?: string;
  subMessage?: string;
  fullscreen?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "Analyse en cours...", 
  subMessage = "Codi IA construit votre feuille de route personnalisée",
  fullscreen = false
}) => {
  const containerClasses = fullscreen 
    ? "fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center p-6 text-center"
    : "flex flex-col items-center justify-center py-16 px-4 text-center fade-in";

  return (
    <div className={containerClasses}>
      <div className="relative mb-12">
        {/* Pulse rings */}
        <div className="absolute inset-0 rounded-full bg-vert/20 animate-pulse-ring" />
        <div className="absolute inset-0 rounded-full bg-vert/10 animate-pulse-ring [animation-delay:0.5s]" />
        
        {/* Avatar Container */}
        <div className="relative w-32 h-32 md:w-40 md:h-40 bg-surface border-4 border-vert/30 rounded-full p-2 overflow-hidden shadow-[0_0_30px_rgba(18,160,0,0.3)]">
          <img 
            src="/assets/img/codi.webp" 
            alt="Codi AI" 
            className="w-full h-full object-cover rounded-full animate-salute"
          />
        </div>

        {/* Floating elements or status indicator */}
        <div className="absolute -bottom-2 -right-2 bg-vert text-background text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter animate-bounce">
          IA Active
        </div>
      </div>

      <div className="space-y-4 max-w-md mx-auto">
        <h2 className="font-mono text-xl md:text-2xl text-vert tracking-[4px] uppercase animate-pulse">
          {message}
        </h2>
        
        <p className="text-foreground/80 text-base md:text-lg leading-relaxed">
          {subMessage}
        </p>

        <div className="flex items-center justify-center gap-1.5 pt-4">
          <div className="w-1.5 h-1.5 bg-vert rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-1.5 h-1.5 bg-vert rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-1.5 h-1.5 bg-vert rounded-full animate-bounce" />
        </div>
        
        {fullscreen && (
           <div className="absolute bottom-10 left-0 right-0 font-mono text-[14px] text-muted tracking-widest uppercase opacity-40">
             Codi IA v2.0 · Propulsion par Apex
           </div>
        )}
        
        {!fullscreen && (
          <p className="text-muted text-xs mt-6 opacity-60 italic">
            Cette opération prend généralement 30 à 60 secondes
          </p>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;
