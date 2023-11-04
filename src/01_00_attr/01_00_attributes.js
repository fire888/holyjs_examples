import * as THREE from "three";
import { createStudio } from '../helpers/studio'
import { updateEveryFrame } from "../helpers/frameUpdater"

const { sin, cos } = Math

async function initApp () {
    const studio = createStudio()
    studio.setCamTargetPos(.5, .5, 0)
    updateEveryFrame(studio.render)
    const materials = { 'simple': new THREE.MeshBasicMaterial({color: 0xFF0000}) }

    /** **************************************************/
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

        updateEveryFrame(n => {
            // geometry.attributes.position.array[0] = sin(n * 5)
            // geometry.attributes.position.array[9] = sin(n * 5)
            // geometry.attributes.position.needsUpdate = true
        })
    }
}


window.addEventListener('load', () => {
    initApp().then()
})
