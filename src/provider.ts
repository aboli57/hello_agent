export type Provider = "openai" | "gemini" | "groq";
type HelloOutput =
  | {
      ok: true;
      provider: Provider;
      model: string;
      message: string;
    }
  | {
      ok: false;
      error: string;
    };

type GeminiGenerateContent = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
};
async function helloGemini(): Promise<HelloOutput> {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return {
      ok: false,
      error: "GOOGLE_API_KEY is not set",
    };
  }
  const model = "gemini-2.0-flash-lite";
  // const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // 'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: "Hello, how are you?",
            },
          ],
        },
      ],
    }),
  });
  if (!response.ok) {
    return {
      ok: false,
      error: `Gemini API error: ${response.status} ${response.statusText}`,
    };
  }
  const json = (await response.json()) as GeminiGenerateContent;
  const text =
    json.candidates?.[0]?.content?.parts?.[0]?.text ||
    "No response from Google Gemini";
  return {
    ok: true,
    provider: "gemini",
    model: model,
    message: text || "No response from Google Gemini",
  };
}

type OpenAiChatCompletion = {
  choices: Array<{
    message?: {
      content?: string;
    };
  }>;
};
async function helloGroq(): Promise<HelloOutput> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return {
      ok: false,
      error: "GROQ_API_KEY is not set",
    };
  }
  const model = "llama-3.1-8b-instant";
  const url = `https://api.groq.com/openai/v1/chat/completions`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: "user",
          content: "Hello, how are you?",
        },
      ],
      temperature: 0,
    }),
  });
  if (!response.ok) {
    return {
      ok: false,
      error: `Groq API error: ${response.status} ${response.statusText}`,
    };
  }
  const json = (await response.json()) as OpenAiChatCompletion;
  const text = json.choices?.[0]?.message?.content || "No response from Groq";
  return {
    ok: true,
    provider: "groq",
    model: model,
    message: text,
  };
}

async function helloOpenAI(): Promise<HelloOutput> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      ok: false,
      error: "OPENAI_API_KEY is not set",
    };
  }
  const model = "gpt-3.5-turbo";
  const url = `https://api.openai.com/v1/chat/completions`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: "user",
          content: "Hello, how are you?",
        },
      ],
    }),
  });
  if (!response.ok) {
    return {
      ok: false,
      error: `OpenAI API error: ${response.status} ${response.statusText}`,
    };
  }
  const json = (await response.json()) as OpenAiChatCompletion;
  const text = json.choices?.[0]?.message?.content || "No response from OpenAI";
  return {
    ok: true,
    provider: "openai",
    model: model,
    message: text,
  };
}

export async function selectAndHello(provider: Provider): Promise<HelloOutput> {
  try {
    switch (provider) {
      case "openai":
        return await helloOpenAI();

      case "gemini":
        return await helloGemini();

      case "groq":
        return await helloGroq();

      default:
        return {
          ok: false,
          error: `Unknown provider: ${provider}. Valid options are "openai", "gemini", "groq".`,
        };
    }
  } catch (error) {
    return {
      ok: false,
      error: `${provider} API error: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}
