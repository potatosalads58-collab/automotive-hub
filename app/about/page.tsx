"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setScrollProgress((currentScroll / totalScroll) * 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-black text-white font-sans selection:bg-white selection:text-black overflow-x-hidden">
      {/* Progress Bar */}
      <div
        className="fixed top-0 left-0 h-[2px] bg-white z-[70] mix-blend-difference transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Navigation Component */}
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative w-full overflow-hidden bg-black h-screen min-h-[620px] flex flex-col justify-end">
        {/* Hero Background Animation */}
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_75%_28%,rgba(255,255,255,0.14),transparent_60%),radial-gradient(40%_35%_at_18%_72%,rgba(255,255,255,0.05),transparent_70%),linear-gradient(160deg,#181818_0%,#070707_60%,#000_100%)] animate-[pulse_14s_ease-out_infinite]" />
        
        {/* Light Streak */}
        <div className="absolute -top-[20%] -bottom-[20%] w-[16%] -left-[30%] bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-[18deg] animate-[bounce_6.5s_ease-in-out_infinite]" />
        
        <div className="absolute left-4 top-[86px] text-[9px] tracking-[0.14em] border border-zinc-800 px-[10px] py-[6px] text-zinc-500 uppercase z-10 bg-black/40">
          Replace: /xm-about-hero.jpg
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/20 pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-10 px-6 pb-[92px] max-w-5xl mx-auto w-full">
          <p className="text-xs tracking-[0.4em] text-zinc-400 mb-5 uppercase">
            ABOUT X MOTORS
          </p>
          <h1 className="font-serif font-light leading-[1.02] mb-6 max-w-2xl text-[clamp(2.7rem,11vw,6.5rem)]">
            Cars Are Not <br /> Just Objects.
          </h1>
          <p className="text-sm text-zinc-300 leading-relaxed max-w-xs md:max-w-md">
            A team of luxury car specialists with fifteen years of international experience — based in Dubai.
          </p>
        </div>

        {/* Scroll Cue */}
        <div className="absolute right-6 bottom-[84px] z-10 flex flex-col items-center gap-3">
          <span className="text-[9px] tracking-[0.3em] text-zinc-400 [writing-mode:vertical-rl]">
            SCROLL
          </span>
          <div className="w-[1px] h-[48px] bg-white/75 animate-pulse" />
        </div>
      </section>

      {/* Wedge Transition */}
      <div className="h-14 md:h-24 w-full bg-gradient-to-br from-black from-50% to-white to-50%" />

      {/* WHITE SECTION (THE TEAM & PHILOSOPHY) */}
      <section className="bg-white text-black px-6 pt-10 pb-24">
        <div className="max-w-5xl mx-auto">
          
          {/* Section 01 */}
          <div className="flex items-center gap-4 mb-12">
            <span className="text-xs tracking-[0.3em] text-zinc-500">01 / THE TEAM</span>
            <span className="h-px flex-1 bg-zinc-300"></span>
          </div>

          <div className="font-serif font-light leading-[1.12] text-[clamp(1.8rem,6.6vw,3.8rem)]">
            <p>We are a group of experts</p>
            <p className="ml-[5%]] md:ml-[10%]">specialized in luxury car sales</p>
            <p className="ml-[10%]] md:ml-[20%]">with 15 years of international experience.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 mt-16 border-y border-zinc-300 text-center">
            <div className="py-8 border-r border-zinc-300">
              <p className="font-serif font-light leading-none mb-3 text-[clamp(2rem,8vw,3.4rem)]">15+</p>
              <p className="text-[10px] tracking-[0.25em] text-zinc-500">YEARS INTERNATIONAL</p>
            </div>
            <div className="py-8 border-r border-zinc-300">
              <p className="font-serif font-light leading-none mb-3 text-[clamp(2rem,8vw,3.4rem)]">750K+</p>
              <p className="text-[10px] tracking-[0.25em] text-zinc-500">FOLLOWERS</p>
            </div>
            <div className="py-8">
              <p className="font-serif font-light leading-none mb-3 text-[clamp(2rem,8vw,3.4rem)]">DXB</p>
              <p className="text-[10px] tracking-[0.25em] text-zinc-500">BASED IN DUBAI</p>
            </div>
          </div>

          {/* Section 02 / Philosophy */}
          <div className="flex items-center gap-4 mt-28 mb-10">
            <span className="text-xs tracking-[0.3em] text-zinc-500">02 / PHILOSOPHY</span>
            <span className="h-px flex-1 bg-zinc-300"></span>
          </div>

          <h2 className="font-serif font-light leading-[1.05] mb-6 text-[clamp(2.2rem,9vw,5rem)]">
            Not Assets. <br /> A Way of Life.
          </h2>
          <p className="text-sm text-zinc-600 leading-relaxed max-w-md mb-14">
            Cars are not just objects to us. We don&rsquo;t treat them solely as assets &mdash; they&rsquo;re an inseparable part of our lifestyles.
          </p>

          {/* Giant Interactive Words List */}
          <div className="space-y-4">
            <div className="py-7 border-t border-zinc-300 group cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] tracking-[0.35em] text-zinc-500">01</span>
                <span className="text-[11px] text-zinc-500 text-right">The first thing you notice.</span>
              </div>
              <p className="font-serif font-light uppercase leading-[0.9] text-[clamp(2.4rem,12vw,8rem)] text-zinc-900 group-hover:text-black transition-colors">
                Looks
              </p>
              <div className="h-px bg-zinc-300 group-hover:bg-black mt-5 transition-all"></div>
            </div>

            <div className="py-7 border-t border-zinc-300 group cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] tracking-[0.35em] text-zinc-500">02</span>
                <span className="text-[11px] text-zinc-500 text-right">Why it works the way it does.</span>
              </div>
              <p className="font-serif font-light uppercase leading-[0.9] text-[clamp(2.4rem,12vw,8rem)] text-zinc-900 group-hover:text-black transition-colors">
                Engineering
              </p>
              <div className="h-px bg-zinc-300 group-hover:bg-black mt-5 transition-all"></div>
            </div>

            <div className="py-7 border-t border-zinc-300 group cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] tracking-[0.35em] text-zinc-500">03</span>
                <span className="text-[11px] text-zinc-500 text-right">How it feels when it matters.</span>
              </div>
              <p className="font-serif font-light uppercase leading-[0.9] text-[clamp(2.4rem,12vw,8rem)] text-zinc-900 group-hover:text-black transition-colors">
                Handling
              </p>
              <div className="h-px bg-zinc-300 group-hover:bg-black mt-5 transition-all"></div>
            </div>
          </div>

        </div>
      </section>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}