/* Add your restricted Google Maps key in your private local copy only. */
window.FD_MAPS_API_KEY = "AIzaSyDnXChpaGFfSHWRwcKigh2Rd3qb33KaavE";

/* Customer page only: if Google routing never answers (key not allowed for this site), use the free OSRM service after 4 s. */
window.addEventListener('load',function(){
  if(typeof routeAny!=='function'||typeof provider==='undefined'||typeof gm!=='function')return;
  routeAny=function(from,to,cb0){
    var fin=false,cb=function(r){if(fin)return;fin=true;cb0(r)};
    var osrm=function(){fetch('https://router.project-osrm.org/route/v1/driving/'+from[1]+','+from[0]+';'+to[1]+','+to[0]+'?overview=full&geometries=geojson').then(function(r){return r.json()}).then(function(j){var r=j.routes&&j.routes[0];if(!r)throw 0;cb({path:r.geometry.coordinates.map(function(c){return[c[1],c[0]]}),distM:r.distance,secs:r.duration})}).catch(function(){cb(null)})};
    if(provider==='google'&&gm()){
      var t=setTimeout(function(){if(!fin)osrm()},4000);
      try{new google.maps.DirectionsService().route({origin:gll(from),destination:gll(to),travelMode:google.maps.TravelMode.DRIVING},function(res,status){
        clearTimeout(t);
        if(status==='OK'){var r=res.routes[0],l=r.legs[0];cb({path:r.overview_path.map(function(p){return[p.lat(),p.lng()]}),distM:l.distance.value,secs:l.duration.value})}else osrm()})}catch(e){clearTimeout(t);osrm()}
    }else osrm()};
});
