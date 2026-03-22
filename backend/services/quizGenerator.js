import Groq from 'groq-sdk';

export async function generateQuiz(text, { nbQuestions, difficulty, language }) {
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

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

  const response = await client.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 4000,
  });

  const raw = response.choices[0].message.content.trim();
  const jsonStart = raw.indexOf('[');
  const jsonEnd = raw.lastIndexOf(']') + 1;
  return JSON.parse(raw.slice(jsonStart, jsonEnd));
}