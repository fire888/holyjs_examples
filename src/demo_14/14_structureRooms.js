import * as THREE from "three";
import { createStudio } from './studio'
import { createTown2 } from './town2'
import consA0Src from '../assets/broken_down_concrete2_ao.jpg'
import consNormSrc from '../assets/broken_down_concrete2_Normal-dx.jpg'

async function initApp () {
    const studio = createStudio(3)
    studio.setCamPos(0, 1000, -1000)
    const root = { studio }
    root.materials = {
        'wallVirtualColor': new THREE.MeshBasicMaterial({
            color: 0xffffff,
            emissive: 0x000000,
            map: root.texture,
            bumpMap: root.texture,
            bumpScale: .1,
            specular: 0xffffff,
            vertexColors: true,
        }),
        'testRed': new THREE.MeshBasicMaterial({
            color: 0xff0000,
        }),
        'iron' : new THREE.MeshPhongMaterial({
            color: 0xcccccc,
            lightMapIntensity: .35,
            aoMap: new THREE.TextureLoader().load(consA0Src),
            normalMap: new THREE.TextureLoader().load(consNormSrc),
            normalScale: new THREE.Vector2(.1, .1),
            reflectivity: .02,
            shininess: 100,
            specular: 0x020201,
            vertexColors: true,
        }),
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

    const town = createTown2(root)
}


window.addEventListener('load', () => {
    initApp().then()
})
