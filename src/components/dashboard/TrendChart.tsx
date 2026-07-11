"use client";

import { TrendingUp } from "lucide-react";
import type { Measurement, NutritionLog, WorkoutSession } from "@/types/dashboard";

interface TrendChartProps {
  selectedChartMetric: string;
  correlationMetricB: string;
  isCorrelationMode: boolean;
  sessions: WorkoutSession[];
  nutritionLogs: NutritionLog[];
  measurements: Measurement[];
  targetWeight: string;
  targetCalories: string;
}

type SourceRow = Record<string, unknown>;

interface ChartRow {
  key: string;
  dateObj: Date;
  valA: number | null;
  valB: number | null;
  dateFormatted: string;
}

/**
 * Dashboard ölçüm/beslenme/antrenman trend grafiği (özel SVG).
 * Tek metrik veya iki metrik korelasyon modunu, eksik gün interpolasyonunu ve
 * hedef çizgisini destekler. Saf sunum: veriyi prop olarak alır.
 */
export default function TrendChart({
  selectedChartMetric,
  correlationMetricB,
  isCorrelationMode,
  sessions,
  nutritionLogs,
  measurements,
  targetWeight,
  targetCalories,
}: TrendChartProps) {
  const getYYYYMMDD = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const getVal = (item: SourceRow, metric: string) => {
    if (metric === "volume") return Number(item.total_volume);
    if (metric === "calories") return Number(item.calories);
    if (metric === "protein") return Number(item.protein);
    if (metric === "water_liters") return Number(item.water_liters);
    return Number(item[metric]);
  };

  const dateMap: Record<string, { dateObj: Date; valA: number | null; valB: number | null }> = {};

  const processSource = (source: SourceRow[], dateField: string, metric: string, targetKey: "valA" | "valB") => {
    source.forEach((item) => {
      if (!item) return;
      const dateStr = item[dateField] as string | undefined;
      if (!dateStr) return;
      const d = dateField === "log_date" ? new Date(dateStr + "T00:00:00") : new Date(dateStr);
      if (isNaN(d.getTime())) return;
      const key = getYYYYMMDD(d);

      const val = getVal(item, metric);
      if (val === null || val === undefined || isNaN(val)) return;

      if (!dateMap[key]) {
        dateMap[key] = { dateObj: d, valA: null, valB: null };
      }

      if (metric === "volume") {
        dateMap[key][targetKey] = (dateMap[key][targetKey] || 0) + val;
      } else {
        dateMap[key][targetKey] = val;
      }
    });
  };

  // Process Metric A
  if (selectedChartMetric === "volume") {
    processSource(sessions as unknown as SourceRow[], "completed_at", "volume", "valA");
  } else if (["calories", "protein", "water_liters"].includes(selectedChartMetric)) {
    processSource(nutritionLogs as unknown as SourceRow[], "log_date", selectedChartMetric, "valA");
  } else {
    processSource(measurements as unknown as SourceRow[], "created_at", selectedChartMetric, "valA");
  }

  // Process Metric B
  if (isCorrelationMode && correlationMetricB) {
    if (correlationMetricB === "volume") {
      processSource(sessions as unknown as SourceRow[], "completed_at", "volume", "valB");
    } else if (["calories", "protein", "water_liters"].includes(correlationMetricB)) {
      processSource(nutritionLogs as unknown as SourceRow[], "log_date", correlationMetricB, "valB");
    } else {
      processSource(measurements as unknown as SourceRow[], "created_at", correlationMetricB, "valB");
    }
  }

  // Convert to sorted array
  let sortedData: ChartRow[] = Object.entries(dateMap)
    .map(([key, data]) => ({
      key,
      dateObj: data.dateObj,
      valA: data.valA,
      valB: data.valB,
      dateFormatted: data.dateObj.toLocaleDateString("tr-TR", { day: "numeric", month: "short" }),
    }))
    .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

  // Filter
  if (!isCorrelationMode) {
    sortedData = sortedData.filter((d) => d.valA !== null);
  } else {
    sortedData = sortedData.filter((d) => d.valA !== null || d.valB !== null);
  }

  if (sortedData.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center h-48 bg-paper dark:bg-bg-dark rounded-2xl border border-zinc-200 dark:border-white/5">
        <TrendingUp className="text-zinc-300 dark:text-zinc-800 mb-2 animate-pulse" size={32} />
        <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest text-center px-6">Grafik çizilebilmesi için en az 2 gün veri kaydı gereklidir.</p>
      </div>
    );
  }

  // Interpolation for missing values
  const interpolatePoints = (arr: ChartRow[], key: "valA" | "valB") => {
    const result = [...arr];
    for (let i = 0; i < result.length; i++) {
      if (result[i][key] === null) {
        let prevVal: number | null = null;
        let prevIdx = -1;
        for (let j = i - 1; j >= 0; j--) {
          if (result[j][key] !== null) {
            prevVal = result[j][key];
            prevIdx = j;
            break;
          }
        }

        let nextVal: number | null = null;
        let nextIdx = -1;
        for (let j = i + 1; j < result.length; j++) {
          if (result[j][key] !== null) {
            nextVal = result[j][key];
            nextIdx = j;
            break;
          }
        }

        if (prevVal !== null && nextVal !== null) {
          const ratio = (result[i].dateObj.getTime() - result[prevIdx].dateObj.getTime()) /
                        (result[nextIdx].dateObj.getTime() - result[prevIdx].dateObj.getTime());
          result[i][key] = prevVal + (nextVal - prevVal) * ratio;
        } else if (prevVal !== null) {
          result[i][key] = prevVal;
        } else if (nextVal !== null) {
          result[i][key] = nextVal;
        }
      }
    }
    return result;
  };

  let processedData = [...sortedData];
  if (isCorrelationMode) {
    processedData = interpolatePoints(processedData, "valA");
    processedData = interpolatePoints(processedData, "valB");
  }

  const width = 600;
  const height = 180;
  const paddingLeft = 45;
  const paddingRight = isCorrelationMode ? 45 : 20;
  const paddingY = 25;

  // A Max/Min
  const valAs = processedData.map((d) => d.valA as number);
  const maxA = Math.max(...valAs);
  const minA = Math.min(...valAs);
  const rangeA = maxA - minA;
  const yMaxA = rangeA === 0 ? maxA + 5 : maxA + rangeA * 0.15;
  const yMinA = rangeA === 0 ? Math.max(0, minA - 5) : Math.max(0, minA - rangeA * 0.15);
  const yRangeA = yMaxA - yMinA;

  // B Max/Min
  let yMaxB = 0, yMinB = 0, yRangeB = 0;
  if (isCorrelationMode) {
    const valBs = processedData.map((d) => d.valB as number);
    const maxB = Math.max(...valBs);
    const minB = Math.min(...valBs);
    const rangeB = maxB - minB;
    yMaxB = rangeB === 0 ? maxB + 5 : maxB + rangeB * 0.15;
    yMinB = rangeB === 0 ? Math.max(0, minB - 5) : Math.max(0, minB - rangeB * 0.15);
    yRangeB = yMaxB - yMinB;
  }

  const points = processedData.map((d, idx) => {
    const x = paddingLeft + (idx / (processedData.length - 1)) * (width - paddingLeft - paddingRight);
    const yA = height - paddingY - (((d.valA as number) - yMinA) / yRangeA) * (height - paddingY * 2);

    let yB = 0;
    if (isCorrelationMode) {
      yB = height - paddingY - (((d.valB as number) - yMinB) / yRangeB) * (height - paddingY * 2);
    }

    return {
      x,
      yA,
      yB,
      valA: sortedData[idx].valA,
      valB: sortedData[idx].valB,
      date: d.dateFormatted,
    };
  });

  let linePathA = `M ${points[0].x} ${points[0].yA}`;
  for (let i = 1; i < points.length; i++) {
    linePathA += ` L ${points[i].x} ${points[i].yA}`;
  }
  const areaPathA = `${linePathA} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  let linePathB = "";
  let areaPathB = "";
  if (isCorrelationMode) {
    linePathB = `M ${points[0].x} ${points[0].yB}`;
    for (let i = 1; i < points.length; i++) {
      linePathB += ` L ${points[i].x} ${points[i].yB}`;
    }
    areaPathB = `${linePathB} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;
  }

  const METRICS_META: Record<string, { label: string; suffix: string }> = {
    weight: { label: "Kilo", suffix: "KG" },
    waist: { label: "Bel", suffix: "CM" },
    hips: { label: "Kalça", suffix: "CM" },
    chest: { label: "Göğüs", suffix: "CM" },
    biceps: { label: "Kol", suffix: "CM" },
    shoulder: { label: "Omuz", suffix: "CM" },
    thigh: { label: "Bacak", suffix: "CM" },
    neck: { label: "Boyun", suffix: "CM" },
    volume: { label: "Hacim", suffix: "KG" },
    calories: { label: "Kalori", suffix: "kcal" },
    protein: { label: "Protein", suffix: "g" },
    water_liters: { label: "Su", suffix: "L" },
  };

  const metaA = METRICS_META[selectedChartMetric] || { label: "", suffix: "" };
  const metaB = METRICS_META[correlationMetricB] || { label: "", suffix: "" };

  const hasTargetLine = (selectedChartMetric === "weight" && parseFloat(targetWeight) > 0) ||
                        (selectedChartMetric === "calories" && parseFloat(targetCalories) > 0);
  const targetVal = selectedChartMetric === "weight" ? parseFloat(targetWeight) : parseFloat(targetCalories);
  let targetY = 0;
  if (hasTargetLine && yRangeA > 0) {
    targetY = height - paddingY - ((targetVal - yMinA) / yRangeA) * (height - paddingY * 2);
  }

  return (
    <div className="relative w-full overflow-hidden">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
        <defs>
          <linearGradient id="chart-grad-a" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary, #7c3aed)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--color-primary, #7c3aed)" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="chart-grad-b" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-accent, #ff5a36)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="var(--color-accent, #ff5a36)" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        <line x1={paddingLeft} y1={paddingY} x2={width - paddingRight} y2={paddingY} stroke="currentColor" className="text-zinc-200 dark:text-white/5" strokeDasharray="3 3" />
        <line x1={paddingLeft} y1={(height - paddingY + paddingY) / 2} x2={width - paddingRight} y2={(height - paddingY + paddingY) / 2} stroke="currentColor" className="text-zinc-200 dark:text-white/5" strokeDasharray="3 3" />
        <line x1={paddingLeft} y1={height - paddingY} x2={width - paddingRight} y2={height - paddingY} stroke="currentColor" className="text-zinc-200 dark:text-white/10" />

        {/* Target Line */}
        {hasTargetLine && yRangeA > 0 && targetY >= paddingY && targetY <= height - paddingY && (
          <g>
            <line
              x1={paddingLeft}
              y1={targetY}
              x2={width - paddingRight}
              y2={targetY}
              stroke="var(--color-accent, #ff5a36)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              className="opacity-75"
            />
            <text
              x={width - paddingRight - 5}
              y={targetY - 5}
              textAnchor="end"
              className="text-[7px] font-black uppercase fill-primary dark:fill-accent"
            >
              Hedef: {targetVal} {metaA.suffix}
            </text>
          </g>
        )}

        {/* Left Y Axis */}
        <text x={paddingLeft - 8} y={paddingY + 4} textAnchor="end" className="text-[9px] font-black fill-primary tracking-tighter">{yMaxA.toFixed(1)}</text>
        <text x={paddingLeft - 8} y={(height - paddingY + paddingY) / 2 + 4} textAnchor="end" className="text-[9px] font-black fill-primary tracking-tighter">{((yMaxA + yMinA) / 2).toFixed(1)}</text>
        <text x={paddingLeft - 8} y={height - paddingY + 4} textAnchor="end" className="text-[9px] font-black fill-primary tracking-tighter">{yMinA.toFixed(1)}</text>

        {/* Right Y Axis */}
        {isCorrelationMode && (
          <>
            <text x={width - paddingRight + 8} y={paddingY + 4} textAnchor="start" className="text-[9px] font-black fill-accent tracking-tighter">{yMaxB.toFixed(1)}</text>
            <text x={width - paddingRight + 8} y={(height - paddingY + paddingY) / 2 + 4} textAnchor="start" className="text-[9px] font-black fill-accent tracking-tighter">{((yMaxB + yMinB) / 2).toFixed(1)}</text>
            <text x={width - paddingRight + 8} y={height - paddingY + 4} textAnchor="start" className="text-[9px] font-black fill-accent tracking-tighter">{yMinB.toFixed(1)}</text>
          </>
        )}

        <path d={areaPathA} fill="url(#chart-grad-a)" />
        {isCorrelationMode && <path d={areaPathB} fill="url(#chart-grad-b)" />}

        <path d={linePathA} fill="none" stroke="var(--color-primary, #7c3aed)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {isCorrelationMode && (
          <path d={linePathB} fill="none" stroke="var(--color-accent, #ff5a36)" strokeWidth="2.5" strokeDasharray="3 1" strokeLinecap="round" strokeLinejoin="round" />
        )}

        {points.map((pt, idx) => (
          <g key={idx} className="group/pt cursor-pointer">
            <line x1={pt.x} y1={paddingY} x2={pt.x} y2={height - paddingY} stroke="currentColor" className="text-zinc-300 dark:text-white/10 stroke-1 stroke-dashed opacity-0 group-hover/pt:opacity-60 transition-opacity" />

            <circle cx={pt.x} cy={pt.yA} r="8" className="fill-primary/20 stroke-primary/30 opacity-0 group-hover/pt:opacity-100 transition-all duration-300" />
            <circle cx={pt.x} cy={pt.yA} r="4" className="fill-white dark:fill-zinc-950 stroke-primary stroke-2" />

            {isCorrelationMode && (
              <>
                <circle cx={pt.x} cy={pt.yB} r="8" className="fill-accent/20 stroke-accent/30 opacity-0 group-hover/pt:opacity-100 transition-all duration-300" />
                <circle cx={pt.x} cy={pt.yB} r="4" className="fill-white dark:fill-zinc-950 stroke-accent stroke-2" />
              </>
            )}

            <foreignObject
              x={pt.x - 55}
              y={Math.min(pt.yA, isCorrelationMode ? pt.yB : pt.yA) - 55}
              width="110"
              height="45"
              className="opacity-0 group-hover/pt:opacity-100 transition-all duration-300 pointer-events-none z-50"
            >
              <div className="bg-zinc-950/95 dark:bg-white text-white dark:text-zinc-950 text-[7px] font-black px-2 py-1 rounded-xl shadow-xl border border-white/10 dark:border-zinc-200 text-center flex flex-col justify-center select-none backdrop-blur-md">
                <span className="opacity-60 uppercase tracking-widest text-[6px]">{pt.date}</span>
                <span className="text-primary mt-0.5">
                  {metaA.label}: {pt.valA !== null ? `${pt.valA} ${metaA.suffix}` : "Kayıt Yok"}
                </span>
                {isCorrelationMode && (
                  <span className="text-accent mt-0.2">
                    {metaB.label}: {pt.valB !== null ? `${pt.valB} ${metaB.suffix}` : "Kayıt Yok"}
                  </span>
                )}
              </div>
            </foreignObject>

            {(points.length < 6 || idx % Math.ceil(points.length / 5) === 0 || idx === points.length - 1) && (
              <text x={pt.x} y={height - 8} textAnchor="middle" className="text-[8px] font-black fill-zinc-400 dark:fill-zinc-500 uppercase tracking-wider">{pt.date}</text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
