/**
 * OpenAI API Helper for Vercel Serverless Functions
 * Uses native fetch to minimize dependency overhead and support Vercel Edge/Node runtimes.
 */

export async function callOpenAI(messages, systemPrompt = '', responseFormat = null) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return null; // Will trigger intelligent fallback heuristic
  }

  const payload = {
    model: 'gpt-4o-mini',
    messages: [
      ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
      ...messages,
    ],
    temperature: 0.3,
  };

  if (responseFormat === 'json_object') {
    payload.response_format = { type: 'json_object' };
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn(`OpenAI API error [${response.status}]:`, errText);
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    return content;
  } catch (err) {
    console.error('OpenAI fetch error:', err);
    return null;
  }
}

/**
 * Parses JSON safely from OpenAI response string
 */
export function safeJSONParse(str, fallback) {
  if (!str) return fallback;
  try {
    // If wrapped in markdown ```json ... ```
    const clean = str.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(clean);
  } catch (e) {
    console.error('Failed to parse JSON response:', str);
    return fallback;
  }
}
