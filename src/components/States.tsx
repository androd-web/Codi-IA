import * as LucideIcons from 'lucide-react';

export const IntroView = ({ onStart }: { onStart: () => void }) => {
  return (
    <div className="text-center fade-in">
      <button onClick={onStart} className="btn btn-primary text-lg px-10 py-4 flex items-center gap-2 mx-auto">
        Commencer le diagnostic <LucideIcons.Play size={18} />
      </button>
    </div>
  );
};
