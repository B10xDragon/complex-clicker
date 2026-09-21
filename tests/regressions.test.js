import {test} from 'node:test';
import assert from 'node:assert/strict';
import {regions,galaxyTypes} from '../src/data/gameData.js';
import {discoveryStatus,outpostStatus,upgradeOutpost,skillStatus,upgradeSkill,frontierStatus,advanceFrontier,galaxyBoosts} from '../src/systems/exploration.js';
import {fresh,normalize,click,tick,buy,prestige,ascend,missions,claimMission,claimAchievement,discover,convertEnergy,offline,totalProd} from '../src/systems/gameEngine.js';
test('mission reward is paid once and remains claimed after migration',()=>{
 const s=fresh();s.stats.totalEnergy=1200;missions(s);
 assert.equal(claimMission(s,'daily'),true);assert.equal(s.resources.shards,2);
 const restored=normalize(JSON.parse(JSON.stringify(s)));
 assert.equal(claimMission(restored,'daily'),false);
});
test('daily reset starts a new progress counter',()=>{
 const s=fresh();s.dailyDate='2000-01-01';s.stats.totalEnergy=3000;s.claimed.daily=true;
 const daily=missions(s)[1];assert.equal(daily.progress,0);assert.equal(s.claimed.daily,undefined);
});
test('click and idle energy use real output in lifetime totals',()=>{
 const s=fresh(),before=s.resources.energy,r=click(s);assert.equal(s.stats.totalEnergy,r.amount);
 s.buildings.manual=5;tick(s,10);assert.ok(Math.abs(s.stats.totalEnergy-(s.resources.energy-before))<1e-8);
});
test('bulk purchase matches individual costs and blocks invalid purchases',()=>{
 const a=fresh(),b=fresh();a.resources.credits=b.resources.credits=10000;
 assert.equal(buy(a,'manual',10),10);for(let i=0;i<10;i++)buy(b,'manual',1);
 assert.equal(a.resources.credits,b.resources.credits);assert.equal(buy(a,'unknown',1),0);assert.equal(buy(a,'manual',-1),0);assert.equal(buy(a,'galactic',1),0);
});
test('prestige retains lifetime history and technologies',()=>{
 const s=fresh();s.resources.energy=1e6;s.stats.prestiges=2;s.stats.clicks=100;s.research.industrial={value:.1};
 assert.equal(prestige(s),1);assert.equal(s.stats.prestiges,3);assert.equal(s.stats.clicks,100);assert.ok(s.research.industrial);
});
test('galaxy skills and frontier persist through prestige and ascension',()=>{
 const s=fresh();s.resources.energy=1e6;s.resources.knowledge=4;s.exploration.skills.nav1=2;s.exploration.frontier=3;
 assert.ok(prestige(s));assert.equal(s.exploration.skills.nav1,2);assert.equal(s.exploration.frontier,3);
 s.research.galactic={};s.resources.shards=100;assert.ok(ascend(s));assert.equal(s.exploration.skills.nav1,2);assert.equal(s.exploration.frontier,3);
});
test('ascension resets the first layer',()=>{
 const s=fresh();s.research.galactic={};s.resources.shards=100;s.buildings.manual=20;
 assert.ok(ascend(s));assert.equal(s.resources.knowledge,1);assert.equal(s.resources.shards,0);assert.equal(s.buildings.manual,0);
});
test('exploration requires funds and cannot charge twice',()=>{
 const s=fresh();assert.equal(discover(s,'vega'),false);s.research.exploration={};s.resources.energy=1000;
 const before=totalProd(s);assert.ok(discover(s,'vega'));assert.equal(s.resources.energy,0);assert.equal(discover(s,'vega'),false);
});
test('energy sale unlocks credit progression and achievements pay once',()=>{
 const s=fresh();s.resources.energy=105;assert.ok(convertEnergy(s));assert.equal(s.resources.credits,25);assert.equal(s.resources.energy,5);
 s.stats.totalEnergy=1;assert.ok(claimAchievement(s,'a0'));assert.equal(claimAchievement(s,'a0'),false);
});
test('offline production applies boost only for remaining boost duration',()=>{
 const entries=new Map();globalThis.localStorage={getItem:k=>entries.get(k),setItem:(k,v)=>entries.set(k,v)};
 const s=fresh();s.buildings.manual=5;s.boost=10;entries.set('starforge-last',String(Date.now()-100000));
 offline(s);assert.ok(s.resources.energy>=136&&s.resources.energy<137);assert.equal(s.boost,0);
 const before=s.resources.energy;offline(s);assert.equal(s.resources.energy,before);
});
test('all galaxy routes enforce exact costs, prerequisites and single payment',()=>{
 const s=fresh();s.research.exploration={};s.resources.energy=1e40;
 assert.equal(discover(s,'void'),false);assert.equal(discover(s,'unknown'),false);
 for(const r of regions.filter(r=>r.parent)){
  if(r.tech&&!s.research[r.tech]){assert.equal(discover(s,r.id),false);s.research[r.tech]={};}
  const before=s.resources.energy;s.resources.energy=r.cost*.99;
  assert.equal(discoveryStatus(s,r.id).ok,false);assert.equal(discover(s,r.id),false);
  s.resources.energy=before;assert.equal(discover(s,r.id),true);
  assert.equal(s.resources.energy,before-r.cost);assert.equal(discover(s,r.id),false);
 }
 assert.equal(Object.keys(s.exploration.regions).length,regions.length);
});
test('galaxy web contains 250 typed nodes and mapped types grant distinct boosts',()=>{
 const s=fresh();assert.equal(regions.length,250);assert.equal(galaxyTypes.length,12);s.exploration.regions.vega=1;s.exploration.regions.orion=1;
 const boosts=galaxyBoosts(s);assert.ok(boosts.production>0||boosts.research>0||boosts.energy>0);assert.ok(regions.every(r=>r.type));
});
test('galaxy skill branches and uncapped frontier spend knowledge correctly',()=>{
 const s=fresh();s.resources.knowledge=1e6;
 assert.ok(skillStatus(s,'nav1').ok);assert.ok(upgradeSkill(s,'nav1'));assert.equal(s.exploration.skills.nav1,1);
 assert.equal(upgradeSkill(s,'nav3'),false);assert.ok(upgradeSkill(s,'nav2'));assert.equal(skillStatus(s,'nav3').ok,true);
 s.exploration.skills.nav2=1;assert.ok(upgradeSkill(s,'nav3'));
 const before=frontierStatus(s).cost;assert.ok(advanceFrontier(s));assert.equal(s.exploration.frontier,1);assert.ok(frontierStatus(s).cost>before);
 const restored=normalize(JSON.parse(JSON.stringify(s)));assert.equal(restored.exploration.skills.nav3,1);assert.equal(restored.exploration.frontier,1);
});
test('outposts charge scaling costs, produce resources and stop at ten levels',()=>{
 const s=fresh();s.research.exploration={};s.resources.energy=1000;
 s.resources.credits=1e12;s.resources.matter=1e12;
 assert.equal(upgradeOutpost(s,'vega'),false);discover(s,'vega');
 const first=outpostStatus(s,'vega').cost;
 assert.ok(upgradeOutpost(s,'vega'));assert.equal(s.resources.credits,1e12-first.credits);
 assert.ok(outpostStatus(s,'vega').cost.credits>first.credits);
 assert.equal(totalProd(s).data,.53445);tick(s,10);assert.equal(s.resources.data,5.3445);
 for(let i=1;i<10;i++)assert.ok(upgradeOutpost(s,'vega'));
 assert.equal(upgradeOutpost(s,'vega'),false);
 const restored=normalize(JSON.parse(JSON.stringify(s)));
 assert.equal(restored.exploration.outposts.vega,10);
 restored.resources.energy=1e6;prestige(restored);
 assert.deepEqual(restored.exploration.outposts,{});
});
test('legacy explorer upgrade restores navigation and known discoveries',()=>{
 const s=fresh();delete s.exploration.outposts;s.upgrades.explorer={};
 s.exploration.regions.void=1;
 const restored=normalize(s);assert.ok(restored.exploration.unlocked);
 assert.equal(restored.exploration.regions.void,1);
 assert.deepEqual(restored.exploration.outposts,{});
});
test('new progression missions reward milestones once',()=>{
 const s=fresh();s.buildings.manual=50;
 assert.ok(claimMission(s,'builder-0'));assert.equal(claimMission(s,'builder-0'),false);
 assert.equal(s.resources.shards,2);
});
test('tutorial quests guide the early currency loop and unlock in order',()=>{
 const s=fresh();assert.equal(missions(s)[0].id,'tutorial-1');assert.equal(claimMission(s,'tutorial-1'),false);
 assert.equal(buy(s,'manual',1),1);assert.equal(claimMission(s,'tutorial-1'),true);assert.equal(s.resources.credits,25);
 assert.equal(missions(s)[1].locked,false);s.buildings.manual=5;assert.equal(claimMission(s,'tutorial-2'),true);assert.equal(s.resources.research,25);
 assert.equal(missions(s)[2].locked,false);assert.equal(claimMission(s,'tutorial-2'),false);
});
