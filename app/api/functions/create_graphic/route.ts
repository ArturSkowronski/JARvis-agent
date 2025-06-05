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
    try {
      const { promises: fs } = await import("fs");
      const path = (await import("path")).default;
      const imagesFile = path.join(process.cwd(), "public", "images.json");
      let existing: any[] = [];
      try {
        existing = JSON.parse(await fs.readFile(imagesFile, "utf8"));
      } catch {
        existing = [];
      }
      existing.push(url);
      await fs.writeFile(imagesFile, JSON.stringify(existing, null, 2));
    } catch (err) {
      console.error("Error writing images:", err);
    }
    return new Response(JSON.stringify({ url }), { status: 200 });
  } catch (error) {
    console.error("Error creating graphic:", error);
    return new Response(JSON.stringify({ error: "Failed to create graphic" }), {
      status: 500,
    });
  }
}
