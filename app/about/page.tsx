"use client";

import { useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const pageStyles = String.raw`
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=Inter:wght@300;400;500;600;800&display=swap');
html{scroll-behavior:smooth}
body{font-family:'Inter',sans-serif;background:#000;color:#fff;overflow-x:hidden}
.font-display{font-family:'Cormorant Garamond',serif}

#progress{position:fixed;top:0;left:0;height:2px;width:0;background:#fff;z-index:70;mix-blend-mode:difference}
#nav{position:fixed;top:0;left:0;right:0;z-index:55;display:flex;align-items:center;justify-content:space-between;padding:20px 24px;transition:background .5s,border-color .5s;border-bottom:1px solid transparent}
#nav.solid{background:#000;border-bottom-color:#27272a}
.burger span{display:block;width:24px;height:1px;background:#fff;margin:5px 0}
.wordmark{font-weight:800;letter-spacing:.22em;font-size:14px}

[data-reveal]{opacity:0;transform:translateY(28px);filter:blur(6px);transition:opacity .8s ease var(--d,0ms),transform .8s cubic-bezier(.16,1,.3,1) var(--d,0ms),filter .8s ease var(--d,0ms)}
[data-reveal].in{opacity:1;transform:none;filter:none}
.w{display:inline-block;overflow:hidden;margin-right:.28em;vertical-align:bottom;padding-bottom:.08em}
.wi{display:inline-block;transform:translateY(115%);opacity:0;transition:transform .75s cubic-bezier(.16,1,.3,1) calc(var(--i)*70ms),opacity .6s ease calc(var(--i)*70ms)}
.vis .wi{transform:none;opacity:1}
.l{display:inline-block;opacity:0;transform:translateY(10px);filter:blur(3px);transition:opacity .5s ease calc(var(--i)*22ms),transform .5s ease calc(var(--i)*22ms),filter .5s ease calc(var(--i)*22ms)}
.vis .l{opacity:1;transform:none;filter:none}

.hero-bg{position:absolute;inset:0;background:radial-gradient(60% 50% at 75% 28%,rgba(255,255,255,.14),transparent 60%),radial-gradient(40% 35% at 18% 72%,rgba(255,255,255,.05),transparent 70%),linear-gradient(160deg,#181818 0%,#070707 60%,#000 100%);animation:ken 14s ease-out forwards}
@keyframes ken{from{transform:scale(1.12)}to{transform:scale(1)}}
.streak{position:absolute;top:-20%;bottom:-20%;width:16%;left:-30%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.09),transparent);transform:skewX(-18deg);animation:streak 6.5s ease-in-out infinite}
@keyframes streak{0%{left:-30%}60%,100%{left:130%}}
.chip{position:absolute;left:16px;top:86px;font-size:9px;letter-spacing:.14em;border:1px solid #333;padding:6px 10px;color:#777;z-index:5;text-transform:uppercase}
.cue{width:1px;height:48px;background:rgba(255,255,255,.75);animation:cue 2.2s ease-in-out infinite}
@keyframes cue{0%{transform:scaleY(0);transform-origin:top}45%{transform:scaleY(1);transform-origin:top}55%{transform:scaleY(1);transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom}}

.marquee{overflow:hidden;white-space:nowrap}
.mtrack{display:flex;width:max-content;animation:mq 32s linear infinite}
.mitem{display:flex;align-items:center;flex-shrink:0}
.mitem span.t{padding:0 24px;font-size:11px;letter-spacing:.4em}
.mitem i{width:4px;height:4px;border-radius:50%;background:currentColor;opacity:.5}
@keyframes mq{to{transform:translateX(-50%)}}

.wedge{height:56px;width:100%}
@media(min-width:768px){.wedge{height:96px}}

.giant-word{color:transparent;-webkit-text-stroke:1px #0a0a0a;transition:color .9s ease .15s;white-space:nowrap}
.vis .giant-word{color:#0a0a0a}
.giant-line{transform:scaleX(0);transform-origin:left;transition:transform 1.1s cubic-bezier(.16,1,.3,1) .2s}
.vis .giant-line{transform:scaleX(1)}
.giant-cap{opacity:0;transform:translateY(8px);transition:all .7s ease .5s}
.vis .giant-cap{opacity:1;transform:none}

.race{position:relative;overflow:hidden;border-top:1px solid #27272a}
.race-word{color:transparent;-webkit-text-stroke:1px rgba(255,255,255,.85);transition:color .9s ease .25s,letter-spacing .6s ease}
.vis .race-word{color:#fff}
.race:hover .race-word{letter-spacing:.05em}
.sweep{position:absolute;top:0;bottom:0;left:0;width:35%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.16),transparent);transform:translateX(-120%);pointer-events:none}
.vis .sweep{animation:sweep 1.4s cubic-bezier(.65,0,.35,1) forwards}
@keyframes sweep{to{transform:translateX(380%)}}

[data-wipe]{clip-path:inset(100% 0 0 0);transition:clip-path 1.3s cubic-bezier(.77,0,.175,1) var(--d,0ms)}
[data-wipe].in{clip-path:inset(0 0 0 0)}
.pxwrap{position:relative;overflow:hidden;width:100%;height:100%}
.px{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;will-change:transform;transform:scale(1.18)}
.ph{background:repeating-linear-gradient(135deg,#121212 0 2px,#0b0b0b 2px 14px);position:absolute;inset:0;will-change:transform;transform:scale(1.18)}
.ph-tag{position:absolute;left:14px;bottom:14px;z-index:3;font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:#8a8a8a;border:1px solid #333;padding:6px 10px;background:rgba(0,0,0,.5)}

.ghost{position:absolute;left:50%;top:50%;font-family:'Cormorant Garamond',serif;font-size:min(95vw,860px);line-height:1;color:transparent;-webkit-text-stroke:1px rgba(255,255,255,.08);transform:translate(-50%,-50%);animation:gf 9s ease-in-out infinite;pointer-events:none;user-select:none}
@keyframes gf{0%,100%{transform:translate(-50%,-50%) scale(1)}50%{transform:translate(-50%,-53%) scale(1.05)}}
.dgrow{height:1px;background:#52525b;width:0;transition:width 1.1s cubic-bezier(.16,1,.3,1) .2s;margin:0 auto}
.dgrow.in{width:140px}
.btn{display:inline-block;border:1px solid rgba(255,255,255,.7);padding:14px 40px;font-size:12px;letter-spacing:.3em;transition:all .3s}
.btn:hover{background:#fff;color:#000}
.arrow{display:inline-block;transition:transform .3s}
.lnk:hover .arrow{transform:translateX(6px)}

.hero-photo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.62}
.detail-frame img{width:100%;height:100%;object-fit:cover;display:block}
.px{display:block}
`;

const pageMarkup = String.raw`
<div id="progress"></div>



<!-- HERO -->
<section class="relative w-full overflow-hidden bg-black" style="height:100svh;min-height:620px">
  <div class="hero-bg"></div>
  <div class="streak"></div>
  <img src="/images/xm-about-hero.jpg" alt="X Motors luxury car" class="hero-photo" />
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
        <div class="pxwrap" data-parallax><img class="px" src="/images/xm-about-detail-1.jpg" alt="X Motors detail 1" /></div>
      </div>
      <div data-wipe style="--d:250ms;aspect-ratio:1280/1320;width:62%;margin-left:auto;margin-top:-48px;border:6px solid #fff;position:relative;box-shadow:0 30px 60px -30px rgba(0,0,0,.35)">
        <div class="pxwrap" data-parallax><img class="px" src="/images/xm-about-detail-2.jpg" alt="X Motors detail 2" /></div>
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
        <div class="pxwrap" data-parallax><img class="px" src="/images/xm-founder.jpg" alt="X Motors founder" /></div>
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
  <div class="pxwrap" data-parallax><img class="px" src="/images/xm-track.jpg" alt="Racing track" /></div>
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



`;

const pageScript = String.raw`
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
function onS(){const h=document.documentElement.scrollHeight-innerHeight;prog.style.width=(h>0?scrollY/h*100:0)+'%';if(nav)nav.classList.toggle('solid',scrollY>80);requestAnimationFrame(upd)}
addEventListener('scroll',onS,{passive:true});addEventListener('resize',upd);onS();upd();
`;

export default function AboutPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;
    const run = new Function("root", pageScript);
    run(root);
    return () => {
      // Disconnect observers and listeners when the page unmounts.
      window.dispatchEvent(new Event("xmotors-about-cleanup"));
    };
  }, []);

  return (
    <>
      <style>{pageStyles}</style>
      <Navbar />
      <div ref={pageRef} dangerouslySetInnerHTML={{ __html: pageMarkup }} />
      <Footer />
    </>
  );
}
