import * as THREE from "three"

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
    scaleVertices (v, x, y, z) {
        const m4 = new THREE.Matrix4().makeScale(x, y, z)
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
    },
    ran: function (start, end) { return start + Math.random() * (end - start) },
    fillColorFaceWithSquare: function(c1, c2){ return [
        ...this.fillColorFace(c1),
        ...this.fillColorFace(c2),
        ...this.fillColorFace(c2),
        ...this.fillColorFace(c2),
        ...this.fillColorFace(c2),
    ]},
    createFaceWithSquare: function (v1, v2, v3, v4, color1, color2) {
        const maxW = v2[0] - v1[0]
        const maxH = v3[1] - v1[1]

        const innerW = this.ran(maxW * 0.3, maxW * 0.7)
        const innerH = this.ran(maxH * 0.3, maxH * 0.7)

        const x1 = v1[0] + (maxW - innerW) / 2
        const x2 = v2[0] - (maxW - innerW) / 2
        const y1 = v1[1] + (maxH - innerH) / 2
        const y2 = v3[1] - (maxH - innerH) / 2

        const v1_i = [x1, y1, v1[2]]
        const v2_i = [x2, y1, v1[2]]
        const v3_i = [x2, y2, v1[2]]
        const v4_i = [x1, y2, v1[2]]

        const vArr = []
        vArr.push(
            ...this.createPolygon(v1_i, v2_i, v3_i, v4_i),
            ...this.createPolygon(v1, v2, v2_i, v1_i),
            ...this.createPolygon(v2_i, v2, v3, v3_i),
            ...this.createPolygon(v4_i, v3_i, v3, v4),
            ...this.createPolygon(v1, v1_i, v4_i, v4),
        )

        const cArr = this.fillColorFaceWithSquare(color1, color2)

        const uArr = [
            ...this.createUv(
                [.5, .5],
                [1, .5],
                [1, 1],
                [.5, 1],
            ),
            ...this.createUv(
                [0, .5],
                [.5, .5],
                //[.5, 1],
                //[0, 1],
                [.4, .6],
                [.1, .6],
            ),
            ...this.createUv(
                [.4, .6],
                [.5, .5],
                [.5, 1],
                [.4, .9],
            ),
            ...this.createUv(
                [.1, .9],
                [.4, .9],
                [.5, 1],
                [0, 1],
            ),
            ...this.createUv(
                [0, .5],
                [.1, .6],
                [.1, .9],
                [0, 1],
            )
        ]
        return { vArr, cArr, uArr }
    },
    inverseVertexOrder: v => {
        for (let i = 0; i < v.length; i += 18) {
            const n0_0 = v[i]
            const n0_1 = v[i + 1]
            const n0_2 = v[i + 2]

            const n1_0 = v[i + 3]
            const n1_1 = v[i + 3 + 1]
            const n1_2 = v[i + 3 + 2]

            const n4_0 = v[i + 12]
            const n4_1 = v[i + 12 + 1]
            const n4_2 = v[i + 12 + 2]

            const n5_0 = v[i + 15]
            const n5_1 = v[i + 15 + 1]
            const n5_2 = v[i + 15 + 2]

            v[i] = n1_0
            v[i + 1] = n1_1
            v[i + 2] = n1_2

            v[i + 3] = n0_0
            v[i + 3 + 1] = n0_1
            v[i + 3 + 2] = n0_2

            v[i + 6] = n5_0
            v[i + 6 + 1] = n5_1
            v[i + 6 + 2] = n5_2

            v[i + 9] = n1_0
            v[i + 9 + 1] = n1_1
            v[i + 9 + 2] = n1_2

            v[i + 12] = n5_0
            v[i + 12 + 1] = n5_1
            v[i + 12 + 2] = n5_2

            v[i + 15] = n4_0
            v[i + 15 + 1] = n4_1
            v[i + 15 + 2] = n4_2
        }
    }
}
