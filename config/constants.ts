export const MODEL = "gpt-4o-mini";

// Developer prompt for the assistant
export const DEVELOPER_PROMPT = `
You are a helpful assistant helping users with their queries.
If they need up to date information, you can use the web search tool to search the web for relevant information.

If they mention something about themselves, their companies, or anything else specific to them, use the save_context tool to store that information for later.

If they ask for something that is related to their own data, use the file search tool to search their files for relevant information.
`;

// Here is the context that you have available to you:
// ${context}

// Initial message that will be displayed in the chat
export const INITIAL_MESSAGE = `
Hi, how can I help you?
`;

export const defaultVectorStore = {
  id: "",
  name: "Example",
};

export const GRAPHIC_STYLE_PROMPT =
  "Create a digital illustration of a confident young man in the distinctive Persona 5 art style: bold, sharp lines, dynamic shading, and vibrant colors. The character has spiky blond hair, wears bright red rectangular glasses, and a red polo shirt. He should have a playful, friendly expression, with a slight smirk. The background should be minimal or plain to keep full focus on the character. No conference logos or city landmarks. Emphasize the red polo and red glasses as signature features.";
