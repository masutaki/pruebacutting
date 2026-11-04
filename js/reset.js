const RESET = {}

el.setup.reset = _=>{
    for (x in RESET) {
        let resetTable = new Element("reset_div_"+x)

        if (resetTable.el) {
            let r = RESET[x]

            let html = `
            <div id="reset_info_div_${x}">
                <h2>${r.title}</h2><br>
                ${r.resetDesc}
                <div style="position: absolute; bottom: 0; width: 100%;">
                    <div id="reset_gain_${x}"></div>
                    ${r.btns ?? ''}
                    <button id="reset_btn_${x}" onclick="gardenReset('${x}')">${(r.hotkey ? `(${r.hotkey}) ` : ``) + r.resetBtn}</button>
                    ${x=='gh'||x=='gs'?`<button id="reset_auto_${x}">Auto: OFF</button>`:""}
                </div>
            </div>
            <div id="reset_req_div_${x}" class="reset_req ${x}"><div id="reset_req_desc_${x}"></div></div>
            `

            resetTable.setHTML(html)
            resetTable.addClass(x)
        }
    }

    document.getElementById('reset_auto_gh').onclick = _=>{
        player.autoGH = !player.autoGH
    }

    document.getElementById('reset_auto_gs').onclick = _=>{
        player.autoGS = !player.autoGS
    }
}

function updateResetHTML(id) {
    let r = RESET[id]
    let unl = r.unl?r.unl():true

    tmp.el["reset_div_"+id].setDisplay(unl)

    if (unl) {
        let req = r.req?r.req():true

        tmp.el["reset_info_div_"+id].setDisplay(req)
        tmp.el["reset_req_div_"+id].setDisplay(!req)
        tmp.el["reset_req_desc_"+id].setHTML(r.reqDesc())

        if (req) {
            tmp.el["reset_gain_"+id].setHTML(r.resetGain())
        }
    }
}

el.update.reset = _=> {
    if (mapID == 'pc') {
        updateResetHTML('pp')
        updateResetHTML('crystal')

        updateResetHTML('ap')
        updateResetHTML('oil')

        updateResetHTML('np')
        updateResetHTML('cloud')

        updateResetHTML('astro')
        updateResetHTML('quadrant')
    } else if (mapID == 'gh') {
        updateResetHTML('gh')
        updateResetHTML('steel')

        updateResetHTML('gs')
        updateResetHTML('fun')

        updateResetHTML('gj')
        updateResetHTML('planetary')
    } else if (mapID == 'as') {
        updateResetHTML('decel')
    } else if (mapID == 'rp') {
        updateResetHTML('rocket_part')
        updateResetHTML('gal')
        updateResetHTML('recel')
    } else if (mapID == 'sac') {
        updateResetHTML('sac')
        updateResetHTML('enterPlanetoid')
    } else if (mapID == 'auto') {
        updateResetHTML('formRing')
    }
}
