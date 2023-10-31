const cnv = document.querySelector('canvas')
const ctx = cnv.getContext('2d')

cnv.width = innerWidth - 6
cnv.height = innerHeight - 6
// x, y, cor, raio, sentido

function geradorDeBola(x, y, color, raio, sentido = true) {
    ctx.beginPath()
    ctx.fillStyle = color
    ctx.arc(x, y, raio, 0, Math.PI * 2, sentido)
    ctx.closePath()
    ctx.fill()
}

const bolasCriadas = []

let selected

cnv.addEventListener('mousedown', ({ offsetX, offsetY }) => {
    bolasCriadas.find(({ x, y, raio, helding, cor }) => {
        const cat1 = x - offsetX
        const cat2 = y - offsetY
        const hyp = Math.hypot(cat1, cat2)
        if (hyp < raio) selected = cor, bolasCriadas.find((e) => {
            if (e.cor === selected) e.helding = true
        })
    })

})

cnv.addEventListener('mouseup', () => {
    for (let i = 0; i < bolasCriadas.length; i += 1) {
        bolasCriadas[i].helding = false
    }
})

cnv.addEventListener('mousemove', ({ offsetX, offsetY }) => {
    for (let i = 0; i < bolasCriadas.length; i += 1) {
        const e = bolasCriadas[i]
        if (e.helding) {
            e.x = offsetX
            e.y = offsetY
        }
    }
})

function geradorAutomatico(quantidade, sentido = true) {
    for (let i = 0; i < quantidade; i += 1) {
        const raio = Math.round(Math.random() * 190 + 10)
        let x = Math.floor(Math.random() * cnv.width)
        let y = Math.floor(Math.random() * cnv.height)
        const vtX = Math.floor(Math.random() * 10 + 1)
        x = x - raio < 0 ? x = + raio : x
        y = y - raio < 0 ? y = + raio : y
        x = x + raio > cnv.width ? x -= raio : x
        y = y + raio > cnv.width ? y -= raio : y
        const cor = `rgb(${Math.floor(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)})`
        bolasCriadas.push({ x, y, raio, cor, vtX, vtY: 0, helding: false })
        geradorDeBola(x, y, cor, raio, sentido)
    }
}

// console.log(bolasCriadas)

function recreate() {
    ctx.clearRect(0, 0, cnv.width, cnv.height)
    bolasCriadas.forEach(({ x, y, raio, cor }) => {
        geradorDeBola(x, y, cor, raio, true)

    })
}


function move() {
    for (let i = 0; i < bolasCriadas.length; i += 1) {
        const e = bolasCriadas[i]
        let gravidade = Math.round(Math.random() * 1 + 0.2)
        if (!e.helding) {
            e.vtY += gravidade
            e.y += e.vtY
            e.x += e.vtX
            if ((e.y + e.raio) > cnv.height) e.y = cnv.height - e.raio, e.vtY *= -1, e.vtY += e.y / 350
            if ((e.y - e.raio) < 0) e.y = 0 + e.raio, e.vtY *= -1, e.vtY -= e.y / 350
            if ((e.x + e.raio) > cnv.width || (e.x - e.raio) < 0) {
                if ((e.x - e.raio) < 0) e.x = e.raio, e.x += e.vtX *= -1
                if ((e.x + e.raio) > cnv.width) e.x = cnv.width - e.raio, e.x += e.vtX *= -1
            }
            for (let i2 = 0; i2 < bolasCriadas.length; i2 += 1) {
                const e2 = bolasCriadas[i2]
                if (e2 != e) {
                    const cat1 = e.x - e2.x
                    const cat2 = e.y - e2.y
                    const hyp = Math.hypot(cat1, cat2)
                    // console.log(hyp)
                    // if (hyp < (e.raio + e2.raio + 0.3)) {
                    //     e.vtX = 0
                    //     e2.vtX= 0
                    //     if (e.y - e.raio < e2.y + e2.raio || e2.y - e2.raio < e.y + e.raio) {
                    //         e.vtY *= -1
                    //         e2.vtY *= -1
                    //         e.y = e.y
                    //         e2.y = e2.y
                    //         console.log(e.vtY, e2.vtY)
                    //     }
                    //     console.log('pimba')
                    //     // console.log(e.vtX)
                    // }
                }
            }
        }

    }
}

geradorAutomatico(100, true)

function loop() {
    window.requestAnimationFrame(loop)
    recreate()
    move()
}

window.onload = () => {
    loop()
} 