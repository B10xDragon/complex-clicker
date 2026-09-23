import {test} from 'node:test';
import assert from 'node:assert/strict';
import {regions,galaxyTypes,buildings} from '../src/data/gameData.js';
import {discoveryStatus,outpostStatus,upgradeOutpost,skillStatus,upgradeSkill,frontierStatus,advanceFrontier,galaxyBoosts} from '../src/systems/exploration.js';
import {fresh,normalize,click,tick,buy,buyUpgrade,prestige,ascend,missions,claimMission,claimAchievement,discover,convertEnergy,offline,totalProd,cost} from '../src/systems/gameEngine.js';
import {starterCosmicNodes,cosmicNodes} from '../src/systems/cosmicEngine.js';
import {chooseStarter,buyCosmic,cosmicStatus} from '../src/systems/cosmicEngine.js';
import {buildMega,megaBonuses,startChallenge,endChallenge,challengeProgress,advanceEntropy,ascensionRequirements,universeScale} from '../src/systems/incremental.js';
import {currentEra,nextBreakthroughs,buildingMilestone,prestigeBenefits,startOpportunity,opportunityStatus} from '../src/systems/progression.js';
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
test('clicking upgrades building scales like a normal infrastructure building',()=>{
 const s=fresh();s.resources.credits=1000;assert.equal(buy(s,'clicking',3),3);assert.equal(s.buildings.clicking,3);
 const result=click(s);assert.ok(result.amount>=4);assert.ok(buy(s,'clicking',1)>=0);assert.ok(cost(buildings.find(b=>b.id==='clicking'),s.buildings.clicking)>100);
});
test('prestige retains lifetime history and technologies',()=>{
 const s=fresh();s.resources.energy=1e6;s.stats.prestiges=2;s.stats.clicks=100;s.research.industrial={value:.1};
 assert.equal(prestige(s),1);assert.equal(s.stats.prestiges,3);assert.equal(s.stats.clicks,100);assert.ok(s.research.industrial);
});
test('galaxy skills and frontier persist through prestige and ascension',()=>{
 const s=fresh();s.resources.energy=1e6;s.resources.knowledge=4;s.exploration.skills.nav1=2;s.exploration.frontier=3;
 assert.ok(prestige(s));assert.equal(s.exploration.skills.nav1,2);assert.equal(s.exploration.frontier,3);
 s.research.galactic={};s.resources.shards=100;s.resources.energy=1e8;s.resources.research=2e5;s.exploration.regions.vega=1;assert.ok(ascend(s));assert.equal(s.exploration.skills.nav1,2);assert.equal(s.exploration.frontier,3);
});
test('ascension resets the first layer',()=>{
 const s=fresh();s.research.galactic={};s.resources.shards=100;s.resources.energy=1e8;s.resources.research=2e5;s.exploration.regions.vega=1;s.buildings.manual=20;
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
 assert.equal(missions(s).find(m=>m.id==='tutorial-2').locked,false);s.buildings.manual=5;assert.equal(claimMission(s,'tutorial-2'),true);assert.equal(s.resources.research,25);
 assert.equal(missions(s).find(m=>m.id==='tutorial-3').locked,false);assert.equal(claimMission(s,'tutorial-2'),false);
});
test('first ascension unlocks exactly one starter cosmic choice',()=>{
 const s=fresh();s.research.galactic={};s.resources.shards=100;s.resources.energy=1e8;s.resources.research=2e5;s.exploration.regions.vega=1;assert.ok(ascend(s));
 assert.equal(s.stats.ascensions,1);assert.equal(s.resources.knowledge,1);assert.equal(starterCosmicNodes.length,5);
 assert.ok(chooseStarter(s,starterCosmicNodes[0].id));assert.equal(Object.keys(s.cosmic.purchased).length,1);
 assert.equal(chooseStarter(s,starterCosmicNodes[1].id),false);assert.equal(buyCosmic(s,starterCosmicNodes[1].id),false);
 assert.equal(cosmicStatus(s,cosmicNodes.find(n=>n.branch===starterCosmicNodes[0].branch&&n.tier===1).id).ok,false);
});
test('old saves migrate cosmic and megastructures without losing progress',()=>{
 const old=fresh();old.resources.energy=98765;old.stats.clicks=42;delete old.cosmic;old.civilization={megastructures:{'planetary-computer':2}};
 const restored=normalize(JSON.parse(JSON.stringify(old)));assert.equal(restored.resources.energy,98765);assert.equal(restored.stats.clicks,42);assert.ok(restored.cosmic);assert.equal(restored.megastructures['planetary-computer'],2);assert.equal(restored.civilization,undefined);
});
test('multi-stage megastructures scale costs and preserve stage progress',()=>{
 const s=fresh();s.stats.ascensions=1;s.resources.energy=1e20;s.resources.research=1e20;s.resources.matter=1e20;
 assert.ok(buildMega(s,'planetary-computer'));assert.equal(s.megastructures['planetary-computer'],1);assert.ok(buildMega(s,'planetary-computer'));assert.equal(s.megastructures['planetary-computer'],2);assert.ok(buildMega(s,'planetary-computer'));assert.equal(s.megastructures['planetary-computer'],3);assert.equal(buildMega(s,'planetary-computer'),false);assert.ok(megaBonuses(s).research>0);
});
test('progression defaults migrate and eras expose the next meaningful goals',()=>{
 const s=fresh();delete s.progression;const restored=normalize(JSON.parse(JSON.stringify(s)));
 assert.ok(restored.progression);assert.equal(currentEra(restored).id,'spark');
 assert.ok(nextBreakthroughs(restored).length>0);assert.equal(restored.progression.journal[0].label,'First spark');
});
test('building milestones and synergies activate without invalid production',()=>{
 const s=fresh();s.buildings.manual=10;s.buildings.solar=25;
 assert.equal(buildingMilestone(s,'manual').level,10);assert.ok(totalProd(s).energy>0);
 tick(s,3600);for(const value of Object.values(s.resources))assert.ok(Number.isFinite(value)&&value>=0);
});
test('prestige milestones and optional opportunities are deterministic',()=>{
 const s=fresh();s.stats.prestiges=2;assert.equal(prestigeBenefits(s).manual,2);assert.equal(prestigeBenefits(s).credits,100);
 assert.ok(startOpportunity(s,'solar-surge'));assert.equal(opportunityStatus(s).id,'solar-surge');assert.equal(startOpportunity(s,'research-window'),false);
});
test('clicking upgrades form a gated energy-per-click progression',()=>{
 const s=fresh();s.resources.energy=1e6;s.resources.credits=1e6;s.resources.research=1e6;s.resources.data=1e6;
 assert.equal(buyUpgrade(s,'click-amplifier'),false);
 assert.ok(buyUpgrade(s,'capacitors'));assert.ok(buyUpgrade(s,'core-relay-network'));assert.ok(buyUpgrade(s,'click-amplifier'));assert.ok(buyUpgrade(s,'click-lens'));assert.ok(buyUpgrade(s,'stellar-pulse'));
 const result=click(s);assert.ok(result.amount>20);assert.equal(buyUpgrade(s,'click-lens'),false);
});
test('late clicking upgrades remain gated and add substantial direct output',()=>{
 const s=fresh();Object.assign(s.resources,{energy:1e12,credits:1e12,research:1e9,data:1e9,quantumCores:1e5,darkEnergy:1e5});
 assert.equal(buyUpgrade(s,'quantum-tap'),false);for(const id of ['capacitors','click-amplifier','click-lens','stellar-pulse'])assert.ok(buyUpgrade(s,id));
 assert.ok(buyUpgrade(s,'quantum-tap'));assert.ok(buyUpgrade(s,'infinite-loop'));assert.ok(buyUpgrade(s,'singularity-touch'));assert.ok(click(s).amount>1000);
});
test('the generated galaxy web exposes multiple affordable starter choices',()=>{
 const s=fresh();s.research.exploration={};s.resources.energy=1e5;
 const choices=regions.filter(r=>r.parent==='home'&&!s.exploration.regions[r.id]);assert.ok(choices.length>=4);assert.ok(choices.every(r=>r.cost<=1e5));assert.ok(choices.every(r=>r.type&&galaxyTypes.some(t=>t.id===r.type)));
});
test('ascension scales requirements and permanent click bonuses survive prestige',()=>{
 const s=fresh();s.stats.ascensions=1;s.cosmic.purchased['cosmic-warfare-0']=1;s.cosmic.firstChoice='cosmic-warfare-0';
 assert.ok(ascensionRequirements(s).energy>ascensionRequirements(fresh()).energy);
 assert.ok(click(s).amount>1);s.resources.energy=1e6;assert.ok(prestige(s));assert.equal(s.cosmic.purchased['cosmic-warfare-0'],1);
 assert.ok(cost(buildings.find(b=>b.id==='manual'),0,s)>cost(buildings.find(b=>b.id==='manual'),0,fresh()));
});
test('optional challenges have meaningful modifiers and permanent rewards',()=>{
 const s=fresh();s.stats.ascensions=1;s.buildings.manual=1;
 assert.ok(startChallenge(s,'drought'));assert.equal(startChallenge(s,'compression'),false);
 const reduced=totalProd(s).energy;s.challenge.active=null;assert.ok(totalProd(s).energy>reduced);
 s.challenge.active='drought';s.stats.totalEnergy=s.challenge.startEnergy+1e6;
 assert.ok(challengeProgress(s)>=1e6);assert.ok(endChallenge(s,true));assert.ok(totalProd(s).energy>reduced);
 const restored=normalize(JSON.parse(JSON.stringify(s)));assert.equal(restored.challenge.completed.drought,true);
});
test('entropy is gated by Ascension III and offline progress never collapses',()=>{
 const s=fresh();assert.equal(advanceEntropy(s,1e9),false);s.stats.ascensions=3;
 assert.equal(advanceEntropy(s,1e9,{offline:true}),false);assert.ok(s.entropy<100);
 assert.equal(advanceEntropy(s,1e9),true);
});
