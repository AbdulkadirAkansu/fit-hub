"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { BLOG_POSTS as STATIC_BLOGS } from "@/constants/blog";
import SafeImage from "@/components/common/SafeImage";
import Link from "next/link";
import { ArrowLeft, Calendar, Share2, Globe, Loader2, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

type BlogView = (typeof STATIC_BLOGS)[number] & {
  image_url?: string;
  created_at?: string;
  description?: string;
};

export default function BlogDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [post, setPost] = useState<BlogView | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    const fetchPost = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', id)
          .single();

        if (error || !data) {
          const staticPost = STATIC_BLOGS.find((p) => p.id === id);
          if (staticPost) {
            setPost(staticPost);
          } else {
            router.push("/blog");
          }
        } else {
          setPost(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-bg-dark"><Loader2 className="animate-spin text-primary" size={40} /></div>;
  if (!post) return null;

  return (
    <div className="pb-32 bg-paper dark:bg-bg-dark min-h-screen transition-colors duration-500 font-sans">
      {/* Hero Section - Neo Modernist */}
      <div className="relative h-[70vh] w-full overflow-hidden bg-bg-dark">
        <SafeImage 
          src={post.image_url || post.image} 
          alt={post.title}
          className="w-full h-full object-cover grayscale opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-10 md:p-24">
          <div className="container mx-auto px-6">
            <Link href="/blog" className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-12 hover:-translate-x-2 transition-transform">
              <ArrowLeft size={16} /> BİLGİ KÜTÜPHANESİ
            </Link>
            <div className="flex items-center gap-4 mb-8">
              <span className="px-5 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-lg">
                {post.category}
              </span>
              <span className="text-zinc-400 text-[10px] font-black uppercase tracking-widest opacity-60">
                5 DK OKUMA SÜRESİ
              </span>
            </div>
            <h1 className="text-5xl md:text-[100px] font-black text-white uppercase tracking-tighter leading-[0.85] max-w-5xl">
              {post.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <div className="bg-white dark:bg-surface border border-zinc-100 dark:border-white/5 rounded-[2.5rem] p-10 md:p-20 shadow-2xl">
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-12 mb-16 pb-12 border-b border-zinc-100 dark:border-white/5">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black uppercase border border-primary/20">
                    {post.author?.substring(0, 1)}
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">YAZAR</p>
                    <p className="text-lg font-black text-zinc-900 dark:text-white uppercase">{post.author}</p>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-paper dark:bg-bg-dark flex items-center justify-center text-zinc-500 border border-zinc-100 dark:border-white/5">
                    <Calendar size={22} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">YAYINLANMA</p>
                    <p className="text-lg font-black text-zinc-900 dark:text-white uppercase">{post.date || new Date(post.created_at || "").toLocaleDateString('tr-TR')}</p>
                  </div>
                </div>
              </div>

              {/* Article Text */}
              <div className="prose prose-2xl prose-zinc dark:prose-invert max-w-none">
                <p className="text-2xl font-bold text-zinc-600 dark:text-zinc-400 leading-relaxed mb-12 uppercase opacity-80">
                  {post.desc || post.description}
                </p>
                
                <div className="text-zinc-800 dark:text-zinc-300 font-medium leading-loose space-y-4">
                   {post.content ? post.content.split('\n').map((line: string, i: number) => {
                     if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-black text-zinc-900 dark:text-white mt-8 mb-4">{line.replace('# ', '')}</h1>;
                     if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-black text-zinc-900 dark:text-white mt-6 mb-3">{line.replace('## ', '')}</h2>;
                     if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold text-zinc-900 dark:text-white mt-4 mb-2">{line.replace('### ', '')}</h3>;
                     if (line.startsWith('- ')) return <li key={i} className="ml-5 list-disc font-medium mb-2">{line.replace('- ', '')}</li>;
                     if (line.startsWith('> ')) return <blockquote key={i} className="border-l-4 border-primary pl-4 py-1 bg-primary/5 my-4 rounded-r-lg">{line.replace('> ', '')}</blockquote>;
                     if (line.trim() === '') return <div key={i} className="h-4" />;
                     
                     const boldParsed = line.split(/(\*\*.*?\*\*)/g).map((part, idx) => {
                       if (part.startsWith('**') && part.endsWith('**')) return <strong key={idx} className="text-zinc-900 dark:text-white">{part.slice(2, -2)}</strong>;
                       return part;
                     });
                     return <p key={i} className="leading-relaxed font-medium mb-4">{boldParsed}</p>;
                   }) : (
                     <p className="italic">Bu analiz raporu spor bilimcilerimiz tarafından detaylandırılmaktadır. Çok yakında tüm teknik verilerle birlikte burada yer alacaktır.</p>
                   )}
                </div>

                <div className="my-20 p-12 bg-primary/5 dark:bg-primary/5 rounded-[2.5rem] border-l-8 border-primary font-black text-2xl text-zinc-900 dark:text-white leading-relaxed">
                  &quot;Gerçek gelişim, verinin disiplinle buluştuğu noktada başlar. FitHub Analiz Sistemi, bu yolculuktaki en güvenilir rehberinizdir.&quot;
                </div>
              </div>

              {/* Tags */}
              <div className="mt-20 pt-10 border-t border-zinc-100 dark:border-white/5 flex flex-wrap gap-6">
                {["PERFORMANS", "BİLİM", "SAĞLIK", "ANALİZ"].map(tag => (
                  <span key={tag} className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-primary transition-colors cursor-pointer">#{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-12">
            <div className="bg-bg-dark rounded-[2.5rem] p-12 text-white border border-white/5 overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[40px] group-hover:bg-primary/20 transition-all" />
              <div className="relative z-10">
                <h3 className="text-2xl font-black uppercase tracking-tight mb-10">PAYLAŞ</h3>
                <div className="flex flex-col gap-4">
                  <button className="flex items-center justify-between p-6 bg-white/5 rounded-2xl hover:bg-primary hover:text-white transition-all group">
                    <span className="text-[10px] font-black uppercase tracking-widest">WEB BAĞLANTISI</span>
                    <Globe size={20} />
                  </button>
                  <button className="flex items-center justify-between p-6 bg-white/5 rounded-2xl hover:bg-secondary transition-all">
                    <span className="text-[10px] font-black uppercase tracking-widest">SOSYAL MEDYA</span>
                    <Share2 size={20} />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-10">
              <h3 className="text-2xl font-black uppercase tracking-tight dark:text-white">İLGİLİ REHBERLER</h3>
              <div className="space-y-8">
                {STATIC_BLOGS.slice(0, 3).map((p) => (
                  <Link key={p.id} href={`/blog/${p.id}`} className="group block interactive-card p-8">
                    <h4 className="font-black text-sm uppercase tracking-tight group-hover:text-primary transition-colors leading-tight mb-4">{p.title}</h4>
                    <div className="flex items-center gap-2 text-[8px] font-black text-zinc-600 uppercase tracking-widest">
                       OKUMAYA BAŞLA <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
