const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const analyzeResume = async (data) => {
  const prompt = `
You are an AI career assistant.

Analyze the following data:

${JSON.stringify(data, null, 2)}

Return your response as valid JSON only.
Do not use markdown.
Do not add explanations outside the JSON.
`;

  const response = await openai.responses.create({
    model: "gpt-5-mini",
    input: prompt,
  });

  const output = response.output_text;

  if (!output) {
    throw new Error("AI returned an empty response");
  }

  try {
    return JSON.parse(output);
  } catch (error) {
    console.error("AI JSON PARSE ERROR:", output);

    throw new Error("AI returned invalid JSON");
  }
};

module.exports = {
  analyzeResume,
};