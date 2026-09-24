import "dotenv/config";

async function listModels() {
  const apiKey = process.env.VITE_GOOGLE_API_KEY;
  if (!apiKey) {
    console.error("VITE_GOOGLE_API_KEY missing");
    return;
  }

  try {
    const response = await fetch(`  https://api.groq.com/openai/v1${apiKey}`);
    const data = await response.json() as any;
    
    if (data.error) {
      console.error("API Error:", data.error);
    } else {
      console.log("Available Models:");
      data.models.forEach((m: any) => {
        if (m.supportedGenerationMethods.includes("generateContent")) {
          console.log(`- ${m.name}`);
        }
      });
    }
  } catch (error) {
    console.error("Fetch Error:", error);
  }
}

listModels();
