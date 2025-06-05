import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { platform } = await request.json();
    if (!platform || (platform !== "linkedin" && platform !== "substack")) {
      return NextResponse.json({ error: "Invalid platform" }, { status: 400 });
    }

    const { promises: fs } = await import("fs");
    const path = (await import("path")).default;

    const summariesPath = path.join(process.cwd(), "public", "summaries.json");
    const imagesPath = path.join(process.cwd(), "public", "images.json");
    const mapPath = path.join(process.cwd(), `${platform}.json`);
    const outPath = path.join(process.cwd(), `final-${platform}.md`);

    let summaries: { url: string; summary: string }[] = [];
    try {
      summaries = JSON.parse(await fs.readFile(summariesPath, "utf8"));
    } catch {
      summaries = [];
    }

    let images: string[] = [];
    try {
      images = JSON.parse(await fs.readFile(imagesPath, "utf8"));
    } catch {
      images = [];
    }

    let map: Record<string, string> = {};
    try {
      map = JSON.parse(await fs.readFile(mapPath, "utf8"));
    } catch {
      map = {};
    }

    const missing = new Set<string>();
    function replaceHandles(text: string) {
      return text.replace(/@([A-Za-z][A-Za-z .'-]*)/g, (m, name) => {
        const trimmed = name.trim();
        if (map[trimmed]) {
          return map[trimmed];
        }
        missing.add(trimmed);
        return m;
      });
    }

    let md = "";
    for (const item of summaries) {
      md += `[Original link](${item.url})\n${replaceHandles(item.summary)}\n\n`;
    }

    for (const link of images) {
      md += `![Image](${link})\n\n`;
    }

    if (missing.size > 0) {
      md += `---\nAuthors not matched: ${Array.from(missing).join(', ')}\n`;
    }

    await fs.writeFile(outPath, md);

    return NextResponse.json({ url: `/${path.basename(outPath)}`, missing: Array.from(missing) });
  } catch (error) {
    console.error("Error generating final content:", error);
    return NextResponse.json({ error: "Failed to generate final" }, { status: 500 });
  }
}
