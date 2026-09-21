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
];
export const progressionMissions=[
 ...[1000,100000,10000000].map((goal,i)=>({id:'grid-'+i,name:['Fusion grid','Stellar grid','Galactic grid'][i],desc:'Reach '+goal.toLocaleString('en-US')+' energy/s',metric:'output',goal,reward:3+i*3})),
 ...[50,200,500].map((goal,i)=>({id:'builder-'+i,name:'Empire architect '+(i+1),desc:'Own '+goal+' building levels',metric:'buildings',goal,reward:2+i*2})),
 ...[3,6,9].map((goal,i)=>({id:'science-'+i,name:'Scientific frontier '+(i+1),desc:'Complete '+goal+' research nodes',metric:'research',goal,reward:3+i*2})),
 ...regions.slice(2).map((r,i)=>({id:'chart-'+r.id,name:'Chart '+r.name,desc:'Discover '+r.name,metric:r.id,goal:1,reward:2+i})),
 {id:'outposts',name:'Connected colonies',desc:'Build 10 outpost levels',metric:'outposts',goal:10,reward:8}
];
