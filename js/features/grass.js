const G_SIZE = 15
const G_RANGE = 50

var mouse_pos = {x:0,y:0}
var range_pos = {x:0,y:0}
var mouse_in = false

function createGrass() {
    if (tmp.grasses.length < tmp.grassCap) {
        let pl_active = player.planetoid.active

        let pl = pl_active?Math.random()<tmp.observChance:Math.random()<tmp.platChance&&player.tier>=3
        let ms = !pl_active&&Math.random()<tmp.moonstoneChance&&pl&&player.gTimes>0

        tmp.grasses.push({
            x: Math.random(),
            y: Math.random(),
            pl: pl,
            ms: ms,
            tier: player.tier
        })
    }
}

function removeGrass(i,auto=false) {
    let tg = tmp.grasses[i]
    if (!tg) return

    let y = 1
    if (auto) y *= tmp.autocutBonus

    if (player.planetoid.active) {
        player.planetoid.pm = player.planetoid.pm.add(tmp.planetiumGain)
        player.planetoid.xp = player.planetoid.xp.add(tmp.cosmicGain)

        if (tg.pl) player.planetoid.observ = player.planetoid.observ.add(tmp.observGain)
    } else {
        if (player.recel) player.unGrass = player.unGrass.add(tmp.grassGain.mul(y))
        else if (player.decel) player.aGrass = player.aGrass.add(tmp.grassGain.mul(y))
        else player.grass = player.grass.add(tmp.grassGain.mul(y))
        player.xp = player.xp.add(tmp.XPGain.mul(y))
        if (player.pTimes > 0) player.tp = player.tp.add(tmp.TPGain.mul(y))

        if (tg.pl) player.plat += tmp.platGain * (tmp.platCutAmt ? y : 1)
        if (tg.ms) player.moonstone += tmp.moonstoneGain * (tmp.moonstonesCutAmt ? y : 1)
    }

    if (player.gTimes > 0) player.sp = player.sp.add(tmp.SPGain)

    tmp.grasses.splice(i, 1)
}

el.update.grassCanvas = _=>{
    if (mapID == 'g') {
        if (grass_canvas.width == 0 || grass_canvas.height == 0) resizeCanvas()
        tmp.el.grass_canvas.setClasses({planetoid: player.planetoid.active})
        drawGrass()

        tmp.el.grass_cap.setHTML(`${format(tmp.grasses.length,0)} / ${format(tmp.grassCap,0)} <span class="smallAmt">(+${format(1/tmp.grassSpawn*tmp.spawnAmt)}/s)</span>`)
        tmp.el.grass_cut.setHTML("+"+format(player.planetoid.active?tmp.planetiumGain:tmp.grassGain,1)+'<span class="smallAmt">/cut</span>')
    }
}

function resetGlasses() {
    tmp.grasses = []
    tmp.spawn_time = 0
}

function drawGrass() {
	if (!retrieveCanvasData()) return;

    let pl_active = player.planetoid.active

	grass_ctx.clearRect(0, 0, grass_canvas.width, grass_canvas.height);
    let gs = tmp.grasses

    if (mouse_in) {
        grass_ctx.fillStyle = "#34AF7C77"

        grass_ctx.fillRect(range_pos.x,range_pos.y,tmp.rangeCut,tmp.rangeCut)
    }

    grass_ctx.strokeStyle = "#0003"

    for (let i = 0; i < gs.length; i++) {
        let g = gs[i]

        if (g) {
            grass_ctx.fillStyle = pl_active?(g.pl?"#6C69C6":"#8500A3"):g.ms?'#008DFF':g.pl?"#DDD":grassColor(g.tier)

            let [x,y] = [Math.min(grass_canvas.width*g.x,grass_canvas.width-G_SIZE),Math.min(grass_canvas.height*g.y,grass_canvas.height-G_SIZE)]

            if (mouse_in) {
                if (range_pos.x < x + G_SIZE &&
                    range_pos.x + tmp.rangeCut > x &&
                    range_pos.y < y + G_SIZE &&
                    tmp.rangeCut + range_pos.y > y) {
                        removeGrass(i)
                        i--
        
                        continue
                    }
            }

            grass_ctx.fillRect(x,y,G_SIZE,G_SIZE)
            grass_ctx.strokeRect(x,y,G_SIZE,G_SIZE)
        }
    }
}

function grassCanvas() {
    if (!retrieveCanvasData()) return
    if (grass_canvas && grass_ctx) {
        window.addEventListener("resize", resizeCanvas)

        grass_canvas.width = grass_canvas.clientWidth
        grass_canvas.height = grass_canvas.clientHeight

        grass_canvas.addEventListener('mousemove', (event)=>{
            mouse_in = true
            mouse_pos.x = event.pageX - grass_rect.left
            mouse_pos.y = event.pageY - grass_rect.top

            range_pos.x = mouse_pos.x - tmp.rangeCut/2
            range_pos.y = mouse_pos.y - tmp.rangeCut/2
        })

        grass_canvas.addEventListener('mouseout', (event)=>{
            mouse_in = false
        })
    }
}

const BASE_COLORS = ["#00AF00", "#7FBF7F", "#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#00FFFF", "#0000FF", "#7F00FF", "#FF00FF"]
function grassColor(tier = 1) {
	if (tier >= BASE_COLORS.length) return  hueBright((tier * 40) % 360, 0.25 + 0.5 * Math.sin(tier / 100))
	return BASE_COLORS[tier]
}

function hueBright(hue, brightness) {
	let rgb

	if (hue > 300) rgb = [1, 0, (360 - hue) / 60]
	else if (hue > 240) rgb = [(hue - 240) / 60, 0, 1]
	else if (hue > 180) rgb = [0, (240 - hue) / 60, 1]
	else if (hue > 120) rgb = [0, 1, (hue - 120) / 60]
	else if (hue > 60) rgb = [(120 - hue) / 60, 1, 0]
	else rgb = [1, hue / 60, 0]
	rgb = [
		Math.round(255 * (brightness + rgb[0] * (1 - brightness))),
		Math.round(255 * (brightness + rgb[1] * (1 - brightness))),
		Math.round(255 * (brightness + rgb[2] * (1 - brightness)))
	]

	return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
}

function toggleLowGrass() {
	if (!player.options.lowGrass && !confirm("This option is for you if you have lag issues on Grass Field. On enabling, your grass amount is capped at 250. Are you sure?")) return
	player.options.lowGrass = !player.options.lowGrass
}