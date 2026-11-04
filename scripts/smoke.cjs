const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {spawn}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:3177';
const delay=ms=>new Promise(r=>setTimeout(r,ms));
let server,browser;
const failures=[],checks=[];
function passed(name){checks.push(name);console.log('PASS',name);}
async function main(){
  if(!process.env.TEST_BASE_URL){server=spawn(process.execPath,['server.mjs'],{cwd:root,env:{...process.env,PORT:'3177',HOST:'127.0.0.1'},stdio:'pipe'});server.stderr.on('data',d=>process.stderr.write(d));}
  for(let i=0;i<50;i++){try{const r=await fetch(base);if(r.ok)break;}catch{}if(i===49)throw Error('The local server did not start.');await delay(100);}
  const executablePath=process.env.CHROMIUM_PATH||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined);
  browser=await chromium.launch({headless:true,executablePath,args:['--no-sandbox']});
  const context=await browser.newContext({viewport:{width:1440,height:1000}});
  const page=await context.newPage();
  page.on('pageerror',e=>failures.push(e.message));
  page.on('console',m=>{if(m.type()==='error')failures.push(m.text());});
  page.on('dialog',async d=>{failures.push('Unexpected native dialog: '+d.message());await d.dismiss();});
  await page.goto(base);
  await page.waitForFunction(()=>gameReady&&tmp.grasses.length===10);
  assert.equal(await page.locator('#page-title').textContent(),'Un corte más.');
  passed('New game starts with 10 harvestable grass clumps');
  for(let i=0;i<6;i++){
    const pos=await page.evaluate(()=>{const g=tmp.grasses[0],r=grass_canvas.getBoundingClientRect();return {x:r.x+Math.min(r.width*g.x,r.width-G_SIZE)+G_SIZE/2,y:r.y+Math.min(r.height*g.y,r.height-G_SIZE)+G_SIZE/2};});
    await page.mouse.move(pos.x,pos.y);await delay(80);
  }
  assert.ok(await page.evaluate(()=>player.grass.gte(30)&&player.xp.gte(18)&&player.garden.cuts>=6));
  passed('Moving the pointer harvests grass and grants currency and XP');
  await page.locator('#garden-upg-grass-0').click();
  assert.equal(await page.evaluate(()=>player.upgs.grass[0]),1);
  assert.ok(await page.locator('#garden-upg-grass-4').isDisabled());
  passed('Workshop purchases spend currency; unaffordable upgrades are disabled');
  const canvas=page.locator('#grass_canvas');await canvas.focus();
  const before=await page.evaluate(()=>mower.x);await page.keyboard.down('d');await delay(220);await page.keyboard.up('d');
  assert.ok(await page.evaluate(()=>mower.x)>before);assert.equal(await page.evaluate(()=>mapID),'g');
  passed('Focused-canvas keyboard controls move the mower without changing pages');
  await page.locator('#navigation [data-action="map"]').click();
  assert.ok(await page.locator('#game-dialog').isVisible());
  assert.ok(await page.locator('.world-tile[data-route="rp"]').isDisabled());
  assert.ok(await page.locator('.world-tile[data-route="sc"]').isDisabled());
  await page.locator('#close-dialog').click();
  passed('World map exposes real progression locks');
  await page.evaluate(()=>{player.xp=MAIN.level.req(29);updateTemp();MAIN.checkCutting();updateTemp();});
  await page.locator('#navigation [data-route="pc"]').click();
  await page.locator('#reset_btn_pp').click();
  assert.ok(await page.locator('#game-dialog').isVisible());
  await page.locator('#confirm-layer-reset').click();
  assert.equal(await page.evaluate(()=>player.level),0);assert.equal(await page.evaluate(()=>player.pTimes),1);
  assert.ok(await page.evaluate(()=>player.pp.gt(0)));
  passed('Manual prestige asks for confirmation and awards PP while resetting the run');
  await page.evaluate(()=>{player.grass=E(12345);save();});
  await page.reload();await page.waitForFunction(()=>gameReady);
  assert.ok(await page.evaluate(()=>player.grass.eq(12345)&&player.pTimes===1));
  passed('Reload restores currencies and progression');
  await page.evaluate(()=>navigate('opt'));
  await page.locator('#import-save').click();await page.locator('#import-text').fill('definitely not a save');await page.locator('#confirm-import').click();
  assert.match(await page.locator('#import-error').textContent(),/No se pudo importar/);
  assert.ok(await page.evaluate(()=>player.grass.eq(12345)));
  await page.locator('#close-dialog').click();
  passed('Invalid imports leave the current game intact');
  await page.locator('#export-save').click({trial:true});
  const downloadEvent=page.waitForEvent('download');await page.locator('#export-save').click();const download=await downloadEvent;
  const stream=await download.createReadStream();let exported='';for await(const chunk of stream)exported+=chunk.toString();
  assert.ok(JSON.parse(Buffer.from(exported,'base64').toString()).grass);
  await page.locator('#import-save').click();await page.locator('#import-text').fill(exported);await page.locator('#confirm-import').click();
  await page.waitForFunction(()=>!document.getElementById('game-dialog').open);
  assert.ok(await page.evaluate(()=>player.grass.eq(12345)));
  passed('Exported saves can be imported again');
  // Advanced fixtures validate actual core branches without claiming a months-long playthrough.
  await page.evaluate(()=>{
    player.pTimes=3;player.cTimes=2;player.level=350;player.grasshop=12;player.gTimes=1;player.lowGH=-60;player.grassjump=5;player.astralPrestige=0;
    for(const key of ['grass','pp','crystal','steel','aGrass','ap','oil','stars','sp','fun','SFRGT','dm','np','unGrass','cloud'])player[key]=E('1e30');
    player.upgs.factory=UPGS.factory.ctn.map(()=>1);player.chalUnl=true;updateTemp();calc(.1);updateTemp();
  });
  for(const id of ['g','p','auto','pc','gh','fd','as','rp','chal','stats','time','sc','at','sac','ap']){
    assert.equal(await page.evaluate(id=>navigate(id),id),true,`route ${id} should be unlocked`);
    await delay(100);assert.ok(await page.locator('#map_div_'+id).isVisible(),`route ${id} should render`);
    assert.equal(await page.evaluate(()=>findNaN(player)),false,`route ${id} should retain finite data`);
  }
  passed('All 15 gameplay pages render with advanced progression fixtures');
  fs.mkdirSync(path.join(root,'test-results'),{recursive:true});
  await page.evaluate(()=>{navigate('g');});await page.screenshot({path:path.join(root,'test-results','desktop.png'),fullPage:true});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  passed('Desktop layout has no horizontal overflow');
  const mobileContext=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1});
  const mobile=await mobileContext.newPage();mobile.on('pageerror',e=>failures.push('mobile: '+e.message));
  await mobile.goto(base);await mobile.waitForFunction(()=>gameReady&&tmp.grasses.length>0);
  const pos=await mobile.evaluate(()=>{const g=tmp.grasses[0],r=grass_canvas.getBoundingClientRect();return{x:r.x+Math.min(r.width*g.x,r.width-G_SIZE)+7,y:r.y+Math.min(r.height*g.y,r.height-G_SIZE)+7};});
  await mobile.touchscreen.tap(pos.x,pos.y);await delay(180);
  // A short touch may begin and end between frames, so the down event cuts immediately.
  assert.ok(await mobile.evaluate(()=>player.garden.cuts>=1));
  assert.equal(await mobile.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await mobile.screenshot({path:path.join(root,'test-results','mobile.png'),fullPage:true});
  await mobile.locator('#navigation [data-route="p"]').click();
  assert.ok(await mobile.locator('#map_div_p').isVisible());
  passed('Touch cutting and navigation work without mobile horizontal overflow');
  assert.deepEqual(failures,[]);
  console.log(`\n${checks.length} browser checks passed; no console errors or uncaught exceptions.`);
}
main().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{await browser?.close();server?.kill();});
