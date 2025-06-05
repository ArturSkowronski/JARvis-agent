import { NextResponse } from "next/server";

export async function POST() {
  try {
    const { promises: fs } = await import("fs");
    const path = (await import("path")).default;

    const summariesPath = path.join(process.cwd(), "public", "summaries.json");
    const imagesPath = path.join(process.cwd(), "public", "images.json");
    const draftPath = path.join(process.cwd(), "draft.md");

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

    let md = "";
    for (const item of summaries) {
      md += `[Original link](${item.url})\n${item.summary}\n\n`;
    }

    const imgurClientId = process.env.IMGUR_CLIENT_ID;
    const uploaded: string[] = [];
    if (imgurClientId) {
      for (const url of images) {
        try {
          const res = await fetch(url);
          const buffer = await res.arrayBuffer();
          const base64 = Buffer.from(buffer).toString("base64");
          const body = new FormData();
          body.append("image", base64);
          const uploadRes = await fetch("https://api.imgur.com/3/image", {
            method: "POST",
            headers: { Authorization: `Client-ID ${imgurClientId}` },
            body,
          });
          const data = await uploadRes.json();
          if (data?.data?.link) {
            uploaded.push(data.data.link);
          }
        } catch (err) {
          console.error("Error uploading to imgur:", err);
        }
      }
    }
    // include original images if no Imgur uploads succeeded
    if (uploaded.length === 0 && images.length > 0) {
      uploaded.push(...images);
    }

    for (const link of uploaded) {
      md += `![Image](${link})\n\n`;
    }

    await fs.writeFile(draftPath, md);

    return NextResponse.json({ url: "/draft.md" });
  } catch (error) {
    console.error("Error creating draft:", error);
    return NextResponse.json({ error: "Failed to create draft" }, { status: 500 });
  }
}
