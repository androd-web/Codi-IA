import "dotenv/config";

async function listModels() {
  const apiKey = process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.error("VITE_GEMINI_API_KEY missing");
    return;
  }

  // URL correcte pour lister les modèles Gemini
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

  console.log(`\nChecking endpoint: ${url}`);
  try {
    const response = await fetch(url);
    const data = await response.json() as any;
    
    if (data.error) {
      console.error(`API Error:`, data.error.message);
    } else if (data.models) {
      console.log(`Available Models:`);
      data.models.forEach((m: any) => {
        // On filtre pour voir ceux qui supportent la génération de contenu
        if (m.supportedGenerationMethods?.includes("generateContent")) {
          console.log(`- ${m.name}`);
        }
      });
    }
  } catch (error) {
    console.error(`Fetch Error:`, error);
  }
}

listModels();
