export interface Option {
  icon?: string;
  label: string;
  desc?: string;
}

export interface Question {
  id: string;
  label: string;
  question: string;
  hint: string;
  type: 'single' | 'multi' | 'slider' | 'textarea';
  options?: (Option | string)[];
  min?: number;
  max?: number;
  default?: number;
  unit?: string;
  placeholder?: string;
}

export const SYSTEM_PROMPT = `Tu es Codi IA, une intelligence artificielle avancée conçue par Codify. Ton expertise porte sur le diagnostic de compétences numériques et le développement de talents technologiques en Afrique, avec une spécialisation profonde sur le marché du Cameroun.

Ta mission est de transformer les réponses d'un utilisateur en une feuille de route d'apprentissage "Codi IA" ultra-personnalisée. Tu dois te comporter comme un mentor tech local, bienveillant mais rigoureux.

RÈGLES D'OR DE CODI IA:
1. IDENTITÉ: Si on te demande qui tu es, tu réponds "Je suis Codi IA, ton guide vers l'excellence numérique, propulsé par Codify".
2. CONTEXTE: Tu connais les réalités camerounaises (coût de la data, importance du Mobile Money, écosystème de Silicon Mountain à Buea, incubateurs de Douala/Yaoundé).
3. FORMAT: Toujours structurer en 6 parties claires avec du Markdown (tableaux, listes, titres).
4. ACTIONNABLE: Chaque conseil doit pouvoir être appliqué dès demain, même avec peu de moyens.

Les 6 parties obligatoires de ton rapport :
## 🎯 Audit de compétences (Codi IA)
## 🔗 Alignement stratégique
## 📅 Hiérarchie d'apprentissage
## 📚 Ressources locales (Cameroun)
## 🗓️ Calendrier 6 mois
## ⚡ Solutions aux défis contextuels`;

export const QUESTIONS: Question[] = [
  {
    id: 'background',
    label: '01 / Profil actuel',
    question: 'Quelle est ta situation actuelle ?',
    hint: 'Sélectionne ce qui te correspond le mieux.',
    type: 'single',
    options: [
      { icon: 'GraduationCap', label: 'Étudiant(e)', desc: 'Lycée, université ou école technique' },
      { icon: 'Briefcase', label: 'Professionnel en reconversion', desc: 'Tu travailles mais veux pivoter vers le numérique' },
      { icon: 'Rocket', label: 'Entrepreneur / Fondateur', desc: 'Tu as ou veux lancer une startup' },
      { icon: 'Monitor', label: 'Développeur junior', desc: 'Moins de 2 ans d\'expérience en code' },
      { icon: 'Wrench', label: 'Tech autodidacte', desc: 'Tu as appris seul, expérience variée' },
    ]
  },
  {
    id: 'programming_level',
    label: '02 / Programmation',
    question: 'Quel est ton niveau en programmation ?',
    hint: 'Sois honnête — cette évaluation oriente toute la feuille de route.',
    type: 'single',
    options: [
      { icon: 'Sprout', label: 'Débutant absolu', desc: 'Jamais écrit de code ou quelques tutoriels abandonnés' },
      { icon: 'BookOpen', label: 'Bases acquises', desc: 'Variables, boucles, fonctions — tu comprends la logique' },
      { icon: 'Hammer', label: 'Capable de créer', desc: 'Tu as fait des petits projets : scripts, apps simples, sites' },
      { icon: 'Settings', label: 'Développeur opérationnel', desc: 'Tu travailles sur des projets réels avec frameworks modernes' },
      { icon: 'Building2', label: 'Niveau senior', desc: 'Architecture, API, bases de données, déploiement en prod' },
    ]
  },
  {
    id: 'languages',
    label: '03 / Technologies',
    question: 'Quelles technologies connais-tu déjà ? (multi-sélection)',
    hint: 'Coche tout ce que tu utilises ou as déjà utilisé.',
    type: 'multi',
    options: ['Python', 'JavaScript', 'HTML/CSS', 'Java', 'PHP', 'SQL', 'React/Vue', 'Node.js', 'Flutter/Dart', 'Aucune']
  },
  {
    id: 'domain_interest',
    label: '04 / Domaine cible',
    question: 'Vers quel(s) secteur(s) transformateur(s) veux-tu te diriger ?',
    hint: 'Choisis 1 à 3 priorités maximum pour une feuille de route focalisée.',
    type: 'multi',
    options: ['Intelligence Artificielle', 'Fintech / Mobile Money', 'Agritech', 'Santé numérique', 'Blockchain / Web3', 'E-gouvernement', 'EdTech / Formation', 'E-commerce']
  },
  {
    id: 'objective',
    label: '05 / Objectif',
    question: 'Quel est ton objectif principal dans les 12 prochains mois ?',
    hint: 'Choisis l\'objectif qui correspond le mieux à ta vision.',
    type: 'single',
    options: [
      { icon: 'Banknote', label: 'Trouver un emploi tech', desc: 'Salarié dans une entreprise locale ou internationale' },
      { icon: 'Globe', label: 'Travailler en freelance', desc: 'Clients locaux et/ou remote (Upwork, fiverr, etc.)' },
      { icon: 'Building', label: 'Lancer ma startup', desc: 'Construire un produit et trouver des clients au Cameroun' },
      { icon: 'TrendingUp', label: 'Monter en compétences', desc: 'Me positionner comme expert dans mon domaine actuel' },
      { icon: 'Users', label: 'Contribuer à l\'écosystème', desc: 'Former, mentorer, ou rejoindre une ONG / initiative locale' },
    ]
  },
  {
    id: 'time_available',
    label: '06 / Temps disponible',
    question: 'Combien d\'heures par semaine peux-tu consacrer à l\'apprentissage ?',
    hint: 'Sois réaliste — mieux vaut 5h constantes que 20h une semaine et rien ensuite.',
    type: 'slider',
    min: 2, max: 30, default: 8,
    unit: 'h/semaine'
  },
  {
    id: 'constraints',
    label: '07 / Contraintes',
    question: 'Quels sont tes principaux obstacles ? (multi-sélection)',
    hint: 'Sélectionne tout ce qui s\'applique à ta situation réelle.',
    type: 'multi',
    options: [
      'Internet limité ou instable',
      'Budget très limité (<5000 FCFA/mois pour formation)',
      'Pas d\'ordinateur personnel',
      'Anglais faible (préfère le français)',
      'Manque de communauté locale',
      'Pas de mentor disponible',
      'Charge de travail / études importante',
      'Famille à charge'
    ]
  },
  {
    id: 'context',
    label: '08 / Contexte',
    question: 'Décris brièvement ton projet ou ambition en quelques mots',
    hint: 'Optionnel mais très utile pour personnaliser les recommandations. Ex: "Je veux créer une app de gestion d\'inventaire pour les marchés de Douala"',
    type: 'textarea',
    placeholder: 'Ex: Je veux construire une plateforme de paiement pour les agriculteurs de l\'Ouest Cameroun...'
  }
];
