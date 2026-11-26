/* ---------- catalogue: dishes, restaurants, offers ---------- */
const MS='Mumbai Street Eats',SR='Spice Route Kitchen',NP='Napoli Pizzeria',UT='Udupi Tiffin House';
const CATNAMES=['Fast food','Main course','South Indian','Starters','Italian','Desserts & Bakery'];
const DISH=[
 {id:'momos',n:'Veg Momos',s:'Steamed, 8 pcs',p:149,cats:['Fast food','Starters'],d:'Hand-folded dumplings, steamed and served with a fiery red chutney.'},
 {id:'vada',n:'Medu Vada',s:'2 pcs with chutney',p:99,cats:['South Indian'],d:'Crisp, fluffy lentil doughnuts with coconut chutney and sambar.'},
 {id:'sev',n:'Sev Tamatar',s:'Gujarati curry',p:169,cats:['Main course'],d:'Tangy tomato curry topped with crunchy sev, a Gujarati favourite.'},
 {id:'dal',n:'Dal Tadka',s:'Smoky tempering',p:159,cats:['Main course'],d:'Yellow dal finished with a smoky tempering of garlic and red chillies.'},
 {id:'sandwich',n:'Grilled Sandwich',s:'Cheesy veg',p:119,cats:['Fast food'],d:'Toasted, grill-marked bread packed with spiced veg and melted cheese.'},
 {id:'vadapav',n:'Vada Pav',s:'Mumbai style',p:49,cats:['Fast food'],d:'Mumbai’s street burger: a spiced potato fritter in a soft pav with chutneys.'},
 {id:'dahivada',n:'Dahi Vada',s:'Chilled, with chutneys',p:99,cats:['South Indian'],d:'Soft lentil dumplings in chilled, whisked curd with tamarind chutney.'},
 {id:'croissant',n:'Butter Croissant',s:'Box of 4',p:179,cats:['Desserts & Bakery'],d:'Flaky, buttery croissants, baked fresh through the morning.'},
 {id:'tiffin',n:'South Indian Tiffin',s:'Idli, vada, dosa',p:189,cats:['South Indian'],d:'A South Indian plate with idli, vada, dosa, sambar and chutneys.'},
 {id:'paneer',n:'Paneer Butter Masala',s:'With garlic naan',p:289,cats:['Main course'],d:'Soft paneer in a rich, creamy tomato gravy, served with garlic naan.'},
 {id:'chaat',n:'Papdi Chaat',s:'Tangy and crunchy',p:89,cats:['Fast food'],d:'Crisp papdi layered with curd, chutneys, sev and pomegranate.'},
 {id:'bruschetta',n:'Tomato Bruschetta',s:'Fresh basil',p:199,cats:['Italian'],d:'Toasted bread topped with tomato, basil, mozzarella and a balsamic drizzle.'},
 {id:'roll',n:'Paneer Kathi Roll',s:'Spicy, 2 rolls',p:149,cats:['Starters'],d:'Paneer tikka wrapped in a flaky paratha with onions and mint chutney.'},
 {id:'lollipop',n:'Chicken Lollipop',s:'6 pcs',p:249,cats:['Starters'],d:'Spicy, sticky chicken wings, frenched and fried, with a hot dipping sauce.'},
 {id:'tikka',n:'Chicken Tikka',s:'Tandoori, 8 pcs',p:279,cats:['Main course','Starters'],d:'Chicken marinated in spices and grilled in the tandoor until charred.'},
 {id:'pizza',n:'Veg Supreme Pizza',s:'Large',p:399,cats:['Italian'],d:'Thin-crust pizza with peppers, olives, mushrooms and plenty of mozzarella.'},
 {id:'lasagna',n:'Classic Lasagna',s:'Oven baked',p:329,cats:['Italian'],d:'Layers of pasta, rich meat sauce and bubbling cheese, baked until golden.'},
 {id:'rasgulla',n:'Rasgulla',s:'4 pcs',p:119,cats:['Desserts & Bakery'],d:'Spongy cottage-cheese balls soaked in light sugar syrup with pistachios.'},
 {id:'chole',n:'Chole Bhature',s:'2 bhature',p:169,cats:['Main course'],d:'Spiced chickpea curry served with two puffed, golden bhature.'},
 {id:'sesame',n:'Sesame Chicken',s:'Sticky glazed',p:259,cats:['Fast food','Starters'],d:'Crispy chicken tossed in a sticky soy glaze with sesame and spring onion.'}];
const DISH_BY={};DISH.forEach(d=>DISH_BY[d.id]=d);
const TABS={};CATNAMES.forEach(c=>TABS[c]=DISH.filter(d=>d.cats.includes(c)).map(d=>d.id));

/* restaurant logos are drawn as SVG: a badge shape, a colour pair and a simple pictogram */
const SHAPES={circle:'<circle cx="32" cy="32" r="31"/>',round:'<rect x="1" y="1" width="62" height="62" rx="19"/>',hex:'<path d="M32 1l27 15.5v31L32 63 5 47.5v-31z"/>',shield:'<path d="M32 2l27 8v21c0 14-11 24-27 30C16 55 5 45 5 31V10z"/>'};
const GL={
 bun:'<path d="M16 31c0-9 7-14 16-14s16 5 16 14z"/><path d="M14 37h36"/><path d="M17 43h30l-2 7H19z"/>',
 chili:'<path d="M17 40c4 9 15 7 21-2 6-8 7-15 10-20"/><path d="M48 18c2-3 4-3 6-1"/><path d="M17 40c-1-3 0-5 2-6"/>',
 pizza:'<path d="M32 51 14 21c11-7 25-7 36 0z"/><path d="M14 21c11-5 25-5 36 0"/><circle cx="28" cy="28" r="2.3"/><circle cx="37" cy="30" r="2.3"/><circle cx="32" cy="39" r="2.3"/>',
 leaf:'<path d="M15 47c0-18 12-30 33-30 0 18-11 31-29 31"/><path d="M15 47c9-9 16-16 25-23"/>',
 bowl:'<path d="M13 32h38c0 11-8 19-19 19S13 43 13 32z"/><path d="M38 11 30 30M45 13l-8 17"/>',
 flame:'<path d="M32 11c3 9 13 13 13 25a13 13 0 0 1-26 0c0-7 3-10 6-14 1 4 3 6 5 6 0-6-2-10 2-17z"/>',
 pot:'<path d="M17 28h30v8c0 9-6 15-15 15s-15-6-15-15z"/><path d="M13 28h38"/><path d="M24 22c0-4 2-6 8-6s8 2 8 6"/>',
 cupcake:'<path d="M20 33h24l-3 17H23z"/><path d="M17 33c0-9 6-14 15-14s15 5 15 14z"/><path d="M32 19v-5"/>',
 chaat:'<path d="M12 41h40c0 6-8 10-20 10S12 47 12 41z"/><path d="M18 41c2-11 8-17 14-17s12 6 14 17"/><circle cx="28" cy="33" r="1.7"/><circle cx="36" cy="31" r="1.7"/><circle cx="33" cy="37" r="1.7"/>',
 cup:'<path d="M17 26h24v13a11 11 0 0 1-11 11h-2a11 11 0 0 1-11-11z"/><path d="M41 30h4a5 5 0 0 1 0 10h-4"/><path d="M25 14c0 3 3 3 3 7M33 14c0 3 3 3 3 7"/>',
 wheat:'<path d="M32 52V16"/><path d="M32 25c-6-1-9-5-9-10 6 0 9 4 9 10zM32 25c6-1 9-5 9-10-6 0-9 4-9 10zM32 38c-6-1-9-5-9-10 6 0 9 4 9 10zM32 38c6-1 9-5 9-10-6 0-9 4-9 10z"/>'};
const logo=(r,s=56)=>`<img class="lg" src="${LOGOS[r.id]}" width="${s}" height="${s}" alt="${r.n} logo">`;

const REST=[
 {id:'src',n:SR,tag:'North Indian',r:4.6,pos:[12.9698,77.7500],c:['#8f2a1d','#f7dfc4'],shape:'round',glyph:'chili',about:'North Indian curries, tandoori kebabs and fresh breads, cooked to order.',menu:['paneer','chole','dal','sev','tikka','lollipop','rasgulla','roll']},
 {id:'nap',n:NP,tag:'Italian',r:4.5,pos:[12.9641,77.7338],c:['#b3362b','#fff1dc'],shape:'circle',glyph:'pizza',about:'Thin-crust pizza, baked lasagna and fresh bruschetta from a proper oven.',menu:['pizza','lasagna','bruschetta','croissant','sandwich']},
 {id:'mse',n:MS,tag:'Street food',r:4.4,pos:[12.9726,77.7421],c:['#d9772f','#fff3e0'],shape:'circle',glyph:'bun',about:'Vada pav, momos, chaat and rolls, made the way they are on the street.',menu:['vadapav','chaat','momos','sandwich','roll','dahivada','sesame']},
 {id:'udu',n:UT,tag:'South Indian',r:4.5,pos:[12.9769,77.7288],c:['#2f6b73','#e6f2ef'],shape:'shield',glyph:'leaf',about:'Idli, vada and dosa with sambar and fresh chutneys, the Udupi way.',menu:['tiffin','vada','dahivada','dal','rasgulla']},
 {id:'dw',n:'Dragon Wok',tag:'Indo-Chinese',r:4.2,pos:[12.9890,77.7440],c:['#22222a','#e8b84a'],shape:'hex',glyph:'bowl',about:'Wok-tossed favourites and glazed chicken with a hot, smoky edge.',menu:['momos','sesame','lollipop','roll']},
 {id:'tt',n:'Tandoor Tales',tag:'Kebabs & grills',r:4.4,pos:[12.9577,77.7266],c:['#c4551a','#fff0d6'],shape:'hex',glyph:'flame',about:'Charcoal-grilled kebabs and tandoor classics, straight from the clay oven.',menu:['tikka','lollipop','paneer','roll','dal','chole']},
 {id:'pd',n:'Punjab Da Dhaba',tag:'Punjabi',r:4.3,pos:[12.9801,77.7567],c:['#5a3722','#f1d2a8'],shape:'shield',glyph:'pot',about:'Hearty dhaba-style curries and bhature, with plenty of butter.',menu:['chole','paneer','dal','sev','roll','rasgulla']},
 {id:'sw',n:'Sweet Tooth Bakery',tag:'Bakery & sweets',r:4.6,pos:[12.9712,77.7205],c:['#c25b82','#fff0f4'],shape:'round',glyph:'cupcake',about:'Fresh croissants, warm sandwiches and Bengali sweets, baked daily.',menu:['rasgulla','croissant','sandwich']},
 {id:'cc',n:'Chaat Corner',tag:'Chaat',r:4.3,pos:[12.9862,77.7365],c:['#e0a321','#3b2a10'],shape:'circle',glyph:'chaat',about:'Tangy, crunchy chaat and chilled dahi vada from a busy chaat counter.',menu:['chaat','dahivada','vadapav','momos','vada']},
 {id:'mc',n:'Madras Cafe',tag:'South Indian',r:4.4,pos:[12.9529,77.7402],c:['#4a2c1d','#efd2b4'],shape:'round',glyph:'cup',about:'A neighbourhood cafe for tiffin, vada and a proper dal.',menu:['tiffin','vada','dahivada','dal']},
 {id:'li',n:'Little Italy Kitchen',tag:'Italian',r:4.4,pos:[12.9945,77.7289],c:['#2e4a7a','#f4e9d2'],shape:'shield',glyph:'wheat',about:'Pizzas and pastas from a cosy kitchen, baked to order.',menu:['pizza','lasagna','bruschetta']}];
const REST_BY={};REST.forEach(r=>REST_BY[r.id]=r);
const FEATURED=['src','nap','mse','udu','dw','tt'];

/* an "offer" is one dish sold by one restaurant (its own price); the cart holds offers */
const hash=s=>[...s].reduce((a,c)=>(a*31+c.charCodeAt(0))>>>0,7);
const DB={},OFFS={};
REST.forEach(r=>r.menu.forEach(did=>{const d=DISH_BY[did],o={id:r.id+':'+did,r:r.id,k:r.n,dish:did,img:did,n:d.n,s:d.s,p:Math.max(39,Math.round(d.p*(.9+hash(r.id+did)%21/100)/10)*10-1)};DB[o.id]=o;(OFFS[did]=OFFS[did]||[]).push(o)}));
DB.combo={id:'combo',r:'nap',k:NP,dish:'pizza',img:'pizza',n:'Italian Feast Combo',s:'Napoli Pizzeria',p:799};
Object.values(OFFS).forEach(a=>a.sort((x,y)=>x.p-y.p));
const IMGOF=id=>IMGS[DB[id].img];
const SEC={need:['momos','vada','sev','dal','sandwich','vadapav','dahivada','croissant','chaat','rasgulla'],you:['lollipop','dahivada','lasagna','roll','bruschetta']};
const CATS=[['Fast food','Street favourites','vadapav'],['Main course','Curries & breads','paneer'],['South Indian','Tiffin & more','tiffin'],['Italian','Pizza & pasta','pizza'],['Desserts & Bakery','Sweet tooth','rasgulla']];
const cart={};const $=s=>document.querySelector(s);
const inr=n=>n.toLocaleString('en-IN');const money=n=>'₹'+inr(n);

document.querySelectorAll('img[data-i]').forEach(i=>i.src=IMGS[i.dataset.i]);
const MQ=['Garma garam khaana','Free delivery within 3 km','Fresh off the tawa','Cooked only when you order','Cash on delivery works too'];
$('#mq').innerHTML=(MQ.map(x=>`<span>${x} •</span>`).join('')).repeat(2);

/* render */
const dishCard=d=>{const os=OFFS[d.id],min=Math.min(...os.map(o=>o.p));return `<div class="pc dishc fade-in" data-dish="${d.id}" tabindex="0"><div class="pi"><img src="${IMGS[d.id]}" alt="${d.n}"></div><h4>${d.n}<span>${d.s}</span></h4><div class="pr">from ${money(min)}</div><div class="avail">${os.length} restaurants <b>›</b></div></div>`};
const offerCard=o=>`<div class="pc fade-in" data-id="${o.id}" data-offer="${o.id}"><div class="pi"><img src="${IMGOF(o.id)}" alt="${o.n}"></div><h4>${o.n}<span>${o.s}</span></h4><div class="pr">${money(o.p)}</div><div class="add"><button class="plus" aria-label="Add ${o.n}">Add +</button><div class="step"><button class="m">−</button><span>1</span><button class="p">+</button></div></div></div>`;
const restCard=r=>`<div class="store fade-in" data-rest="${r.id}" tabindex="0"><div class="top" style="background:${r.c[0]}"><span class="lgw">${logo(r,60)}</span></div><div class="bd"><h4>${r.n}</h4><p>${r.about}</p><div class="m">★ ${r.r} · ${r.tag} · ${r.menu.length} dishes</div></div></div>`;
const rowFor=(r,o)=>`<div class="rrow" ${o.offer?`data-offer="${o.offer}"`:`data-rest="${r.id}"`}>${logo(r,48)}<div><b>${r.n}</b><small>${r.tag} · ★ ${r.r}</small></div><span class="rt">${o.extra||''}</span><span class="go">›</span></div>`;
function fill(sel,ids){const g=$(sel);g.innerHTML=ids.map(i=>dishCard(DISH_BY[i])).join('');g.querySelectorAll('.pc').forEach((c,i)=>c.style.animationDelay=i*60+'ms')}
function sync(){document.querySelectorAll('.pc[data-id]').forEach(c=>{const q=cart[c.dataset.id]||0,a=c.querySelector('.add');if(!a)return;a.classList.toggle('has',q>0);a.querySelector('span').textContent=q||1})}
$('#cats').innerHTML=CATS.map(c=>`<div class="cat" data-cat="${c[0]}" tabindex="0"><div><b>${c[0]}</b><small>${c[1]}</small></div><img src="${IMGS[c[2]]}" alt=""></div>`).join('')+`<div class="cat all" data-act="all"><i>→</i>See all</div>`;
fill('#g1',SEC.need);fill('#g4',SEC.you);
$('#stores').innerHTML=FEATURED.map(id=>restCard(REST_BY[id])).join('');
$('#tabs').innerHTML=CATNAMES.map((t,i)=>`<button type="button" class="tab${i?'':' on'}" data-c="${t}">${t}</button>`).join('');
function setTab(name){document.querySelectorAll('#tabs .tab').forEach(x=>x.classList.toggle('on',x.dataset.c===name));fill('#g2',TABS[name]);$('#tabInfo').textContent=`${TABS[name].length} dishes in ${name}. Tap a dish to see which restaurants serve it.`}
document.querySelectorAll('#tabs .tab').forEach(b=>b.addEventListener('click',()=>setTab(b.dataset.c)));
setTab(CATNAMES[0]);

/* browse modal: categories, dishes, restaurants, one dish at one restaurant */
let NAV=[];
function navGo(v){const m=$('#brM');if(m.classList.contains('on')){NAV.push(v)}else{open(m);NAV=[v]}renderNav()}
function navBack(){NAV.pop();if(!NAV.length)closeAll();else renderNav()}
function renderNav(){
  const v=NAV[NAV.length-1],B=$('#brB');let T='';
  $('#brBack').style.visibility=NAV.length>1?'visible':'hidden';
  if(v.t==='dishes'){T='All dishes';B.innerHTML=`<div class="grid">${DISH.map(dishCard).join('')}</div>`}
  else if(v.t==='rests'){T='All restaurants';B.innerHTML=`<div class="rgrid">${REST.map(restCard).join('')}</div>`}
  else if(v.t==='cat'){T=v.c;const ds=DISH.filter(d=>d.cats.includes(v.c)),rs=REST.filter(r=>r.menu.some(id=>DISH_BY[id].cats.includes(v.c))).sort((a,b)=>b.r-a.r);
    B.innerHTML=`<h3 class="sub">Popular ${v.c} dishes</h3><div class="grid g4">${ds.slice(0,4).map(dishCard).join('')}</div><h3 class="sub">Restaurants serving ${v.c}</h3><div class="rlist">${rs.map(r=>rowFor(r,{extra:r.menu.filter(id=>DISH_BY[id].cats.includes(v.c)).length+' dishes'})).join('')}</div>`}
  else if(v.t==='dish'){const d=DISH_BY[v.d],os=OFFS[d.id];T=d.n;
    B.innerHTML=`<div class="dhero"><img src="${IMGS[d.id]}" alt="${d.n}"><div><h3 class="sub">${d.n}</h3><p class="dd">${d.d}</p><small>${d.s}</small></div></div><h3 class="sub">Available at ${os.length} restaurants</h3><div class="rlist">${os.map(o=>rowFor(REST_BY[o.r],{offer:o.id,extra:money(o.p)})).join('')}</div>`}
  else if(v.t==='offer'){const o=DB[v.o],d=DISH_BY[o.dish],r=REST_BY[o.r];T=o.n;
    const more=r.menu.filter(id=>id!==o.dish).slice(0,5).map(id=>offerCard(DB[r.id+':'+id])).join('');
    B.innerHTML=`<div class="dhero big"><img src="${IMGS[o.dish]}" alt="${o.n}"><div><div class="rrow mini" data-rest="${r.id}">${logo(r,40)}<div><b>${r.n}</b><small>${r.tag} · ★ ${r.r}</small></div><span class="go">›</span></div><h3 class="sub">${o.n}</h3><p class="dd">${d.d}</p><small>${o.s}</small><div class="dprice">${money(o.p)}</div><div class="pc ofw" data-id="${o.id}"><div class="add"><button class="plus">Add to bucket</button><div class="step"><button class="m">−</button><span>1</span><button class="p">+</button></div></div></div></div></div>${more?`<h3 class="sub">More from ${r.n}</h3><div class="grid">${more}</div>`:''}`}
  else if(v.t==='rest'){const r=REST_BY[v.r];T=r.n;
    B.innerHTML=`<div class="rhead" style="background:${r.c[0]};color:${r.c[1]}"><span class="lgw">${logo(r,76)}</span><div><h3>${r.n}</h3><p>${r.about}</p><small>★ ${r.r} · ${r.tag} · ${r.menu.length} dishes</small></div></div><h3 class="sub">Menu</h3><div class="grid">${r.menu.map(id=>offerCard(DB[r.id+':'+id])).join('')}</div>`}
  $('#brT').textContent=T;B.scrollTop=0;sync();updateBar()}
function updateBar(){const bar=$('#brBar'),n=Object.values(cart).reduce((a,b)=>a+b,0),rs=cartRests();bar.hidden=!n;if(n)$('#brBarT').innerHTML=`<b>${n} item${n>1?'s':''}</b> from ${rs.length>1?rs.length+' restaurants':REST_BY[rs[0]].n} · ${money(totals().sub)}`}

/* cart: items from any number of restaurants; each restaurant becomes its own order */
let done=false;
const cartRests=()=>{const s=[];Object.keys(cart).forEach(k=>{if(!s.includes(DB[k].r))s.push(DB[k].r)});return s};
const restKey=()=>cartRests().join(',');
function setQty(id,q){if(q<=0)delete cart[id];else cart[id]=q;update()}
function addItem(id,n,imgEl){setQty(id,(cart[id]||0)+(n||1));if(imgEl)fly(imgEl);return true}
function update(){const n=Object.values(cart).reduce((a,b)=>a+b,0),c=$('#count');c.textContent=n;c.classList.toggle('on',n>0);sync();updateBar();if($('#cartD').classList.contains('on')&&!done)drawCart()}
const FREE_ABOVE=199,TIPS=[0,10,20,30],FAST_FEE=25,ECO_FEE=5,OPT={tip:0,fast:false,eco:false};
function groups(){const g={};Object.keys(cart).forEach(id=>{const r=DB[id].r;(g[r]=g[r]||{rid:r,ids:[],sub:0}).ids.push(id);g[r].sub+=DB[id].p*cart[id]});return Object.values(g)}
const feeKnown=rid=>!!DROP.fees&&DROP.fees[rid]!=null;
/* one order per restaurant: each has its own delivery fee, rider, tip, and extras */
function totals(){const gs=groups(),n=gs.length,sub=gs.reduce((a,g)=>a+g.sub,0),tip=sub?OPT.tip:0,fast=sub&&OPT.fast?FAST_FEE:0,eco=sub&&OPT.eco?ECO_FEE:0;
  gs.forEach(g=>{g.ship=g.sub>FREE_ABOVE?0:(feeKnown(g.rid)?DROP.fees[g.rid]:0);g.tip=tip;g.fast=fast;g.eco=eco;g.total=g.sub+g.ship+tip+fast+eco});
  const ship=gs.reduce((a,g)=>a+g.ship,0),known=gs.every(g=>g.sub>FREE_ABOVE||feeKnown(g.rid));
  return{gs,n,sub,ship,known,tip:tip*n,fast:fast*n,eco:eco*n,total:sub+ship+(tip+fast+eco)*n}}
const feeTxt=t=>t.known?(t.ship?money(t.ship):'Free'):(t.gs.every(g=>g.sub>FREE_ABOVE)?'Free':'up to '+money(DC.fee*t.gs.filter(g=>g.sub<=FREE_ABOVE).length));
function cartFoot(){const t=totals(),x=(l,v)=>v?`<div class="row"><span>${l}</span><span>${money(v)}</span></div>`:'',free=t.gs.every(g=>g.sub>FREE_ABOVE);
  $('#cartF').innerHTML=`<div class="row"><span>Subtotal</span><span>${money(t.sub)}</span></div><div class="row"><span>Delivery</span><span>${t.known?(t.ship?money(t.ship):'Free'):'Set at drop-off'}</span></div>${x(t.n>1?'Delivery tips ('+t.n+' riders)':'Delivery tip',t.tip)}${x('Faster delivery',t.fast)}${x('Eco saver',t.eco)}<div class="row t"><span>Total</span><span>${money(t.total)}</span></div><button class="btn" data-act="dropoff">Choose drop-off</button><p class="freeline blink">${free?(t.n>1?'Free delivery on all your orders':'Free delivery unlocked on this order'):'Spend more than ₹'+FREE_ABOVE+' at a restaurant and its delivery is free'}</p>`}
const optsHTML=t=>`<div class="opts"><h3 class="sub">Before you place your order</h3>
<div class="opt"><div><b>Delivery tip</b><small>${t.n>1?'For each of your '+t.n+' delivery partners':'Thank your delivery partner'}</small></div><div class="chips" role="group" aria-label="Delivery tip">${TIPS.map(v=>`<button type="button" data-tip="${v}" aria-pressed="${OPT.tip===v}">${v?'₹'+v:'None'}</button>`).join('')}</div></div>
<label class="opt"><div><b>Faster delivery</b><small>Priority rider, arrives sooner${t.n>1?' (each order)':''}</small></div><span class="amt">+${money(FAST_FEE*t.n)}</span><input type="checkbox" data-opt="fast"${OPT.fast?' checked':''}></label>
<label class="opt"><div><b>Eco saver</b><small>Eco packaging, no cutlery${t.n>1?' (each order)':''}</small></div><span class="amt">+${money(ECO_FEE*t.n)}</span><input type="checkbox" data-opt="eco"${OPT.eco?' checked':''}></label>
<div class="opt"><div><b>Delivery fee</b><small>Free within ${DC.freeKm} km or above ${money(FREE_ABOVE)}${t.n>1?' per restaurant':''}</small></div><span class="amt">${feeTxt(t)}</span></div></div>`;
$('#cartB').addEventListener('click',e=>{const t=e.target.closest('[data-tip]');if(!t)return;OPT.tip=+t.dataset.tip;
  document.querySelectorAll('#cartB [data-tip]').forEach(b=>b.setAttribute('aria-pressed',b===t));cartFoot()});
$('#cartB').addEventListener('change',e=>{const o=e.target.dataset.opt;if(!o)return;OPT[o]=e.target.checked;cartFoot()});
function drawCart(){
  const ids=Object.keys(cart),B=$('#cartB'),F=$('#cartF');done=false;
  if(!ids.length){B.innerHTML=`<div class="empty"><h4>Your bucket is empty</h4>Add something tasty and it will show up here.<br><button class="btn" data-act="browse">Browse dishes</button></div>`;F.style.display='none';return}
  F.style.display='';const gs=groups();
  B.innerHTML=(gs.length>1?`<p class="multi">You are ordering from <b>${gs.length} restaurants</b>. Each gets its own delivery partner, so they may arrive at different times.</p>`:'')
   +gs.map(g=>{const rs=REST_BY[g.rid];return `<div class="crest">${logo(rs,40)}<div><small>Ordering from</small><b>${rs.n}</b></div><button class="lnk" data-rest="${rs.id}">View menu</button></div>`+g.ids.map(id=>{const d=DB[id];return `<div class="ci" data-cid="${id}"><img src="${IMGOF(id)}" alt=""><div>${d.n}<small>${d.s}</small><span class="q"><button data-d="-1">−</button>${cart[id]}<button data-d="1">+</button></span></div><b>${money(d.p*cart[id])}</b><button class="rm" data-d="rm" aria-label="Remove"><svg class="ic"><use href="#i-x"/></svg></button></div>`}).join('')}).join('')
   +`<button class="addmore" data-act="rests">+ Add from another restaurant</button>`;
  B.insertAdjacentHTML('beforeend',optsHTML(totals()));cartFoot()}
$('#cartB').addEventListener('click',e=>{const b=e.target.closest('[data-d]');if(!b)return;const id=b.closest('.ci').dataset.cid,d=b.dataset.d;setQty(id,d==='rm'?0:(cart[id]||0)+ +d)});

/* orders + tracking */
const orders=[
 {id:'FD-20398',k:SR,items:'Paneer Butter Masala, Chole Bhature',total:498,date:'14 Nov',step:7},
 {id:'FD-20311',k:NP,items:'Veg Supreme Pizza',total:439,date:'2 Nov',step:7},
 {id:'FD-20207',k:UT,items:'South Indian Tiffin × 2',total:418,date:'19 Oct',step:7}];
const STEPS=[['Placed','Your order has been placed'],['Accepted by restaurant','The kitchen has confirmed it'],['Preparing','Your food is being cooked'],['Accepted by a driver','A delivery partner has taken your order'],['Ready','Packed and waiting for pickup'],['Picked up','On its way to you'],['Delivered','Enjoy your meal']];
let seq=20420;
 if(window.FDSharedOrders){
   FDSharedOrders.read().forEach(sh=>{
     if(orders.some(o=>o.id===sh.id))return;
     orders.push({id:sh.id,k:sh.restaurant||'FoodDispatch restaurant',rid:sh.restaurantId,
       pos:[sh.restaurantLat||12.9352,sh.restaurantLng||77.6245],
       items:Array.isArray(sh.items)?sh.items.join(', '):String(sh.items||'Order'),
       total:sh.total||0,date:new Date(sh.createdAt||Date.now()).toLocaleDateString('en-IN'),
       start:sh.createdAt||Date.now(),dur:(sh.etaAt&&sh.createdAt&&sh.etaAt>sh.createdAt)?sh.etaAt-sh.createdAt:120000,drop:[sh.customerLat||12.985,sh.customerLng||77.723],
       rider:sh.driverName||'Delivery partner',plate:'',name:sh.customer||'',step:1,shared:true});
     const n=Number(String(sh.id).replace(/\\D/g,''));if(Number.isFinite(n))seq=Math.max(seq,n+1);
   });
 }
const TIMES=o=>[0,.067,.15,.25,.458,.542,1].map(f=>Math.round(f*o.dur));   // timeline in ms from the moment you order, spread over the real delivery estimate
const clock=ms=>new Date(ms).toLocaleTimeString('en-IN',{hour:'numeric',minute:'2-digit'});
const stepsHTML=(o,st)=>STEPS.map((s,i)=>{const d=i<st,cur=i===st-1,tm=o.start+TIMES(o)[i];return `<li class="${d?'d':''} ${cur?'cur':''}"><i>${d?'✓':''}</i><div><b>${s[0]}</b><small>${s[1]}</small></div><time>${d?clock(tm):i===6?'by '+clock(tm):''}</time></li>`}).join('');
const STATUS=o=>['','Order placed','The restaurant accepted your order. Finding you a delivery partner',`Your food is being cooked. Finding you a delivery partner`,`${o.rider} accepted your order and is heading to the restaurant`,`Your food is ready. ${o.rider} is at the restaurant to pick it up`,`${o.rider} picked up your order and is on the way`,'Delivered. Enjoy your meal!'];
const riderHTML=o=>`<div class="rid"><i><svg><use href="#e-scooter"/></svg></i><div>${o.rider}<small>${o.plate}${o.name?' · delivering to '+escH(firstName(o.name)):''}</small></div><button data-t="Calling ${o.rider}…">Call</button></div>`;
const waitHTML='<div class="rid wait"><i><svg><use href="#e-scooter"/></svg></i><div>Finding a delivery partner<small>You will see them here once a driver accepts your order</small></div></div>';
const DUR=120000;              // only a fallback if no route estimate exists; real orders use the drop-off estimate
let RESTO=[12.9698,77.7500];  // the restaurant of the current bucket
let HOME=[12.9850,77.7230];     // set from the customer's drop-off pin

const sharedStatusStep={Placed:1,Accepted:2,Preparing:3,Ready:5,'Picked up':6,Delivered:7,Cancelled:0};
 const stepOf=o=>{const sh=window.FDSharedOrders&&FDSharedOrders.get(o.id);if(sh&&sharedStatusStep[sh.status]!=null)return sharedStatusStep[sh.status];if(!o.start)return o.step;const e=Date.now()-o.start;return TIMES(o).filter(x=>e>=x).length};   // 1..7 = steps completed
const DONE=7,isLive=o=>!o.cancelled&&stepOf(o)<DONE,canCancel=o=>!o.cancelled&&!!o.start&&stepOf(o)<4;   // cancel is possible only until a driver accepts (step 4)
const cancelNote=o=>o.payMethod==='cod'||!o.pay?'Cancelled before a delivery partner accepted it. Nothing was charged.':`Cancelled before a delivery partner accepted it. ${money(o.total)} will be refunded to ${escH(o.pay)} within 3 to 5 working days.`;
const fmt=ms=>{const s=Math.ceil(ms/1000);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
const payTxt=(o,live)=>!o.pay?'':o.payMethod==='cod'?(live?'Cash on delivery':'Paid in cash'):'Paid · '+escH(o.pay);
function drawOrders(){const h=orders.map(o=>{const live=isLive(o),cx=!!o.cancelled;return `<div class="od ${live?'live':''}${cx?' cxl':''}"><h4>${o.k}<small>${o.id} · ${o.date}</small></h4><div class="it">${o.items}</div>${live&&o.otp?`<div class="otpl">Delivery OTP <b>${o.otp}</b></div>`:''}${cx?`<div class="cxn">${cancelNote(o)}</div>`:''}<div class="ft"><span>${money(o.total)}${o.pay&&!cx?`<small class="pl"> · ${payTxt(o,live)}</small>`:''}</span>${cx?'<span class="tag cx">Cancelled</span>':live?`<span class="ac2">${canCancel(o)?`<button class="tag cx" data-cancel="${o.id}">Cancel</button>`:''}<button class="tag live" data-act="track">Track order →</button></span>`:`<span class="ac2"><span class="tag">Delivered</span><button class="tag" data-inv="${o.id}">Invoice ↓</button></span>`}</div></div>`}).join('');if(drawOrders.h!==h){drawOrders.h=h;$('#ordB').innerHTML=h}}
function checkout(pay){const t=totals();if(!t.n)return;
  const RIDERS=['Ravi','Karthik','Imran','Suresh'];
  const made=t.gs.map((g,k)=>{const rs=REST_BY[g.rid],id='FD-'+(seq++);
    const est=(DROP.est&&DROP.est[g.rid])||null,realMin=est?(g.fast?Math.max(1,Math.round(est.totalMin*.85)):est.totalMin):null;   // the same minutes shown on the drop-off screen
    return{id,k:rs.n,rid:rs.id,pos:rs.pos.slice(),est:est&&Object.assign({},est,{totalMin:realMin}),items:g.ids.map(i=>DB[i].n+(cart[i]>1?' × '+cart[i]:'')).join(', '),total:g.total,sub:g.sub,ship:g.ship,tip:g.tip,fast:g.fast,eco:g.eco,
      lines:g.ids.map(i=>({n:DB[i].n,q:cart[i],p:DB[i].p})),date:'Today',start:Date.now(),dur:realMin?realMin*60000:(g.fast?100000:DUR)+k*12000,drop:DROP.ll.slice(),
      rider:RIDERS[(seq+k)%4],plate:'KA 01 EX '+(1000+Math.floor(Math.random()*8999)),
      pay:pay.label,payMethod:pay.method,paid:pay.paid,name:pay.name,phone:pay.phone,otp:newOtp()}});
  saveProf();
  orders.unshift(...made);
   if(window.FDSharedOrders)made.forEach(o=>FDSharedOrders.fromCustomer(o));
  Object.keys(cart).forEach(k=>delete cart[k]);OPT.tip=0;OPT.fast=OPT.eco=false;done=true;update();$('#cartF').style.display='none';
  const many=made.length>1,p=pay.phone;
  $('#cartB').innerHTML=`<div class="done"><i>✓</i><h4>${many?made.length+' orders placed!':'Order placed!'}</h4><p>${made.map(o=>'<b>'+o.k+'</b>').join(' and ')} ${many?'have':'has'} received your order${many?'s':''} and ${many?'are':'is'} preparing ${many?'them':'it'}. ${many?'They':'It'} will reach you in about ${Math.max(...made.map(o=>Math.ceil(o.dur/60000)))} minutes.</p>
   ${made.map(o=>`<div class="otpc"><div><small>${o.k} · ${o.id}</small><span>Delivery OTP</span><small>${o.payMethod==='cod'?'Pay '+money(o.total)+' in cash on delivery':'Paid '+money(o.total)+' · '+escH(o.pay)}</small></div><b>${o.otp}</b></div>`).join('')}
   <p class="otpn">We texted ${many?'these OTPs':'this OTP'} to +91 ${p.slice(0,5)} ${p.slice(5)}. Share ${many?'each':'it'} with the rider only when your food arrives.</p>
   <button class="btn" style="margin-top:18px;background:var(--c8);color:#fff" data-act="track">Track ${many?'orders':'order'}</button></div>`;
  made.forEach((o,k)=>sendSms(o,1300+k*1100))}

/* ---------- Map layer: Google Maps first, OpenStreetMap (Leaflet) as automatic fallback ---------- */
const GMAPS_KEY=window.FD_MAPS_API_KEY;   // Optional: configure your own restricted Google Maps key.
const MAP_PROVIDER='auto';        // 'auto' = try Google, fall back to OpenStreetMap | 'google' | 'osm'
let provider='pending',providerWhy='';
const gm=()=>window.google&&window.google.maps;
const gll=p=>({lat:p[0],lng:p[1]});
const hav=(a,b)=>{const r=Math.PI/180,x=(b[0]-a[0])*r,y=(b[1]-a[1])*r,h=Math.sin(x/2)**2+Math.cos(a[0]*r)*Math.cos(b[0]*r)*Math.sin(y/2)**2;return 12742000*Math.asin(Math.sqrt(h))};
const mapMsg=()=>`<div class="nomap">${provider==='pending'?'Loading the map…':'The map could not load. Check your internet connection and reopen this screen.'}</div>`;
const GLYPH={home:'<path d="M9 31 32 12l23 19M16 27v25h32V27M27 52V38h10v14"/>',dish:'<circle cx="32" cy="32" r="11"/><path d="M12 10v14M8 10v8a4 4 0 0 0 8 0v-8M12 24v30M52 10c-6 4-7 14-4 22h4zM52 32v22"/>',scooter:'<circle cx="15" cy="46" r="7"/><circle cx="51" cy="46" r="7"/><path d="M15 46h12l7-16h12l5 16M34 30l-3-12h-9M44 30l-2-14h7"/>'};
const iconSvg=i=>`<svg xmlns="http://www.w3.org/2000/svg" width="${i.size}" height="${i.size}" viewBox="0 0 64 64"><circle cx="32" cy="32" r="29" fill="${i.bg||'#fffaf2'}" stroke="#3d2415" stroke-width="4"/><g transform="translate(16 16) scale(.5)" fill="none" stroke="#3d2415" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">${GLYPH[i.name]}</g></svg>`;

const MK={
 google:{
  create(el,c){el.innerHTML='';return new google.maps.Map(el,{center:gll(c.center),zoom:c.zoom,disableDefaultUI:true,zoomControl:true,clickableIcons:false,gestureHandling:'greedy'})},
  marker(m,o){const s=o.icon.size,mk=new google.maps.Marker({map:m,position:gll(o.pos),icon:{url:'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(iconSvg(o.icon)),scaledSize:new google.maps.Size(s,s),anchor:new google.maps.Point(s/2,s/2)},draggable:!!o.draggable,clickable:!!o.draggable,title:o.title,zIndex:o.z||1});
    return{setPos:p=>mk.setPosition(gll(p)),getPos:()=>{const q=mk.getPosition();return[q.lat(),q.lng()]},remove:()=>mk.setMap(null),onDragEnd:cb=>mk.addListener('dragend',cb)}},
  line(m,o){const l=new google.maps.Polyline({map:m,path:(o.path||[]).map(gll),strokeColor:o.color,strokeOpacity:o.opacity==null?1:o.opacity,strokeWeight:o.weight,zIndex:o.z||1});return{setPath:p=>l.setPath(p.map(gll)),remove:()=>l.setMap(null)}},
  fit(m,pts,p,mz){google.maps.event.trigger(m,'resize');const d=m.getDiv();if(d.clientWidth<80||d.clientHeight<80)return false;const k=Math.min(1,d.clientHeight*.7/Math.max(1,p.t+p.b),d.clientWidth*.7/Math.max(1,p.l+p.r));const b=new google.maps.LatLngBounds();pts.forEach(x=>b.extend(gll(x)));m.fitBounds(b,{top:p.t*k,left:p.l*k,right:p.r*k,bottom:p.b*k});google.maps.event.addListenerOnce(m,'idle',()=>{if(m.getZoom()>(mz||16))m.setZoom(mz||16)});return true},
  onClick(m,cb){m.addListener('click',e=>cb([e.latLng.lat(),e.latLng.lng()]))},
  panTo(m,p,z){m.panTo(gll(p));m.setZoom(Math.max(m.getZoom(),z||15))}
 },
 osm:{
  create(el,c){el.innerHTML='';const m=L.map(el,{zoomControl:false}).setView(c.center,c.zoom);L.control.zoom({position:'topright'}).addTo(m);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(m);return m},
  marker(m,o){const s=o.icon.size,mk=L.marker(o.pos,{icon:L.divIcon({className:'',html:iconSvg(o.icon),iconSize:[s,s],iconAnchor:[s/2,s/2]}),draggable:!!o.draggable,keyboard:false,title:o.title,zIndexOffset:(o.z||1)*100}).addTo(m);
    return{setPos:p=>mk.setLatLng(p),getPos:()=>{const q=mk.getLatLng();return[q.lat,q.lng]},remove:()=>m.removeLayer(mk),onDragEnd:cb=>mk.on('dragend',cb)}},
  line(m,o){const l=L.polyline(o.path||[],{color:o.color,weight:o.weight,opacity:o.opacity==null?1:o.opacity,lineCap:'round',lineJoin:'round'}).addTo(m);return{setPath:p=>l.setLatLngs(p),remove:()=>m.removeLayer(l)}},
  fit(m,pts,p,mz){m.invalidateSize();const s=m.getSize();if(s.x<80||s.y<80)return false;const k=Math.min(1,s.y*.7/Math.max(1,p.t+p.b),s.x*.7/Math.max(1,p.l+p.r));m.fitBounds(pts,{paddingTopLeft:[p.l*k,p.t*k],paddingBottomRight:[p.r*k,p.b*k],maxZoom:mz||16});return true},
  onClick(m,cb){m.on('click',e=>cb([e.latlng.lat,e.latlng.lng]))},
  panTo(m,p,z){m.setView(p,Math.max(m.getZoom(),z||15))}
 }};
const kit=()=>MK[provider];
const freshEl=s=>{const o=$(s),n=o.cloneNode(false);o.replaceWith(n);return n};   // a clean container for every new map

/* Routing never depends on the map provider: try Google Directions, then the free OSRM server. */
function routeAny(from,to,cb){
  const osrm=()=>fetch(`https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`).then(r=>r.json()).then(j=>{const r=j.routes&&j.routes[0];if(!r)throw 0;cb({path:r.geometry.coordinates.map(c=>[c[1],c[0]]),distM:r.distance,secs:r.duration})}).catch(()=>cb(null));
  if(provider==='google'&&gm()){
    new google.maps.DirectionsService().route({origin:gll(from),destination:gll(to),travelMode:google.maps.TravelMode.DRIVING},(res,status)=>{
      if(status==='OK'){const r=res.routes[0],l=r.legs[0];cb({path:r.overview_path.map(p=>[p.lat(),p.lng()]),distM:l.distance.value,secs:l.duration.value})}else osrm()})
  }else osrm()}

/* provider selection */
function setProvider(p,why){
  if(provider===p)return;provider=p;providerWhy=why||'';
  console.info('[FoodDispatch] map provider:',p,why||'');
  resetMaps();
  const note=p==='osm'&&why?`Showing OpenStreetMap because ${why}.`:'';
  const e=$('#dmProv');if(e){e.textContent=note;e.hidden=!note}
  if($('#dropM').classList.contains('on'))openDrop();
  if($('#trackM').classList.contains('on'))drawTrack()}
window.__gm=()=>{                       // Google script loaded: probe it, a rejected key reports back within moments
  if(provider!=='pending')return;
  const d=document.createElement('div');d.style.cssText='position:fixed;left:-9999px;top:0;width:240px;height:240px';document.body.appendChild(d);
  try{new google.maps.Map(d,{center:gll(RESTO),zoom:12,disableDefaultUI:true})}catch(e){setProvider('osm','Google Maps could not start');return}
  setTimeout(()=>{if(provider==='pending')setProvider('google')},2500)};
window.gm_authFailure=()=>{if(MAP_PROVIDER==='auto')setProvider('osm','Google rejected the map key (check that Maps JavaScript API is on, billing is enabled and this website is allowed on the key)')};
function bootMaps(){
  if(MAP_PROVIDER==='osm')setProvider('osm');
  else{
    const s=document.createElement('script');console.log("FoodDispatch Maps key loaded:", !!GMAPS_KEY);s.src=`https://maps.googleapis.com/maps/api/js?key=${GMAPS_KEY}&v=weekly&callback=__gm`;s.async=true;
    s.onerror=()=>{if(MAP_PROVIDER==='auto')setProvider('osm','Google Maps could not be reached')};document.head.appendChild(s);
    if(MAP_PROVIDER==='auto')setTimeout(()=>{if(provider==='pending')setProvider('osm','Google Maps did not respond')},9000)}
}

/* tracking map */
let map,mapKit,line,doneLine,rider,homeMk,kitMk,aLine,aDone,A={pts:[],cum:[]},R={key:null,pts:[],cum:[]};
function resetMaps(){dm=null;dmCust=null;map=null;R={key:null,pts:[],cum:[]};A={pts:[],cum:[]};line=doneLine=rider=homeMk=kitMk=aLine=aDone=null}
function initMap(){
  if(map)return true;
  if(provider==='pending'||(provider==='osm'&&!window.L)){$('#map').innerHTML=mapMsg();return false}
  mapKit=kit();map=mapKit.create(freshEl('#map'),{center:RESTO,zoom:14});return true}
function setRoute(pts){R.pts=pts;R.cum=[0];for(let i=1;i<pts.length;i++)R.cum[i]=R.cum[i-1]+hav(pts[i-1],pts[i]);
  if(line)line.remove();if(doneLine)doneLine.remove();
  line=mapKit.line(map,{path:pts,color:'#8ab4f8',weight:6,opacity:.95});
  doneLine=mapKit.line(map,{path:[pts[0]],color:'#1a73e8',weight:6,z:2})}
const retry=(fn,n=14)=>{if(fn()===false&&n>0)setTimeout(()=>retry(fn,n-1),200)};   // keep trying until the map has a real size
function fitTrack(){retry(()=>{if(!map||!R.K0)return true;return mapKit.fit(map,R.drv?[...A.pts,...R.pts]:[R.K0,HOME],{t:60,l:60,r:60,b:60})})}
function setupRoute(o){
  if(!initMap()||R.key===o.id)return;R.key=o.id;R.fin=0;R.lf=0;R.rp=null;R.drv=0;
  const K0=(o.pos||RESTO).slice();HOME=o.drop||HOME;R.K0=K0;R.S0=[K0[0]+.011,K0[1]-.009];   // S0 = where the driver is when they accept
  [kitMk,rider,homeMk,line,doneLine,aLine,aDone].forEach(m=>m&&m.remove());rider=line=doneLine=aLine=aDone=null;A={pts:[],cum:[]};R.pts=[];R.cum=[0];
  kitMk=mapKit.marker(map,{pos:K0,icon:{name:'dish',size:40},title:o.k});
  homeMk=mapKit.marker(map,{pos:HOME,icon:{name:'home',size:40,bg:'#e3b98e'},title:'Your drop-off'});
  fitTrack()}   // before a driver accepts: only the restaurant and your drop-off are on the map
function showDriver(o){   // called once, the moment a driver accepts: now the driver icon and the routes appear
  if(R.drv||!map||R.key!==o.id)return;R.drv=1;const K0=R.K0,S0=R.S0;
  rider=mapKit.marker(map,{pos:S0,icon:{name:'scooter',size:42},title:o.rider+' (delivery partner)',z:10});
  setApproach([S0,K0]);setRoute([K0,HOME]);fitTrack();
  routeAny(S0,K0,r=>{if(R.key!==o.id||!r)return;setApproach(r.path);fitTrack()});
  routeAny(K0,HOME,r=>{if(R.key!==o.id||!r)return;setRoute(r.path);fitTrack()})}
const cumOf=pts=>{const c=[0];for(let i=1;i<pts.length;i++)c[i]=c[i-1]+hav(pts[i-1],pts[i]);return c};
function setApproach(pts){A={pts,cum:cumOf(pts)};if(aLine)aLine.remove();if(aDone)aDone.remove();
  aLine=mapKit.line(map,{path:pts,color:'#b8bcc2',weight:6,opacity:.95});aDone=mapKit.line(map,{path:[pts[0]],color:'#5f6368',weight:6,z:2})}
function moveRider(f,toKitchen){const P=toKitchen?A:R;if(!rider||P.pts.length<2)return;const tot=P.cum[P.cum.length-1],d=f*tot;let i=1;while(i<P.cum.length-1&&P.cum[i]<d)i++;
  const a=P.pts[i-1],b=P.pts[i],seg=P.cum[i]-P.cum[i-1]||1,u=Math.min(1,Math.max(0,(d-P.cum[i-1])/seg)),p=[a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u];
  rider.setPos(p);R.rp=p;(toKitchen?aDone:doneLine).setPath([...P.pts.slice(0,i),p])}
const TRK={id:null};
const liveOrders=()=>{const l=orders.filter(o=>o.start&&isLive(o));if(l.length)return l;const d=orders.find(o=>o.start&&!o.cancelled);return d?[d]:[]};
const activeOrder=()=>{const l=liveOrders();return l.find(o=>o.id===TRK.id)||l[0]||orders.find(o=>o.id===TRK.id&&o.cancelled)};
const trkChips=o=>{const l=liveOrders();return l.length>1?`<div class="tchips">${l.map(x=>`<button type="button" class="${x.id===o.id?'on':''}" data-trk="${x.id}">${x.k}</button>`).join('')}</div>`:''};
const trkExtras=o=>(o.otp?`<div class="otpbox" id="otpb"><div><small>Delivery OTP</small><span id="otpS">Share it with ${o.rider} only when your food arrives</span></div><b>${o.otp}</b></div>`:'')
  +(o.name?`<div class="paydue" style="background:var(--c1);color:var(--ink)">Your delivery partner sees: <b>${escH(o.name)}</b> · drop-off pin ${o.drop[0].toFixed(4)}, ${o.drop[1].toFixed(4)}</div>`:'')
  +(o.pay?`<div class="paydue">${o.payMethod==='cod'?`Pay <b>${money(o.total)}</b> in cash to the delivery partner`:`Paid <b>${money(o.total)}</b> · ${escH(o.pay)}`}</div>`:'');
$('#tside').addEventListener('click',e=>{const b=e.target.closest('[data-trk]');if(!b)return;TRK.id=b.dataset.trk;drawTrack()});
function drawTrack(){const o=activeOrder(),S=$('#tside');if(o)TRK.id=o.id;
  if(!o){S.innerHTML=`<div class="empty"><h4>No order to track</h4>Place an order and you can follow your delivery partner here, live on the map.<br><button class="btn" data-act="browse">Browse dishes</button></div>`;initMap();return}
  if(o.cancelled){S.innerHTML=`<div class="tk">${trkChips(o)}<small>Order ${o.id}</small><h4>${o.k}</h4><div class="cxbanner"><b>Order cancelled</b>${cancelNote(o)}</div><div class="titems"><b>${o.items}</b><br>Total ${money(o.total)}</div><p style="margin-top:16px"><button class="btn" data-act="browse">Browse dishes</button></p></div>`;setupRoute(o);return}
  S.innerHTML=`<div class="tk">${trkChips(o)}<small>Order ${o.id}</small><h4>${o.k}</h4><div class="eta2"><span id="etaL">Arriving in</span><b id="eta">2:00</b></div>${trkExtras(o)}<button type="button" class="cancelb" data-contact-rest="${o.id}">Message restaurant</button><div id="tcancel"></div><p id="tmsg" class="tmsg"></p><ol class="vs" id="tsteps"></ol><div id="trider"></div><div class="titems"><b>${o.items}</b><br>Total ${money(o.total)}</div></div>`;
  R.rst=null;R.cst=null;setupRoute(o);tickTrack()}
function tickTrack(){const o=activeOrder();if(!o||!$('#trackM').classList.contains('on')||!$('#eta'))return;
  const shared=window.FDSharedOrders&&FDSharedOrders.get(o.id);
  const ea=shared&&FDSharedOrders.etaAt(shared);if(ea&&ea>o.start)o.dur=ea-o.start;   // real ETA shared by the restaurant and driver
  const e=Date.now()-o.start,st=stepOf(o);
   $('#eta').textContent=st===7?'Delivered':(shared&&FDSharedOrders.etaMin(shared)!=null?FDSharedOrders.etaMin(shared)+' min':fmt(o.dur-e));$('#etaL').textContent=st===7?'Enjoy your meal':'Arriving in';
  $('#tsteps').innerHTML=stepsHTML(o,st);$('#tmsg').textContent=STATUS(o)[st];
  const ob=$('#otpb');if(ob){ob.classList.toggle('used',st===7);$('#otpS').textContent=st===7?'Verified at delivery':'Share it with '+o.rider+' only when your food arrives'}
  if(R.rst!==st){R.rst=st;$('#trider').innerHTML=st<4?waitHTML:riderHTML(o)}   // the driver card appears when a driver accepts
  const cs=canCancel(o)?1:st<7?2:0;
  if(R.cst!==cs){R.cst=cs;$('#tcancel').innerHTML=cs===1?`<button type="button" class="cancelb" data-cancel="${o.id}">Cancel order</button><p class="cancel-n">You can cancel until a delivery partner accepts your order.</p>`:cs===2?'<p class="cancel-n">This order can no longer be cancelled because a delivery partner has accepted it.</p>':''}
  if(map&&st>=4){showDriver(o);
     if(shared&&shared.driverLat!=null&&shared.driverLng!=null&&rider)rider.setPos([shared.driverLat,shared.driverLng]);
     // 1) driver goes to the restaurant, 2) then brings the food to you
    const ap=shared&&shared.approachFrom&&shared.approachTo>shared.approachFrom?shared:null,pk=shared&&shared.pickedAt?shared:null;
    if(st<6)moveRider(ap?Math.max(0,Math.min(1,(Date.now()-ap.approachFrom)/(ap.approachTo-ap.approachFrom))):Math.max(0,Math.min(1,(e-.25*o.dur)/(.208*o.dur))),true);
    else moveRider(st===7?1:pk&&o.dur>pk.pickedAt-o.start?Math.max(0,Math.min(1,(Date.now()-pk.pickedAt)/(o.start+o.dur-pk.pickedAt))):Math.max(0,Math.min(1,(e-.542*o.dur)/(.458*o.dur))));
    // the scooter only moves to you after "Picked up"
    if(st===6&&R.rp&&Date.now()-(R.lf||0)>3500){R.lf=Date.now();mapKit.fit(map,[R.rp,HOME],{t:80,l:80,r:80,b:80},17)}
    if(st===7&&!R.fin){R.fin=1;fitTrack()}}}
window.addEventListener('storage',e=>{if(e.key==='fooddispatch_shared_orders_v1'){if($('#ordD').classList.contains('on'))drawOrders();if($('#trackM').classList.contains('on')){drawTrack();tickTrack()}}});
 setInterval(()=>{orders.forEach(o=>{const sh=window.FDSharedOrders&&FDSharedOrders.get(o.id);if(sh){if(sh.status==='Cancelled')o.cancelled=true;if(sh.driverName&&o.rider!==sh.driverName){o.rider=sh.driverName;R.rst=null;}if(sh.driverId)o.driverId=sh.driverId;}if(!o.start||o.cancelled)return;const s=stepOf(o);if(s>(o.seen||1)){o.seen=s;if(s===7)askRating(o);if(!$('#trackM').classList.contains('on'))toast(['','','Restaurant accepted your order','Your food is being prepared',`${o.rider} accepted your order`,'Your food is ready for pickup','Picked up. Your order is on the way!',`${o.k} order delivered. Enjoy!`][s])}});
  if($('#ordD').classList.contains('on'))drawOrders();tickTrack()},500);

/* ---------- drop-off picker ---------- */
const DC={prepMin:15,freeKm:3,fee:30,maxKm:10};          // tune delivery rules here
const DROP={ll:[12.9850,77.7230],fees:null,est:null};
let dm,dmKit,dmCust,dmTok=0,dmFor=null,dmRests=[],dmLines=[];
const km=m=>m/1000;
const dropEst=(distM,secs)=>{const d=km(distM),tm=Math.max(1,Math.round(secs/60));return{distKm:d,travelMin:tm,totalMin:tm+DC.prepMin,fee:d<DC.freeKm?0:DC.fee}};
const dropApprox=sk=>{const r=sk*1.35;return dropEst(r*1000,r/25*3600)};   // only if no routing service answers
const dmPos=()=>dmCust.getPos();
const dmStraight=rid=>km(hav(REST_BY[rid].pos,dmPos()));
const dmFar=()=>dmRests.filter(rid=>dmStraight(rid)>DC.maxKm);
const dmOut=()=>dmFar().length>0;
function dmNote(x){const n=$('#dmNote');n.textContent=x||'';n.hidden=!x}
function dmBusy(b){const l=$('#dmLocate');l.disabled=b;l.classList.toggle('busy',b)}
function dmLoading(){$('#dmCard').classList.add('loading');$('#dmBreak').textContent='Calculating the route…'}
function dmMoney(){const t=totals(),f=$('#dmFee');f.textContent=t.known?(t.ship?money(t.ship):'Free'):'--';f.classList.toggle('free',t.known&&!t.ship);$('#dmTotal').textContent=money(t.total)}
function dmRender(ests,approx){
  const far=dmFar(),out=far.length>0,c=$('#dmCard'),list=dmRests.map(r=>ests[r]),many=dmRests.length>1;
  DROP.ll=dmPos();DROP.fees=Object.assign({},DROP.fees);DROP.est=Object.assign({},DROP.est);dmRests.forEach(r=>{DROP.fees[r]=ests[r].fee;DROP.est[r]={totalMin:ests[r].totalMin,travelMin:ests[r].travelMin,prepMin:DC.prepMin,distKm:ests[r].distKm}});
  c.classList.remove('loading');c.classList.toggle('out',out);
  const slow=list.reduce((a,b)=>b.totalMin>a.totalMin?b:a),longest=list.reduce((a,b)=>b.distKm>a.distKm?b:a);
  $('#dmEta').textContent=slow.totalMin;
  $('#dmBreak').textContent=(many?`Slowest of ${dmRests.length} orders: `:'')+`${slow.travelMin} min travel + ${DC.prepMin} min preparing${approx?' (approximate)':''}`;
  $('#dmDist').textContent=(many?'up to ':'')+longest.distKm.toFixed(1)+' km';
  dmMoney();
  dmNote(out?`This spot is too far from ${far.map(r=>REST_BY[r].n+' ('+dmStraight(r).toFixed(1)+' km)').join(', ')}. We deliver within ${DC.maxKm} km of each kitchen, so please move the pin closer.`:approx?'No routing service is responding right now, so this is an approximate estimate.':'');
  $('#dmConfirm').disabled=out}
function fitDrop(){retry(()=>{if(!dm)return true;return dmKit.fit(dm,[...dmRests.map(r=>REST_BY[r].pos),dmPos()],{t:90,l:70,r:70,b:310})})}
function dmRoute(first){
  const tok=++dmTok;dmLoading();const ests={};let pending=dmRests.length,approx=false;
  dmRests.forEach((rid,i)=>routeAny(REST_BY[rid].pos,dmPos(),r=>{if(tok!==dmTok||!dm)return;
    if(r){dmLines[i].c.setPath(r.path);dmLines[i].l.setPath(r.path);ests[rid]=dropEst(r.distM,r.secs)}   // metres, seconds
    else{dmLines[i].c.setPath([]);dmLines[i].l.setPath([]);ests[rid]=dropApprox(dmStraight(rid));approx=true}
    if(--pending===0){dmRender(ests,approx);if(first)fitDrop()}}))}
function dmUpdate(){DROP.ll=dmPos();if(dmOut())$('#dmConfirm').disabled=true;dmRoute()}
function buildDrop(){
  if(dm)return true;
  if(provider==='pending'||(provider==='osm'&&!window.L)){$('#dmap').innerHTML=mapMsg();return false}
  dmKit=kit();dm=dmKit.create(freshEl('#dmap'),{center:RESTO,zoom:14});dmLines=[];
  dmRests.forEach(rid=>{const r=REST_BY[rid];
    dmKit.marker(dm,{pos:r.pos,icon:{name:'dish',size:42},draggable:false,title:r.n});   // fixed
    dmLines.push({c:dmKit.line(dm,{color:'#ffffff',weight:10,opacity:.95,z:1}),l:dmKit.line(dm,{color:'#1a73e8',weight:5,z:2})})});
  dmCust=dmKit.marker(dm,{pos:DROP.ll,icon:{name:'home',size:48,bg:'#e3b98e'},draggable:true,title:'Drop-off location',z:5});   // draggable
  dmCust.onDragEnd(dmUpdate);
  dmKit.onClick(dm,ll=>{dmCust.setPos(ll);dmUpdate()});
  dmRoute(true);return true}
function openDrop(){
  if(!Object.keys(cart).length){closeAll();toast('Your bucket is empty');return}
  const key=restKey();
  if(dmFor!==key){dmRests=cartRests();RESTO=REST_BY[dmRests[0]].pos.slice();dmFor=key;dm=null;dmCust=null;dmLines=[]}   // route from every restaurant in the bucket
  if(!buildDrop())return;
  if(totals().known)dmMoney();
  setTimeout(fitDrop,380);setTimeout(fitDrop,900)}
$('#dmLocate').addEventListener('click',()=>{
  if(!dm)return;
  if(!navigator.geolocation){dmNote('This browser cannot share your location. Drag the pin to your address instead.');return}
  dmBusy(true);
  navigator.geolocation.getCurrentPosition(pos=>{dmBusy(false);const p=[pos.coords.latitude,pos.coords.longitude];dmCust.setPos(p);dmKit.panTo(dm,p,15);dmUpdate()},
    err=>{dmBusy(false);dmNote(err.code===1?'Location access is blocked. Allow it in your browser settings, or drag the pin to your address.':'We could not find your location. Drag the pin to your address instead.')},
    {enableHighAccuracy:true,timeout:10000})});
$('#dmConfirm').addEventListener('click',()=>open($('#payM')));

/* ---------- payment page ---------- */
const PAY={method:'upi',name:'',phone:'',upi:'',cardNum:'',cardName:'',cardExp:'',cardCvv:'',busy:false,timer:0};
const escH=v=>String(v).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const phoneOK=v=>/^[6-9]\d{9}$/.test(v);
const nameOK=v=>v.trim().length>=2&&/[A-Za-z\u00C0-\u024F\u0900-\u0DFF]/.test(v);
/* ---------- customer details: kept on this device and shared with the delivery partner ---------- */
const PROF_KEY='fd_customer';
try{const sv=JSON.parse(localStorage.getItem(PROF_KEY)||'null');if(sv){if(typeof sv.name==='string')PAY.name=sv.name.slice(0,60);if(typeof sv.phone==='string'&&phoneOK(sv.phone))PAY.phone=sv.phone}}catch(_){}
const saveProf=()=>{try{localStorage.setItem(PROF_KEY,JSON.stringify({name:PAY.name.trim(),phone:PAY.phone}))}catch(_){}};
const SU=window.FDSession&&FDSession.forRole('Customer');
if(SU&&FDSession.fresh('customer',SU)){PAY.name=FDSession.nameOf(SU).slice(0,60);PAY.phone='';saveProf()}   // new login -> profile takes the logged-in details
const firstName=n=>String(n||'').trim().split(/\s+/)[0];
function drawProfile(){const B=$('#profB');
  B.innerHTML=(SU?`<p class="profn"><b>Signed in as</b> ${escH(SU.email)}</p>`:'')+`<p class="profn">Your delivery partner sees your name and the drop-off pin so they can find you and hand over your food. We never show your payment details.</p>
  <label class="fld"><span>Your name</span><input id="prName" maxlength="60" placeholder="Full name" autocomplete="name"><small class="err" id="prNameE"></small></label>
  <label class="fld"><span>Mobile number</span><div class="phone"><b>+91</b><input id="prPhone" inputmode="numeric" maxlength="10" placeholder="10-digit mobile number" autocomplete="tel-national"></div><small class="err" id="prPhoneE"></small></label>
  <div class="profv"><small>What your delivery partner sees</small><b id="prPrev"></b></div>
  <button class="btn" id="prSave" type="button">Save details</button><p class="profs" id="prSaved" role="status"></p>
  <button class="btn light" style="margin-top:14px" data-act="orders" type="button">My orders</button>${SU?`<button class="btn light" style="margin-top:10px" data-act="signout" type="button">Sign out</button>`:''}`;
  $('#prName').value=PAY.name;$('#prPhone').value=PAY.phone;prPrev()}
function prPrev(){const e=$('#prPrev');if(e)e.textContent=nameOK($('#prName').value)?'Delivering to '+$('#prName').value.trim():'Add your name'}
document.addEventListener('input',e=>{const t=e.target;
  if(t.id==='prName'){prPrev();$('#prSaved').textContent='';t.classList.remove('bad');$('#prNameE').textContent=''}
  else if(t.id==='prPhone'){t.value=t.value.replace(/\D/g,'').slice(0,10);$('#prSaved').textContent='';t.classList.remove('bad');$('#prPhoneE').textContent=''}});
document.addEventListener('click',e=>{if(!e.target.closest('#prSave'))return;
  const n=$('#prName'),ph=$('#prPhone');let ok=true;
  if(!nameOK(n.value)){n.classList.add('bad');$('#prNameE').textContent='Enter your name';ok=false}
  if(ph.value&&!phoneOK(ph.value)){ph.classList.add('bad');$('#prPhoneE').textContent='Enter a valid 10-digit mobile number';ok=false}
  if(!ok)return;PAY.name=n.value.trim();PAY.phone=ph.value;saveProf();$('#prSaved').textContent='Saved. We will use these at checkout.'});
const upiOK=v=>/^[a-z0-9._-]{2,}@[a-z]{2,}$/i.test(v.trim());
const cardDigits=()=>PAY.cardNum.replace(/\D/g,'');
const luhn=d=>{let sum=0,alt=false;for(let i=d.length-1;i>=0;i--){let n=+d[i];if(alt){n*=2;if(n>9)n-=9}sum+=n;alt=!alt}return sum%10===0};
const cardOK=()=>{const d=cardDigits();return d.length===16&&luhn(d)};
const cardBrand=d=>/^4/.test(d)?'Visa':/^(5[1-5]|2[2-7])/.test(d)?'Mastercard':/^(60|65|81|82|508)/.test(d)?'RuPay':'';
const expOK=v=>{const m=v.match(/^(\d{2})\/(\d{2})$/);if(!m)return false;const mm=+m[1],yy=2000+ +m[2],now=new Date();return mm>=1&&mm<=12&&(yy>now.getFullYear()||(yy===now.getFullYear()&&mm>=now.getMonth()+1))};
function payReady(){
  if(!nameOK(PAY.name)||!phoneOK(PAY.phone))return false;
  if(PAY.method==='upi')return upiOK(PAY.upi);
  if(PAY.method==='card')return cardOK()&&PAY.cardName.trim().length>1&&expOK(PAY.cardExp)&&/^\d{3}$/.test(PAY.cardCvv);
  return true}
function payInfo(){const m=PAY.method,d=cardDigits();
  return{method:m,paid:m!=='cod',name:PAY.name.trim(),phone:PAY.phone,label:m==='upi'?'UPI · '+PAY.upi.trim():m==='card'?(cardBrand(d)||'Card')+' •••• '+d.slice(-4):'Cash on delivery'}}
function payRefresh(){const b=$('#payGo');if(!b)return;const t=totals();b.disabled=PAY.busy||!payReady();
  b.textContent=PAY.method==='cod'?`Place order · pay ${money(t.total)} on delivery`:`Pay ${money(t.total)}`}
const ICON_CARD='<svg class="ic" viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18M7 15h3"/></svg>';
const ICON_CASH='<svg class="ic" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="10" rx="2"/><circle cx="12" cy="12" r="2.4"/><path d="M6.5 12h.01M17.5 12h.01"/></svg>';
function drawPay(){
  const t=totals(),B=$('#payB');if(!t.n){closeAll();return}
  PAY.busy=false;PAY.cardCvv='';
  const row=(l,v,free)=>v?`<div class="row"><span>${l}</span><span>${money(v)}</span></div>`:(free?`<div class="row"><span>${l}</span><span>Free</span></div>`:'');
  const lines=t.gs.map(g=>{const rs=REST_BY[g.rid];return `<div class="ps"><div class="pst">${logo(rs,34)}<b>${rs.n}</b><span>${money(g.sub)}</span></div><ul>${g.ids.map(id=>`<li><span>${DB[id].n}${cart[id]>1?' × '+cart[id]:''}</span><span>${money(DB[id].p*cart[id])}</span></li>`).join('')}</ul></div>`}).join('');
  const M=[['upi','<span class="pmi">UPI</span>','UPI','Google Pay, PhonePe, Paytm or any UPI ID'],['card','<span class="pmi">'+ICON_CARD+'</span>','Credit or debit card','Visa, Mastercard and RuPay'],['cod','<span class="pmi">'+ICON_CASH+'</span>','Cash on delivery','Pay in cash when your food arrives']];
  B.innerHTML=`<div class="payl"><h3 class="sub">Order summary</h3>${lines}${row('Subtotal',t.sub)}${row('Delivery',t.ship,true)}${row(t.n>1?'Delivery tips ('+t.n+' riders)':'Delivery tip',t.tip)}${row('Faster delivery',t.fast)}${row('Eco saver',t.eco)}<div class="row t"><span>Total</span><span>${money(t.total)}</span></div>
    <p class="paydrop">${t.n>1?`Your food will arrive as <b>${t.n} separate orders</b>, one from each restaurant. `:''}Drop-off pin: ${DROP.ll[0].toFixed(4)}, ${DROP.ll[1].toFixed(4)}</p></div>
  <div class="payr"><h3 class="sub">Your details</h3>
    <label class="fld"><span>Your name, shown to your delivery partner</span><input id="pName" maxlength="60" placeholder="Full name" autocomplete="name"><small class="err" id="pNameE"></small></label>
    <h3 class="sub">Your mobile number</h3>
    <label class="fld"><span>We will text your delivery OTP here</span><div class="phone"><b>+91</b><input id="pPhone" inputmode="numeric" maxlength="10" placeholder="10-digit mobile number" autocomplete="tel-national"></div><small class="err" id="pPhoneE"></small></label>
    <h3 class="sub">Choose how to pay</h3>
    <div class="pm" role="radiogroup" aria-label="Payment method">${M.map(m=>`<label class="pmo${PAY.method===m[0]?' on':''}"><input type="radio" name="pm" value="${m[0]}"${PAY.method===m[0]?' checked':''}>${m[1]}<div><b>${m[2]}</b><small>${m[3]}</small></div></label>`).join('')}</div>
    <div class="pp" data-p="upi"${PAY.method==='upi'?'':' hidden'}>
      <label class="fld"><span>UPI ID</span><input id="pUpi" placeholder="yourname@okaxis" autocomplete="off" autocapitalize="off" spellcheck="false"><small class="err" id="pUpiE"></small></label>
      <div class="apps"><span>Quick fill</span><button type="button" data-app="@okaxis">Google Pay</button><button type="button" data-app="@ybl">PhonePe</button><button type="button" data-app="@paytm">Paytm</button><button type="button" data-app="@upi">BHIM</button></div>
      <p class="pnote">A payment request goes to your UPI app. Approve it there to place the order.</p></div>
    <div class="pp" data-p="card"${PAY.method==='card'?'':' hidden'}>
      <label class="fld"><span>Card number <em id="pBrand"></em></span><input id="pCn" inputmode="numeric" maxlength="19" placeholder="1234 5678 9012 3456" autocomplete="cc-number"><small class="err" id="pCnE"></small></label>
      <label class="fld"><span>Name on card</span><input id="pCname" placeholder="As printed on the card" autocomplete="cc-name"></label>
      <div class="two"><label class="fld"><span>Expiry</span><input id="pCe" inputmode="numeric" maxlength="5" placeholder="MM/YY" autocomplete="cc-exp"><small class="err" id="pCeE"></small></label>
      <label class="fld"><span>CVV</span><input id="pCv" type="password" inputmode="numeric" maxlength="3" placeholder="•••" autocomplete="cc-csc"></label></div>
      <p class="pnote">Demo: 4111 1111 1111 1111 works, with any future expiry and any 3-digit CVV.</p></div>
    <div class="pp" data-p="cod"${PAY.method==='cod'?'':' hidden'}><div class="pcod">Pay in cash to your delivery partner when the food arrives. Keep the exact amount ready if you can.${t.n>1?`<ul>${t.gs.map(g=>`<li><span>${REST_BY[g.rid].n}</span><span>${money(g.total)}</span></li>`).join('')}</ul>You will pay each rider separately.`:''}<br>You will still get a delivery OTP by text. Share it with the rider at your door.</div></div>
    <button class="btn paybtn" id="payGo" type="button" disabled></button>
    <p class="dm-demo">Demo checkout. No real payment is taken.</p></div>`;
  $('#pName').value=PAY.name;$('#pPhone').value=PAY.phone;$('#pUpi').value=PAY.upi;$('#pCn').value=PAY.cardNum;$('#pCname').value=PAY.cardName;$('#pCe').value=PAY.cardExp;$('#pBrand').textContent=cardBrand(cardDigits());
  payRefresh()}
const PAYCHK={pName:[()=>nameOK(PAY.name),'pNameE','Enter your name so your delivery partner can find you'],pPhone:[()=>phoneOK(PAY.phone),'pPhoneE','Enter a valid 10-digit mobile number'],pUpi:[()=>upiOK(PAY.upi),'pUpiE','Enter a valid UPI ID, like name@okaxis'],pCn:[cardOK,'pCnE','Check the card number'],pCe:[()=>expOK(PAY.cardExp),'pCeE','Enter a valid expiry date, like 08/29']};
function payCheck(id,show){const c=PAYCHK[id];if(!c)return;const ok=c[0](),el=$('#'+id),er=$('#'+c[1]);if(!el||!er)return;
  if(ok||show){el.classList.toggle('bad',!ok);er.textContent=ok?'':c[2]}}
$('#payM').addEventListener('input',e=>{const t=e.target,id=t.id;
  if(id==='pName'){PAY.name=t.value}
  else if(id==='pPhone'){t.value=PAY.phone=t.value.replace(/\D/g,'').slice(0,10)}
  else if(id==='pUpi'){PAY.upi=t.value.trim()}
  else if(id==='pCn'){const d=t.value.replace(/\D/g,'').slice(0,16);PAY.cardNum=t.value=d.replace(/(.{4})(?=.)/g,'$1 ');$('#pBrand').textContent=cardBrand(d)}
  else if(id==='pCname'){PAY.cardName=t.value}
  else if(id==='pCe'){let d=t.value.replace(/\D/g,'').slice(0,4);if(d.length>2)d=d.slice(0,2)+'/'+d.slice(2);PAY.cardExp=t.value=d}
  else if(id==='pCv'){PAY.cardCvv=t.value=t.value.replace(/\D/g,'').slice(0,3)}
  else return;
  if(t.classList.contains('bad'))payCheck(id,false);payRefresh()});
$('#payM').addEventListener('focusout',e=>payCheck(e.target.id,true));
$('#payM').addEventListener('change',e=>{if(e.target.name!=='pm')return;PAY.method=e.target.value;
  document.querySelectorAll('#payB .pmo').forEach(l=>l.classList.toggle('on',l.querySelector('input').checked));
  document.querySelectorAll('#payB .pp').forEach(p=>p.hidden=p.dataset.p!==PAY.method);payRefresh()});
$('#payM').addEventListener('click',e=>{
  const app=e.target.closest('[data-app]');
  if(app){const i=$('#pUpi'),head=i.value.split('@')[0];i.value=PAY.upi=head+app.dataset.app;i.focus();if(!head)i.setSelectionRange(0,0);payCheck('pUpi',false);payRefresh();return}
  if(e.target.closest('[data-pay=cancel]')){clearTimeout(PAY.timer);PAY.busy=false;$('#payWait').hidden=true;payRefresh();return}
  if(e.target.closest('#payGo'))startPay()});
function showPayWait(m){const t=totals(),w=$('#payWait');
  w.innerHTML=m==='upi'?`<div><div class="spin"></div><h4>Approve the payment</h4><p>We sent a request for <b>${money(t.total)}</b> to <b>${escH(PAY.upi)}</b>. Open your UPI app and approve it.</p><button class="btn light" type="button" data-pay="cancel">Cancel</button></div>`
   :`<div><div class="spin"></div><h4>Processing your card</h4><p>Please keep this page open while your bank confirms <b>${money(t.total)}</b>.</p></div>`;
  w.hidden=false}
function startPay(){if(PAY.busy||!payReady())return;PAY.busy=true;payRefresh();
  if(PAY.method==='cod'){finishPay();return}
  showPayWait(PAY.method);PAY.timer=setTimeout(finishPay,PAY.method==='upi'?2800:2000)}
function finishPay(){if(!PAY.busy||!$('#payM').classList.contains('on'))return;const info=payInfo();$('#payWait').hidden=true;open($('#cartD'));checkout(info)}

/* ---------- delivery OTP: texted to the customer once the order is placed ---------- */
const newOtp=()=>String(1000+Math.floor(Math.random()*9000));
function sendSms(o,delay){setTimeout(()=>{if(o.cancelled)return;const box=$('#sms'),n=document.createElement('div'),p=o.phone;
  n.className='sms';n.innerHTML=`<div class="smh"><i></i><b>Messages</b><span>now</span></div><p><b>FoodDispatch:</b> ${o.otp} is your delivery OTP for order ${o.id}. Share it with ${o.rider} only when your food reaches you. Never share it with anyone else.</p><small>Sent to +91 ${p.slice(0,5)} ${p.slice(5)}</small>`;
  const gone=()=>{n.classList.add('out');setTimeout(()=>n.remove(),350)};n.addEventListener('click',gone);box.appendChild(n);setTimeout(gone,14000)},delay)}

/* overlays */
const ov=$('#ov');
function open(el){closeAll();if(el.id==='cartD')drawCart();if(el.id==='ordD')drawOrders();if(el.id==='profD')drawProfile();if(el.id==='dropM')setTimeout(openDrop,0);if(el.id==='payM')drawPay();el.classList.add('on');ov.classList.add('on');document.body.classList.add('lock');if(el.id==='trackM'){drawTrack();setTimeout(fitTrack,380)}}
function closeAll(){['#cartD','#ordD','#profD','#menuD','#brM','#trackM','#dropM','#payM'].forEach(s=>$(s).classList.remove('on'));ov.classList.remove('on');document.body.classList.remove('lock');$('#sres').classList.remove('on');done=false;NAV=[];$('#cfM').hidden=true;clearTimeout(PAY.timer);PAY.busy=false;$('#payWait').hidden=true}
ov.onclick=closeAll;document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAll()});
$('#menuB').innerHTML=`<a data-go="top"><img src="${IMGS.momos}" alt="">Home</a>`+CATS.map(c=>`<a data-cat="${c[0]}"><img src="${IMGS[c[2]]}" alt="">${c[0]}</a>`).join('')+`<a data-act="rests"><img src="${IMGS.paneer}" alt="">All restaurants</a><a data-act="all"><img src="${IMGS.dal}" alt="">All dishes</a><a data-act="cart"><img src="${IMGS.lollipop}" alt="">My bucket</a><a data-act="track"><img src="${IMGS.paneer}" alt="">Track order</a><a data-act="orders"><img src="${IMGS.tikka}" alt="">My orders</a><a data-act="profile"><img src="${IMGS.dal}" alt="">Your details</a>`;

function toast(t){const e=$('#toast');e.innerHTML=t;e.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('on'),2000)}
function go(id){closeAll();const el=id==='top'?document.body:document.getElementById(id);if(!el)return;setTimeout(()=>id==='top'?scrollTo({top:0,behavior:'smooth'}):el.scrollIntoView({behavior:'smooth',block:'start'}),60)}
function fly(img){if(!img)return;const r=img.getBoundingClientRect(),t=$('#cart').getBoundingClientRect(),f=document.createElement('img');f.src=img.src;f.className='fly';
  Object.assign(f.style,{left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px'});document.body.appendChild(f);
  requestAnimationFrame(()=>requestAnimationFrame(()=>Object.assign(f.style,{left:t.left+8+'px',top:t.top+8+'px',width:'20px',height:'20px',opacity:.3,transform:'rotate(200deg)'})));
  setTimeout(()=>{f.remove();const k=$('#cart');k.classList.remove('bump');void k.offsetWidth;k.classList.add('bump')},800)}

document.addEventListener('click',e=>{
  const pc=e.target.closest('.pc[data-id]');
  if(pc){const id=pc.dataset.id,img=pc.querySelector('.pi img')||document.querySelector('#brB .dhero img');
    if(e.target.closest('.plus')){if(addItem(id,1,img))toast(`Added from ${DB[id].k}`);return}
    if(e.target.closest('.p')){addItem(id,1,img);return}
    if(e.target.closest('.m')){setQty(id,(cart[id]||0)-1);return}
    if(e.target.closest('.add'))return}
  const nv=e.target.closest('[data-dish],[data-rest],[data-offer],[data-cat],[data-nav]');
  if(nv){if(nv.tagName==='A')e.preventDefault();$('#sres').classList.remove('on');
    const D=nv.dataset;
    if(D.nav==='back')navBack();
    else if(D.offer)navGo({t:'offer',o:D.offer});
    else if(D.dish)navGo({t:'dish',d:D.dish});
    else if(D.rest){if($('#cartD').classList.contains('on'))closeAll();navGo({t:'rest',r:D.rest})}
    else if(D.cat)navGo({t:'cat',c:D.cat});
    return}
  const t=e.target.closest('[data-act],[data-go],[data-t]');
  if(!t){if(!e.target.closest('.search'))$('#sres').classList.remove('on');return}
  if(t.tagName==='A')e.preventDefault();
  const a=t.dataset.act;
  if(a==='cart')open($('#cartD'));
  else if(a==='orders')open($('#ordD'));
  else if(a==='profile')open($('#profD'));
  else if(a==='signout')FDSession.signOut();
  else if(a==='track')open($('#trackM'));
  else if(a==='menu')open($('#menuD'));
  else if(a==='all')navGo({t:'dishes'});
  else if(a==='rests')navGo({t:'rests'});
  else if(a==='close')closeAll();
  else if(a==='browse'){closeAll();go('need')}
  else if(a==='dropoff')open($('#dropM'));
  else if(t.dataset.go){if(t.dataset.t)toast(t.dataset.t);go(t.dataset.go)}
  else if(t.dataset.t)toast(t.dataset.t);
});
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.matches&&e.target.matches('[data-dish],[data-rest],[data-cat]'))e.target.click()});
document.querySelectorAll('.fg li:not([data-cat]):not([data-act])').forEach(li=>li.addEventListener('click',()=>toast(li.textContent+' – coming soon')));

$('#q').addEventListener('input',e=>{const v=e.target.value.trim().toLowerCase(),box=$('#sres');
  if(!v){box.classList.remove('on');return}
  const ds=DISH.filter(d=>(d.n+' '+d.s).toLowerCase().includes(v)).slice(0,4),rs=REST.filter(r=>(r.n+' '+r.tag).toLowerCase().includes(v)).slice(0,3);
  box.innerHTML=(ds.length||rs.length)?ds.map(d=>`<div class="sr" data-dish="${d.id}"><img src="${IMGS[d.id]}" alt=""><div>${d.n}<small>from ${money(Math.min(...OFFS[d.id].map(o=>o.p)))} · ${OFFS[d.id].length} restaurants</small></div><b>›</b></div>`).join('')+rs.map(r=>`<div class="sr" data-rest="${r.id}">${logo(r,42)}<div>${r.n}<small>${r.tag}</small></div><b>★ ${r.r}</b></div>`).join(''):`<div class="sr">Nothing found for “${e.target.value.replace(/[<>&]/g,'')}”</div>`;
  box.classList.add('on')});
$('#q').addEventListener('focus',e=>{if(e.target.value.trim())$('#sres').classList.add('on')});

const TH=['pizza','lasagna','bruschetta','sandwich'];
$('#thumbs').innerHTML=TH.map((k,i)=>`<button data-n="${i}"><img src="${IMGS[k]}" alt=""></button>`).join('');
$('#dots').innerHTML=TH.slice(0,3).map((k,i)=>`<button data-n="${i}" aria-label="Slide ${i+1}"></button>`).join('');
function show(n){$('#mainBox').innerHTML=`<img src="${IMGS[TH[n]]}" alt="">`;
  document.querySelectorAll('#thumbs button').forEach((b,i)=>b.classList.toggle('on',i===n));
  document.querySelectorAll('#dots button').forEach((b,i)=>b.classList.toggle('on',i===n%3))}
show(0);
$('#thumbs').addEventListener('click',e=>{const b=e.target.closest('button');if(b)show(+b.dataset.n)});
$('#dots').addEventListener('click',e=>{const b=e.target.closest('button');if(b)show(+b.dataset.n)});
$('#dealAdd').onclick=()=>{if(addItem('combo',1,$('#mainBox img')))toast('Italian Feast Combo added from '+NP)};
$('#dealBuy').onclick=()=>{if(!cart.combo&&!addItem('combo',1))return;open($('#cartD'))};
$('#wish').onclick=e=>{const on=e.target.textContent.includes('♥');e.target.textContent=on?'♡ ADD TO WISHLIST':'♥ WISHLISTED';toast(on?'Removed from wishlist':'Saved to your wishlist')};
let secs=270*86400+13*3600+10*60+32;
setInterval(()=>{secs--;const d=Math.floor(secs/86400),h=Math.floor(secs%86400/3600),m=Math.floor(secs%3600/60),s=secs%60,p=x=>String(x).padStart(2,'0');$('#timer').textContent=`${d} : ${p(h)} : ${p(m)} : ${p(s)}`},1000);

/* ---------- delivery rating + invoice ---------- */
const RATE={o:null,driver:0,food:0},RQ=[];
function paintStars(){document.querySelectorAll('#rateM .stars').forEach(g=>[...g.children].forEach((b,i)=>{const on=i<RATE[g.dataset.k];b.classList.toggle('on',on);b.setAttribute('aria-checked',i+1===RATE[g.dataset.k])}));
  $('#rateM [data-rate=send]').disabled=!(RATE.driver&&RATE.food)}
document.querySelectorAll('#rateM .stars').forEach(g=>g.innerHTML=[1,2,3,4,5].map(v=>`<button type="button" role="radio" aria-checked="false" aria-label="${v} star${v>1?'s':''}" data-v="${v}">★</button>`).join(''));
function askRating(o){if(o.rated)return;if(!$('#rateM').hidden){if(!RQ.includes(o))RQ.push(o);return}RATE.o=o;RATE.driver=RATE.food=0;
  $('#rateS').textContent=`${o.k}, order ${o.id}`;$('#rdL').textContent='Rate your driver, '+o.rider;paintStars();$('#rateM').hidden=false;$('#rateM .stars button').focus()}
$('#rateM').addEventListener('click',e=>{const s=e.target.closest('.stars button'),a=e.target.closest('[data-rate]'),o=RATE.o;
  if(s){RATE[s.parentNode.dataset.k]=+s.dataset.v;paintStars();return}
  if(!a)return;if(a.dataset.rate==='inv'){invoice(o);return}
  if(a.dataset.rate==='send'){o.rated=true;o.driverRating=RATE.driver;o.foodRating=RATE.food;toast('Thanks for your rating!')}
  $('#rateM').hidden=true;const nx=RQ.shift();if(nx)setTimeout(()=>askRating(nx),400)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#rateM').hidden){$('#rateM').hidden=true;const nx=RQ.shift();if(nx)setTimeout(()=>askRating(nx),400)}});
$('#ordB').addEventListener('click',e=>{const b=e.target.closest('[data-inv]');if(b)invoice(orders.find(o=>o.id===b.dataset.inv))});
function invoice(o){
  const e=v=>String(v).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const rows=o.lines?o.lines.map(l=>`<tr><td>${e(l.n)}</td><td>${l.q}</td><td>${money(l.p)}</td><td>${money(l.p*l.q)}</td></tr>`).join(''):o.items.split(', ').map(n=>`<tr><td colspan="4">${e(n)}</td></tr>`).join('');
  const x=(l,v)=>v?`<tr class="s"><td colspan="3">${l}</td><td>${money(v)}</td></tr>`:'';
  const sum=o.lines?`${x('Subtotal',o.sub)}<tr class="s"><td colspan="3">Delivery</td><td>${o.ship?money(o.ship):'Free'}</td></tr>${x('Delivery tip',o.tip)}${x('Faster delivery',o.fast)}${x('Eco saver',o.eco)}`:'';
  const when=o.start?new Date(o.start).toLocaleString('en-IN'):o.date;
  const html=`<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Invoice ${e(o.id)}</title><style>body{font:14px/1.5 system-ui,sans-serif;color:#2a1a12;max-width:640px;margin:32px auto;padding:0 20px}h1{font:400 28px Georgia,serif;color:#3d2415;margin:0}table{width:100%;border-collapse:collapse;margin-top:18px}th,td{text-align:right;padding:8px 6px;border-bottom:1px solid #e4d7c5}th:first-child,td:first-child{text-align:left}th{background:#f3e8da}.s td{border:0;padding:4px 6px}.t td{border-top:2px solid #3d2415;font-weight:700;font-size:16px}p{color:#6d5d54;margin:4px 0}@media print{body{margin:0}}</style></head><body><h1>FoodDispatch</h1><p>Invoice INV-${e(o.id)} · ${e(when)}</p><p>Restaurant: ${e(o.k)}${o.rider?' · Delivered by '+e(o.rider)+' ('+e(o.plate)+')':''}</p>${o.pay?'<p>Payment: '+e(o.payMethod==='cod'?'Cash on delivery':o.pay)+'</p>':''}<table><tr><th>Item</th><th>Qty</th><th>Price</th><th>Amount</th></tr>${rows}${sum}<tr class="t"><td colspan="3">${o.payMethod==='cod'?'Total (cash on delivery)':'Total paid'}</td><td>${money(o.total)}</td></tr></table><p style="margin-top:24px">Thank you for ordering with FoodDispatch.</p></body></html>`;
  const a=document.createElement('a'),u=URL.createObjectURL(new Blob([html],{type:'text/html'}));a.href=u;a.download=`FoodDispatch-invoice-${o.id}.html`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),2000);toast('Invoice downloaded')}

/* ---------- cancel order (allowed only until a delivery partner accepts) ---------- */
let CXO=null;
function askCancel(id){const o=orders.find(x=>x.id===id);if(!o)return;
  if(!canCancel(o)){toast('A delivery partner has already accepted this order, so it can no longer be cancelled');drawOrders();if($('#trackM').classList.contains('on'))drawTrack();return}
  CXO=o;$('#cancelP').innerHTML=`<b>${o.k}</b>, order ${o.id}. `+(o.payMethod==='cod'||!o.pay?'You have not paid anything, so there is nothing to refund.':`${money(o.total)} will be refunded to ${escH(o.pay)} within 3 to 5 working days.`)+' You can cancel only until a delivery partner accepts it.';
  $('#cancelM').hidden=false;$('#cancelM [data-cx=no]').focus()}
function closeCancel(){$('#cancelM').hidden=true;CXO=null}
document.addEventListener('click',e=>{
  const contact=e.target.closest('[data-contact-rest]');if(contact){const id=contact.dataset.contactRest,o=orders.find(x=>x.id===id);if(!o)return;const msg=prompt('Write a message to '+o.k+':');if(msg&&msg.trim()){if(window.FDSharedOrders)FDSharedOrders.update(id,{customerMessage:msg.trim().slice(0,500),customerMessageAt:Date.now()},'Customer');toast('Message sent to '+o.k); }return}
  const b=e.target.closest('[data-cancel]');if(b){askCancel(b.dataset.cancel);return}
  const c=e.target.closest('#cancelM [data-cx]');if(!c)return;
  const o=CXO;closeCancel();if(c.dataset.cx!=='yes'||!o)return;
  if(!canCancel(o)){toast('Too late, a delivery partner just accepted this order');drawOrders();if($('#trackM').classList.contains('on'))drawTrack();return}
  o.cancelled=true;o.cancelledAt=Date.now();if(window.FDSharedOrders)FDSharedOrders.update(o.id,{status:'Cancelled'},'Customer');
  const nx=orders.find(x=>x.start&&isLive(x));TRK.id=nx?nx.id:o.id;
  toast(`Order ${o.id} cancelled`);drawOrders();if($('#trackM').classList.contains('on'))drawTrack()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#cancelM').hidden)closeCancel()});

const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.08});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));
bootMaps();   // start loading the map provider once everything above is defined
