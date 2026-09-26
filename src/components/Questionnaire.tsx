import * as LucideIcons from "lucide-react";
import { QUESTIONS } from "../constants/questions";
import type { Option } from "../constants/questions";
import { Icon } from "./ui/Icon";
import { cn } from "../lib/utils";

type Answers = Record<string, string | string[] | number>;

interface QuestionnaireProps {
  step: number;
  answers: Answers;
  updateAnswer: (id: string, value: string | string[] | number) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Questionnaire = ({
  step,
  answers,
  updateAnswer,
  onNext,
  onBack,
}: QuestionnaireProps) => {
  const q = QUESTIONS[step];
  const progress = (step / QUESTIONS.length) * 100;
  const currentAnswer = answers[q.id];

  const isNextDisabled = () => {
    if (q.type === "single") return !currentAnswer;
    if (q.type === "multi")
      return !currentAnswer || (currentAnswer as string[]).length === 0;
    return false;
  };

  return (
    <div className="fade-in">
      <div className="font-mono text-[11px] text-muted text-right mb-2 tracking-wider uppercase">
        Étape {step + 1} / {QUESTIONS.length}
      </div>
      <div className="bg-surface border border-muted h-1 rounded-sm mb-5 overflow-hidden md:mb-10">
        <div
          className="h-full bg-linear-to-r from-vert to-[#7fff6e] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="card mb-3 p-4 md:mb-5 md:p-8">
        <div className="font-mono text-[10px] tracking-[2px] text-[#ff6b35] uppercase mb-2 md:mb-3">
          {q.label}
        </div>
        <div className="text-lg font-bold text-foreground mb-2 leading-tight">
          {q.question}
        </div>
        <div className="text-sm text-muted mb-4 leading-relaxed md:mb-6">
          {q.hint}
        </div>

        <div id="input-area">
          {q.type === "single" && (
            <div className="grid gap-2 md:gap-2.5">
              {q.options?.map((o: string | Option, i: number) => {
                const label = typeof o === "string" ? o : o.label;
                const iconName =
                  typeof o === "string" ? "CircleDot" : o.icon || "CircleDot";
                const desc = typeof o === "string" ? null : o.desc;
                const selected = currentAnswer === label;
                return (
                  <button
                    key={i}
                    onClick={() => updateAnswer(q.id, label)}
                    className={cn(
                        "option-btn p-2.5 md:p-4",
                      selected && "selected",
                    )}
                  >
                    <span className="shrink-0 mt-0.5 text-lg">
                      <Icon name={iconName} />
                    </span>
                    <span className="flex flex-col text-left">
                      <strong className="block font-bold mb-0.5 text-inherit">
                        {label}
                      </strong>
                      {desc && (
                        <span className="text-[12px] text-muted leading-relaxed">
                          {desc}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {q.type === "multi" && (
            <div className="flex flex-wrap gap-2">
              {q.options?.map((o: string | Option, i: number) => {
                const label = typeof o === "string" ? o : o.label;
                const selected = (
                  (currentAnswer as string[] | undefined) || []
                ).includes(label);
                return (
                  <button
                    key={i}
                    onClick={() => {
                      const current =
                        (currentAnswer as string[] | undefined) || [];
                      const next = selected
                        ? current.filter((v: string) => v !== label)
                        : [...current, label];
                      updateAnswer(q.id, next);
                    }}
                    className={cn("chip", selected && "selected")}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}

          {q.type === "slider" && (
            <div className="py-2">
              <input
                type="range"
                className="w-full accent-vert h-1 bg-muted rounded-sm appearance-none cursor-pointer mb-3"
                min={q.min}
                max={q.max}
                value={(currentAnswer as number) || q.default}
                onChange={(e) => updateAnswer(q.id, parseInt(e.target.value))}
              />
              <div className="flex justify-between font-mono text-[11px] text-muted">
                <span>
                  {q.min}
                  {q.unit?.split("/")[0]}
                </span>
                <span>
                  {q.max}
                  {q.unit?.split("/")[0]}
                </span>
              </div>
              <div className="text-center font-mono text-[22px] text-vert font-bold mt-2">
                {(currentAnswer as number) || q.default} {q.unit}
              </div>
            </div>
          )}

          {q.type === "textarea" && (
            <textarea
              className="text-input"
              placeholder={q.placeholder}
              value={(currentAnswer as string) || ""}
              onChange={(e) => updateAnswer(q.id, e.target.value)}
            />
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mt-5 gap-4 md:mt-8">
        <button
          className="btn btn-ghost flex items-center gap-1"
          onClick={onBack}
        >
          <LucideIcons.ChevronLeft size={16} /> Retour
        </button>
        <button
          className="btn btn-primary flex items-center gap-1"
          onClick={onNext}
          disabled={isNextDisabled()}
        >
          {step === QUESTIONS.length - 1 ? (
            <>
              Générer ma feuille de route{" "}
              <LucideIcons.ArrowRight size={16} className="ml-1" />
            </>
          ) : (
            <>
              Continuer <LucideIcons.ChevronRight size={16} className="ml-1" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
