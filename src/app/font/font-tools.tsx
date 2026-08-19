"use client";

import { Check, Copy } from "@phosphor-icons/react";
import { useState } from "react";

export function FontTester() {
  const [text, setText] = useState("HELLO THERE");
  const [size, setSize] = useState(88);

  return (
    <section className="font-tester" aria-labelledby="font-tester-title">
      <div className="font-tester-controls">
        <label>
          <span id="font-tester-title">Try the font</span>
          <input
            type="text"
            value={text}
            maxLength={80}
            spellCheck={false}
            aria-label="Font preview text"
            onChange={(event) => setText(event.target.value)}
          />
        </label>
        <label className="font-size-control">
          <span>Size <output>{size}px</output></span>
          <input
            type="range"
            min="28"
            max="144"
            value={size}
            aria-label="Font preview size"
            onChange={(event) => setSize(Number(event.target.value))}
          />
        </label>
      </div>
      <p className="font-tester-output" style={{ fontSize: `${size}px` }}>
        {text || "TYPE SOMETHING"}
      </p>
    </section>
  );
}

export function CopyCssButton({ code }: { code: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  async function copy() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = code;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.append(textarea);
        textarea.select();
        const copied = document.execCommand("copy");
        textarea.remove();
        if (!copied) throw new Error("Copy command failed");
      }
      setStatus("copied");
    } catch {
      setStatus("error");
    }
    window.setTimeout(() => setStatus("idle"), 1800);
  }

  return (
    <button type="button" className="font-copy-button" onClick={copy} aria-live="polite">
      {status === "copied" ? <Check weight="bold" /> : <Copy />}
      {status === "copied" ? "Copied" : status === "error" ? "Copy failed" : "Copy CSS"}
    </button>
  );
}
