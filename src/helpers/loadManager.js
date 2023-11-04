import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { KEYS_LOADERS } from "../constants/ASSETS";


export const createLoadManager = dataAssets => {
    return new Promise(res => {
        const loaders = {
            [KEYS_LOADERS.IMG]: new THREE.TextureLoader(),
            [KEYS_LOADERS.GLB]: new GLTFLoader(),
            [KEYS_LOADERS.FBX]: new FBXLoader(),
            [KEYS_LOADERS.OBJ]: new OBJLoader(),
            [KEYS_LOADERS.CUBE_IMG]: new THREE.CubeTextureLoader(),
        }
        const assets = {}

        const loadAsset = index => {
            if (!dataAssets[index]) {
                return res(assets)
            }

            const { assetType, fileName, key } = dataAssets[index]
            console.log(assetType)
            loaders[assetType].load(fileName, asset => {
                assets[key] = asset
                loadAsset(++index)
            })
        }
        loadAsset(0)
    })
}
