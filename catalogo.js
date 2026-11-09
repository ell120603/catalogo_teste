/* ===== EDITE AQUI: seus produtos =====
   Para usar suas fotos: coloque o arquivo em assets/produtos/ e troque o nome em "foto". */
const WHATSAPP = "https://wa.me/5511985896167"; // troque pelo seu número
const produtos = [
 {nome:"Pó descolorante White",     desc:"Ilumina e uniformiza o tom da pele. 30 ml.",          preco:"R$ 65,00", foto:"assets/produtos/produto1b.jpeg"},
 {nome:"Creme Hidratante",     desc:"Hidratação profunda por 24 horas. 50 g.",             preco:"R$ 89,90",  foto:"assets/produtos/produto2.svg"},
 {nome:"Máscara Capilar",      desc:"Nutrição intensa para fios macios e brilhantes.",     preco:"R$ 74,90",  foto:"assets/produtos/produto3.svg"},
 {nome:"Batom Matte",          desc:"Cor intensa e conforto o dia todo.",                  preco:"R$ 49,90",  foto:"assets/produtos/produto4.svg"},
 {nome:"Perfume Ouro",         desc:"Fragrância amadeirada com toque floral. 50 ml.",      preco:"R$ 249,90", foto:"assets/produtos/produto5.svg"},
 {nome:"Kit Skincare",         desc:"Limpeza, tônico e hidratante em um só kit.",          preco:"R$ 199,90", foto:"assets/produtos/produto6.svg"},
 {nome:"Óleo Corporal",        desc:"Pele sedosa com brilho dourado. 100 ml.",             preco:"R$ 79,90",  foto:"assets/produtos/produto7.svg"},
 {nome:"Paleta de Sombras",    desc:"8 tons quentes, do nude ao bronze.",                  preco:"R$ 109,90", foto:"assets/produtos/produto8.svg"},
];
/* ===================================== */

const prod=(p,n,lado)=>`<div class="pg"><div class="foto"><img src="${p.foto}" alt="${p.nome}"></div>
 <div class="info"><h3>${p.nome}</h3><p>${p.desc}</p><b>${p.preco}</b></div><span class="num">${n}</span></div>`;

const capa=`<div class="capa"><i></i><img src="assets/logo.png" alt="7bios Beauty"><p>CATÁLOGO 2026</p></div>`;
const boasVindas=`<div class="texto"><h2>Bem-vinda</h2><p>Conheça a linha 7bios Beauty.<br>Folheie as páginas e escolha seus favoritos.</p></div>`;
const contato=`<div class="texto"><h2>Fale com a gente</h2><p>Faça seu pedido pelo WhatsApp<br>e receba em casa.</p><a href="${WHATSAPP}" target="_blank" rel="noopener">Pedir pelo WhatsApp</a></div>`;
const contracapa=`<div class="texto"><img src="assets/logo.png" alt="7bios Beauty"><p>Obrigada pela visita.</p></div>`;

const folhas=[[capa,boasVindas]];
for(let i=0;i<produtos.length;i+=2)
  folhas.push([prod(produtos[i],i+3),produtos[i+1]?prod(produtos[i+1],i+4):""]);
folhas.push([contato,contracapa]);
folhas[0][0]=capa;

const book=document.getElementById('book'),N=folhas.length;
const leaves=folhas.map(([f,b],i)=>{
  const el=document.createElement('div');el.className='leaf';
  el.innerHTML=`<div class="face front">${f}</div><div class="face back">${b}</div>`;
  el.addEventListener('click',e=>{
    if(e.target.closest('a'))return;
    if(mobile())return e.clientX<innerWidth/2?voltar():avancar();
    el.classList.contains('flipped')?voltar():avancar();
  });
  book.appendChild(el);return el;
});
let atual=0,lado=0,ocupado=false,mudo=false,ac; // lado: 0 = vendo a frente (direita) | 1 = vendo o verso (esquerda)
const mq=matchMedia('(orientation:portrait)');
const mobile=()=>mq.matches; // celular/tablet em pé: mostra 1 página grande por vez

function som(){
  if(mudo)return;
  try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();
  const d=.6,n=ac.sampleRate*d,buf=ac.createBuffer(1,n,ac.sampleRate),x=buf.getChannelData(0);
  for(let i=0;i<n;i++){const t=i/n;x[i]=(Math.random()*2-1)*Math.pow(Math.sin(Math.PI*t),1.6)*(.5+.5*Math.random());}
  const s=ac.createBufferSource();s.buffer=buf;
  const f=ac.createBiquadFilter();f.type='bandpass';f.Q.value=.6;
  f.frequency.setValueAtTime(900,ac.currentTime);f.frequency.linearRampToValueAtTime(4500,ac.currentTime+d);
  const g=ac.createGain();g.gain.value=.55;s.connect(f).connect(g).connect(ac.destination);s.start();}catch(e){}
}
function render(){
  leaves.forEach((l,i)=>{l.classList.toggle('flipped',i<atual);if(!l.classList.contains('flipping'))l.style.zIndex=i<atual?i:N-i;});
  if(atual===0)lado=0;if(atual===N)lado=1;
  book.className=(atual===0?'':atual===N?'fim':'aberto')+(lado?' vL':' vR');
  const p=document.getElementById('pos');
  p.textContent=atual===0&&lado===0?'Capa':atual===N?'Contracapa':mobile()?`Página ${lado?2*atual:2*atual+1}`:`Páginas ${atual*2}–${atual*2+1}`;
}
function virar(i,dir){
  if(ocupado)return;ocupado=true;som();
  const l=leaves[i];l.style.zIndex=N+1;l.classList.add('flipping');
  atual+=dir;render();
  setTimeout(()=>{l.classList.remove('flipping');l.style.zIndex=i<atual?i:N-i;ocupado=false;},1100);
}
function avancar(){
  if(ocupado)return;
  if(mobile()){
    if(lado===0){if(atual<N){lado=1;virar(atual,1);}}   // vira a folha e mostra o verso
    else if(atual<N){lado=0;render();}                  // desliza para a frente da próxima folha
  }else if(atual<N)virar(atual,1);
}
function voltar(){
  if(ocupado)return;
  if(mobile()){
    if(lado===1){if(atual>0){lado=0;virar(atual-1,-1);}}
    else if(atual>0){lado=1;render();}
  }else if(atual>0)virar(atual-1,-1);
}
mq.addEventListener('change',render);
document.getElementById('next').onclick=avancar;
document.getElementById('prev').onclick=voltar;
document.getElementById('mute').onclick=e=>{mudo=!mudo;e.target.textContent=mudo?'🔇':'🔊';};
addEventListener('keydown',e=>{if(e.key==='ArrowRight')avancar();if(e.key==='ArrowLeft')voltar();});
let x0=null;
addEventListener('touchstart',e=>x0=e.touches[0].clientX,{passive:true});
addEventListener('touchend',e=>{if(x0===null)return;const d=e.changedTouches[0].clientX-x0;if(Math.abs(d)>50)d<0?avancar():voltar();x0=null;});
render();
