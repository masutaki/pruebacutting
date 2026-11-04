const U_STEP = [1,25,1/0]

const UPG_RES = {
    grass: ["Grass",_=>[player,"grass"],'GrassBase','Curr/Grass'],
    perk: ["Perk",_=>[tmp,"perkUnspent"],'PerkBase','Curr/Perks'],
    pp: ["PP",_=>[player,"pp"],'PrestigeBase','Curr/Prestige'],
    plat: ["Platinum",_=>[player,"plat"],"PlatBase",'Curr/Platinum'],
    crystal: ["Crystal",_=>[player,"crystal"],"CrystalBase",'Curr/Crystal'],
    steel: ["Steel",_=>[player,"steel"],"GrasshopBase",'Curr/Steel2'],
    aGrass: ["Anti-Grass",_=>[player,"aGrass"],'AntiGrassBase','Curr/AntiGrass'],
    ap: ["AP",_=>[player,"ap"],'AnonymityBase','Curr/Anonymity'],
    oil: ["Oil",_=>[player,"oil"],'LiquefyBase','Curr/Oil'],
    rf: ["Rocket Fuel",_=>[player.rocket,"amount"],'RocketBase','Curr/RocketFuel'],
    momentum: ["Momentum",_=>[player,"momentum"],'RocketBase',"Curr/Momentum"],
    moonstone: ["Moonstone",_=>[player,"moonstone"],'MoonBase','Curr/Moonstone'],
    fun: ["Fun",_=>[player,"fun"],'FunBase','Curr/Fun'],
    star: ["Star",_=>[player,"stars"],'SpaceBase','Curr/Star'],
    SFRGT: ["SFRGT",_=>[player,"SFRGT"],'FunBase','Curr/SuperFun'],
    dm: ["Dark Matter",_=>[player,"dm"],'DarkMatterBase','Curr/DarkMatter'],
    unGrass: ["Un-Grass",_=>[player,"unGrass"],'UnnaturalBase','Curr/UGrass'],
    np: ["NP",_=>[player,"np"],'NormalityBase','Curr/Normality'],
    pm: ["Planetarium",_=>[player.planetoid,"pm"],'PlanetBase','Curr/Planetoid'],
    observ: ["Observatorium",_=>[player.planetoid,"observ"],'ObsBase','Curr/Observatorium'],
    astro: ["Astro",_=>[player.planetoid,"astro"],'AstroBase','Curr/Astrolabe'],
    measure: ["Measure",_=>[player.planetoid,"measure"],'MeasureBase','Curr/Measure'],
    cloud: ["Cloud",_=>[player,"cloud"],'CloudBase','Curr/Cloud'],
    planet: ["Planet",_=>[player.planetoid,"planet"],'PlanetaryBase','Curr/Planet'],
}

const isResNumber = ['perk','plat','rf','momentum','moonstone']

const UPGS = {
    grass: {
        unl: _=> !tmp.outsideNormal,

        cannotBuy: _=>inChal(1) || inChal(7),

        autoUnl: _=>hasUpgrade('auto',3),

        noSpend: _=>hasUpgrade('auto',6),

        title: "Grass Upgrades",

        ctn: [
            {
                max: 1000,

                title: "Grass Value",
                desc: `Increase Grass gain by <b class="green">1</b> per level.<br>This effect is <b class="green">doubled</b> every <b class="yellow">25</b> levels.`,

                res: "grass",
                icon: ['Curr/Grass'],
                
                cost: i => Decimal.pow(1.2,scale(E(i),1e6,2,0)).mul(10).ceil(),
                bulk: i => i.div(10).max(1).log(1.2).scale(1e6,2,0,true).floor().toNumber()+1,

                effect(i) {
                    let x = Decimal.pow(2,Math.floor(i/25)).mul(i+1)

                    return x
                },
                effDesc: x => x.format()+"x",
            },{
                max: 1000,

                title: "More Grass",
                desc: `Increase grass cap by <b class="green">1</b> per level.`,

                res: "grass",
                icon: ['Icons/MoreGrass'],
                
                cost: i => Decimal.pow(1.4,i).mul(25).ceil(),
                bulk: i => i.div(25).max(1).log(1.4).floor().toNumber()+1,

                effect(i) {
                    let x = i

                    return x
                },
                effDesc: x => "+"+format(x,0),
            },{
                max: 250,

                title: "Grow Speed",
                desc: `Increase grass grow speed by <b class="green">10%</b> per level.`,

                res: "grass",
                icon: ['Icons/Speed'],
                
                cost: i => Decimal.pow(1.75,i).mul(100).ceil(),
                bulk: i => i.div(100).max(1).log(1.75).floor().toNumber()+1,

                effect(i) {
                    let x = i/10+1

                    return x
                },
                effDesc: x => format(x)+"x",
            },{
                max: 1000,

                title: "XP",
                desc: `Increase experience (XP) gained by <b class="green">1</b> per level.<br>This effect is <b class="green">doubled</b> every <b class="yellow">25</b> levels.`,

                res: "grass",
                icon: ['Icons/XP'],
                
                cost: i => Decimal.pow(1.3,scale(E(i),1e6,2,0)).mul(1e3).ceil(),
                bulk: i => i.div(1e3).max(1).log(1.3).scale(1e6,2,0,true).floor().toNumber()+1,

                effect(i) {
                    let x = Decimal.pow(2,Math.floor(i/25)).mul(i+1)

                    return x
                },
                effDesc: x => x.format()+"x",
            },{
                max: 5,

                title: "Range",
                desc: `Increase grass cut range by <b class="green">10</b> per level. Base is 50.`,

                res: "grass",
                icon: ['Icons/Range'],
                
                cost: i => Decimal.pow(2,i).mul(1e4).ceil(),
                bulk: i => i.div(1e4).max(1).log(2).floor().toNumber()+1,

                effect(i) {
                    let x = i*10

                    return x
                },
                effDesc: x => "+"+format(x,0),
            },
        ],
    },
    perk: {
        title: "Perk Upgrades",
        btns: `<button id="losePerksBtn" class="buyAllUpg" onclick='toggleOption("losePerks")'>Keep on reset: <span id="losePerks"></span></button>`,

        unl:_=>!player.planetoid.active,

        req: _=>player.level >= 1 || player.pTimes > 0,
        reqDesc: _=>`Reach Level 1 to unlock.`,

        underDesc: _=>`You have ${format(tmp.perkUnspent,0)} Perk`,

        autoUnl: _=>hasUpgrade('auto',13),

        ctn: [
            {
                max: 50,

                costOnce: true,

                title: "Value Perk",
                desc: `Increase Grass gain by <b class="green">20%</b> per level multiplied by experience level.`,

                res: "perk",
                icon: ['Curr/Grass'],
                
                cost: i => 1,
                bulk: i => i,

                effect(i) {
                    let x = Decimal.mul(player.level*i,0.2).add(1)

                    return x
                },
                effDesc: x => x.format()+"x",
            },{
                max: 10,

                costOnce: true,

                title: "Cap Perk",
                desc: `Increase grass cap by <b class="green">10</b> per level.`,

                res: "perk",
                icon: ['Icons/MoreGrass'],
                
                cost: i => 1,
                bulk: i => i,

                effect(i) {
                    let x = i*10

                    return x
                },
                effDesc: x => "+"+format(x,0),
            },{
                max: 10,

                costOnce: true,

                title: "Grow Speed Perk",
                desc: `Increase grass grow speed by <b class="green">25%</b> per level.`,

                res: "perk",
                icon: ['Icons/Speed'],
                
                cost: i => 1,
                bulk: i => i,

                effect(i) {
                    let x = 1+i*0.25

                    return x
                },
                effDesc: x => format(x)+"x",
            },{
                max: 50,

                costOnce: true,

                title: "XP Perk",
                desc: `Increase XP gain by <b class="green">20%</b> per level multiplied by experience level.`,

                res: "perk",
                icon: ['Icons/XP'],
                
                cost: i => 1,
                bulk: i => i,

                effect(i) {
                    // if (player.decel) return 1

                    let x = Decimal.mul(player.level*i,0.2).add(1)

                    return x
                },
                effDesc: x => x.format()+"x",
            },{
                max: 5,

                costOnce: true,

                title: "Range Perk",
                desc: `Increase grass cut range by <b class="green">10</b> per level.`,

                res: "perk",
                icon: ['Icons/Range'],
                
                cost: i => 1,
                bulk: i => i,

                effect(i) {
                    let x = i*10

                    return x
                },
                effDesc: x => "+"+format(x,0),
            },{
                max: 1,

                costOnce: true,

                title: "Grow Amount Perk",
                desc: `Increase the grass grow amount by <b class="green">1</b>.`,

                res: "perk",
                icon: ['Icons/MoreGrass'],
                
                cost: i => 10,
                bulk: i => Math.floor(i/10),

                effect(i) {
                    let x = i

                    return x
                },
                effDesc: x => "+"+format(x,0),
            },{
                max: 10,

                unl: _=>player.cTimes>0,

                costOnce: true,

                title: "TP Perk",
                desc: `Increase TP gain by <b class="green">5%</b> per level multiplied by experience level.`,

                res: "perk",
                icon: ['Icons/TP'],
                
                cost: i => 1,
                bulk: i => i,

                effect(i) {
                    let x = Decimal.mul(player.level*i,0.05).add(1)

                    return x
                },
                effDesc: x => x.format()+"x",
            },{
                max: 25,

                unl: _=>player.cTimes>0,

                costOnce: true,

                title: "PP Perk",
                desc: `Increase PP gain by <b class="green">20%</b> per level.`,

                res: "perk",
                icon: ['Curr/Prestige'],
                
                cost: i => 2,
                bulk: i => Math.floor(i/2),

                effect(i) {
                    let x = Decimal.mul(i,0.2).add(1)

                    return x
                },
                effDesc: x => x.format()+"x",
            },{
                max: 25,

                unl: _=>player.cTimes>0,

                costOnce: true,

                title: "Crystal Perk",
                desc: `Increase Crystal gain by <b class="green">20%</b> per level.`,

                res: "perk",
                icon: ['Curr/Crystal'],
                
                cost: i => 4,
                bulk: i => Math.floor(i/4),

                effect(i) {
                    let x = Decimal.mul(i,0.2).add(1)

                    return x
                },
                effDesc: x => x.format()+"x",
            },
        ],
    },
    auto: {
        title: "Automation Upgrades",

        req: _=>player.level >= 5 || player.pTimes > 0,
        reqDesc: _=>`Reach Level 5 to unlock.`,

        ctn: [
            {
                max: 5,

                title: "Autocut",
                desc: `Auto cuts grass every <b class="green">5</b> seconds (-1s every level after the first).`,
            
                res: "grass",
                icon: ['Curr/Grass','Icons/Automation'],
                            
                cost: i => Decimal.pow(10,i).mul(1e3).ceil(),
                bulk: i => i.div(1e3).max(1).log(10).floor().toNumber()+1,
            
                effect(i) {
                    let x = Math.max(i-1,0)
            
                    return x
                },
                effDesc: x => format(tmp.autocut)+" seconds",
            },{
                unl: _=>player.pTimes>0,
                max: 5,

                title: "Autocut Value",
                desc: `Auto cuts grass is worth <b class="green">+100%</b> more grass, XP & TP.`,
            
                res: "pp",
                icon: ['Curr/Grass'],
                            
                cost: i => Decimal.pow(3,i).mul(20).ceil(),
                bulk: i => i.div(20).max(1).log(3).floor().toNumber()+1,
            
                effect(i) {
                    let x = E(i+1)
            
                    return x
                },
                effDesc: x => format(x)+"x",
            },{
                unl: _=>player.pTimes>0,
                max: 3,

                title: "Autocut Amount",
                desc: `Increases auto cut amount by <b class="green">1</b>.`,
            
                res: "pp",
                icon: ['Curr/Grass','Icons/Automation'],
                            
                cost: i => Decimal.pow(5,i).mul(25).ceil(),
                bulk: i => i.div(25).max(1).log(5).floor().toNumber()+1,
            
                effect(i) {
                    let x = i
            
                    return x
                },
                effDesc: x => "+"+format(x,0),
            },{
                unl: _=>player.pTimes>0,

                title: "Grass Upgrade Autobuy",
                desc: `You can now automatically buy Grass Upgrades.`,
            
                res: "pp",
                icon: ['Curr/Grass','Icons/Automation'],
                            
                cost: i => E(1e3),
                bulk: i => 1,
            },{
                unl: _=>player.pTimes>0,

                title: "Perk Save P",
                desc: `Keep perks on Prestige.`,
            
                res: "pp",
                icon: ['Curr/Perks','Icons/Automation'],
                            
                cost: i => E(1e4),
                bulk: i => 1,
            },{
                unl: _=>player.cTimes>0,

                title: "Prestige Upgrade Autobuy",
                desc: `You can now automatically buy Prestige Upgrades.`,
            
                res: "crystal",
                icon: ['Curr/Prestige','Icons/Automation'],
                            
                cost: i => E(50),
                bulk: i => 1,
            },{
                unl: _=>player.cTimes>0,

                title: "Grass Upgrades EL",
                desc: `Grass Upgrades no longer spend grass.`,
            
                res: "crystal",
                icon: ['Curr/Grass','Icons/Infinite'],
                            
                cost: i => E(150),
                bulk: i => 1,
            },{
                unl: _=>player.cTimes>0,

                title: "Perk Save C",
                desc: `Keep perks on Crystallize.`,
            
                res: "crystal",
                icon: ['Curr/Perks','Icons/Automation'],
                            
                cost: i => E(500),
                bulk: i => 1,
            },{
                unl: _=>player.grasshop>0,

                title: "Crystal Upgrade Autobuy",
                desc: `You can now automatically buy Crystal Upgrades.`,
            
                res: "crystal",
                icon: ['Curr/Crystal','Icons/Automation'],
                            
                cost: i => E(1e11),
                bulk: i => 1,
            },{
                unl: _=>player.grasshop>0,

                title: "Prestige Upgrades EL",
                desc: `Prestige Upgrades no longer spend PP.`,
            
                res: "crystal",
                icon: ['Curr/Prestige','Icons/Infinite'],
                            
                cost: i => E(1e12),
                bulk: i => 1,
            },{
                unl: _=>player.grasshop>=4,

                title: "Crystal Upgrades EL",
                desc: `Crystal Upgrades no longer spend crystal.`,
            
                res: "crystal",
                icon: ['Curr/Crystal','Icons/Infinite'],
                            
                cost: i => E(1e15),
                bulk: i => 1,
            },{
                unl: _=>player.grasshop>=4,

                max: 10,

                title: "PP Generation",
                desc: `Passively generate <b class="green">1%</b> of PP you would earn on prestige per second.`,
            
                res: "pp",
                icon: ['Curr/Prestige','Icons/Automation'],
                            
                cost: i => Decimal.pow(2,i).mul(1e40).ceil(),
                bulk: i => i.div(1e40).max(1).log(2).floor().toNumber()+1,
                effect(i) {
                    let x = i/100
            
                    return x
                },
                effDesc: x => "+"+formatPercent(x,0)+"/s",
            },{
                unl: _=>player.grasshop>=4,

                max: 10,

                title: "Crystal Generation",
                desc: `Passively generate <b class="green">1%</b> of crystal you would earn on crystallize per second.`,
            
                res: "pp",
                icon: ['Curr/Crystal','Icons/Automation'],
                            
                cost: i => Decimal.pow(2,i).mul(1e42).ceil(),
                bulk: i => i.div(1e42).max(1).log(2).floor().toNumber()+1,
                effect(i) {
                    let x = i/100
            
                    return x
                },
                effDesc: x => "+"+formatPercent(x,0)+"/s",
            },{
                unl: _=>player.grasshop>=6,

                title: "Perk Autobuy",
                desc: `You can now automatically buy Perk Upgrades.`,
            
                res: "crystal",
                icon: ['Curr/Perks','Icons/Automation'],
                            
                cost: i => E(1e16),
                bulk: i => 1,
            },{
                unl: _=>player.aTimes>0,

                title: "Anti-Grass Upgrades Autobuy",
                desc: `You can now automatically buy Anti-Grass Upgrades.`,
            
                res: "ap",
                icon: ['Curr/Grass','Icons/Automation'],
                            
                cost: i => E(100),
                bulk: i => 1,
            },{
                unl: _=>player.lTimes>0,

                title: "Anonymity Upgrades Autobuy",
                desc: `You can now automatically buy Anonymity Upgrades.`,
            
                res: "oil",
                icon: ['Curr/Anonymity','Icons/Automation'],
                            
                cost: i => E(100),
                bulk: i => 1,
            },{
                unl: _=>player.lTimes>0,

                title: "Anti-Grass Upgrades EL",
                desc: `Anti-Grass Upgrades no longer spend anti-grass.`,
            
                res: "oil",
                icon: ['Curr/Grass','Icons/Infinite'],
                            
                cost: i => E(1000),
                bulk: i => 1,
            },{
                unl: _=>hasUpgrade('factory',5),

                title: "Oil Upgrades Autobuy",
                desc: `You can now automatically buy Oil Upgrades.`,
            
                res: "rf",
                icon: ['Curr/Oil','Icons/Automation'],
                            
                cost: i => 25,
                bulk: i => 1,
            },{
                unl: _=>player.rocket.part>0,

                title: "Anti Grass Save",
                desc: `No longer reset anti-grass and anti-grass upgrades on anonymity/liquefy/rocket part.`,
            
                res: "rf",
                icon: ['Curr/Grass','Icons/Automation'],
                            
                cost: i => 50,
                bulk: i => 1,
            },{
                unl: _=>hasUpgrade('factory',5),

                title: "Anonymity Upgrades EL",
                desc: `Anonymity Upgrades no longer spend AP.`,
            
                res: "oil",
                icon: ['Curr/Anonymity','Icons/Infinite'],
                            
                cost: i => E(1e12),
                bulk: i => 1,
            },{
                unl: _=>player.rocket.part>0,

                title: "Oil Upgrades EL",
                desc: `Oil Upgrades no longer spend Oil.`,
            
                res: "oil",
                icon: ['Curr/Oil','Icons/Infinite'],
                            
                cost: i => E(1e18),
                bulk: i => 1,
            },
        ],
    },
    plat: {
        title: "Platinum Upgrades",

        unl: _=>player.pTimes>0&&!player.planetoid.active,

        req: _=>player.tier >= 3||player.cTimes > 0,
        reqDesc: _=>`Reach Tier 3 to unlock.`,

        underDesc: _=>`You have ${format(player.plat,0)} Platinum (${formatPercent(tmp.platChance)} grow chance)`,

        autoUnl: _=>hasStarTree('auto',9),

        ctn: [
            {
                max: 9,

                costOnce: true,

                title: "Starter AC",
                desc: `Decreases auto cut time by <b class="green">0.1</b> seconds per level.`,

                res: "plat",
                icon: ['Curr/Grass','Icons/Automation'],
                
                cost: i => 5,
                bulk: i => Math.floor(i/5),

                effect(i) {
                    let x = i/10

                    return x
                },
                effDesc: x => format(tmp.autocut)+" seconds",
            },{
                max: 100,

                costOnce: true,

                title: "Plat XP",
                desc: `Increase XP gain by <b class="green">+20%</b> per level.`,

                res: "plat",
                icon: ['Icons/XP'],
                
                cost: i => 10,
                bulk: i => Math.floor(i/10),

                effect(i) {
                    let x = E(i*0.2+1)

                    return x
                },
                effDesc: x => format(x)+"x",
            },{
                max: 100,

                costOnce: true,

                title: "Plat Grass",
                desc: `Increase grass gain by <b class="green">+20%</b> per level.`,

                res: "plat",
                icon: ['Curr/Grass'],
                
                cost: i => 10,
                bulk: i => Math.floor(i/10),

                effect(i) {
                    let x = E(i*0.2+1)

                    return x
                },
                effDesc: x => format(x)+"x",
            },{
                max: 100,

                unl: _=>player.cTimes>0,

                costOnce: true,

                title: "Plat PP",
                desc: `Increase PP gain by <b class="green">+20%</b> per level.`,

                res: "plat",
                icon: ['Curr/Prestige'],
                
                cost: i => 100,
                bulk: i => Math.floor(i/100),

                effect(i) {
                    let x = E(i*0.2+1)

                    return x
                },
                effDesc: x => format(x)+"x",
            },{
                max: 100,

                unl: _=>player.cTimes>0,

                costOnce: true,

                title: "Plat Crystal",
                desc: `Increase Crystal gain by <b class="green">+20%</b> per level.`,

                res: "plat",
                icon: ['Curr/Crystal'],
                
                cost: i => 100,
                bulk: i => Math.floor(i/100),

                effect(i) {
                    let x = E(i*0.2+1)

                    return x
                },
                effDesc: x => format(x)+"x",
            },{
                max: 100,

                unl: _=>player.sTimes>0,

                costOnce: true,

                title: "Platinum Steel",
                desc: `Increase steel gain by <b class="green">+10%</b> per level.`,

                res: "plat",
                icon: ['Curr/Steel2'],
                
                cost: i => 1000,
                bulk: i => Math.floor(i/1000),

                effect(i) {
                    let x = E(i*0.1+1)

                    return x
                },
                effDesc: x => format(x)+"x",
            },{
                max: 25,

                unl: _=>player.sTimes>0,

                costOnce: true,

                title: "Plat-Exponential PP",
                desc: `Increase PP multiplier's exponent by <b class="green">+1%</b> per level.`,

                res: "plat",
                icon: ['Curr/Prestige','Icons/Exponent'],
                
                cost: i => 2000,
                bulk: i => Math.floor(i/2000),

                effect(i) {
                    let x = E(i*0.01+1)

                    return x
                },
                effDesc: x => "^"+format(x),
            },{
                max: 25,

                unl: _=>player.sTimes>0,

                costOnce: true,

                title: "Plat-Exponential Crystal",
                desc: `Increase Crystal multiplier's exponent by <b class="green">+1%</b> per level.`,

                res: "plat",
                icon: ['Curr/Crystal','Icons/Exponent'],
                
                cost: i => 3000,
                bulk: i => Math.floor(i/3000),

                effect(i) {
                    let x = E(i*0.01+1)

                    return x
                },
                effDesc: x => "^"+format(x),
            },{
                max: 100,

                unl: _=>player.aTimes>0,

                costOnce: true,

                title: "Plat Anonymity",
                desc: `Increase AP gain by <b class="green">+20%</b> per level.`,

                res: "plat",
                icon: ['Curr/Anonymity'],
                
                cost: i => 10000,
                bulk: i => Math.floor(i/10000),

                effect(i) {
                    let x = E(i*0.2+1)

                    return x
                },
                effDesc: x => format(x)+"x",
            },{
                max: 100,

                unl: _=>player.lTimes>0,

                costOnce: true,

                title: "Platinum Oil",
                desc: `Increase Oil gain by <b class="green">+20%</b> per level.`,

                res: "plat",
                icon: ['Curr/Oil'],
                
                cost: i => 25000,
                bulk: i => Math.floor(i/25000),

                effect(i) {
                    let x = E(i*0.2+1)

                    return x
                },
                effDesc: x => format(x)+"x",
            },{
                max: 25,

                unl: _=>player.rocket.part>0||player.gTimes>0,

                costOnce: true,

                title: "Plat-Exponential XP",
                desc: `Increase XP multiplier's exponent by <b class="green">+1%</b> per level, but only in normal realm.`,

                res: "plat",
                icon: ['Icons/XP','Icons/Exponent'],
                
                cost: i => 1e6,
                bulk: i => Math.floor(i/1e6),

                effect(i) {
                    let x = i*0.01+1

                    return x
                },
                effDesc: x => "^"+format(x),
            },
        ],
    },
}

// <b class="green"></b>
// <b class="yellow"></b>

/*
{
    title: "Placeholder",
    desc: `Placeholder.`,

    res: "grass",
                
    cost: i => Decimal.pow(1.15,i).mul(10).ceil(),
    bulk: i => i.div(10).max(1).log(1.15).floor().toNumber()+1,

    effect(i) {
        let x = E(1)

        return x
    },
    effDesc: x => format(x)+"x",
},
*/

const UPGS_SCOST = {}

function clickUpgrade(id, x) {
	if (shiftDown) buyMaxUpgrade(id, x)
	else tmp.upg_ch[id] = x
}

function buyUpgrade(id, x, type = "once") {
	if (!UPGS[id] || !UPGS[id].ctn[x]) return
	const group = UPGS[id]
	if ((group.unl && !group.unl()) || (group.req && !group.req()) || (group.cannotBuy && group.cannotBuy())) return
	if (group.ctn[x].unl && !group.ctn[x].unl()) return
	//Upgrade Data
	let tu = tmp.upgs[id]
	let upg = UPGS[id].ctn[x]
	let costOnce = upg.costOnce

	//Resource Data
	let resDis = upg.res
	let resNum = isResNumber.includes(resDis)
	let res = tmp.upg_res[resDis]
	if (E(tu.cost[x]).gt(res)) return

	//Upgrade Save
	let upgData = player.upgs[id]
	let amt = upgData[x] || 0
	if (amt >= tu.max[x]) return

	//Determine Levels
	let bulk = tu.bulk[x]
	if (costOnce) bulk += amt
	if (type == "next") bulk = Math.min(bulk, Math.ceil((amt + 1) / 25) * 25)
	if (type == "once") bulk = amt + 1
	else bulk = Math.max(Math.floor(bulk), amt + 1)
	bulk = Math.min(bulk, tu.max[x])
	upgData[x] = bulk

	//Spend Resource
	if (!tu.noSpend) {
		let [p,q] = UPG_RES[resDis][1]()
		let cost = costOnce ? tu.cost[x] * (bulk - amt) : upg.cost(bulk-1)

		if (resDis == 'perk') {
			player.spentPerk += cost
			tmp.perkUnspent = Math.max(player.maxPerk - player.spentPerk, 0)
		} else {
			p[q] = resNum ? Math.max(p[q]-cost, 0) : p[q].sub(cost).max(0)
		}
		updateUpgResource(resDis)
	}

	updateUpgTemp(id)
}

function buyNextUpgrade(id, x) {
	buyUpgrade(id, x, "next")
}

function buyMaxUpgrade(id, x) {
	buyUpgrade(id, x, "max")
}

function buyAllUpgrades(id) {
    let upgs = UPGS[id]
    for (let [x, upg] of Object.entries(upgs.ctn)) {
        if (upg.unl ? upg.unl() : true) buyUpgrade(id, x, "max")
    }
}

function switchAutoUpg(id) {
    player.autoUpg[id] = !player.autoUpg[id]
}

function updateUpgTemp(id) {
    let upgs = UPGS[id]
    let uc = upgs.ctn
    let tu = tmp.upgs[id]
    let ul = 0
    for (let x = 0; x < uc.length; x++) {
        let upg = uc[x]
        let amt = player.upgs[id][x]||0
        let res = tmp.upg_res[upg.res]
        
        tu.max[x] = upg.max||1
        if (id == "grass") {
            if (hasUpgrade('assembler',0) && x == 0) tu.max[x] = Infinity
            else if (hasUpgrade('assembler',1) && x == 3) tu.max[x] = Infinity
        } else if (id == "pp") {
            if (hasUpgrade('assembler',2)) tu.max[x] = Infinity
        } else if (id == "crystal") {
            if (hasUpgrade('assembler',3) && x == 5) tu.max[x] = Infinity
            else if (hasUpgrade('assembler',4) && x < 4) tu.max[x] = Infinity
        } else if (id == "aGrass") {
            if (hasUpgrade('assembler',6) && (x == 4 || x == 3 || x == 2)) tu.max[x] = Infinity
            else if (hasUpgrade('assembler',9) && (x == 5 || x == 0)) tu.max[x] = Infinity
        } else if (id == "ap") {
            if (hasUpgrade('assembler',7) && (x <= 3)) tu.max[x] = Infinity
            else if (hasUpgrade('assembler',10) && (x == 5)) tu.max[x] = Infinity
        } else if (id == "oil") {
            if (hasUpgrade('assembler',11)) tu.max[x] = Infinity
        } else if (id == "gen") {
            if (hasStarTree('reserv',16) && (x==2 || x==3)) tu.max[x] = 1000 + starTreeEff('reserv',16)
        } else if (id == "unGrass") {
            if (hasStarTree('reserv',25) && x < 5) tu.max[x] = Infinity
        } else if (id == "foundry") {
            if (hasStarTree('reserv',28)) tu.max[x] = Infinity
        } else if (id == "sfrgt") {
            if (hasStarTree('reserv',30) && x == 0) tu.max[x] = Infinity
        } else if (id == "np") {
            if (hasStarTree('reserv',33)) tu.max[x] = Infinity
        }

        if (upg.unl?upg.unl():true) if (amt < tu.max[x]) ul++

        tu.cost[x] = upg.cost(amt)
        tu.bulk[x] = Decimal.gte(res,UPGS_SCOST[id][x])?Math.min(upg.bulk(res),tu.max[x]):0

        if (upg.effect) tu.eff[x] = upg.effect(amt)
    }
    if (upgs.cannotBuy) tu.cannotBuy = upgs.cannotBuy()
    if (upgs.noSpend) tu.noSpend = upgs.noSpend()
    if (upgs.autoUnl) tu.autoUnl = upgs.autoUnl()
    tu.unlLength = ul
}


function setupUpgradesHTML(id) {
	let table = new Element("upgs_div_"+id)

	if (table.el) {
		let upgs = UPGS[id]
		let html = ""

		table.addClass(id)

		html += `
			<div style="height: 40px;">
				${upgs.title} <button class="buyAllUpg" onclick="buyAllUpgrades('${id}')">Buy All</button><button class="buyAllUpg" id="upg_auto_${id}" onclick="switchAutoUpg('${id}')">Auto: OFF</button> ${upgs.btns ?? ''}
			</div><div id="upgs_ctn_${id}" class="upgs_ctn">

			</div><div style="height: 40px;" id="upg_under_${id}">

			</div>
			<div id="upg_desc_div_${id}" class="upg_desc ${id}">
				<div id="upg_desc_${id}"></div>
				<div style="position: absolute; bottom: 0; width: 100%;">
					<button onclick="tmp.upg_ch.${id} = -1">Close</button>
					<button id="upg_buy_${id}" onclick="buyUpgrade('${id}',tmp.upg_ch.${id})">Buy 1</button>
					<button id="upg_buy_next_${id}" onclick="buyNextUpgrade('${id}',tmp.upg_ch.${id})">Buy Next</button>
					<button id="upg_buy_max_${id}" onclick="buyMaxUpgrade('${id}',tmp.upg_ch.${id})">Buy Max</button>
				</div>
			</div>
			<div id="upg_req_div_${id}" class="upg_desc ${id}">
				<div id="upg_req_desc_${id}" style="position:absolute;top:50%;width: 100%;transform:translateY(-50%);font-size:30px;"></div>
			</div>
		`

		table.setHTML(html)

		html = ""
        for (let x in UPGS[id].ctn) {
            let upg = UPGS[id].ctn[x]
            let icon = [id=='auto'&&x==0?'Bases/AutoBase':'Bases/'+UPG_RES[upg.res][2]]
            if (upg.icon) icon.push(...upg.icon)
            else icon.push('Icons/Placeholder')

            html += `
            <div class="upg_ctn" role="button" tabindex="0" aria-label="${upg.title}" id="upg_ctn_${id}${x}" onclick="clickUpgrade('${id}',${x})">`
            for (i in icon) html +=
                `<img class="img_desc" draggable="false" src="${"images/"+icon[i]+".png"}">`
            html += `<img class='img_desc' id="upg_ctn_${id}${x}_max_base" draggable="false" src="images/max.png">
                <img class="img_res" draggable="false" src="${"images/Bases/"+UPG_RES[upg.res][2]+".png"}"><img class="img_res" draggable="false" src="${"images/"+UPG_RES[upg.res][3]+".png"}">
                <div id="upg_ctn_${id}${x}_cost" class="upg_cost"></div>
                <div id="upg_ctn_${id}${x}_amt" class="upg_amt">argh</div>
				<div class="upg_max" id="upg_ctn_${id}${x}_max" class="upg_max">Maxed!</div>
            </div>`
        }

		new Element(`upgs_ctn_${id}`).setHTML(html)
	}
}

function updateUpgradesHTML(id) {
    let upgs = UPGS[id]
    let height = document.getElementById(`upgs_ctn_${id}`).offsetHeight-25
    let tu = tmp.upgs[id]
    let ch = tmp.upg_ch[id]

    let unl = upgs.unl?upgs.unl():true
    tmp.el["upgs_div_"+id].setDisplay(unl)

    if (unl) {
        let req = upgs.req?upgs.req():true

        tmp.el["upg_req_div_"+id].setDisplay(!req)

        if (req) {
            if (upgs.underDesc) tmp.el["upg_under_"+id].setHTML(upgs.underDesc())
            tmp.el["upg_desc_div_"+id].setDisplay(ch > -1)

            if (ch > -1) {
                let upg = UPGS[id].ctn[ch]
                let amt = player.upgs[id][ch]||0
                let res = tmp.upg_res[upg.res]
                let dis = UPG_RES[upg.res][0]

                let h = `
                [#${ch+1}] <h2>${upg.title}</h2><br>
                Level <b class="yellow">${format(amt,0)}${tu.max[ch] < Infinity ? ` / ${format(tu.max[ch],0)}` : ""}</b><br>
                ${upg.desc}
                `

                if (upg.effDesc) h += '<br>Effect: <span class="cyan">'+upg.effDesc(tu.eff[ch])+"</span>"
                h += '<br><br>'

                let canBuy = Decimal.gte(tmp.upg_res[upg.res], tu.cost[ch])
                let hasBuy25 = (Math.floor(amt / 25) + 1) * 25 < tu.max[ch]
                let hasMax = amt + 1 < tu.max[ch]

                if (amt < tu.max[ch]) {
                    let cost2 = upg.costOnce?Decimal.mul(tu.cost[ch],25-amt%25):upg.cost((Math.floor(amt/25)+1)*25-1)
                    let cost3 = upg.costOnce?Decimal.mul(tu.cost[ch],tu.max[ch]-amt):upg.cost(tu.max[ch]-1)
                    if (hasBuy25) h += `<span class="${Decimal.gte(tmp.upg_res[upg.res],cost2)?"green":"red"}">Cost to next 25: ${format(cost2,0)} ${dis}</span><br>`
                    else if (hasMax) h += `<span class="${Decimal.gte(tmp.upg_res[upg.res],cost3)?"green":"red"}">Cost to max: ${format(cost3,0)} ${dis}</span><br>`

                    h += `
                    <span class="${canBuy?"green":"red"}">Cost: ${format(tu.cost[ch],0)} ${dis}</span><br>
                    You have ${format(res,0)} ${dis}
                    `
                } else h += "<b class='pink'>Maxed!</b>"

                tmp.el["upg_desc_"+id].setHTML(h)
                tmp.el["upg_buy_"+id].setClasses({ locked: !canBuy })
                tmp.el["upg_buy_"+id].setDisplay(amt < tu.max[ch])
                tmp.el["upg_buy_"+id].setTxt("Buy" + (hasMax ? " 1" : ""))
                tmp.el["upg_buy_next_"+id].setClasses({ locked: !canBuy })
                tmp.el["upg_buy_next_"+id].setDisplay(hasBuy25)
                tmp.el["upg_buy_max_"+id].setClasses({ locked: !canBuy })
                tmp.el["upg_buy_max_"+id].setDisplay(hasMax)
            }

            if (ch < 0) {
                tmp.el["upg_auto_"+id].setDisplay(tu.autoUnl)
                if (tu.autoUnl) tmp.el["upg_auto_"+id].setTxt("Auto: "+(player.autoUpg[id]?"ON":"OFF"))

                for (let x = 0; x < upgs.ctn.length; x++) {
                    let upg = upgs.ctn[x]
                    let div_id = "upg_ctn_"+id+x
                    let amt = player.upgs[id][x]||0

                    let unlc = (upg.unl?upg.unl():true) && (player.options.hideUpgOption ? amt < tu.max[x] : true)
                    tmp.el[div_id].setDisplay(unlc)

                    if (!unlc) continue

                    let res = tmp.upg_res[upg.res]

                    tmp.el[div_id].changeStyle("width",height+"px")
                    tmp.el[div_id].changeStyle("height",height+"px")

                    tmp.el[div_id+"_cost"].setTxt(amt < tu.max[x] ? format(tu.cost[x],0) : "")
                    tmp.el[div_id+"_cost"].setClasses({upg_cost: true, locked: Decimal.lt(res,tu.cost[x]) && amt < tu.max[x]})

                    tmp.el[div_id+"_amt"].setTxt(amt < tu.max[x] ? format(amt,0) : "")
                    tmp.el[div_id+"_max"].setDisplay(amt >= tu.max[x])
                    tmp.el[div_id+"_max_base"].setDisplay(amt >= tu.max[x])
                }
            }
        } else if (upgs.reqDesc) tmp.el["upg_req_desc_"+id].setHTML(upgs.reqDesc())
    }
}

function hasUpgrade(id,x) { return player.upgs[id][x] > 0 }
function upgEffect(id,x,def=1) { return tmp.upgs[id].eff[x] || def }

function resetUpgrades(id) {
    for (let x in UPGS[id].ctn) player.upgs[id][x] = 0
}

function updateUpgResource(id) {
    let [p,q] = UPG_RES[id][1]()
    tmp.upg_res[id] = p[q]
}

function toggleOption(x) { player.options[x] = !player.options[x] }

tmp_update.push(_=>{
    for (let x in UPG_RES) updateUpgResource(x)
    for (let x in UPGS) updateUpgTemp(x)
})

el.setup.upgs = _=>{
    for (let x in UPGS) setupUpgradesHTML(x)
}

el.update.upgs = _=>{
	if (mapID == 'g') {
		updateUpgradesHTML('grass')
		updateUpgradesHTML('aGrass')
		updateUpgradesHTML('unGrass')
        updateUpgradesHTML('planetarium')
	}
	if (mapID == 'p') {
        updateUpgradesHTML('perk')
        updateUpgradesHTML('plat')
        updateUpgradesHTML('observ')
		tmp.el.losePerksBtn.setDisplay(hasUpgrade('auto', 4))
		tmp.el.losePerks.setTxt(player.options.losePerks ? "OFF" : "ON")
	}
	if (mapID == 'auto') updateUpgradesHTML('auto')
	if (mapID == 'pc') {
		updateUpgradesHTML('pp')
		updateUpgradesHTML('crystal')

		updateUpgradesHTML('ap')
		updateUpgradesHTML('oil')

        updateUpgradesHTML('np')
        updateUpgradesHTML('cloud')

        updateUpgradesHTML('astro')
        updateUpgradesHTML('measure')
	}
	if (mapID == 'gh') {
        updateUpgradesHTML('factory')
        updateUpgradesHTML('funnyMachine')
        updateUpgradesHTML('planet')
    }
	if (mapID == 'fd') {
		updateUpgradesHTML('foundry')
		updateUpgradesHTML('gen')

        updateUpgradesHTML('fundry')
        updateUpgradesHTML('sfrgt')
	}
	if (mapID == 'as') {
		updateUpgradesHTML('assembler')
		updateUpgradesHTML('rocket')
	}
	if (mapID == 'rp') {
		updateUpgradesHTML('momentum')
	}
	if (mapID == 'at') {
		updateUpgradesHTML('moonstone')
	}
	if (mapID == 'sac') {
		updateUpgradesHTML('dm')
	}

	if (mapID == 'opt') {
		tmp.el.scientific.setTxt(player.options.scientific?"ON":"OFF")
		tmp.el.grassCap.setTxt(player.options.lowGrass?250:"Unlimited")
		tmp.el.hideUpgOption.setTxt(player.options.hideUpgOption?"ON":"OFF")
		tmp.el.hideMilestoneBtn.setDisplay(player.grasshop > 0 || player.sTimes > 0)
		tmp.el.hideMilestone.setTxt(player.options.hideMilestone?"At last obtained":"All")
	}
	if (mapID == 'time') {
		tmp.el.time.setHTML("Time: " + formatTime(player.time))

		let stats = !tmp.outsideNormal && !inSpace()
		tmp.el.stats.setDisplay(stats || player.options.allStats)
		if (stats || player.options.allStats) {
			tmp.el.statsHeader.setDisplay(player.options.allStats)
			tmp.el.pTimes.setHTML(player.pTimes ? "You have done " + player.pTimes + " <b style='color: #5BFAFF'>Prestige</b> resets." + (tmp.outsideNormal ? "" : "<br>Time: " + formatTime(player.pTime)) + "<br>" : "")
			tmp.el.cTimes.setHTML(player.cTimes ? "You have done " + player.cTimes + " <b style='color: #FF84F6'>Crystalize</b> resets." + (tmp.outsideNormal ? "" : "<br>Time: " + formatTime(player.cTime)) + "<br>" : "")
			tmp.el.sTimes.setHTML(player.sTimes ? "You have done " + player.sTimes + " <b style='color: #c5c5c5'>Steelie</b> resets." + (tmp.outsideNormal ? "" : "<br>Time: " + formatTime(player.sTime)) + "<br>" : "")
		}

		let aStats = player.decel && !inSpace()
		tmp.el.aStats.setDisplay(aStats || player.options.allStats)
		if (aStats || player.options.allStats) {
			tmp.el.aStatsHeader.setDisplay(player.options.allStats)
			tmp.el.aTimes.setHTML(player.aTimes ? "You have done " + player.aTimes + " <b style='color: #FF4E4E'>Anonymity</b> resets." + (!player.decel ? "" : "<br>Time: " + formatTime(player.aTime)) + "<br>" : "")
			tmp.el.lTimes.setHTML(player.lTimes ? "You have done " + player.lTimes + " <b style='color: #2b2b2b'>Liquefy</b> resets." + (!player.decel ? "" : "<br>Time: " + formatTime(player.lTime)) + "<br>" : "")
			tmp.el.fTimes.setHTML(player.fTimes ? "You have done " + player.fTimes + " <b style='color: #ffff79'>Funify</b> resets." + (!player.decel ? "" : "<br>Time: " + formatTime(player.fTime)) + "<br>" : "")
		}

		let uStats = player.recel && !inSpace()
		let uStatsUnl = hasUpgrade("funnyMachine", 4) && uStats
		tmp.el.uStats.setDisplay(uStatsUnl)
		if (uStatsUnl) {
			tmp.el.uStatsHeader.setDisplay(player.options.allStats)
			tmp.el.nTimes.setHTML(player.nTimes ? "You have done " + player.nTimes + " <b style='color: #8fcc00'>Normality</b> resets." + (!player.recel ? "" : "<br>Time: " + formatTime(player.nTime)) + "<br>" : "")
		}

		let gStats = inSpace()
		let gStatsUnl = player.gTimes && gStats
		tmp.el.gStats.setDisplay(gStatsUnl)
		if (gStatsUnl) {
			tmp.el.gStatsHeader.setDisplay(player.options.allStats)
			tmp.el.gTimes.setHTML(player.gTimes ? "You have done " + player.gTimes + " <b style='color: #505'>Galactic</b> resets.<br>Time: " + formatTime(player.gTime) + "<br>" : "")
			tmp.el.sacTimes.setHTML(player.sacTimes ? "You have done " + player.sacTimes + " <b style='color: #305'>Sacrifice</b> resets.<br>Time: " + formatTime(player.sacTime) + "<br>" : "")
		}

		tmp.el.allStatsBtn.setDisplay(hasUpgrade('factory', 4) || player.gTimes > 0)
		tmp.el.allStats.setTxt(player.options.allStats ? "All" : "This realm")
	}
}
