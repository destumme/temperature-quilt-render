const QUILT_CANVAS_ID = 'quilt'

function mod(n, m) {
    return ((n % m) + m) % m;
  }


function redraw(){
    const canvas = document.getElementById(QUILT_CANVAS_ID);
    if (canvas.getContext) {
        const ctx = canvas.getContext("2d");
        ctx.reset()
    }

    renderDays(5)
}

function draw() {
    const canvas = document.getElementById(QUILT_CANVAS_ID);
    if (canvas.getContext) {
        const ctx = canvas.getContext("2d");
    }
}

const below = '#9573B3'
const above = '#582139'
const colors = [
    '#7D52A1',
    '#61318D',
    '#423C64',
    '#2C3A61',
    '#024869',
    '#005482',
    '#04687B',
    '#00878B',
    '#18B0B8',
    '#18AE87',
    '#1D9A57',
    '#75C483',
    '#B2CA89',
    '#D9BA6E',
    '#EA9153',
    '#E4836B',
    '#E0595F',
    '#CB1D5D',
    '#9D1E54',
    '#6F1846',
]

function getFill(temp) {
    if (temp < -10) {
        return below
    } else if (temp > 90) {
        return above
    } else {
        return colors[Math.floor((temp+10)/5)]
    }
    
}

function renderDays(count) {
    const rad = 50
    const canvas = document.getElementById(QUILT_CANVAS_ID);
    if (canvas.getContext) {
        const ctx = canvas.getContext("2d");
        ctx.lineWidth = 2
        ctx.strokeStyle = "white"

        let previous = {
            ref: {
                x: 0,
                y: 0,
                pos: 2
            },
            high: 0,
            low: 0,
            temp: {...temps[0]}
        }

        const arcs = {
            0: {
                xmod: 0,
                ymod: 0,
                start: 0,
                end: Math.PI/2 
            },
            1: {
                xmod: rad,
                ymod: 0,
                start: Math.PI/2,
                end: Math.PI 
            },
            2: {
                xmod: rad,
                ymod: rad,
                start: Math.PI,
                end: (3*Math.PI)/2 
            },
            3: {
                xmod: 0,
                ymod: rad,
                start: (3*Math.PI)/2,
                end: 2*Math.PI 
            }
        }
        
        ctx.fillStyle = getFill(previous.temp.low)

        let start = {
            x: 0,
            y: 0
        }

        ctx.fillRect(start.x, start.y, rad, rad)
        ctx.strokeRect(start.x, start.y, rad, rad)

        ctx.beginPath()

        let pos = previous.ref.pos
        ctx.moveTo(arcs[pos].xmod, arcs[pos].ymod)
        ctx.arc(arcs[pos].xmod, arcs[pos].ymod, rad-10, arcs[pos].start, arcs[pos].end)
        ctx.lineTo(arcs[pos].xmod, arcs[pos].ymod)
        ctx.fillStyle = getFill(previous.temp.high)
        ctx.stroke()
        ctx.fill()

        for (let i = 1; i < count; i++) {
            const temp = {...temps[i]}
            if (temp.high > previous.temp.high) {
                pos = mod((previous.ref.pos + 1), 4)
            } else if (temp.high < previous.temp.high) {
                pos = mod((previous.ref.pos - 1) , 4)
            } else {
                pos = previous.ref.pos
            }

            start = {
                x: previous.ref.x + rad,
                y: previous.ref.y
            }

            if (start.x > 13 * rad) {
                start.x = mod(start.x, 14)
                start.y = start.y + rad
            }


            ctx.fillStyle = getFill(temp.low)
            ctx.fillRect(start.x, start.y, rad, rad)
            ctx.strokeRect(start.x, start.y, rad, rad)

            ctx.beginPath()
            ctx.moveTo(start.x + arcs[pos].xmod, start.y + arcs[pos].ymod)
            ctx.arc(start.x + arcs[pos].xmod, start.y + arcs[pos].ymod, rad-10, arcs[pos].start, arcs[pos].end)
            ctx.lineTo(start.x +  arcs[pos].xmod, start.y + arcs[pos].ymod)
            ctx.fillStyle = getFill(temp.high)
            ctx.stroke()
            ctx.fill()



            previous.ref.pos = pos
            previous.ref.x = start.x,
            previous.ref.y = start.y
            previous.temp = {...temp}

        }
    }

    
}


document.getElementById("drawBtn").onclick = redraw
window.addEventListener("load", renderDays(temps.length));
