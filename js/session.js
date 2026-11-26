/* Shared login session for all FoodDispatch pages (demo: stored in this browser only). */
window.FDSession=(function(){
  var KEY='fooddispatch_session',ACC='fooddispatch_accounts';
  var DEST={Customer:'customer.html',Restaurant:'restaurant.html','Delivery partner':'driver.html'};
  function get(){try{return JSON.parse(localStorage.getItem(KEY))}catch(e){return null}}
  function nameOf(s){
    if(!s)return '';
    if(s.name)return s.name;
    var l=String(s.email||'').split('@')[0].replace(/[._\-+0-9]+/g,' ').trim();
    return l.replace(/\b\w/g,function(c){return c.toUpperCase()})||'User';
  }
  function forRole(role){var s=get();return s&&s.role===role?s:null}
  /* true only the first time a given login is seen by a page, so later profile edits are kept */
  function fresh(page,s){
    try{var k='fd_applied_'+page;if(localStorage.getItem(k)===String(s.at))return false;localStorage.setItem(k,String(s.at));return true}
    catch(e){return true}
  }
  /* remembers the name given at sign up so a later log in with the same email gets it back */
  function accounts(){try{return JSON.parse(localStorage.getItem(ACC))||{}}catch(e){return {}}}
  function rememberName(email,name){if(!email||!name)return;try{var a=accounts();a[email.toLowerCase()]=name;localStorage.setItem(ACC,JSON.stringify(a))}catch(e){}}
  function recallName(email){return accounts()[String(email||'').toLowerCase()]||''}
  function save(s){try{localStorage.setItem(KEY,JSON.stringify(s))}catch(e){}}
  function signOut(){try{localStorage.removeItem(KEY)}catch(e){}location.href='index.html#auth'}
  return {get:get,nameOf:nameOf,forRole:forRole,fresh:fresh,rememberName:rememberName,recallName:recallName,save:save,signOut:signOut,DEST:DEST};
})();
