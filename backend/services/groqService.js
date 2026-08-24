// Sends extracted document text to the Groq API and returns a structured summary.

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "openai/gpt-oss-120b";

// Caps how much extracted text is sent to the model to keep requests fast and affordable.
const MAX_INPUT_CHARACTERS = 20000;

const LENGTH_INSTRUCTIONS = {
  short: "Write a very brief summary in 2-3 sentences and list 3 key points.",
  medium: "Write a summary in 4-6 sentences and list 4-6 key points.",
  long: "Write a detailed summary in 2-3 paragraphs and list 6-8 key points.",
};

// Builds the chat messages sent to Groq, instructing it to return structured JSON.
function buildMessages(documentText, length) {
  const instruction = LENGTH_INSTRUCTIONS[length] ?? LENGTH_INSTRUCTIONS.medium;
  const truncatedText = documentText.slice(0, MAX_INPUT_CHARACTERS);

  return [
    {
      role: "system",
      content:
        "You summarize documents for a document summary tool. " +
        "Respond only with JSON matching this shape: " +
        '{"summary": string, "keyPoints": string[], "mainIdeas": string[]}. ' +
        "keyPoints are short factual bullet points from the text. " +
        "mainIdeas are the 2-4 overarching themes or takeaways. " +
        "Do not include markdown formatting.",
    },
    {
      role: "user",
      content: `${instruction}\n\nDocument text:\n"""\n${truncatedText}\n"""`,
    },
  ];
}

// Calls the Groq chat completions API and returns the parsed summary object.
export async function generateSummary(documentText, length) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured on the server.");
  }

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: buildMessages(documentText, length),
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_completion_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Groq API request failed (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  const rawContent = data.choices?.[0]?.message?.content;
  if (!rawContent) {
    throw new Error("Groq API returned an empty response.");
  }

  return parseSummaryResponse(rawContent);
}

// Parses and validates the JSON summary payload returned by Groq.
function parseSummaryResponse(rawContent) {
  let parsed;
  try {
    parsed = JSON.parse(rawContent);
  } catch {
    throw new Error("Groq API returned a response that could not be parsed.");
  }

  return {
    summary: typeof parsed.summary === "string" ? parsed.summary : "",
    keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints : [],
    mainIdeas: Array.isArray(parsed.mainIdeas) ? parsed.mainIdeas : [],
  };
}
