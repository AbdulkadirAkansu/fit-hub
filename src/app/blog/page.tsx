"use client";

import React, { useState, useEffect } from "react";
import PageHeader from "@/components/common/PageHeader";
import { BLOG_POSTS as STATIC_BLOGS } from "@/constants/blog";
import SafeImage from "@/components/common/SafeImage";
import Link from "next/link";
import { ArrowRight, Calendar, User, Clock, Sparkles } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

type BlogView = (typeof STATIC_BLOGS)[number] & {
  image_url?: string;
  created_at?: string;
  description?: string;
};

export default function BlogPage() {
  // Statik veriyle anında başla
  const [blogs, setBlogs] = useState<BlogView[]>(STATIC_BLOGS);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (!error && data && data.length > 0) {
          setBlogs(data as BlogView[]);
        }
      } catch {
        // Statik veri zaten yüklü
      }
    };

    fetchBlogs();
  }, []);


  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="pb-32 bg-paper dark:bg-bg-dark min-h-screen transition-colors duration-500 font-sans overflow-hidden">
      <PageHeader
        title="Bilgi Kütüphanesi"
        description="Beslenme, antrenman ve spor bilimi üzerine güncel akademik rehberler."
        kicker="Spor Bilimi Arşivi"
      />

      <div className="container mx-auto px-6 mt-16 relative z-20">
        
        {/* Featured Post Highlight (Optional, just styling the first item differently if it exists) */}
        {blogs.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
            <Link href={`/blog/${blogs[0].id}`} className="group relative bg-white dark:bg-surface border border-zinc-200 dark:border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col lg:flex-row min-h-[400px] shadow-2xl hover:border-primary/30 transition-all">
               <div className="lg:w-1/2 relative overflow-hidden">
                 <SafeImage 
                    src={blogs[0].image_url || blogs[0].image} 
                    alt={blogs[0].title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                 />
               </div>
               <div className="lg:w-1/2 p-10 md:p-16 flex flex-col justify-center relative">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
                 
                 <div className="flex items-center gap-3 mb-8">
                    <span className="flex h-2 w-2 rounded-full bg-primary animate-ping" />
                    <span className="font-mono text-[10px] font-black uppercase tracking-[0.3em] text-primary">ÖNE ÇIKAN ANALİZ</span>
                 </div>
                 
                 <h3 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter mb-6 leading-tight group-hover:text-primary transition-colors">
                    {blogs[0].title}
                 </h3>
                 <p className="text-zinc-500 dark:text-zinc-400 font-bold leading-relaxed mb-10 line-clamp-3">
                    {blogs[0].desc || blogs[0].description}
                 </p>
                 
                 <div className="mt-auto flex items-center justify-between">
                   <div className="flex gap-6 font-mono text-[10px] font-black uppercase tracking-widest text-zinc-400">
                     <span className="flex items-center gap-2"><Calendar size={14} className="text-primary"/> {blogs[0].date || new Date(blogs[0].created_at || "").toLocaleDateString('tr-TR')}</span>
                     <span className="flex items-center gap-2"><Clock size={14} className="text-primary"/> 5 DK OKUMA</span>
                   </div>
                   <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-bg-dark flex items-center justify-center text-zinc-400 group-hover:bg-primary group-hover:text-white transition-all shadow-inner group-hover:shadow-xl group-hover:scale-110">
                     <ArrowRight size={20} />
                   </div>
                 </div>
               </div>
            </Link>
          </motion.div>
        )}

        <AnimatePresence mode="popLayout">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {blogs.slice(1).map((post) => (
              <motion.div key={post.id} variants={itemVariants}>
                <Link 
                  href={`/blog/${post.id}`}
                  className="interactive-card group flex flex-col p-0 overflow-hidden bg-white dark:bg-surface border border-zinc-200 dark:border-white/5 shadow-sm min-h-[450px]"
                >
                  <div className="relative h-64 overflow-hidden shrink-0">
                    <SafeImage 
                      src={post.image_url || post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale opacity-80 dark:opacity-60 group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent dark:from-surface" />
                    <div className="absolute top-6 left-6">
                      <span className="px-5 py-2 bg-zinc-900 dark:bg-bg-dark text-white font-mono text-[9px] font-black uppercase tracking-widest rounded-xl shadow-xl border border-white/10 backdrop-blur-md">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-8 md:p-10 flex flex-col flex-grow relative z-10">
                    <div className="flex items-center gap-6 mb-6 text-zinc-400 font-mono text-[9px] font-black uppercase tracking-widest">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-primary" />
                        {post.date || new Date(post.created_at || "").toLocaleDateString('tr-TR')}
                      </div>
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-primary" />
                        {post.author?.split(' ')[0]}
                      </div>
                    </div>

                    <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-4 uppercase tracking-tight group-hover:text-primary transition-colors leading-tight">
                      {post.title}
                    </h3>
                    
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm font-bold leading-relaxed mb-10 line-clamp-3">
                      {post.desc || post.description}
                    </p>

                    <div className="mt-auto pt-6 border-t border-zinc-100 dark:border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-zinc-400 font-mono text-[9px] font-black uppercase tracking-widest">
                        <Clock size={14} /> 5 DK OKUMA
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-paper dark:bg-bg-dark flex items-center justify-center text-zinc-400 group-hover:bg-primary group-hover:text-white transition-all shadow-inner group-hover:shadow-xl">
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {blogs.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-48 bg-white dark:bg-surface rounded-[2.5rem] border border-dashed border-zinc-200 dark:border-white/5">
            <Sparkles size={48} className="mx-auto text-zinc-300 dark:text-zinc-800 mb-8" />
            <h4 className="text-2xl font-black text-zinc-500 uppercase tracking-tighter">İçerik Bulunamadı.</h4>
          </motion.div>
        )}
      </div>
    </div>
  );
}
