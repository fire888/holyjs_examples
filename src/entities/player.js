import * as THREE from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

export class Player extends THREE.PerspectiveCamera {
    constructor (x = 0, y = 0, z = 0, arrToCollision) {
        super(75, window.innerWidth / window.innerHeight, .01, 1000)

        this._arrToCollision = arrToCollision

        this.position.set(x, y, z)
        this.controls = new PointerLockControls(this, document.body)

        this.bottomObj = new THREE.Object3D()
        this.bottomObj.position.fromArray([0, -.02, 0])
        this.add(this.bottomObj)

        document.body.addEventListener('click', () => {
            this.controls.lock()
        })

        this._forward = false
        document.addEventListener('keydown', e => {
            if (e.code === 'ArrowUp') {
                this._forward = true
            }
        })
        document.addEventListener('keyup', e => {
            if (e.code === 'ArrowUp') {
                this._forward = false
            }
        })

        this._vecStart = new THREE.Vector3()
        this._vecDir = new THREE.Vector3()
        this._rayCaster = new THREE.Raycaster(this._vecStart, this._vecDir)
    }

    update () {
        const [ isCollision, distance ] = this._checkCollisions()
        if (isCollision) {
            if (distance < .48) {
                this.translateY(.48 - distance)
            }
        } else {
            this.position.y -= .005
        }

        if (this._forward) {
            this.translateZ(-.01)
        }
    }

    _checkCollisions () {
        this.getWorldPosition(this._vecStart)
        this.bottomObj.getWorldPosition(this._vecDir)

        this._vecDir.sub(this._vecStart)

        const intersects = this._rayCaster.intersectObjects(this._arrToCollision)

        if (intersects[0] && intersects[0].distance < .5) {
            return [true, intersects[0].distance]
        }
        return [false, null]
    }
}
