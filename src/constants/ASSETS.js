import mapBrickDiff from '../assets/map_brick_diff.jpg'
import atlasBrickDiff from '../assets/atlas.jpg'
import profiles from '../assets/profiles.obj'

export const KEYS_LOADERS = {
    IMG: 'IMG',
    OBJ: 'OBJ',
    GLB: 'GLB',
    FBX: 'FBX',
    CUBE_IMG: 'CUBE_IMG',
}

export const ASSETS_TO_LOAD = [
    { assetType: KEYS_LOADERS.IMG, fileName: mapBrickDiff, key: 'mapBrickDiff', },
    { assetType: KEYS_LOADERS.IMG, fileName: atlasBrickDiff, key: 'atlasBrickDiff', },
    { assetType: KEYS_LOADERS.OBJ, fileName: profiles, key: 'profiles', },
]
