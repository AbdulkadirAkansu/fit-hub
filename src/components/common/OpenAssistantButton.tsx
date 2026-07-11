"use client";

interface OpenAssistantButtonProps {
  className?: string;
  children: React.ReactNode;
}

/** Sağ alttaki asistan widget'ını herhangi bir sayfadan açan buton. */
export default function OpenAssistantButton({ className, children }: OpenAssistantButtonProps) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event("toggle-global-assistant"))}
    >
      {children}
    </button>
  );
}
