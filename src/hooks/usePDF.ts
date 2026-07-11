"use client";

import { useCallback, useState } from "react";
import jsPDF from "jspdf";
import { toPng } from "html-to-image";

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const MARGIN_MM = 14;
const HEADER_MM = 12;
const FOOTER_MM = 12;

const safeFilename = (value: string) =>
  value.trim().replace(/[\\/:*?"<>|]+/g, "-").replace(/\s+/g, "-").slice(0, 100) || "fithub-raporu";

const pdfSafeText = (value: string) => value
  .replace(/[çÇ]/g, (letter) => letter === "ç" ? "c" : "C")
  .replace(/[ğĞ]/g, (letter) => letter === "ğ" ? "g" : "G")
  .replace(/[ıİ]/g, (letter) => letter === "ı" ? "i" : "I")
  .replace(/[öÖ]/g, (letter) => letter === "ö" ? "o" : "O")
  .replace(/[şŞ]/g, (letter) => letter === "ş" ? "s" : "S")
  .replace(/[üÜ]/g, (letter) => letter === "ü" ? "u" : "U")
  .normalize("NFKD")
  .replace(/[^\x20-\x7E]/g, "");

const waitForImages = async (root: HTMLElement) => {
  const images = Array.from(root.querySelectorAll("img"));
  await Promise.all(images.map((image) => image.complete
    ? Promise.resolve()
    : new Promise<void>((resolve) => {
        image.addEventListener("load", () => resolve(), { once: true });
        image.addEventListener("error", () => resolve(), { once: true });
      })));
};

export const usePDF = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const downloadPDF = useCallback(async (elementId: string, filename: string) => {
    if (isGenerating) return;
    const source = document.getElementById(elementId);
    if (!source) {
      setPdfError("Rapor içeriği bulunamadı.");
      return;
    }

    setIsGenerating(true);
    setPdfError(null);
    const host = document.createElement("div");

    try {
      // Gizli/overflow alanındaki şablonu görünür bir off-screen kopyada render et.
      host.setAttribute("aria-hidden", "true");
      Object.assign(host.style, {
        position: "fixed",
        left: "-10000px",
        top: "0",
        width: `${Math.max(source.scrollWidth, 800)}px`,
        zIndex: "-1",
        background: "#ffffff",
      });
      const clone = source.cloneNode(true) as HTMLElement;
      clone.removeAttribute("id");
      clone.style.height = "auto";
      clone.style.maxHeight = "none";
      clone.style.overflow = "visible";
      host.appendChild(clone);
      document.body.appendChild(host);

      await document.fonts?.ready;
      await waitForImages(clone);
      await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));

      const dataUrl = await toPng(clone, {
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        cacheBust: true,
        skipAutoScale: false,
      });
      const image = new Image();
      image.src = dataUrl;
      await image.decode();

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
      const contentWidthMm = A4_WIDTH_MM - MARGIN_MM * 2;
      const contentHeightMm = A4_HEIGHT_MM - MARGIN_MM * 2 - HEADER_MM - FOOTER_MM;
      const pixelsPerMm = image.width / contentWidthMm;
      const sliceHeightPx = Math.max(1, Math.floor(contentHeightMm * pixelsPerMm));
      const cloneRect = clone.getBoundingClientRect();
      const renderedScale = image.width / Math.max(1, cloneRect.width);
      const protectedRanges = Array.from(clone.querySelectorAll<HTMLElement>("[data-pdf-section], .page-break-inside-avoid"))
        .map((element) => {
          const rect = element.getBoundingClientRect();
          return {
            top: Math.max(0, Math.round((rect.top - cloneRect.top) * renderedScale)),
            bottom: Math.min(image.height, Math.round((rect.bottom - cloneRect.top) * renderedScale)),
          };
        })
        .filter((range) => range.bottom > range.top && range.bottom - range.top <= sliceHeightPx * 0.92)
        .sort((a, b) => a.top - b.top);

      const pageSlices: Array<{ top: number; height: number }> = [];
      let cursor = 0;
      while (cursor < image.height) {
        const idealEnd = Math.min(image.height, cursor + sliceHeightPx);
        if (idealEnd === image.height) {
          pageSlices.push({ top: cursor, height: image.height - cursor });
          break;
        }

        const crossingBlock = protectedRanges.find((range) =>
          range.top < idealEnd && range.bottom > idealEnd && range.top > cursor + sliceHeightPx * 0.45
        );
        const sectionStarts = protectedRanges
          .map((range) => range.top)
          .filter((boundary) => boundary > cursor + sliceHeightPx * 0.58 && boundary <= idealEnd);
        const suggestedEnd = crossingBlock?.top ?? (sectionStarts.length > 0 ? Math.max(...sectionStarts) : idealEnd);
        const pageEnd = suggestedEnd > cursor ? suggestedEnd : idealEnd;
        pageSlices.push({ top: cursor, height: pageEnd - cursor });
        cursor = pageEnd;
      }

      const totalPages = pageSlices.length;
      const reportTitle = source.dataset.pdfTitle || clone.dataset.pdfTitle || "FitHub Analiz Raporu";

      for (let page = 0; page < pageSlices.length; page += 1) {
        if (page > 0) pdf.addPage();
        const { top: sourceY, height: currentHeight } = pageSlices[page];
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = currentHeight;
        const context = canvas.getContext("2d");
        if (!context) throw new Error("PDF tuvali oluşturulamadı.");
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, sourceY, image.width, currentHeight, 0, 0, image.width, currentHeight);

        const renderedHeightMm = currentHeight / pixelsPerMm;
        pdf.addImage(canvas.toDataURL("image/jpeg", 0.94), "JPEG", MARGIN_MM, MARGIN_MM + HEADER_MM, contentWidthMm, renderedHeightMm, undefined, "FAST");

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(7.5);
        pdf.setTextColor(79, 70, 229);
        pdf.text("FITHUB LAB", MARGIN_MM, MARGIN_MM + 3.5);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(113, 113, 122);
        pdf.text(pdfSafeText(reportTitle).slice(0, 74), A4_WIDTH_MM - MARGIN_MM, MARGIN_MM + 3.5, { align: "right" });
        pdf.setDrawColor(228, 228, 231);
        pdf.line(MARGIN_MM, MARGIN_MM + 7, A4_WIDTH_MM - MARGIN_MM, MARGIN_MM + 7);
        pdf.line(MARGIN_MM, A4_HEIGHT_MM - MARGIN_MM - 7, A4_WIDTH_MM - MARGIN_MM, A4_HEIGHT_MM - MARGIN_MM - 7);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(7.5);
        pdf.setTextColor(113, 113, 122);
        pdf.text(`Sayfa ${page + 1} / ${totalPages}`, A4_WIDTH_MM - MARGIN_MM, A4_HEIGHT_MM - MARGIN_MM - 2, { align: "right" });
        pdf.text(`Olusturulma: ${new Date().toLocaleDateString("tr-TR")}`, MARGIN_MM, A4_HEIGHT_MM - MARGIN_MM - 2);
      }

      pdf.setProperties({ title: pdfSafeText(filename), subject: "FitHub bilimsel performans raporu", creator: "FitHub Lab" });
      pdf.save(`${safeFilename(filename)}.pdf`);
    } catch (error) {
      console.error("PDF oluşturma hatası:", error);
      setPdfError("PDF oluşturulamadı. Görsellerin yüklenmesini bekleyip tekrar deneyin.");
    } finally {
      host.remove();
      setIsGenerating(false);
    }
  }, [isGenerating]);

  return { downloadPDF, isGenerating, pdfError };
};
