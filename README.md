# Responses starter app

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
![NextJS](https://img.shields.io/badge/Built_with-NextJS-blue)
![OpenAI API](https://img.shields.io/badge/Powered_by-OpenAI_API-orange)

This repository contains a NextJS starter app built on top of the [Responses API](https://platform.openai.com/docs/api-reference/responses).
It leverages built-in tools ([web search](https://platform.openai.com/docs/guides/tools-web-search?api-mode=responses) and [file search](https://platform.openai.com/docs/guides/tools-file-search)) and implements a chat interface with multi-turn conversation handling.

Features:

- Multi-turn conversation handling
- Web search tool configuration
- Vector store creation & file upload for use with the file search tool
- Function calling
- Streaming responses & tool calls
- Display annotations

This app is meant to be used as a starting point to build a conversational assistant that you can customize to your needs.

## How to use

1. **Set up the OpenAI API:**

   - If you're new to the OpenAI API, [sign up for an account](https://platform.openai.com/signup).
   - Follow the [Quickstart](https://platform.openai.com/docs/quickstart) to retrieve your API key.

2. **Set the OpenAI API key:**

   2 options:

   - Set the `OPENAI_API_KEY` environment variable [globally in your system](https://platform.openai.com/docs/libraries#create-and-export-an-api-key)
   - Set the `OPENAI_API_KEY` environment variable in the project: Create a `.env` file at the root of the project and add the following line (see `.env.example` for reference):

   ```bash
   OPENAI_API_KEY=<your_api_key>
   ```

3. **Clone the Repository:**

   ```bash
   git clone https://github.com/openai/openai-responses-starter-app.git
   ```

4. **Install dependencies:**

   Run in the project root:

   ```bash
   npm install
   ```

5. **Run the app:**

   ```bash
   npm run dev
   ```

   The app will be available at [`http://localhost:3000`](http://localhost:3000).

## Fact checking script

An additional script `scripts/fact-check.js` reads the contents of `input.md` and
uses the `gpt-4o` model to verify each factual claim. It also exports a
`factCheck` function which is registered as a tool with the AGENT SDK. Run the
CLI script with:

```bash
node scripts/fact-check.js
```

Ensure your `OPENAI_API_KEY` environment variable is set before running the
script.

### Triggering the `fact_check` tool from the UI

1. Start the development server with `npm run dev` and open
   [`http://localhost:3000`](http://localhost:3000).
2. Open the **Tools** panel – on desktop it appears on the right side; on
   mobile devices use the menu button to reveal it.
3. Verify that the **Functions** toggle is enabled. The `fact_check` function
   is listed with its parameters.
4. In the chat box, ask the assistant to fact check your text, for example:

   ```
   Use the fact_check tool on: "The sky is green and dolphins are fish."
   ```

   The assistant will call the tool and display the results in the
  conversation.

## Summarizing links

The `summarize_url` function lets the assistant fetch a web page and produce a concise summary.
You can control the style with the `mode` parameter:

- `reference` – Include a citation to the author, e.g. `In [title](url) @Author wrote ...`.
- `describe` – Provide a short description without citing the author.
- `release` – Focus on the gains or improvements described in the linked release notes.

To trigger the tool from the UI:

1. Ensure the **Functions** toggle is enabled in the **Tools** panel.
2. Ask the assistant to summarize a link, for example:

   ```
   Summarize https://example.com in reference mode using the summarize_url tool.
   ```

   The assistant will call the tool and display the generated summary.

## Contributing

You are welcome to open issues or submit PRs to improve this app, however, please note that we may not review all suggestions.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
