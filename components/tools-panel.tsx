"use client";
import React from "react";
import FileSearchSetup from "./file-search-setup";
import WebSearchConfig from "./websearch-config";
import FunctionsView from "./functions-view";
import PanelConfig from "./panel-config";
import useToolsStore from "@/stores/useToolsStore";
import InputFileUpload from "./input-file-upload";

export default function ContextPanel() {
  const {
    functionsEnabled,
    setFunctionsEnabled,
  } = useToolsStore();
  return (
    <div className="h-full p-8 w-full bg-[#f9f9f9] rounded-t-xl md:rounded-none border-l-1 border-stone-100">
      <div className="flex flex-col overflow-y-scroll h-full">
    
        <PanelConfig
          title="Functions"
          tooltip="Allows to use locally defined functions"
          enabled={functionsEnabled}
          setEnabled={setFunctionsEnabled}
        >
          <FunctionsView />
        </PanelConfig>
        <div className="space-y-2">
          <h1 className="text-black font-medium">Upload input.md</h1>
          <InputFileUpload />
        </div>
      </div>
    </div>
  );
}
