export const cosmicBranches=[
 {id:'expansion',name:'Expansion',tone:'cyan',desc:'Discover galaxies and strengthen mapped space.'},
 {id:'industry',name:'Industry',tone:'orange',desc:'Evolve factories and megastructures.'},
 {id:'science',name:'Science',tone:'violet',desc:'Amplify research, data and quantum systems.'},
 {id:'civilization',name:'Automation',tone:'gold',desc:'Optimize idle production and offline progress.'},
 {id:'warfare',name:'Energy',tone:'red',desc:'Power clicks and reactors across the universe.'},
 {id:'transcendence',name:'Transcendence',tone:'pink',desc:'Bend reality after repeated Ascensions.'}
];
// Historical IDs remain stable so previously purchased nodes gain new incremental effects.
const tracks={expansion:['Frontier Charter','Survey Relay','Deep Cartography','Wormhole Compass','Uncharted Signal'],industry:['Industrial Awakening','Forge Lattice','Matter Routing','Dyson Weave','Recursive Factory'],science:['Scientific Awakening','Data Telescope','Quantum Theorem','Research Cascade','Archive Engine'],civilization:['Automatic Awakening','Idle Circuit','Chrono Buffer','Factory Scheduler','Autonomous Matrix'],warfare:['Reactor Awakening','Pulse Oscillator','Stellar Conduit','Overcharge Coil','Reality Tap'],transcendence:['Veiled Equation','Entropy Mapping','Reality Anchors','Causal Loop','Universal Network']};
const effects={expansion:'frontier',industry:'production',science:'research',civilization:'automation',warfare:'click',transcendence:'entropy'};
const descriptions={frontier:'Galaxy bonuses and exploration efficiency',production:'Building output',research:'Research and data output',automation:'Offline efficiency and automatic generation',click:'Manual energy generation',entropy:'Production and entropy suppression'};
export const cosmicNodes=cosmicBranches.flatMap(branch=>Array.from({length:branch.id==='transcendence'?19:20},(_,tier)=>{
 const key=effects[branch.id],major=[4,9,14,19].includes(tier),value=tier===0?(branch.id==='civilization'?.12:.08):major?.12:.025+.005*(tier%4);
 return {id:`cosmic-${branch.id}-${tier}`,branch:branch.id,name:tier<tracks[branch.id].length?tracks[branch.id][tier]:`${branch.name} ${['Circuit','Lattice','Resonance','Engine'][tier%4]} ${Math.floor(tier/4)+1}`,desc:`${descriptions[key]} +${Math.round(value*100)}%. ${major?'Major breakthrough.':'Permanent upgrade.'}`,cost:tier===0?1:Math.ceil(2*Math.pow(1.28,tier)),req:tier?[`cosmic-${branch.id}-${tier-1}`]:[],effect:{[key]:value},starter:tier===0&&branch.id!=='transcendence',tier,grade:tier===0?'GATEWAY':tier===19?'CAPSTONE':major?'KEYSTONE':'MINOR',hidden:branch.id==='transcendence'&&tier<9};
}));
export const starterCosmicNodes=cosmicNodes.filter(n=>n.starter);
export const megaProjects=[
 {id:'planetary-computer',name:'Planetary Computer',cost:{energy:1e7,research:5e4,matter:1e4},stages:3,desc:'Each stage accelerates Research and Data production.',effect:{research:.18,data:.18}},
 {id:'stellar-forge',name:'Stellar Forge',cost:{energy:1e9,matter:2e6,antimatter:500},stages:4,desc:'Each stage strengthens factories and mining drones.',effect:{production:.12}},
 {id:'galactic-archive',name:'Galactic Archive',cost:{research:2e7,data:1e6,knowledge:25},stages:4,desc:'Each stage multiplies Research from mapped galaxies.',effect:{research:.2}},
 {id:'wormhole-nexus',name:'Wormhole Nexus',cost:{energy:1e12,quantumCores:500,darkEnergy:1e4},stages:5,desc:'Each stage lowers discovery costs and improves outposts.',effect:{discovery:.06,outpost:.1}},
 {id:'dyson-swarm',name:'Dyson Swarm',cost:{energy:1e15,matter:1e9,antimatter:1e5},stages:5,desc:'Each stage multiplies solar and Dyson Energy.',effect:{energy:.2}},
 {id:'dark-collector',name:'Dark Energy Collector',cost:{darkEnergy:1e6,quantumCores:1e4,knowledge:500},stages:6,desc:'Each stage slows entropy and amplifies dark-energy production.',effect:{entropy:.1,darkEnergy:.22}}
];
