import * as THREE from "three";
import { createStudio } from '../entities/studio'
import { createLoadManager } from '../entities/loadManager'
import { ASSETS_TO_LOAD } from '../constants/ASSETS'

const { sin, cos } = Math

async function initApp () {
    const studio = createStudio()
    studio.setCamTargetPos(.5, .5, 0)
    const materials = {
        'simple': new THREE.MeshBasicMaterial({color: 0xFF0000}),
    }
    const updateFunctions = []
    let n = 0
    const animate = () => {
        requestAnimationFrame(animate)
        n += .014
        updateFunctions.forEach(fn => fn(n))
        studio.render()
    }
    animate()


    /** CUSTOM 00_00 ***********************************/
    {

        const v = [
            0, 0, 0,
            1, 0, 0,
            1, 2, 0,

            0, 0, 0,
            1, 2.1, 0,
            0, 2, 0,
        ]

        const geometry = new THREE.BufferGeometry()
        const vF32 = new Float32Array(v)
        geometry.setAttribute('position', new THREE.BufferAttribute(vF32, 3))

        const mesh = new THREE.Mesh(geometry, materials.simple)
        studio.addToScene(mesh)

        updateFunctions.push(n => {
            geometry.attributes.position.array[0] = sin(n * 5)
            geometry.attributes.position.array[9] = sin(n * 5)
            geometry.attributes.position.needsUpdate = true
        })
    }
}


window.addEventListener('load', () => {
    initApp().then()
})
