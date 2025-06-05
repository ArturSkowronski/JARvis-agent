import OpenAI from "openai";
import { GRAPHIC_STYLE_PROMPT } from "@/config/constants";

export async function POST(request: Request) {
  try {
    const { description } = await request.json();
    const openai = new OpenAI();
    const prompt = `${GRAPHIC_STYLE_PROMPT} ${description || ""}`.trim();

    const res = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      response_format: "url",
    });

    const url = res.data[0]?.url;
    return new Response(JSON.stringify({ url }), { status: 200 });
  } catch (error) {
    console.error("Error creating graphic:", error);
    return new Response(JSON.stringify({ error: "Failed to create graphic" }), {
      status: 500,
    });
  }
}
