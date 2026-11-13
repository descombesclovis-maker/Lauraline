(()=>{
"use strict";
const secret="0212";
let typed="",state="idle",reactionTimer=0,navigationStarted=false;
const scene=document.getElementById("scene"),digicode=document.getElementById("digicode"),
      actorWrap=document.getElementById("actorWrap"),idle=document.getElementById("idle"),
      video=document.getElementById("reaction"),fallback=document.getElementById("fallback"),
      status=document.getElementById("status"),slots=[...document.querySelectorAll(".slot")];
const onApple=/iPhone|iPad|iPod/.test(navigator.userAgent)||
    (/Safari/.test(navigator.userAgent)&&!/Chrome|Chromium|Edg/.test(navigator.userAgent));
function seeded(n){let x=Math.sin(n*123.529+8.13)*43758.5453;return x-Math.floor(x)}
function makeFlowers(){
 const field=document.getElementById("meadowFlowers");
 if(!field)return;
 const colors=["#ffdfdf","#fff3c7","#ffd1df","#d7b4ee","#fff9e4","#f6aecb"];
 for(let i=0;i<96;i++){
  const p=seeded(i+1),q=seeded(i+170),near=q>.57;
  const size=(near?13:7)+seeded(i+390)*(near?19:10);
  const flower=document.createElement("span"); flower.className="wildflower";
  flower.style.cssText="--x:"+(p*103-2).toFixed(2)+"%;--y:"+(64+q*37).toFixed(2)+"%;--w:"+size.toFixed(1)+"px;--h:"+(size*2.3).toFixed(1)+"px;--time:"+(2.3+seeded(i+550)*3.3).toFixed(2)+"s;--phase:"+(-seeded(i+610)*4).toFixed(2)+"s;--lean:"+(seeded(i+680)*18-9).toFixed(1)+"deg;--o:"+(near?.89:.65);
  const c=colors[Math.floor(seeded(i+800)*colors.length)];
  flower.innerHTML='<svg viewBox="0 0 42 42" aria-hidden="true"><g fill="'+c+'"><ellipse cx="21" cy="11" rx="7" ry="12"/><ellipse cx="31" cy="17" rx="7" ry="12" transform="rotate(65 31 17)"/><ellipse cx="28" cy="29" rx="7" ry="12" transform="rotate(139 28 29)"/><ellipse cx="14" cy="29" rx="7" ry="12" transform="rotate(220 14 29)"/><ellipse cx="11" cy="17" rx="7" ry="12" transform="rotate(295 11 17)"/></g><circle cx="21" cy="21" r="6.8" fill="#f8c55d"/><circle cx="19.5" cy="19.5" r="2" fill="#ffeab2"/></svg>';
  field.appendChild(flower);
 }
}
function makeRoses(){
 const bouquet=document.getElementById("introBouquet");if(!bouquet)return;
 const shades=[["#ffa3b8","#a73363"],["#ffc9d7","#d8547d"],["#ffb1cb","#cf568d"],["#ef9ac7","#98315d"]];
 for(let i=0;i<46;i++){
  const a=i*2.399963,dist=(19+seeded(i+220)*52),dx=Math.cos(a)*dist,dy=Math.sin(a)*dist*.72;
  const shade=shades[i%shades.length],rose=document.createElement("span");
  rose.className="intro-rose";
  rose.style.cssText="--dx:"+dx.toFixed(2)+"vw;--dy:"+dy.toFixed(2)+"vh;--size:"+(25+seeded(i+100)*52).toFixed(0)+"px;--delay:"+(seeded(i+5)*.62).toFixed(2)+"s;--turn:"+(seeded(i+40)*220-110).toFixed(0)+"deg;--zoom:"+(0.75+seeded(i+85)*1.2).toFixed(2);
  rose.innerHTML='<svg viewBox="0 0 80 94" aria-hidden="true"><path d="M41 55Q51 68 46 94" stroke="#5e8f56" stroke-width="5" fill="none"/><path d="M43 70Q25 56 12 69Q32 79 43 72M44 82Q63 68 74 77Q61 86 45 85" fill="#629855"/><g fill="'+shade[0]+'" stroke="'+shade[1]+'" stroke-width="1.8"><path d="M39 22Q14 -4 8 31Q5 51 30 59Q48 73 61 56Q81 41 69 16Q55 -3 39 22Z"/><path d="M42 25Q20 9 19 36Q20 51 39 58Q63 58 65 37Q66 15 42 25Z"/><path d="M42 26Q28 22 29 39Q29 49 43 53Q55 50 56 37Q54 27 42 26Z"/></g><path d="M40 33Q55 26 51 40Q47 49 37 43Q33 37 43 35Q47 37 43 40" fill="none" stroke="'+shade[1]+'" stroke-linecap="round" stroke-width="3.5"/></svg>';
  bouquet.appendChild(rose);
 }
 const intro=document.getElementById("intro");
 if(intro)intro.addEventListener("animationend",e=>{if(e.target===intro)intro.remove()},{once:true});
}
function display(){slots.forEach((el,i)=>{el.classList.toggle("filled",i<typed.length);el.textContent=typed[i]||""})}
function resetReaction(){
 clearTimeout(reactionTimer);video.pause();video.onended=null;video.onerror=null;
 video.classList.remove("visible");fallback.classList.remove("visible");
 idle.classList.remove("hidden");idle.src=idle.dataset.rest;
 actorWrap.classList.remove("reacting");digicode.classList.remove("error","correct");
 scene.classList.remove("happy");state="idle";status.textContent="";
}
function press(d){
 if(state==="playing"||navigationStarted)return;
 if(state==="wrong"||state==="correct"){resetReaction();typed=""}
 if(typed.length>=4)return;typed+=d;display();
}
function erase(){
 if(state==="playing"||navigationStarted)return;
 if(state==="wrong"||state==="correct"){resetReaction();typed=""}else typed=typed.slice(0,-1);
 display();
}
function nextPage(){
 if(navigationStarted)return;navigationStarted=true;
 clearTimeout(reactionTimer);status.textContent="Code correct, ouverture de la suite";
 const wipe=document.createElement("div");wipe.className="screen-wipe";document.body.appendChild(wipe);
 requestAnimationFrame(()=>requestAnimationFrame(()=>wipe.classList.add("active")));
 setTimeout(()=>{window.location.href="./suite.html"},950);
}
function reaction(correct){
 state="playing";actorWrap.classList.add("reacting");
 digicode.classList.remove("error","correct");
 if(correct){digicode.classList.add("correct");scene.classList.add("happy");status.textContent="Code correct"}
 else{void digicode.offsetWidth;digicode.classList.add("error");status.textContent="Code incorrect"}
 const showFallback=()=>{
  video.pause();video.classList.remove("visible");video.onended=null;
  fallback.src=correct?fallback.dataset.happy:fallback.dataset.angry;
  fallback.onload=()=>{fallback.classList.add("visible");idle.classList.add("hidden")};
  if(fallback.complete&&fallback.naturalWidth){fallback.classList.add("visible");idle.classList.add("hidden")}
  if(correct)reactionTimer=setTimeout(nextPage,3200);
  else reactionTimer=setTimeout(()=>{if(state==="playing")state="wrong"},2400);
 };
 if(onApple||!video.canPlayType('video/webm; codecs="vp9"')){showFallback();return}
 let failed=false;
 const fallbackOnce=()=>{if(failed||navigationStarted)return;failed=true;showFallback()};
 video.onerror=fallbackOnce;video.loop=!correct;video.playbackRate=1;
 video.onplaying=()=>{video.classList.add("visible");idle.classList.add("hidden")};
 video.onended=()=>{if(correct)nextPage()};
 video.src=correct?video.dataset.happy:video.dataset.angry;
 video.load();
 const playPromise=video.play();if(playPromise&&playPromise.catch)playPromise.catch(fallbackOnce);
 if(correct)reactionTimer=setTimeout(nextPage,4100);
 else reactionTimer=setTimeout(()=>{if(state==="playing")state="wrong"},2700);
}
function submit(){if(state==="playing"||navigationStarted||typed.length!==4)return;reaction(typed===secret)}
document.querySelectorAll("[data-digit]").forEach(b=>b.addEventListener("click",()=>press(b.dataset.digit)));
document.getElementById("erase").addEventListener("click",erase);
document.getElementById("submit").addEventListener("click",submit);
document.addEventListener("keydown",e=>{
 if(e.metaKey||e.ctrlKey||e.altKey)return;
 if(/^[0-9]$/.test(e.key)){e.preventDefault();press(e.key)}
 else if(e.key==="Backspace"){e.preventDefault();erase()}
 else if(e.key==="Enter"){e.preventDefault();submit()}
});
makeFlowers();makeRoses();display();
})();