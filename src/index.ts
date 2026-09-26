import "dotenv/config";

async function main() {
  // Attention : Si tu utilises LiteLLM ailleurs, vérifie tes variables d'environnement
  // pour voir si GEMINI_API_KEY ou un modèle par défaut est défini.
  const apiKey = process.env.VITE_OPENROUTER_API_KEY;
  console.log("Test de connexion OpenRouter (Modèle Gratuit)...");

  if (!apiKey) {
    console.error("ERREUR : VITE_OPENROUTER_API_KEY est manquante dans le fichier .env");
    return;
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // On utilise le modèle recommandé par OpenRouter
        model: "google/gemini-2.0-flash-lite-001",
        messages: [
          { role: "user", content: "Bonjour, es-tu prêt ?" }
        ],
      }),
    });

    const data = await response.json() as any;
    
    if (data.error) {
      console.error("Erreur API:", data.error);
    } else {
      console.log("Succès ! Réponse de l'IA :");
      console.log(data.choices?.[0]?.message?.content);
    }
  } catch (error) {
    console.error("Erreur de connexion:", error);
  }
}

main();
