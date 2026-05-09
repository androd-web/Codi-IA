import { useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { QUESTIONS, SYSTEM_PROMPT } from './constants/questions';
import { Header } from './components/Header';
import { Questionnaire } from './components/Questionnaire';
import { ResultView } from './components/ResultView';
import { LoadingState, IntroView } from './components/States';

type Answers = Record<string, string | string[] | number>;

interface GeminiContent {
  text: string;
}

interface GeminiResponse {
  content: GeminiContent[];
  error?: string;
}

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
    }
    return 'dark';
  });
  const [currentStep, setCurrentStep] = useState(-1); // -1 is intro
  const [answers, setAnswers] = useState<Answers>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleNext = () => {
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      void generateReport();
    }
  };

  const handleBack = () => {
    if (currentStep > -1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const updateAnswer = (id: string, value: string | string[] | number) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const generateReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const prompt = buildPrompt(answers);
      const response = await fetch('http://localhost:3000/api/diagnostic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur serveur: ${response.status}`);
      }

      const data = (await response.json()) as GeminiResponse;
      if (data.error) throw new Error(data.error);

      const text = data.content.map((b) => b.text || '').join('\n');
      setResult(text);
      setCurrentStep(QUESTIONS.length); // Result state
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur inconnue est survenue.");
      }
    } finally {
      setLoading(false);
    }
  };

  const buildPrompt = (a: Answers) => {
    const languages = a.languages as string[] | undefined;
    const domainInterest = a.domain_interest as string[] | undefined;
    const constraints = a.constraints as string[] | undefined;

    return `Voici les réponses du formulaire de diagnostic:

**Profil actuel:** ${String(a.background || 'Non précisé')}
**Niveau programmation:** ${String(a.programming_level || 'Non précisé')}
**Technologies connues:** ${(languages || []).join(', ') || 'Aucune'}
**Secteurs cibles:** ${(domainInterest || []).join(', ') || 'Non précisé'}
**Objectif principal 12 mois:** ${String(a.objective || 'Non précisé')}
**Temps disponible:** ${String(a.time_available || 8)} heures/semaine
**Obstacles principaux:** ${(constraints || []).join(', ') || 'Aucun identifié'}
**Contexte / Projet:** ${String(a.context || 'Non précisé')}

Génère maintenant le rapport complet de feuille de route selon les 6 parties définies. Sois très spécifique au contexte camerounais.`;
  };

  const restart = () => {
    setCurrentStep(-1);
    setAnswers({});
    setResult(null);
    setError(null);
  };

  const downloadResult = () => {
    if (!result) return;
    const blob = new Blob([result], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'feuille-de-route-numerique-cameroun.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container max-w-[860px] mx-auto px-6 py-10 pb-20 relative z-10">
      <Header theme={theme} toggleTheme={toggleTheme} />

      <main>
        {loading ? (
          <LoadingState />
        ) : result ? (
          <ResultView markdown={result} onDownload={downloadResult} onRestart={restart} />
        ) : currentStep === -1 ? (
          <IntroView onStart={() => setCurrentStep(0)} />
        ) : (
          <Questionnaire 
            step={currentStep} 
            answers={answers} 
            updateAnswer={updateAnswer} 
            onNext={handleNext} 
            onBack={handleBack} 
          />
        )}
        
        {error && (
          <div className="mt-5 p-5 border border-red-500 bg-red-500/10 rounded-sm text-sm text-red-500 flex items-center gap-2">
            <LucideIcons.AlertTriangle size={18} />
            <div>
              Erreur: {error}<br />
              Vérifie ta connexion internet et réessaie.
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
