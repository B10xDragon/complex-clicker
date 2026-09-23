export const eras=[
 {id:'spark',name:'Spark',desc:'Turn the first clicks into a self-sustaining machine.',minEnergy:0,minBuildings:0},
 {id:'industrial',name:'Industrialization',desc:'Build a network where machines improve one another.',minEnergy:50,minBuildings:3},
 {id:'science',name:'Scientific Revolution',desc:'Research turns production into a technology engine.',minEnergy:4000,minBuildings:10,minResearch:1},
 {id:'planetary',name:'Planetary Empire',desc:'Your industrial network becomes a civilization.',minEnergy:70000,minBuildings:25,minResearch:3},
 {id:'interstellar',name:'Interstellar Age',desc:'The question is no longer how much—but where.',minEnergy:1e6,minGalaxy:2,minResearch:5},
 {id:'galactic',name:'Galactic Industry',desc:'Dyson infrastructure and exotic production reshape the economy.',minEnergy:2e8,minGalaxy:8,minResearch:7},
 {id:'prestige',name:'Prestige',desc:'Reset the run to accelerate every future empire.',minPrestige:1},
 {id:'ascendant',name:'Ascendant Universe',desc:'Cosmic Knowledge opens permanent incremental upgrades.',minAscension:1},
 {id:'galactic-age',name:'Megastructure Age',desc:'Great projects multiply production across the mapped galaxy web.',minAscension:1,minMega:1},
 {id:'entropy-age',name:'Entropy Age',desc:'After three Ascensions, keep expanding before entropy reaches its limit.',minAscension:3,minMega:1}
];
export const buildingMilestones={
 manual:{10:{production:.06,label:'Induction rhythm'},25:{production:.1,label:'Parallel coils'},50:{production:.18,label:'Self-tuning generators'},100:{production:.35,label:'Manual mastery'}},
 solar:{10:{production:.08,label:'Orbital alignment'},25:{production:.12,label:'Solar lattice'},50:{energy:.18,label:'Stellar efficiency'},100:{production:.3,label:'Solar singularity'}},
 mining:{10:{matter:.1,label:'Dense asteroid charts'},25:{production:.12,label:'Drone coordination'},50:{industry:.16,label:'Autonomous extraction'},100:{production:.28,label:'Mining mastery'}},
 fusion:{10:{production:.08,label:'Stable plasma'},25:{energy:.12,label:'Magnetic compression'},50:{production:.18,label:'Fusion cascade'},100:{production:.35,label:'Star-core reactors'}},
 lab:{10:{research:.1,label:'Peer review network'},25:{data:.15,label:'Experimental archive'},50:{research:.2,label:'Breakthrough method'},100:{production:.3,label:'Research mastery'}},
 orbital:{10:{industry:.1,label:'Microgravity tooling'},25:{matter:.15,label:'Factory routing'},50:{production:.18,label:'Orbital logistics'},100:{production:.32,label:'Industrial mastery'}},
 colony:{10:{credits:.12,label:'Planetary logistics'},25:{data:.15,label:'World archives'},50:{production:.2,label:'Network specialization'},100:{production:.34,label:'Colony mastery'}},
 dyson:{10:{energy:.12,label:'Collector alignment'},25:{production:.16,label:'Stellar routing'},50:{energy:.25,label:'Swarm coordination'},100:{production:.4,label:'Dyson mastery'}},
 quantum:{10:{research:.12,label:'Parallel cognition'},25:{data:.18,label:'Probability engines'},50:{production:.24,label:'Quantum logistics'},100:{production:.4,label:'Quantum mastery'}},
 wormhole:{10:{production:.12,label:'Stable apertures'},25:{antimatter:.18,label:'Transit extraction'},50:{production:.25,label:'Network shortcuts'},100:{production:.42,label:'Wormhole mastery'}},
 dark:{10:{darkEnergy:.16,label:'Gravity shaping'},25:{production:.2,label:'Event containment'},50:{production:.3,label:'Dark-energy lattice'},100:{production:.48,label:'Exotic mastery'}},
 galactic:{10:{production:.16,label:'Regional routing'},25:{knowledge:.2,label:'Galaxy-scale archives'},50:{production:.28,label:'Civilization grid'},100:{production:.55,label:'Galactic mastery'}}
};
export const prestigeMilestones=[
 {count:1,name:'Second Dawn',desc:'Future runs gain +8% production.',effects:{production:.08}},
 {count:2,name:'Automation Memory',desc:'Begin future runs with 2 Manual Generators and 100 Credits.',effects:{manual:2,credits:100}},
 {count:3,name:'Research Continuity',desc:'Industrial Engineering is retained on future resets.',effects:{research:'industrial'}},
 {count:5,name:'Autobuy Protocol',desc:'The first affordable Manual Generator is bought automatically each minute.',effects:{autobuy:true}},
 {count:8,name:'Orbital Reboot',desc:'Begin future runs with 1 Solar Array when unlocked.',effects:{solar:1}},
 {count:10,name:'Strategic Memory',desc:'Mission and milestone rewards gain +25%.',effects:{rewards:.25}}
];
export const civilizationDirectives=[
 {id:'civ-found',name:'Found a civilization',desc:'Reach 10 population',metric:'population',goal:10,reward:{culture:25,credits:500},tip:'Colonize mapped galaxies and let your colonies grow.'},
 {id:'civ-purpose',name:'A world with purpose',desc:'Specialize your first colony',metric:'specialized',goal:1,reward:{research:1000,culture:50},tip:'Choose a colony specialization in the Civilization screen.'},
 {id:'civ-rule',name:'Rule of the stars',desc:'Select a government',metric:'government',goal:1,reward:{culture:100,shards:2},tip:'Governments unlock different strengths and tradeoffs.'},
 {id:'civ-contact',name:'We are not alone',desc:'Improve relations with a civilization',metric:'relations',goal:1,reward:{credits:2000,research:2000},tip:'Open Diplomacy and establish communications.'},
 {id:'civ-market',name:'The galactic market',desc:'Establish a trade route',metric:'trade',goal:1,reward:{credits:5000,shards:3},tip:'Trade routes turn diplomatic contact into economic momentum.'},
 {id:'civ-defense',name:'Defend the frontier',desc:'Construct a fleet unit',metric:'fleet',goal:1,reward:{matter:5000,culture:100},tip:'Fleets are strategic protection and a route to meaningful wars.'},
 {id:'civ-monument',name:'Monument to the stars',desc:'Complete a megastructure stage',metric:'mega',goal:1,reward:{knowledge:3,credits:10000},tip:'Begin a Great Project when your civilization can fund it.'}
];
export const opportunities=[
 {id:'solar-surge',name:'Solar Surge',desc:'Solar Arrays produce 3× energy for 90 seconds.',duration:90,effect:{solar:3}},
 {id:'research-window',name:'Research Breakthrough',desc:'Research Labs produce 2× research for 120 seconds.',duration:120,effect:{lab:2}},
 {id:'forge-boom',name:'Forge Boom',desc:'Orbital Factories generate 2× resources for 120 seconds.',duration:120,effect:{orbital:2}},
 {id:'exploration-window',name:'Exploration Window',desc:'Galaxy discovery costs 50% less for 90 seconds.',duration:90,effect:{exploration:.5}}
];
export const balance={
 prestigeEnergy:1e6,
 ascensionShards:100,
 momentumWindow:45,
 opportunityCooldown:180,
 maxJournal:80
};
