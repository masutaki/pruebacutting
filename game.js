/* Grassland presentation layer. The full MIT-licensed GCI engine lives in js/. */
'use strict';

const svgPaths = {
  leaf: '<path d="M20 4C9 3 3 7 5 14c2 7 13 6 15-10Z"/><path d="m4 21 11-11"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
  sprout: '<path d="M12 21V10M12 15C3 17 1 7 7 8c4 0 5 5 5 7Zm0-5c0-7 9-9 9-4s-6 6-9 4Z"/>',
  robot: '<rect x="4" y="7" width="16" height="13" rx="4"/><path d="M12 3v4M1 12v5m22-5v5m-15-5h1m6 0h1m-7 4h6"/>',
  crystal: '<path d="m12 2 8 6v9l-8 5-8-5V8l8-6Zm0 0v20M4 8l8 5 8-5"/>',
  map: '<path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2V5Zm6-2v16m6-14v16"/>',
  chart: '<path d="M4 3v17h17M8 15l4-5 4 2 5-7"/>',
  settings: '<path d="m10 3-1 3-3 1-3 3 2 3-1 3 3 3 3-1 3 2 3-2 3-1 1-4-2-2 1-3-3-2-3 1-3-1Z"/><circle cx="12" cy="12" r="3"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 0 1 6 0c0 2-3 2-3 4m0 3h.01"/>',
  arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  chevron: '<path d="m9 5 7 7-7 7"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1"/>',
  trophy: '<path d="M7 3h10v6a5 5 0 0 1-10 0V3Zm0 2H3v3a5 5 0 0 0 5 5m9-8h4v3a5 5 0 0 1-5 5m-4 1v6m-5 1h10"/>',
  volume: '<path d="m11 4-6 5H2v6h3l6 5V4Zm4 4a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',
  save: '<path d="M4 3h14l3 3v15H3V3h1Zm3 0v6h10V3M7 21v-8h10v8"/>',
  star: '<path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6Z"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
  scissors: '<circle cx="5" cy="6" r="3"/><circle cx="5" cy="18" r="3"/><path d="m8 8 13 13M8 16 21 3"/>'
};
function icon(name, cls='') { return `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${svgPaths[name] || svgPaths.leaf}</svg>`; }
const $ = id => document.getElementById(id);
const titleES = {
  'Grass Upgrades':'Mejoras de hierba', 'Grass Value':'Hierba de calidad', 'More Grass':'Una pradera más llena', 'Grow Speed':'Brotes rápidos', 'XP':'Experiencia', 'Range':'Un poco más lejos',
  'Perk Upgrades':'Talentos', 'Value Perk':'Valor natural', 'Cap Perk':'Espacio para crecer', 'Grow Speed Perk':'Primavera eterna', 'XP Perk':'Raíces del saber', 'Range Perk':'Alcance natural', 'Spawn Perk':'Brotes gemelos',
  'Automation Upgrades':'Automatización', 'Auto Upgrades':'Automatización', 'Prestige Upgrades':'Mejoras de prestigio', 'Crystal Upgrades':'Mejoras de cristales', 'Platinum Upgrades':'Mejoras de platino',
  'Auto Cut':'Corte automático', 'Auto-Cut':'Corte automático', 'Auto Cut Bonus':'Cosecha automática', 'Auto Cut Amount':'Más cortes automáticos', 'Auto Grass Upgrades':'Taller automático',
  'Factory Upgrades':'La fábrica', 'Foundry Upgrades':'La fundición', 'Generator Upgrades':'El generador', 'Rocket Upgrades':'Cohetes', 'Moonstone Upgrades':'Piedra lunar',
  'Grass Value II':'Hierba de calidad II', 'Grass Value III':'Hierba de calidad III', 'XP II':'Experiencia II', 'XP III':'Experiencia III', 'Tier':'Rango', 'TP':'Experiencia de rango',
  'Grass Field':'Pradera', 'Perk & Platinum':'Talentos y platino', 'Prestige & Crystal':'Prestigio y cristales'
};
const tr = text => titleES[text] || text;
const descES = {
  grass: ['Cada brizna vale un poco más.', 'Aumenta la cantidad de hierba.', 'La hierba vuelve a crecer antes.', 'Gana más experiencia por corte.', 'Amplía el área de tu cortacésped.'],
  perk: ['Más hierba según tu nivel.', 'Diez espacios más por nivel.', 'Un 25% más de crecimiento.', 'Más experiencia según tu nivel.', 'Llega más lejos con cada corte.', 'Genera más hierba a la vez.']
};
const ROUTES = [
  {id:'g',name:'La pradera',icon:'leaf',tag:'TU JARDÍN',title:'Un corte más.',sub:'Un pequeño jardín. Infinitas posibilidades.'},
  {id:'p',name:'Talentos',icon:'sprout',tag:'CRECE A TU MANERA',title:'Cultiva tu talento.',sub:'Cada nivel abre nuevas posibilidades. Los talentos se compran con puntos de nivel.'},
  {id:'auto',name:'Automatización',icon:'robot',tag:'TRABAJA CON CALMA',title:'Deja que crezca.',sub:'Corte automático y mejoras que trabajan por ti. Se desbloquean en el nivel 5.'},
  {id:'pc',name:'Prestigio',icon:'crystal',tag:'VOLVER A FLORECER',title:'Cada comienzo cuenta.',sub:'Reinicia tu progreso a cambio de multiplicadores cada vez más poderosos.'},
  {id:'gh',name:'Grasshop',icon:'sun',tag:'MÁS ALLÁ DE LA HIERBA',title:'Da el siguiente salto.',sub:'Grasshop, acero y una fábrica llena de posibilidades.'},
  {id:'fd',name:'La fábrica',icon:'settings',tag:'EL MOTOR DE TU JARDÍN',title:'Ideas que producen.',sub:'Fundiciones, generadores y carga para dar un paso más.'},
  {id:'as',name:'Ensamblaje',icon:'settings',tag:'UN NUEVO REINO',title:'Construye el futuro.',sub:'Ensambladores, refinerías y combustible para tu cohete.'},
  {id:'rp',name:'Lanzamiento',icon:'star',tag:'EL CIELO NO ES EL LÍMITE',title:'Rumbo a las estrellas.',sub:'Construye tu cohete y descubre la progresión galáctica.'},
  {id:'chal',name:'Desafíos',icon:'trophy',tag:'PONTE A PRUEBA',title:'Un jardín, otras reglas.',sub:'Completa desafíos para conseguir mejoras permanentes.'},
  {id:'stats',name:'Estadísticas',icon:'chart',tag:'CADA BRIZNA CUENTA',title:'Mira cuánto has crecido.',sub:'Desglosa tus multiplicadores y descubre qué impulsa tu progreso.'},
  {id:'time',name:'Tu recorrido',icon:'clock',tag:'SIN NINGUNA PRISA',title:'Todo lo que has cultivado.',sub:'Tiempo jugado y estadísticas de cada capa de reinicio.'},
  {id:'opt',name:'Ajustes',icon:'settings',tag:'A TU MANERA',title:'Como en casa.',sub:'Tu partida vive en este navegador. Exporta una copia para llevarla contigo.'},
  {id:'sc',name:'Carta estelar',icon:'star',tag:'UN UNIVERSO POR CULTIVAR',title:'Escrito en las estrellas.',sub:'Elige tu camino a través de la carta estelar.'},
  {id:'at',name:'Astral',icon:'sun',tag:'OTRA ESCALA',title:'Polvo de estrellas.',sub:'Progresión astral, piedra lunar y nuevos hitos.'},
  {id:'sac',name:'Sacrificio',icon:'crystal',tag:'OTRO COMIENZO',title:'El otro lado del cielo.',sub:'Materia oscura y el camino al planetoide.'},
  {id:'ap',name:'Obeliscos lunares',icon:'map',tag:'EL JARDÍN CÓSMICO',title:'Más allá del horizonte.',sub:'Prestigio astral, poder lunar y obeliscos.'}
];
let buyMode='once', lastSave=0, storageAvailable=true, particles=[], lastFrame=performance.now(), toastTimer;
let gardenKeys=new Set(), mower={x:.5,y:.56,active:false,angle:0}, pointerHeld=false, gameReady=false, soundContext;
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function put(id,text) { const node=$(id);if(node && node.textContent!==String(text))node.textContent=text; }
function html(id,text) { const node=$(id);if(node && node.innerHTML!==text)node.innerHTML=text; }
function toast(message, kind='leaf') { html('toast',icon(kind)+`<span>${message}</span>`);$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),3500); }
function sound(frequency=550) {
  if(!player.garden?.sound)return;
  try { soundContext ||= new (window.AudioContext || window.webkitAudioContext)();soundContext.resume();const o=soundContext.createOscillator(),gain=soundContext.createGain();o.type='sine';o.frequency.value=frequency;gain.gain.setValueAtTime(.025,soundContext.currentTime);gain.gain.exponentialRampToValueAtTime(.0001,soundContext.currentTime+.12);o.connect(gain);gain.connect(soundContext.destination);o.start();o.stop(soundContext.currentTime+.13); }catch{}
}
function ensureGarden() { const g=player.garden||{};player.garden={cuts:Number.isFinite(g.cuts)?Math.max(0,g.cuts):0,savedAt:Number.isFinite(g.savedAt)?Math.max(0,g.savedAt):0,sound:g.sound===true,particles:g.particles!==false,badges:Array.isArray(g.badges)?[...new Set(g.badges.filter(id=>BADGES.some(b=>b[0]===id)))]:[]}; }

function prepareShell() {
  const brand=`<span class="brand-mark">${icon('sprout')}</span><span class="brand-name">grassland<span>INCREMENTAL</span></span>`;
  document.body.insertAdjacentHTML('afterbegin',`
    <aside id="sidebar"><a class="brand" href="#" aria-label="Grassland, volver a la pradera">${brand}</a><div class="nav-caption">TU RINCÓN VERDE</div><nav id="navigation" aria-label="Navegación del juego"></nav><div class="sidebar-note">Un pequeño corte.<br>Un mundo por descubrir.<span class="note-flower">✳</span></div><div class="sidebar-bottom"><button data-action="help">${icon('help')}<span>Cómo jugar</span></button><button data-route="opt">${icon('settings')}<span>Ajustes</span></button></div><span class="version">REWORK 2D · v1.0</span></aside>
    <header class="topbar"><div class="breadcrumb">TU PEQUEÑO IMPERIO VERDE <span>/</span> <b id="breadcrumb">La pradera</b></div><div class="resources"><div class="resource grass-resource" title="Hierba: la moneda del jardín">${icon('leaf')}<span><small>HIERBA</small><b id="resource-grass">0</b></span></div><div class="resource" title="Puntos de prestigio, a partir del nivel 30">${icon('crystal')}<span><small>PRESTIGIO</small><b id="resource-pp">0</b></span></div><div class="resource crystal-resource" title="Cristales, a partir del nivel 100">${icon('star')}<span><small>CRISTALES</small><b id="resource-crystal">0</b></span></div><button class="icon-button" id="sound-toggle" title="Activar sonido" aria-label="Activar sonido" aria-pressed="false">${icon('volume')}</button></div></header>
    <main id="shell-main"><div class="page-heading"><div><div class="eyebrow"><span class="tiny-flower">✳</span><span id="page-tag">TU JARDÍN</span></div><h1 id="page-title">Un corte más<span>.</span></h1><p id="page-subtitle">Un pequeño jardín. Infinitas posibilidades.</p></div><div class="level-widget"><span class="level-badge">${icon('sprout')}</span><div><div class="level-label"><b id="shell-level">Nivel 0</b><span id="shell-xp">0 / 50 XP</span></div><div class="progress-track"><div id="shell-xp-bar"></div></div><small id="next-unlock">Cada nivel te da un punto de talento.</small></div></div></div><div id="page-host"></div><footer class="site-footer"><span id="save-status"><i></i> Guardado automático activo</span><span>Sin prisas. Solo un corte más. ${icon('sprout')}</span><button id="credits-button">Créditos y licencia</button></footer></main>
    <div id="toast" role="status" aria-live="polite"></div><dialog id="game-dialog" aria-labelledby="dialog-title"><div class="dialog-top"><span class="eyebrow" id="dialog-eyebrow">GRASSLAND</span><button class="icon-button" id="close-dialog" aria-label="Cerrar">${icon('close')}</button></div><h2 id="dialog-title"></h2><div id="dialog-body"></div></dialog>`);
  document.querySelector('.resources').insertAdjacentHTML('beforeend',`<button class="icon-button mobile-settings" data-route="opt" aria-label="Ajustes">${icon('settings')}</button>`);
  $('page-host').append($('main_app'));
  const navItems=['g','p','auto','pc'];
  $('navigation').innerHTML=navItems.map(id=>{const r=ROUTES.find(r=>r.id===id);return `<button data-route="${id}" ${id==='g'?'class="active" aria-current="page"':''}>${icon(r.icon)}<span>${r.name}</span>${id==='auto'?'<span class="nav-dot" id="auto-dot"></span>':''}</button>`;}).join('')+`<div class="nav-divider"></div><button data-action="map">${icon('map')}<span>Explorar</span><span class="nav-arrow">↗</span></button><button data-route="stats">${icon('chart')}<span>Estadísticas</span></button><button data-action="badges">${icon('trophy')}<span>Logros</span><span id="badge-count" class="nav-count">0</span></button>`;
  const field=$('map_div_g'), canvas=$('grass_canvas');
  const shops=['grass','aGrass','unGrass','planetarium'].map(id=>$('upgs_div_'+id));
  const hidden=document.createElement('div');hidden.hidden=true;hidden.id='legacy-field-hud';
  for(const id of ['level_div','tier_div','astral_div','grass_cap_div'])hidden.append($(id));
  field.replaceChildren();field.className='garden-layout';
  field.innerHTML=`<div class="garden-left"><section class="field-card"><div class="field-header"><div class="field-name"><span class="field-icon">${icon('leaf')}</span><div><h2 id="field-title">La pradera</h2><small id="field-subtitle">Un lugar para empezar a crecer</small></div></div><span class="live-label"><i></i> A TU RITMO</span></div><div class="field-stage" id="field-stage"><span class="field-coordinates">PRADERA · 01</span><div class="field-badge">${icon('sun')} Un buen día para cortar</div><div class="field-tooltip" id="field-tooltip">Mueve el cursor para cortar ${icon('scissors')}</div></div><div class="field-footer"><span class="control-tip"><span class="keycap">↗</span> <span>Desliza para cortar</span><span class="control-divider"></span><b id="field-cap">10 / 10</b><span class="muted">briznas</span></span><span class="cut-stat">${icon('leaf')}<b id="cut-value">+5</b><span>por corte</span></span></div></section><div class="garden-info"><div class="info-line">${icon('sprout')}<span>La hierba vuelve a crecer sola. Las mejoras te ayudan a llegar más lejos.</span><button data-action="help" aria-label="Ver controles">${icon('help')}</button></div></div><section class="journey-card"><div class="section-heading"><div><span class="eyebrow">PASO A PASO</span><h2>Tu próximo horizonte</h2></div><button class="text-button" data-action="map">Ver el mundo ${icon('arrow')}</button></div><div class="journey-track"><button class="journey-step" data-route="p"><span class="journey-symbol mint">${icon('sprout')}</span><b>Talentos</b><small>Nivel 1</small><span id="step-perk" class="step-status">Cada nivel cuenta</span></button><span class="journey-dash"></span><button class="journey-step" data-route="pc"><span class="journey-symbol lilac">${icon('crystal')}</span><b>Prestigio</b><small>Nivel 30</small><span id="step-prestige" class="step-status">Volver a florecer</span></button><span class="journey-dash"></span><button class="journey-step" data-route="pc"><span class="journey-symbol peach">${icon('star')}</span><b>Cristales</b><small>Nivel 100</small><span class="step-status">Un nuevo comienzo</span></button></div></section></div><aside class="workshop"><div class="workshop-heading"><div><span class="eyebrow">PEQUEÑAS MEJORAS</span><h2>El taller</h2></div><button id="buy-mode" title="Cambiar cantidad de compra">×1</button></div><div class="workshop-tabs"><span class="selected">${icon('leaf')} Hierba</span><button data-route="p">${icon('sprout')} Talentos ${icon('chevron')}</button></div><div id="garden-shop"></div><div class="prestige-teaser"><span class="teaser-art">✦</span><div><span class="eyebrow">VOLVER A FLORECER</span><h3>Un nuevo comienzo.</h3><p>Alcanza el nivel 30 y convierte tu esfuerzo en prestigio.</p><button data-route="pc">Descubrir el prestigio ${icon('arrow')}</button></div></div></aside>`;
  $('field-stage').prepend(canvas);$('garden-shop').append(...shops);field.append(hidden);
  // Keep every original progression panel, while replacing only their layout.
  const flatPages=['p','auto','pc','gh','fd','as','rp','at','sac','ap'];
  for(const id of flatPages){const page=$('map_div_'+id);const summary=id==='at'?page.firstElementChild.firstElementChild:null;const panels=[...page.querySelectorAll('.upgs_div,.reset_div,.milestone_div,#charger_div,#lunar_obelisk_div')].filter(p=>!p.parentElement.closest('.upgs_div,.reset_div,.milestone_div,#charger_div,#lunar_obelisk_div'));page.replaceChildren(...(summary?[summary]:[]),...panels);page.classList.add('panel-grid');}
  buildSettings();
  $('close-dialog').onclick=closeDialog;
  $('game-dialog').addEventListener('click',e=>{if(e.target===$('game-dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog();}});
  document.addEventListener('click',e=>{const b=e.target.closest('[data-route],[data-action]');if(!b)return;if(b.dataset.route)navigate(b.dataset.route);else if(b.dataset.action==='map')showMap();else if(b.dataset.action==='help')showHelp();else if(b.dataset.action==='badges')showBadges();});
  document.querySelector('.brand').onclick=e=>{e.preventDefault();navigate('g');};
  $('buy-mode').onclick=()=>{buyMode=buyMode==='once'?'next':buyMode==='next'?'max':'once';put('buy-mode',buyMode==='once'?'×1':buyMode==='next'?'×25':'MAX');};
  $('sound-toggle').onclick=()=>{player.garden.sound=!player.garden.sound;updateShell();sound();};
  $('credits-button').onclick=showCredits;
}
function buildSettings(){
  $('map_div_opt').innerHTML=`<div class="settings-grid"><section class="settings-card"><span class="eyebrow">TU PARTIDA, CONTIGO</span><h2>Guardar y continuar</h2><p>El guardado automático se realiza cada 30 segundos y al salir. Puedes importar partidas del rework original.</p><div class="settings-actions"><button class="primary-button" id="manual-save">${icon('save')} Guardar ahora</button><button id="export-save">Exportar partida ↗</button><button id="import-save">Importar partida</button></div><div class="settings-note">${icon('lock')} Todo se guarda en tu navegador. No necesitas una cuenta ni conexión a Internet.</div></section><section class="settings-card"><span class="eyebrow">A TU RITMO</span><h2>Preferencias</h2><div class="setting-row"><span>Notación científica</span><button onclick="toggleOption('scientific')" id="scientific">OFF</button></div><div class="setting-row"><span>Límite de hierba (rendimiento)</span><button onclick="toggleLowGrass()" id="grassCap">Unlimited</button></div><div class="setting-row"><span>Ocultar mejoras al máximo</span><button onclick="toggleOption('hideUpgOption')" id="hideUpgOption">OFF</button></div><div class="setting-row" id="hideMilestoneBtn"><span>Mostrar hitos</span><button onclick="toggleOption('hideMilestone')" id="hideMilestone">All</button></div><div class="setting-row"><span>Partículas al cortar</span><button id="particle-toggle">ON</button></div></section><section class="settings-card danger-card"><h2>Empezar de nuevo</h2><p>Borra toda la progresión de esta adaptación. Exporta una copia antes de reiniciar.</p><button id="reset-save">Borrar partida…</button></section><section class="settings-card"><span class="eyebrow">UN REWORK CON RAÍCES</span><h2>Un juego para perder la noción del tiempo.</h2><p>Basado en Really Grass Cutting Incremental, de MrRedShark77 y TehAarex. Motor completo bajo licencia MIT. Interfaz y campo 2D adaptados para escritorio y móvil.</p><button id="settings-credits">Ver créditos y licencia ↗</button></section></div>`;
  $('manual-save').onclick=()=>{if(save())toast('Partida guardada. Hasta el próximo corte.','save');};
  $('export-save').onclick=()=>exporty();$('import-save').onclick=()=>importy();$('settings-credits').onclick=showCredits;
  $('particle-toggle').onclick=()=>{player.garden.particles=!player.garden.particles;put('particle-toggle',player.garden.particles?'ON':'OFF');};
  $('reset-save').onclick=()=>{showDialog('Empezar de cero',`<p>Esta acción borra tu hierba, talentos, prestigios y todas las capas de progreso. No se puede deshacer.</p><div class="dialog-actions"><button onclick="exporty()">Exportar una copia</button><button class="danger-button" id="confirm-wipe">Sí, borrar mi partida</button></div>`);$('confirm-wipe').onclick=()=>{load();ensureGarden();save();closeDialog();navigate('g');for(let i=0;i<tmp.grassCap;i++)createGrass();toast('Un jardín nuevo. Todo por descubrir.');};};
}
function showDialog(title,body){put('dialog-title',title);$('dialog-body').innerHTML=body;const d=$('game-dialog');if(!d.open)d.showModal();}
function closeDialog(){ $('game-dialog').close(); }
function gardenReset(id){
  const r=RESET[id];if(!r||r.unl&&!r.unl()||r.req&&!r.req())return;
  showDialog(tr(r.title),`<p>${r.resetDesc}</p><p>${r.resetGain?.()||''}</p><div class="dialog-actions"><button onclick="closeDialog()">Seguir cultivando</button><button class="primary-button" id="confirm-layer-reset">Confirmar ${r.resetBtn}</button></div>`);
  $('confirm-layer-reset').onclick=()=>{if((!r.unl||r.unl())&&(!r.req||r.req())){r.reset();ensureGarden();save();closeDialog();updateTemp();updateHTML();toast('Un nuevo comienzo. Un jardín más fuerte.','crystal');}};
}
function showHelp(){showDialog('Cada brizna es un comienzo.',`<div class="help-intro">${icon('sprout')}<p>Corta, mejora, crece. Y cuando llegue el momento, vuelve a empezar con un poco más de poder.</p></div><ol class="help-list"><li><b>Recorre la hierba alta.</b><p>Mueve el ratón por la pradera. En móvil, toca y arrastra. También puedes enfocar el campo y mover el cortacésped con WASD o las flechas.</p></li><li><b>Haz crecer tu jardín.</b><p>Gasta la hierba en el taller. Cada nivel te da un punto para comprar talentos. La automatización se desbloquea al nivel 5.</p></li><li><b>Vuelve a florecer.</b><p>Prestigio en el nivel 30; cristales en el 100; desafíos en el 200; Grasshop en el 300. Después te esperan fábricas, otros reinos y el espacio.</p></li></ol><div class="help-tip">Las flechas y WASD fuera del campo recorren el mapa del rework. Pulsa P para prestigio y C para cristalizar. Los reinicios manuales piden confirmación.</div>`);}
function showCredits(){showDialog('Un juego con raíces.',`<div class="credits-mark">${icon('sprout')}<b>grassland</b></div><p>Adaptación 2D de <a href="https://aarextiaokhiao.github.io/Really-Grass-Cutting-Incremental/" target="_blank" rel="noopener">Really Grass Cutting Incremental · extensión de TehAarex</a>, cuyo original es de <b>MrRedShark77</b>.</p><p>Incluye el motor de progresión completo y sus iconos bajo licencia MIT. Inspirado en Grass Cutting Incremental de Roblox; es un proyecto independiente.</p><p><a href="LICENSE" target="_blank" rel="noopener">Leer licencia MIT ↗</a> · <a href="THIRD_PARTY.md" target="_blank" rel="noopener">Créditos completos ↗</a></p><small>El contenido avanzado conserva las descripciones del rework en inglés.</small>`);}
function routeUnlocked(id){ return !!MAP_UNLS[id]?.() && (!['sc','at','sac','ap'].includes(id)||player.gTimes>0); }
function navigate(id){
  const route=ROUTES.find(r=>r.id===id);if(!route||!routeUnlocked(id)){toast('Esta zona todavía no está desbloqueada.','lock');return false;}
  for(const [dim,rows]of Object.entries(MAP))for(let y=0;y<rows.length;y++){const x=rows[y].indexOf(id);if(x>=0){mapPos.dim=dim;mapPos[dim]=[x,y];switchMapId(id);go_to=false;closeDialog();updateHTML();resizeCanvas();resizeCanvas2();window.scrollTo({top:0,behavior:'instant'});return true;}}
  return false;
}
function showMap(){
  const requirements={gh:'Cristaliza una vez',chal:'Cristaliza una vez · desafíos en nivel 200',fd:'Compra la primera mejora de fábrica',as:'Desbloquea el ensamblador',rp:'Desbloquea la plataforma de lanzamiento',time:'Haz tu primer prestigio',sc:'Realiza un reinicio galáctico',at:'Realiza un reinicio galáctico',sac:'Llega al hito Anti-Grasshop −24',ap:'Llega al hito Anti-Grasshop −48'};
  const list=ROUTES.filter(r=>!['stats','opt','time'].includes(r.id));
  showDialog('Un mundo por descubrir.',`<p class="dialog-lead">De una sola brizna a un universo entero. Cada capa abre el camino a la siguiente.</p><div class="world-grid">${list.map(r=>{const open=routeUnlocked(r.id);return `<button class="world-tile ${open?'':'world-locked'}" data-route="${r.id}" ${open?'':'disabled'}><span class="world-symbol">${icon(r.icon)}</span><b>${r.name}</b><small>${open?'Explorar '+(r.id===mapID?'· Estás aquí':'↗'):requirements[r.id]||'Avanza en el juego'}</small><span class="world-state">${icon(open?'arrow':'lock')}</span></button>`;}).join('')}</div><div class="world-shortcuts"><button data-action="badges">${icon('trophy')} Logros</button><button data-route="stats">${icon('chart')} Estadísticas</button><button data-action="help">${icon('help')} Cómo jugar</button><button data-route="opt">${icon('settings')} Ajustes</button>${player.pTimes?`<button data-route="time">${icon('clock')} Tu recorrido</button>`:''}</div>`);
}
const BADGES=[
  ['first','El primer corte','Corta tu primera brizna.',()=>player.garden.cuts>=1,'leaf'],
  ['hundred','Manos a la hierba','Corta 100 briznas.',()=>player.garden.cuts>=100,'scissors'],
  ['thousand','Un jardín cuidado','Corta 1.000 briznas.',()=>player.garden.cuts>=1000,'sprout'],
  ['level5','Deja que crezca','Alcanza el nivel 5.',()=>player.level>=5,'robot'],
  ['prestige','Volver a florecer','Haz tu primer prestigio.',()=>player.pTimes>0,'crystal'],
  ['crystal','Un nuevo brillo','Cristaliza por primera vez.',()=>player.cTimes>0,'star'],
  ['hop','Un gran salto','Haz tu primer Grasshop.',()=>player.grasshop>0,'sun'],
  ['steel','Corazón de acero','Consigue acero.',()=>player.steel.gt(0),'settings'],
  ['galaxy','Hasta las estrellas','Realiza un reinicio galáctico.',()=>player.gTimes>0,'map'],
  ['cosmic','El jardín cósmico','Visita el planetoide.',()=>player.planetoid.active,'star']
];
function showBadges(){showDialog('Cada pequeño gran paso.',`<p class="dialog-lead">${player.garden.badges.length} de ${BADGES.length} logros. Se conservan a través de todos los reinicios.</p><div class="badge-grid">${BADGES.map(([id,name,desc,,symbol])=>`<div class="badge-card ${player.garden.badges.includes(id)?'earned':''}"><span>${icon(symbol)}</span><div><b>${name}</b><small>${desc}</small></div>${icon(player.garden.badges.includes(id)?'check':'lock')}</div>`).join('')}</div>`);}

// Accessible upgrade cards use the original prices, effects, caps and currencies.
setupUpgradesHTML=function(id){
  const panel=$('upgs_div_'+id);if(!panel)return;
  const group=UPGS[id];panel.classList.add(id);
  panel.innerHTML=`<div class="upgrade-head"><h3>${tr(group.title)}</h3><div><button class="buyAllUpg" onclick="gardenBuyAll('${id}')" title="Compra el máximo de cada mejora disponible">Comprar todo</button><button id="upg_auto_${id}" onclick="switchAutoUpg('${id}')">Auto: OFF</button>${group.btns||''}</div></div><div id="upg_req_div_${id}" class="group-requirement"></div><div id="upgs_ctn_${id}" class="upgrade-list">${group.ctn.map((upg,x)=>`<div class="upgrade-row" id="upg_row_${id}${x}"><button class="upgrade-card" id="garden-upg-${id}-${x}" onclick="gardenPurchase('${id}',${x})"><span class="upgrade-art"><img src="images/${upg.icon?.at(-1)||'Icons/Placeholder'}.png" alt="" draggable="false"></span><span class="upgrade-copy"><b>${tr(upg.title)}</b><small>${descES[id]?.[x]||'Mejora permanente de esta capa.'}</small><span class="upgrade-level" id="garden-upg-level-${id}-${x}">NIVEL 0</span></span><span class="upgrade-price" id="garden-upg-cost-${id}-${x}">0</span></button><button class="upgrade-info" onclick="showUpgradeInfo('${id}',${x})" aria-label="Detalles: ${tr(upg.title)}">i</button></div>`).join('')}</div><div id="upg_under_${id}" class="upgrade-under"></div>`;
};
updateUpgradesHTML=function(id){
  const g=UPGS[id],panel=$('upgs_div_'+id),tu=tmp.upgs[id];if(!panel)return;
  const unlocked=g.unl?g.unl():true;panel.style.display=unlocked?'':'none';if(!unlocked)return;
  const req=g.req?g.req():true;$('upgs_ctn_'+id).hidden=!req;$('upg_req_div_'+id).hidden=req;
  if(!req){html('upg_req_div_'+id,icon('lock')+`<p>${g.reqDesc?.()||'Avanza para desbloquear estas mejoras.'}</p>`);return;}
  if(g.underDesc)html('upg_under_'+id,g.underDesc());
  const ab=$('upg_auto_'+id);ab.hidden=!tu.autoUnl;if(tu.autoUnl)put(ab.id,'Auto: '+(player.autoUpg[id]?'ON':'OFF'));
  for(let x=0;x<g.ctn.length;x++){
    const u=g.ctn[x],amt=player.upgs[id][x]||0,maxed=amt>=tu.max[x];
    const visible=(!u.unl||u.unl())&&(!player.options.hideUpgOption||!maxed);$('upg_row_'+id+x).hidden=!visible;if(!visible)continue;
    const available=!tu.cannotBuy&&!maxed&&Decimal.gte(tmp.upg_res[u.res],tu.cost[x]);
    const button=$(`garden-upg-${id}-${x}`);button.disabled=!available;button.classList.toggle('maxed',maxed);
    button.setAttribute('aria-label',`${tr(u.title)}, nivel ${format(amt,0)}, ${maxed?'máximo':format(tu.cost[x],0)+' '+UPG_RES[u.res][0]}`);
    put(`garden-upg-level-${id}-${x}`,`NIVEL ${format(amt,0)}${u.effDesc?'  ·  '+u.effDesc(tu.eff[x]).replace(/<[^>]*>/g,''):''}`);
    html(`garden-upg-cost-${id}-${x}`,maxed?icon('check'):format(tu.cost[x],0)+`<img src="images/${UPG_RES[u.res][3]}.png" alt="${UPG_RES[u.res][0]}">`);
  }
};
function gardenPurchase(id,x){const old=player.upgs[id][x]||0;buyUpgrade(id,x,buyMode);if((player.upgs[id][x]||0)>old){sound(640);toast(tr(UPGS[id].ctn[x].title)+' · nivel '+format(player.upgs[id][x],0),'sprout');updateTemp();updateHTML();}}
function gardenBuyAll(id){const before=JSON.stringify(player.upgs[id]);buyAllUpgrades(id);if(JSON.stringify(player.upgs[id])!==before){sound(720);toast('Herramientas listas. A por otro corte.','sprout');}updateTemp();updateHTML();}
function showUpgradeInfo(id,x){const u=UPGS[id].ctn[x],tu=tmp.upgs[id];showDialog(tr(u.title),`<div class="upgrade-description"><p>${u.desc||'Mejora esta capa de progresión.'}</p><p>Nivel <b>${format(player.upgs[id][x]||0,0)} / ${format(tu.max[x],0)}</b></p>${u.effDesc?`<p>Efecto actual: <b>${u.effDesc(tu.eff[x])}</b></p>`:''}<p>Próxima mejora: <b>${format(tu.cost[x],0)} ${UPG_RES[u.res][0]}</b></p></div><button class="primary-button" id="dialog-purchase">Comprar mejora ${icon('arrow')}</button>`);$('dialog-purchase').disabled=tu.cannotBuy||!Decimal.gte(tmp.upg_res[u.res],tu.cost[x])||(player.upgs[id][x]||0)>=tu.max[x];$('dialog-purchase').onclick=()=>{gardenPurchase(id,x);showUpgradeInfo(id,x);};}

function updateShell(){
  if(!player.garden)ensureGarden();
  const r=ROUTES.find(r=>r.id===mapID)||ROUTES[0];put('breadcrumb',r.name);put('page-tag',r.tag);html('page-title',r.title.replace(/\.$/,'<span>.</span>'));put('page-subtitle',r.sub);
  document.querySelectorAll('#navigation [data-route]').forEach(b=>{b.classList.toggle('active',b.dataset.route===mapID);if(b.dataset.route===mapID)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
  const pa=player.planetoid.active, xp=pa?tmp.cosmicLevel:tmp.level;
  put('shell-level','Nivel '+format(pa?player.planetoid.level:player.level,0));put('shell-xp',`${format(xp.progress,0)} / ${format(xp.next.sub(xp.cur),0)} XP`);$('shell-xp-bar').style.width=`${Math.max(0,Math.min(100,xp.percent*100))}%`;
  put('resource-grass',format(pa?player.planetoid.pm:player.recel?player.unGrass:player.decel?player.aGrass:player.grass,0));put('resource-pp',format(player.pp,0));put('resource-crystal',format(player.crystal,0));
  put('field-cap',`${format(tmp.grasses.length,0)} / ${format(tmp.grassCap,0)}`);put('cut-value','+'+format(pa?tmp.planetiumGain:tmp.grassGain,0));
  put('next-unlock',player.level<5?`Automatización en el nivel 5 · ${format(tmp.perkUnspent,0)} talentos disponibles`:player.level<30?`Prestigio en el nivel 30 · ${format(tmp.perkUnspent,0)} talentos disponibles`:player.level<100?'Cristalización en el nivel 100':'Tu jardín no deja de crecer.');
  put('field-title',pa?'Jardín cósmico':player.recel?'Reino antinatural':player.decel?'Antipradera':'La pradera');
  put('step-perk',player.level>=1||player.pTimes?'Disponible · '+format(tmp.perkUnspent,0)+' puntos':'Cada nivel cuenta');
  put('step-prestige',player.pTimes?'Ya has vuelto a florecer':player.level>=30?'Listo para prestigiar':'Volver a florecer');
  $('sound-toggle').setAttribute('aria-pressed',String(player.garden.sound));$('sound-toggle').setAttribute('aria-label',player.garden.sound?'Desactivar sonido':'Activar sonido');$('sound-toggle').title=player.garden.sound?'Desactivar sonido':'Activar sonido';
  $('auto-dot').classList.toggle('available',player.level>=5||player.pTimes>0);
  put('particle-toggle',player.garden.particles?'ON':'OFF');
  for(const [id,name,,condition,symbol]of BADGES)if(!player.garden.badges.includes(id)&&condition()){player.garden.badges.push(id);toast('Logro desbloqueado: '+name,symbol);sound(850);}
  put('badge-count',player.garden.badges.length);
  const age=lastSave?Math.floor((Date.now()-lastSave)/1000):0;
  html('save-status',storageAvailable?`<i></i> ${lastSave?'Guardado hace '+(age<2?'un momento':age+' s'):'Guardado automático activo'}`:`<i class="error-dot"></i> Sin guardado local · exporta tu partida`);
  document.documentElement.dataset.realm=pa?'cosmic':player.recel?'unnatural':player.decel?'anti':inSpace()?'space':'grass';
}
el.update.garden=updateShell;

// Flat, local canvas artwork. Nothing is downloaded or rendered in 3D.
let terrain,terrainKey='',cursorIn=false;
function buildTerrain(w,h){
  terrain=document.createElement('canvas');terrain.width=w;terrain.height=h;const c=terrain.getContext('2d');
  const realm=document.documentElement.dataset.realm,cosmic=realm==='cosmic'||realm==='space',anti=realm==='anti';
  c.fillStyle=cosmic?'#77749b':anti?'#93b9ba':'#bad28c';c.fillRect(0,0,w,h);
  const cell=42;
  for(let y=0;y<h;y+=cell)for(let x=0;x<w;x+=cell){c.fillStyle=((x/cell+y/cell)%2===0)?'#ffffff08':'#436b2210';c.fillRect(x,y,cell,cell);}
  let seed=187;const rnd=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};
  for(let i=0;i<Math.min(650,w*h/500);i++){
    const x=rnd()*w,y=rnd()*h;c.strokeStyle=cosmic?'#d0bed126':'#5e843322';c.lineWidth=1.4;c.beginPath();c.moveTo(x-3,y);c.lineTo(x-5,y-4);c.moveTo(x,y);c.lineTo(x,y-6);c.moveTo(x+3,y);c.lineTo(x+4,y-3);c.stroke();
  }
  // Garden edge, flat stepping stones, small flowers and rounded shrubs.
  c.fillStyle=cosmic?'#a49bb7':'#dfd9b1';c.fillRect(0,0,w,17);c.fillRect(0,h-19,w,19);c.fillRect(0,0,17,h);c.fillRect(w-17,0,17,h);
  c.strokeStyle=cosmic?'#beb0ce':'#f0e7c9';c.lineWidth=3;
  for(let x=12;x<w;x+=38){c.beginPath();c.moveTo(x,2);c.lineTo(x+5,14);c.moveTo(x,h-17);c.lineTo(x-4,h-2);c.stroke();}
  for(let y=22;y<h-20;y+=40){c.beginPath();c.moveTo(2,y);c.lineTo(15,y+4);c.moveTo(w-15,y);c.lineTo(w-2,y+4);c.stroke();}
  function bush(x,y,r){c.fillStyle=cosmic?'#645b86':'#6c944d';c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();c.fillStyle=cosmic?'#81739f':'#7fa35a';c.beginPath();c.arc(x-4,y-3,r*.7,0,Math.PI*2);c.fill();}
  [[13,25,22],[38,10,20],[w-15,h-20,27],[w-44,h-7,22],[w-8,35,19],[5,h-25,20]].forEach(a=>bush(...a));
  for(let i=0;i<23;i++){const x=25+rnd()*(w-50),y=i%2?25+rnd()*17:h-25-rnd()*14;c.fillStyle=i%3?'#f7efd1':'#e6bca6';for(let k=0;k<5;k++){c.beginPath();c.arc(x+Math.cos(k*1.256)*3,y+Math.sin(k*1.256)*3,2.5,0,Math.PI*2);c.fill();}c.fillStyle='#d4a752';c.fillRect(x-1.5,y-1.5,3,3);}
  terrainKey=w+':'+h+':'+realm;
}
drawGrass=function(){
  if(!retrieveCanvasData())return;
  const c=grass_ctx,w=grass_canvas.width,h=grass_canvas.height;if(!w||!h)return;
  const now=performance.now(),dt=Math.min(.05,(now-lastFrame)/1000);lastFrame=now;
  const realm=document.documentElement.dataset.realm;if(terrainKey!==w+':'+h+':'+realm)buildTerrain(w,h);c.drawImage(terrain,0,0);
  if(gardenKeys.size&&document.activeElement===grass_canvas){let dx=0,dy=0;if(gardenKeys.has('w')||gardenKeys.has('arrowup'))dy--;if(gardenKeys.has('s')||gardenKeys.has('arrowdown'))dy++;if(gardenKeys.has('a')||gardenKeys.has('arrowleft'))dx--;if(gardenKeys.has('d')||gardenKeys.has('arrowright'))dx++;const len=Math.hypot(dx,dy);if(len){mower.x=Math.max(0,Math.min(1,mower.x+dx/len*240*dt/w));mower.y=Math.max(0,Math.min(1,mower.y+dy/len*240*dt/h));mower.angle=Math.atan2(dy,dx)+Math.PI/2;cursorIn=true;mower.active=true;}}
  const px=mower.x*w,py=mower.y*h,range=tmp.rangeCut/2;
  mouse_in=cursorIn;range_pos={x:px-range,y:py-range};
  for(let i=tmp.grasses.length-1;i>=0;i--){const g=tmp.grasses[i];const x=Math.min(w*g.x,w-G_SIZE),y=Math.min(h*g.y,h-G_SIZE);
    if(cursorIn&&Math.hypot(x+G_SIZE/2-px,y+G_SIZE/2-py)<range+G_SIZE/2){removeGrass(i);continue;}
    const t=reduceMotion?0:Math.sin(now/900+g.x*19)*1.4;
    const color=g.ms?'#559dc8':g.pl?'#e5e8e1':player.planetoid.active?'#a185c1':player.decel?'#568b94':player.recel?'#78a149':'#47753a';
    c.fillStyle=g.pl?'#8fa57a66':'#75974344';c.beginPath();c.ellipse(x+8,y+13,15,6,0,0,Math.PI*2);c.fill();
    for(let j=0;j<5;j++){const bx=x+j*3.5-1,top=y-9-(j%3)*3;c.fillStyle=j%2?(g.pl?'#ffffff':'#6e9e47'):color;c.beginPath();c.moveTo(bx-2,y+11);c.quadraticCurveTo(bx-7+t,top+5,bx-3+t,top);c.quadraticCurveTo(bx+3+t,top+4,bx+3,y+11);c.fill();}
    if(g.pl||g.ms){c.fillStyle=g.ms?'#d3edff':'#fff8df';c.fillRect(x+12,y-13,3,8);c.fillRect(x+9.5,y-10.5,8,3);}
  }
  if(player.garden?.particles&&!reduceMotion){for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=80*dt;if(p.life<=0){particles.splice(i,1);continue;}c.globalAlpha=p.life/.65;c.fillStyle=p.color;c.save();c.translate(p.x,p.y);c.rotate(p.life*6);c.fillRect(-2,-3,4,7);c.restore();}c.globalAlpha=1;}
  if(mower.active||!cursorIn){
    c.fillStyle='#ffffff12';c.strokeStyle=cursorIn?'#faf7e4b0':'#faf7e480';c.lineWidth=1.5;c.setLineDash([4,6]);c.beginPath();c.arc(px,py,range,0,Math.PI*2);c.fill();c.stroke();c.setLineDash([]);
    c.save();c.translate(px,py);c.rotate(mower.angle);c.fillStyle='#516344';c.fillRect(-15,-10,7,11);c.fillRect(8,-10,7,11);c.fillRect(-15,6,7,11);c.fillRect(8,6,7,11);c.fillStyle='#e8b859';c.beginPath();c.roundRect(-11,-17,22,32,7);c.fill();c.fillStyle='#f2cd7a';c.beginPath();c.roundRect(-8,-14,16,9,4);c.fill();c.fillStyle='#6c7746';c.beginPath();c.arc(0,4,5,0,Math.PI*2);c.fill();c.strokeStyle='#455c3f';c.lineWidth=3;c.beginPath();c.moveTo(-8,14);c.lineTo(-9,26);c.lineTo(9,26);c.lineTo(8,14);c.stroke();c.restore();
  }
};
grassCanvas=function(){
  retrieveCanvasData();resizeCanvas();grass_canvas.tabIndex=0;grass_canvas.setAttribute('role','application');grass_canvas.setAttribute('aria-label','Pradera de hierba. Mueve el ratón o arrastra para cortar. Con el campo enfocado, usa WASD o las flechas.');
  const update=e=>{const r=grass_canvas.getBoundingClientRect(),oldX=mower.x,oldY=mower.y;mower.x=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width));mower.y=Math.max(0,Math.min(1,(e.clientY-r.top)/r.height));if(Math.hypot(mower.x-oldX,mower.y-oldY)>.001)mower.angle=Math.atan2((mower.y-oldY)*r.height,(mower.x-oldX)*r.width)+Math.PI/2;mower.active=true;cursorIn=true;$('field-tooltip').classList.add('dismissed');};
  grass_canvas.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'||pointerHeld)update(e);});
  grass_canvas.addEventListener('pointerdown',e=>{pointerHeld=true;grass_canvas.focus({preventScroll:true});grass_canvas.setPointerCapture(e.pointerId);update(e);drawGrass();});
  grass_canvas.addEventListener('pointerup',e=>{pointerHeld=false;if(e.pointerType!=='mouse')cursorIn=false;});
  grass_canvas.addEventListener('pointercancel',()=>{pointerHeld=false;cursorIn=false;});grass_canvas.addEventListener('pointerleave',()=>{if(!pointerHeld)cursorIn=false;});
  new ResizeObserver(()=>{resizeCanvas();terrainKey='';}).observe($('field-stage'));
};
const originalRemoveGrass=removeGrass;
removeGrass=function(i,auto=false){const g=tmp.grasses[i];if(!g)return;const x=g.x*grass_canvas.width,y=g.y*grass_canvas.height;originalRemoveGrass(i,auto);if(player.garden){player.garden.cuts++;if(player.garden.particles&&!reduceMotion&&particles.length<180)for(let n=0;n<5;n++)particles.push({x,y,vx:(Math.random()-.5)*110,vy:-30-Math.random()*60,life:.4+Math.random()*.25,color:g.pl?'#fff5ca':'#59883d'});}if(!auto&&Math.random()<.12)sound(g.pl?1000:440+Math.random()*100);};

function bootGrassland(){
  prepareShell();
  try{loadGame();}catch(error){console.error(error);$('loading')?.remove();showDialog('No se pudo cargar la partida.',`<p>La partida local no se ha sobrescrito. Puedes exportar los datos recuperables o empezar con un jardín nuevo.</p><button id="recover-save">Descargar datos guardados</button><button id="recover-new">Empezar de nuevo</button>`);$('recover-save').onclick=()=>downloadSave(localStorage.getItem('grassland_save_v1')||'');$('recover-new').onclick=()=>{localStorage.removeItem('grassland_save_v1');location.reload();};return;}
  ensureGarden();gameReady=true;
  if(player.time<1&&tmp.grasses.length===0)for(let i=0;i<tmp.grassCap;i++)createGrass();
  updateShell();
  document.addEventListener('keydown',e=>{
    if(['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)||$('game-dialog').open)return;
    if(document.activeElement===grass_canvas&&['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].includes(e.key.toLowerCase()))gardenKeys.add(e.key.toLowerCase());
  });
  document.addEventListener('keyup',e=>gardenKeys.delete(e.key.toLowerCase()));
  window.addEventListener('blur',()=>{gardenKeys.clear();cursorIn=false;shiftDown=false;});
  window.addEventListener('pagehide',()=>{if(gameReady)save();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){gardenKeys.clear();cursorIn=false;if(gameReady)save();}date=Date.now();});
  // Intercept movement before the legacy map hotkeys, keeping focused canvas controls local.
  window.addEventListener('keydown',e=>{
    const editing=['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName);
    if(editing||$('game-dialog').open){e.stopImmediatePropagation();return;}
    if(document.activeElement===grass_canvas&&['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].includes(e.key.toLowerCase())){e.preventDefault();gardenKeys.add(e.key.toLowerCase());e.stopImmediatePropagation();}
    else if(['p','c','g'].includes(e.key.toLowerCase())||(e.shiftKey&&e.key.toLowerCase()==='s')){const k=e.key.toLowerCase();const id=k==='p'?(e.shiftKey?'rocket_part':player.decel?'ap':'pp'):k==='c'?(player.decel?'oil':'crystal'):k==='g'?(e.shiftKey?'gal':player.decel?'gs':'gh'):player.decel?'fun':'steel';e.preventDefault();e.stopImmediatePropagation();gardenReset(id);}
    else if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key))e.preventDefault();
  },true);
}
