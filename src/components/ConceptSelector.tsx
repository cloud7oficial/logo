import React from 'react';
import { Sparkles, Check, Info } from 'lucide-react';
import { LogoConcept } from '../types/logo';

interface ConceptSelectorProps {
  concepts: LogoConcept[];
  selectedId: string;
  onSelect: (concept: LogoConcept) => void;
}

export const ConceptSelector: React.FC<ConceptSelectorProps> = ({
  concepts,
  selectedId,
  onSelect,
}) => {
  if (concepts.length <= 1) return null;

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          Conceitos Gerados ({concepts.length} Variações Criativas):
        </label>
        <span className="text-xs text-zinc-400">
          Selecione uma opção para animar e exportar
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {concepts.map((concept, index) => {
          const isSelected = concept.id === selectedId;

          return (
            <button
              key={concept.id}
              onClick={() => onSelect(concept)}
              className={`rounded-2xl border text-left p-4 transition-all relative flex flex-col justify-between gap-3 group ${
                isSelected
                  ? 'bg-zinc-900 border-indigo-500 shadow-xl shadow-indigo-500/10 ring-1 ring-indigo-500'
                  : 'bg-zinc-950/70 border-zinc-800 hover:bg-zinc-900/80 hover:border-zinc-700'
              }`}
            >
              {/* Concept Header */}
              <div className="flex items-center justify-between w-full">
                <span className="text-[11px] font-mono text-indigo-400 font-semibold">
                  Opção {index + 1}
                </span>
                {isSelected && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-white px-2 py-0.5 rounded-full bg-indigo-600">
                    <Check className="w-3 h-3" /> Selecionado
                  </span>
                )}
              </div>

              {/* Logo Preview Mini */}
              <div
                className="w-full aspect-[16/10] rounded-xl flex items-center justify-center p-4 border border-zinc-800/80 transition-colors"
                style={{ backgroundColor: concept.colors.backgroundDark }}
              >
                <div
                  className="w-full h-full max-w-[140px] flex items-center justify-center pointer-events-none group-hover:scale-105 transition-transform duration-300"
                  dangerouslySetInnerHTML={{ __html: concept.svgMarkup }}
                />
              </div>

              {/* Details */}
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {concept.conceptName}
                </h4>
                <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1">
                  {concept.rationale}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-2.5">
                  {concept.styleKeywords.slice(0, 3).map((kw) => (
                    <span
                      key={kw}
                      className="text-[9px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
