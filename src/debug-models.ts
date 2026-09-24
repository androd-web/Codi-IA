import "dotenv/config";

async function listModels() {
  const apiKey = process.env.VITE_GOOGLE_API_KEY;
  if (!apiKey) {
    console.error("VITE_GOOGLE_API_KEY missing");
    return;
  }

  const endpoints = [
    "https://generativelanguage.googleapis.com/v1/models",
    "https://generativelanguage.googleapis.com/v1beta/models"
  ];

  for (const url of endpoints) {
    console.log(`\nChecking endpoint: ${url}`);
    try {
      const response = await fetch(`${url}?key=${apiKey}`);
      const data = await response.json() as any;
      
      if (data.error) {
        console.error(`API Error (${url}):`, data.error.message);
      } else if (data.models) {
        console.log(`Available Models for ${url}:`);
        data.models.forEach((m: any) => {
          if (m.supportedGenerationMethods.includes("generateContent")) {
            console.log(`- ${m.name}`);
          }
        });
      }
    } catch (error) {
      console.error(`Fetch Error (${url}):`, error);
    }
  }
}

listModels();
