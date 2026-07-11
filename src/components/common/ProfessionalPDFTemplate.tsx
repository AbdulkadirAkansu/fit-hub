"use client";

import React from "react";
import { Activity, AlertTriangle, Calendar, CheckCircle2, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { MEASUREMENT_ANALYSES, MeasurementAnalysisKey } from "@/constants/measurementAnalysis";
import { ScheduleDay } from "@/types";

interface ProfessionalPDFTemplateProps {
  id: string;
  title: string;
  userName?: string;
  results: Array<{ label: string; value: string; subValue?: string }>;
  recommendations: string[];
  scientificNote?: string;
  schedule?: ScheduleDay[];
  analysisType?: MeasurementAnalysisKey;
}

const SectionTitle = ({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) => (
  <div className="mb-5">
    <p className="mb-1 text-[9px] font-black uppercase tracking-[0.2em] text-blue-600">{eyebrow}</p>
    <h2 className="text-xl font-black tracking-tight text-zinc-950">{children}</h2>
  </div>
);

export default function ProfessionalPDFTemplate({
  id,
  title,
  userName = "Değerli Kullanıcımız",
  results,
  recommendations,
  scientificNote,
  schedule,
  analysisType,
}: ProfessionalPDFTemplateProps) {
  const currentDate = new Date().toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" });
  const analysis = analysisType ? MEASUREMENT_ANALYSES[analysisType] : null;

  return (
    <div style={{ height: 0, overflow: "hidden", position: "relative", clear: "both" }}>
      <div
        id={id}
        data-pdf-title={title}
        className="pointer-events-none bg-white font-sans leading-relaxed text-zinc-900"
        style={{ width: "800px", minHeight: "1131px", backgroundColor: "#ffffff", color: "#18181b" }}
      >
        <div data-pdf-section className="relative overflow-hidden bg-zinc-950 px-14 pb-12 pt-14 text-white">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-600/30 blur-3xl" />
          <div className="relative flex items-start justify-between border-b border-white/10 pb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600"><Activity size={22} strokeWidth={3} /></div>
              <div><p className="text-2xl font-black tracking-tighter">FITHUB</p><p className="text-[8px] font-bold uppercase tracking-[0.22em] text-zinc-500">Analiz Laboratuvarı</p></div>
            </div>
            <div className="space-y-1 text-right text-[9px] font-bold uppercase tracking-wider text-zinc-500">
              <div className="flex items-center justify-end gap-2"><Calendar size={11} />{currentDate}</div>
              <div className="flex items-center justify-end gap-2"><Globe size={11} />fithub.app</div>
            </div>
          </div>
          <div className="relative pt-10">
            <p className="text-[9px] font-black uppercase tracking-[0.24em] text-blue-400">Kişisel ölçüm raporu</p>
            <h1 className="mt-3 max-w-[620px] text-4xl font-black leading-tight tracking-tighter">{title}</h1>
            <p className="mt-5 max-w-[620px] text-sm leading-6 text-zinc-400">Sayın <strong className="text-white">{userName}</strong>, sonuçlarınız yalnızca sayısal çıktı olarak değil; anlamı, kullanım biçimi ve ölçüm sınırlarıyla birlikte raporlanmıştır.</p>
          </div>
        </div>

        <div className="space-y-10 px-14 py-12">
          <section data-pdf-section>
            <SectionTitle eyebrow="01 / Yönetici özeti">Temel sonuçlarınız</SectionTitle>
            <div className="grid grid-cols-2 gap-4">
              {results.map((result) => (
                <div key={`${result.label}-${result.value}`} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
                  <p className="text-[8px] font-black uppercase tracking-[0.16em] text-zinc-400">{result.label}</p>
                  <p className="mt-2 text-3xl font-black tracking-tight text-blue-600">{result.value}</p>
                  {result.subValue && <p className="mt-2 text-[10px] font-bold text-zinc-500">{result.subValue}</p>}
                </div>
              ))}
            </div>
          </section>

          {analysis && (
            <>
              <section data-pdf-section className="rounded-2xl border border-blue-100 bg-blue-50/60 p-7">
                <SectionTitle eyebrow="02 / Sonucun anlamı">{analysis.title}</SectionTitle>
                <p className="text-xs leading-5 text-zinc-600">{analysis.intro}</p>
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {analysis.metrics.map((metric, index) => (
                    <div key={metric.label} className="rounded-xl bg-white p-4 shadow-sm">
                      <span className="font-mono text-[8px] font-bold text-blue-500">0{index + 1}</span>
                      <h3 className="mt-2 text-[11px] font-black text-zinc-900">{metric.label}</h3>
                      <p className="mt-1.5 text-[9px] leading-4 text-zinc-500">{metric.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              {analysis.ranges && (
                <section data-pdf-section>
                  <SectionTitle eyebrow="03 / Referans">Referans aralıkları</SectionTitle>
                  <div className="overflow-hidden rounded-2xl border border-zinc-200">
                    {analysis.ranges.map((range, index) => (
                      <div key={range.value} className={cn("grid grid-cols-[90px_120px_1fr] gap-4 px-5 py-3", index !== analysis.ranges!.length - 1 && "border-b border-zinc-100")}>
                        <strong className="text-xs text-blue-600">{range.value}</strong>
                        <span className="text-[10px] font-black uppercase tracking-wider text-zinc-700">{range.label}</span>
                        <span className="text-[10px] leading-4 text-zinc-500">{range.meaning}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <section data-pdf-section>
                <SectionTitle eyebrow={analysis.ranges ? "04 / Yorum" : "03 / Yorum"}>Sonucu bağlamıyla değerlendirin</SectionTitle>
                <div className="space-y-3">
                  {analysis.interpretation.map((item) => (
                    <div key={item} className="flex gap-3 rounded-xl bg-zinc-50 px-4 py-3 text-[10px] leading-5 text-zinc-600"><CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-500" />{item}</div>
                  ))}
                  <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[10px] leading-5 text-zinc-600"><AlertTriangle size={14} className="mt-0.5 shrink-0 text-amber-500" /><span><strong>Ölçüm sınırı:</strong> {analysis.limitations}</span></div>
                </div>
              </section>
            </>
          )}

          {schedule && (
            <section data-pdf-section>
              <SectionTitle eyebrow="Plan">Haftalık antrenman planı</SectionTitle>
              <div className="space-y-4">
                {schedule.map((day) => (
                  <article key={day.day} data-pdf-section className="overflow-hidden rounded-xl border border-zinc-200">
                    <div className="flex items-center justify-between bg-zinc-50 px-5 py-3">
                      <div>
                        <h3 className="text-xs font-black text-zinc-950">{day.day}</h3>
                        <p className="mt-0.5 text-[9px] font-bold text-zinc-500">{day.type}</p>
                      </div>
                      <span className={cn("rounded-full px-2.5 py-1 text-[8px] font-black uppercase", day.status === "Antrenman" ? "bg-blue-100 text-blue-700" : "bg-zinc-200 text-zinc-600")}>{day.status}</span>
                    </div>
                    {day.status === "Antrenman" && day.exercises.length > 0 ? (
                      <table className="w-full table-fixed text-left">
                        <thead className="border-y border-zinc-200 bg-white">
                          <tr>
                            <th className="w-[48%] px-5 py-2 text-[8px] font-black uppercase text-zinc-400">Hareket</th>
                            <th className="w-[14%] px-2 py-2 text-[8px] font-black uppercase text-zinc-400">Set</th>
                            <th className="w-[20%] px-2 py-2 text-[8px] font-black uppercase text-zinc-400">Tekrar</th>
                            <th className="w-[18%] px-2 py-2 text-[8px] font-black uppercase text-zinc-400">Dinlenme</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                          {day.exercises.map((exercise, index) => (
                            <tr key={`${day.day}-${exercise.name}-${index}`}>
                              <td className="px-5 py-2.5 text-[10px] font-bold text-zinc-800">{index + 1}. {exercise.name}</td>
                              <td className="px-2 py-2.5 text-[10px] font-bold text-zinc-600">{exercise.sets}</td>
                              <td className="px-2 py-2.5 text-[10px] font-bold text-zinc-600">{exercise.reps}</td>
                              <td className="px-2 py-2.5 text-[10px] font-bold text-zinc-600">{exercise.rest || "60-90 sn"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="px-5 py-3 text-[10px] leading-5 text-zinc-500">Toparlanma, hafif yürüyüş ve günlük harekete odaklan.</p>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}

          <section data-pdf-section>
            <SectionTitle eyebrow="Eylem planı">Uygulanabilir öneriler</SectionTitle>
            <div className="grid grid-cols-2 gap-3">
              {recommendations.map((recommendation, index) => (
                <div key={recommendation} className="flex gap-3 rounded-xl border border-zinc-200 p-4"><span className="font-mono text-[9px] font-bold text-blue-600">0{index + 1}</span><p className="text-[10px] leading-5 text-zinc-600">{recommendation}</p></div>
              ))}
            </div>
            {analysis && (
              <div className="mt-5 rounded-2xl bg-zinc-950 p-6 text-white">
                <p className="text-[8px] font-black uppercase tracking-[0.18em] text-blue-400">Önerilen sonraki adımlar</p>
                <div className="mt-4 grid grid-cols-2 gap-4">{analysis.nextSteps.map((step, index) => <div key={step} className="flex gap-3 text-[10px] leading-5 text-zinc-300"><span className="font-mono text-zinc-600">0{index + 1}</span>{step}</div>)}</div>
              </div>
            )}
          </section>

          {scientificNote && (
            <section data-pdf-section className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
              <h3 className="text-[9px] font-black uppercase tracking-[0.18em] text-blue-600">Yöntem ve bilimsel not</h3>
              <p className="mt-3 text-[10px] leading-5 text-zinc-600">{scientificNote}</p>
            </section>
          )}

          <section data-pdf-section className="border-t border-zinc-200 pt-7 text-center">
            <p className="text-[8px] font-bold uppercase leading-4 tracking-wider text-zinc-400">Bu rapor FitHub Analiz Laboratuvarı tarafından otomatik oluşturulmuştur.<br />Sonuçlar bilgilendirme amaçlıdır; tıbbi tanı veya sağlık profesyoneli önerisi yerine geçmez.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
