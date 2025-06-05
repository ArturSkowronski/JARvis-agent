// List of tools available to the assistant
// No need to include the top-level wrapper object as it is added in lib/tools/tools.ts
// More information on function calling: https://platform.openai.com/docs/guides/function-calling

export const toolsList = [
  {
    name: "get_weather",
    description: "Get the weather for a given location",
    parameters: {
      location: {
        type: "string",
        description: "Location to get weather for",
      },
      unit: {
        type: "string",
        description: "Unit to get weather in",
        enum: ["celsius", "fahrenheit"],
      },
    },
  },
  {
    name: "get_joke",
    description: "Get a programming joke",
    parameters: {},
  },
  {
    name: "fact_check",
    description: "Check the factual accuracy of a block of text",
    parameters: {
      text: {
        type: "string",
        description: "The text to fact check",
      },
    },
  },
  {
    name: "summarize_url",
    description: "Summarize the content of a URL in different styles",
    parameters: {
      url: {
        type: "string",
        description: "The URL to summarize",
      },
      mode: {
        type: "string",
        enum: ["reference", "describe", "release"],
        description:
          "How to present the summary: reference the author, describe the event, or highlight release gains",
      },
      paragraphs: {
        type: "integer",
        description: "Number of paragraphs to summarize into",
      },
    },
    required: ["url", "mode", "paragraphs"],
  },
  {
    name: "create_graphic",
    description: "Generate an image using the gpt-4o model",
    parameters: {
      description: {
        type: "string",
        description: "Additional description for the image",
      },
    },
  },
  {
    name: "create_draft",
    description: "Compile all summaries and images into draft.md",
    parameters: {},
  },
  {
    name: "generate_draft",
    description: "Compile all summaries and images into draft.md and return the file link",
    parameters: {},
  },
];
