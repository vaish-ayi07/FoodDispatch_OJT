/* FoodDispatch shared demo order store. Same-origin tabs/pages only; not a backend. */
(function(){
  'use strict';
  var KEY='fooddispatch_shared_orders_v1';
  function read(){try{var x=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(x)?x:[]}catch(e){return[]}}
  function write(rows){try{localStorage.setItem(KEY,JSON.stringify(rows));return true}catch(e){return false}}
  function get(id){return read().find(function(o){return o.id===id})||null}
  function upsert(o){var a=read(),i=a.findIndex(function(x){return x.id===o.id});if(i<0)a.unshift(o);else a[i]=Object.assign({},a[i],o);write(a);return o}
  function update(id,patch,actor){
    var a=read(),i=a.findIndex(function(x){return x.id===id});if(i<0)return null;
    var old=a[i],next=Object.assign({},old,patch||{});
    if(patch&&patch.status&&patch.status!==old.status){
      next.events=(old.events||[]).concat([{status:patch.status,actor:actor||'system',at:Date.now()}]);
    }
    a[i]=next;write(a);return next;
  }
  function fromCustomer(o){
    return upsert({
      id:o.id,source:'customer',restaurant:o.k,restaurantId:o.rid||'',restaurantLat:(o.pos||[12.9352,77.6245])[0],
      restaurantLng:(o.pos||[12.9352,77.6245])[1],customer:o.name||'FoodDispatch customer',
      items:o.lines?o.lines.map(function(x){return x.q+'× '+x.n}):String(o.items||'').split(', '),
      total:o.total||0,area:'Customer delivery area',deliveryLabel:'Customer drop-off',
      customerLat:(o.drop||[12.985,77.723])[0],customerLng:(o.drop||[12.985,77.723])[1],
      handedOver: false,status:'Placed',createdAt:o.start||Date.now(),etaMinutes:Math.ceil((o.dur||120000)/60000),
      etaAt:(o.start||Date.now())+(o.dur||120000),travelMin:(o.est&&o.est.travelMin)||0,prepMin:(o.est&&o.est.prepMin)||0,distKm:(o.est&&o.est.distKm)||0,
      driverId:null,driverName:null,driverLat:null,driverLng:null,otp:o.otp||'',events:[{status:'Placed',actor:'Customer',at:o.start||Date.now()}]
    });
  }
  /* One real ETA for every page: the time the route and kitchen estimate gave at checkout, moved later only if things run late.
     Returns a timestamp (ms) for when the customer should receive the food, or null if the order has no estimate. */
  function etaAt(sh){
    if(!sh||!sh.etaAt)return null;
    var t=sh.etaAt,trip=(sh.travelMin||0)*60000;
    if(sh.status==='Picked up'){if(sh.pickedAt&&trip)t=sh.pickedAt+trip;}
    else if(trip)t=Math.max(t,Date.now()+trip);   // cannot arrive sooner than one trip from now
    return t;
  }
  function etaMin(sh){var t=etaAt(sh);if(t==null)return sh&&sh.etaMinutes!=null?sh.etaMinutes:null;return Math.max(1,Math.ceil((t-Date.now())/60000))}
  /* minutes until the real driver reaches the restaurant (set when the driver page accepts the order), or null */
  function approachMin(sh){if(!sh||!sh.approachTo)return null;return Math.max(0,Math.ceil((sh.approachTo-Date.now())/60000))}
  /* name typed/logged in on the driver page, or '' when no real driver has taken the order */
  function realDriver(id){var sh=get(id);return sh&&sh.driverReal&&sh.driverName?sh.driverName:''}
  window.FDSharedOrders={approachMin:approachMin,realDriver:realDriver,key:KEY,read:read,get:get,upsert:upsert,update:update,fromCustomer:fromCustomer,etaAt:etaAt,etaMin:etaMin};
})();