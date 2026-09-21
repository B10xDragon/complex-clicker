import {regions,galaxySkills} from '../data/gameData.js';

export const navigationReady=s=>!!(s.research.exploration||s.upgrades.explorer);
export const discoveryBonus=s=>(Object.keys(s.exploration.regions).length-1)*.05;
export const skillLevel=(s,id)=>Math.max(0,Math.floor(s.exploration.skills?.[id]||0));
export function skillCost(s,id){const node=galaxySkills.find(n=>n.id===id),level=skillLevel(s,id);return node?Math.ceil(node.cost*Math.pow(1.55,level)):Infinity;}
export function skillStatus(s,id){const node=galaxySkills.find(n=>n.id===id);if(!node)return {ok:false,label:'Unknown skill',level:0,cost:Infinity};const level=skillLevel(s,id);if(level>=node.max)return {ok:false,label:'MASTERED',level,cost:0};if(node.req.some(req=>skillLevel(s,req)<1))return {ok:false,label:'Requires '+node.req.join(', '),level,cost:skillCost(s,id)};const cost=skillCost(s,id);return {ok:s.resources.knowledge>=cost,label:s.resources.knowledge>=cost?'UPGRADE':'NEEDS KNOWLEDGE',level,cost};}
export function upgradeSkill(s,id){const status=skillStatus(s,id);if(!status.ok)return false;s.resources.knowledge-=status.cost;s.exploration.skills??={};s.exploration.skills[id]=status.level+1;return true;}
export function frontierStatus(s){const level=Math.max(0,Math.floor(s.exploration.frontier||0)),cost=Math.ceil(10*Math.pow(1.22,level));return {level,cost,ok:s.resources.knowledge>=cost,label:'ADVANCE FRONTIER'};}
export function advanceFrontier(s){const status=frontierStatus(s);if(!status.ok)return false;s.resources.knowledge-=status.cost;s.exploration.frontier=status.level+1;return true;}
export function skillBonus(s){const levels=galaxySkills.reduce((sum,n)=>sum+skillLevel(s,n.id),0),archive=skillLevel(s,'asc4');return {levels,production:levels*.003+skillLevel(s,'ind3')*.025+skillLevel(s,'ind4')*.04+Math.max(0,archive)*.005,frontier:Math.max(0,s.exploration.frontier||0)*.01,outpost:skillLevel(s,'nav3')*.02};}
export function discoveryStatus(s,id){
 const r=regions.find(r=>r.id===id);
 if(!r)return {ok:false,label:'Unknown destination'};
 if(s.exploration.regions[id])return {ok:false,label:'Discovered'};
 if(!navigationReady(s))return {ok:false,label:'Research Space Exploration'};
 if(!s.exploration.regions[r.parent])return {ok:false,label:'Discover '+regions.find(x=>x.id===r.parent).name};
 if(r.tech&&!s.research[r.tech])return {ok:false,label:'Research '+r.tech};
 const navigationDiscount=Math.max(.3,1-skillLevel(s,'nav2')*.015);if(s.resources.energy<r.cost*navigationDiscount)return {ok:false,label:'Insufficient energy'};
 return {ok:true,label:'Discover'};
}
export function discover(s,id){
 if(!discoveryStatus(s,id).ok)return false;
 const r=regions.find(r=>r.id===id);
 const navigationDiscount=Math.max(.3,1-skillLevel(s,'nav2')*.015);s.resources.energy-=Math.ceil(r.cost*navigationDiscount);s.exploration.regions[id]=1;
 s.log.unshift('SYSTEM MAPPED — '+r.name+'; +5% production. Outpost available.');
 s.log=s.log.slice(0,50);return true;
}
export function outpostStatus(s,id){
 const r=regions.find(r=>r.id===id),level=s.exploration.outposts?.[id]||0;
 if(!r?.prod||!s.exploration.regions[id])return {ok:false,label:'Discover system first',level,cost:{}};
 const cost={credits:Math.ceil(r.cost*.1*Math.pow(1.8,level)),matter:Math.ceil(25*Math.pow(2,level))};
 const discount=Math.max(.35,1-skillLevel(s,'ind1')*.02);for(const key of Object.keys(cost))cost[key]=Math.ceil(cost[key]*discount);return {level,cost,ok:level<10&&Object.entries(cost).every(([k,v])=>s.resources[k]>=v),label:level>=10?'Maximum level':'Upgrade outpost'};
}
export function upgradeOutpost(s,id){
 const status=outpostStatus(s,id);if(!status.ok)return false;
 for(const [key,value] of Object.entries(status.cost))s.resources[key]-=value;
 s.exploration.outposts??={};s.exploration.outposts[id]=status.level+1;return true;
}
export function outpostProduction(s){
 const result={};
 for(const r of regions)if(s.exploration.regions[r.id])for(const [key,value] of Object.entries(r.prod||{})){
  result[key]=(result[key]||0)+value*(s.exploration.outposts?.[r.id]||0)*(1+(skillLevel(s,'nav3')*.02));
 }
 return result;
}
