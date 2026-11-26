const $=s=>document.querySelector(s),rm=matchMedia('(prefers-reduced-motion:reduce)').matches,cl=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
document.querySelectorAll('[data-img]').forEach(i=>i.src=IMG[i.dataset.img]);
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target);if(e.target.querySelector('[data-n]'))e.target.querySelectorAll('[data-n]').forEach(count)}}),{threshold:.15});
const watch=r=>(r||document).querySelectorAll('.rv,#dots,#cta').forEach(e=>io.observe(e));watch();
function count(el){const n=+el.dataset.n,p=el.dataset.pre||'',s=el.dataset.suf||'',t0=performance.now();(function f(t){const k=rm?1:cl((t-t0)/1400);el.textContent=p+Math.round(n*(1-Math.pow(1-k,3)))+s;if(k<1)requestAnimationFrame(f)})(t0)}
// promise word reveal + pinned how-it-works (self-contained: other errors cannot stop it)
(function(){try{
const big=$('#big'),how=$('#how'),pl=$('#pl'),fill=$('#fill'),trk=$('#trk'),steps=$('#steps'),brand=$('#brand'),stg=$('#stage');
if(big){big.innerHTML=[...big.childNodes].map(n=>n.nodeType==3?n.textContent.split(/\s+/).filter(Boolean).map(w=>`<span class="wd">${w}</span>`).join(' '):`<span class="g">${n.textContent.split(' ').map(w=>`<span class="wd">${w}</span>`).join(' ')}</span>`).join(' ');}
const wds=big?[...big.querySelectorAll('.wd')]:[],stp=steps?[...steps.children]:[];let cur=0;
function frame(){try{const y=scrollY,vh=innerHeight;
if(brand&&y<vh*1.2){brand.style.transform=`translate3d(0,${y*.16}px,0)`;if(stg)stg.style.marginBottom=y*.06+'px'}
if(big&&wds.length){const r=big.getBoundingClientRect(),pr=cl((vh*.85-r.top)/(vh*.55)),lit=rm?99:pr*wds.length*1.05;wds.forEach((w,i)=>w.style.opacity=.22+.78*cl(lit-i))}
if(how&&pl&&trk&&fill){const hr=how.getBoundingClientRect(),t=cl(-hr.top/Math.max(1,hr.height-vh));cur+=(t-cur)*(rm?1:.12);
const w=trk.clientWidth-pl.offsetWidth;pl.style.transform=`translate3d(${cur*w}px,0,0) rotate(${cur*540}deg)`;fill.style.transform=`scaleX(${cur})`;
const di=cl((cur-.12)/.25),im=pl.firstElementChild;if(im){im.style.opacity=di;im.style.transform=`scale(${.6+.4*di}) rotate(${-cur*540}deg)`}
const a=cur<.34?0:cur<.67?1:2;stp.forEach((s,i)=>s.classList.toggle('on',i==a))}
}catch(e){}requestAnimationFrame(frame)}
frame();
}catch(e){console.error('FoodDispatch (how it works):',e)}})();
(function(){try{
// hero
const H=[["pizza","Chicken BBQ Pizza","#E8C39E","#442F23"],["biryani","Veg Biryani","#DAA520","#442F23"],["palak-paneer","Palak Paneer","#4E6E58","#F5E5C0"],["spaghetti","Spaghetti Pomodoro","#F2725B","#442F23"],["dosa","Masala Dosa","#D36228","#F5E5C0"],["ramen","Beef Kimchi Ramen","#2C3E50","#F5E5C0"]];
const st=$('#stage'),hero=$('#hero'),brand=$('#brand');let k=0,tm;
brand.querySelectorAll('.w').forEach((w,wi)=>{w.innerHTML=[...w.textContent].map((c,i)=>`<span class="c"><i style="--i:${i+wi*4}">${c}</i></span>`).join('');w.setAttribute('aria-label',w.textContent)});
H.forEach(d=>{const i=new Image();i.src=IMG[d[0]];i.alt=d[1];st.append(i)});
function show(first){const n=H.length,w=innerWidth;[...st.children].forEach((im,j)=>{const o=((j-k+n+1)%n)-1,c=cl(o,-2,2),sp=w<760?.72:.5,was=+im.dataset.o;
if(was===-1&&o>1||first){im.style.transition='none'}
im.style.transform=`translateX(calc(-50% + ${c*sp*w}px)) scale(${o?.84:1}) rotate(${c*9}deg)`;im.style.opacity=Math.abs(o)<=1?1:0;im.style.zIndex=o?1:3;im.dataset.o=o;
if(im.style.transition==='none'){im.offsetWidth;im.style.transition=''}});
const d=H[k];hero.style.backgroundColor=d[2];hero.style.color=d[3];$('#cap').textContent=d[1]}
const go=s=>{k=(k+s+H.length)%H.length;show()};
const auto=()=>{clearInterval(tm);if(!rm)tm=setInterval(()=>go(1),2000)};
$('#prev').onclick=()=>{go(-1);auto()};$('#next').onclick=()=>{go(1);auto()};
hero.onmouseenter=()=>clearInterval(tm);hero.onmouseleave=auto;addEventListener('resize',()=>show());
show(true);requestAnimationFrame(()=>requestAnimationFrame(()=>hero.classList.add('in')));auto();
}catch(e){console.error('FoodDispatch (hero):',e)}})();
(function(){try{
// marquee
const M=['Order in under 30 seconds','Live driver position','Live ETA','Placed to Delivered','Nearest driver assigned','Customer · Restaurant · Driver'];
$('#mq').innerHTML=M.map(t=>`<span>${t}</span><span><i>✺</i></span>`).join('').repeat(4);
}catch(e){console.error('FoodDispatch (marquee):',e)}})();
(function(){try{
// restaurants (sample data)
const R=[["alfredo","Trattoria Verde","Italian","#E8C39E",1.4,25],["omelette","Morning Pan Café","Café","#F5E5C0",0.8,15],["dal-makhani","Dhaba Junction","Indian","#DAA520",2.1,30],["salad","Green Bowl Co.","Café","#6E6F33",1.1,20],["dumplings","Little Dumpling House","Asian","#F2725B",3.2,35],["mutton-curry","Masala Haveli","Indian","#B3342C",2.8,40],["dal","Tadka Tiffins","Indian","#E8C39E",4.6,35],["tom-kha","Bangkok Lane","Asian","#4E6E58",3.9,30]];
let cu='All',rad=5;
function chip(box,vals,cur,fn){vals.forEach(v=>{const b=document.createElement('button');b.textContent=typeof v=='number'?v+' km':v;b.setAttribute('aria-pressed',v==cur);b.onclick=()=>{[...box.querySelectorAll('button')].forEach(x=>x.setAttribute('aria-pressed',x==b));fn(v)};box.append(b)})}
chip($('#cu'),['All','Indian','Italian','Asian','Café'],cu,v=>{cu=v;draw()});chip($('#rd'),[1,2,3,5],rad,v=>{rad=v;draw()});
function draw(){const l=R.filter(r=>(cu=='All'||r[2]==cu)&&r[4]<=rad);$('#grid').innerHTML=l.length?l.map((r,i)=>`<article class="card rv" style="--d:${i}"><div class="t" style="background:${r[3]}"><img src="${IMG[r[0]]}" alt=""></div><small>${r[2]} · ${r[4]} km · ${r[5]} min</small><h3>${r[1]}</h3></article>`).join(''):'<p class="empty">No restaurants in range. Try a larger delivery radius.</p>';requestAnimationFrame(()=>watch($('#grid')))}
draw();
}catch(e){console.error('FoodDispatch (restaurants):',e)}})();
(function(){try{
// tracker simulation
const S=['Placed','Accepted','Preparing','Ready','Picked up','Delivered'],MG=['Order placed. The restaurant will confirm it shortly.','Accepted. The kitchen has your order.','Preparing your order.','Ready for pickup. Nearest driver assigned.','','Delivered. Enjoy your meal!'],PR=[12,9,5,0,0,0],D0=2.4;
let si=-1,pg=0,tmo,tik,tt=[];const tl=$('#tl'),eta=$('#eta'),drv=$('#drv');
function rt(){tl.innerHTML=S.map((s,i)=>`<li class="${i<si?'done':i==si?'cur':''}"><i></i>${s}<em>${tt[i]||''}</em></li>`).join('');
let m=MG[si]||'';if(si<0)m='Watch a sample order from Placed to Delivered.';else if(si<=3){m+=` Estimated arrival in ${Math.ceil(D0/20*60+PR[si])} minutes.`}
if(si==4){const rem=D0*(1-pg);m=`Your driver is ${rem.toFixed(1)} km away. Estimated arrival in ${Math.max(1,Math.ceil(rem/20*60))} minutes.`}
if(si==5)m=MG[5];eta.textContent=m;drv.classList.toggle('on',si>=3);drv.style.left=24+52*pg+'%';drv.style.top=70-40*pg+'%'}
function stp2(){tt[si]=new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});rt();
if(si<3||si==3){tmo=setTimeout(()=>{si++;stp2()},si==3?1800:2000)}
else if(si==4){tik=setInterval(()=>{pg=Math.min(1,pg+.05);rt();if(pg>=1){clearInterval(tik);setTimeout(()=>{si=5;stp2()},500)}},350)}}
function run(){clearTimeout(tmo);clearInterval(tik);si=0;pg=0;tt=[];stp2()}
$('#replay').onclick=run;rt();new IntersectionObserver((e,o)=>{if(e[0].isIntersecting){run();o.disconnect()}},{threshold:.4}).observe($('#track'));
}catch(e){console.error('FoodDispatch (live tracking):',e)}})();
(function(){try{
// tickets (sample data)
const T=[["#1042","Trattoria Verde","2× Fettuccine Alfredo","Placed","#8A3324","Mon 19:42 · waiting for a driver"],["#1043","Little Dumpling House","1× Pan-fried Dumplings","Preparing","#C28840","Mon 19:55 · Driver: Ravi"],["#1044","Masala Haveli","1× Mutton Curry","Picked up","#D36228","Mon 20:10 · Driver: Meera"],["#1045","Tadka Tiffins","2× Yellow Dal Tadka","Delivered","#6E6F33","Mon 20:21 · Driver: Ravi"]];
$('#tk').innerHTML=T.map((t,i)=>`<div class="t1 rv" style="--r:${[-1.5,1,-.8,1.4][i]}deg;--d:${i}"><b>Order ${t[0]}</b><h3>${t[1]}</h3>${t[2]}<p><span class="st" style="background:${t[4]}">${t[3]}</span></p><p>${t[5]}</p></div>`).join('');watch($('#tk'));
}catch(e){console.error('FoodDispatch (order history):',e)}})();
(function(){try{
// log in: role cards are plain HTML in index.html
(function(){const form=$('#lf');if(!form)return;const go=$('#go'),msg=$('#lm'),chosen=()=>form.querySelector('input[name="role"]:checked').value;
form.addEventListener('change',()=>{go.textContent=`Continue as ${chosen()} →`;msg.textContent=''});
form.addEventListener('submit',e=>{e.preventDefault();window.openAuth&&window.openAuth(chosen())})})();
}catch(e){console.error('FoodDispatch (log in):',e)}})();
(function(){try{
// ===== Log in / Sign up view (demo) =====
(function(){const au=$('#auth');if(!au)return;
const EM=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,KS={Customer:'cu',Restaurant:'re','Delivery partner':'de'},CL={Customer:'#F2725B',Restaurant:'#DAA520','Delivery partner':'#E8C39E'};
const fIn=$('#f-in'),fUp=$('#f-up'),tIn=$('#tb-in'),tUp=$('#tb-up'),main=$('#au-form'),done=$('#au-done'),msg=$('#au-msg');let opener=null;
const role=()=>au.querySelector('input[name="au-role"]:checked').value;
const sess=()=>{try{return JSON.parse(localStorage.getItem('fooddispatch_session'))}catch(_){return null}};
const err=(el,m)=>{$('#'+el.id+'-e').textContent=m||'';el.setAttribute('aria-invalid',!!m);return!m};
const clear=()=>{au.querySelectorAll('.err').forEach(e=>e.textContent='');au.querySelectorAll('[aria-invalid]').forEach(e=>e.removeAttribute('aria-invalid'));msg.textContent=''};
function tab(up){tIn.setAttribute('aria-selected',!up);tUp.setAttribute('aria-selected',up);tIn.tabIndex=up?-1:0;tUp.tabIndex=up?0:-1;fIn.hidden=up;fUp.hidden=!up;$('#au-t').innerHTML=up?'Create your <em>account.</em>':'Welcome <em>back.</em>';clear()}
tIn.onclick=()=>tab(false);tUp.onclick=()=>tab(true);
[tIn,tUp].forEach(t=>t.onkeydown=e=>{if(e.key=='ArrowLeft'||e.key=='ArrowRight'){const up=t==tIn;tab(up);(up?tUp:tIn).focus()}});
au.querySelectorAll('[data-show]').forEach(b=>b.onclick=()=>{const i=$('#'+b.dataset.show),s=i.type=='password';i.type=s?'text':'password';b.textContent=s?'Hide':'Show';b.setAttribute('aria-label',s?'Hide password':'Show password')});
const v=id=>$('#'+id);
const eml=el=>err(el,EM.test(el.value.trim())?'':'Enter a valid email, like name@example.com.');
const pwd=el=>err(el,el.value.length>=6?'':'Password must be at least 6 characters.');
function finish(s){if(s.name)FDSession.rememberName(s.email,s.name);else s.name=FDSession.recallName(s.email);s.at=Date.now();FDSession.save(s);const d=FDSession.DEST[s.role];if(d){show(s);location.href=d;return}show(s)}
function show(s){main.hidden=true;done.hidden=false;const i=$('#dn-ic');i.style.setProperty('--c',CL[s.role]);i.firstElementChild.className=KS[s.role];
$('#dn-p').textContent=`Hi ${FDSession.nameOf(s)}! You are logged in as ${s.role}. Opening your page…`;const op=$('#dn-open');op.textContent=`Open my ${s.role.toLowerCase()} page`;op.onclick=()=>{location.href=FDSession.DEST[s.role]};$('#dn-t').focus()}
fIn.onsubmit=e=>{e.preventDefault();msg.textContent='';const ok=[eml(v('li-email')),pwd(v('li-pw'))].every(Boolean);if(!ok){(au.querySelector('#f-in [aria-invalid=true]')||{focus(){}}).focus();return}
finish({role:role(),email:v('li-email').value.trim(),name:''});fIn.reset()};
fUp.onsubmit=e=>{e.preventDefault();msg.textContent='';const n=v('su-name'),p=v('su-pw'),p2=v('su-pw2'),k=v('su-ok');
const ok=[err(n,n.value.trim()?'':'Enter your name.'),eml(v('su-email')),pwd(p),err(p2,p2.value&&p2.value===p.value?'':'Passwords do not match.'),err(k,k.checked?'':'Tick the box to continue.')].every(Boolean);
if(!ok){(au.querySelector('#f-up [aria-invalid=true]')||{focus(){}}).focus();return}
finish({role:role(),email:v('su-email').value.trim(),name:n.value.trim()});fUp.reset()};
$('#forgot').onclick=()=>{msg.textContent='Demo only: there is no password reset yet.'};
function open(r){opener=document.activeElement;if(r){const i=au.querySelector(`input[name="au-role"][value="${r}"]`);if(i)i.checked=true}
const s=sess();if(s)show(s);else{main.hidden=false;done.hidden=true;tab(false)}au.hidden=false;document.body.style.overflow='hidden';au.scrollTop=0;
try{if(location.hash!=='#auth')history.pushState({auth:1},'','#auth')}catch(_){}(s?$('#dn-t'):tIn).focus()}
function hide(){au.hidden=true;document.body.style.overflow='';opener&&opener.focus&&opener.focus()}
function close(){try{if(history.state&&history.state.auth){history.back();return}}catch(_){}hide()}
$('#au-back').onclick=close;$('#dn-home').onclick=close;
$('#dn-out').onclick=()=>{try{localStorage.removeItem('fooddispatch_session')}catch(_){}done.hidden=true;main.hidden=false;tab(false);tIn.focus()};
addEventListener('popstate',()=>{if(location.hash==='#auth'){if(au.hidden)open()}else if(!au.hidden)hide()});
addEventListener('keydown',e=>{if(e.key=='Escape'&&!au.hidden)close()});
document.querySelectorAll('a[href="#login"]').forEach(a=>{if(a.closest('nav'))a.onclick=e=>{e.preventDefault();open()}});
window.openAuth=open;if(location.hash==='#auth')open();
})();
}catch(e){console.error('FoodDispatch (login page):',e)}})();
