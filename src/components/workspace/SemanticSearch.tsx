"use client";

import { useEffect, useRef, useState } from "react";
import {
  Search,
  Sparkles,
  Loader2,
  Copy,
  Check,
  ExternalLink,
  Play,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Citation = {
  id: number;
  startTime: number | null;
  endTime: number | null;
  startLine: number | null;
  endLine: number | null;
  url: string | null;
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations: Citation[];
};

function formatTimestamp(seconds: number | null) {
  if (seconds === null) {
    return null;
  }

  const totalSeconds = Math.floor(seconds);

  const hours = Math.floor(totalSeconds / 3600);

  const minutes = Math.floor((totalSeconds % 3600) / 60);

  const remainingSeconds = totalSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0",
    )}:${String(remainingSeconds).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds,
  ).padStart(2, "0")}`;
}

export default function SemanticSearch({ sourceId }: { sourceId: string }) {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  /*
   * Load previous conversation for this source.
   */
  useEffect(() => {
    async function loadMessages() {
      try {
        const response = await fetch(
          `/api/search?sourceId=${encodeURIComponent(sourceId)}`,
        );

        if (!response.ok) {
          throw new Error("Failed to load chat history");
        }

        const data = await response.json();

        setMessages(data.messages ?? []);
      } catch (error) {
        console.error("Failed to load chat history:", error);
      }
    }

    loadMessages();
  }, [sourceId]);

  /*
   * Scroll to the latest message.
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  async function search() {
    const trimmedQuery = query.trim();

    if (!trimmedQuery || loading) {
      return;
    }

    setQuery("");
    setLoading(true);

    /*
     * Add the user message immediately.
     */
    const temporaryUserMessage: ChatMessage = {
      id: `temp-user-${Date.now()}`,
      role: "user",
      content: trimmedQuery,
      citations: [],
    };

    const temporaryAssistantId = `temp-assistant-${Date.now()}`;

    const temporaryAssistantMessage: ChatMessage = {
      id: temporaryAssistantId,
      role: "assistant",
      content: "",
      citations: [],
    };

    setMessages((current) => [
      ...current,
      temporaryUserMessage,
      temporaryAssistantMessage,
    ]);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceId,
          query: trimmedQuery,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Search failed");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let assistantAnswer = "";

      while (true) {
        const { value, done } = await reader.read();

        if (done) {
          break;
        }

        assistantAnswer += decoder.decode(value, {
          stream: true,
        });

        setMessages((current) =>
          current.map((message) =>
            message.id === temporaryAssistantId
              ? {
                  ...message,
                  content: assistantAnswer,
                }
              : message,
          ),
        );
      }

      /*
       * Reload the message history after streaming completes.
       *
       * This gives us:
       * - real message IDs
       * - persisted citations
       */
      const historyResponse = await fetch(
        `/api/search?sourceId=${encodeURIComponent(sourceId)}`,
      );

      if (historyResponse.ok) {
        const data = await historyResponse.json();

        setMessages(data.messages ?? []);
      }
    } catch (error) {
      console.error(error);

      setMessages((current) =>
        current.map((message) =>
          message.id === temporaryAssistantId
            ? {
                ...message,
                content: "Something went wrong while generating the answer.",
              }
            : message,
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  async function copyAnswer(message: ChatMessage) {
    if (!message.content) {
      return;
    }

    await navigator.clipboard.writeText(message.content);

    setCopiedId(message.id);

    setTimeout(() => {
      setCopiedId(null);
    }, 1500);
  }

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2 text-black dark:text-white">
          <Sparkles size={18} />

          <h2 className="text-xl font-semibold">Ask about this source</h2>
        </div>

        <p className="text-sm leading-6 text-zinc-500">
          Ask questions about the source and continue the conversation.
        </p>
      </div>

      {/* Conversation */}
      {messages.length > 0 && (
        <div className="mb-8 space-y-6">
          {messages.map((message) => {
            const isUser = message.role === "user";

            return (
              <div
                key={message.id}
                className={isUser ? "flex justify-end" : "flex justify-start"}
              >
                <div
                  className={
                    isUser
                      ? "max-w-[80%] rounded-xl bg-black px-4 py-3 text-sm text-white dark:bg-white dark:text-black"
                      : "w-full rounded-xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-[#0d1014] p-6 text-black dark:text-white"
                  }
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  ) : (
                    <>
                      {/* Assistant Header */}
                      <div className="mb-5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 dark:bg-white/5">
                            <Sparkles size={16} />
                          </div>

                          <div>
                            <p className="text-sm font-medium">Answer</p>

                            <p className="text-xs text-zinc-600">
                              Generated from the source
                            </p>
                          </div>
                        </div>

                        {message.content && (
                          <button
                            onClick={() => copyAnswer(message)}
                            className="flex items-center gap-2 text-xs text-zinc-500 transition dark:hover:text-white hover:text-black"
                          >
                            {copiedId === message.id ? (
                              <>
                                <Check size={15} />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy size={15} />
                                Copy
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      {/* Markdown */}
                      <div className="border-t border-zinc-200 dark:border-white/5 pt-5">
                        <div className="prose prose-zinc dark:prose-invert max-w-none">
                          {message.content ? (
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {message.content}
                            </ReactMarkdown>
                          ) : (
                            <div className="space-y-3">
                              <div className="h-4 w-full animate-pulse rounded bg-white/5" />

                              <div className="h-4 w-5/6 animate-pulse rounded bg-white/5" />

                              <div className="h-4 w-2/3 animate-pulse rounded bg-white/5" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Citations */}
                      {message.citations.length > 0 && (
                        <div className="mt-8 border-t border-zinc-200 dark:border-white/5 pt-5">
                          <div className="mb-3">
                            <p className="text-sm font-medium text-black dark:text-white">
                              Sources
                            </p>

                            <p className="mt-1 text-xs text-zinc-600">
                              Jump directly to the relevant parts of the source.
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {message.citations.map((citation) => {
                              const timestamp = formatTimestamp(
                                citation.startTime,
                              );

                              if (!citation.url) {
                                return null;
                              }

                              return (
                                <a
                                  key={citation.id}
                                  href={citation.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 dark:border-white/10 dark:bg-white/3 px-3 py-2 transition hover:border-zinc-300 dark:hover:border-white/20 dark:hover:bg-white/6"
                                >
                                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-200 dark:bg-white/5">
                                    <Play size={12} className="fill-current" />
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-black dark:text-zinc-300 group-hover:text-black dark:group-hover:text-white">
                                      {timestamp ?? `Source ${citation.id}`}
                                    </span>

                                    <ExternalLink
                                      size={12}
                                      className="text-zinc-600 transition group-hover:text-zinc-400"
                                    />
                                  </div>
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Empty state */}
      {messages.length === 0 && !loading && (
        <div className="mb-8 rounded-xl border border-dashed border-zinc-300 dark:border-white/10 px-6 py-12 text-center">
          <Sparkles size={24} className="mx-auto mb-3 text-zinc-600" />

          <p className="text-sm text-zinc-400">
            Ask anything about this source.
          </p>

          <p className="mt-1 text-xs text-zinc-600">
            Your conversation will be saved automatically.
          </p>
        </div>
      )}

      {/* Search input */}
      <div className="sticky bottom-4 flex items-center gap-2 rounded-xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-[#0d1014] p-2 shadow-2xl transition focus-within:border-zinc-300 dark:focus-within:border-white/20">
        <Search size={18} className="ml-3 shrink-0 text-zinc-500" />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              search();
            }
          }}
          disabled={loading}
          placeholder="Ask a question about this source..."
          className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm text-black dark:text-white outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-600 disabled:opacity-50"
        />

        <button
          onClick={search}
          disabled={loading || !query.trim()}
          className="flex shrink-0 items-center gap-2 rounded-lg bg-black text-white dark:bg-white px-4 py-2.5 text-sm font-medium dark:text-black transition hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Thinking
            </>
          ) : (
            <>
              <Sparkles size={15} />
              Ask
            </>
          )}
        </button>
      </div>
    </div>
  );
}
