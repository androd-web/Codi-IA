import * as LucideIcons from 'lucide-react';
import { jsPDF } from "jspdf";

interface ResultViewProps {
  markdown: string;
  onRestart: () => void;
}

export const ResultView = ({ markdown, onRestart }: ResultViewProps) => {
  const html = markdownToHtml(markdown);

  const downloadPdf = () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 18;
    const contentWidth = pageWidth - margin * 2;
    const bottomLimit = pageHeight - 20;
    const ink: [number, number, number] = [43, 39, 38];
    const muted: [number, number, number] = [111, 103, 100];
    const accent: [number, number, number] = [186, 55, 43];
    const paleAccent: [number, number, number] = [250, 241, 238];
    let y = 0;

    const drawPageHeader = () => {
      doc.setFillColor(...accent);
      doc.rect(margin, 12, 9, 2, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(...ink);
      doc.text("CODI IA", margin, 19);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...muted);
      doc.text("FEUILLE DE ROUTE PERSONNALISÉE", pageWidth - margin, 19, {
        align: "right",
      });
      doc.setDrawColor(225, 218, 215);
      doc.setLineWidth(0.3);
      doc.line(margin, 23, pageWidth - margin, 23);
    };

    const addPage = () => {
      doc.addPage();
      drawPageHeader();
      y = 31;
    };

    const ensureSpace = (height: number) => {
      if (y + height > bottomLimit) addPage();
    };

    const cleanInlineMarkdown = (text: string) =>
      text
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)")
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/__(.*?)__/g, "$1")
        .replace(/[*_`]([^*_`]+)[*_`]/g, "$1")
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201C\u201D]/g, '"')
        .replace(/[\u2013\u2014]/g, "-")
        .replace(/\u00A0/g, " ")
        .trim();

    const writeText = (
      text: string,
      options: {
        fontSize: number;
        style: "normal" | "bold" | "italic";
        color: [number, number, number];
        x?: number;
        width?: number;
        lineHeight?: number;
        after?: number;
      },
    ) => {
      const x = options.x ?? margin;
      const lines = doc.splitTextToSize(
        cleanInlineMarkdown(text),
        options.width ?? contentWidth,
      ) as string[];
      const lineHeight = options.lineHeight ?? 4.8;
      doc.setFont("helvetica", options.style);
      doc.setFontSize(options.fontSize);
      doc.setTextColor(...options.color);
      for (const line of lines) {
        ensureSpace(lineHeight);
        doc.text(line, x, y);
        y += lineHeight;
      }
      y += options.after ?? 0;
    };

    const parseTableRow = (line: string) =>
      line
        .trim()
        .replace(/^\|/, "")
        .replace(/\|$/, "")
        .split("|")
        .map((cell) => cleanInlineMarkdown(cell));

    const drawTable = (rows: string[][]) => {
      const columnCount = Math.max(...rows.map((row) => row.length));
      const columnWidth = contentWidth / columnCount;
      rows.forEach((row, rowIndex) => {
        const isHeader = rowIndex === 0;
        const cells = Array.from({ length: columnCount }, (_, index) => row[index] ?? "");
        doc.setFont("helvetica", isHeader ? "bold" : "normal");
        doc.setFontSize(7.5);
        const wrappedCells = cells.map((cell) =>
          doc.splitTextToSize(cell, columnWidth - 4) as string[],
        );
        const rowHeight = Math.max(7, ...wrappedCells.map((cell) => cell.length * 3.7 + 3));
        ensureSpace(rowHeight);

        cells.forEach((_, columnIndex) => {
          const x = margin + columnIndex * columnWidth;
          doc.setFillColor(
            isHeader ? accent[0] : 255,
            isHeader ? accent[1] : 255,
            isHeader ? accent[2] : 255,
          );
          doc.setDrawColor(222, 214, 210);
          doc.rect(x, y, columnWidth, rowHeight, "FD");
          doc.setTextColor(
            isHeader ? 255 : ink[0],
            isHeader ? 255 : ink[1],
            isHeader ? 255 : ink[2],
          );
          doc.text(wrappedCells[columnIndex], x + 2, y + 4.5);
        });
        y += rowHeight;
      });
      y += 4;
    };

    drawPageHeader();
    y = 34;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(21);
    doc.setTextColor(...ink);
    doc.text("Ta feuille de route", margin, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...muted);
    doc.text("Diagnostic personnalisé | Contexte camerounais", margin, y);
    y += 8;
    doc.setDrawColor(...accent);
    doc.setLineWidth(0.7);
    doc.line(margin, y, margin + 24, y);
    y += 9;

    const lines = markdown.replace(/\r/g, "").split("\n");
    let index = 0;
    while (index < lines.length) {
      const line = lines[index].trim();
      if (!line) {
        y += 2;
        index += 1;
        continue;
      }

      const heading = /^(#{1,3})\s+(.+)$/.exec(line);
      if (heading) {
        const level = heading[1].length;
        const fontSize = level === 1 ? 15 : level === 2 ? 12 : 10.5;
        const headingLines = doc.splitTextToSize(
          cleanInlineMarkdown(heading[2]),
          contentWidth - (level < 3 ? 6 : 0),
        ) as string[];
        const lineHeight = level === 1 ? 6.5 : 5.5;
        const blockHeight = headingLines.length * lineHeight + (level < 3 ? 5 : 2);
        ensureSpace(blockHeight + 3);
        if (level === 1) {
          doc.setFillColor(...paleAccent);
          doc.rect(margin, y - 4, contentWidth, blockHeight, "F");
          doc.setFillColor(...accent);
          doc.rect(margin, y - 4, 1.2, blockHeight, "F");
        }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(fontSize);
        doc.setTextColor(...(level === 3 ? accent : ink));
        doc.text(headingLines, margin + (level === 1 ? 4 : 0), y);
        y += blockHeight + (level === 3 ? 2 : 4);
        index += 1;
        continue;
      }

      if (/^\s*[-*_]{3,}\s*$/.test(line)) {
        ensureSpace(5);
        doc.setDrawColor(220, 211, 207);
        doc.setLineWidth(0.25);
        doc.line(margin, y, margin + contentWidth, y);
        y += 5;
        index += 1;
        continue;
      }

      if (line.startsWith("|")) {
        const tableLines: string[] = [];
        while (index < lines.length && lines[index].trim().startsWith("|")) {
          tableLines.push(lines[index].trim());
          index += 1;
        }
        const rows = tableLines
          .filter((row) => !/^\|?[\s:|-]+\|?$/.test(row))
          .map(parseTableRow);
        if (rows.length) drawTable(rows);
        continue;
      }

      if (line.startsWith("> ")) {
        const quoteLines: string[] = [];
        while (index < lines.length && lines[index].trim().startsWith("> ")) {
          quoteLines.push(lines[index].trim().slice(2));
          index += 1;
        }
        const quoteText = quoteLines.join(" ");
        const wrapped = doc.splitTextToSize(
          cleanInlineMarkdown(quoteText),
          contentWidth - 10,
        ) as string[];
        ensureSpace(wrapped.length * 4.8 + 5);
        doc.setDrawColor(...accent);
        doc.setLineWidth(1);
        doc.line(margin + 1, y - 3, margin + 1, y + wrapped.length * 4.8 - 1);
        writeText(quoteText, {
          fontSize: 9.5,
          style: "italic",
          color: muted,
          x: margin + 6,
          width: contentWidth - 8,
          after: 4,
        });
        continue;
      }

      const listItem = /^(\s*)([-*+]|(\d+)[.)])\s+(.+)$/.exec(lines[index]);
      if (listItem) {
        const indent = Math.min(listItem[1].length * 2, 10);
        const itemX = margin + indent;
        const textX = itemX + 7;
        const itemText = listItem[4];
        const itemLines = doc.splitTextToSize(
          cleanInlineMarkdown(itemText),
          pageWidth - margin - textX,
        ) as string[];
        for (let itemLine = 0; itemLine < itemLines.length; itemLine += 1) {
          ensureSpace(4.8);
          if (itemLine === 0 && listItem[3]) {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(9.5);
            doc.setTextColor(...accent);
            doc.text(`${listItem[3]}.`, itemX, y);
          } else if (itemLine === 0) {
            doc.setFillColor(...accent);
            doc.circle(itemX + 1.2, y - 1.1, 0.55, "F");
          }
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9.5);
          doc.setTextColor(...ink);
          doc.text(itemLines[itemLine], textX, y);
          y += 4.8;
        }
        y += 1;
        index += 1;
        continue;
      }

      const paragraph = [line];
      index += 1;
      while (index < lines.length) {
        const nextLine = lines[index].trim();
        if (
          !nextLine ||
          /^(#{1,3})\s+/.test(nextLine) ||
          /^\s*[-*_]{3,}\s*$/.test(nextLine) ||
          nextLine.startsWith("|") ||
          nextLine.startsWith("> ") ||
          /^\s*(?:[-*+]|\d+[.)])\s+/.test(lines[index])
        ) {
          break;
        }
        paragraph.push(nextLine);
        index += 1;
      }
      writeText(paragraph.join(" "), {
        fontSize: 9.5,
        style: "normal",
        color: ink,
        lineHeight: 4.8,
        after: 2.5,
      });
    }

    const pageCount = doc.getNumberOfPages();
    for (let page = 1; page <= pageCount; page += 1) {
      doc.setPage(page);
      doc.setDrawColor(225, 218, 215);
      doc.setLineWidth(0.3);
      doc.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...muted);
      doc.text("CODI IA | Feuille de route personnalisée", margin, pageHeight - 8);
      doc.text(`${page} / ${pageCount}`, pageWidth - margin, pageHeight - 8, {
        align: "right",
      });
    }

    doc.setProperties({ title: "Feuille de route personnalisée - Codi IA" });
    doc.save("feuille-de-route-codi.pdf");
  };

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
          onClick={downloadPdf}
        >
          <LucideIcons.Download size={16} /> Télécharger (PDF)
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
