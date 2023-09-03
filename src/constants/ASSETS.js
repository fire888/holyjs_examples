import '../assets/progress-img.png'

// import nx from '../assets/nx.jpg'
// import px from '../assets/px.jpg'
// import nz from '../assets/nz.jpg'
// import pz from '../assets/pz.jpg'
// import ny from '../assets/ny.jpg'
// import py from '../assets/py.jpg'

import mapBrickDiff from '../assets/map_brick_diff.jpg'

export const KEYS_LOADERS = {
    IMG: 'IMG',
    OBJ: 'OBJ',
    GLB: 'GLB',
    FBX: 'FBX',
    CUBE_IMG: 'CUBE_IMG',
}

export const ASSETS_TO_LOAD = [
    // {
    //     type: 'cubeTextures',
    //     filename: [px, nx, py, ny, nz, pz],
    //     key: 'skyBox'
    // },
    { assetType: KEYS_LOADERS.IMG, fileName: mapBrickDiff, key: 'mapBrickDiff',},
]
