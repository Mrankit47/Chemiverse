import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import PageShell from "@/components/PageShell";
import { API, getUserId } from "@/lib/progress";

const SUGGESTIONS = [
  "Explain the octet rule simply",
  "Difference between ionic and covalent bonds?",
  "How does periodic table organize elements?",
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
    <PageShell
      testId="ai-tutor-page"
      title="AI Research Tutor"
      subtitle="ChemiBot Neural Assistant. Specialized computational chemistry model trained on reaction mechanisms, quantum orbitals, stoichiometry, and chemical nomenclature."
      accent="#00F5FF"
    >
      <div className="max-w-3xl mx-auto">
        {/* Terminal Header Bar */}
        <div className="glass rounded-t-3xl px-5 py-3 border border-[rgba(0,245,255,0.2)] border-b-0 flex items-center justify-between font-mono text-[11px] text-[var(--muted)]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--green)] pulsering" />
            <span className="text-[#E6F7FF] font-semibold">CHEMIBOT NEURAL CORE // V3.2</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[var(--cyan)]">STREAM: ACTIVE</span>
            <span className="opacity-40">|</span>
            <span className="hidden sm:inline">TEMP: 0.3</span>
          </div>
        </div>

        {/* Chat Stream Window */}
        <div
          ref={scrollRef}
          data-testid="chat-window"
          className="glass rounded-b-3xl p-4 sm:p-6 h-[54vh] sm:h-[50vh] overflow-y-auto space-y-4 sm:space-y-5 touch-scroll border border-[rgba(0,245,255,0.18)] shadow-[0_8px_32px_rgba(5,8,22,0.6)]"
        >
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl grid place-items-center shrink-0 border ${
                m.role === "user"
                  ? "bg-[rgba(139,92,246,0.2)] border-[rgba(139,92,246,0.4)] text-[var(--purple)]"
                  : "bg-[rgba(0,245,255,0.15)] border-[rgba(0,245,255,0.4)] text-[var(--cyan)] shadow-[0_0_12px_rgba(0,245,255,0.2)]"
              }`}>
                {m.role === "user" ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              </div>
              <div
                data-testid={`chat-msg-${m.role}`}
                className={`px-4 py-3 rounded-2xl max-w-[88%] sm:max-w-[82%] leading-relaxed prose-chem text-xs sm:text-sm font-sans border ${
                  m.role === "user"
                    ? "bg-[rgba(139,92,246,0.14)] border-[rgba(139,92,246,0.3)] text-[#E6F7FF]"
                    : "glass border-[rgba(0,245,255,0.15)] text-[#E6F7FF] shadow-[0_2px_12px_rgba(5,8,22,0.4)]"
                }`}
              >
                {m.content ? (
                  m.role === "assistant" ? (
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  ) : (
                    <span className="whitespace-pre-wrap">{m.content}</span>
                  )
                ) : (
                  loading && i === messages.length - 1 ? (
                    <span className="font-mono text-xs text-[var(--cyan)] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--cyan)] animate-ping" />
                      CHEMIBOT IS SYNTHESIZING RESPONSE...
                    </span>
                  ) : ""
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Suggestion Chips */}
        {messages.length <= 1 && (
          <div className="flex gap-2 mt-3 sm:mt-4 overflow-x-auto no-scrollbar py-1 touch-scroll">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                data-testid="chat-suggestion"
                onClick={() => send(s)}
                className="px-3.5 py-1.5 rounded-full text-xs font-mono glass hover:border-[var(--cyan)] text-[var(--muted)] hover:text-[#E6F7FF] transition-all whitespace-nowrap shrink-0 cursor-pointer border border-[rgba(0,245,255,0.14)] hover:bg-white/5"
              >
                › {s}
              </button>
            ))}
          </div>
        )}

        {/* Command Input Box */}
        <div className="flex gap-2 sm:gap-3 mt-3 sm:mt-4">
          <input
            data-testid="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Inquire on reactions, molecular geometry, or electron configuration…"
            className="flex-1 glass rounded-full px-5 py-3.5 text-xs sm:text-sm font-mono text-[#E6F7FF] placeholder-[var(--muted)] outline-none border border-[rgba(0,245,255,0.2)] focus:border-[var(--cyan)] focus:shadow-[0_0_20px_rgba(0,245,255,0.25)] transition-all"
          />
          <button
            data-testid="chat-send"
            onClick={() => send()}
            disabled={loading || !input.trim()}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full grid place-items-center bg-[var(--cyan)] text-black hover:glow-cyan transition-all disabled:opacity-30 shrink-0 cursor-pointer shadow-[0_0_20px_rgba(0,245,255,0.3)]"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </PageShell>
  );
}
