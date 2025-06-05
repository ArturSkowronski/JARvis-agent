// Functions mapping to tool calls
// Define one function per tool call - each tool call should have a matching function
// Parameters for a tool call are passed as an object to the corresponding function

export const get_weather = async ({
  location,
  unit,
}: {
  location: string;
  unit: string;
}) => {
  console.log("location", location);
  console.log("unit", unit);
  const res = await fetch(
    `/api/functions/get_weather?location=${location}&unit=${unit}`
  ).then((res) => res.json());

  console.log("executed get_weather function", res);

  return res;
};

export const get_joke = async () => {
  const res = await fetch(`/api/functions/get_joke`).then((res) => res.json());
  return res;
};

export const fact_check = async ({ text }: { text: string }) => {
  const res = await fetch(`/api/functions/fact_check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  const data = await res.json();
  return data.output;
};

import useSummaryStore from "@/stores/useSummaryStore";
import useImageStore from "@/stores/useImageStore";

export const summarize_url = async ({
  url,
  mode,
  paragraphs,
}: {
  url: string;
  mode: "reference" | "describe" | "release";
  paragraphs?: number;
}) => {
  const params = new URLSearchParams({ url, mode });
  if (paragraphs) params.append("paragraphs", paragraphs.toString());
  const res = await fetch(`/api/functions/summarize_url?${params.toString()}`);
  const data = await res.json();
  if (data.summary) {
    useSummaryStore.getState().addSummary({ url, summary: data.summary });
  }
  return data;
};

export const create_graphic = async ({
  description,
}: {
  description: string;
}) => {
  const res = await fetch(`/api/functions/create_graphic`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description }),
  });
  const data = await res.json();
  if (data.url) {
    useImageStore.getState().addImage({ url: data.url });
  }
  return data;
};

export const create_draft = async () => {
  const res = await fetch(`/api/functions/create_draft`, {
    method: "POST",
  });
  return res.json();
};

export const generate_draft = async () => {
  const res = await fetch(`/api/functions/create_draft`, {
    method: "POST",
  });
  const data = await res.json();
  if (data.url) {
    return { url: data.url };
  }
  if (data.draft) {
    return { url: `/${data.draft}` };
  }
  return data;
};

export const functionsMap = {
  get_weather: get_weather,
  get_joke: get_joke,
  fact_check: fact_check,
  summarize_url: summarize_url,
  create_graphic: create_graphic,
  create_draft: create_draft,
  generate_draft: generate_draft,
};
