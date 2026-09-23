import {buildings,research,regions} from '../data/gameData.js';
import {eras,buildingMilestones,prestigeMilestones,opportunities,balance} from '../data/progressionData.js';
export function defaultProgression(){return {era:'spark',journal:[{at:0,label:'First spark','desc':'The Starforge came online.'}],milestones:{},opportunity:null,opportunityEnds:0,lastOpportunityAt:0,secondsSinceBuy:0};}
export function ensureProgression(s){s.progression??=defaultProgression();s.progression.journal??=[];s.progression.milestones??={};s.progression.opportunity??=null;s.progression.opportunityEnds??=0;s.progression.lastOpportunityAt??=0;s.progression.secondsSinceBuy??=0;return s.progression;}
export function recordProgress(s,label,desc){const p=ensureProgression(s);if(p.journal.some(x=>x.label===label))return false;p.journal.unshift({at:Math.max(0,s.stats.time||0),label,desc});p.journal=p.journal.slice(0,balance.maxJournal);return true;}
export function currentEra(s){
 const galaxies=Object.keys(s.exploration?.regions||{}).length;
 const mega=Object.values(s.megastructures||{}).reduce((a,b)=>a+b,0);
 let era=eras[0];
 for(const candidate of eras){
  const ok=(candidate.minEnergy===undefined||(s.stats.totalEnergy||0)>=candidate.minEnergy)
   &&(candidate.minBuildings===undefined||Object.values(s.buildings).reduce((a,b)=>a+b,0)>=candidate.minBuildings)
   &&(candidate.minResearch===undefined||Object.keys(s.research).length>=candidate.minResearch)
   &&(candidate.minGalaxy===undefined||galaxies>=candidate.minGalaxy)
   &&(candidate.minPrestige===undefined||s.stats.prestiges>=candidate.minPrestige)
   &&(candidate.minAscension===undefined||s.stats.ascensions>=candidate.minAscension)
   &&(candidate.minMega===undefined||mega>=candidate.minMega);
  if(ok)era=candidate;
 }
 return era;
}
export function updateEra(s){const p=ensureProgression(s),next=currentEra(s);if(p.era!==next.id){p.era=next.id;recordProgress(s,next.name,next.desc);return next;}return next;}
export function milestoneLevel(s,id){return Math.max(0,Math.floor(s.buildings?.[id]||0));}
export function buildingMilestone(s,id){const level=milestoneLevel(s,id),data=buildingMilestones[id]||{};return Object.keys(data).map(Number).filter(x=>x<=level).sort((a,b)=>b-a).map(x=>({...data[x],level:x}))[0]||null;}
export function buildingEffect(s,id){const level=milestoneLevel(s,id),data=buildingMilestones[id]||{},out={production:0};for(const threshold of Object.keys(data).map(Number))if(level>=threshold)for(const [k,v] of Object.entries(data[threshold]))if(k!=='label')out[k]=(out[k]||0)+v;return out;}
export function synergyMultiplier(s,id){const n=milestoneLevel(s,id),levels=x=>milestoneLevel(s,x);let m=1;if(id==='manual')m*=1+levels('solar')*.02;if(id==='solar')m*=1+levels('colony')*.008;if(id==='mining')m*=1+levels('orbital')*.01;if(id==='orbital')m*=1+levels('mining')*.01;if(id==='colony')m*=1+levels('orbital')*.008;if(id==='lab')m*=1+levels('quantum')*.012;if(id==='quantum')m*=1+levels('lab')*.01;if(id==='dyson')m*=1+levels('galactic')*.008;if(id==='galactic')m*=1+levels('dyson')*.01;return m;}
export function prestigeBenefits(s){const count=s.stats.prestiges||0,out={production:0,manual:0,credits:0,solar:0,autobuy:false,rewards:0,keepResearch:null};for(const m of prestigeMilestones)if(count>=m.count)for(const [k,v] of Object.entries(m.effects)){if(k==='production')out.production+=v;else if(k==='rewards')out.rewards+=v;else if(k==='manual'||k==='credits'||k==='solar')out[k]=v;else if(k==='autobuy')out.autobuy=true;else if(k==='research')out.keepResearch=v;}return out;}
export function opportunityStatus(s){const p=ensureProgression(s);if(!p.opportunity||p.opportunityEnds<=Date.now())return null;return opportunities.find(x=>x.id===p.opportunity)||null;}
export function startOpportunity(s,id){const p=ensureProgression(s),o=opportunities.find(x=>x.id===id);if(!o||Date.now()-p.lastOpportunityAt<balance.opportunityCooldown*1000)return false;p.opportunity=id;p.opportunityEnds=Date.now()+o.duration*1000;p.lastOpportunityAt=Date.now();return true;}
export function opportunityMultiplier(s,buildingId){const o=opportunityStatus(s);if(!o)return 1;return o.effect[buildingId]||1;}
export function nextBreakthroughs(s){const list=[];const nextBuilding=buildings.find(b=>(s.buildings[b.id]||0)<1&&Math.max(s.stats.totalEnergy,s.resources.energy)<b.unlock);if(nextBuilding)list.push({label:nextBuilding.name,detail:`Unlock at ${nextBuilding.unlock.toLocaleString('en-US')} lifetime energy`,kind:'BUILDING'});const nextResearch=research.find(r=>!s.research[r.id]&&r.req.every(x=>s.research[x]));if(nextResearch)list.push({label:nextResearch.name,detail:`${nextResearch.cost.toLocaleString('en-US')} research`,kind:'RESEARCH'});if((s.stats.prestiges||0)<1)list.push({label:'First Prestige',detail:'Reach 1,000,000 energy for permanent acceleration',kind:'PRESTIGE'});else if((s.stats.ascensions||0)<1)list.push({label:'First Ascension',detail:'Complete Galactic Infrastructure and earn 100 Prestige Shards',kind:'ASCENSION'});else if(Object.keys(s.civilization?.colonies||{}).length<3)list.push({label:'Galactic Age',detail:'Develop three colonies and begin a megastructure',kind:'CIVILIZATION'});return list.slice(0,3);}
export {eras,buildingMilestones,prestigeMilestones,opportunities};
