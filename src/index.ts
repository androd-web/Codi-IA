/// <reference types="node" />

import "dotenv/config";

type GeminiResponse = {
  error?: { message?: string };
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
  }>;
};

async function main() {
  const apiKey = process.env.VITE_GEMINI_API_KEY;
  console.log("Test de connexion à l'API Google Gemini...");

  if (!apiKey) {
    console.error(
      "ERREUR : VITE_GEMINI_API_KEY est manquante dans le fichier .env",
    );
    return;
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: "Bonjour, es-tu prêt ?" }] },
          ],
        }),
      },
    );

    const data = (await response.json()) as GeminiResponse;

    if (!response.ok || data.error) {
      console.error(
        "Erreur API Google Gemini:",
        data.error?.message || response.statusText,
      );
      return;
    }

    console.log("Succès ! Réponse de Gemini :");
    console.log(
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Réponse vide de l'IA.",
    );
  } catch (error) {
    console.error("Erreur de connexion:", error);
  }
}

main();
