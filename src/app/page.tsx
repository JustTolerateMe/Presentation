"use client";

import { useState, useEffect } from "react";
import Section from "@/components/Section";

const BASE_H2 =
  "font-[var(--font-space)] text-6xl md:text-8xl font-bold uppercase italic tracking-tighter leading-[0.9] text-[var(--text)]";
const BASE_SUB =
  "text-[var(--text)] text-base md:text-xl max-w-2xl mx-auto tracking-tight font-[var(--font-space)] mt-8 leading-relaxed opacity-85";

export default function Home() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? window.scrollY / max : 0;
      // Flip theme between Slide 2 (The Confidence Problem) and 3 (Working Memory)
      setIsDark(pct > 0.18);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`flex flex-col min-h-screen transition-colors duration-700 ${isDark ? "dark" : ""}`}>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="relative z-10 text-center px-4">
          <h1 className="font-[var(--font-space)] text-[18vw] font-bold tracking-tighter leading-none text-black uppercase italic select-none">
            AI 101
          </h1>
          <p className="mt-8 text-black/40 text-[10px] uppercase tracking-[0.7em]">
            Anshuman // Scroll to begin
          </p>
        </div>
      </section>

      {/* ── 01. The Brilliant Parrot ─────────────────────────────────── */}
      <Section id="brilliant-parrot">
        <div className="space-y-6 max-w-2xl mx-auto">
          <h2 className={BASE_H2}>01. The <br /> Brilliant Parrot</h2>
          <p className={BASE_SUB}>AI doesn't think — it <strong>predicts</strong>. Trained on billions of words, it learned which words follow which. It has no understanding of truth, no awareness of context, and no memory of yesterday. It is pattern recognition at an extraordinary scale.</p>
        </div>
      </Section>

      {/* ── 02. The Confidence Problem ───────────────────────────────── */}
      <Section id="confidence-problem">
        <div className="space-y-6 max-w-2xl mx-auto">
          <h2 className={BASE_H2}>02. The <br /> Confidence Problem</h2>
          <p className={BASE_SUB}>AI has no fact-checking layer. It generates the most plausible-sounding response, not the most accurate one. It will fabricate citations, invent statistics, and fill gaps with fiction — all with complete confidence. <strong>Always verify before you trust.</strong></p>
        </div>
      </Section>

      {/* ── 03. The Working Memory ───────────────────────────────────── */}
      <Section id="working-memory">
        <div className="space-y-6 max-w-2xl mx-auto">
          <h2 className={BASE_H2}>03. The <br /> Working Memory</h2>
          <p className={BASE_SUB}>Every conversation exists inside a <strong>context window</strong> — the model's short-term memory. It can hold roughly 200,000 words at once. Go beyond that, and early context disappears. The model also has a <strong>knowledge cutoff</strong> — it doesn't know what happened last week unless you tell it.</p>
        </div>
      </Section>

      {/* ── 04. From Model to Agent ──────────────────────────────────── */}
      <Section id="model-to-agent">
        <div className="space-y-6 max-w-2xl mx-auto">
          <h2 className="font-[var(--font-space)] text-6xl md:text-8xl font-bold uppercase italic tracking-tighter leading-[0.9] text-[#D96C2C]">
            04. From <br /> Model to Agent
          </h2>
          <p className={BASE_SUB}>A plain model is a brain in a jar — brilliant, but isolated. An <strong>AI Agent</strong> gives it hands: the ability to search the web, run code, send emails, and plan multi-step tasks autonomously. The same intelligence, now able to act on the world.</p>
        </div>
      </Section>

      {/* ── 05. How Agents Remember ──────────────────────────────────── */}
      <Section id="agents-remember">
        <div className="space-y-6 max-w-2xl mx-auto">
          <h2 className={BASE_H2}>05. How <br /> Agents Remember</h2>
          <p className={BASE_SUB}>Agents solve the memory problem in four ways — what's currently in the conversation, notes stored in an <strong>external database</strong>, a searchable <strong>knowledge base (RAG)</strong>, and patterns baked into the model during training. When an agent seems to remember you, it's reading notes, not feeling familiarity.</p>
        </div>
      </Section>

      {/* ── 06. Teaching It Your Data ────────────────────────────────── */}
      <Section id="teaching-data">
        <div className="space-y-6 max-w-2xl mx-auto">
          <h2 className={BASE_H2}>06. Teaching <br /> It Your Data</h2>
          <p className={BASE_SUB}><strong>Retrieval-Augmented Generation</strong> lets the model reason over your private documents without retraining. It searches your knowledge base first, then answers using only what it found. This is how you build an AI that knows your SOPs, your research, your context.</p>
        </div>
      </Section>

      {/* ── 07. Talking to the Kitchen ────────────────────────────────── */}
      <Section id="talking-kitchen">
        <div className="space-y-6 max-w-2xl mx-auto">
          <h2 className={BASE_H2}>07. Talking <br /> to the Kitchen</h2>
          <p className={BASE_SUB}>An <strong>API</strong> is the waiter between you and the AI's brain. Instead of a chat interface, you send structured requests programmatically and get responses back. You pay per token — every word in and every word out has a cost. This is how products are built on top of AI.</p>
        </div>
      </Section>

      {/* ── 08. The Art of the Ask ───────────────────────────────────── */}
      <Section id="art-of-ask">
        <div className="space-y-6 max-w-2xl mx-auto">
          <h2 className="font-[var(--font-space)] text-6xl md:text-8xl font-bold uppercase italic tracking-tighter leading-[0.9] text-[#D96C2C]">
            08. The <br /> Art of the Ask
          </h2>
          <p className={BASE_SUB}>A prompt is not just a question — it is an instruction set. Assign a <strong>role</strong>, give <strong>context</strong>, show an <strong>example</strong>, and ask it to think <strong>step by step</strong>. The quality of your output is a direct function of the quality of your input. Garbage in, garbage out.</p>
        </div>
      </Section>

      {/* ── 09. Guard Your Keys ───────────────────────────────────────── */}
      <Section id="guard-keys">
        <div className="space-y-6 max-w-2xl mx-auto">
          <h2 className="font-[var(--font-space)] text-6xl md:text-8xl font-bold uppercase italic tracking-tighter leading-[0.9] text-red-600">
            09. Guard <br /> Your Keys
          </h2>
          <p className={BASE_SUB}>API keys are billing credentials. If leaked, attackers rack up compute costs on your account within minutes. <strong>Never hardcode keys</strong> in your code. Store them in <code>.env</code> files, keep those files out of version control, and rotate immediately if exposed.</p>
        </div>
      </Section>

      {/* ── 10. What Stays Private ───────────────────────────────────── */}
      <Section id="stays-private">
        <div className="space-y-6 max-w-2xl mx-auto">
          <h2 className={BASE_H2}>10. What <br /> Stays Private</h2>
          <p className={BASE_SUB}>Standard consumer AI interfaces log your prompts. Never paste credentials, PII, confidential strategy documents, or unreleased product data into a public AI tool. If it's sensitive enough to send to a lawyer, it's too sensitive for a free chatbot.</p>
        </div>
      </Section>

      {/* ── Finale ───────────────────────────────────────────────────── */}
      <Section>
        <div className="text-center">
          <h2 className="font-[var(--font-space)] text-6xl md:text-9xl font-bold tracking-tighter uppercase leading-none text-[var(--text)] italic">
            USE IT. <br /> VERIFY IT. <br /> GUARD IT.
          </h2>
          <p className="uppercase tracking-[1.5em] text-[#D96C2C] text-[9px] mt-12 font-[var(--font-space)]">
            Briefing Complete // Anshuman
          </p>
        </div>
      </Section>

      {/* ── 12. Thank You (Nebula) ────────────────────────────────────── */}
      <Section id="thank-you">
        <div className="text-center space-y-12">
          <h2 className="font-[var(--font-space)] text-8xl md:text-[12rem] font-bold tracking-tighter uppercase leading-none text-white animate-pulse drop-shadow-[0_0_45px_rgba(255,255,255,0.4)] italic">
            THANK <br /> YOU
          </h2>
          <div className="space-y-4">
             <p className="text-white/50 text-xs md:text-sm uppercase tracking-[1em] font-[var(--font-space)]">
               For building the future together
             </p>
             <p className="text-[#D96C2C] text-[10px] uppercase tracking-[0.5em] font-[var(--font-space)]">
               Anshuman // 2026
             </p>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="py-24 w-full flex flex-col items-center gap-12 font-[var(--font-space)] uppercase text-[10px] tracking-[0.8em] text-[var(--text)] opacity-20">
         <div className="w-[1px] h-24 bg-[var(--text)] opacity-10" />
         <span>END OF BRIEFING</span>
         <div className="w-[1px] h-24 bg-[var(--text)] opacity-10" />
      </footer>
    </div>
  );
}
