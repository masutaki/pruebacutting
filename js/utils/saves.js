function getPlayerData() {
	let s = {
		grass: E(0),
		bestGrass: E(0),
		level: 0,
		xp: E(0),
		tier: 0,
		tp: E(0),

		upgs: {},
		autoUpg: {},

		maxPerk: 0,
		spentPerk: 0,

		plat: 0,

		pp: E(0),
		bestPP: E(0),
		pTimes: 0,
		pTime: 0,

		crystal: E(0),
		bestCrystal: E(0),
		cTimes: 0,
		cTime: 0,

		options: {
			hideUpgOption: false
		},

		chalUnl: false,

		chal: {
			progress: -1,
			comp: [],
		},

		grasshop: 0,
		ghMult: false,

		steel: E(0),
		sTimes: 0,
		sTime: 0,

		chargeRate: E(0),
		bestCharge: E(0),

		decel: false,
		aGrass: E(0),
		aBestGrass: E(0),
		aRes: {
			level: 0,
			xp: E(0),
			tier: 0,
			tp: E(0),
		},
		
		ap: E(0),
		bestAP: E(0),
		bestAP2: E(0),
		aTimes: 0,
		aTime: 0,

		oil: E(0),
		bestOil: E(0),
		bestOil2: E(0),
		lTimes: 0,
		lTime: 0,

		rocket: {
			total_fp: 0,
			amount: 0,
			part: 0,
		},

		momentum: 0,

		gTimes: 0,
		gTime: 0,
		stars: E(0),
		lowGH: 1e300,

		astral: 0,
		astralPrestige: 0,
		sp: E(0),

		moonstone: 0,
		grassskip: 0,
		bestGS: 0,

		gsUnl: false,
		gsMult: false,

		star_chart: {
			auto: [],
			speed: [],
			progress: [],
			ring: [],
			reserv: [],
		},

		fTimes: 0,
		fTime: 0,
		fun: E(0),
		SFRGT: E(0),

        sacTime: 0,
        sacTimes: 0,
        dm: E(0),

        recel: false,
        unGrass: E(0),
        unBestGrass: E(0),
        unRes: {
            level: 0,
            xp: E(0),
            tier: 0,
            tp: E(0),
        },

        np: E(0),
        bestNP: E(0),
        bestNP2: E(0),
        nTimes: 0,
        nTime: 0,

        cloud: E(0),
        bestCloud: E(0),
        bestCloud2: E(0),
        cloudUnl: false,

        grassjump: 0,

        planetoid: getPlanetoidSave(),

        lunar: {
            active: [],
            level: new Array(LUNAR_OB.length).fill(0),
            lp: new Array(LUNAR_OB.length).fill(E(0)),
        },

		time: 0,
		map_notify: {},
		version: VER,
	}
	for (let x in UPGS) {
		s.upgs[x] = []
		s.autoUpg[x] = false
	}
	return s
}

function newPlayer() {
	player = getPlayerData()
}

function safecheckSave(data) {
	if (findNaN(data, true)) {
		alert("Your save fails to load, because it got NaNed!")
		return false
	}
	return true
}

const VER = 0.0404
const EX_COMMIT = 11.08
function loadPlayer(data) {
	player = deepUndefinedAndDecimal(data, getPlayerData())
	convertStringToDecimal()

	//Vanilla
	if (!player.version) player.version = 0
	if (player.version < 0.0306 && player.rocket.total_fp > 0) {
		player.rocket.total_fp = 0
		player.rocket.amount = 0
		player.oil = E(0)
		player.bestOil = E(0)
		player.ap = E(0)
		player.bestAP = E(0)
		player.aGrass = E(0)
		player.aBestGrass = E(0)
		player.aRes.level = 0
		player.aRes.tier = 0
		player.aRes.xp = E(0)
		player.aRes.tp = E(0)

		player.steel = E(0)
		player.chargeRate = E(0)

		resetUpgrades('ap')
		resetUpgrades('oil')
		resetUpgrades('rocket')

		console.log('guh?')
	}
    if (player.version < 0.401) {
        player.bestGS = Math.max(player.bestGS, player.grassskip)
    }
    if (player.version < 0.0404 && player.grassjump>=5) {
        player.lunar = getPlayerData().lunar

        player.astralPrestige = 0

        player.grasshop = 0
        if (player.grassskip>60) player.grassskip = 60

        RESET.formRing.doReset()

        player.cloud = E(0)
        player.bestCloud = E(0)
        player.bestCloud2 = E(0)

        player.np = E(0)
        player.bestNP = E(0)
        player.bestNP2 = E(0)

        player.unGrass = E(0)
        player.unBestGrass = E(0)
        player.unRes.level = 0
        player.unRes.tier = 0
        player.unRes.xp = E(0)
        player.unRes.tp = E(0)

        if (player.grassjump>5) player.grassjump = 5

        RESET.sac.doReset()

        resetUpgrades('unGrass')
        resetUpgrades('np')
        resetUpgrades('cloud')

        if (player.planetoid.planetTier>10) player.planetoid.planetTier = 10

        resetUpgrades('planet')
        player.planetoid.planet = E(0)

        player.momentum = 0
        resetUpgrades('momentum')

        player.sfgrt = E(0)
        resetUpgrades('sfrgt')

        player.dm = E(0)
        resetUpgrades('dm')

        console.log('guh? ^2')
    }
	player.version = VER
}

function deepNaN(obj, data) {
	for (let x = 0; x < Object.keys(obj).length; x++) {
		let k = Object.keys(obj)[x]
		if (typeof obj[k] == 'string') {
			if (data[k] == null || data[k] == undefined ? false : Object.getPrototypeOf(data[k]).constructor.name == "Decimal") if (isNaN(E(obj[k]).mag)) obj[k] = data[k]
		} else {
			if (typeof obj[k] != 'object' && isNaN(obj[k])) obj[k] = data[k]
			if (typeof obj[k] == 'object' && data[k] && obj[k] != null) obj[k] = deepNaN(obj[k], data[k])
		}
	}
	return obj
}

function deepUndefinedAndDecimal(obj, data) {
	if (obj == null) return data
	for (let x = 0; x < Object.keys(data).length; x++) {
		let k = Object.keys(data)[x]
		if (obj[k] === null) obj[k] = data[k]
		if (obj[k] === undefined) obj[k] = data[k]
		else {
			if (Object.getPrototypeOf(data[k]).constructor.name == "Decimal") obj[k] = E(obj[k])
			else if (typeof obj[k] == 'object') deepUndefinedAndDecimal(obj[k], data[k])
		}
	}
	return obj
}

function convertStringToDecimal() {
	
}

function cannotSave() { return false }

let saveInterval
function save() {
	if (cannotSave() || findNaN(player)) return false
	if (player.garden) player.garden.savedAt = Date.now()
	let str = btoa(JSON.stringify(player))
	try {
		const previous = localStorage.getItem("grassland_save_v1")
		if (previous) localStorage.setItem("grassland_save_backup", previous)
		localStorage.setItem("grassland_save_v1", str)
		tmp.prevSave = previous
		if (typeof lastSave !== 'undefined') lastSave = Date.now()
		if (typeof storageAvailable !== 'undefined') storageAvailable = true
		return true
	} catch {
		if (typeof storageAvailable !== 'undefined') storageAvailable = false
		return false
	}
}

function resetSaveInterval() {
	clearInterval(saveInterval)
	saveInterval = setInterval(save, 30000)
}

function load(str) {
	let data
	if (str && str !== null) data = validateSave(str)
	if (data && safecheckSave(data)) loadPlayer(data)
	else newPlayer()

	resetSaveInterval()
	resetMap()
	resetTemp()
	for (let x = 0; x < 50; x++) updateTemp()
}

function exporty() {
	let str = btoa(JSON.stringify(player))
	if (findNaN(str, true)) return

	save();
	downloadSave(str)
}

function downloadSave(str) {
	const url = URL.createObjectURL(new Blob([str], {type:"text/plain"}))
	const a = document.createElement('a')
	a.href = url
	a.download = 'Grassland-' + new Date().toISOString().slice(0,10) + '.txt'
	a.click()
	setTimeout(() => URL.revokeObjectURL(url), 1000)
}

// Imported saves are data, including saves exported by the original rework.
function validateSave(str) {
	if (typeof str !== 'string' || str.length > 2000000) throw new Error('Archivo demasiado grande.')
	const data = JSON.parse(atob(str.trim()))
	if (!data || typeof data !== 'object' || Array.isArray(data) || !data.upgs || !('grass' in data) || !('xp' in data)) throw new Error('No es una partida compatible de GCI.')
	function inspect(obj, template, depth=0) {
		if (depth > 30) throw new Error('Partida inválida.')
		if (obj === null) throw new Error('La partida contiene un valor nulo.')
		if (template instanceof Decimal) {
			if (!['number','string'].includes(typeof obj)) throw new Error('Recurso inválido.')
			const n = E(obj)
			if (![n.mag,n.layer,n.sign].every(Number.isFinite) || n.lt(0)) throw new Error('Recurso inválido.')
			return
		}
		if (template !== undefined && typeof template !== typeof obj) throw new Error('Formato de partida inválido.')
		if (typeof obj === 'number' && !Number.isFinite(obj)) throw new Error('Número inválido.')
		if (typeof obj === 'string' && obj.length > 500) throw new Error('Dato inválido.')
		if (typeof obj === 'object') {
			if (template !== undefined && Array.isArray(template) !== Array.isArray(obj)) throw new Error('Formato inválido.')
			if (Object.keys(obj).length > 1000) throw new Error('Demasiados datos.')
			for (const key of Object.keys(obj)) {
				if (['__proto__','constructor','prototype'].includes(key)) throw new Error('Clave no permitida.')
				inspect(obj[key], template?.[key], depth+1)
			}
		}
	}
	inspect(data, getPlayerData())
	for (const [id,levels] of Object.entries(data.upgs)) {
		if (!UPGS[id] || !Array.isArray(levels) || levels.length > UPGS[id].ctn.length || levels.some(n => !Number.isFinite(n) || n < 0 || !Number.isInteger(n))) throw new Error('Mejoras inválidas.')
	}
	if (!Number.isInteger(data.level) || data.level < 0) throw new Error('Nivel inválido.')
	return data
}

function export_copy() {
	let str = btoa(JSON.stringify(player))
	if (findNaN(str, true)) return

	let copyText = document.getElementById('copy')
	copyText.value = str
	copyText.style.visibility = "visible"
	copyText.select();
	document.execCommand("copy");
	copyText.style.visibility = "hidden"
	console.log("Exported to clipboard")
}

function importy() {
	showDialog('Tu jardín, de vuelta.', `<p>Importa un archivo de Grassland o del rework original, o pega el texto exportado. La importación sustituye tu progreso actual.</p><input type="file" accept=".txt,text/plain" id="import-file" class="import-file" aria-label="Archivo de partida"><textarea class="save-import" id="import-text" placeholder="Pega aquí tu partida…" aria-label="Texto de la partida"></textarea><p class="import-error" id="import-error" role="alert"></p><button class="primary-button" id="confirm-import">Importar y continuar</button>`)
	document.getElementById('import-file').onchange = async event => {
		const file = event.target.files[0]
		if (file?.size > 2000000) { document.getElementById('import-error').textContent='El archivo es demasiado grande.'; return }
		if (file) document.getElementById('import-text').value = await file.text()
	}
	document.getElementById('confirm-import').onclick = () => {
		const str=document.getElementById('import-text').value.trim(), keep=player
		try {
			validateSave(str)
			load(str)
			ensureGarden()
			save()
			closeDialog()
			navigate('g')
			toast('Tu jardín está listo. Bienvenido de vuelta.','save')
		} catch (error) {
			player=keep
			resetTemp()
			for (let i=0;i<50;i++) updateTemp()
			document.getElementById('import-error').textContent = 'No se pudo importar. Comprueba que sea una partida válida. Tu progreso sigue intacto.'
		}
	}
}

function loadGame(start=true, gotNaN=false) {
	for (let x in UPGS) {
		UPGS_SCOST[x] = []
		for (let y in UPGS[x].ctn) UPGS_SCOST[x][y] = UPGS[x].ctn[y].cost(0)
	}
	for (let x in STAR_CHART) {
		SC_SCOST[x] = []
		for (let y in STAR_CHART[x]) SC_SCOST[x][y] = STAR_CHART[x][y].cost(0)
	}

	let stored
	try { stored = localStorage.getItem('grassland_save_v1') } catch { if (typeof storageAvailable !== 'undefined') storageAvailable = false }
	load(stored)

	setupHTML()
	updateHTML()

	grassCanvas()
	treeCanvas()
	tmp.el.loading.el.remove()
	setInterval(loop, 100/3)
	setInterval(checkNaN, 1000)
}

function wipe() {
	if (!confirm("This will reset everything, with no rewards! Are you really sure to wipe?")) return
	alert("If you did that accidentally, you can reload to retrieve your save. However, you have 30 seconds to think!")
	load() //blank save
}

function checkNaN() {
	if (findNaN(player)) {
		alert("Game Data got NaNed")
		load(tmp.prevSave)
	}
}

function findNaN(obj, str=false, data=getPlayerData()) {
	if (str && typeof obj === 'string') obj = JSON.parse(atob(obj))
	if (typeof obj === 'number') return !Number.isFinite(obj)
	if (obj instanceof Decimal) return ![obj.mag,obj.layer,obj.sign].every(Number.isFinite)
	if (!obj || typeof obj !== 'object') return false
	for (const key of Object.keys(obj)) {
		if (str && data?.[key] instanceof Decimal) { if (findNaN(E(obj[key]))) return true }
		else if (typeof obj[key] !== 'string' && findNaN(obj[key], str, data?.[key])) return true
	}
	return false
}
