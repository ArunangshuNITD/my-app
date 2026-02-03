import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const messages = body.messages;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
    });

    return new Response(
      JSON.stringify({
        reply: completion.choices[0].message.content,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("CHAT API ERROR:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
