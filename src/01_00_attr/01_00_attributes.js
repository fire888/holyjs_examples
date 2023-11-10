import * as THREE from "three";
import { createStudio } from '../helpers/studio'
import { updateEveryFrame } from "../helpers/frameUpdater"

const { sin, cos } = Math

async function initApp () {
    const studio = createStudio()
    studio.showGrid()
    studio.setBackColor(0x333333)
    studio.setCamTargetPos(.5, .5, 0)
    updateEveryFrame(studio.render)
    const materials = { 'simple': new THREE.MeshBasicMaterial({color: 0xFF0000}) }

    /** **************************************************/
    {

        const v = [
            .5, 0, -.2,
            1, 0, -.2,
            1, 2, -.2,

            0, .2, -.2,
            1, 2.1, -.2,
            0, 2, -.2,
        ]

        const geometry = new THREE.BufferGeometry()
        const vF32 = new Float32Array(v)
        geometry.setAttribute('position', new THREE.BufferAttribute(vF32, 3))

        const mesh = new THREE.Mesh(geometry, materials.simple)
        studio.addToScene(mesh)

        updateEveryFrame(n => {
            geometry.attributes.position.array[0] = sin(n * 5)
            geometry.attributes.position.array[9] = sin(n * 5)
            geometry.attributes.position.needsUpdate = true
        })
    }
}


window.addEventListener('load', () => {
    initApp().then()
})
