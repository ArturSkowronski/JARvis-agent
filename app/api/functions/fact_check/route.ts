export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    if (!text) {
      return new Response(JSON.stringify({ error: "Missing text" }), { status: 400 });
    }
    const OpenAI = (await import("openai")).default || (await import("openai"));
    const openai = new OpenAI();

    const messages = [
      {
        role: "system",
        content:
          "You are a fact-checking assistant. Analyse the text, list each factual statement, confirm if it is correct, and suggest corrections for any inaccuracies.",
      },
      {
        role: "user",
        content: `Fact check the following text using the gpt-4o model and provide recommendations for corrections if needed.\n\n${text}`,
      },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
    });
    const result = completion.choices[0].message.content;

    const verifyMessages = [
      {
        role: "system",
        content:
          "You are verifying the output of a fact check. Ensure each statement and correction is accurate.",
      },
      {
        role: "user",
        content: `Verify the following fact check result:\n\n${result}`,
      },
    ];

    const verification = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: verifyMessages,
    });
    const verificationContent = verification.choices[0].message.content;

    const output = `${result}\n\n---\nVerification:\n${verificationContent}`;
    return new Response(JSON.stringify({ output }), { status: 200 });
  } catch (error) {
    console.error("Error in fact_check:", error);
    return new Response(
      JSON.stringify({ error: "Error fact checking text" }),
      { status: 500 }
    );
  }
}