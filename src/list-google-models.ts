import "dotenv/config";

async function listModels() {
  const apiKey = process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.error("VITE_GEMINI_API_KEY missing");
    return;
  }

  try {
    // Utilisation de l'endpoint officiel Google Generative AI
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json() as any;
    
    if (data.error) {
      console.error("API Error:", data.error);
    } else {
      console.log("Available Models:");
      data.models.forEach((m: any) => {
        if (m.supportedGenerationMethods?.includes("generateContent")) {
          console.log(`- ${m.name}`);
        }
      });
    }
  } catch (error) {
    console.error("Fetch Error:", error);
  }
}

listModels();
