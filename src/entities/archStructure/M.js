
export const M = {
    createPolygon:(v0, v1, v2, v3) => [...v0, ...v1, ...v2, ...v0, ...v2, ...v3],
    fillColorFace: c => [...c, ...c, ...c, ...c, ...c, ...c],
    createUv: (v1, v2, v3, v4) => [...v1, ...v2, ...v3, ...v1, ...v3, ...v4],
    applyMatrixToArray(m, arr) {
        const v3 = new THREE.Vector3()
        for (let i = 0; i < arr.length; i += 3) {
            v3.fromArray(arr, i)
            v3.applyMatrix4(m)
            arr[i] = v3.x
            arr[i + 1] = v3.y
            arr[i + 2] = v3.z
        }
    },
    translateVertices(v, x, y, z) {
        const m4 = new THREE.Matrix4().makeTranslation(x, y, z)
        this.applyMatrixToArray(m4, v)
    },
    rotateVerticesY(v, angle) {
        const m4 = new THREE.Matrix4().makeRotationY(angle)
        this.applyMatrixToArray(m4, v)
    },
    angleFromCoords (x, y) {
        let rad = Math.atan(y / x)
        x < 0 && y > 0 && (rad = PI - Math.abs(rad))
        x < 0 && y <= 0 && (rad = PI + Math.abs(rad))
        rad += Math.PI * 6
        rad = rad % (Math.PI * 2)
        return -rad
    },
    mirrorZ: (arr) => {
        const arr2 = []
        for (let i = 0; i < arr.length; i += 18) {
            if (!arr[i + 1]) {
                continue;
            }
            arr2.push(
                arr[i + 3], arr[i + 4], -arr[i + 5],
                arr[i], arr[i + 1], -arr[i + 2],
                arr[i + 15], arr[i + 16], -arr[i + 17],
                arr[i + 3], arr[i + 4], -arr[i + 5],
                arr[i + 15], arr[i + 16], -arr[i + 17],
                arr[i + 12], arr[i + 13], -arr[i + 14],
            )
        }
        arr.push(...arr2)
    },
    getUvByLen: arr => {
        const uv = []
        let minX = 1000
        let minY = 1000
        let maxX = -1000
        let maxY = -1000
        for (let i = 0; i < arr.length; i += 3) {
            if (minX > arr[i]) {
                minX = arr[i]
            }
            if (maxX < arr[i]) {
                maxX = arr[i]
            }
            if (minY > arr[i + 1]) {
                minY = arr[i + 1]
            }
            if (maxY < arr[i + 1]) {
                maxY = arr[i + 1]
            }
        }

        const lx = maxX - minX
        const ly = maxY - minY

        for (let i = 0; i < arr.length; i += 3) {
            const x = (arr[i] - minX) / lx
            const y = (arr[i + 1] - minY) / ly
            uv.push(x, y)
        }
        return uv
    }
}
