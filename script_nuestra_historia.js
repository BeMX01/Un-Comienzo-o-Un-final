const stars=document.getElementById("stars");
for(let i=0;i<90;i++){
  const s=document.createElement("i");
  s.className="star";
  s.style.left=Math.random()*100+"%";
  s.style.top=Math.random()*100+"%";
  s.style.animationDelay=Math.random()*3+"s";
  s.style.animationDuration=2+Math.random()*4+"s";
  stars.appendChild(s);
}

const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")});
},{threshold:.14});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

const music=document.getElementById("music");
const musicBtn=document.getElementById("musicBtn");
const counter=document.getElementById("chapterCounter");
const title=document.getElementById("chapterTitle");
const progressBar=document.getElementById("progressBar");

const sections=[
  document.getElementById("inicio"),
  ...document.querySelectorAll(".chapter"),
  document.querySelector(".future"),
  document.querySelector(".proposal"),
  document.querySelector(".ending")
].filter(Boolean);

let playing=false;

function updateProgress(section){
  const index=sections.indexOf(section);
  if(index<0)return;
  if(section.dataset.chapter){
    counter.textContent=section.dataset.chapter;
    title.textContent=section.dataset.title||"Nuestra historia";
    progressBar.style.width=(index/(sections.length-1)*100)+"%";
  }else{
    counter.textContent="INTRO";
    title.textContent="Nuestra historia";
    progressBar.style.width="0%";
  }
}

function playSong(src){
  if(!src)return;
  const wasPlaying=playing||!music.paused;
  if(!music.src.endsWith(src)){
    music.src=src;
    music.load();
  }
  if(wasPlaying){
    music.play().then(()=>{
      playing=true;
      musicBtn.textContent="Ⅱ";
      musicBtn.classList.add("active");
    }).catch(()=>{});
  }
}

function goTo(index){
  if(index<0||index>=sections.length)return;
  const section=sections[index];
  section.scrollIntoView({behavior:"smooth",block:"start"});
  updateProgress(section);
  if(section.dataset.song){
    playing=true;
    playSong(section.dataset.song);
  }
}

// Navegación entre partes: cada botón lleva exactamente a la siguiente sección.
function goToNextSection(button){
  const current = button.closest("[data-chapter]");
  if(!current) return;
  const currentIndex = sections.indexOf(current);
  goTo(currentIndex + 1);
}

document.getElementById("startBtn")?.addEventListener("click",()=>{
  goTo(1); // INTRO -> CAPÍTULO 01
});

document.querySelectorAll(".next-btn").forEach(btn=>{
  btn.addEventListener("click",()=>goToNextSection(btn));
});

document.getElementById("yesBtn")?.addEventListener("click",()=>{
  const proposal=document.querySelector(".proposal");
  const nextIndex=sections.indexOf(proposal)+1;
  goTo(nextIndex); // LA PREGUNTA -> FINAL
});

musicBtn.addEventListener("click",()=>{
  if(music.paused){
    music.play().then(()=>{
      playing=true;
      musicBtn.textContent="Ⅱ";
      musicBtn.classList.add("active");
    }).catch(()=>{});
  }else{
    music.pause();
    playing=false;
    musicBtn.textContent="♫";
    musicBtn.classList.remove("active");
  }
});

const sectionObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    updateProgress(entry.target);
    if(entry.target.dataset.song && playing) playSong(entry.target.dataset.song);
  });
},{threshold:.55});

sections.forEach(s=>sectionObserver.observe(s));
updateProgress(sections[0]);
