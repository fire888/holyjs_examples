import { createMap } from './map'

export const generateStructureScheme = (data, studio, materials) => {
    return new Promise(res => {
        const dataStructure = {
            SIZE_X: data.numW,
            SIZE_Y: data.numH,
            SIZE_Z: data.numD,
            mapFill: [],
            // mapFill: [
            //     { place: [0, 0, 0], resultTileIndex: 3 },
            //     { place: [0, 0, 1], resultTileIndex: 14 },
            //     { place: [1, 0, 1], resultTileIndex: 21 },
            //     { place: [1, 0, 2], resultTileIndex: 4 },
            // ],
        }
        const generator = createMap(data.tiles, studio, materials)
        generator.generateMap(dataStructure).then(r => {
            console.log('resultStructure', r)
            res(r)
        })
    })

}
