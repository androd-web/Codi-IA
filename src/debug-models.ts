import "dotenv/config";

async function listModels() {
  const apiKey = process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.error("VITE_GEMINI_API_KEY manquante dans le .env");
    return;
  }

  // URL correcte pour lister les modèles Gemini
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

  console.log(`\n--- Vérification de l'API : ${url} ---`);
  try {
    const response = await fetch(url);
    const data = await response.json() as any;
    
    if (data.error) {
      console.error(`Erreur API :`, data.error.message);
    } else if (data.models) {
      console.log(`Modèles disponibles (copie le nom exact pour ta config) :`);
      data.models.forEach((m: any) => {
        // On affiche le nom complet pour que tu puisses le copier-coller
        if (m.supportedGenerationMethods?.includes("generateContent")) {
          console.log(`- Nom : ${m.name} (Version : ${m.version})`);
        }
      });
    }
  } catch (error) {
    console.error(`Erreur de connexion :`, error);
  }
}

listModels();
