import {buildings,upgrades,research,achievements,regions,progressionMissions} from '../data/gameData.js';
import {outpostProduction} from './exploration.js';
export {discover} from './exploration.js';
export const VERSION=5;
export function fresh(){return {version:VERSION,resources:{energy:25,credits:15,research:0,data:0,matter:0,antimatter:0,darkEnergy:0,quantumCores:0,shards:0,knowledge:0},buildings:Object.fromEntries(buildings.map(b=>[b.id,0])),upgrades:{},research:{},stats:{clicks:0,totalEnergy:0,totalProduced:0,prestiges:0,ascensions:0,time:0,offline:0,bestCombo:0,longestSession:0},claimed:{},dailyDate:'',dailyStart:0,boostCooldown:0,combo:0,lastClick:0,boost:0,missions:{daily:0,tutorial:0},exploration:{unlocked:false,regions:{home:1},outposts:{},missions:[]},log:['SYSTEM ONLINE — welcome, architect.'],settings:{reducedMotion:false,particles:true}}}
export const storage = {
 getItem(key){try{return localStorage.getItem(key)}catch{return null}},
 setItem(key,value){try{localStorage.setItem(key,String(value));return true}catch{return false}},
 removeItem(key){try{localStorage.removeItem(key)}catch{}}
};
export function normalize(p){
 if(!p || typeof p!=='object' || !p.resources || !p.buildings) throw Error('Invalid save');
 const n=fresh();
 for(const group of ['resources','buildings','stats']) for(const key of Object.keys(n[group])){
  const value=p[group]?.[key];if(typeof value==='number'&&Number.isFinite(value)&&value>=0)n[group][key]=Math.min(value,1e100);
 }
 for(const key of Object.keys(n.buildings))n.buildings[key]=Math.floor(n.buildings[key]);
 for(const u of upgrades)if(p.upgrades?.[u.id])n.upgrades[u.id]=u;
 for(const r of research)if(p.research?.[r.id])n.research[r.id]={...r,value:r.effect==='prod'?(r.id==='efficiency'?.2:.1):1};
 for(const key of ['combo','lastClick','boost'])if(Number.isFinite(p[key])&&p[key]>=0)n[key]=p[key];
 if(Array.isArray(p.log))n.log=p.log.filter(x=>typeof x==='string').slice(0,50);
 for(const key of ['reducedMotion','particles'])if(typeof p.settings?.[key]==='boolean')n.settings[key]=p.settings[key];
 for(const id of regions.map(r=>r.id))if(p.exploration?.regions?.[id])n.exploration.regions[id]=1;
 n.exploration.unlocked=!!(n.research.exploration||n.upgrades.explorer);
 for(const r of regions){const level=p.exploration?.outposts?.[r.id];if(r.prod&&n.exploration.regions[r.id]&&Number.isFinite(level))n.exploration.outposts[r.id]=Math.max(0,Math.min(10,Math.floor(level)));}
 n.claimed=Object.fromEntries(Object.entries(p.claimed||{}).filter(([k,v])=>v===true));
 n.dailyDate=typeof p.dailyDate==='string'?p.dailyDate:'';n.dailyStart=Number.isFinite(p.dailyStart)?p.dailyStart:0;n.boostCooldown=Number.isFinite(p.boostCooldown)?p.boostCooldown:0;
 return n;
}
export function load(){const raw=storage.getItem('starforge-save');if(!raw)return fresh();try{return normalize(JSON.parse(raw))}catch{storage.setItem('starforge-recovery',raw);return fresh()}}
export function save(s){const ok=storage.setItem('starforge-save',JSON.stringify({...s,version:VERSION}));if(ok)storage.setItem('starforge-last',Date.now());return ok}
export function cost(b,n){return Math.floor(b.base*Math.pow(b.scale,n))}
export function totalProd(s){let mult=1+(s.upgrades.reactors?.value||0)+(s.research.industrial?.value||0)+(s.research.efficiency?.value||0)+(s.upgrades.singularity?.value||0);mult*=1+Math.floor(s.buildings.fusion/10)*.05;mult*=1+Math.sqrt(s.resources.shards)*.1+s.resources.knowledge*.5;mult*=1+(Object.keys(s.exploration.regions).length-1)*.05;if(s.boost>0)mult*=2;const out={};for(const b of buildings){const level=(s.buildings[b.id]||0)*(b.id==='manual'?1+s.buildings.solar*.02:1);for(const [r,v] of Object.entries(b.prod))out[r]=(out[r]||0)+v*level}for(const [r,v] of Object.entries(outpostProduction(s)))out[r]=(out[r]||0)+v;if(s.research.ai)out.data=(out.data||0)*1.5;for(const r of Object.keys(out))out[r]*=mult;return out}
export function click(s){const now=Date.now();s.stats.clicks++;s.combo=now-s.lastClick<2200*(s.upgrades.rhythm?1.35:1)?s.combo+1:1;s.lastClick=now;s.stats.bestCombo=Math.max(s.stats.bestCombo,s.combo);let amount=1+(s.upgrades.capacitors?.value||0);const crit=Math.random()<(0.05+(s.upgrades.precision?.value||0)*.05);if(crit)amount*=2+(s.upgrades.precision?.value||0);amount*=1+Math.min(s.combo,50)*.01;s.resources.energy+=amount;s.resources.credits+=(crit?.2:.1);s.resources.energy=Math.min(s.resources.energy,1e300);s.stats.totalEnergy+=amount;s.stats.totalProduced+=amount;return {amount,crit}}
export function tick(s,dt){if(!Number.isFinite(dt)||dt<=0)return totalProd(s);const prod=totalProd(s);s.stats.totalEnergy+=(prod.energy||0)*dt;for(const [r,v] of Object.entries(prod))s.resources[r]=Math.min(1e100,(s.resources[r]||0)+v*dt);s.stats.time+=dt;s.boostCooldown=Math.max(0,s.boostCooldown-dt);if(Date.now()-s.lastClick>2200*(s.upgrades.rhythm?1.35:1))s.combo=0;s.stats.totalProduced+=Object.values(prod).reduce((a,b)=>a+b,0)*dt;if(s.boost>0)s.boost=Math.max(0,s.boost-dt);return prod}
export function buy(s,id,qty){const b=buildings.find(x=>x.id===id),n=s.buildings[id]||0;if(!b||Math.max(s.stats.totalEnergy,s.resources.energy)<b.unlock||!Number.isFinite(qty)||qty<=0)return 0;qty=Math.min(10000,Math.floor(qty));let bought=0;for(let i=0;i<qty;i++){const c=cost(b,n+bought);if(s.resources.credits<c)break;s.resources.credits-=c;bought++}s.buildings[id]+=bought;return bought}
export function buyUpgrade(s,id){const u=upgrades.find(x=>x.id===id);if(!u||s.upgrades[id])return false;for(const [r,c] of Object.entries(u.cost))if((s.resources[r]||0)<c)return false;for(const [r,c] of Object.entries(u.cost))s.resources[r]-=c;s.upgrades[id]=u;return true}
export function buyResearch(s,id){const r=research.find(x=>x.id===id);if(!r||s.research[id]||r.req.some(x=>!s.research[x])||s.resources.research<r.cost)return false;s.resources.research-=r.cost;s.research[id]={...r,value:r.effect==='prod'?(r.id==='efficiency'?.2:.1):1};if(r.id==='exploration')s.exploration.unlocked=true;return true}
export function prestige(s){const gain=Math.floor(Math.sqrt(Math.max(0,s.resources.energy)/1e6));if(!gain)return 0;const keep={shards:s.resources.shards+gain,knowledge:s.resources.knowledge};const retained={stats:{...s.stats},research:s.research,upgrades:s.upgrades,claimed:s.claimed,dailyDate:s.dailyDate,dailyStart:s.dailyStart,settings:s.settings};const n=fresh();Object.assign(s,n,retained);s.resources={...n.resources,...keep};s.stats.prestiges++;s.log.unshift(`TRANSCENDENCE COMPLETE +${gain} prestige shards`);return gain}
export function ascend(s){if(!s.research.galactic||s.resources.shards<100)return false;const knowledge=s.resources.knowledge+1,stats={...s.stats,ascensions:s.stats.ascensions+1},claimed=s.claimed,settings=s.settings;Object.assign(s,fresh(),{stats,claimed,settings});s.resources.knowledge=knowledge;s.log.unshift('ASCENSION COMPLETE — cosmic knowledge acquired');return true}
export function offline(s){
 const then=Number(storage.getItem('starforge-last')),now=Date.now();
 const cap=(s.upgrades.offline?43200:7200)+(s.research.time?43200:0);
 const secs=Number.isFinite(then)&&then>0?Math.max(0,Math.min((now-then)/1000,cap)):0;
 if(secs<=5)return null;
 const boosted=Math.min(s.boost,secs),before=s.resources.energy;
 if(boosted)tick(s,boosted);
 if(secs>boosted)tick(s,secs-boosted);
 s.stats.time-=secs;s.stats.offline+=secs;save(s);
 return {secs,energy:s.resources.energy-before};
}
export function format(n){if(!Number.isFinite(n))return '∞';if(n<1000)return n.toFixed(n<10?1:0);const units=['k','M','B','T','Qa','Qi','Sx','Sp','Oc'];let i=0;while(n>=1000&&i<units.length){n/=1000;i++}return n.toFixed(n<10?2:1)+units[i-1]}
export function achievementProgress(s,a){if(a.type==='clicks')return s.stats.clicks;if(a.type==='energy')return s.stats.totalEnergy;if(a.type==='combo')return s.stats.bestCombo;if(a.type==='research')return Object.keys(s.research).length;if(a.type==='matter')return s.resources.matter;return s.buildings[a.type]||0}
export {buildings,upgrades,research,achievements};


export function missions(s){
 const date=new Date().toISOString().slice(0,10);
 if(s.dailyDate!==date){s.dailyStart=s.dailyDate?s.stats.totalEnergy:0;s.dailyDate=date;delete s.claimed.daily;}
 return [
 {id:'tutorial',name:'Tutorial directive',desc:'Reach 50 energy/s',goal:50,progress:totalProd(s).energy||0,reward:1},
 {id:'daily',name:'Daily pulse',desc:'Generate 1,000 energy today (resets at 00:00 UTC)',goal:1000,progress:Math.max(0,s.stats.totalEnergy-s.dailyStart),reward:2},
 {id:'objective',name:'Architect’s path',desc:'Own 10 buildings',goal:10,progress:Object.values(s.buildings).reduce((a,b)=>a+b,0),reward:1},
 {id:'expedition',name:'Beyond the blue',desc:'Discover Vega Relay',goal:1,progress:s.exploration.regions.vega||0,reward:1},
 ...progressionMissions.map(m=>({...m,progress:({output:totalProd(s).energy||0,buildings:Object.values(s.buildings).reduce((a,b)=>a+b,0),research:Object.keys(s.research).length,outposts:Object.values(s.exploration.outposts||{}).reduce((a,b)=>a+b,0)})[m.metric]??s.exploration.regions[m.metric]??0}))
 ];
}
export function claimMission(s,id){
 const m=missions(s).find(x=>x.id===id);if(!m||s.claimed[id]||m.progress<m.goal)return false;
 s.claimed[id]=true;s.resources.shards+=m.reward;return true;
}
export function claimAchievement(s,id){
 const a=achievements.find(x=>x.id===id);if(!a||s.claimed[id]||achievementProgress(s,a)<a.goal)return false;
 s.claimed[id]=true;s.resources.shards+=a.reward;return true;
}
export function convertEnergy(s){const amount=Math.floor(s.resources.energy/10)*10;if(amount<10)return false;s.resources.energy-=amount;s.resources.credits+=amount/10;return true;}
