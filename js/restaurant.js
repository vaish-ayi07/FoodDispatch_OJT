var R={lat:12.9352,lng:77.6245,speed:20};
var KEY='fooddispatch_state_v3';
function seed(){return{
drivers:[{id:'D1',name:'Rahul K.',rt:20,available:false,lat:12.9406,lng:77.6245},{id:'D2',name:'Meena S.',rt:30,available:true,lat:12.9301,lng:77.6290},{id:'D3',name:'Arjun P.',rt:null,hold:'FD-1047',available:true,lat:12.9450,lng:77.6150},{id:'D4',name:'Kiran B.',rt:40,available:true,lat:12.9210,lng:77.6180},{id:'D5',name:'Sneha L.',rt:60,available:false,lat:12.9380,lng:77.6300}],
orders:[
{id:'FD-1045',cust:'Ananya R.',items:['1× Veg Biryani','2× Butter Naan'],area:'Koramangala',at:'7:08 PM',status:'Placed',lat:12.9279,lng:77.6271,prep:25},
{id:'FD-1046',cust:'Kabir M.',items:['2× Paneer Butter Masala'],area:'HSR Layout',at:'7:10 PM',status:'Placed',lat:12.9116,lng:77.6389,prep:20},
{id:'FD-1043',cust:'Divya S.',items:['1× Paneer Butter Masala','1× Gulab Jamun'],area:'Indiranagar',at:'6:52 PM',status:'Preparing',lat:12.9784,lng:77.6408,prep:12},
{id:'FD-1044',cust:'Sameer T.',items:['3× Butter Naan','1× Masala Chai'],area:'Koramangala',at:'7:01 PM',status:'Ready',lat:12.9352,lng:77.6200,prep:0,driver:'D1'},
{id:'FD-1047',cust:'Priya V.',items:['1× Veg Biryani'],area:'BTM Layout',at:'7:12 PM',status:'Ready',lat:12.9166,lng:77.6101,prep:0,offer:{driver:'D3',t0:0},tried:['D3']}],
clock:0,
trips:[{id:'FD-1041',driver:'D5',lat:12.9500,lng:77.6350}],
events:[{t:'7:12 PM',m:'FD-1047 offered to Arjun P. (waiting for acceptance)'},{t:'7:01 PM',m:'FD-1044 assigned to Rahul K.'},{t:'6:58 PM',m:'FD-1041 handed to Sneha L.'}]}}
var S;
try{S=JSON.parse(localStorage.getItem(KEY))}catch(e){S=null}
if(!S||!S.orders)S=seed();
S.trips=S.trips||[];S.clock=S.clock||0;
function seedStats(){return{day:new Date().toDateString(),hourly:{11:3,12:8,13:11,14:5,15:2,16:3,17:6,18:9},items:{'Veg Biryani':31,'Butter Naan':58,'Paneer Butter Masala':27,'Masala Chai':22,'Gulab Jamun':19},areas:{'Koramangala':14,'HSR Layout':9,'Indiranagar':8,'BTM Layout':7,'Jayanagar':5,'Whitefield':4},byDriver:{D1:11,D2:10,D3:9,D4:9,D5:7},acc:[95,140,210,60,120,85,175],delivered:46,cancelled:2,missed:3}}
function seedCancelled(){return[{id:'FD-1038',cust:'Rohan D.',items:['2\u00d7 Veg Biryani'],area:'Jayanagar',at:'1:14 PM',when:'1:20 PM',reason:'Customer request',lat:12.925,lng:77.5938,prep:20},{id:'FD-1040',cust:'Neha G.',items:['1\u00d7 Paneer Butter Masala','2\u00d7 Butter Naan'],area:'Koramangala',at:'6:05 PM',when:'6:09 PM',reason:'Item unavailable',lat:12.9279,lng:77.6271,prep:20}]}
function scale(o){var r={};for(var k in o)r[k]=o[k]*415;return r}
var askCancel=null;
if(!S.stats||S.stats.day!==new Date().toDateString()){S.stats=seedStats();S.cancelled=seedCancelled()}
S.cancelled=S.cancelled||seedCancelled();S.stats.sh=S.stats.sh||scale(S.stats.hourly);S.stats.sa=S.stats.sa||scale(S.stats.areas);
var PK='fooddispatch_profile_v1',P={name:'',rest:'Spice Route Kitchen',role:'Owner',email:'',phone:'',in:false,since:''};
try{Object.assign(P,JSON.parse(localStorage.getItem(PK))||{})}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){say('Data could not be saved on this device. Your current orders stay on screen.','err')}}
function importSharedOrders(){
 if(!window.FDSharedOrders)return;
 FDSharedOrders.read().forEach(function(x){
  var o=S.orders.find(function(y){return y.id===x.id});
  if(x.status==='Cancelled'){if(o){S.orders=S.orders.filter(function(y){return y!==o});if(!S.cancelled.some(function(y){return y.id===x.id}))S.cancelled.unshift({id:o.id,cust:o.cust,items:o.items,area:o.area,at:o.at,when:now(),reason:'Driver cancelled',lat:o.lat,lng:o.lng,prep:o.prep});}return;}
  if(!['Placed','Accepted','Preparing','Ready'].includes(x.status)||x.handedOver)return;
  if(!o){
   o={id:x.id,cust:x.customer||'Customer',items:Array.isArray(x.items)?x.items:[String(x.items||'Order')],area:x.area||x.deliveryLabel||'Delivery area',
      at:new Date(x.createdAt||Date.now()).toLocaleTimeString('en-IN',{hour:'numeric',minute:'2-digit'}),status:x.status||'Placed',
      lat:x.customerLat||R.lat,lng:x.customerLng||R.lng,prep:15,shared:true,customerMessage:x.customerMessage||''};
   S.orders.unshift(o);
  }else if(o.shared){o.status=x.status||o.status;o.driver=x.driverId||o.driver;o.customerMessage=x.customerMessage||o.customerMessage;}
 });
}

function publishSharedRestaurantOrder(o){
  if(!window.FDSharedOrders||!o||!o.shared)return;

  var shared=FDSharedOrders.get(o.id)||{};
  var patch={status:o.status};

  if(o.handedOver){
    patch.handedOver=true;
    if(shared.driverPickupConfirmed)patch.status='Picked up';
  }

  if(o.driver){
    patch.driverId=o.driver;

    var restaurantDriver=(S.drivers.find(function(d){
      return d.id===o.driver;
    })||{}).name||o.driver;

    // Preserve the name already published by the driver's profile
    patch.driverName=
      ((shared.driverReal||shared.driverId===o.driver) && shared.driverName)
        ? shared.driverName
        : restaurantDriver;
  }

  FDSharedOrders.update(o.id,patch,'Restaurant');
}

importSharedOrders();
var filter='All',query='';
function now(){return new Date().toLocaleTimeString('en-IN',{hour:'numeric',minute:'2-digit'}).toUpperCase()}
function hav(a,b,c,d){var r=Math.PI/180,x=Math.sin((c-a)*r/2)**2+Math.cos(a*r)*Math.cos(c*r)*Math.sin((d-b)*r/2)**2;return 12742*Math.asin(Math.sqrt(x))}
function oName(oid,d){var r=window.FDSharedOrders&&FDSharedOrders.realDriver(oid);return r||(d&&d.name)||''}
function pickMin(oid,km){var F=window.FDSharedOrders,ap=F&&F.realDriver(oid)?F.approachMin(F.get(oid)):null;return ap!=null?ap:eta(km)}
function dName(id){var d=S.drivers.find(function(x){return x.id===id});return d?d.name:''}
function sharedEta(o){if(!o||!o.shared||!window.FDSharedOrders)return null;var s=FDSharedOrders.get(o.id);return s?FDSharedOrders.etaMin(s):null}   // the same real ETA the customer sees
function etaFor(o){var km=hav(R.lat,R.lng,o.lat,o.lng);return Math.ceil(km/R.speed*60+(o.prep||0))}
function say(t,type){var m=document.getElementById('msg');m.textContent=t;m.className='msg '+(type||'')}
function log(m){S.events.unshift({t:now(),m:m});S.events=S.events.slice(0,30)}
function drv(id){return S.drivers.find(function(x){return x.id===id})}
function fmt(t){t=Math.ceil(t);return Math.floor(t/60)+':'+('0'+t%60).slice(-2)}
function offer(o){var tried=o.tried||(o.tried=[]),best=null,bd=1e9;
 S.drivers.forEach(function(d){if(!d.available||d.hold||tried.indexOf(d.id)>-1)return;var k=hav(d.lat,d.lng,R.lat,R.lng);if(k<bd){bd=k;best=d}});
 if(best){best.hold=o.id;tried.push(best.id);o.offer={driver:best.id,t0:S.clock};delete o.wait;log(o.id+' offered to '+best.name+' ('+bd.toFixed(1)+' km away)');return best.name+' ('+bd.toFixed(1)+' km away) was asked to accept. 5:00 to respond.'}
 delete o.offer;o.tried=[];o.retryAt=S.clock+120;if(!o.wait){o.wait=1;log(o.id+' ready · no free driver, will keep trying')}return null}
function dispatch(o){return offer(o)}
function accept(o){var d=drv(o.offer.driver),el=S.clock-o.offer.t0;delete d.hold;d.available=false;o.driver=d.id;delete o.offer;S.stats.acc.push(el);S.stats.acc=S.stats.acc.slice(-60);log(o.id+' accepted by '+d.name+' in '+fmt(el));say(d.name+' accepted '+o.id+' within '+fmt(el)+' and is heading to the restaurant.','ok')}
function decline(o,why){var d=drv(o.offer.driver);delete d.hold;delete o.offer;
 var m=why==='timeout'?d.name+' did not accept '+o.id+' within 5 minutes.':why==='withdrawn'?d.name+' became unavailable for '+o.id+'.':d.name+' declined '+o.id+'.';
 S.stats.missed=(S.stats.missed||0)+1;log(m);var r=offer(o);say(m+' '+(r?'Reassigned: '+r:'No other free driver right now. We will keep trying.'))}
function processOffers(){var ch=false;S.orders.forEach(function(o){if(o.status!=='Ready'||o.driver)return;
 if(o.offer){var d=drv(o.offer.driver),el=S.clock-o.offer.t0;
  if(!d.available){decline(o,'withdrawn');ch=true}
  else if(el>=300){decline(o,'timeout');ch=true}
  else if(d.rt!=null&&el>=d.rt){accept(o);ch=true}}
 else if(S.clock>=(o.retryAt||0)){var r=offer(o);if(r){say(o.id+': '+r);ch=true}}});return ch}
function act(a,id,r){if(a!=='cancel')askCancel=null;var o=S.orders.find(function(x){return x.id===id});if(!o)return;
 if(a==='accept'){o.status='Accepted';log(id+' accepted');say('Order '+id+' accepted. Start preparing when the kitchen is ready.','ok')}
 else if(a==='prep'){o.status='Preparing';log(id+' preparing');say(id+' is now being prepared.','ok')}
 else if(a==='cancel'){if(o.status==='Preparing'||o.status==='Ready'){say('Orders can be cancelled only before preparing starts.','err');return}askCancel=id}
 else if(a==='keep'){askCancel=null}
 else if(a==='cancelas'){S.orders=S.orders.filter(function(x){return x!==o});S.cancelled.unshift({id:o.id,cust:o.cust,items:o.items,area:o.area,at:o.at,when:now(),reason:r||'Other',lat:o.lat,lng:o.lng,prep:o.prep});askCancel=null;log(id+' cancelled \u00b7 '+(r||'Other'));say('Order '+id+' cancelled ('+(r||'Other')+'). See Analytics for the cancellation log.','ok')}
 else if(a==='ready'){o.status='Ready';var r=dispatch(o);say(r?'Order '+id+' is ready. '+r:'Order '+id+' is ready. No driver is available yet; the ETA estimate stays visible.',r?'ok':'')}
 else if(a==='retry'){var r2=dispatch(o);say(r2?'Offer sent for '+id+'. '+r2:'Still no driver available for '+id+'. We will keep it Ready.',r2?'ok':'')}
 else if(a==='hand'){var F=window.FDSharedOrders,rn=F&&F.realDriver(id),ap=rn?F.approachMin(F.get(id)):null;
  if(rn){if(ap>0){say(rn+' is about '+ap+' min away. Hand over once the driver reaches the restaurant.','err');return}}
  else{if(!o.driver){say('No driver is assigned to '+id+' yet. Wait for a driver, then hand over.','err');return}
   var dr=S.drivers.find(function(x){return x.id===o.driver}),dk=hav(dr.lat,dr.lng,R.lat,R.lng);
   if(dk>.15){say(dr.name+' is still '+dk.toFixed(1)+' km away. Hand over once the driver reaches the restaurant.','err');return}}
  var hn=rn||dName(o.driver);
  o.handedOver=true;S.orders=S.orders.filter(function(x){return x!==o});addTo(S.stats,o);S.trips.push({id:o.id,driver:o.driver,lat:o.lat,lng:o.lng});log(id+' handed to '+hn);say(id+' handed to '+hn+'. The driver is now on the way to the customer.','ok')}
 else if(a==='deliv'){say('Unauthorized: “Restaurants can’t mark an order as Delivered. Only the assigned driver can.”','err');return}
 publishSharedRestaurantOrder(o);save();render()}
function match(o){var q=query.trim().toLowerCase();return !q||(o.id+' '+o.cust+' '+o.items.join(' ')+' '+o.area).toLowerCase().indexOf(q)>-1}
function card(o){var h='<article class="card" aria-label="Order '+o.id+'"><div class="row"><span class="id">#'+o.id+'</span>';
 var st=o.status;h+='<span class="badge '+(st==='Ready'?'ready':st==='Preparing'?'prep':'')+'">'+(st==='Placed'?'Placed':st)+'</span></div>';
 h+='<div class="items">'+o.items.join(' · ')+'</div><div class="meta">'+o.cust+' · '+(st==='Ready'?'Ready ':'Placed ')+o.at+' · '+o.area+'</div>';if(o.customerMessage)h+='<div class="note wait"><b>Customer message:</b> '+esc(o.customerMessage)+'</div>';
 if(st==='Ready'){h+=(o.driver||o.offer)?'<div class="note'+(o.offer?' wait':'')+'" data-live="'+o.id+'">'+liveNote(o)+'</div>'
  :'<div class="note wait"><b>Waiting for driver.</b> No driver available yet. ETA estimate: about '+(sharedEta(o)!=null?sharedEta(o):etaFor(o))+' min.</div>'}
 if(askCancel===o.id){return h+'<div class="note"><b>Why is this order being cancelled?</b></div><div class="acts">'+['Customer request','Item unavailable','Kitchen too busy','Other'].map(function(r){return '<button class="btn out sm" data-a="cancelas" data-id="'+o.id+'" data-r="'+r+'">'+r+'</button>'}).join('')+'<button class="btn sm" data-a="keep" data-id="'+o.id+'">Keep order</button></div></article>'}
 h+='<div class="acts">';
 if(st==='Placed')h+=B('accept',o,'Accept')+B('cancel',o,'Cancel',1);
 if(st==='Accepted')h+=B('prep',o,'Start preparing')+B('cancel',o,'Cancel',1);
 if(st==='Preparing')h+=B('ready',o,'Mark ready');
 if(st==='Ready'){h+=B('hand',o,'Handed to driver',1);if(!o.driver&&!o.offer)h+=B('retry',o,'Retry dispatch',1);h+='<button class="btn out sm" data-a="deliv" data-id="'+o.id+'">Mark delivered</button>'}
 return h+'</div></article>'}
function B(a,o,t,out){return '<button class="btn'+(out?' out':'')+'" data-a="'+a+'" data-id="'+o.id+'">'+t+'</button>'}
function render(){
 var cols={New:[],Preparing:[],Ready:[]};
 S.orders.filter(match).forEach(function(o){(o.status==='Placed'?cols.New:o.status==='Ready'?cols.Ready:cols.Preparing).push(o)});
 var all={New:0,Preparing:0,Ready:0};S.orders.forEach(function(o){all[o.status==='Placed'?'New':o.status==='Ready'?'Ready':'Preparing']++});
 var chips=['All','New','Preparing','Ready'].map(function(c){return '<button class="chip" aria-pressed="'+(filter===c)+'" data-f="'+c+'">'+c+(c==='All'?'':' '+all[c])+'</button>'}).join('');
 document.getElementById('chips').innerHTML=chips;
 var cls={New:'col-n',Preparing:'col-p',Ready:'col-r'},hint={New:'No new orders. New orders appear here as customers place them.',Preparing:'Nothing is being prepared right now.',Ready:'No orders waiting for pickup.'};
 var shown=filter==='All'?['New','Preparing','Ready']:[filter],total=0,out='';
 shown.forEach(function(k){total+=cols[k].length;out+='<section class="'+cls[k]+'" aria-label="'+k+' orders"><h2>'+k+' <span class="count">'+cols[k].length+'</span></h2>'+(cols[k].length?cols[k].map(card).join(''):'<div class="empty">'+hint[k]+'</div>')+'</section>'});
 if(query&&!total)out='<div class="empty">No orders match “'+query.replace(/</g,'')+'”.<br><button class="btn out" id="reset" style="margin-top:10px">Reset filters</button></div>';
 var b=document.getElementById('board');b.innerHTML=out;b.className='board'+(shown.length===1||(query&&!total)?' one':'');
 var av=S.drivers.filter(function(d){return d.available}).length;
 document.getElementById('pool').innerHTML='<span>Drivers nearby ('+av+' available). Tap to set availability:</span>'+S.drivers.map(function(d){return '<button class="drv" aria-pressed="'+d.available+'" data-d="'+d.id+'"><i class="dot" style="background:'+dcol(d)+'"></i>'+d.name+(d.hold?' · offer pending':d.available?' · available':' · busy')+'</button>'}).join('');
 document.getElementById('log').innerHTML=S.events.slice(0,5).map(function(e){return '<li><b>'+e.t+'</b> · '+e.m+'</li>'}).join('');if(view==='analytics')renderAnalytics()}
document.addEventListener('click',function(e){var t=e.target.closest('button');if(!t)return;
 if(t.dataset.a)act(t.dataset.a,t.dataset.id,t.dataset.r);
 else if(t.dataset.f){filter=t.dataset.f;render()}
 else if(t.dataset.d){var d=S.drivers.find(function(x){return x.id===t.dataset.d});d.available=!d.available;save();render();say(d.name+' is now '+(d.available?'available':'busy')+'.')}
 else if(t.id==='reset'){query='';filter='All';document.getElementById('q').value='';render()}

 else if(t.dataset.ra){var oo=S.orders.find(function(x){return x.id===t.dataset.id});if(oo&&oo.offer){if(t.dataset.ra==='accept')accept(oo);else decline(oo,'declined');save();render();drawList(true);drawMap()}}
 else if(t.id==='fitall')fitAll()
 else if(t.id==='resetdata'){try{localStorage.removeItem(KEY)}catch(e){}location.reload()}
 else if(t.id==='pause'){run=!run;t.textContent=run?'Pause stream':'Resume stream';var g=document.getElementById('stag');g.textContent=run?'Live · simulated':'Stream paused';g.className='tag'+(run?' live':'');say(run?'Location stream resumed.':'Location stream paused. Use Refresh now to update positions manually.')}
 else if(t.id==='refresh')tick(true)
 else if(t.dataset.m){metric=t.dataset.m;renderAnalytics()}
 else if(t.dataset.k!==undefined){var cs=t.dataset.ch;sel[cs]=sel[cs]===t.dataset.k?null:t.dataset.k;renderAnalytics()}
 else if(t.dataset.rs)restore(t.dataset.rs)
 else if(t.id==='neworder')addOrder()
 else if(t.id==='signout')signOut();
 else if(t.dataset.v)setView(t.dataset.v)});
document.getElementById('q').addEventListener('input',function(e){query=e.target.value;render()});
var W=640,H=500,BB={a:12.900,b:12.985,c:77.585,d:77.665},run=true;
var roads=[[0,110,640,110],[0,235,640,235],[0,360,640,360],[120,0,120,500],[300,0,300,500],[480,0,480,500],[0,470,640,150]];
function px(lat,lng){return[Math.max(16,Math.min(W-16,(lng-BB.c)/(BB.d-BB.c)*W)),Math.max(16,Math.min(H-16,(BB.b-lat)/(BB.b-BB.a)*H))]}
function eta(km){return km<.06?0:Math.max(1,Math.ceil(km/R.speed*60))}
function job(d){var t=S.trips.find(function(x){return x.driver===d.id});if(t)return{k:'deliver',id:t.id,to:t};var o=S.orders.find(function(x){return x.driver===d.id});return o?{k:'pickup',id:o.id,to:R}:null}
function liveNote(o){if(o.offer){var f=drv(o.offer.driver);return '<b>Waiting for '+f.name+' to accept</b> · '+hav(f.lat,f.lng,R.lat,R.lng).toFixed(1)+' km away<br>Time left '+fmt(Math.max(0,300-(S.clock-o.offer.t0)))+'. If not accepted, the next nearest free driver is asked.'}var d=S.drivers.find(function(x){return x.id===o.driver}),km=rem(d,{k:'pickup',id:o.id,to:R});var ap=window.FDSharedOrders&&FDSharedOrders.realDriver(o.id)?FDSharedOrders.approachMin(FDSharedOrders.get(o.id)):null,pm=ap!=null?ap:eta(km);return '<b>Assigned to '+oName(o.id,d)+'</b> · '+(km<.06&&ap==null?'arrived at the restaurant':(ap===0?'arrived at the restaurant':km.toFixed(1)+' km from restaurant · pickup in about '+pm+' min'))+'<br>Customer ETA about '+(sharedEta(o)!=null?sharedEta(o):eta(km)+etaFor(o))+' min'}
var G=null,AM,RC,map,rmk,cust=[],custKey='',dm={},lines={},lastSig='',mult=10,RT={};
var DC={D1:'#e11d48',D2:'#2563eb',D3:'#16a34a',D4:'#9333ea',D5:'#ea580c'};
var KEYG = window.FD_MAPS_API_KEY; // Add your own restricted Google Maps key only if you need Google Maps.
function rkey(d,j){return d.id+'>'+j.k+j.id}
function dcol(d,j){return DC[d.id]||'#5c3a2e'}
function mk(ic,lb,col,cls){var e=document.createElement('div');e.className='dm '+(cls||'');e.style.setProperty('--c',col);e.innerHTML='<div class="ic">'+ic+'</div>'+(lb?'<div class="lb">'+lb+'</div>':'');return e}
function showErr(m){var n=document.getElementById("mapnote");n.hidden=false;n.textContent="Google Routes API said: "+m+". Check that the Routes API is enabled and allowed in the key's API restrictions. Using OpenStreetMap road routing meanwhile."}
function getRoute(d,j){if(!G)return{pending:true};var k=rkey(d,j);if(RT[k])return RT[k];RT[k]={pending:true};
 var done=function(p){RT[k]=p?{pts:p,i:0}:{failed:true};drawMap();drawList()};
 RC.computeRoutes({origin:{lat:d.lat,lng:d.lng},destination:{lat:j.to.lat,lng:j.to.lng},travelMode:'DRIVING',fields:['path']}).then(function(res){
  done(res.routes[0].path.map(function(q){return[typeof q.lat==='function'?q.lat():q.lat,typeof q.lng==='function'?q.lng():q.lng]}))}).catch(function(e){
  showErr(e&&e.message?e.message:'request failed');
  fetch('https://router.project-osrm.org/route/v1/driving/'+d.lng+','+d.lat+';'+j.to.lng+','+j.to.lat+'?overview=full&geometries=geojson').then(function(r){return r.json()}).then(function(x){done(x.routes[0].geometry.coordinates.map(function(c){return[c[1],c[0]]}))}).catch(function(){done(null)})});
 return RT[k]}
function rem(d,j){var r=RT[rkey(d,j)];if(!r||!r.pts)return hav(d.lat,d.lng,j.to.lat,j.to.lng);var k=0,p=[d.lat,d.lng];for(var i=r.i+1;i<r.pts.length;i++){k+=hav(p[0],p[1],r.pts[i][0],r.pts[i][1]);p=r.pts[i]}return k}
function step(d,j,km){var r=getRoute(d,j),b=.0056*mult;
 if(r.pts){while(b>0&&r.i<r.pts.length-1){var n=r.pts[r.i+1],sg=hav(d.lat,d.lng,n[0],n[1]);if(sg<=b){d.lat=n[0];d.lng=n[1];b-=sg;r.i++}else{var f=b/sg;d.lat+=(n[0]-d.lat)*f;d.lng+=(n[1]-d.lng)*f;b=0}}}
 else if(r.failed){var f2=Math.min(km,b)/km;d.lat+=(j.to.lat-d.lat)*f2;d.lng+=(j.to.lng-d.lng)*f2}}
function fitPts(pts){if(!G)return;var b=new G.LatLngBounds();pts.forEach(function(p){b.extend(p)});map.fitBounds(b,70)}
function fitAll(){fitPts([{lat:R.lat,lng:R.lng}].concat(S.drivers.map(function(d){return{lat:d.lat,lng:d.lng}})))}
function focusDriver(id){var d=S.drivers.find(function(x){return x.id===id});if(G&&d){map.panTo({lat:d.lat,lng:d.lng});map.setZoom(16)}}
function drawMap(){if(!G)return;var pts=[{lat:R.lat,lng:R.lng}];
 if(!rmk)rmk=new AM({map:map,position:{lat:R.lat,lng:R.lng},content:mk('R',P.rest,'#3e2518','rs'),zIndex:50});
 var cs=S.orders.filter(function(o){return o.status==='Ready'}).concat(S.trips),ck=cs.map(function(o){return o.id+(o.driver||'')}).join();
 if(ck!==custKey){custKey=ck;cust.forEach(function(m){m.map=null});cust=cs.map(function(o){return new AM({map:map,position:{lat:o.lat,lng:o.lng},content:mk('','#'+o.id,o.driver&&drv(o.driver)?dcol(drv(o.driver)):'#b9814f','cu'),zIndex:20})})}
 cs.forEach(function(o){pts.push({lat:o.lat,lng:o.lng})});
 S.drivers.forEach(function(d){var j=job(d),L=lines[d.id];
  if(j){var r=getRoute(d,j),path=(r.pts?[[d.lat,d.lng]].concat(r.pts.slice(r.i+1)):[[d.lat,d.lng],[j.to.lat,j.to.lng]]).map(function(p){return{lat:p[0],lng:p[1]}});
   if(!L)L=lines[d.id]=[new G.Polyline({strokeColor:'#fff',strokeWeight:9,strokeOpacity:.95,zIndex:1}),new G.Polyline({strokeWeight:5,zIndex:2})];
   L[0].setPath(path);L[1].setPath(path);L[1].setOptions({strokeColor:dcol(d),strokeOpacity:r.pts?1:.6});L[0].setMap(map);L[1].setMap(map)}
  else if(L){L[0].setMap(null);L[1].setMap(null)}
  pts.push({lat:d.lat,lng:d.lng});
  var lab=(j?oName(j.id,d):d.name)+(j?' · '+(j.k==='pickup'?pickMin(j.id,rem(d,j)):(sharedEta({id:j.id,shared:!!(window.FDSharedOrders&&FDSharedOrders.get(j.id))})!=null?sharedEta({id:j.id,shared:true}):eta(rem(d,j))))+' min':d.hold?' · offer sent':d.available?' · free':' · off');
  if(!dm[d.id])dm[d.id]={cur:[d.lat,d.lng],m:new AM({map:map,position:{lat:d.lat,lng:d.lng},content:mk(d.name.charAt(0),lab,dcol(d,j)),zIndex:100})};
  var o=dm[d.id];o.tgt=[d.lat,d.lng];o.m.content.style.setProperty('--c',dcol(d,j));o.m.content.classList.toggle('hold',!!d.hold);o.m.content.querySelector('.lb').textContent=lab});
 var sig=Object.keys(RT).length+'|'+S.trips.length;if(sig!==lastSig){lastSig=sig;fitPts(pts)}}
(function anim(){Object.keys(dm).forEach(function(k){var o=dm[k];if(!o.tgt)return;o.cur[0]+=(o.tgt[0]-o.cur[0])*.12;o.cur[1]+=(o.tgt[1]-o.cur[1])*.12;o.m.position={lat:o.cur[0],lng:o.cur[1]}});requestAnimationFrame(anim)})();
window.gm_authFailure=function(){document.getElementById('map').innerHTML='<div class="empty" style="margin:16px">Google Maps could not load with this key. Enable “Maps JavaScript API” for it and allow this site in its referrer restrictions.</div>'};
window.gmReady=function(){Promise.all([google.maps.importLibrary('maps'),google.maps.importLibrary('marker'),google.maps.importLibrary('routes')]).then(function(l){
 G=google.maps;AM=l[1].AdvancedMarkerElement;RC=l[2].Route;
 map=new l[0].Map(document.getElementById('map'),{center:{lat:R.lat,lng:R.lng},zoom:14,mapId:'DEMO_MAP_ID',mapTypeControl:false,streetViewControl:false});
 drawMap();drawList()})};
document.getElementById('dl').addEventListener('click',function(e){if(e.target.closest('button'))return;var li=e.target.closest('li');if(li)focusDriver(li.dataset.focus)});
document.getElementById('dl').addEventListener('keydown',function(e){var li=e.target.closest('li');if(li&&e.key==='Enter')focusDriver(li.dataset.focus)});
function renderFallbackMap(){
 var el=document.getElementById('map');if(!el||G)return;
 var pts=[{lat:R.lat,lng:R.lng,name:'Restaurant',kind:'r'}];
 S.orders.filter(function(o){return o.status==='Ready'}).forEach(function(o){pts.push({lat:o.lat,lng:o.lng,name:o.id,kind:'c'})});
 S.drivers.forEach(function(d){pts.push({lat:d.lat,lng:d.lng,name:d.name,kind:'d',color:dcol(d)})});
 var la=pts.map(function(p){return p.lat}),ln=pts.map(function(p){return p.lng}),amin=Math.min.apply(null,la),amax=Math.max.apply(null,la),lmin=Math.min.apply(null,ln),lmax=Math.max.apply(null,ln);
 var xy=function(p){return{x:50+(p.lng-lmin)/((lmax-lmin)||.01)*600,y:45+(amax-p.lat)/((amax-amin)||.01)*300}};
 var marks=pts.map(function(p){var q=xy(p),c=p.kind==='r'?'#3e2518':p.kind==='c'?'#b9814f':p.color||'#7c5a48';return '<g><circle cx="'+q.x+'" cy="'+q.y+'" r="'+(p.kind==='r'?12:8)+'" fill="'+c+'" stroke="#fff" stroke-width="3"/><text x="'+q.x+'" y="'+(q.y+25)+'" text-anchor="middle" font-size="11" fill="#3e2518">'+String(p.name).replace(/[&<>]/g,'')+'</text></g>'}).join('');
 el.innerHTML='<svg viewBox="0 0 700 390" role="img" aria-label="Illustrative simulated map of restaurant, customers and drivers" style="width:100%;height:100%;display:block;background:#f6eee5"><path d="M0 80H700M0 170H700M0 260H700M120 0V390M270 0V390M430 0V390M590 0V390" stroke="#fff" stroke-width="13"/><path d="M0 330Q170 240 330 290T700 120" fill="none" stroke="#c9dce0" stroke-width="22"/>'+marks+'</svg>';
 var n=document.getElementById('mapnote');if(n){n.hidden=false;n.textContent='Illustrative map · simulated driver positions · no Google Maps key configured.'}
}
if(KEYG){var gs=document.createElement('script');gs.async=true;console.log("FoodDispatch Maps key available:", !!KEYG);gs.src='https://maps.googleapis.com/maps/api/js?key='+KEYG+'&loading=async&callback=gmReady&v=weekly';document.body.appendChild(gs)}else{renderFallbackMap()}
function drawList(force){if(!force&&document.querySelector('#dl button:hover'))return;document.getElementById('dl').innerHTML=S.drivers.map(function(d){var j=job(d),t;
 if(j){var km=rem(d,j);t=j.k==='pickup'?(km<.06?'Waiting at the restaurant for '+j.id:'Heading to restaurant for '+j.id+' · '+km.toFixed(1)+' km · ETA '+pickMin(j.id,km)+' min'):'Delivering '+j.id+' · '+km.toFixed(1)+' km to customer · ETA '+(sharedEta({id:j.id,shared:!!(window.FDSharedOrders&&FDSharedOrders.get(j.id))})!=null?sharedEta({id:j.id,shared:true}):eta(km))+' min'}
 else t=d.hold?'Order offered · waiting for response':d.available?'Available · waiting for an order':'Busy · no active order';
 var of=d.hold&&S.orders.find(function(x){return x.id===d.hold}),oh=of&&of.offer?'<br><span><b style="display:inline">Offer: #'+of.id+'</b> · '+fmt(Math.max(0,300-(S.clock-of.offer.t0)))+' left</span><div class="acts"><button class="btn sm" data-ra="accept" data-id="'+of.id+'">Accept (driver app)</button><button class="btn out sm" data-ra="decline" data-id="'+of.id+'">Decline</button></div>':'';return '<li data-focus="'+d.id+'" tabindex="0" style="cursor:pointer"><b><i class="dot" style="background:'+dcol(d,j)+'"></i>'+(j?oName(j.id,d):d.name)+'</b><span>'+t+'</span><br><span>Position '+d.lat.toFixed(4)+', '+d.lng.toFixed(4)+'</span>'+oh+'</li>'}).join('');var c={a:0,p:0,d:0};S.drivers.forEach(function(d){var j=job(d);if(j)c[j.k==='pickup'?'p':'d']++;else if(d.available&&!d.hold)c.a++});document.getElementById('sum').textContent=c.a+' free · '+c.p+' to pickup · '+c.d+' delivering'}
function tick(force){if(!run&&force!==true)return;importSharedOrders();if(!G)renderFallbackMap();var done=false;S.clock=(S.clock||0)+mult;var ch=processOffers();
 S.drivers.forEach(function(d){var j=job(d);if(!j){if(d.available){d.lat+=(Math.random()-.5)*.0006*mult/10;d.lng+=(Math.random()-.5)*.0006*mult/10}return}var km=hav(d.lat,d.lng,j.to.lat,j.to.lng);
  var rr=RT[rkey(d,j)];if(km<.06||(rr&&rr.pts&&rr.i>=rr.pts.length-1)){if(j.k==='deliver'){S.trips=S.trips.filter(function(x){return x.id!==j.id});d.available=true;S.stats.delivered++;S.stats.byDriver[d.id]=(S.stats.byDriver[d.id]||0)+1;log(j.id+' delivered by '+d.name);say(j.id+' was delivered by '+d.name+'. The driver is available again.','ok');done=true}return}
  step(d,j,km)});
 if(done||ch){if(done)S.orders.filter(function(o){return o.status==='Ready'&&!o.driver&&!o.offer}).forEach(dispatch);save();render()}
 else{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}
  document.querySelectorAll('[data-live]').forEach(function(n){var o=S.orders.find(function(x){return x.id===n.dataset.live});if(o&&(o.driver||o.offer))n.innerHTML=liveNote(o)})}
 drawMap();drawList()}
var view='orders',PRICE={'Veg Biryani':220,'Butter Naan':45,'Paneer Butter Masala':280,'Gulab Jamun':90,'Masala Chai':40};
function $(i){return document.getElementById(i)}
function saveP(){try{localStorage.setItem(PK,JSON.stringify(P))}catch(e){}}
function inr(n){return '\u20b9'+Math.round(n).toLocaleString('en-IN')}
function hrOf(t){var m=/(\d+):\d+\s*(AM|PM)/i.exec(t||'');if(!m)return 12;var h=+m[1]%12;if(/PM/i.test(m[2]))h+=12;return h}
var PAL=['#D36228','#DAA520','#6E6F33','#B3342C','#4E6E58','#2C3E50','#B66E41','#8A3324'],REDS=['#B3342C','#D36228','#8A3324','#B66E41','#6E6F33'],sel={},metric='orders';
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function pItem(s){var m=/^(\d+)\s*\u00d7\s*(.+)$/.exec(s);return m?[m[2],+m[1]]:[s,1]}
function orderValue(o){var v=0;o.items.forEach(function(s){var p=pItem(s);v+=(PRICE[p[0]]||150)*p[1]});return v}
function addTo(a,o){var h=hrOf(o.at),v=orderValue(o);a.hourly[h]=(a.hourly[h]||0)+1;a.sh[h]=(a.sh[h]||0)+v;
 o.items.forEach(function(s){var p=pItem(s);a.items[p[0]]=(a.items[p[0]]||0)+p[1]});
 a.areas[o.area]=(a.areas[o.area]||0)+1;a.sa[o.area]=(a.sa[o.area]||0)+v}
function hz(el,obj,lim,lab,money,zero,cols){var all=Object.keys(obj),k=all.filter(function(x){return zero||obj[x]>0}).sort(function(x,y){return obj[y]-obj[x]}).slice(0,lim),mx=Math.max(1,k.length?obj[k[0]]:1),tot=0,s=sel[el];
 all.forEach(function(x){tot+=obj[x]});var box=$(el);box.className='hz'+(s?' has-sel':'');
 box.innerHTML=k.length?k.map(function(x){var t=lab?lab(x):x,c=(cols||PAL)[all.indexOf(x)%(cols||PAL).length],v=money?inr(obj[x]):obj[x];
  return '<button type="button" class="'+(s===x?'sel':'')+'" data-ch="'+el+'" data-k="'+esc(x)+'" aria-pressed="'+(s===x)+'" title="'+esc(t)+': '+v+' ('+Math.round(tot?obj[x]/tot*100:0)+'% of total)"><span>'+esc(t)+'</span><span class="trk"><i style="width:'+(obj[x]?Math.max(4,obj[x]/mx*100):0)+'%;background:'+c+'"></i></span><b>'+v+'</b></button>'}).join(''):'<p class="meta">No data yet.</p>';
 var c2=$(el+'-c');if(c2)c2.textContent=s&&obj[s]!=null?(lab?lab(s):s)+': '+(money?inr(obj[s]):obj[s])+' \u00b7 '+Math.round(tot?obj[s]/tot*100:0)+'% of the total. Tap again to clear.':'Tap a bar to see its share of the total.'}
function kp(id,K){$(id).innerHTML=K.map(function(k){return '<div class="kpi"><span>'+k[0]+'</span><b>'+k[1]+'</b><small>'+k[2]+'</small></div>'}).join('')}
function renderAnalytics(){var a=JSON.parse(JSON.stringify(S.stats));S.orders.forEach(function(o){addTo(a,o)});
 var rec=0,sales=0,i,hs=[],mx=1,sm=metric==='sales',isl={},nc=S.cancelled.length,q={'New orders':0,'Preparing':0,'Ready for pickup':0,'On the road':S.trips.length};
 Object.keys(a.hourly).forEach(function(k){rec+=a.hourly[k]});
 Object.keys(a.items).forEach(function(n){var v=(PRICE[n]||150)*a.items[n];sales+=v;isl[n]=v});
 S.orders.forEach(function(o){q[o.status==='Placed'?'New orders':o.status==='Ready'?'Ready for pickup':'Preparing']++});
 var acc=a.acc.length?a.acc.reduce(function(x,y){return x+y},0)/a.acc.length:0;
 kp('kpis',[['Orders received',rec+nc,nc+' cancelled'],['Delivered',a.delivered,S.trips.length+' on the road now'],['Sales',inr(sales),'cancelled orders excluded'],['Average order',inr(rec?sales/rec:0),'per order'],['In the kitchen',S.orders.length,q['New orders']+' new \u00b7 '+q['Preparing']+' preparing \u00b7 '+q['Ready for pickup']+' ready'],['Driver acceptance',acc?fmt(acc):'\u2013','average time to accept'],['Cancelled',nc,Math.round(rec+nc?nc/(rec+nc)*100:0)+'% cancel rate \u00b7 '+inr(S.cancelled.reduce(function(t,o){return t+orderValue(o)},0))+' lost'],['Acceptance rate',Math.round((rec-q['New orders'])/Math.max(1,rec+nc)*100)+'%',q['New orders']+' waiting to be accepted']]);
 document.querySelectorAll('#mt button').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.m===metric)});
 var src=sm?a.sh:a.hourly;for(i=11;i<=21;i++){var v=src[i]||0;hs.push(v);if(v>mx)mx=v}
 var pi=hs.indexOf(Math.max.apply(null,hs)),sh=sel['a-hour'],hb=$('a-hour');hb.className='hb'+(sh?' has-sel':'');
 function lb(h){return ((h%12)||12)+(h<12?' AM':' PM')}
 function val(v){return sm?inr(v):v+' orders'}
 hb.innerHTML=hs.map(function(v,j){var h=11+j,on=String(h)===sh;return '<button type="button" class="'+(on?'sel ':'')+(j===pi&&v?'pk':'')+'" data-ch="a-hour" data-k="'+h+'" aria-pressed="'+on+'" title="'+lb(h)+': '+val(v)+'"><b>'+(sm?(v?(v/1000).toFixed(1)+'k':'0'):v)+'</b><i style="height:'+Math.round(v/mx*130)+'px"></i><span>'+((h%12)||12)+(h<12?'a':'p')+'</span></button>'}).join('');
 var tot=hs.reduce(function(x,y){return x+y},0),ph=11+pi;
 $('a-peak').textContent=sh&&hs[sh-11]!=null?lb(+sh)+': '+val(hs[sh-11])+' \u00b7 '+Math.round(tot?hs[sh-11]/tot*100:0)+'% of the day. Tap again to clear.':(hs[pi]?'Busiest hour so far: '+lb(ph)+' with '+val(hs[pi])+'. Tap a bar for details.':'No orders yet today.');
 hz('a-items',sm?isl:a.items,6,null,sm);hz('a-area',sm?a.sa:a.areas,6,null,sm);hz('a-drv',a.byDriver,5,function(x){return dName(x)||x});hz('a-q',q,4,null,false,true,['#2C3E50','#D36228','#4E6E58','#DAA520']);
 $('a-miss').textContent=(a.missed||0)+' driver offers were declined or timed out today.';
 $('a-date').textContent=new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'});renderReceived();renderCancelled()}
function renderReceived(){var h=0,pl=0,nc=S.cancelled.length;Object.keys(S.stats.hourly).forEach(function(k){h+=S.stats.hourly[k]});S.orders.forEach(function(o){if(o.status==='Placed')pl++});
 var tot=h+S.orders.length+nc;
 hz('a-fun',{'Received':tot,'Accepted':h+S.orders.length-pl,'Handed to drivers':h,'Delivered':S.stats.delivered,'Cancelled':nc},5,null,false,true,['#2C3E50','#D36228','#DAA520','#4E6E58','#B3342C']);
 var SC={Placed:['New','#2C3E50'],Accepted:['Accepted','#D36228'],Preparing:['Preparing','#D36228'],Ready:['Ready','#4E6E58']};
 var L=S.orders.slice().sort(function(x,y){return(+String(y.id).replace(/\D/g,''))-(+String(x.id).replace(/\D/g,''))}).slice(0,6);
 $('a-recent').innerHTML=L.length?L.map(function(o){var c=SC[o.status]||['',''];c=SC[o.status]||['Preparing','#D36228'];return '<article class="crow" style="border-left-color:'+c[1]+'"><div><b>#'+esc(o.id)+'</b> \u00b7 '+esc(o.cust)+'<div class="meta">'+esc(o.items.join(' \u00b7 '))+' \u00b7 '+esc(o.area)+'</div><div class="meta">Received '+esc(o.at)+'</div></div><div class="cside"><span class="badge" style="background:'+c[1]+';color:#fff">'+c[0]+'</span><b>'+inr(orderValue(o))+'</b></div></article>'}).join(''):'<div class="empty">No orders in the queue right now.</div>'}
function renderCancelled(){var L=S.cancelled,lost=0,why={},it={},rec=0;
 Object.keys(S.stats.hourly).forEach(function(k){rec+=S.stats.hourly[k]});rec+=S.orders.length+L.length;
 L.forEach(function(o){lost+=orderValue(o);why[o.reason]=(why[o.reason]||0)+1;o.items.forEach(function(s){var p=pItem(s);it[p[0]]=(it[p[0]]||0)+p[1]})});
 var top=Object.keys(why).sort(function(x,y){return why[y]-why[x]})[0];
 hz('c-why',why,5,null,false,false,REDS);hz('c-items',it,5,null,false,false,['#8A3324','#B3342C','#D36228','#B66E41','#6E6F33']);
 var fr=sel['c-why'],fi=sel['c-items'],shown=L.filter(function(o){return(!fr||o.reason===fr)&&(!fi||o.items.some(function(s){return pItem(s)[0]===fi}))});
 $('c-count').textContent=shown.length===L.length?'Showing all '+L.length+' cancelled orders.':'Showing '+shown.length+' of '+L.length+' (filtered). Tap the selected bar again to clear.';
 $('c-list').innerHTML=shown.length?shown.map(function(o){return '<article class="crow"><div><b>#'+esc(o.id)+'</b> \u00b7 '+esc(o.cust)+'<div class="meta">'+esc(o.items.join(' \u00b7 '))+' \u00b7 '+esc(o.area)+'</div><div class="meta">Placed '+esc(o.at)+' \u00b7 Cancelled '+esc(o.when)+'</div></div><div class="cside"><span class="badge">'+esc(o.reason)+'</span><b>'+inr(orderValue(o))+'</b><button class="btn out sm" data-rs="'+esc(o.id)+'">Restore order</button></div></article>'}).join(''):'<div class="empty">No cancelled orders to show. Cancelled orders appear here with the reason.</div>';}
function restore(id){var i=S.cancelled.findIndex(function(o){return o.id===id});if(i<0)return;var o=S.cancelled.splice(i,1)[0];
 S.orders.push({id:o.id,cust:o.cust,items:o.items,area:o.area,at:o.at,status:'Placed',lat:o.lat,lng:o.lng,prep:o.prep||20});log(id+' restored from cancelled');save();render();say('Order '+id+' restored to New orders.','ok')}
var AREAS=[['Koramangala',12.9279,77.6271],['HSR Layout',12.9116,77.6389],['Indiranagar',12.9784,77.6408],['BTM Layout',12.9166,77.6101],['Jayanagar',12.9250,77.5938]],NAMES=['Asha P.','Vikram S.','Lakshmi N.','Imran K.','Tara M.','Rohit B.'];
function addOrder(o){o=o||{};var ar=AREAS[Math.floor(Math.random()*AREAS.length)],menu=Object.keys(PRICE),its=o.items;
 if(!its){its=[];var n=1+Math.floor(Math.random()*2);while(its.length<n){var m=menu[Math.floor(Math.random()*menu.length)];if(!its.some(function(x){return x.indexOf(m)>-1}))its.push((1+Math.floor(Math.random()*2))+'\u00d7 '+m)}}
 S.nextId=S.nextId||1048;var id=o.id||'FD-'+(S.nextId++);
 S.orders.push({id:id,cust:o.cust||NAMES[Math.floor(Math.random()*NAMES.length)],items:its,area:o.area||ar[0],at:now(),status:'Placed',lat:o.lat||ar[1],lng:o.lng||ar[2],prep:o.prep||15+Math.floor(Math.random()*15)});
 log(id+' placed');save();render();say('New order '+id+' received. Accept it to start the kitchen clock.','ok');return id}
function paintP(){$('pname').textContent=P.name;$('prole').textContent=P.role;$('av').textContent=P.name.charAt(0).toUpperCase();
 document.querySelectorAll('.js-rest').forEach(function(n){n.textContent=P.rest});document.title='FoodDispatch \u00b7 '+P.rest;
 if(rmk)rmk.content.querySelector('.lb').textContent=P.rest;
 $('pf-av').textContent=P.name.charAt(0).toUpperCase();$('pf-name').textContent=P.name;$('pf-rn').textContent=P.rest;$('pf-rr').textContent=P.role;$('pf-role').textContent='Signed in as '+P.role;$('pf-since').textContent=P.since||'\u2013'}
function fillForm(){$('f-name').value=P.name;$('f-rest').value=P.rest;$('f-role').value=P.role;$('f-email').value=P.email||'';$('f-phone').value=P.phone||'';$('pf-msg').hidden=true}
function setView(v){view=v;['orders','analytics','profile'].forEach(function(n){$('v-'+n).hidden=n!==v});
 document.querySelectorAll('.nav button').forEach(function(b){if(b.dataset.v===v)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
 if(v==='analytics')renderAnalytics();if(v==='profile')fillForm();
 if(v==='orders'&&G&&map)setTimeout(function(){G.event.trigger(map,'resize');fitAll()},60);window.scrollTo(0,0)}
function signOut(){try{localStorage.removeItem('fooddispatch_session')}catch(e){}window.FD_LOGIN_URL=window.FD_LOGIN_URL||'index.html#auth';P.in=false;P.name='';P.since='';saveP();var u=window.FD_LOGIN_URL;if(u){location.href=u;return}P.name='Guest';paintP();say('Signed out. Set window.FD_LOGIN_URL to send people to your login page.')}
function setUser(u){if(!u)return;['name','role','email','phone'].forEach(function(k){if(u[k])P[k]=String(u[k])});if(u.restaurant||u.rest)P.rest=String(u.restaurant||u.rest);P.in=true;if(!P.since)P.since=now();saveP();paintP()}
window.FoodDispatch={setUser:setUser,addOrder:function(o){return addOrder(o)},updateStats:function(x){Object.assign(S.stats,x||{});save();render()}};
$('pf-form').addEventListener('submit',function(e){e.preventDefault();var n=$('f-name').value.trim(),m=$('pf-msg');m.hidden=false;
 if(!n){m.className='msg err';m.textContent='Please enter your name.';return}
 P.name=n;P.rest=$('f-rest').value.trim()||'Spice Route Kitchen';P.role=$('f-role').value;P.email=$('f-email').value.trim();P.phone=$('f-phone').value.trim();saveP();paintP();
 m.className='msg ok';m.textContent='Profile saved. Your name now shows in the header.'});
(function(){var q=new URLSearchParams(location.search);setUser(window.FD_USER);
 var su=window.FDSession&&FDSession.forRole('Restaurant');if(su){P.email=su.email;if(FDSession.fresh('restaurant',su)){P.name=FDSession.nameOf(su);P.phone='';P.in=true;P.since=now();saveP()}}
 if(q.get('name'))setUser({name:q.get('name'),restaurant:q.get('restaurant'),role:q.get('role')});
 if(!P.name)P.name='Guest';if(!P.since)P.since=now();paintP();setView('orders');say('Welcome, '+(P.name.split(' ')[0]||P.name)+'. Accept new orders to start the kitchen clock.')})();
importSharedOrders();
 window.addEventListener('storage',function(e){if(e.key==='fooddispatch_shared_orders_v1'){importSharedOrders();save();render();drawList()}});
 render();drawMap();drawList();document.getElementById('spd').addEventListener('change',function(e){mult=+e.target.value});
 document.getElementById('exportorders').addEventListener('click',function(){
  var rows=S.orders.filter(match).filter(function(o){return filter==='All'||(filter==='New'?o.status==='Placed':o.status===filter)});
  var qv=function(v){return '"'+String(v==null?'':v).replace(/"/g,'""')+'"';};
  var csv=[['Order','Customer','Items','Area','Status','Time'].map(qv).join(',')].concat(rows.map(function(o){return [o.id,o.cust,o.items.join('; '),o.area,o.status,o.at].map(qv).join(',')})).join('\r\n');
  var u=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'})),a=document.createElement('a');a.href=u;a.download='fooddispatch-orders.csv';a.click();setTimeout(function(){URL.revokeObjectURL(u)},1000);
  say('Exported '+rows.length+' visible orders.','ok');
 });
setInterval(tick,1000);
