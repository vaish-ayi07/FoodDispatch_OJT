const KEY='fooddispatch_driver_v1', SPEED=20, SCALE=60000; // real time: 1 estimated minute = 60 s
const now=()=>Date.now();
const fmt=t=>new Date(t).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
const rad=d=>d*Math.PI/180;
function hav(a,b,c,d){const R=6371,x=rad(c-a),y=rad(d-b),h=Math.sin(x/2)**2+Math.cos(rad(a))*Math.cos(rad(c))*Math.sin(y/2)**2;return 2*R*Math.asin(Math.sqrt(h))}
const eta=(km,prep=0)=>Math.max(1,Math.ceil(km/SPEED*60+prep));
// customer orders carry the real route time and distance from checkout; use them so every page shows the same figures
const shOf=o=>o&&o.shared&&window.FDSharedOrders?FDSharedOrders.get(o.id):null;
const tripMin=(o,km)=>{const s=shOf(o);return s&&s.travelMin>0?s.travelMin:eta(km)};
const tripKm=(o,km)=>{const s=shOf(o);return s&&s.distKm>0?s.distKm:km};
function seed(){
  const o=(id,r,rl,rg,c,it,tot,ar,dl,dg,st,pay)=>({id,rest:r,rLat:rl,rLng:rg,cust:c,items:it,total:tot,area:ar,dLat:dl,dLng:dg,status:st,pay,mine:false,ev:[{s:'Placed',at:now()-9e5}]});
  return {prof:{name:'Ravi Kumar',phone:'9876543210',vehicle:'Motorbike',plate:'KA 01 AB 1234',zone:'Indiranagar & Koramangala'},drv:{lat:12.9716,lng:77.5946},active:null,orders:[
   o('FD-1042','Dosa Darbar',12.9750,77.6010,'Ananya R.','2 × Masala dosa, 1 × Filter coffee',420,'Indiranagar, Block C',12.9784,77.6408,'Ready',68),
   o('FD-1043','Biryani Bay',12.9611,77.6387,'Karthik S.','1 × Chicken biryani, Raita',360,'HAL 2nd Stage',12.9719,77.6412,'Ready',54),
   o('FD-1044','Pizza Pagoda',12.9352,77.6245,'Meera N.','Large paneer pizza, Garlic bread',640,'Koramangala 5th Block',12.9279,77.6271,'Ready',72),
   o('FD-1045','Green Bowl',12.9698,77.7499,'Rohit P.','Quinoa salad, Cold-pressed juice',390,'Whitefield Main Rd',12.9857,77.7480,'Preparing',60),
   o('FD-1046','Chai & Chaat',12.9304,77.5834,'Divya K.','Pani puri, Masala chai ×2',210,'Jayanagar 4th Block',12.9250,77.5938,'Preparing',40),
   {...{id:'FD-1031',rest:'Burger Barn',cust:'Sana M.',area:'MG Road',total:480,pay:58,status:'Delivered',mine:true,items:'2 × Burger',ev:[{s:'Delivered',at:now()-864e5}]}},
   {...{id:'FD-1029',rest:'Dosa Darbar',cust:'Arjun V.',area:'Domlur',total:300,pay:44,status:'Delivered',mine:true,items:'Set dosa',ev:[{s:'Delivered',at:now()-1728e5}]}}
  ]}}
let S, tab='q', q='', f='All', storeErr=false;
const avail=()=>S.avail!==false;
function toggleAvail(){if(act())return toast('Finish your current delivery before going unavailable.',1);S.avail=!avail();save();render();toast(avail()?'You are available. Orders can be accepted.':'You are unavailable. Order acceptance is paused.')}
function load(){try{S=JSON.parse(localStorage.getItem(KEY))}catch(e){S=null;storeErr=true}if(!S||!S.orders)S=seed();if(!S.prof)S.prof=seed().prof}
function importSharedOrders(){
 if(!window.FDSharedOrders)return;
 FDSharedOrders.read().forEach(x=>{
  if(!['Ready','Preparing'].includes(x.status))return;
  let o=S.orders.find(y=>y.id===x.id);
  if(!o){
   o={id:x.id,rest:x.restaurant||'FoodDispatch restaurant',rLat:x.restaurantLat||12.9352,rLng:x.restaurantLng||77.6245,
    cust:x.customer||'Customer',items:Array.isArray(x.items)?x.items.join(', '):String(x.items||'Order'),
    total:x.total||0,area:x.area||x.deliveryLabel||'Delivery area',dLat:x.customerLat||12.985,dLng:x.customerLng||77.723,
    status:x.status,pay:0,otp:x.otp||'',mine:false,shared:true,ev:(x.events||[{status:'Placed',at:x.createdAt||now()}]).map(e=>({s:e.status,at:e.at}))};
   S.orders.unshift(o);
  }else if(o.shared){o.status=x.status;o.driverId=x.driverId;o.driverName=x.driverName;}
 });
}

const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const RA={'Dosa Darbar':'12, 100 Feet Road, Indiranagar','Biryani Bay':'48, HAL 2nd Stage Main Road','Pizza Pagoda':'5th Block, Koramangala Industrial Layout','Green Bowl':'22, ITPL Main Road, Whitefield','Chai & Chaat':'4th Block, Jayanagar Shopping Complex'};
const CP={'Ananya R.':'+919800000001','Karthik S.':'+919800000002','Meera N.':'+919800000003','Rohit P.':'+919800000004','Divya K.':'+919800000005'};
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){storeErr=true;toast('Data could not be saved. Your current order stays on screen.',1)}}
function toast(m,e){document.querySelectorAll('.toast').forEach(t=>t.remove());const t=document.createElement('div');t.className='toast'+(e?' err':'');t.setAttribute('role',e?'alert':'status');t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.remove(),3200)}
const act=()=>S.orders.find(o=>o.id===S.active);
const byId=id=>S.orders.find(o=>o.id===id);
// StatusEngine: drivers may only do Picked up and Delivered
function allowed(o,next){
  if(o.status==='Ready'&&o.mine&&next==='Picked up'){if(o.accAt&&now()<o.accAt+o.d1)return{ok:false,msg:'You have not reached the restaurant yet.'};return{ok:true}}
  if(o.status==='Picked up'&&next==='Delivered'){
    if(now()<o.startedAt+o.dur)return{ok:false,msg:'Not yet. Delivered unlocks when the estimated time ends.'};
    return{ok:true}}
  return{ok:false,msg:'Only the assigned driver can change this step, and only in order.'}}
function ev(o,s){o.status=s;o.ev.push({s,at:now()});if(o.shared&&window.FDSharedOrders)FDSharedOrders.update(o.id,{status:s,driverName:S.prof.name,driverReal:true,driverLat:S.drv.lat,driverLng:S.drv.lng},'Driver')}
function accept(id){
  if(!avail())return toast('You are unavailable. Turn availability on to accept orders.',1);
  if(S.active)return toast('Finish your current delivery before accepting another.',1);
  const o=byId(id);if(!o||o.status!=='Ready')return toast('This order is not ready yet.',1);
  o.mine=true;S.active=id;if(o.shared)S.drv={lat:o.rLat+.011,lng:o.rLng-.009};o.from={lat:S.drv.lat,lng:S.drv.lng};o.accAt=now();o.km1=hav(o.from.lat,o.from.lng,o.rLat,o.rLng);o.d1=eta(o.km1)*SCALE;o.ev.push({s:'Accepted by you',at:now()});if(o.shared&&window.FDSharedOrders)FDSharedOrders.update(o.id,{driverName:S.prof.name,driverReal:true,driverLat:S.drv.lat,driverLng:S.drv.lng,approachFrom:o.accAt,approachTo:o.accAt+o.d1},'Driver');save();tab='a';render();toast('Order accepted. Head to '+o.rest+'.')}
function pickup(){const o=act(),r=allowed(o,'Picked up');if(!r.ok)return toast(r.msg,1);
  if(o.shared&&window.FDSharedOrders){const sh=FDSharedOrders.get(o.id)||{};FDSharedOrders.update(o.id,{driverPickupConfirmed:true,driverName:S.prof.name,driverReal:true,driverLat:S.drv.lat,driverLng:S.drv.lng},'Driver');if(!sh.handedOver){save();render();return toast('Pickup confirmed. Waiting for the restaurant to confirm handover.');}}
  o.startedAt=now();o.otp=(o.shared&&window.FDSharedOrders&&FDSharedOrders.get(o.id)&&FDSharedOrders.get(o.id).otp)||String(Math.floor(1000+Math.random()*9000));o.tries=0;const km0=hav(o.rLat,o.rLng,o.dLat,o.dLng),km=tripKm(o,km0);o.km=km;o.etaMin=tripMin(o,km0);o.dur=o.etaMin*SCALE;
  S.drv={lat:o.rLat,lng:o.rLng};ev(o,'Picked up');if(o.shared&&window.FDSharedOrders)FDSharedOrders.update(o.id,{driverPickupConfirmed:true,handedOver:true,status:'Picked up',pickedAt:o.startedAt},'Driver');save();render();toast('Pickup confirmed by both sides. Live location is now streaming.')}
function deliver(){const o=act(),r=allowed(o,'Delivered');if(!r.ok)return toast(r.msg,1);
  const v=(document.getElementById('otp')||{}).value||'';
  if(o.tries>=3)return toast('Too many wrong codes. Tap Resend code.',1);
  if(!/^\d{4}$/.test(v))return toast('Enter the 4-digit code from the customer.',1);
  if(v!==o.otp){o.tries=(o.tries||0)+1;save();render();return toast(o.tries>=3?'Wrong code. Delivery locked. Tap Resend code.':'Wrong code. '+(3-o.tries)+' tries left.',1)}
  ev(o,'Delivered');S.drv={lat:o.dLat,lng:o.dLng};S.active=null;save();tab='h';render();toast('Delivered. You can now pick your next order.')}
function prog(o){return Math.min(1,(now()-o.startedAt)/o.dur)}
function pos(o){const p=prog(o);return{lat:o.rLat+(o.dLat-o.rLat)*p,lng:o.rLng+(o.dLng-o.rLng)*p}}
function mapSvg(o,p){
  const la=[o.rLat,o.dLat],ln=[o.rLng,o.dLng],a=Math.min(...la),b=Math.max(...la),c=Math.min(...ln),d=Math.max(...ln);
  const X=g=>30+(g-c)/((d-c)||1e-4)*240,Y=g=>150-(g-a)/((b-a)||1e-4)*120;
  const dr=p?{x:X(p.lng),y:Y(p.lat)}:{x:X(o.rLng),y:Y(o.rLat)};
  return `<svg viewBox="0 0 300 180" role="img" aria-label="Map area with restaurant, customer and driver"><defs><pattern id="g" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0V30" fill="none" stroke="#E8D5C2"/></pattern></defs><rect width="300" height="180" fill="url(#g)"/><line x1="${X(o.rLng)}" y1="${Y(o.rLat)}" x2="${X(o.dLng)}" y2="${Y(o.dLat)}" stroke="#9A6A4B" stroke-width="3" stroke-dasharray="6 5"/><rect x="${X(o.rLng)-9}" y="${Y(o.rLat)-9}" width="18" height="18" rx="4" fill="#3B2316"/><text x="${X(o.rLng)}" y="${Y(o.rLat)+4}" font-size="10" text-anchor="middle" fill="#fff">R</text><circle cx="${X(o.dLng)}" cy="${Y(o.dLat)}" r="10" fill="#fff" stroke="#6F4630" stroke-width="3"/><text x="${X(o.dLng)}" y="${Y(o.dLat)+4}" font-size="10" text-anchor="middle" fill="#6F4630">C</text><circle cx="${dr.x}" cy="${dr.y}" r="8" fill="#C2410C" stroke="#fff" stroke-width="3"/></svg>`}
function mapSvg2(o,p){
  const pts=[[o.rLat,o.rLng],[o.dLat,o.dLng]];if(!p)pts.push([S.drv.lat,S.drv.lng]);
  const la=pts.map(x=>x[0]),ln=pts.map(x=>x[1]),a=Math.min(...la),b=Math.max(...la),c=Math.min(...ln),d=Math.max(...ln);
  const X=g=>30+(g-c)/((d-c)||1e-4)*240,Y=g=>150-(g-a)/((b-a)||1e-4)*120;
  const dp=p||S.drv,dx=X(dp.lng),dy=Y(dp.lat),rx=X(o.rLng),ry=Y(o.rLat),cx=X(o.dLng),cy=Y(o.dLat);
  const leg=p?'':`<line x1="${dx}" y1="${dy}" x2="${rx}" y2="${ry}" stroke="#C2410C" stroke-width="4"/>`;
  return `<svg viewBox="0 0 300 180" role="img" aria-label="Map with your position, the restaurant and the customer"><defs><pattern id="g" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0V30" fill="none" stroke="#E8D5C2"/></pattern></defs><rect width="300" height="180" fill="url(#g)"/><line x1="${rx}" y1="${ry}" x2="${cx}" y2="${cy}" stroke="#9A6A4B" stroke-width="3" stroke-dasharray="6 5"/>${leg}<rect x="${rx-10}" y="${ry-10}" width="20" height="20" rx="5" fill="#3B2316"/><text x="${rx}" y="${ry+4}" font-size="11" text-anchor="middle" fill="#fff">R</text><circle cx="${cx}" cy="${cy}" r="10" fill="#fff" stroke="#6F4630" stroke-width="3"/><text x="${cx}" y="${cy+4}" font-size="11" text-anchor="middle" fill="#6F4630">C</text><circle cx="${dx}" cy="${dy}" r="8" fill="#C2410C" stroke="#fff" stroke-width="3"/></svg>`}
function mapSvg3(o){
  if(!o.from){o.from={lat:S.drv.lat,lng:S.drv.lng};o.accAt=o.accAt||now();o.km1=hav(o.from.lat,o.from.lng,o.rLat,o.rLng);o.d1=eta(o.km1)*SCALE}
  const pk=o.status==='Picked up',f=o.from,pts=[[f.lat,f.lng],[o.rLat,o.rLng],[o.dLat,o.dLng]];
  const la=pts.map(x=>x[0]),ln=pts.map(x=>x[1]),a=Math.min(...la),b=Math.max(...la),c=Math.min(...ln),d=Math.max(...ln);
  const X=g=>30+(g-c)/((d-c)||1e-4)*240,Y=g=>150-(g-a)/((b-a)||1e-4)*110;
  const F={x:X(f.lng),y:Y(f.lat)},R={x:X(o.rLng),y:Y(o.rLat)},C={x:X(o.dLng),y:Y(o.dLat)};
  const sd=o.id.split('').reduce((h,c)=>(h*31+c.charCodeAt(0))|0,7),rn=k=>{const v=Math.sin(sd+k*12.9898)*43758.5453;return v-Math.floor(v)};
  const el=(s,e,k)=>{const dx=e.x-s.x,dy=e.y-s.y,f1=.22+rn(k)*.2,f2=.58+rn(k+1)*.2,ym=.35+rn(k+2)*.3;return[s,{x:s.x+dx*f1,y:s.y},{x:s.x+dx*f1,y:s.y+dy*ym},{x:s.x+dx*f2,y:s.y+dy*ym},{x:s.x+dx*f2,y:e.y},e]};
  const at=(P,t)=>{const L=[];let tot=0;for(let i=1;i<P.length;i++){const l=Math.hypot(P[i].x-P[i-1].x,P[i].y-P[i-1].y);L.push(l);tot+=l}let s=t*(tot||1);for(let i=0;i<L.length;i++){if(s<=L[i]||i===L.length-1){const u=L[i]?Math.min(1,s/L[i]):0;return{x:P[i].x+(P[i+1].x-P[i].x)*u,y:P[i].y+(P[i+1].y-P[i].y)*u}}s-=L[i]}return P[P.length-1]};
  const P1=el(F,R,1),P2=el(R,C,5),t1=pk?1:Math.min(1,Math.max(0,(now()-o.accAt)/o.d1));
  const D=pk?at(P2,prog(o)):at(P1,t1);
  const pl=(P,col,w,da)=>`<polyline points='${P.map(q=>q.x+','+q.y).join(' ')}' fill='none' stroke='${col}' stroke-width='${w}' stroke-linecap='round' stroke-linejoin='round'${da?` stroke-dasharray='${da}'`:''}/>`;
  const lab=(q,t)=>`<text x='${q.x}' y='${q.y+23}' font-size='10' font-weight='700' text-anchor='middle' fill='#3B2316' stroke='#fff' stroke-width='3' paint-order='stroke'>${t}</text>`;
  const road=pk?pl(P1,'#B9A594',4)+pl(P2,'#fff',9)+pl(P2,'#6F4630',5):pl(P2,'#fff',7)+pl(P2,'#9A6A4B',3,'6 6')+pl(P1,'#fff',9)+pl(P1,'#C2410C',5);
  const svg=`<svg viewBox='0 0 300 190' role='img' aria-label='${pk?'Route from the restaurant to the customer':'Route from you to the restaurant'}'><defs><pattern id='g' width='40' height='40' patternUnits='userSpaceOnUse'><rect width='40' height='40' fill='#F3E6D8'/><path d='M0 20H40M20 0V40' stroke='#fff' stroke-width='7'/></pattern></defs><rect width='300' height='190' fill='url(#g)'/><path d='M0 158 Q80 112 150 138 T300 96' fill='none' stroke='#CFE3EA' stroke-width='14'/><rect x='6' y='8' width='46' height='30' rx='8' fill='#DDE8C8'/><rect x='238' y='148' width='52' height='34' rx='8' fill='#DDE8C8'/><path d='M0 36 L300 132' stroke='#fff' stroke-width='5'/><path d='M60 0 L120 190' stroke='#fff' stroke-width='4'/>${road}<rect x='${R.x-10}' y='${R.y-10}' width='20' height='20' rx='5' fill='#3B2316'/><text x='${R.x}' y='${R.y+4}' font-size='11' text-anchor='middle' fill='#fff'>R</text>${lab(R,o.rest)}<circle cx='${C.x}' cy='${C.y}' r='10' fill='#fff' stroke='#6F4630' stroke-width='3'/><text x='${C.x}' y='${C.y+4}' font-size='11' text-anchor='middle' fill='#6F4630'>C</text>${lab(C,'Customer')}<circle class='pulse' cx='${D.x}' cy='${D.y}' r='8' fill='#C2410C'/><circle cx='${D.x}' cy='${D.y}' r='8' fill='#C2410C' stroke='#fff' stroke-width='3'/></svg>`;
  return{svg,km1:o.km1*(1-t1),arr:!pk&&now()>=o.accAt+o.d1,lat:a+(150-D.y)/110*(b-a),lng:c+(D.x-30)/240*(d-c)}}
// ---- Real Google Maps (optional): paste a Google Maps JavaScript API key here (Maps JavaScript + Directions APIs enabled)
const GMAPS_KEY=window.FD_MAPS_API_KEY; // Optional: configure your own restricted Google Maps key.
let gm=null,gmEl=null,gmReady=false,gmMark=null,gmRend=null,gmPath=[],gmPhase='';

function loadGM() {
    if (!GMAPS_KEY || document.getElementById('gmjs')) return;

    window.__gmcb = () => {
        gmReady = true;
        render();
    };

    window.gm_authFailure = () => {
        gmReady = false;
        render();
    };

    const s = document.createElement('script');
    s.id = 'gmjs';

    console.log("FoodDispatch Maps key available:", !!GMAPS_KEY);

    s.src = 'https://maps.googleapis.com/maps/api/js?key='
        + encodeURIComponent(GMAPS_KEY)
        + '&loading=async&callback=__gmcb&v=weekly';

    s.async = true;
    s.defer = true;

    document.head.appendChild(s);
}
function updateMap(){
  const o=act(),ph=document.getElementById('gmap');if(!o||!ph||!gmReady)return;
  const pk=o.status==='Picked up';
  if(!gmEl){gmEl=document.createElement('div');gmEl.id='gmap';gmEl.style.cssText='width:100%;height:280px';gm=new google.maps.Map(gmEl,{center:{lat:o.rLat,lng:o.rLng},zoom:14,disableDefaultUI:true,zoomControl:true});gmMark=new google.maps.Marker({map:gm,zIndex:9,icon:{path:google.maps.SymbolPath.CIRCLE,scale:9,fillColor:'#C2410C',fillOpacity:1,strokeColor:'#fff',strokeWeight:3}});gmRend=new google.maps.DirectionsRenderer({map:gm})}
  ph.replaceWith(gmEl);
  const key=o.id+(pk?'P':'R');
  if(gmPhase!==key){gmPhase=key;gmPath=[];const f=o.from||S.drv,org=pk?{lat:o.rLat,lng:o.rLng}:{lat:f.lat,lng:f.lng},dst=pk?{lat:o.dLat,lng:o.dLng}:{lat:o.rLat,lng:o.rLng};
    new google.maps.DirectionsService().route({origin:org,destination:dst,travelMode:'DRIVING'},(r,st)=>{if(st!=='OK'){gmRoutes(org,dst,pk,o);return}gmLines.forEach(l=>l.setMap(null));gmLines=[];gmRend.setMap(gm);
      gmRend.setOptions({polylineOptions:{strokeColor:pk?'#6F4630':'#C2410C',strokeWeight:6}});gmRend.setDirections(r);gmPath=r.routes[0].overview_path;google.maps.event.trigger(gm,'resize');gmTick(o)})}
  gmTick(o)}
let gmLines=[];
async function gmOsrm(org,dst,pk,o){try{const u='https://router.project-osrm.org/route/v1/driving/'+org.lng+','+org.lat+';'+dst.lng+','+dst.lat+'?overview=full&geometries=geojson';const j=await (await fetch(u)).json();const cs=j.routes[0].geometry.coordinates;gmRend.setMap(null);gmLines.forEach(l=>l.setMap(null));gmPath=cs.map(c=>new google.maps.LatLng(c[1],c[0]));gmLines=[new google.maps.Polyline({map:gm,path:gmPath,strokeColor:pk?'#6F4630':'#C2410C',strokeWeight:6})];const bd=new google.maps.LatLngBounds();gmPath.forEach(p=>bd.extend(p));gm.fitBounds(bd);google.maps.event.trigger(gm,'resize');gmTick(o)}catch(e){toast('Could not draw the road route. Check your internet connection and try again.',1)}}
async function gmRoutes(org,dst,pk,o){try{const {Route}=await google.maps.importLibrary('routes');const r=await Route.computeRoutes({origin:org,destination:dst,travelMode:'DRIVING',fields:['path','viewport']});const rt=r.routes[0];gmRend.setMap(null);gmLines.forEach(l=>l.setMap(null));gmPath=rt.path.map(p=>new google.maps.LatLng(p.lat,p.lng));gmLines=[new google.maps.Polyline({map:gm,path:gmPath,strokeColor:pk?'#6F4630':'#C2410C',strokeWeight:6})];if(rt.viewport)gm.fitBounds(rt.viewport);google.maps.event.trigger(gm,'resize');gmTick(o)}catch(e){gmOsrm(org,dst,pk,o)}}
function gmTick(o){if(!gmPath.length||!gmMark)return;const pk=o.status==='Picked up',t=pk?prog(o):Math.min(1,Math.max(0,(now()-o.accAt)/o.d1)),n=gmPath.length-1,i=Math.min(n,Math.floor(t*n)),a=gmPath[i],b=gmPath[Math.min(n,i+1)],u=t*n-i;gmMark.setPosition({lat:a.lat()+(b.lat()-a.lat())*u,lng:a.lng()+(b.lng()-a.lng())*u})}
function pView(){
  const P=S.prof,done=S.orders.filter(o=>o.status==='Delivered'&&o.mine),earn=done.reduce((s,o)=>s+o.pay,0);
  const st=(n,l)=>`<div style="flex:1;text-align:center"><b class="cap" style="font-size:26px;color:var(--cocoa)">${n}</b><br><span class="sub">${l}</span></div>`;
  return `<h1>Your <span class="kau">profile</span></h1><div class="card" style="display:flex;gap:14px;align-items:center"><div class="av" style="width:64px;height:64px;font-size:30px;flex:none">${esc(P.name.trim().charAt(0).toUpperCase())}</div><div><h3 class="rn">${esc(P.name)}</h3><p class="meta" style="margin:0">${esc(P.vehicle)} • ${esc(P.plate)}<br>Zone: ${esc(P.zone)}${P.email?'<br>'+esc(P.email):''}</p></div></div>
  <div class="card row">${st(done.length,'Deliveries')}${st('₹'+earn,'Earned')}${st('4.8','Rating')}</div>
  <h2>Edit <em>details</em></h2><div class="card"><div style="margin-bottom:10px"><label for="pn">Full name</label><input id="pn" value="${esc(P.name)}"></div><div style="margin-bottom:10px"><label for="pp">Phone (10 digits)</label><input id="pp" inputmode="numeric" value="${esc(P.phone)}"></div><div style="margin-bottom:10px"><label for="pv">Vehicle</label><select id="pv">${['Motorbike','Scooter','Bicycle'].map(v=>`<option ${v===P.vehicle?'selected':''}>${v}</option>`).join('')}</select></div><div style="margin-bottom:10px"><label for="pl">Vehicle number</label><input id="pl" value="${esc(P.plate)}"></div><div style="margin-bottom:14px"><label for="pz">Delivery zone</label><input id="pz" value="${esc(P.zone)}"></div><button class="btn" id="ps">Save profile</button></div>${window.FDSession&&FDSession.forRole('Delivery partner')?'<button class="btn alt" id="so">Sign out</button>':''}`}
function qView(){
  const a=act(),dr=S.drv;
  const list=S.orders.filter(o=>['Ready','Preparing'].includes(o.status)&&!(a&&o.id===a.id));
  let h=`<h1>Pick one, <span class="kau">deliver</span> it well</h1><p class="sub">Orders near you from any restaurant. You can carry one at a time.</p>`;
  if(a)h+=`<div class="note w" role="status">You are on a delivery (${a.id}). Finish it to unlock new orders. <a href="#" data-go="a" style="color:inherit;font-weight:700">Open my trip</a></div>`;
  h+=`<div class="card row" style="align-items:center"><div><b>${avail()?'You are available':'You are unavailable'}</b><p class="meta" style="margin:2px 0 0">${avail()?'Orders can be accepted.':'Orders are paused. Turn back on when ready.'}</p></div><button class="btn ${avail()?'alt':''}" id="av2" style="width:auto;padding:0 16px">${avail()?'Go unavailable':'Go available'}</button></div><h2>Orders <em>nearby</em></h2>`;
  if(!list.length)h+=`<div class="empty">No orders waiting. New ones appear here as kitchens finish preparing.</div>`;
  list.forEach(o=>{const d=hav(dr.lat,dr.lng,o.rLat,o.rLng),t0=hav(o.rLat,o.rLng,o.dLat,o.dLng),t=tripKm(o,t0),tm=tripMin(o,t0),rdy=o.status==='Ready';
    h+=`<article class="card ${rdy?'':'lock'}"><div class="row"><h3 class="rn">${o.rest}</h3><span class="pay">₹${o.pay}</span></div>
    <p class="meta">${o.id} • ${o.items}<br>Deliver to ${o.area}</p>
    <p class="meta"><b>${d.toFixed(1)} km</b> to restaurant • <b>${t.toFixed(1)} km</b> trip • about <b>${tm} min</b> ride &nbsp;<span class="badge ${rdy?'ready':'prep'}">${rdy?'Ready':'Preparing'}</span></p>
    <button class="btn" data-acc="${o.id}" ${(!rdy||a||!avail())?'disabled':''}>${rdy?(a?'Finish current trip first':(avail()?'Accept order':'You are unavailable')):'Waiting for kitchen'}</button></article>`});
  return h}
function otpBlock(o){const lk=o.tries>=3;
  return `<div class="note i"><label for="otp">Customer's 4-digit delivery code</label><input id="otp" inputmode="numeric" maxlength="4" autocomplete="one-time-code" placeholder="••••" style="font-size:24px;letter-spacing:10px;text-align:center" ${lk?'disabled':''}>${o.tries?`<p role="alert" style="color:var(--err);margin:6px 0 0;font-weight:600">${lk?'Locked after 3 wrong codes.':'Wrong code. '+(3-o.tries)+' tries left.'}</p>`:''}<p class="sub" style="margin:8px 0 0">Ask the customer for the code in their app. <a href="#" id="demo" style="color:var(--cocoa);font-weight:700">Show demo code</a></p>${lk?'<button class="btn alt" id="rsd" style="margin-top:8px">Resend code</button>':''}</div>`}
function mapsLink(o,m,picked){
  const f=n=>Number(n).toFixed(6),pt=(a,b)=>f(a)+','+f(b);
  if(![m.lat,m.lng,o.dLat,o.dLng].every(Number.isFinite))return '';
  // path-style link lists every stop explicitly, so Maps draws the full route in the browser and the app
  const stops=[pt(m.lat,m.lng)];
  if(!picked&&Number.isFinite(o.rLat)&&Number.isFinite(o.rLng))stops.push(pt(o.rLat,o.rLng));
  stops.push(pt(o.dLat,o.dLng));
  const u='https://www.google.com/maps/dir/'+stops.join('/')+'/data=!4m2!4m1!3e0';
  return `<a class="btn alt" href="${u}" target="_blank" rel="noopener" aria-label="Open this route in Google Maps (opens a new tab)" style="display:flex;align-items:center;justify-content:center;text-decoration:none;margin:0 0 10px">Open route in Google Maps</a>`}
function aView(){
  const o=act();
  if(!o)return `<h1>My <span class="kau">trip</span></h1><div class="empty card">No active delivery. Accept a ready order from Deliveries.<br><br><button class="btn" data-go="q">Browse orders</button></div>`;
  const picked=o.status==='Picked up',p=picked?pos(o):null,pr=picked?prog(o):0,done=picked&&now()>=o.startedAt+o.dur,left=picked?(done?0:(o.shared&&window.FDSharedOrders&&FDSharedOrders.get(o.id)&&FDSharedOrders.get(o.id).travelMin>0?FDSharedOrders.etaMin(FDSharedOrders.get(o.id)):Math.max(0,Math.ceil((o.startedAt+o.dur-now())/SCALE)))):o.etaMin;
  const m=mapSvg3(o),left1=Math.max(0,Math.ceil((o.accAt+o.d1-now())/SCALE)),km=picked?(o.km*(1-pr)):m.km1;
  const steps=['Placed','Accepted by you','Picked up','Delivered'];
  const tl=steps.map(s=>{const e=o.ev.find(x=>x.s===s);return `<li class="${e?'d':''}">${s}${e?' – '+fmt(e.at):''}</li>`}).join('');
  let h=`<h1>${picked?'On the <span class="kau">road</span>':'Go to <span class="kau">pickup</span>'}</h1><div class="map">${GMAPS_KEY&&gmReady?'<div id="gmap"></div>':m.svg}</div><p class="sub" style="margin:6px 2px">${picked?'Dark line: route to the customer. Grey line: the leg you already drove.':'Orange line: route to the restaurant. Dashed line: next leg to the customer.'} The orange dot is you.</p>
  ${mapsLink(o,m,picked)}
  <div class="eta"><span class="sub" style="color:#E2B48C">${picked?'Estimated arrival':'Arrive at restaurant in'}</span><br><b>${picked?left:left1} min</b>${!picked&&o.shared&&window.FDSharedOrders&&FDSharedOrders.etaMin(FDSharedOrders.get(o.id))!=null?`<div style="font-size:13px;margin-top:2px;color:#E2B48C">Customer receives in about ${FDSharedOrders.etaMin(FDSharedOrders.get(o.id))} min</div>`:''}
  <div aria-live="polite" style="font-size:14px;margin-top:4px">${picked?(done?'You have arrived at '+o.area+'.':'Driver position: '+m.lat.toFixed(4)+', '+m.lng.toFixed(4)+' • '+km.toFixed(1)+' km to go'):(m.arr?'You are at '+o.rest+'. Confirm pickup.':km.toFixed(1)+' km to '+o.rest)}</div>
  ${picked?`<div class="bar" role="progressbar" aria-valuenow="${Math.round(pr*100)}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pr*100}%"></i></div>`:''}</div>
  <article class="card"><div class="row"><h3 class="rn">${o.rest}</h3><span class="badge del">${o.status}</span></div>
  <p class="meta">${o.id} • ${o.items}<br>Customer: ${o.cust} • ${o.area}<br>Order total ₹${o.total} • Your pay ₹${o.pay}</p><a class="btn alt" href="tel:${CP[o.cust]||'+919800000000'}" aria-label="Call customer ${o.cust}" style="display:flex;align-items:center;justify-content:center;text-decoration:none;margin-bottom:10px">Call ${o.cust}</a>${picked?'':`<div class="note i"><b>Pickup at ${o.rest}</b><br>${RA[o.rest]||o.area}<br>${km.toFixed(1)} km from you • about ${eta(km)} min<br>The route is shown on the map above.</div>`}`;
  h+=!picked?'<button class="btn alt" id="dc" style="margin-top:8px">Cancel this delivery</button>':'';
  h+=picked?`${done?otpBlock(o):''}<button class="btn" id="dv" ${done&&!(o.tries>=3)?'':'disabled'}>${done?'Verify code & mark delivered':'Delivered unlocks at arrival ('+left+' min)'}</button>`:`<button class="btn" id="pk" ${m.arr?'':'disabled'}>${m.arr?(o.shared&&window.FDSharedOrders&&!(FDSharedOrders.get(o.id)||{}).handedOver?'Confirm pickup · wait for restaurant':'Confirm pickup'):'Reaching restaurant ('+left1+' min)'}</button>`;
  h+=`</article><h2>Order <em>steps</em></h2><div class="card"><ol class="tl">${tl}</ol></div>`;
  return h}
function hView(){
  const rows=S.orders.filter(o=>o.status==='Delivered'&&o.mine).filter(o=>(f==='All'||o.status===f)&&(o.rest+o.id+o.cust+o.area).toLowerCase().includes(q.toLowerCase()));
  let h=`<h1>Past <span class="kau">runs</span></h1><div class="tools"><div style="flex:1"><label for="sq">Search</label><input id="sq" value="${q.replace(/"/g,'&quot;')}" placeholder="Restaurant, order or area"></div></div>`;
  if(!rows.length)return h+`<div class="empty card">No deliveries match.<br><br><button class="btn alt" id="rs">Reset search</button></div>`;
  h+=rows.map(o=>`<article class="card"><div class="row"><h3 class="rn">${o.rest}</h3><span class="pay">₹${o.pay}</span></div><p class="meta">${o.id} • ${o.area} • ${fmt(o.ev[o.ev.length-1].at)}</p><span class="badge del">Delivered</span></article>`).join('');
  return h+`<button class="btn alt" id="ex">Export CSV</button>`}
function iView(){return `<h1>How it <span class="kau">works</span></h1>
<div class="card"><p><b>One at a time.</b> Accept a ready order from any restaurant. Other orders lock until you deliver.</p><p><b>Your steps.</b> Accept, Pick up, Delivered. Kitchens control Preparing and Ready; drivers cannot change those.</p><p><b>Delivered unlock.</b> Marking Delivered is available only after the estimated time ends, and only with the customer’s 4-digit code. Three wrong codes lock the step until you resend.</p><p><b>Availability.</b> Go unavailable when you need a break and turn it back on when ready. You cannot switch off during a delivery.</p><p><b>Simulated stream.</b> Driver position is a timer on sample data, not GPS. Estimated minutes run in real time.</p><p>ETA = distance ÷ 20 km/h, rounded up. Data stays in this browser.</p><button class="btn alt" id="rst">Reload sample data</button></div>`}
function render(){
  document.getElementById('wel').textContent='Welcome back, '+S.prof.name.trim().split(' ')[0]+'! '+(act()?'Ride safe on your delivery.':avail()?'Pick an order to start earning.':'You are unavailable right now.');const ab=document.getElementById('avb');ab.textContent=S.prof.name.trim().charAt(0).toUpperCase();ab.onclick=()=>{tab='p';render()};
  const a=act(),sb=document.getElementById('stat');sb.textContent=a?'On delivery':(avail()?'Available':'Unavailable');sb.className='chip'+(!a&&avail()?' on':'');sb.onclick=toggleAvail;
  document.querySelectorAll('nav button').forEach(b=>b.toggleAttribute('aria-current',false)||(b.dataset.t===tab&&b.setAttribute('aria-current','page')));
  const el=document.getElementById('v');el.innerHTML={q:qView,a:aView,h:hView,p:pView,i:iView}[tab]();
  if(tab==='h'&&document.activeElement.id!=='sq'){}
  wire();updateMap()}
function wire(){
  const $=s=>document.querySelector(s);
  document.querySelectorAll('[data-acc]').forEach(b=>b.onclick=()=>accept(b.dataset.acc));
  document.querySelectorAll('[data-go]').forEach(b=>b.onclick=e=>{e.preventDefault();tab=b.dataset.go;render()});
  $('#ps')&&($('#ps').onclick=()=>{const n=$('#pn').value.trim(),ph=$('#pp').value.trim();if(n.length<2)return toast('Enter your full name, at least 2 letters.',1);if(!/^\d{10}$/.test(ph))return toast('Enter a 10-digit phone number.',1);S.prof={email:S.prof.email,name:n,phone:ph,vehicle:$('#pv').value,plate:$('#pl').value.trim()||'-',zone:$('#pz').value.trim()||'-'};save();render();toast('Profile saved.')});
  $('#demo')&&($('#demo').onclick=e=>{e.preventDefault();toast('Demo only: the customer\u2019s code is '+act().otp)});
  $('#rsd')&&($('#rsd').onclick=()=>{const o=act();o.otp=String(Math.floor(1000+Math.random()*9000));o.tries=0;save();render();toast('New code sent to the customer.')});
  $('#av2')&&($('#av2').onclick=toggleAvail);
  $('#so')&&($('#so').onclick=()=>FDSession.signOut());
  $('#pk')&&($('#pk').onclick=pickup);$('#dv')&&($('#dv').onclick=deliver);$('#dc')&&($('#dc').onclick=()=>{const o=act();if(!o||o.status==='Picked up')return toast('A delivery cannot be cancelled after pickup.',1);if(!confirm('Cancel delivery '+o.id+'?'))return;if(o.shared&&window.FDSharedOrders)FDSharedOrders.update(o.id,{status:'Cancelled',cancelReason:'Driver cancelled'},'Driver');o.status='Cancelled';o.mine=false;S.active=null;save();tab='q';render();toast('Delivery cancelled. The restaurant has been notified.');});
  $('#sq')&&($('#sq').oninput=e=>{q=e.target.value;const p=e.target.selectionStart;render();const n=$('#sq');n.focus();n.setSelectionRange(p,p)});
  $('#rs')&&($('#rs').onclick=()=>{q='';render()});
  $('#rst')&&($('#rst').onclick=()=>{S=seed();save();tab='q';render();toast('Sample data reloaded.')});
  $('#ex')&&($('#ex').onclick=()=>{const rows=S.orders.filter(o=>o.status==='Delivered'&&o.mine&&(o.rest+o.id+o.cust+o.area).toLowerCase().includes(q.toLowerCase()));
    const csv=['Order,Restaurant,Area,Pay,Delivered at',...rows.map(o=>[o.id,o.rest,o.area,o.pay,new Date(o.ev[o.ev.length-1].at).toISOString()].join(','))].join('\n');
    const u=URL.createObjectURL(new Blob([csv],{type:'text/csv'})),l=document.createElement('a');l.href=u;l.download='fooddispatch-history.csv';l.click();toast('Exported '+rows.length+' rows.')})}
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>{tab=b.dataset.t;render()});
load();
// logged-in delivery partner: profile takes the details used at log in / sign up
(function(){const u=window.FDSession&&FDSession.forRole('Delivery partner');if(!u)return;S.prof.email=u.email;if(FDSession.fresh('driver',u)){S.prof.name=FDSession.nameOf(u);S.prof.phone='';S.prof.plate='-';S.prof.zone='-';try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}})();

function importSharedOrders(){
  if(!window.FDSharedOrders)return;

  FDSharedOrders.read().forEach(x=>{
    if(!['Ready','Preparing'].includes(x.status))return;

    let o=S.orders.find(y=>y.id===x.id);

    if(!o){
      o={
        id:x.id,
        rest:x.restaurant||'FoodDispatch restaurant',
        rLat:x.restaurantLat||12.9352,
        rLng:x.restaurantLng||77.6245,
        cust:x.customer||'Customer',
        items:Array.isArray(x.items)?x.items.join(', '):String(x.items||'Order'),
        total:x.total||0,
        area:x.area||x.deliveryLabel||'Delivery area',
        dLat:x.customerLat||12.985,
        dLng:x.customerLng||77.723,
        status:x.status,
        pay:0,
        otp:x.otp||'',
        mine:false,
        shared:true,
        driverId:x.driverId||null,
        driverName:x.driverName||null,
        ev:(x.events||[{status:'Placed',at:x.createdAt||now()}])
          .map(e=>({s:e.status,at:e.at}))
      };

      S.orders.unshift(o);
    }else{
      o.shared=true;
      o.rest=x.restaurant||o.rest;
      o.rLat=x.restaurantLat||o.rLat;
      o.rLng=x.restaurantLng||o.rLng;
      o.cust=x.customer||o.cust;
      o.items=Array.isArray(x.items)?x.items.join(', '):String(x.items||o.items);
      o.dLat=x.customerLat||o.dLat;
      o.dLng=x.customerLng||o.dLng;
      o.status=x.status;
      o.driverId=x.driverId||null;
      o.driverName=x.driverName||null;
    }
  });
}
importSharedOrders();
loadGM();
render();
if(storeErr)toast('Saved data could not be read, so sample data was loaded.',1);
// timers: kitchens finish preparing; live stream refresh while on trip
setInterval(()=>{let ch=false;S.orders.forEach(o=>{if(o.status==='Preparing'&&now()-o.ev[0].at>9e5+25000){ev(o,'Ready');ch=true}});if(ch){save();if(tab==='q'&&document.activeElement.tagName!=='INPUT')render()}},5000);
window.addEventListener('storage',e=>{if(e.key==='fooddispatch_shared_orders_v1'){importSharedOrders();save();if(tab==='q')render()}});
 setInterval(()=>{importSharedOrders();const o=act();if(tab!=='a'||!o)return;
  if(o.shared&&window.FDSharedOrders){const sh=FDSharedOrders.get(o.id);if(sh&&sh.handedOver&&sh.driverPickupConfirmed&&o.status==='Ready'){o.startedAt=now();o.otp=sh.otp||o.otp||String(Math.floor(1000+Math.random()*9000));o.tries=0;const km0=hav(o.rLat,o.rLng,o.dLat,o.dLng),km=tripKm(o,km0);o.km=km;o.etaMin=tripMin(o,km0);o.dur=o.etaMin*SCALE;S.drv={lat:o.rLat,lng:o.rLng};ev(o,'Picked up');FDSharedOrders.update(o.id,{pickedAt:o.startedAt},'Driver');save();render();toast('Restaurant confirmed handover. You are now on the way.');return;}}
  if(o.status==='Ready'){const was=document.getElementById('pk')?.disabled;if(was===false)return;render();const b=document.getElementById('pk');if(was&&b&&!b.disabled)toast('You have reached '+o.rest+'. Confirm pickup.');return}
  if(o.status==='Picked up'){const was=document.getElementById('dv')?.disabled;if(was===false)return;render();const d=document.getElementById('dv');if(was&&d&&!d.disabled)toast('You have arrived. Ask the customer for their delivery code.')}
   if(o.shared&&window.FDSharedOrders){const m=mapSvg3(o);FDSharedOrders.update(o.id,{driverName:S.prof.name,driverReal:true,driverLat:m.lat,driverLng:m.lng,etaMinutes:FDSharedOrders.etaMin(FDSharedOrders.get(o.id))},'Driver')}
 },1000);
