import Groq from 'groq-sdk';

// Tokens approximatifs par question générée (question + 4 options + explication)
const TOKENS_PAR_QUESTION = 180;
// Limite de sécurité pour le texte envoyé à Groq (en caractères)
// ~4 chars = 1 token, on vise max 3500 tokens de contexte pour rester sous 6000 TPM
const MAX_CHARS_TEXTE = 12000;

export async function generateQuiz(text, { nbQuestions, difficulty, language }) {
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

  // ── FIX ERREUR 2 : tronquer le texte pour ne pas dépasser le TPM ──────────
  const texteTronque = text.slice(0, MAX_CHARS_TEXTE);

  // ── FIX ERREUR 1 : max_tokens calculé selon le nombre de questions ────────
  // On ajoute 500 tokens de marge pour le formatage JSON
  const maxTokens = Math.min(nbQuestions * TOKENS_PAR_QUESTION + 500, 6000);

  const prompt = `Tu es un expert pédagogique. À partir du texte suivant, génère exactement ${nbQuestions} questions QCM en ${language}.

Niveau de difficulté : ${difficulty}
- facile : définitions et concepts basiques
- moyen : compréhension et application
- difficile : analyse, cas complexes, pièges

RÈGLES STRICTES :
- Chaque question a exactement 4 choix (A, B, C, D)
- Une seule bonne réponse par question
- Les distracteurs doivent être plausibles
- Ajoute une explication courte pour chaque bonne réponse
- L'explication doit faire maximum 1 phrase

Réponds UNIQUEMENT avec un JSON valide, sans texte avant ou après :
[
  {
    "question": "...",
    "options": ["...", "...", "...", "..."],
    "correctIndex": 0,
    "explanation": "..."
  }
]

TEXTE DU COURS :
${texteTronque}`;

  const response = await client.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: maxTokens,
  });

  const raw = response.choices[0].message.content.trim();
  const jsonStart = raw.indexOf('[');
  const jsonEnd = raw.lastIndexOf(']') + 1;

  // ── FIX ERREUR 1 (bis) : vérifier que le JSON est complet avant de parser ─
  if (jsonStart === -1 || jsonEnd === 0) {
    throw new Error('Le modèle n\'a pas retourné de JSON valide. Réessaie avec moins de questions.');
  }

  const jsonStr = raw.slice(jsonStart, jsonEnd);

  try {
    return JSON.parse(jsonStr);
  } catch {
    // Tentative de récupération : couper à la dernière question complète
    const dernierObjetComplet = jsonStr.lastIndexOf('},');
    if (dernierObjetComplet !== -1) {
      const jsonRepare = jsonStr.slice(0, dernierObjetComplet + 1) + ']';
      try {
        return JSON.parse(jsonRepare);
      } catch {
        throw new Error('JSON malformé même après réparation. Réduis le nombre de questions.');
      }
    }
    throw new Error('JSON malformé. Réduis le nombre de questions ou la taille du PDF.');
  }
}