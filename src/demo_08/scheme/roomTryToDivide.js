let minS = 250
let S2 = 3000
let S1 = 3000

let count = 0
export const getId = () => {
    ++count
    return count
}

export let roomStart = null

export const regenerate = () => {
    minS = Math.random() * 200 + 180
    S2 = Math.random() * 2000 + 800
    S1 = Math.random() * 2000 + 800
    roomStart = {
        id: getId(),
        walls: {
            'n': { id: getId(), p0: [0, 0], p1: [S1, 0] },
            'e': { id: getId(), p0: [S1, 0], p1: [S1, S2] },
            's': { id: getId(), p0: [0, S2], p1: [S1, S2] },
            'w': { id: getId(), p0: [0, 0], p1: [0, S2] },
        }
    }

}

export const tryToDivideRoom = (roomData) => {
    const { walls } = roomData
    let isXBig = false
    let isZBig = false
    let divideAxis = null

    const lX = walls['s'].p1[0] - walls['s'].p0[0]
    const lZ = walls['e'].p1[1] - walls['e'].p0[1]

    if (lX > minS) {
        isXBig = true
        divideAxis = 'x'
    }

    if (lZ > minS) {
        isZBig = true
        divideAxis = 'z'
    }
    
    if (isXBig && isZBig) {
        divideAxis = Math.random() < .5 ? 'x' : 'z'
    }

    if (!divideAxis) {
        return null
    }

    const newRooms = []
    if (divideAxis === 'x') {
        const newX = (walls['s'].p1[0] - walls['s'].p0[0]) * (0.3 + Math.random() * .4) + walls['s'].p0[0]
        newRooms.push(
            {
                id: getId(),
                walls: {
                    'n': {
                        id: getId(),
                        p0: [...walls['n'].p0],
                        p1: [newX, walls['n'].p1[1]]
                    },
                    'e': {
                        id: getId(),
                        p0: [newX, walls['e'].p0[1]],
                        p1: [newX, walls['e'].p1[1]]
                    },
                    's': {
                        id: getId(),
                        p0: [...walls['s'].p0],
                        p1: [newX, walls['s'].p1[1]]
                    },
                    'w': {
                        id: getId(),
                        p0: [...walls['w'].p0],
                        p1: [...walls['w'].p1]
                    },
                }
            },
            {
                id: getId(),
                walls: {
                    'n': {
                        id: getId(),
                        p0: [newX, walls['n'].p0[1]],
                        p1: [...walls['n'].p1]
                    },
                    'e': {
                        id: getId(),
                        p0: [...walls['e'].p0],
                        p1: [...walls['e'].p1]
                    },
                    's': {
                        id: getId(),
                        p0: [newX, walls['s'].p0[1]],
                        p1: [...walls['s'].p1]
                    },
                    'w': {
                        id: getId(),
                        p0: [newX, walls['w'].p0[1]],
                        p1: [newX, walls['w'].p1[1]]
                    },
                }
            },
        )
    }

    if (divideAxis === 'z') {
        const newZ = (walls['e'].p1[1] - walls['e'].p0[1]) * (0.3 + Math.random() * .4) + walls['e'].p0[1]
        newRooms.push(
            {
                id: getId(),
                walls: {
                    'n': {
                        id: getId(),
                        p0: [...walls['n'].p0],
                        p1: [...walls['n'].p1]
                    },
                    'e': {
                        id: getId(),
                        p0: [...walls['e'].p0],
                        p1: [walls['e'].p1[0], newZ]
                    },
                    's': {
                        id: getId(),
                        p0: [walls['s'].p0[0], newZ],
                        p1: [walls['s'].p1[0], newZ]
                    },
                    'w': {
                        id: getId(),
                        p0: [...walls['w'].p0],
                        p1: [walls['w'].p0[0], newZ]
                    },
                }
            },
            {
                id: getId(),
                walls: {
                    'n': {
                        id: getId(),
                        p0: [walls['n'].p0[0], newZ],
                        p1: [walls['n'].p1[0], newZ]
                    },
                    'e': {
                        id: getId(),
                        p0: [walls['e'].p0[0], newZ],
                        p1: [...walls['e'].p1]
                    },
                    's': {
                        id: getId(),
                        p0: [...walls['s'].p0],
                        p1: [...walls['s'].p1]
                    },
                    'w': {
                        id: getId(),
                        p0: [walls['w'].p0[0], newZ],
                        p1: [...walls['w'].p1]
                    },
                }
            },

        )
    }

    return newRooms
}
