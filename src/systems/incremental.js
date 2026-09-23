import {megaProjects} from '../data/cosmicData.js';
export const MAX_RESOURCE=1e100;
export function universeScale(s){return Math.pow(2.2,Math.min(80,s.stats.ascensions||0));}
export function ascensionRequirements(s){const scale=universeScale(s);return {shards:Math.ceil(100*scale),energy:Math.ceil(1e7*scale),research:Math.ceil(150000*scale),galaxies:Math.min(250,2+(s.stats.ascensions||0)*2)};}
export function megaBonuses(s){const out={};for(const m of megaProjects){const stage=s.megastructures?.[m.id]||0;for(const [key,value] of Object.entries(m.effect))out[key]=(out[key]||0)+stage*value;}return out;}
export function buildMega(s,id){const m=megaProjects.find(x=>x.id===id),stage=s.megastructures?.[id]||0;if(!m||stage>=m.stages||s.stats.ascensions<1)return false;const scale=Math.pow(3,stage)*universeScale(s);if(Object.entries(m.cost).some(([key,value])=>(s.resources[key]||0)<value*scale))return false;for(const [key,value] of Object.entries(m.cost))s.resources[key]-=value*scale;s.megastructures[id]=stage+1;return true;}
export const challengeTypes=[
 {id:'drought',name:'Energy Drought',desc:'Energy output is halved. Generate 1 million run Energy.',goal:1e6,effect:{energy:.5},reward:{production:.1}},
 {id:'compression',name:'Industrial Compression',desc:'Buildings cost twice as much. Own 100 building levels.',goal:100,effect:{cost:2},reward:{production:.12}},
 {id:'darkness',name:'Dark Universe',desc:'Energy output is reduced to one quarter. Generate 500 Dark Energy.',goal:500,effect:{energy:.25},reward:{darkEnergy:.2}}
];
export function challengeProgress(s){const active=challengeTypes.find(c=>c.id===s.challenge?.active);if(!active)return 0;return active.id==='compression'?Object.values(s.buildings).reduce((a,b)=>a+b,0):active.id==='darkness'?s.resources.darkEnergy||0:s.stats.totalEnergy-(s.challenge?.startEnergy||0);}
export function startChallenge(s,id){if(s.stats.ascensions<1||s.challenge?.active||s.challenge?.completed?.[id]||!challengeTypes.some(c=>c.id===id))return false;s.challenge.active=id;s.challenge.startEnergy=s.stats.totalEnergy;return true;}
export function endChallenge(s,complete=false){const active=challengeTypes.find(c=>c.id===s.challenge?.active);if(!active)return false;if(complete){if(challengeProgress(s)<active.goal)return false;s.challenge.completed[active.id]=true;}s.challenge.active=null;s.challenge.startEnergy=0;return true;}
export function challengeBonuses(s){const out={};for(const c of challengeTypes)if(s.challenge?.completed?.[c.id])for(const [key,value] of Object.entries(c.reward))out[key]=(out[key]||0)+value;return out;}
export function entropyRate(s){if((s.stats.ascensions||0)<3)return 0;const mega=megaBonuses(s),knowledge=Math.max(0,s.resources.knowledge||0);return Math.max(0,.0006*(1+.3*(s.stats.ascensions-3)+.015*Math.max(0,Object.keys(s.exploration.regions).length-1))*(1-(mega.entropy||0)*.5)/(1+Math.log10(knowledge+1)*.2));}
export function advanceEntropy(s,seconds,{offline=false}={}){if(!Number.isFinite(seconds)||seconds<=0||s.stats.ascensions<3)return false;const current=Math.max(0,s.entropy||0);s.entropy=Math.min(offline?99.9:100,current+entropyRate(s)*seconds);return !offline&&s.entropy>=100;}
