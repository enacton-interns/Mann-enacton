"use client";

import { useState } from "react";

import WorkspaceTabs from "./WorkspaceTabs";
import TranscriptView from "./TranscriptView";
import SemanticSearch from "./SemanticSearch";
import Generate from "./generate/Generate";
type Tab = "transcript" | "search" | "generate";

export default function Workspace({ sourceId }: { sourceId: string }) {
  const [activeTab, setActiveTab] = useState<Tab>("search");

  return (
    <div>
      <WorkspaceTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-8">
        {activeTab === "search" && <SemanticSearch sourceId={sourceId} />}

        {activeTab === "transcript" && <TranscriptView sourceId={sourceId} />}

        {activeTab === "generate" && <Generate sourceId={sourceId} />}
      </div>
    </div>
  );
}
