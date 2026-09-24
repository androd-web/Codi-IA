import * as LucideIcons from 'lucide-react';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Header = ({ theme, toggleTheme }: HeaderProps) => {
  return (
    <header className="flex flex-col items-center text-center mb-14 relative slide-in-top">
      <button 
        onClick={toggleTheme} 
        className="absolute -top-5 right-0 bg-surface border border-muted w-11 h-11 rounded-full flex items-center justify-center cursor-pointer transition-all hover:border-vert hover:scale-110 text-foreground hover:text-vert z-10"
        title="Changer de thème"
      >
        {theme === 'light' ? <LucideIcons.Moon size={20} /> : <LucideIcons.Sun size={20} />}
      </button>

      <div className="w-[100px] h-[100px] mb-6 rounded-3xl overflow-hidden shadow-2xl border border-muted">
        <img src="/assets/img/codi.webp" alt="Codi IA" className="w-full h-full object-cover" />
      </div>

      <div className="mb-5">
        <div className="inline-block text-[11px] tracking-[2px] border border-vert px-3 py-1 uppercase text-vert ">
          Codi IA | By Apex
        </div>
      </div>

      <h1 className="text-[clamp(28px,5vw,48px)] font-extrabold text-foreground leading-[1.1] mb-4">
        Diagnostic <span className="text-vert">Compétences</span><br />Numériques
      </h1> 
      <p className="text-muted text-sm md:text-base max-w-[520px] mx-auto leading-relaxed">
        Réponds à 8 questions. Codi IA génère ta feuille de route personnalisée vers les transformations numériques au Cameroun.
      </p>
    </header>
  );
};
