const branches=[
 {id:'expansion',name:'Expansion',tone:'cyan',desc:'Reach farther, settle faster, and turn mapped space into a living frontier.'},
 {id:'industry',name:'Industry',tone:'orange',desc:'Convert the empire into a self-sustaining production network.'},
 {id:'science',name:'Science',tone:'violet',desc:'Unlock rare discoveries, quantum systems, and experimental technology.'},
 {id:'civilization',name:'Civilization',tone:'gold',desc:'Grow populations, culture, administration, and diplomacy.'},
 {id:'warfare',name:'Warfare',tone:'red',desc:'Build fleets, logistics, defenses, and strategic strength.'},
 {id:'transcendence',name:'Transcendence',tone:'pink',desc:'A hidden path toward reality-scale infrastructure and future Ascensions.'}
];
const seed=[
 ['expansion','Frontier Charter','Settled galaxies produce 4% more resources.',1,[],{frontier:.04}],
 ['industry','Industrial Awakening','All building production increases by 8%.',1,[],{production:.08}],
 ['science','Scientific Awakening','Research and data production increases by 12%.',1,[],{research:.12}],
 ['civilization','Civil Awakening','Population growth and culture begin at a higher baseline.',1,[],{population:.1,culture:.1}],
 ['warfare','Martial Awakening','Unlock fleets and gain 10% military strength.',1,[],{military:.1}]
];
const names={expansion:['Survey Doctrine','Rapid Colonies','Frontier Logistics','Deep Range','Outpost Authority','Cluster Cartography','Hyperlane Survey','Settlement Grants','Regional Command','Border Worlds','Gateway Engineering','Expansion Mandate','Starward Migration','Territory Charter','Cluster Stewardship','Interstellar Roads','Frontier Network','Outer Reach','Galactic Cartography','Expansion Ascendant'],industry:['Efficient Reactors','Matter Foundries','Production Routing','Factory Worlds','Antimatter Refining','Quantum Fabrication','Megastructure Supply','Industrial Algorithms','Distributed Industry','Dyson Engineering','Exotic Assembly','Resource Synthesis','Automated Construction','Galactic Supply Chain','Stellar Manufacturing','Dark-Energy Industry','Matter Decompressors','Forge Network','Industrial Singularity','Industry Ascendant'],science:['Research Method','Data Vaults','Experimental Physics','Quantum Labs','Rare Technologies','Anomaly Science','Deep Observatories','Temporal Models','Archive Networks','Scientific Exchange','Reality Models','Exotic Computation','Ancient Languages','Dimensional Theory','Discovery Engines','Cosmic Experiments','Universal Archive','Law Bending','First Principles','Science Ascendant'],civilization:['Civic Registry','Population Planning','Colony Charters','Housing Networks','Education Systems','Cultural Exchange','Administrative Capacity','Specialized Worlds','Government Theory','Diplomatic Corps','Civil Service','Cultural Identity','Galactic Administration','Policy Slots','Council Influence','Civilization Traditions','Ancient Diplomacy','Unified Charter','Commonwealth Engine','Civilization Ascendant'],warfare:['Fleet Doctrine','Corvette Designs','Supply Depots','Defensive Stations','Frigate Designs','Admiralty','Destroyer Designs','Military Logistics','Cruiser Designs','Strategic Command','Carrier Designs','War Economy','Battleship Designs','Fortress Networks','Dreadnought Designs','Fleet Coordination','Galactic Defense','War Council','Strategic Supremacy','Warfare Ascendant'],transcendence:['Veiled Equation','Reality Study','Entropy Mapping','Temporal Resonance','Dimensional Lens','Exotic Matter Theory','Causal Engines','Universe Archives','Law Editing','Singularity Gate','Time Architecture','Void Calculus','Cosmic Infrastructure','Reality Anchors','Entropy Control','Dimensional Foundry','Universal Networks','Ascendant Logic','Beyond the Lattice','Transcendence Ascendant']};
export const cosmicBranches=branches;
export const cosmicNodes=[...seed.map((x,i)=>({id:`cosmic-${x[0]}-0`,branch:x[0],name:x[1],desc:x[2],cost:x[3],req:x[4],effect:x[5],starter:true,tier:0})),...branches.flatMap(b=>names[b.id].slice(1).map((name,i)=>({id:`cosmic-${b.id}-${i+1}`,branch:b.id,name,desc:`Permanent ${b.name.toLowerCase()} capability. This node strengthens the ${b.name.toLowerCase()} path and unlocks its next tier.`,cost:Math.ceil(2*Math.pow(1.24,i+1)),req:[`cosmic-${b.id}-${i}`],effect:{[b.id]:.02+.005*(i%5)},tier:i+1,hidden:b.id==='transcendence'&&i<8})))];
export const starterCosmicNodes=cosmicNodes.filter(n=>n.starter);
export const planetTypes=['Terran','Ocean','Desert','Frozen','Volcanic','Gas Giant','Barren','Toxic','Machine World','Gaia World','Quantum World','Dark Matter World','Artificial World'];
export const colonySpecializations=[
 {id:'industrial',name:'Industrial World',desc:'+industry, higher energy demand',effects:{industry:.2,energyDemand:.12}},
 {id:'research',name:'Research World',desc:'+science, consumes imported energy',effects:{research:.25,energyDemand:.1}},
 {id:'fortress',name:'Fortress World',desc:'+stability and defense, slower growth',effects:{military:.25,growth:-.08}},
 {id:'agricultural',name:'Agricultural World',desc:'+population support and growth',effects:{population:.22,growth:.2}},
 {id:'trade',name:'Trade Hub',desc:'+trade capacity and credits',effects:{trade:.3,credits:.15}},
 {id:'mining',name:'Mining World',desc:'+matter and strategic resource extraction',effects:{matter:.25}},
 {id:'energy',name:'Energy World',desc:'+energy production, high upkeep',effects:{energy:.3,energyDemand:.16}},
 {id:'administrative',name:'Administrative Capital',desc:'+capacity and stability',effects:{capacity:.3,stability:.2}},
 {id:'shipyard',name:'Shipyard World',desc:'+fleet construction and supply',effects:{military:.18,supply:.25}},
 {id:'quantum',name:'Quantum Colony',desc:'+research and quantum output',effects:{research:.15,quantum:.2}}
];
export const governmentTypes=[
 {id:'directorate',name:'Scientific Directorate',desc:'+research and data; higher industrial costs',effects:{research:.2,industry:-.08}},
 {id:'federation',name:'Industrial Federation',desc:'+production and megastructure speed; higher energy demand',effects:{industry:.18,energyDemand:.12}},
 {id:'republic',name:'Stellar Republic',desc:'+culture and diplomacy; slower military mobilization',effects:{culture:.2,diplomacy:.18,military:-.06}},
 {id:'technocracy',name:'Centralized Technocracy',desc:'+administration and automation; reduced culture',effects:{capacity:.25,automation:.2,culture:-.06}},
 {id:'machine',name:'Machine Administration',desc:'+efficiency and logistics; population grows slower',effects:{automation:.3,growth:-.12}},
 {id:'commonwealth',name:'Galactic Commonwealth',desc:'+trade, stability, and alliances',effects:{trade:.2,stability:.15,diplomacy:.12}}
];
export const policyCards=[
 {id:'industrialization',cat:'Economy',name:'Maximum Industrialization',desc:'+20% industry, +12% energy demand, -8% happiness.',effects:{industry:.2,energyDemand:.12,happiness:-.08}},
 {id:'open-science',cat:'Science',name:'Open Science',desc:'+18% research, improves relations with scientific civilizations.',effects:{research:.18,diplomacy:.05}},
 {id:'frontier-grants',cat:'Expansion',name:'Frontier Grants',desc:'Colonies grow faster but consume more credits.',effects:{growth:.22,credits:-.06}},
 {id:'defense-act',cat:'Military',name:'Defense Act',desc:'+22% military strength and +10% upkeep.',effects:{military:.22,energyDemand:.1}},
 {id:'cultural-exchange',cat:'Society',name:'Cultural Exchange',desc:'+culture, happiness, and diplomacy.',effects:{culture:.2,happiness:.12,diplomacy:.14}},
 {id:'free-trade',cat:'Trade',name:'Free Trade Charter',desc:'+30% trade capacity but slightly higher piracy risk.',effects:{trade:.3,piracy:.08}}
];
export const strategicResources=['Exotic Matter','Neutronium','Living Crystal','Quantum Dust','Void Matter','Temporal Fragments'];
export const shipClasses=[
 {id:'corvette',name:'Corvette',cost:20,firepower:5,hull:8,supply:1,speed:3},
 {id:'frigate',name:'Frigate',cost:60,firepower:16,hull:24,supply:2,speed:2.5},
 {id:'destroyer',name:'Destroyer',cost:160,firepower:42,hull:60,supply:4,speed:2},
 {id:'cruiser',name:'Cruiser',cost:420,firepower:120,hull:170,supply:7,speed:1.6},
 {id:'battleship',name:'Battleship',cost:1100,firepower:380,hull:520,supply:14,speed:1.2},
 {id:'carrier',name:'Carrier',cost:2600,firepower:600,hull:900,supply:20,speed:1},
 {id:'dreadnought',name:'Dreadnought',cost:7000,firepower:1900,hull:2600,supply:35,speed:.7}
];
export const megaProjects=[
 {id:'planetary-computer',name:'Planetary Computer',cost:{energy:1e7,research:5e4,matter:1e4},stages:3,desc:'A civilization-scale computer that accelerates research.'},
 {id:'stellar-forge',name:'Stellar Forge',cost:{energy:1e9,matter:2e6,antimatter:500},stages:4,desc:'A star-powered manufacturing complex.'},
 {id:'galactic-archive',name:'Galactic Archive',cost:{research:2e7,data:1e6,knowledge:25},stages:4,desc:'Preserves the discoveries of every mapped civilization.'},
 {id:'wormhole-nexus',name:'Wormhole Nexus',cost:{energy:1e12,quantumCores:500,darkEnergy:1e4},stages:5,desc:'Links distant territory into one logistical network.'},
 {id:'dyson-swarm',name:'Dyson Swarm',cost:{energy:1e15,matter:1e9,antimatter:1e5},stages:5,desc:'Harvests a complete stellar system in stages.'},
 {id:'dark-collector',name:'Dark Energy Collector',cost:{darkEnergy:1e6,quantumCores:1e4,knowledge:500},stages:6,desc:'Begins the transition into Transcendent technology.'}
];
