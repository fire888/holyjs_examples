import { M } from '../structure/M'

const v033 = 1 / 3
const v066 = v033 * 2

export const tileUv = {
    'line_p0': M.createUv([0, 0.75], [0.25, 0.75], [0.25, 1], [0, 1]),
    'line_p1': M.createUv([0, 0.5], [0.25, 0.5], [0.25, 0.75], [0, 0.75]),

    'columnSide_0':  M.createUv([0, 0], [0.0625, 0], [0.0625, 0.25], [0, 0.25]),
    'columnSide_1':  M.createUv([0.0625, 0], [0.125, 0], [0.125, 0.25], [0.0625, 0.25]),
    'columnSide_2':  M.createUv([0.125, 0], [0.1875, 0], [0.1875, 0.25], [0.125, 0.25]),
    'columnSide_3':  M.createUv([0.1875, 0], [0.25, 0], [0.25, 0.25], [0.1875, 0.25]),

    'three': [0.125, 0.5,    0, 0.25,    0.25, 0.25],

    'lines': M.createUv([0.5, 0], [0.75, 0], [0.75, .25], [0.5, .25]),
    'points': M.createUv([0.25, 0], [0.5, 0], [0.5, .25], [0.25, .25]),
    'empty': M.createUv([0.25, 0.25], [0.5, 0.25], [0.5, .5], [0.25, .5]),
    'briks': M.createUv([0.75, 0], [1, 0], [1, .25], [0.75, .25]),

    'gor_pattern_00': M.createUv([0.25, 0.96875], [0.5, 0.96875], [0.5, 1], [0.25, 1]),
    'gor_pattern_01': M.createUv([0.25, 0.9375], [0.5, 0.9375], [0.5, 0.96875], [0.25, 0.96875]),

    'face_00': M.createUv([0.5, 0.75], [0.75, 0.75], [0.75, 1], [0.5, 1]),

    'white': M.createUv([0.75, 0.5], [1, 0.5], [1, .75], [0.75, .75]),


    '0_0': M.createUv([0, 0], [v033, 0], [v033, v033], [0, v033]),
    '1_0': M.createUv([v033, 0], [v066, 0], [v066, v033], [v033, v033]),
    '2_0': M.createUv([v066, 0], [1, 0], [1, v033], [v066, v033]),

    '0_1': M.createUv([0, v033], [v033, v033], [v033, v066], [0, v066]),
    '1_1': M.createUv([v033, v033], [v066, v033], [v066, v066], [v033, v066]),
    '2_1': M.createUv([v066, v033], [1, v033], [1, v066], [v066, v066]),

    '0_2': M.createUv([0, v066], [v033, v066], [v033, 1], [0, 1]),
    '1_2': M.createUv([v033, v066], [v066, v066], [v066, 1], [v033, 1]),
    '2_2': M.createUv([v066, v066], [1, v066], [1, 1], [v066, 1]),
}

const l = ['columnSide_1', 'columnSide_2', 'columnSide_3']
export const randomTile = () => {
    const k = l[Math.floor(Math.random() * l.length)]
    return tileUv[k]
}
