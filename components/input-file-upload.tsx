"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function InputFileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [factCheckResult, setFactCheckResult] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    try {
      const buffer = await file.arrayBuffer();
      const base64Content = arrayBufferToBase64(buffer);
      const res = await fetch("/api/upload_input", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: file.name, content: base64Content }),
      });
      if (!res.ok) {
        throw new Error("Failed to upload file");
      }
      const text = await file.text();
      const factRes = await fetch("/api/functions/fact_check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (factRes.ok) {
        const data = await factRes.json();
        setFactCheckResult(data.output);
      }
      setFile(null);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <Input type="file" accept=".md" onChange={handleFileChange} />
      <Button type="submit" disabled={!file || uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </Button>
      {factCheckResult && (
        <pre className="whitespace-pre-wrap mt-4 text-sm text-left">
          {factCheckResult}
        </pre>
      )}
    </form>
  );
}
