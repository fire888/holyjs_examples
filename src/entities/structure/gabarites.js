import * as THREE from 'three'

const mat = new THREE.LineBasicMaterial({ color: 0x0000ff })

export const createBoxesLines = (w, h, d, countW = 3, countH = 3, countD = 3) => {
    const v = []

    for (let i = 0; i < countW; ++i) {
        for (let j = 0; j < countH; ++j) {
            for (let k = 0; k < countD; ++k) {
                v.push(
                    new THREE.Vector3(w * i, h * j, d * k,),
                    new THREE.Vector3(w * i + 1, h * j, d * k,),

                    new THREE.Vector3(  w * i, h * j, d * k),
                    new THREE.Vector3(   w * i, h * j, d * k + 1,),
                )

                if (i === countW - 1) {
                    v.push(
                        new THREE.Vector3(w * i + 1, h * j, d * k),
                        new THREE.Vector3(w * i + 1, h * j, d * k + 1,)
                    )
                }

                if (k === countD - 1) {
                    v.push(
                        new THREE.Vector3(w * i, h * j, d * k + 1,),
                        new THREE.Vector3(w * i + 1, h * j, d * k + 1,)
                    )
                }
            }
        }
    }

    const geom = new THREE.BufferGeometry().setFromPoints(v)
    //console.log(geom)
    //geom.setAttribute('position', new THREE.BufferAttribute(vF32, 3))
    return new THREE.LineSegments(geom, mat)
}
