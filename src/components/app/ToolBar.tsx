"use client";
import { useState } from "react";
import { Check, Copy, Eraser, RotateCcw, Share2 } from "lucide-react";
import { copyText, shareCurrentUrl } from "@/lib/share";

interface Props {
  getCopy?: () => string;
  onClear?: () => void;
  onReset?: () => void;
  share?: boolean;
  children?: React.ReactNode; // extra tool-specific controls
}

const btn = "inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-2.5 py-1.5 text-[12.5px] text-muted transition hover:text-fg hover:border-accent/50";

export function ToolBar({ getCopy, onClear, onReset, share = true, children }: Props) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-2">
      {children}
      <div className="ml-auto flex flex-wrap items-center gap-2">
        {getCopy && (
          <button className={btn} onClick={() => { copyText(getCopy()); setCopied(true); setTimeout(() => setCopied(false), 1100); }}>
            {copied ? <Check size={13} className="text-good" /> : <Copy size={13} />} Copy
          </button>
        )}
        {onClear && <button className={btn} onClick={onClear}><Eraser size={13} /> Clear</button>}
        {onReset && <button className={btn} onClick={onReset}><RotateCcw size={13} /> Reset</button>}
        {share && <button className={btn} onClick={shareCurrentUrl}><Share2 size={13} /> Share</button>}
      </div>
    </div>
  );
}
