import {buildings,upgrades,research,achievements,regions,progressionMissions,tutorialMissions} from '../data/gameData.js';
import {outpostProduction,skillBonus,galaxyBoosts} from './exploration.js';
import {ensureCosmic,cosmicBonuses} from './cosmicEngine.js';
import {ensureProgression,recordProgress,updateEra,buildingEffect,buildingMilestone,synergyMultiplier,prestigeBenefits} from './progression.js';
import {universeScale,ascensionRequirements,megaBonuses,challengeTypes,challengeBonuses,advanceEntropy,MAX_RESOURCE} from './incremental.js';
export {discover} from './exploration.js';
export const VERSION=10;
export function fresh(){const s={version:VERSION,resources:{energy:25,credits:15,research:0,data:0,matter:0,antimatter:0,darkEnergy:0,quantumCores:0,shards:0,knowledge:0},buildings:Object.fromEntries(buildings.map(b=>[b.id,0])),upgrades:{},research:{},stats:{clicks:0,totalEnergy:0,totalProduced:0,prestiges:0,ascensions:0,time:0,offline:0,bestCombo:0,longestSession:0},claimed:{},dailyDate:'',dailyStart:0,boostCooldown:0,combo:0,lastClick:0,boost:0,missions:{daily:0,tutorial:0},exploration:{unlocked:false,regions:{home:1},outposts:{},skills:{},frontier:0,missions:[]},cosmic:null,megastructures:{},challenge:{active:null,completed:{},startEnergy:0},entropy:0,progression:null,log:['SYSTEM ONLINE — welcome, architect.'],settings:{reducedMotion:false,particles:true}};ensureCosmic(s);ensureProgression(s);return s}
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
 for(const id of ['nav1','nav2','nav3','nav4','ind1','ind2','ind3','ind4','asc1','asc2','asc3','asc4']){const level=p.exploration?.skills?.[id];if(Number.isFinite(level))n.exploration.skills[id]=Math.max(0,Math.min(25,Math.floor(level)));}
 if(Number.isFinite(p.exploration?.frontier))n.exploration.frontier=Math.max(0,Math.floor(p.exploration.frontier));
 n.claimed=Object.fromEntries(Object.entries(p.claimed||{}).filter(([k,v])=>v===true));
 if(p.cosmic&&typeof p.cosmic==='object'){n.cosmic={...n.cosmic,unlocked:!!p.cosmic.unlocked,firstChoice:typeof p.cosmic.firstChoice==='string'?p.cosmic.firstChoice:null,purchased:Object.fromEntries(Object.entries(p.cosmic.purchased||{}).filter(([k,v])=>Number.isFinite(v)&&v>0).map(([k,v])=>[k,1])),ascensionMilestones:Math.max(0,Math.floor(Number(p.cosmic.ascensionMilestones)||0)),era:Math.max(0,Math.floor(Number(p.cosmic.era)||0)),realityFragments:Math.max(0,Number(p.cosmic.realityFragments)||0)}}
 for(const [id,level] of Object.entries({...(p.civilization?.megastructures||{}),...(p.megastructures||{})}))if(typeof level==='number'&&Number.isFinite(level))n.megastructures[id]=Math.min(6,Math.max(0,Math.floor(level)));
 if(p.challenge&&typeof p.challenge==='object'){n.challenge.active=challengeTypes.some(x=>x.id===p.challenge.active)?p.challenge.active:null;n.challenge.completed=Object.fromEntries(challengeTypes.filter(x=>p.challenge.completed?.[x.id]).map(x=>[x.id,true]));n.challenge.startEnergy=Number.isFinite(p.challenge.startEnergy)?Math.max(0,p.challenge.startEnergy):0;}
 if(Number.isFinite(p.entropy))n.entropy=Math.max(0,Math.min(99,p.entropy));
 if(p.progression&&typeof p.progression==='object')n.progression=JSON.parse(JSON.stringify(p.progression));
 ensureCosmic(n);
 ensureProgression(n);
 n.dailyDate=typeof p.dailyDate==='string'?p.dailyDate:'';n.dailyStart=Number.isFinite(p.dailyStart)?p.dailyStart:0;n.boostCooldown=Number.isFinite(p.boostCooldown)?p.boostCooldown:0;
 return n;
}
export function load(){const raw=storage.getItem('starforge-save');if(!raw)return fresh();try{return normalize(JSON.parse(raw))}catch{storage.setItem('starforge-recovery',raw);return fresh()}}
export function save(s){const ok=storage.setItem('starforge-save',JSON.stringify({...s,version:VERSION}));if(ok)storage.setItem('starforge-last',Date.now());return ok}
export function cost(b,n,s){return Math.min(MAX_RESOURCE,Math.floor(b.base*Math.pow(b.scale,Math.min(n,10000))*(s?universeScale(s)*(s.challenge?.active==='compression'?2:1):1)))}
export function totalProd(s){const skill=skillBonus(s),galaxy=galaxyBoosts(s),cosmic=cosmicBonuses(s),mega=megaBonuses(s),challenge=challengeBonuses(s),prestige=prestigeBenefits(s);let mult=1+(s.upgrades.reactors?.value||0)+(s.research.industrial?.value||0)+(s.research.efficiency?.value||0)+(s.upgrades.singularity?.value||0)+prestige.production+ (challenge.production||0);mult*=1+Math.floor((s.buildings.fusion||0)/10)*.05;mult*=1+Math.sqrt(s.resources.shards)*.1+s.resources.knowledge*.5;mult*=1+(Object.keys(s.exploration.regions).length-1)*.05;mult*=1+(cosmic.automation||0)+skill.production+skill.frontier+galaxy.production+cosmic.production+mega.production+(cosmic.entropy||0);if(s.boost>0)mult*=2;const out={};for(const b of buildings){const level=s.buildings[b.id]||0,effect=buildingEffect(s,b.id),local=(1+(effect.production||0))*synergyMultiplier(s,b.id)*(b.id==='solar'||b.id==='dyson'?1+(mega.energy||0):1);for(const [r,v] of Object.entries(b.prod))out[r]=(out[r]||0)+v*level*local*(1+(effect[r]||0))}for(const [r,v] of Object.entries(outpostProduction(s)))out[r]=(out[r]||0)+v;if(s.research.ai)out.data=(out.data||0)*1.5;out.research=(out.research||0)*(1+cosmic.research+(mega.research||0));out.data=(out.data||0)*(1+(mega.data||0));out.darkEnergy=(out.darkEnergy||0)*(1+(mega.darkEnergy||0)+(challenge.darkEnergy||0));out.energy=(out.energy||0)*(challengeTypes.find(c=>c.id===s.challenge?.active)?.effect.energy||1);for(const r of Object.keys(out))out[r]=Math.min(MAX_RESOURCE,out[r]*mult*(1+(galaxy[r]||0)));return out}
export function click(s){const now=Date.now();s.stats.clicks++;s.combo=now-s.lastClick<2200*(s.upgrades.rhythm?1.35:1)?s.combo+1:1;s.lastClick=now;s.stats.bestCombo=Math.max(s.stats.bestCombo,s.combo);const upgradeClickPower=Object.values(s.upgrades).filter(u=>u?.effect==='clickFlat').reduce((sum,u)=>sum+Math.max(0,Number(u.value)||0),0),buildingClickPower=(s.buildings?.clicking||0);let amount=1+upgradeClickPower+buildingClickPower;const crit=Math.random()<(0.05+(s.upgrades.precision?.value||0)*.05);if(crit)amount*=2+(s.upgrades.precision?.value||0);amount*=1+Math.min(s.combo,50)*.01;amount*=1+cosmicBonuses(s).click;s.resources.energy+=amount;s.resources.credits+=(crit?.2:.1)+Math.min(s.combo,50)*.01;s.resources.energy=Math.min(s.resources.energy,MAX_RESOURCE);s.stats.totalEnergy=Math.min(MAX_RESOURCE,s.stats.totalEnergy+amount);s.stats.totalProduced=Math.min(MAX_RESOURCE,s.stats.totalProduced+amount);if(s.stats.clicks===1)recordProgress(s,'First click','The first spark entered the core.');return {amount,crit}}
export function tick(s,dt,{offline=false}={}){if(!Number.isFinite(dt)||dt<=0)return totalProd(s);ensureProgression(s);const prod=totalProd(s);s.stats.totalEnergy=Math.min(MAX_RESOURCE,s.stats.totalEnergy+(prod.energy||0)*dt);for(const [r,v] of Object.entries(prod))s.resources[r]=Math.min(MAX_RESOURCE,(s.resources[r]||0)+v*dt);s.stats.time+=dt;s.boostCooldown=Math.max(0,s.boostCooldown-dt);if(Date.now()-s.lastClick>2200*(s.upgrades.rhythm?1.35:1))s.combo=0;s.stats.totalProduced=Math.min(MAX_RESOURCE,s.stats.totalProduced+Object.values(prod).reduce((a,b)=>a+b,0)*dt);if(s.boost>0)s.boost=Math.max(0,s.boost-dt);updateEra(s);if(advanceEntropy(s,dt,{offline}))collapse(s);return prod}
export function buy(s,id,qty){const b=buildings.find(x=>x.id===id),n=s.buildings[id]||0;if(!b||Math.max(s.stats.totalEnergy,s.resources.energy)<b.unlock||!Number.isFinite(qty)||qty<=0)return 0;qty=Math.min(10000,Math.floor(qty));let bought=0;for(let i=0;i<qty;i++){const c=cost(b,n+bought,s);if(s.resources.credits<c)break;s.resources.credits-=c;bought++}s.buildings[id]+=bought;if(bought){recordProgress(s,n===0?'First automation online':`${b.name} purchased`,`Built ${bought} ${b.name}${bought===1?'':'s'}.`);const milestone=buildingMilestone(s,id);if(milestone&&!s.progression.milestones[`building-${id}-${milestone.level}`]){s.progression.milestones[`building-${id}-${milestone.level}`]=true;s.log.unshift(`${b.name.toUpperCase()} MILESTONE — ${milestone.label}`);}}return bought}
export function buyUpgrade(s,id){const u=upgrades.find(x=>x.id===id);if(!u||s.upgrades[id]||u.req?.some(req=>!s.upgrades[req]))return false;for(const [r,c] of Object.entries(u.cost))if((s.resources[r]||0)<c)return false;for(const [r,c] of Object.entries(u.cost))s.resources[r]-=c;s.upgrades[id]=u;recordProgress(s,'Upgrade: '+u.name,u.desc);return true}
export function buyResearch(s,id){const r=research.find(x=>x.id===id);if(!r||s.research[id]||r.req.some(x=>!s.research[x])||s.resources.research<r.cost)return false;s.resources.research-=r.cost;s.research[id]={...r,value:r.effect==='prod'?(r.id==='efficiency'?.2:.1):1};if(r.id==='exploration')s.exploration.unlocked=true;recordProgress(s,'Research: '+r.name,r.desc);return true}
export function prestige(s){const gain=Math.floor(Math.sqrt(Math.max(0,s.resources.energy)/1e6));if(!gain)return 0;const keep={shards:s.resources.shards+gain,knowledge:s.resources.knowledge};const retained={stats:{...s.stats},research:s.research,upgrades:s.upgrades,claimed:s.claimed,dailyDate:s.dailyDate,dailyStart:s.dailyStart,settings:s.settings,progression:s.progression,cosmic:s.cosmic,megastructures:s.megastructures,challenge:{active:null,completed:{...s.challenge.completed},startEnergy:0},entropy:s.entropy,exploration:{...fresh().exploration,skills:s.exploration.skills||{},frontier:s.exploration.frontier||0}};const n=fresh();Object.assign(s,n,retained);s.resources={...n.resources,...keep};s.stats.prestiges++;const benefits=prestigeBenefits(s);s.resources.credits+=benefits.credits;s.buildings.manual+=benefits.manual;s.buildings.solar+=benefits.solar;s.log.unshift(`TRANSCENDENCE COMPLETE +${gain} prestige shards`);recordProgress(s,'Prestige '+s.stats.prestiges,'A faster empire begins.');return gain}
export function collapse(s){const stats={...s.stats},knowledge=s.resources.knowledge,cosmic=s.cosmic,completed=s.challenge?.completed||{},settings=s.settings,claimed=s.claimed,mega=s.megastructures,skills=s.exploration.skills,frontier=s.exploration.frontier;Object.assign(s,fresh());Object.assign(s,{stats,cosmic,settings,claimed,megastructures:mega});s.resources.knowledge=knowledge;s.challenge.completed=completed;s.exploration.skills=skills;s.exploration.frontier=frontier;s.log.unshift('UNIVERSE COLLAPSE — cosmic knowledge preserved; retry this Ascension.');return true}
export function ascend(s){const requirement=ascensionRequirements(s);if(!s.research.galactic||s.resources.shards<requirement.shards||s.resources.energy<requirement.energy||s.resources.research<requirement.research||Object.keys(s.exploration.regions).length<requirement.galaxies)return false;const wasFirst=s.stats.ascensions===0,knowledge=wasFirst?1:s.resources.knowledge+1,stats={...s.stats,ascensions:s.stats.ascensions+1},claimed=s.claimed,settings=s.settings,skills=s.exploration.skills||{},frontier=s.exploration.frontier||0,cosmic=s.cosmic,progression=s.progression,mega=s.megastructures,completed=s.challenge.completed;Object.assign(s,fresh(),{stats,claimed,settings,progression,megastructures:mega});s.exploration.skills=skills;s.exploration.frontier=frontier;s.cosmic={...s.cosmic,...cosmic,unlocked:true,ascensionMilestones:stats.ascensions};s.challenge.completed=completed;s.resources.knowledge=knowledge;s.log.unshift(wasFirst?'FIRST ASCENSION COMPLETE — choose one Cosmic Knowledge awakening':'ASCENSION COMPLETE — next universe is harder');recordProgress(s,wasFirst?'First Ascension':'Ascension '+stats.ascensions,'The scale of Starforge has changed.');return true}
export function offline(s){
 const then=Number(storage.getItem('starforge-last')),now=Date.now();
 const cap=(s.upgrades.offline?43200:7200)+(s.research.time?43200:0);
 const secs=Number.isFinite(then)&&then>0?Math.max(0,Math.min((now-then)/1000,cap)):0;
 if(secs<=5)return null;
 const boosted=Math.min(s.boost,secs),before=s.resources.energy;
 if(boosted)tick(s,boosted,{offline:true});
 if(secs>boosted)tick(s,secs-boosted,{offline:true});
 s.stats.time-=secs;s.stats.offline+=secs;save(s);
 return {secs,energy:s.resources.energy-before};
}
export function format(n){if(!Number.isFinite(n))return '∞';if(n<1000)return n.toFixed(n<10?1:0);const units=['k','M','B','T','Qa','Qi','Sx','Sp','Oc'];let i=0;while(n>=1000&&i<units.length){n/=1000;i++}return n.toFixed(n<10?2:1)+units[i-1]}
export function achievementProgress(s,a){if(a.type==='clicks')return s.stats.clicks;if(a.type==='energy')return s.stats.totalEnergy;if(a.type==='combo')return s.stats.bestCombo;if(a.type==='research')return Object.keys(s.research).length;if(a.type==='matter')return s.resources.matter;return s.buildings[a.type]||0}
export {buildings,upgrades,research,achievements};


export function missions(s){
 const date=new Date().toISOString().slice(0,10);
 if(s.dailyDate!==date){s.dailyStart=s.dailyDate?s.stats.totalEnergy:0;s.dailyDate=date;delete s.claimed.daily;}
 const tutorial=[...tutorialMissions].map((m,i)=>({...m,progress:m.metric==='output'?totalProd(s).energy||0:m.metric==='research'?Object.keys(s.research).length:m.metric==='industrial'?(s.research.industrial?1:0):m.metric==='vega'?s.exploration.regions.vega||0:s.buildings[m.metric]||0,locked:i>0&&!s.claimed[tutorialMissions[i-1].id]}));
 const all=[
 ...tutorial,
 {id:'daily',name:'Daily pulse',desc:'Generate 1,000 energy today (resets at 00:00 UTC)',goal:1000,progress:Math.max(0,s.stats.totalEnergy-s.dailyStart),reward:2},
 {id:'objective',name:'Architect’s path',desc:'Own 10 buildings',goal:10,progress:Object.values(s.buildings).reduce((a,b)=>a+b,0),reward:1},
 {id:'expedition',name:'Beyond the blue',desc:'Discover Vega Relay',goal:1,progress:s.exploration.regions.vega||0,reward:1},
 ...progressionMissions.map(m=>({...m,progress:({output:totalProd(s).energy||0,buildings:Object.values(s.buildings).reduce((a,b)=>a+b,0),research:Object.keys(s.research).length,outposts:Object.values(s.exploration.outposts||{}).reduce((a,b)=>a+b,0)})[m.metric]??s.exploration.regions[m.metric]??0}))
 ];
 const rank=m=>!m.locked&&!s.claimed[m.id]&&m.progress>=m.goal?0:1;
 return all.sort((a,b)=>rank(a)-rank(b));
}
export function claimMission(s,id){
 const m=missions(s).find(x=>x.id===id);if(!m||m.locked||s.claimed[id]||m.progress<m.goal)return false;
 s.claimed[id]=true;if(typeof m.reward==='number')s.resources.shards+=m.reward;else for(const [resource,amount] of Object.entries(m.reward||{}))s.resources[resource]=(s.resources[resource]||0)+amount;return true;
}
export function claimAchievement(s,id){
 const a=achievements.find(x=>x.id===id);if(!a||s.claimed[id]||achievementProgress(s,a)<a.goal)return false;
 s.claimed[id]=true;s.resources.shards+=a.reward;return true;
}
export function convertEnergy(s){const amount=Math.floor(s.resources.energy/10)*10;if(amount<10)return false;s.resources.energy-=amount;s.resources.credits+=amount/10;return true;}
