/* Classic GCI presentation; touch, persistence and accessibility adapter. */
'use strict';

const $ = id => document.getElementById(id);
let gameReady = false, lastSave = 0, storageAvailable = true, toastTimer;
let pointerHeld = false, cursorTime = performance.now(), soundContext;
const gardenKeys = new Set();
const cutCursor = { x: .5, y: .5 };
const BADGES = [
  ['first', 'El primer corte', 'Corta tu primera brizna.', () => player.garden.cuts >= 1],
  ['hundred', 'Manos a la hierba', 'Corta 100 briznas.', () => player.garden.cuts >= 100],
  ['thousand', 'Un jardín cuidado', 'Corta 1.000 briznas.', () => player.garden.cuts >= 1000],
  ['level5', 'Deja que crezca', 'Alcanza el nivel 5.', () => player.level >= 5],
  ['prestige', 'Volver a florecer', 'Haz tu primer prestigio.', () => player.pTimes > 0],
  ['crystal', 'Un nuevo brillo', 'Cristaliza por primera vez.', () => player.cTimes > 0],
  ['hop', 'Un gran salto', 'Haz tu primer Grasshop.', () => player.grasshop > 0],
  ['steel', 'Corazón de acero', 'Consigue acero.', () => player.steel.gt(0)],
  ['galaxy', 'Hasta las estrellas', 'Realiza un reinicio galáctico.', () => player.gTimes > 0],
  ['cosmic', 'El jardín cósmico', 'Visita el planetoide.', () => player.planetoid.active]
];

function ensureGarden() {
  const g = player.garden || {};
  player.garden = {
    cuts: Number.isFinite(g.cuts) ? Math.max(0, g.cuts) : 0,
    savedAt: Number.isFinite(g.savedAt) ? Math.max(0, g.savedAt) : 0,
    sound: g.sound === true, particles: g.particles !== false,
    badges: Array.isArray(g.badges) ? [...new Set(g.badges.filter(id => BADGES.some(b => b[0] === id)))] : []
  };
}

function toast(message) {
  $('toast').textContent = message;
  $('toast').hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { $('toast').hidden = true; }, 3000);
}

function sound(frequency = 550) {
  if (!player.garden?.sound) return;
  try {
    soundContext ||= new (window.AudioContext || window.webkitAudioContext)();
    soundContext.resume();
    const oscillator = soundContext.createOscillator(), gain = soundContext.createGain();
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(.025, soundContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(.0001, soundContext.currentTime + .1);
    oscillator.connect(gain); gain.connect(soundContext.destination);
    oscillator.start(); oscillator.stop(soundContext.currentTime + .12);
  } catch { /* Sound is optional. */ }
}

function showDialog(title, body) {
  $('dialog-title').textContent = title;
  $('dialog-body').innerHTML = body;
  if (!$('game-dialog').open) $('game-dialog').showModal();
}
function closeDialog() { $('game-dialog').close(); }

function routeUnlocked(id) {
  return !!MAP_UNLS[id]?.() && (!['sc', 'at', 'sac', 'ap'].includes(id) || player.gTimes > 0);
}

function navigate(id) {
  if (!routeUnlocked(id)) { toast('Esta zona todavía no está desbloqueada.'); return false; }
  for (const [dim, rows] of Object.entries(MAP)) {
    for (let y = 0; y < rows.length; y++) {
      const x = rows[y].indexOf(id);
      if (x < 0) continue;
      mapPos.dim = dim; mapPos[dim] = [x, y];
      switchMapId(id); closeDialog(); updateHTML();
      resizeCanvas(); resizeCanvas2();
      return true;
    }
  }
  return false;
}

const classicSwitchMap = switchMapId;
switchMapId = function(id) {
  classicSwitchMap(id);
  mouse_in = false; go_to = false;
  requestAnimationFrame(() => { resizeCanvas(); resizeCanvas2(); });
};

function gardenReset(id) {
  const reset = RESET[id];
  if (!reset || reset.unl && !reset.unl() || reset.req && !reset.req()) return;
  showDialog(reset.title, `<p>${reset.resetDesc}</p><p>${reset.resetGain?.() || ''}</p><div class="dialog-actions"><button id="cancel-layer-reset">Cancel</button><button id="confirm-layer-reset">Confirm ${reset.resetBtn}</button></div>`);
  $('cancel-layer-reset').onclick = closeDialog;
  $('confirm-layer-reset').onclick = () => {
    if ((!reset.unl || reset.unl()) && (!reset.req || reset.req())) {
      reset.reset(); ensureGarden(); save(); closeDialog(); updateTemp(); updateHTML();
      toast('Un nuevo comienzo.');
    }
  };
}

function showHelp() {
  showDialog('How to play / Cómo jugar', `<p>Mueve el ratón sobre los cuadrados de hierba para cortarlos. En móvil, toca o arrastra por el campo.</p><p>Haz clic en un icono de mejora para ver sus efectos y comprar niveles. Mayús + clic compra el máximo disponible.</p><p>Usa <b>Map</b> y las flechas inferiores para recorrer las pantallas. WASD y las flechas del teclado también recorren el mapa. Si enfocas el campo con un clic o Tab, mueven el área de corte.</p><p>Los talentos se consiguen al subir de nivel. Automatización: nivel 5. Prestigio: nivel 30. Cristalización: nivel 100. Desafíos: nivel 200. Grasshop: nivel 300.</p><p>Los reinicios manuales solicitan confirmación. Tu progreso anterior se mantiene en este navegador. Options incluye guardado, exportación e importación.</p>`);
}

function showBadges() {
  showDialog('Achievements / Logros', `<p>${player.garden.badges.length} / ${BADGES.length}</p><div class="classic-badges">${BADGES.map(([id, name, desc]) => `<div class="classic-badge ${player.garden.badges.includes(id) ? 'earned' : ''}"><b>${player.garden.badges.includes(id) ? '✓' : '·'} ${name}</b><br>${desc}</div>`).join('')}</div>`);
}

function resetAll() {
  showDialog('Hard Reset', '<p>Esta acción borra toda tu partida. Exporta una copia si quieres conservarla.</p><div class="dialog-actions"><button id="cancel-wipe">Cancel</button><button id="confirm-wipe">Borrar toda la partida</button></div>');
  $('cancel-wipe').onclick = closeDialog;
  $('confirm-wipe').onclick = () => {
    load(); ensureGarden(); save(); closeDialog(); navigate('g');
    for (let i = 0; i < tmp.grassCap; i++) createGrass();
    toast('Partida reiniciada.');
  };
}

function prepareClassicUI() {
  // Keep the source HTML, original panels, original icon grids and original map.
  for (const id of ['p','auto','pc','gh','fd','as','rp','at','sac','ap']) $('map_div_' + id).classList.add('classic-stacked');
  document.body.insertAdjacentHTML('beforeend', `<span id="save-status" role="status"></span><div id="toast" hidden role="status" aria-live="polite"></div><dialog id="game-dialog" aria-labelledby="dialog-title"><div class="dialog-top"><h2 id="dialog-title"></h2><button id="close-dialog" aria-label="Cerrar">×</button></div><div id="dialog-body"></div></dialog>`);
  $('close-dialog').onclick = closeDialog;
  $('game-dialog').addEventListener('click', event => {
    if (event.target !== $('game-dialog')) return;
    const r = event.target.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) closeDialog();
  });
  for (const button of document.querySelectorAll('#map_div_opt > button')) {
    const action = button.getAttribute('onclick') || '';
    if (action === 'save()') { button.id = 'manual-save'; button.onclick = () => { if (save()) toast('Game saved'); }; }
    if (action === 'importy()') button.id = 'import-save';
    if (action === 'exporty()') button.id = 'export-save';
    if (action.includes('wipe(')) { button.id = 'reset-save'; button.onclick = resetAll; }
  }
  $('map_div_opt').insertAdjacentHTML('beforeend', `<p class="classic-extra-options"><button id="help-button">How to play</button><button id="badges-button">Achievements</button><button id="sound-toggle">Sound: OFF</button></p>`);
  $('help-button').onclick = showHelp;
  $('badges-button').onclick = showBadges;
  $('sound-toggle').onclick = () => { player.garden.sound = !player.garden.sound; sound(); };
  $('mapBtn').setAttribute('aria-controls', 'map_div');
  $('map_div').setAttribute('aria-label', 'Game map');
  for (const [id, label] of [['lMap','Left'],['rMap','Right'],['uMap','Up'],['dMap','Down']]) $(id).setAttribute('aria-label', label);
}

// Keep the original square grass and square cutting area. Only add keyboard/touch input.
const classicDrawGrass = drawGrass;
drawGrass = function() {
  const now = performance.now(), dt = Math.min(.05, (now - cursorTime) / 1000);
  cursorTime = now;
  if (document.activeElement === grass_canvas && gardenKeys.size) {
    let x = 0, y = 0;
    if (gardenKeys.has('a') || gardenKeys.has('arrowleft')) x--;
    if (gardenKeys.has('d') || gardenKeys.has('arrowright')) x++;
    if (gardenKeys.has('w') || gardenKeys.has('arrowup')) y--;
    if (gardenKeys.has('s') || gardenKeys.has('arrowdown')) y++;
    const length = Math.hypot(x, y);
    if (length) {
      cutCursor.x = Math.max(0, Math.min(1, cutCursor.x + x / length * 240 * dt / grass_canvas.width));
      cutCursor.y = Math.max(0, Math.min(1, cutCursor.y + y / length * 240 * dt / grass_canvas.height));
      mouse_in = true;
      range_pos = { x: cutCursor.x * grass_canvas.width - tmp.rangeCut / 2, y: cutCursor.y * grass_canvas.height - tmp.rangeCut / 2 };
    }
  }
  classicDrawGrass();
};

grassCanvas = function() {
  if (!retrieveCanvasData()) return;
  resizeCanvas();
  grass_canvas.tabIndex = 0;
  grass_canvas.setAttribute('role', 'application');
  grass_canvas.setAttribute('aria-label', 'Grass field. Move the mouse or drag to cut. Focus and use WASD or arrow keys to move the cutting area.');
  function position(event) {
    const r = grass_canvas.getBoundingClientRect();
    cutCursor.x = Math.max(0, Math.min(1, (event.clientX - r.left) / r.width));
    cutCursor.y = Math.max(0, Math.min(1, (event.clientY - r.top) / r.height));
    mouse_pos = { x: cutCursor.x * grass_canvas.width, y: cutCursor.y * grass_canvas.height };
    range_pos = { x: mouse_pos.x - tmp.rangeCut / 2, y: mouse_pos.y - tmp.rangeCut / 2 };
    mouse_in = true;
  }
  grass_canvas.addEventListener('pointermove', event => { if (event.pointerType === 'mouse' || pointerHeld) position(event); });
  grass_canvas.addEventListener('pointerdown', event => {
    pointerHeld = true; grass_canvas.focus({ preventScroll: true });
    grass_canvas.setPointerCapture(event.pointerId); position(event); drawGrass();
  });
  grass_canvas.addEventListener('pointerup', event => { pointerHeld = false; if (event.pointerType !== 'mouse') mouse_in = false; });
  grass_canvas.addEventListener('pointercancel', () => { pointerHeld = false; mouse_in = false; });
  grass_canvas.addEventListener('pointerleave', () => { if (!pointerHeld) mouse_in = false; });
  new ResizeObserver(() => resizeCanvas()).observe(grass_canvas);
};

const classicRemoveGrass = removeGrass;
removeGrass = function(index, auto = false) {
  if (!tmp.grasses[index]) return;
  classicRemoveGrass(index, auto);
  if (player.garden) player.garden.cuts++;
  if (!auto && Math.random() < .1) sound(480);
};

el.update.classicAdapter = () => {
  if (!player.garden) ensureGarden();
  $('sound-toggle').textContent = 'Sound: ' + (player.garden.sound ? 'ON' : 'OFF');
  $('mapBtn').setAttribute('aria-expanded', String(go_to));
  const status = storageAvailable ? lastSave ? 'Saved ✓' : 'Autosave: ON' : 'Save unavailable — export your game';
  if ($('save-status').textContent !== status) $('save-status').textContent = status;
  for (const [id, name, , condition] of BADGES) {
    if (!player.garden.badges.includes(id) && condition()) { player.garden.badges.push(id); toast('Achievement: ' + name); }
  }
};

function bootGrassland() {
  prepareClassicUI();
  try { loadGame(); }
  catch (error) {
    console.error(error); $('loading')?.remove();
    showDialog('No se pudo cargar la partida', '<p>Los datos guardados no se han sobrescrito.</p><button id="recover-save">Descargar datos</button><button id="recover-new">Empezar de nuevo</button>');
    $('recover-save').onclick = () => downloadSave(localStorage.getItem('grassland_save_v1') || '');
    $('recover-new').onclick = () => { localStorage.removeItem('grassland_save_v1'); location.reload(); };
    return;
  }
  ensureGarden(); gameReady = true;
  if (player.time < 1 && !tmp.grasses.length) for (let i = 0; i < tmp.grassCap; i++) createGrass();
  document.addEventListener('keydown', event => {
    const card = event.target.closest('.upg_ctn');
    if (card && ['Enter', ' '].includes(event.key)) { event.preventDefault(); card.click(); }
  });
  const movement = ['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'];
  window.addEventListener('keydown', event => {
    if (['INPUT','TEXTAREA','SELECT'].includes(event.target.tagName) || $('game-dialog').open) { event.stopImmediatePropagation(); return; }
    const key = event.key.toLowerCase();
    if (document.activeElement === grass_canvas && movement.includes(key)) {
      event.preventDefault(); gardenKeys.add(key); event.stopImmediatePropagation();
    } else if (['p','c','g'].includes(key) || event.shiftKey && key === 's') {
      const id = key === 'p' ? event.shiftKey ? 'rocket_part' : player.decel ? 'ap' : 'pp' : key === 'c' ? player.decel ? 'oil' : 'crystal' : key === 'g' ? event.shiftKey ? 'gal' : player.decel ? 'gs' : 'gh' : player.decel ? 'fun' : 'steel';
      event.preventDefault(); event.stopImmediatePropagation(); gardenReset(id);
    } else if (event.key.startsWith('Arrow')) event.preventDefault();
  }, true);
  document.addEventListener('keyup', event => gardenKeys.delete(event.key.toLowerCase()));
  window.addEventListener('blur', () => { gardenKeys.clear(); mouse_in = false; shiftDown = false; });
  window.addEventListener('pagehide', () => { if (gameReady) save(); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { gardenKeys.clear(); mouse_in = false; if (gameReady) save(); }
    date = Date.now();
  });
}
