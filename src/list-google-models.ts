import "dotenv/config";

async function listModels() {
  const apiKey = process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.error("VITE_GEMINI_API_KEY manquante");
    return;
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json() as any;
    
    if (data.error) {
      console.error("Erreur API:", data.error);
    } else {
      console.log("Liste des modèles supportant generateContent :");
      data.models.forEach((m: any) => {
        if (m.supportedGenerationMethods?.includes("generateContent")) {
          // On affiche le nom brut et le nom nettoyé
          console.log(`- ${m.name} (utilisable comme : ${m.name.replace('models/', '')})`);
        }
      });
    }
  } catch (error) {
    console.error("Erreur Fetch:", error);
  }
}

listModels();
