const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const scripts = [...fs.readFileSync(path.join(root, 'index.html'),'utf8').matchAll(/<script src="(js\/[^"?]+)(?:\?[^"<>]*)?"/g)].map(m=>m[1]);

function engine() {
  const storage = new Map(), intervals = new Set(); let intervalId=0;
  const context = vm.createContext({ console, Date, Math, btoa, atob, Number, JSON, Object, Array,
    window: {addEventListener(){}}, document:{ getElementById(){return null;} },
    setTimeout(){}, clearTimeout(){}, setInterval(){intervals.add(++intervalId);return intervalId;}, clearInterval(id){intervals.delete(id);},
    localStorage: {getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
    alert(message){throw new Error('Unexpected alert: '+message);}, confirm(){return false;}
  });
  for(const script of scripts)vm.runInContext(fs.readFileSync(path.join(root,script),'utf8'),context,{filename:script});
  const run = code => vm.runInContext(code,context);
  run(`for(const id in UPGS){UPGS_SCOST[id]=UPGS[id].ctn.map(u=>u.cost(0));}for(const id in STAR_CHART){SC_SCOST[id]=STAR_CHART[id].map(u=>u.cost(0));}load();`);
  return {run,storage,intervals};
}

test('a new game ticks without non-finite values and spawns cuttable grass',()=>{
  const {run}=engine();
  run('for(let i=0;i<100;i++){updateTemp();calc(.1);}');
  assert.equal(run('findNaN(player)'),false);
  assert.equal(run('player.astralPrestige'),0);
  assert.equal(run('tmp.grasses.length'),4);
  assert.ok(run('player.nTime > 9'));
  run('removeGrass(0);updateTemp();');
  assert.equal(run('player.grass.toNumber()'),5);
  assert.equal(run('player.xp.toNumber()'),3);
  assert.equal(run('tmp.grasses.length'),3);
});
test('buying spends currency, applies the effect, and cannot overspend',()=>{
  const {run}=engine();
  run("buyUpgrade('grass',0)");assert.equal(run('player.upgs.grass[0]||0'),0);
  run("player.grass=E(10);updateTemp();buyUpgrade('grass',0);updateTemp();");
  assert.equal(run('player.grass.toNumber()'),0);
  assert.equal(run('player.upgs.grass[0]'),1);
  assert.equal(run('tmp.grassGain.toNumber()'),10);
  run("buyUpgrade('grass',0)");assert.equal(run('player.upgs.grass[0]'),1);
});
test('level-gated automation and challenge restrictions apply to the engine too',()=>{
  const {run}=engine();
  run("player.grass=E('1e12');updateTemp();buyUpgrade('auto',0);");
  assert.equal(run('player.upgs.auto[0]||0'),0);
  run("player.level=5;updateTemp();buyUpgrade('auto',0);updateTemp();");
  assert.ok(run('player.upgs.auto[0]>0'));
  run("player.chal.progress=1;updateTemp();buyUpgrade('grass',0);");
  assert.equal(run('player.upgs.grass[0]||0'),0);
});
test('prestige enforces level 30 and keeps prestige rewards across the reset',()=>{
  const {run}=engine();
  run('player.level=29;updateTemp();RESET.pp.reset();');assert.equal(run('player.pTimes'),0);
  run("player.level=30;player.grass=E(10000);updateTemp();RESET.pp.reset();");
  assert.equal(run('player.level'),0);assert.equal(run('player.grass.toNumber()'),0);
  assert.equal(run('player.pTimes'),1);assert.ok(run('player.pp.gt(0)'));
  assert.equal(run('findNaN(player)'),false);
});
test('crystallizing resets prestige resources and retains platinum',()=>{
  const {run}=engine();
  run("player.level=100;player.pTimes=1;player.pp=E(100);player.plat=12;updateTemp();RESET.crystal.reset();");
  assert.equal(run('player.level'),0);assert.equal(run('player.pp.toNumber()'),0);
  assert.equal(run('player.plat'),12);assert.equal(run('player.cTimes'),1);assert.ok(run('player.crystal.gt(0)'));
});
test('automated cuts produce resources and stay bounded at very high rates',()=>{
  const {run}=engine();
  run("player.level=5;player.grass=E('1e12');updateTemp();buyUpgrade('auto',0);updateTemp();for(let i=0;i<tmp.grassCap;i++)createGrass();player.grass=E(0);calc(6);updateTemp();");
  assert.ok(run('player.grass.gt(0)'));assert.equal(run('findNaN(player)'),false);
  run('tmp.grassSpawn=.0002;tmp.autocut=.01;tmp.autocutAmt=100000;tmp.spawnAmt=100000;calc(3600);');
  assert.ok(run('tmp.grasses.length <= tmp.grassCap'));assert.equal(run('findNaN(player)'),false);
});
test('save, reload and repeated imports retain progression without leaking timers',()=>{
  const {run,storage,intervals}=engine();
  run("player.grass=E('1e45');player.pTimes=4;player.astralPrestige=2;save();");
  assert.ok(storage.get('grassland_save_v1'));
  run("load(localStorage.getItem('grassland_save_v1'));");
  assert.equal(run('player.grass.eq(1e45)'),true);assert.equal(run('player.pTimes'),4);assert.equal(run('player.astralPrestige'),2);
  for(let i=0;i<5;i++)run("load(localStorage.getItem('grassland_save_v1'))");
  assert.equal(intervals.size,1);assert.equal(run('typeof clearInterval'),'function');
});
test('imports reject malformed data, invalid upgrade levels and dangerous keys',()=>{
  const {run}=engine();
  assert.throws(()=>run("validateSave('not a save')"));
  assert.throws(()=>run("validateSave(btoa('{}'))"));
  assert.throws(()=>run("const bad=getPlayerData();bad.upgs.grass=[-10];validateSave(btoa(JSON.stringify(bad)));"));
  assert.throws(()=>run("const poison=JSON.parse(JSON.stringify(getPlayerData()));poison.options=JSON.parse('{\"__proto__\":{\"polluted\":true}}');validateSave(btoa(JSON.stringify(poison)));"));
  assert.throws(()=>run("const badShape=getPlayerData();badShape.planetoid=[];validateSave(btoa(JSON.stringify(badShape)));"));
  assert.equal(run('player.grass.toNumber()'),0);
});
test('saved achievement identifiers are data, not nested base64 saves',()=>{
  const {run}=engine();
  run("player.garden={cuts:25,savedAt:Date.now(),sound:false,particles:true,badges:['first','hundred']};save();load(localStorage.getItem('grassland_save_v1'));");
  assert.equal(run("player.garden.badges.join(',')"),'first,hundred');
  assert.equal(run('findNaN(player)'),false);
});
test('the integrity check inspects nested fields after the first object',()=>{
  const {run}=engine();
  assert.equal(run('findNaN({first:{ok:1},second:{bad:NaN}})'),true);
  assert.equal(run('findNaN({first:{ok:1},second:{ok:2}})'),false);
});
