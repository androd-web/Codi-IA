async function getFreeModels() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  try {
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models", {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
      }
    });
    const data = await response.json();
    const freeModels = data.data
      .filter((m: unknown) => (m as { id: string }).id.includes(":free"))
      .map((m: unknown) => (m as { id: string }).id);
    console.log("Modèles gratuits disponibles sur OpenRouter :", freeModels);
  } catch (error) {
    console.error("Erreur lors de la récupération des modèles :", error);
  }
}
export { getFreeModels };
