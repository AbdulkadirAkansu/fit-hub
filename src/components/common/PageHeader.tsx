import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PageHeaderProps {
  title: string;
  description?: string;
  kicker?: string;
}

export default function PageHeader({ title, description, kicker }: PageHeaderProps) {
  return (
    <header className="border-b border-zinc-950/10 bg-white px-5 pb-10 pt-24 dark:border-white/10 dark:bg-surface sm:px-6 sm:pb-12 sm:pt-28">
      <div className="container mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 transition-colors hover:text-primary">
          <ArrowLeft size={15} /> Ana sayfa
        </Link>
        {kicker && <p className="kicker mt-7">{kicker}</p>}
        <h1 className="mt-3 max-w-4xl text-4xl font-bold leading-tight text-ink dark:text-white sm:text-5xl">{title}</h1>
        {description && <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">{description}</p>}
      </div>
    </header>
  );
}
