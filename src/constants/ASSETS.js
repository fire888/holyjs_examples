import mapBrickDiff from '../assets/map_brick_diff.jpg'

export const KEYS_LOADERS = {
    IMG: 'IMG',
    OBJ: 'OBJ',
    GLB: 'GLB',
    FBX: 'FBX',
    CUBE_IMG: 'CUBE_IMG',
}

export const ASSETS_TO_LOAD = [
    { assetType: KEYS_LOADERS.IMG, fileName: mapBrickDiff, key: 'mapBrickDiff',},
]
