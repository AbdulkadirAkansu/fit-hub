"use client";

interface RangeSliderProps {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}

/**
 * Hesaplama sayfalarındaki standart kaydırma (slider) kontrolü.
 * Etiket + büyük değer göstergesi + range input. Tüm "premium" hesaplayıcılar
 * (vki, ideal-kilo, su, kardiyo, bel-boy, bel-kalca, 1rm, plaka) bunu kullanır.
 * --range-progress değişkeni globals.css'teki dolgu gradyanını besler.
 */
export default function RangeSlider({ label, value, unit, min, max, step, onChange }: RangeSliderProps) {
  const progress = ((value - min) / (max - min)) * 100;

  return (
    <div className="relative z-10 space-y-6">
      <div className="flex items-end justify-between gap-4">
        <label className="field-label pb-1.5">{label}</label>
        <div className="flex items-baseline gap-1.5">
          <span className="font-display text-5xl font-black tracking-tighter text-zinc-950 tabular dark:text-white">{value}</span>
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-400">{unit}</span>
        </div>
      </div>
      <div className="relative pt-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          style={{ "--range-progress": `${progress}%` } as React.CSSProperties}
          className="h-2 w-full"
        />
        <div className="mt-2.5 flex justify-between font-mono text-[10px] font-bold text-zinc-400 dark:text-zinc-500">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>
    </div>
  );
}
