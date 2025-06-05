import { promises as fs } from "fs";
import path from "path";

export async function POST(request: Request) {
  const { content } = await request.json();
  if (!content) {
    return new Response("Missing content", { status: 400 });
  }
  try {
    const buffer = Buffer.from(content, "base64");
    const filePath = path.join(process.cwd(), "input.md");
    await fs.writeFile(filePath, buffer);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Error saving input file:", err);
    return new Response("Error saving file", { status: 500 });
  }
}
