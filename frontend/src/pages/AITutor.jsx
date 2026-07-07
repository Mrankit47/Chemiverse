import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import PageShell from "@/components/PageShell";
import { API, getUserId } from "@/lib/progress";

const SUGGESTIONS = [
  "Explain the octet rule simply",
  "What is the difference between ionic and covalent bonds?",
  "How does the periodic table organize elements?",
  "Why is water a polar molecule?",
];

export default function AITutor() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm **ChemiBot**, your AI chemistry tutor. Ask me anything — bonding, reactions, the periodic table, or how to balance an equation. 🧪" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const sessionId = useRef(getUserId() + "-tutor");
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async (text) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: msg }, { role: "assistant", content: "" }]);
    setLoading(true);

    try {
      const res = await fetch(`${API}/tutor/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId.current, message: msg }),
      });
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop();
        for (const part of parts) {
          const line = part.replace(/^data: /, "").trim();
          if (!line) continue;
          try {
            const data = JSON.parse(line);
            if (data.delta) {
              setMessages((m) => {
                const copy = [...m];
                copy[copy.length - 1] = { role: "assistant", content: copy[copy.length - 1].content + data.delta };
                return copy;
              });
            }
          } catch {}
        }
      }
    } catch (e) {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: "assistant", content: "Sorry, I couldn't reach the lab servers. Please try again." };
        return copy;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell testId="ai-tutor-page" title="AI Tutor" subtitle="ChemiBot answers your chemistry questions in real time." accent="#3FA9FF">
      <div className="max-w-3xl mx-auto">
        <div ref={scrollRef} data-testid="chat-window" className="glass rounded-3xl p-6 h-[52vh] overflow-y-auto space-y-5">
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`w-9 h-9 rounded-full grid place-items-center shrink-0 ${m.role === "user" ? "bg-[var(--purple)]/20" : "bg-[var(--cyan)]/20"}`}>
                {m.role === "user" ? <User className="w-4 h-4 text-[var(--purple)]" /> : <Sparkles className="w-4 h-4 text-[var(--cyan)]" />}
              </div>
              <div
                data-testid={`chat-msg-${m.role}`}
                className={`px-4 py-3 rounded-2xl max-w-[80%] leading-relaxed prose-chem ${
                  m.role === "user" ? "bg-[var(--purple)]/15" : "bg-white/5"
                }`}
              >
                {m.content ? (
                  m.role === "assistant" ? (
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  ) : (
                    <span className="whitespace-pre-wrap">{m.content}</span>
                  )
                ) : (
                  loading && i === messages.length - 1 ? <span className="opacity-60">ChemiBot is thinking…</span> : ""
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {SUGGESTIONS.map((s) => (
              <button key={s} data-testid="chat-suggestion" onClick={() => send(s)} className="px-4 py-2 rounded-full text-sm glass hover:border-[var(--cyan)] text-[var(--muted)] hover:text-white transition-all">
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-3 mt-4">
          <input
            data-testid="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask ChemiBot a chemistry question…"
            className="flex-1 glass rounded-full px-5 py-3.5 outline-none focus:border-[var(--cyan)]"
          />
          <button
            data-testid="chat-send"
            onClick={() => send()}
            disabled={loading}
            className="w-14 h-14 rounded-full grid place-items-center bg-[var(--cyan)] text-black hover:glow-cyan transition-all disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </PageShell>
  );
}
