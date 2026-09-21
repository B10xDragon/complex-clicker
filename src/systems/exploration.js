import {regions} from '../data/gameData.js';

export const navigationReady=s=>!!(s.research.exploration||s.upgrades.explorer);
export const discoveryBonus=s=>(Object.keys(s.exploration.regions).length-1)*.05;
export function discoveryStatus(s,id){
 const r=regions.find(r=>r.id===id);
 if(!r)return {ok:false,label:'Unknown destination'};
 if(s.exploration.regions[id])return {ok:false,label:'Discovered'};
 if(!navigationReady(s))return {ok:false,label:'Research Space Exploration'};
 if(!s.exploration.regions[r.parent])return {ok:false,label:'Discover '+regions.find(x=>x.id===r.parent).name};
 if(r.tech&&!s.research[r.tech])return {ok:false,label:'Research '+r.tech};
 if(s.resources.energy<r.cost)return {ok:false,label:'Insufficient energy'};
 return {ok:true,label:'Discover'};
}
export function discover(s,id){
 if(!discoveryStatus(s,id).ok)return false;
 const r=regions.find(r=>r.id===id);
 s.resources.energy-=r.cost;s.exploration.regions[id]=1;
 s.log.unshift('SYSTEM MAPPED — '+r.name+'; +5% production. Outpost available.');
 s.log=s.log.slice(0,50);return true;
}
export function outpostStatus(s,id){
 const r=regions.find(r=>r.id===id),level=s.exploration.outposts?.[id]||0;
 if(!r?.prod||!s.exploration.regions[id])return {ok:false,label:'Discover system first',level,cost:{}};
 const cost={credits:Math.ceil(r.cost*.1*Math.pow(1.8,level)),matter:Math.ceil(25*Math.pow(2,level))};
 return {level,cost,ok:level<10&&Object.entries(cost).every(([k,v])=>s.resources[k]>=v),label:level>=10?'Maximum level':'Upgrade outpost'};
}
export function upgradeOutpost(s,id){
 const status=outpostStatus(s,id);if(!status.ok)return false;
 for(const [key,value] of Object.entries(status.cost))s.resources[key]-=value;
 s.exploration.outposts??={};s.exploration.outposts[id]=status.level+1;return true;
}
export function outpostProduction(s){
 const result={};
 for(const r of regions)if(s.exploration.regions[r.id])for(const [key,value] of Object.entries(r.prod||{})){
  result[key]=(result[key]||0)+value*(s.exploration.outposts?.[r.id]||0);
 }
 return result;
}
