export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");
    const mode = searchParams.get("mode") || "describe";

    if (!url) {
      return new Response(JSON.stringify({ error: "Missing url" }), { status: 400 });
    }

    const res = await fetch(url);
    if (!res.ok) {
      return new Response(JSON.stringify({ error: "Failed to fetch url" }), { status: 500 });
    }
    const html = await res.text();

    // Extract title and author if present
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : url;
    const authorMatch = html.match(/<meta[^>]*name=["']author["'][^>]*content=["'](.*?)["']/i);
    const author = authorMatch ? authorMatch[1].trim() : "";

    // Remove scripts/styles and tags
    const cleaned = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ");

    const text = cleaned.replace(/\s+/g, " ").slice(0, 6000);

    const OpenAI = (await import("openai")).default || (await import("openai"));
    const openai = new OpenAI();

    let system = "You summarize web pages.";
    if (mode === "reference") {
      system +=
        " Return a short summary referencing the author if available in the format: In [" +
        title +
        "](" +
        url +
        ")" +
        (author ? " @" + author + "" : "") +
        " wrote:";
    } else if (mode === "release") {
      system += " Summarize the key improvements or gains from this release.";
    } else {
      system += " Provide a concise summary without referencing the author.";
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: system },
        { role: "user", content: text },
      ],
    });

    const summary = completion.choices[0].message.content;
    return new Response(JSON.stringify({ summary }), { status: 200 });
  } catch (error) {
    console.error("Error summarizing url:", error);
    return new Response(JSON.stringify({ error: "Error summarizing url" }), { status: 500 });
  }
}
