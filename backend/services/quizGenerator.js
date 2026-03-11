import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function generateQuiz(text, { nbQuestions, difficulty, language }) {
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
${text}`;

  const response = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }]
  });

  const raw = response.content[0].text.trim();

  // Parse JSON proprement
  const jsonStart = raw.indexOf('[');
  const jsonEnd = raw.lastIndexOf(']') + 1;
  const jsonStr = raw.slice(jsonStart, jsonEnd);

  return JSON.parse(jsonStr);
}