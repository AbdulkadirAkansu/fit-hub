import type { ReactNode } from "react";
import PageHeader from "./PageHeader";
import MeasurementAnalysisRoute from "./MeasurementAnalysisRoute";

interface CalculatorLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
}

export default function CalculatorLayout({ title, description, children }: CalculatorLayoutProps) {
  return (
    <div className="min-h-screen bg-paper pb-24 text-zinc-950 dark:bg-bg-dark dark:text-white">
      <PageHeader title={title} description={description} kicker="Hesaplama aracı" />
      <div className="container mx-auto px-5 pt-10 sm:px-6 sm:pt-12">
        {children}
        <MeasurementAnalysisRoute />
      </div>
    </div>
  );
}
