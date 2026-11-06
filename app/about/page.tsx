"use client";

import { useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const pageMarkup = String.raw`<div id="progress"></div>



<!-- HERO -->
<section class="relative w-full overflow-hidden bg-black" style="height:100svh;min-height:620px">
  <div class="hero-bg" style="background-image:linear-gradient(160deg,rgba(0,0,0,.25),rgba(0,0,0,.65)),url('/images/xm-about-hero.jpg')"></div>
  <div class="streak"></div>
  <div class="absolute inset-0" style="background-image:linear-gradient(to top,rgba(0,0,0,.95) 0%,rgba(0,0,0,.35) 45%,rgba(0,0,0,.2) 100%)"></div>

  <div class="absolute inset-x-0 bottom-0 px-6" style="padding-bottom:92px">
    <p data-letters class="text-xs tracking-[0.4em] text-zinc-400 mb-5">ABOUT X MOTORS</p>
    <h1 data-words class="font-display font-light leading-[1.02] mb-6 max-w-2xl" style="font-size:clamp(2.7rem,11vw,6.5rem)">Cars Are Not | Just Objects.</h1>
    <p data-reveal style="--d:350ms" class="text-sm text-zinc-300 leading-relaxed max-w-xs md:max-w-md">A team of luxury car specialists with fifteen years of international experience — based in Dubai.</p>
  </div>
  <div class="absolute right-6 flex flex-col items-center gap-3" style="bottom:84px">
    <span class="text-[9px] tracking-[0.3em] text-zinc-400" style="writing-mode:vertical-rl">SCROLL</span>
    <div class="cue"></div>
  </div>
  <div class="absolute bottom-0 inset-x-0 border-t border-white/15 py-3 text-zinc-400 marquee" id="mq1"></div>
</section>

<div class="wedge" style="background:linear-gradient(to bottom right,#000 50%,#fff 50%)"></div>

<!-- WHITE -->
<section class="bg-white text-black px-6 pt-10 pb-24">
  <div class="max-w-5xl mx-auto">

    <div data-reveal class="flex items-center gap-4 mb-12">
      <span class="text-xs tracking-[0.3em] text-zinc-500">01 / THE TEAM</span><span class="h-px flex-1 bg-zinc-300"></span>
    </div>

    <div class="font-display font-light leading-[1.12]" style="font-size:clamp(1.8rem,6.6vw,3.8rem)">
      <p data-words>We are a group of experts</p>
      <p data-words style="margin-left:10%">specialized in luxury car sales</p>
      <p data-words style="margin-left:20%">with 15 years of international experience.</p>
    </div>

    <div data-reveal class="grid grid-cols-3 mt-16 border-y border-zinc-300 text-center" style="--d:100ms">
      <div class="py-8 border-r border-zinc-300">
        <p class="font-display font-light leading-none mb-3" style="font-size:clamp(2rem,8vw,3.4rem)"><span data-count data-from="0" data-to="15" data-suffix="+">0+</span></p>
        <p class="text-[10px] tracking-[0.25em] text-zinc-500">YEARS INTERNATIONAL</p>
      </div>
      <div class="py-8 border-r border-zinc-300">
        <p class="font-display font-light leading-none mb-3" style="font-size:clamp(2rem,8vw,3.4rem)"><span data-count data-from="0" data-to="750" data-suffix="K+">0K+</span></p>
        <p class="text-[10px] tracking-[0.25em] text-zinc-500">FOLLOWERS</p>
      </div>
      <div class="py-8">
        <p class="font-display font-light leading-none mb-3" style="font-size:clamp(2rem,8vw,3.4rem)">DXB</p>
        <p class="text-[10px] tracking-[0.25em] text-zinc-500">BASED IN DUBAI</p>
      </div>
    </div>

    <div data-reveal class="flex items-center gap-4 mt-28 mb-10">
      <span class="text-xs tracking-[0.3em] text-zinc-500">02 / PHILOSOPHY</span><span class="h-px flex-1 bg-zinc-300"></span>
    </div>
    <h2 data-words class="font-display font-light leading-[1.05] mb-6" style="font-size:clamp(2.2rem,9vw,5rem)">Not Assets. | A Way of Life.</h2>
    <p data-reveal class="text-sm text-zinc-600 leading-relaxed max-w-md mb-14">Cars are not just objects to us. We don&rsquo;t treat them solely as assets &mdash; they&rsquo;re an inseparable part of our lifestyles.</p>

    <div>
      <div data-vis class="py-7 border-t border-zinc-300">
        <div class="flex items-center justify-between mb-3"><span class="text-[10px] tracking-[0.35em] text-zinc-500">01</span><span class="giant-cap text-[11px] text-zinc-500 text-right">The first thing you notice.</span></div>
        <p class="giant-word font-display font-light uppercase leading-[0.9]" style="font-size:clamp(2.4rem,12vw,8rem)">Looks</p>
        <div class="giant-line h-px bg-black mt-5"></div>
      </div>
      <div data-vis class="py-7 border-t border-zinc-300">
        <div class="flex items-center justify-between mb-3"><span class="text-[10px] tracking-[0.35em] text-zinc-500">02</span><span class="giant-cap text-[11px] text-zinc-500 text-right">Why it works the way it does.</span></div>
        <p class="giant-word font-display font-light uppercase leading-[0.9]" style="font-size:clamp(2.4rem,12vw,8rem)">Engineering</p>
        <div class="giant-line h-px bg-black mt-5"></div>
      </div>
      <div data-vis class="py-7 border-t border-zinc-300">
        <div class="flex items-center justify-between mb-3"><span class="text-[10px] tracking-[0.35em] text-zinc-500">03</span><span class="giant-cap text-[11px] text-zinc-500 text-right">How it feels when it matters.</span></div>
        <p class="giant-word font-display font-light uppercase leading-[0.9]" style="font-size:clamp(2.4rem,12vw,8rem)">Handling</p>
        <div class="giant-line h-px bg-black mt-5"></div>
      </div>
    </div>

    <div class="mt-20">
      <div data-wipe class="w-full" style="aspect-ratio:1280/830">
        <div class="pxwrap" data-parallax><img class="px" src="/images/xm-about-detail-1.jpg" alt=""></div>
      </div>
      <div data-wipe style="--d:250ms;aspect-ratio:1280/1320;width:62%;margin-left:auto;margin-top:-48px;border:6px solid #fff;position:relative;box-shadow:0 30px 60px -30px rgba(0,0,0,.35)">
        <div class="pxwrap" data-parallax><img class="px" src="/images/xm-about-detail-2.jpg" alt=""></div>
      </div>
    </div>

  </div>
</section>

<div class="wedge" style="background:linear-gradient(to bottom left,#fff 50%,#000 50%)"></div>

<!-- FOUNDER -->
<section class="bg-black px-6 pt-10 pb-24">
  <div class="max-w-5xl mx-auto">
    <div data-reveal class="flex items-center gap-4 mb-10">
      <span class="text-xs tracking-[0.3em] text-zinc-500">03 / THE FOUNDER</span><span class="h-px flex-1 bg-zinc-800"></span>
    </div>
    <h2 data-words class="font-display font-light leading-[1.02] mb-14" style="font-size:clamp(2.6rem,11vw,6.5rem)">Collector. | Racer. | Founder.</h2>

    <div class="grid md:grid-cols-2 gap-10 md:gap-16 items-start mb-20">
      <div data-wipe style="aspect-ratio:4/5;position:relative;overflow:hidden">
        <div class="pxwrap" data-parallax><img class="px" src="/images/xm-founder.jpg" alt="Founder"></div>
      </div>
      <div>
        <p data-reveal class="font-display font-light text-2xl md:text-3xl leading-snug mb-6">Our founder is not only an avid car collector &mdash; he has vast racing experience.</p>
        <p data-reveal style="--d:150ms" class="text-sm text-zinc-400 leading-relaxed mb-10">When he isn&rsquo;t in the office, he&rsquo;s racing.</p>
        <p data-reveal style="--d:250ms" class="font-display italic font-light text-xl text-zinc-300">He&rsquo;s been there and done that.</p>
      </div>
    </div>

    <div>
      <div data-vis class="race py-6 md:py-8"><div class="sweep"></div><div class="relative flex items-baseline gap-5"><span class="font-display text-sm text-zinc-600 w-8">01</span><span class="race-word font-display font-light uppercase leading-[0.95]" style="font-size:clamp(1.9rem,8vw,5rem)">Radicals</span></div></div>
      <div data-vis class="race py-6 md:py-8"><div class="sweep" style="animation-delay:120ms"></div><div class="relative flex items-baseline gap-5"><span class="font-display text-sm text-zinc-600 w-8">02</span><span class="race-word font-display font-light uppercase leading-[0.95]" style="font-size:clamp(1.9rem,8vw,5rem)">GT3 Racers</span></div></div>
      <div data-vis class="race py-6 md:py-8" style="border-bottom:1px solid #27272a"><div class="sweep" style="animation-delay:240ms"></div><div class="relative flex items-baseline gap-5"><span class="font-display text-sm text-zinc-600 w-8">03</span><span class="race-word font-display font-light uppercase leading-[0.95]" style="font-size:clamp(1.9rem,8vw,5rem)">Le Mans Prototypes</span></div></div>
    </div>
  </div>
</section>

<!-- TRACK BAND -->
<section class="relative w-full overflow-hidden" style="height:70vh;min-height:420px">
  <div class="pxwrap" data-parallax><img class="px" src="/images/xm-track.jpg" alt="Race track"></div>
  <div class="absolute inset-0" style="background:rgba(0,0,0,.5)"></div>
  <div class="absolute inset-0 flex items-center justify-center text-center px-6">
    <h3 data-words class="font-display font-light leading-snug max-w-xl" style="font-size:clamp(1.8rem,6vw,3.2rem)">The track teaches what | no spec sheet can.</h3>
  </div>
</section>

<!-- CTA -->
<section class="relative px-6 py-32 bg-zinc-950 border-t border-zinc-900 text-center overflow-hidden">
  <div class="ghost">X</div>
  <div class="relative">
    <div data-draw class="dgrow mb-10"></div>
    <h3 data-words class="font-display font-light leading-[1.08] mb-10" style="font-size:clamp(2.2rem,8vw,4.5rem)">Find the one | that moves you.</h3>
    <div data-reveal style="--d:200ms" class="flex flex-col items-center gap-6">
      <a href="#" class="btn">EXPLORE INVENTORY</a>
      <a href="#" class="lnk text-xs tracking-[0.3em] text-zinc-400 hover:text-white transition-colors">VISIT THE SHOWROOM <span class="arrow">&rarr;</span></a>
    </div>
  </div>
</section>



<script>
const mqItems=['LUXURY CARS','PERFORMANCE','ENGINEERING','DUBAI'];
const mqRow=mqItems.map(t=>'<div class="mitem"><span class="t">'+t+'</span><i></i></div>').join('');
document.getElementById('mq1').innerHTML='<div class="mtrack">'+mqRow.repeat(8)+'</div>';

const toggle=(cls,th)=>new IntersectionObserver(es=>es.forEach(e=>e.target.classList.toggle(cls,e.isIntersecting)),{threshold:th});
const vis=toggle('vis',.3), rev=toggle('in',.15), giant=toggle('vis',.45);
const once=new IntersectionObserver((es,o)=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');o.unobserve(e.target)}}),{threshold:.2});

document.querySelectorAll('[data-words]').forEach(el=>{
  const toks=el.textContent.trim().split(/\s+/);let i=0;el.innerHTML='';
  toks.forEach(t=>{if(t==='|'){el.appendChild(document.createElement('br'));return}
    const w=document.createElement('span');w.className='w';const s=document.createElement('span');s.className='wi';s.style.setProperty('--i',i++);s.textContent=t;w.appendChild(s);el.appendChild(w)});
  vis.observe(el)});
document.querySelectorAll('[data-letters]').forEach(el=>{
  const txt=el.textContent;el.innerHTML='';
  [...txt].forEach((ch,i)=>{const s=document.createElement('span');s.className='l';s.style.setProperty('--i',i);s.innerHTML=ch===' '?'&nbsp;':ch;el.appendChild(s)});
  vis.observe(el)});
document.querySelectorAll('[data-reveal]').forEach(el=>rev.observe(el));
document.querySelectorAll('[data-vis]').forEach(el=>giant.observe(el));
document.querySelectorAll('[data-wipe]').forEach(el=>once.observe(el));
document.querySelectorAll('[data-draw]').forEach(el=>rev.observe(el));

document.querySelectorAll('[data-count]').forEach(el=>{
  const from=+el.dataset.from||0,to=+el.dataset.to,suf=el.dataset.suffix||'',dur=1500;let raf;
  el.textContent=from+suf;
  new IntersectionObserver(([e])=>{cancelAnimationFrame(raf);
    if(e.isIntersecting){const t0=performance.now();const step=n=>{const p=Math.min((n-t0)/dur,1);const k=1-Math.pow(1-p,3);el.textContent=Math.round(from+(to-from)*k)+suf;if(p<1)raf=requestAnimationFrame(step)};raf=requestAnimationFrame(step)}
    else el.textContent=from+suf},{threshold:.5}).observe(el)});

const pxs=[...document.querySelectorAll('[data-parallax]')];
function upd(){const vh=innerHeight;pxs.forEach(w=>{const r=w.getBoundingClientRect();if(r.bottom<-100||r.top>vh+100)return;
  const img=w.querySelector('.px,.ph');let p=(r.top+r.height/2-vh/2)/vh;p=Math.max(-.8,Math.min(.8,p));
  img.style.transform='translate3d(0,'+(-p*40).toFixed(1)+'px,0) scale(1.18)'})}
const prog=document.getElementById('progress'),nav=document.getElementById('nav');
function onS(){const h=document.documentElement.scrollHeight-innerHeight;prog.style.width=(h>0?scrollY/h*100:0)+'%';nav.classList.toggle('solid',scrollY>80);requestAnimationFrame(upd)}
addEventListener('scroll',onS,{passive:true});addEventListener('resize',upd);onS();upd();
</script>`;

export default function AboutPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;

    const observers: IntersectionObserver[] = [];
    const cleanups: Array<() => void> = [];

    const makeObserver = (className: string, threshold: number, once = false) => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(className);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            entry.target.classList.remove(className);
          }
        });
      }, { threshold });
      observers.push(observer);
      return observer;
    };

    const vis = makeObserver("vis", 0.3);
    const reveal = makeObserver("in", 0.15);
    const giant = makeObserver("vis", 0.45);
    const wipe = makeObserver("in", 0.2, true);

    root.querySelectorAll<HTMLElement>("[data-words]").forEach((el) => {
      const tokens = el.textContent?.trim().split(/\\s+/) ?? [];
      el.replaceChildren();
      let index = 0;
      tokens.forEach((token) => {
        if (token === "|") {
          el.appendChild(document.createElement("br"));
          return;
        }
        const wrapper = document.createElement("span");
        wrapper.className = "w";
        const word = document.createElement("span");
        word.className = "wi";
        word.style.setProperty("--i", String(index++));
        word.textContent = token;
        wrapper.appendChild(word);
        el.appendChild(wrapper);
      });
      vis.observe(el);
    });

    root.querySelectorAll<HTMLElement>("[data-letters]").forEach((el) => {
      const value = el.textContent ?? "";
      el.replaceChildren();
      [...value].forEach((character, index) => {
        const span = document.createElement("span");
        span.className = "l";
        span.style.setProperty("--i", String(index));
        span.innerHTML = character === " " ? "&nbsp;" : character;
        el.appendChild(span);
      });
      vis.observe(el);
    });

    root.querySelectorAll("[data-reveal], [data-draw]").forEach((el) => reveal.observe(el));
    root.querySelectorAll("[data-vis]").forEach((el) => giant.observe(el));
    root.querySelectorAll("[data-wipe]").forEach((el) => wipe.observe(el));

    root.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
      const from = Number(el.dataset.from ?? 0);
      const to = Number(el.dataset.to ?? 0);
      const suffix = el.dataset.suffix ?? "";
      let frame = 0;
      let animationId = 0;

      const counterObserver = new IntersectionObserver(([entry]) => {
        cancelAnimationFrame(animationId);
        if (entry.isIntersecting) {
          const startedAt = performance.now();
          const animate = (now: number) => {
            const progress = Math.min((now - startedAt) / 1500, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = `${Math.round(from + (to - from) * eased)}${suffix}`;
            if (progress < 1) animationId = requestAnimationFrame(animate);
          };
          animationId = requestAnimationFrame(animate);
        } else {
          el.textContent = `${from}${suffix}`;
        }
      }, { threshold: 0.5 });

      counterObserver.observe(el);
      observers.push(counterObserver);
      cleanups.push(() => {
        cancelAnimationFrame(animationId);
        counterObserver.disconnect();
      });
    });

    const parallaxItems = [...root.querySelectorAll<HTMLElement>("[data-parallax]")];
    const updateParallax = () => {
      const viewportHeight = window.innerHeight;
      parallaxItems.forEach((wrapper) => {
        const rect = wrapper.getBoundingClientRect();
        if (rect.bottom < -100 || rect.top > viewportHeight + 100) return;
        const image = wrapper.querySelector<HTMLElement>(".px, .ph");
        if (!image) return;
        let progress = (rect.top + rect.height / 2 - viewportHeight / 2) / viewportHeight;
        progress = Math.max(-0.8, Math.min(0.8, progress));
        image.style.transform = `translate3d(0, ${(-progress * 40).toFixed(1)}px, 0) scale(1.18)`;
      });
    };

    const progressBar = root.querySelector<HTMLElement>("#progress");
    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (progressBar) progressBar.style.width = `${maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0}%`;
      requestAnimationFrame(updateParallax);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateParallax);
    cleanups.push(() => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateParallax);
    });
    onScroll();
    updateParallax();

    return () => {
      observers.forEach((observer) => observer.disconnect());
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return (
    <>
      <Navbar />
      <main ref={pageRef} className="xm-about" dangerouslySetInnerHTML={{ __html: pageMarkup }} />
      <Footer />
    </>
  );
}
