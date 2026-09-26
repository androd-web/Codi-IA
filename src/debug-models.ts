import "dotenv/config";

async function listModels() {
  const apiKey = process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.error("VITE_GEMINI_API_KEY manquante dans le .env");
    return;
  }

  // On utilise l'URL standard de Google Generative AI
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

  console.log(`\n--- Vérification de l'API : ${url} ---`);
  try {
    const response = await fetch(url);
    const data = await response.json() as any;
    
    if (data.error) {
      console.error(`Erreur API :`, data.error.message);
    } else if (data.models) {
      console.log(`Modèles disponibles :`);
      data.models.forEach((m: any) => {
        // On affiche le nom sans le préfixe 'models/' pour voir si c'est ça qui bloque
        const cleanName = m.name.replace('models/', '');
        if (m.supportedGenerationMethods?.includes("generateContent")) {
          console.log(`- Nom complet : ${m.name} | Nom propre : ${cleanName}`);
        }
      });
    }
  } catch (error) {
    console.error(`Erreur de connexion :`, error);
  }
}

listModels();
