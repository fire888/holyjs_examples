import * as THREE from "three";

const materialW = new THREE.LineBasicMaterial({ color: 0xFFFFFF })

export const createLine = (data) => {
    const { p0, p1 } = data
    const y = -.5
    const p = [...p0, ...p1]
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(p), 3))
    return new THREE.Line(geometry, materialW);
}

export const createLineFromVectors = (v0, v1, color) => {
    const materialW = new THREE.LineBasicMaterial({ color})
    const p = [...v0.toArray(), ...v1.toArray()]
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(p), 3))
    return new THREE.Line(geometry, materialW);
}
