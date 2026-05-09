import * as LucideIcons from 'lucide-react';

interface ResultViewProps {
  markdown: string;
  onDownload: () => void;
  onRestart: () => void;
}

export const ResultView = ({ markdown, onDownload, onRestart }: ResultViewProps) => {
  const html = markdownToHtml(markdown);

  return (
    <div className="fade-in">
      <div className="text-center mb-10">
        <div className="inline-block bg-vert/10 border border-vert text-vert font-mono text-[11px] tracking-[2px] px-3 py-1 mb-4">
          <LucideIcons.CheckCircle size={12} className="inline mr-1 -mt-0.5" /> DIAGNOSTIC COMPLET
        </div>
        <h2 className="text-foreground text-[clamp(22px,4vw,36px)] font-bold mt-3">
          Ta feuille de route personnalisée
        </h2>
        <p className="text-muted text-sm mt-2">Basée sur tes réponses · Contexte camerounais</p>
      </div>

      <div 
        className="bg-surface border border-muted rounded-sm p-9 leading-relaxed text-sm text-foreground md-rendered whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <div className="flex gap-3 mt-7 flex-wrap">
        <button 
          className="bg-surface border border-[#7fff6e] text-[#7fff6e] font-sans font-bold text-[13px] py-2.5 px-5 rounded-sm cursor-pointer transition-all hover:bg-[#7fff6e]/10 flex items-center gap-2"
          onClick={onDownload}
        >
          <LucideIcons.Download size={16} /> Télécharger (txt)
        </button>
        <button 
          className="btn-restart border border-muted text-muted font-sans text-[13px] py-2.5 px-5 rounded-sm cursor-pointer transition-all hover:border-foreground hover:text-foreground flex items-center gap-2"
          onClick={onRestart}
        >
          <LucideIcons.RefreshCw size={16} /> Refaire le diagnostic
        </button>
      </div>
    </div>
  );
};

function markdownToHtml(md: string) {
  return md
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/^---$/gm, '<hr>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^\| (.+) \|$/gm, (match) => {
      const cells = match.slice(2,-2).split(' | ');
      return '<tr>' + cells.map(c => `<td>${c.trim()}</td>`).join('') + '</tr>';
    })
    .replace(/(<tr>.*<\/tr>\n?)+/gs, (table) => `<table>${table}</table>`)
    .replace(/^\s*[-*] (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/gs, (list) => `<ul>${list}</ul>`)
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hpuolbtc])/gm, '')
    .replace(/<p><\/p>/g, '');
}
