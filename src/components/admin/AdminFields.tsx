"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/** Editör genelinde paylaşılan kompakt alan (input/textarea) sınıfı. */
export const FIELD_CLS =
  "w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-lg px-3 py-2 font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-sm";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ElementType;
}

export function InputField({ label, icon: Icon, ...props }: InputFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.12em] ml-1">{label}</label>
      <div className="relative group">
        {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400 group-focus-within:text-primary transition-colors duration-300" size={15} />}
        <input
          {...props}
          className={cn(
            "w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-xl py-2.5 font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-sm",
            Icon ? "pl-10 pr-4" : "px-4"
          )}
        />
      </div>
    </div>
  );
}

interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export function TextAreaField({ label, ...props }: TextAreaFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.12em] ml-1">{label}</label>
      <textarea
        {...props}
        className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-xl px-4 py-2.5 font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-sm resize-y min-h-[100px]"
      />
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  icon?: React.ElementType;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: readonly (string | number | { value: string; label: string })[];
  required?: boolean;
}

/** Kategori/seviye gibi sabit seçenekler için dropdown (elle metin yerine). */
export function SelectField({ label, icon: Icon, value, onChange, options, required }: SelectFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.12em] ml-1">{label}</label>
      <div className="relative group">
        {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400 group-focus-within:text-primary transition-colors duration-300 pointer-events-none" size={15} />}
        <select
          value={value}
          onChange={onChange}
          required={required}
          className={cn(
            "w-full appearance-none bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-xl py-2.5 pr-9 font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-zinc-900 dark:text-white text-sm cursor-pointer",
            Icon ? "pl-10" : "pl-4"
          )}
        >
          {(() => {
            const normalized = options.map((opt) =>
              typeof opt === "object" ? opt : { value: String(opt), label: String(opt) }
            );
            // Mevcut (DB'den gelen) değer kanonik listede yoksa kaybolmasın diye ekle.
            const current = String(value ?? "");
            if (current && !normalized.some((o) => o.value === current)) {
              normalized.unshift({ value: current, label: `${current} (mevcut)` });
            }
            return normalized.map((o) => (
              <option key={o.value} value={o.value} className="bg-white dark:bg-surface">{o.label}</option>
            ));
          })()}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={15} />
      </div>
    </div>
  );
}
