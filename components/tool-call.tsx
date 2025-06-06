import React from "react";
import useConversationStore from "@/stores/useConversationStore";

import { ToolCallItem } from "@/lib/assistant";
import { BookOpenText, Clock, Globe, Zap } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";

interface ToolCallProps {
  toolCall: ToolCallItem;
}

function ApiCallCell({ toolCall }: ToolCallProps) {
  const [extra, setExtra] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const { chatMessages, setChatMessages } = useConversationStore();

  const handleReload = async () => {
    if (!toolCall.parsedArguments) return;
    setLoading(true);
    try {
      const description = `${toolCall.parsedArguments.description ?? ""} ${extra}`.trim();
      const res = await fetch("/api/functions/create_graphic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });
      const data = await res.json();
      toolCall.output = JSON.stringify(data);
      setChatMessages([...chatMessages]);
      setExtra("");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const output = toolCall.output ? JSON.parse(toolCall.output) : null;

  return (
    <div className="flex flex-col w-[70%] relative mb-[-8px]">
      <div>
        <div className="flex flex-col text-sm rounded-[16px]">
          <div className="font-semibold p-3 pl-0 text-gray-700 rounded-b-none flex gap-2">
            <div className="flex gap-2 items-center text-blue-500 ml-[-8px]">
              <Zap size={16} />
              <div className="text-sm font-medium">
                {toolCall.status === "completed"
                  ? `Called ${toolCall.name}`
                  : `Calling ${toolCall.name}...`}
              </div>
            </div>
          </div>

          <div className="bg-[#fafafa] rounded-xl py-2 ml-4 mt-2">
            <div className="max-h-96 overflow-y-scroll text-xs border-b mx-6 p-2">
              <SyntaxHighlighter
                customStyle={{
                  backgroundColor: "#fafafa",
                  padding: "8px",
                  paddingLeft: "0px",
                  marginTop: 0,
                  marginBottom: 0,
                }}
                language="json"
                style={coy}
              >
                {JSON.stringify(toolCall.parsedArguments, null, 2)}
              </SyntaxHighlighter>
            </div>
            <div className="max-h-96 overflow-y-scroll mx-6 p-2 text-xs flex flex-col gap-2">
              {output ? (
                toolCall.name === "create_graphic" ? (
                  <>
                    <img src={output.url} className="max-w-full rounded-md" />
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        className="border px-1 text-xs flex-grow"
                        placeholder="Add context"
                        value={extra}
                        onChange={(e) => setExtra(e.target.value)}
                      />
                      <button
                        onClick={handleReload}
                        disabled={loading}
                        className="text-blue-600 text-xs"
                      >
                        {loading ? "Loading..." : "Reload"}
                      </button>
                    </div>
                  </>
                ) : (
                  <SyntaxHighlighter
                    customStyle={{
                      backgroundColor: "#fafafa",
                      padding: "8px",
                      paddingLeft: "0px",
                      marginTop: 0,
                    }}
                    language="json"
                    style={coy}
                  >
                    {JSON.stringify(output, null, 2)}
                  </SyntaxHighlighter>
                )
              ) : (
                <div className="text-zinc-500 flex items-center gap-2 py-2">
                  <Clock size={16} /> Waiting for result...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FileSearchCell({ toolCall }: ToolCallProps) {
  return (
    <div className="flex gap-2 items-center text-blue-500 mb-[-16px] ml-[-8px]">
      <BookOpenText size={16} />
      <div className="text-sm font-medium mb-0.5">
        {toolCall.status === "completed"
          ? "Searched files"
          : "Searching files..."}
      </div>
    </div>
  );
}

function WebSearchCell({ toolCall }: ToolCallProps) {
  return (
    <div className="flex gap-2 items-center text-blue-500 mb-[-16px] ml-[-8px]">
      <Globe size={16} />
      <div className="text-sm font-medium">
        {toolCall.status === "completed"
          ? "Searched the web"
          : "Searching the web..."}
      </div>
    </div>
  );
}

export default function ToolCall({ toolCall }: ToolCallProps) {
  return (
    <div className="flex justify-start pt-2">
      {(() => {
        switch (toolCall.tool_type) {
          case "function_call":
            return <ApiCallCell toolCall={toolCall} />;
          case "file_search_call":
            return <FileSearchCell toolCall={toolCall} />;
          case "web_search_call":
            return <WebSearchCell toolCall={toolCall} />;
          default:
            return null;
        }
      })()}
    </div>
  );
}
