import * as THREE from 'three'

export class ClickerOnScene extends THREE.Object3D {
    constructor() {
        super()
        this.camera = null

        this._raycaster = new THREE.Raycaster()
        this._mouse = new THREE.Vector2()
        this.plane = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 100, 100),
            new THREE.MeshBasicMaterial({ color: 0xFF0000})
        )
        this.plane.rotation.x = -Math.PI / 2
        this.plane.visible = false
        this.add(this.plane)

        let date = Date.now()
        window.addEventListener('mousedown', event => {
            date = Date.now()
        })

        window.addEventListener('mouseup', event => {
            if (Date.now() - date < 200) {
                this.move(event.clientX, event.clientY)
            }
        })
    }

    move(clientX, clientY) {
        if (!this.camera) {
            return
        }
        this._mouse.x = (clientX / window.innerWidth) * 2 - 1
        this._mouse.y = -(clientY / window.innerHeight) * 2 + 1

        this._raycaster.setFromCamera(this._mouse, this.camera)
        const intersects = this._raycaster.intersectObject(this.plane, true)
        if (!intersects[0]) {
            return
        }
        if (this.cb) {
            this.cb(intersects[0].point)
        }
    }

    setCB (cb) {
        this.cb = cb
    }
}
