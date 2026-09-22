export const resources=[
 {id:'energy',name:'Energy',icon:'ϟ',tone:'cyan',desc:'The basic currency of the empire.'},{id:'credits',name:'Credits',icon:'₡',tone:'gold',desc:'Used to construct and upgrade buildings.'},{id:'research',name:'Research',icon:'⌬',tone:'violet',desc:'Unlocks technologies and permanent systems.'},{id:'data',name:'Data',icon:'◈',tone:'blue',desc:'Feeds automation and artificial intelligence.'},{id:'matter',name:'Matter',icon:'◆',tone:'orange',desc:'Raw material for advanced construction.'},{id:'antimatter',name:'Antimatter',icon:'◉',tone:'pink',desc:'High-density fuel for late-game systems.'},{id:'darkEnergy',name:'Dark energy',icon:'◌',tone:'purple',desc:'Distorts production and prestige calculations.'},{id:'quantumCores',name:'Quantum cores',icon:'⟁',tone:'green',desc:'Advanced computation and exploration fuel.'},{id:'shards',name:'Prestige shards',icon:'✦',tone:'shard',desc:'Permanent power from transcending your empire.'},{id:'knowledge',name:'Cosmic knowledge',icon:'✧',tone:'knowledge',desc:'Meta-progression from the second prestige layer.'}
];
export const buildings=[
 {id:'manual',name:'Manual Generator',tag:'MK-I',base:15,scale:1.14,prod:{energy:0.2,credits:0.05},unlock:0,desc:'A compact hand-tuned induction coil.'},
 {id:'solar',name:'Solar Array',tag:'ORBITAL',base:80,scale:1.15,prod:{energy:2.2,credits:0.2},unlock:50,desc:'Collects stellar photons across a wide orbital plane.',bonus:'Solar arrays amplify manual generators by 2% per level.'},
 {id:'mining',name:'Mining Drones',tag:'EXTRACTION',base:300,scale:1.16,prod:{matter:0.35,credits:0.2},unlock:250,desc:'Autonomous drones harvest asteroid belts.'},
 {id:'fusion',name:'Fusion Reactor',tag:'CORE',base:1200,scale:1.17,prod:{energy:28},unlock:1000,desc:'Turns matter into stable high-yield energy.',bonus:'Every 10 levels grants +5% total production.'},
 {id:'lab',name:'Research Laboratory',tag:'SCIENCE',base:4000,scale:1.18,prod:{research:1.5,data:0.5},unlock:4000,desc:'Converts energy into breakthrough research.'},
 {id:'orbital',name:'Orbital Factory',tag:'MANUFACTURE',base:15000,scale:1.19,prod:{credits:18,matter:1.2},unlock:15000,desc:'Assembles machines in microgravity.'},
 {id:'colony',name:'Planetary Colony',tag:'CIVILIZATION',base:240000,scale:1.26,prod:{credits:75,data:3},unlock:70000,desc:'A self-sufficient civilization across a new world.'},
 {id:'dyson',name:'Dyson Segment',tag:'MEGASTRUCTURE',base:1500000,scale:1.28,prod:{energy:1400,darkEnergy:0.08},unlock:400000,desc:'One shining piece of a stellar-scale machine.'},
 {id:'quantum',name:'Quantum Computer',tag:'COMPUTE',base:12000000,scale:1.3,prod:{research:85,quantumCores:0.03},unlock:2500000,desc:'Computes possibilities faster than reality.'},
 {id:'wormhole',name:'Wormhole Extractor',tag:'SPACETIME',base:1e8,scale:1.33,prod:{antimatter:0.25,darkEnergy:1},unlock:2e7,desc:'Harvests energy from a controlled shortcut through spacetime.'},
 {id:'dark',name:'Dark-energy Reactor',tag:'EXOTIC',base:8e8,scale:1.36,prod:{darkEnergy:9,antimatter:1.2},unlock:2e8,desc:'A reactor that bends the rules of production.'},
 {id:'galactic',name:'Galactic Power Station',tag:'GALACTIC',base:8e9,scale:1.4,prod:{energy:1e5,credits:2500,knowledge:0.2},unlock:2e9,desc:'A networked power station spanning an entire galaxy.'}
];
export const upgrades=[
 {id:'capacitors',cat:'Clicking',name:'High-density Capacitors',cost:{energy:80},desc:'+1 energy per click.',effect:'clickFlat',value:1}, {id:'precision',cat:'Critical',name:'Precision Actuators',cost:{energy:500,credits:100},desc:'Critical clicks deal 3× instead of 2×.',effect:'critMult',value:1}, {id:'rhythm',cat:'Clicking',name:'Resonant Rhythm',cost:{research:120},desc:'Combo decay is 35% slower.',effect:'combo',value:.35}, {id:'reactors',cat:'Production',name:'Reactor Lattices',cost:{energy:5000,research:500},desc:'+25% all production.',effect:'prod',value:.25}, {id:'conversion',cat:'Conversion',name:'Matter Transmutation',cost:{research:1800,matter:400},desc:'Unlocks the conversion console.',effect:'conversion',value:1}, {id:'offline',cat:'Offline',name:'Chrono Batteries',cost:{research:2500,data:500},desc:'Offline progress cap becomes 12 hours.',effect:'offline',value:6}, {id:'ai',cat:'Automation',name:'Predictive AI',cost:{data:5000,quantumCores:2},desc:'Unlocks autonomous production policies.',effect:'automation',value:1}, {id:'explorer',cat:'Exploration',name:'Deep-space Navigation',cost:{research:10000,antimatter:20},desc:'Unlocks the galaxy map and missions.',effect:'explore',value:1}, {id:'singularity',cat:'Prestige',name:'Singularity Protocol',cost:{shards:15,knowledge:1},desc:'+100% production after prestige.',effect:'prestige',value:1}
];
upgrades.push(
 {id:'click-amplifier',cat:'Clicking',name:'Pulse Amplifier',cost:{energy:250,credits:50},desc:'+2 energy per click. Requires High-density Capacitors.',effect:'clickFlat',value:2,req:['capacitors']},
 {id:'click-lens',cat:'Clicking',name:'Resonance Lens',cost:{energy:2000,research:150},desc:'+5 energy per click. Requires Pulse Amplifier.',effect:'clickFlat',value:5,req:['click-amplifier']},
 {id:'stellar-pulse',cat:'Clicking',name:'Stellar Pulse',cost:{energy:25000,research:1000,data:300},desc:'+20 energy per click. Requires Resonance Lens.',effect:'clickFlat',value:20,req:['click-lens']}
);
export const research=[
 {id:'industrial',name:'Industrial Engineering',cost:200,req:[],x:8,y:18,effect:'prod',desc:'+10% production.'},{id:'automation',name:'Automation',cost:800,req:['industrial'],x:28,y:10,effect:'auto',desc:'Unlock production managers.'},{id:'ai',name:'Artificial Intelligence',cost:3000,req:['automation'],x:50,y:18,effect:'data',desc:'Labs produce 50% more data.'},{id:'quantum',name:'Quantum Physics',cost:12000,req:['ai'],x:73,y:10,effect:'quantum',desc:'Unlock quantum core production.'},{id:'exploration',name:'Space Exploration',cost:3000,req:['industrial'],x:28,y:45,effect:'explore',desc:'Unlock the galaxy map.'},{id:'efficiency',name:'Energy Efficiency',cost:10000,req:['exploration'],x:50,y:45,effect:'prod',desc:'+20% production.'},{id:'time',name:'Time Manipulation',cost:50000,req:['efficiency'],x:73,y:45,effect:'offline',desc:'Offline progress cap +12h.'},{id:'matter',name:'Matter Conversion',cost:25000,req:['quantum'],x:50,y:78,effect:'matter',desc:'Unlock resource conversion.'},{id:'galactic',name:'Galactic Infrastructure',cost:150000,req:['time','matter'],x:78,y:78,effect:'galactic',desc:'Unlock second prestige layer.'}
];
const achievementTracks=[
 ['First Spark','energy',1],['Hundred Pulses','clicks',100],['Combo Pilot','combo',20],['Orbital Dreamer','solar',1],['Matter Made','matter',1000],['Researcher','research',3],['Colony Founder','colony',1],['Dyson Architect','dyson',10],['Quantum Leap','quantum',1],['Galactic Mind','energy',1e9]
];
export const achievements=Array.from({length:30},(_,i)=>{
 const [name,type,base]=achievementTracks[i%10],tier=Math.floor(i/10),goal=base*(tier+1);
 return {id:'a'+i,name:name+(tier?' '+(tier+1):''),type,goal,desc:'Reach '+goal.toLocaleString('en-US')+' '+({energy:'lifetime energy',clicks:'total clicks',combo:'best combo',matter:'stored matter',research:'completed research nodes'}[type]||type+' building levels'),reward:1+i%4};
});
export const regions=[
 {id:'home',name:'Sol System',x:15,y:20,cost:0,desc:'The birthplace of the empire.'},
 {id:'vega',name:'Vega Relay',x:38,y:20,parent:'home',cost:1000,prod:{data:.5},desc:'Signal collectors provide data for advanced systems.'},
 {id:'orion',name:'Orion Forge',x:62,y:20,parent:'vega',cost:100000,prod:{matter:3},desc:'Ancient foundries supply industrial matter.'},
 {id:'void',name:'The Silent Void',x:85,y:20,parent:'orion',cost:10000000,prod:{darkEnergy:.2},desc:'Stabilized anomalies supply dark energy.'},
 {id:'sirius',name:'Sirius Archive',x:15,y:65,parent:'vega',cost:1000000,prod:{research:12},desc:'Stellar archives accelerate research.'},
 {id:'rigel',name:'Rigel Nexus',x:38,y:65,parent:'sirius',cost:50000000,tech:'quantum',prod:{quantumCores:.05},desc:'Quantum relays manufacture computation cores.'},
 {id:'andromeda',name:'Andromeda Gate',x:62,y:65,parent:'rigel',cost:500000000,tech:'matter',prod:{antimatter:1},desc:'Intergalactic collectors refine antimatter.'},
 {id:'horizon',name:'Event Horizon',x:85,y:65,parent:'andromeda',cost:5000000000,tech:'galactic',prod:{knowledge:.005},desc:'A cosmic observatory slowly generates knowledge.'}
 ,{id:'tarsis',name:'Tarsis Spiral',x:12,y:25,parent:'horizon',galaxy:'triangulum',cost:25000000000,prod:{research:80},desc:'A spiral observatory that maps parallel stellar histories.'}
 ,{id:'lyra',name:'Lyra Bloom',x:37,y:25,parent:'tarsis',galaxy:'triangulum',cost:150000000000,prod:{data:30},desc:'A living nebula that turns starlight into data.'}
 ,{id:'kepler',name:'Kepler Foundry',x:62,y:25,parent:'lyra',galaxy:'triangulum',cost:1000000000000,tech:'quantum',prod:{matter:250},desc:'A planet-sized fabrication lattice.'}
 ,{id:'helix',name:'Helix Crown',x:87,y:25,parent:'kepler',galaxy:'triangulum',cost:10000000000000,tech:'galactic',prod:{darkEnergy:18},desc:'A rotating crown around a silent supermassive star.'}
 ,{id:'aether',name:'Aether Basin',x:12,y:72,parent:'helix',galaxy:'perseus',cost:1e14,prod:{credits:12000},desc:'A cloud of programmable matter used for construction.'}
 ,{id:'carina',name:'Carina Array',x:37,y:72,parent:'aether',galaxy:'perseus',cost:1e15,prod:{energy:500000},desc:'A light-harvesting array spanning a stellar nursery.'}
 ,{id:'phoenix',name:'Phoenix Vault',x:62,y:72,parent:'carina',galaxy:'perseus',cost:1e16,tech:'matter',prod:{antimatter:80},desc:'A stable vault containing reversed stellar fuel.'}
 ,{id:'atlas',name:'Atlas Engine',x:87,y:72,parent:'phoenix',galaxy:'perseus',cost:1e17,tech:'galactic',prod:{quantumCores:8},desc:'The engine that holds a galaxy web in alignment.'}
 ,{id:'umbra',name:'Umbra Field',x:12,y:48,parent:'atlas',galaxy:'deepfield',cost:1e18,prod:{darkEnergy:300},desc:'A field beyond ordinary light.'}
 ,{id:'zenith',name:'Zenith Observatory',x:37,y:48,parent:'umbra',galaxy:'deepfield',cost:1e19,prod:{research:10000},desc:'A telescope aimed outside the known simulation.'}
 ,{id:'origin',name:'Origin Engine',x:62,y:48,parent:'zenith',galaxy:'deepfield',cost:1e20,tech:'quantum',prod:{knowledge:1},desc:'A machine that reconstructs the first moments of a universe.'}
 ,{id:'infinity',name:'Infinity Gate',x:87,y:48,parent:'origin',galaxy:'deepfield',cost:1e21,tech:'galactic',prod:{energy:1e9,knowledge:.1},desc:'The final visible gate into an endlessly expanding frontier.'}
];
export const galaxyTypes=[
 {id:'forge',name:'Forge Galaxy',desc:'Industrial stars amplify matter and credits.',boost:{production:.018},prod:{matter:2,credits:40}},
 {id:'archive',name:'Archive Galaxy',desc:'Ancient libraries accelerate research and data.',boost:{research:.04},prod:{research:8,data:4}},
 {id:'reactor',name:'Reactor Galaxy',desc:'Dense suns produce a direct energy surge.',boost:{energy:.035},prod:{energy:150}},
 {id:'quantum',name:'Quantum Galaxy',desc:'Probability engines generate quantum cores.',boost:{production:.012},prod:{quantumCores:.04}},
 {id:'antimatter',name:'Antimatter Galaxy',desc:'Reversed stars refine high-density fuel.',boost:{production:.02},prod:{antimatter:.5}},
 {id:'dark',name:'Dark Galaxy',desc:'Gravity wells bend dark-energy flows.',boost:{production:.025},prod:{darkEnergy:2}},
 {id:'colony',name:'Colony Galaxy',desc:'Many worlds increase credit efficiency.',boost:{credits:.05},prod:{credits:160,data:5}},
 {id:'dyson',name:'Dyson Galaxy',desc:'Megastructures gather power from every star.',boost:{energy:.06},prod:{energy:500}},
 {id:'wormhole',name:'Wormhole Galaxy',desc:'Shortcuts make every connected outpost stronger.',boost:{outpost:.06},prod:{energy:300,matter:8}},
 {id:'knowledge',name:'Knowledge Galaxy',desc:'Cosmic observatories produce knowledge.',boost:{knowledge:.08},prod:{knowledge:.02}},
 {id:'mirror',name:'Mirror Galaxy',desc:'Reflective universes multiply every production path.',boost:{production:.05},prod:{energy:1000,credits:300}},
 {id:'origin',name:'Origin Galaxy',desc:'A rare origin point improves all galaxy bonuses.',boost:{production:.09},prod:{research:100,data:40}}
];
for(const [i,r] of regions.entries()){r.type=r.type||galaxyTypes[i%galaxyTypes.length].id;r.mapX=r.mapX??(1200+(r.x-50)*5);r.mapY=r.mapY??(1200+(r.y-50)*5);}
const generatedGalaxies=Array.from({length:250-regions.length},(_,i)=>{const number=i+1,type=galaxyTypes[i%galaxyTypes.length],ring=Math.floor(i/10),angle=(i*137.508)*Math.PI/180,parent=i<12?['horizon','void','andromeda','atlas','sirius','rigel','orion','tarsis','lyra','kepler','helix','infinity'][i]:`g${String(1+Math.floor((i-12)*.82)).padStart(3,'0')}`;return {id:`g${String(number).padStart(3,'0')}`,name:`${type.name} ${String(number).padStart(3,'0')}`,parent,galaxy:ring<8?'triangulum':ring<16?'perseus':'deepfield',type:type.id,cost:Math.ceil(2e21*Math.pow(1.075,i)),prod:type.prod,mapX:1200+Math.cos(angle)*(180+ring*82),mapY:1200+Math.sin(angle)*(180+ring*82),desc:type.desc};});
regions.push(...generatedGalaxies);
export const tutorialMissions=[
 {id:'tutorial-1',name:'Restart the core',desc:'Build 1 Manual Generator',metric:'manual',goal:1,reward:{credits:25,energy:50},tip:'Open Infrastructure and build the highlighted starter generator.'},
 {id:'tutorial-2',name:'Stable output',desc:'Reach 1 energy/s',metric:'output',goal:1,reward:{credits:50,research:25},tip:'Buy more Manual Generators, then wait for production to accumulate.'},
 {id:'tutorial-3',name:'Catch the sun',desc:'Build 1 Solar Array',metric:'solar',goal:1,reward:{credits:150,research:75},tip:'Solar Arrays require 50 lifetime energy and amplify your manual network.'},
 {id:'tutorial-4',name:'Orbital grid',desc:'Reach 50 energy/s',metric:'output',goal:50,reward:{research:200,shards:1},tip:'Mix solar arrays with manual generators until the grid is self-sustaining.'},
 {id:'tutorial-5',name:'First theory',desc:'Complete Industrial Engineering',metric:'industrial',goal:1,reward:{research:500,credits:500},tip:'Spend research in the Research lattice to unlock production bonuses.'},
 {id:'tutorial-6',name:'Leave Sol',desc:'Discover Vega Relay',metric:'vega',goal:1,reward:{energy:1000,shards:2},tip:'Space Exploration reveals the first connected galaxy.'}
];
export const progressionMissions=[
 ...[1000,100000,10000000].map((goal,i)=>({id:'grid-'+i,name:['Fusion grid','Stellar grid','Galactic grid'][i],desc:'Reach '+goal.toLocaleString('en-US')+' energy/s',metric:'output',goal,reward:3+i*3})),
 ...[50,200,500].map((goal,i)=>({id:'builder-'+i,name:'Empire architect '+(i+1),desc:'Own '+goal+' building levels',metric:'buildings',goal,reward:2+i*2})),
 ...[3,6,9].map((goal,i)=>({id:'science-'+i,name:'Scientific frontier '+(i+1),desc:'Complete '+goal+' research nodes',metric:'research',goal,reward:3+i*2})),
 ...regions.slice(2).map((r,i)=>({id:'chart-'+r.id,name:'Chart '+r.name,desc:'Discover '+r.name,metric:r.id,goal:1,reward:2+i})),
 {id:'outposts',name:'Connected colonies',desc:'Build 10 outpost levels',metric:'outposts',goal:10,reward:8}
];
export const galaxies=[
 {id:'local',name:'Local Group',tone:'cyan',desc:'The first web of connected systems.',regions:['home','vega','orion','void','sirius','rigel','andromeda','horizon']},
 {id:'triangulum',name:'Triangulum Reach',tone:'violet',desc:'A spiral of unstable research worlds.',regions:['tarsis','lyra','kepler','helix']},
 {id:'perseus',name:'Perseus Veil',tone:'orange',desc:'Ancient industrial galaxies hidden behind a dust wall.',regions:['aether','carina','phoenix','atlas']},
 {id:'deepfield',name:'Deep Field',tone:'pink',desc:'The edge of the observable network.',regions:['umbra','zenith','origin','infinity']}
];
export const galaxySkills=[
 {id:'nav1',tree:'Navigation',name:'Stellar Cartography',cost:5,req:[],max:25,value:.01,desc:'+1% production per level from mapped systems.'},
 {id:'nav2',tree:'Navigation',name:'Wormhole Geometry',cost:12,req:['nav1'],max:25,value:.015,desc:'Reduces every discovery energy cost by 1.5% per level.'},
 {id:'nav3',tree:'Navigation',name:'Survey Fleet',cost:25,req:['nav2'],max:25,value:.02,desc:'Outposts produce 2% more per level.'},
 {id:'nav4',tree:'Navigation',name:'Horizon Scanner',cost:50,req:['nav3'],max:25,value:.03,desc:'Unlocks the next frontier of the galaxy web.'},
 {id:'ind1',tree:'Industry',name:'Outpost Logistics',cost:5,req:[],max:25,value:.02,desc:'Outpost upgrade costs fall by 2% per level.'},
 {id:'ind2',tree:'Industry',name:'Distributed Fabrication',cost:12,req:['ind1'],max:25,value:.015,desc:'+1.5% credits and matter production per level.'},
 {id:'ind3',tree:'Industry',name:'Star Foundries',cost:25,req:['ind2'],max:25,value:.025,desc:'+2.5% total production per level.'},
 {id:'ind4',tree:'Industry',name:'Megastructure Loop',cost:50,req:['ind3'],max:25,value:.04,desc:'Frontier mastery gives 4% more production per level.'},
 {id:'asc1',tree:'Ascension',name:'Memory Lattice',cost:8,req:[],max:25,value:.01,desc:'+1% cosmic knowledge production per level.'},
 {id:'asc2',tree:'Ascension',name:'Shard Resonance',cost:16,req:['asc1'],max:25,value:.02,desc:'Prestige shard multiplier grows 2% per level.'},
 {id:'asc3',tree:'Ascension',name:'Recursive Reality',cost:32,req:['asc2'],max:25,value:.03,desc:'Offline progress gains 3% per level.'},
 {id:'asc4',tree:'Ascension',name:'Infinite Archive',cost:64,req:['asc3'],max:25,value:.05,desc:'Every skill level improves all other skill effects by 5%.'}
];
