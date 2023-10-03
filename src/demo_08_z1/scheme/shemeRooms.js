import { createHelpLines } from '../geometryRoom/meshHelpLines'

const DOOR_SIZE = 30
const DOOR_SIZE_FULL = 60
const MIN_S = Math.random() * 200 + 180
const MIN_CAN_NOT_DIVIDE_S = 800
const S2 = Math.random() * 1500 + 1200
const S1 = Math.random() * 1500 + 1200

let count = 0
const getId = () => ++count

const firstRoom = {
    id: getId(),
    walls: {
        'n': { id: getId(), p0: [0, 0], p1: [S1, 0] },
        'e': { id: getId(), p0: [S1, 0], p1: [S1, S2] },
        's': { id: getId(), p0: [0, S2], p1: [S1, S2] },
        'w': { id: getId(), p0: [0, 0], p1: [0, S2] },
    }
}

const tryToDivideRoom = (roomData, minS = 250) => {
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

const createLineHelpers = (root) => {
    let l = null
    return {
        createLines: arr => {
            return new Promise(res => {
                if (l) {
                    for (let i = 0; i < l.children.length; ++i) {
                        l.children[i].geometry.dispose()
                        l.remove(l.children[i])
                    }
                    root.studio.removeFromScene(l)
                }
                l = createHelpLines(arr)
                l.position.y = 350
                root.studio.addToScene(l)
                res()
            })
        }
    }
}

const makeScheme = (root) => {
    return new Promise(res => {
        root.studio.setCamTargetPos(S1 / 2, 0, S2 / 2)
        let arrWalls = [firstRoom]
        let maxIterate = 10000

        const checkIsComplete = (arr) => {
            let isComplete = true
            for (let i = 0; i < arr.length; ++i) {
                if (arr[i].notDivide !== true) {
                    isComplete = false
                }
            }
            return isComplete
        }

        const iterateDivide = () => {
            --maxIterate
            if (maxIterate === 0) {
                return;
            }
            if (checkIsComplete(arrWalls)) {
                return void res(arrWalls)
            }
            let indexToDivide = -1

            for (let i = 0; i < arrWalls.length; ++i) {
                if (arrWalls[i].notDivide) {
                    continue;
                }

                const lX = arrWalls[i].walls['s'].p1[0] - arrWalls[i].walls['s'].p0[0]
                const lZ = arrWalls[i].walls['e'].p1[1] - arrWalls[i].walls['e'].p0[1]

                if (lX < MIN_CAN_NOT_DIVIDE_S && lZ < MIN_CAN_NOT_DIVIDE_S && Math.random() < .5) {
                } else {
                    indexToDivide = i
                }
            }

            if (indexToDivide !== -1) {
                arrWalls[indexToDivide].notDivide = true
                const newDataRooms = tryToDivideRoom(arrWalls[indexToDivide], MIN_S)
                if (newDataRooms) {
                    const newArr = arrWalls.filter(item => item.id !== arrWalls[indexToDivide].id)
                    newArr.push(...newDataRooms)
                    arrWalls = newArr
                }
            }

            root.lineHelpers.createLines(arrWalls).then(() => {
                setTimeout(() => iterateDivide(arrWalls), 4)
            })
        }
        iterateDivide(arrWalls)
    })
}

const makeDoors = (root, arrRooms) => {
    return new Promise(res => {
        let i = 0
        let j = 0

        const drawDoor = () => {
            const sData = arrRooms[i].walls['s']
            const eData = arrRooms[i].walls['e']

            if (arrRooms[i].id === arrRooms[j].id) {
                return;
            }

            const nData = arrRooms[j].walls['n']

            const xx = [Math.max(sData.p0[0], nData.p0[0]), Math.min(sData.p1[0], nData.p1[0])]
            if (
                nData.p0[1] === sData.p0[1] &&
                xx[0] >= sData.p0[0] &&
                xx[0] <= sData.p1[0] &&
                xx[1] >= sData.p0[0] &&
                xx[1] <= sData.p1[0] &&

                xx[0] >= nData.p0[0] &&
                xx[0] <= nData.p1[0] &&
                xx[1] >= nData.p0[0] &&
                xx[1] <= nData.p1[0]
            ) {
                const d = xx[1] - xx[0]
                if (d > DOOR_SIZE_FULL) {
                    const doorData = {
                        id: getId(),
                        x0: xx[0] + (d / 2) - DOOR_SIZE * .5,
                        x1: xx[0] + (d / 2) + DOOR_SIZE * .5,
                    }
                    if (!sData.doors) {
                        sData.doors = []
                    }
                    sData.doors.push(doorData)
                    if (!nData.doors) {
                        nData.doors = []
                    }
                    nData.doors.push(doorData)
                }
            }

            const wData = arrRooms[j].walls['w']

            const zz = [Math.max(wData.p0[1], eData.p0[1]), Math.min(wData.p1[1], eData.p1[1])]
            if (
                wData.p0[0] === eData.p0[0] &&
                zz[0] >= eData.p0[1] &&
                zz[0] <= eData.p1[1] &&
                zz[1] >= eData.p0[1] &&
                zz[1] <= eData.p1[1] &&

                zz[0] >= wData.p0[1] &&
                zz[0] <= wData.p1[1] &&
                zz[1] >= wData.p0[1] &&
                zz[1] <= wData.p1[1]
            ) {
                const d = zz[1] - zz[0]
                if (d > DOOR_SIZE_FULL) {
                    const id = getId()
                    if (!eData.doors) {
                        eData.doors = []
                    }
                    eData.doors.push({
                        id,
                        z0: zz[0] + (d / 2) - DOOR_SIZE * .5,
                        z1: zz[0] + (d / 2) + DOOR_SIZE * .5,
                    })
                    if (!wData.doors) {
                        wData.doors = []
                    }
                    wData.doors.push({
                        id,
                        z0: zz[0] + (d / 2) - DOOR_SIZE * .5,
                        z1: zz[0] + (d / 2) + DOOR_SIZE * .5,
                    })
                }
            }
        }

        let savedI = i
        const iterate = () => {
            drawDoor()
            const next = () => {
                ++j
                if (arrRooms.length === j) {
                    root.lineHelpers.createLines(arrRooms).then(() => {})
                    j = 0
                    ++i
                    if (arrRooms.length === i) {
                        res(arrRooms)
                        return
                    }
                }
                iterate()
            }

            if (savedI !== i) {
                savedI = i
                setTimeout(next, 0)
            } else {
                next()
            }
        }
        iterate()
    })
}

const makeDoorsOuter = (root, arrRooms) => {
    return new Promise(res => {
        const outerDoors = []
        for (let i = 0; i < arrRooms.length; ++i) {
            const sData = arrRooms[i].walls['n']
            if (sData.p0[1] === 0) {
                const xx = [sData.p0[0], sData.p1[0]]
                const d = xx[1] - xx[0]
                if (d > DOOR_SIZE_FULL) {
                    const doorData = {
                        id: getId(),
                        x0: xx[0] + (d / 2) - DOOR_SIZE * .5,
                        x1: xx[0] + (d / 2) + DOOR_SIZE * .5,
                        keyMode: 'bigDoor',
                    }
                    if (!sData.doors) {
                        sData.doors = []
                    }
                    sData.doors.push(doorData)
                    outerDoors.push(doorData)
                }
            }
        }
        res(outerDoors)
    })
}

const divideWallsByDoors = (arrWalls) => {
    /** divide walls by doors */
    for (let i = 0; i < arrWalls.length; ++i) {
        const nData = arrWalls[i].walls['n']
        if (nData.doors) {
            nData.doors.sort((a, b) => a.x0 - b.x0)
            nData.wallSegments = []
            for (let j = 0; j < nData.doors.length; ++j) {
                if (j === 0) {
                    nData.wallSegments.push({
                        p0: [...nData.p0],
                        p1: [nData.doors[j].x0, nData.p0[1]],
                    })
                }
                if (nData.doors[j - 1]) {
                    nData.wallSegments.push({
                        p0: [nData.doors[j - 1].x1, nData.p0[1]],
                        p1: [nData.doors[j].x0, nData.p0[1]],
                    })
                }
                if (j === nData.doors.length - 1) {
                    nData.wallSegments.push({
                        p0: [nData.doors[nData.doors.length - 1].x1, nData.p0[1]],
                        p1: [...nData.p1],
                    })
                }
            }
        }
        const sData = arrWalls[i].walls['s']
        if (sData.doors) {
            sData.doors.sort((a, b) => a.x0 - b.x0)
            sData.wallSegments = []
            for (let j = sData.doors.length - 1; j > -1; --j) {
                if (j === sData.doors.length - 1) {
                    sData.wallSegments.push({
                        p0: [...sData.p1],
                        p1: [sData.doors[j].x1, sData.p1[1]],
                    })
                }
                if (sData.doors[j - 1]) {
                    sData.wallSegments.push({
                        p0: [sData.doors[j].x0, sData.p1[1]],
                        p1: [sData.doors[j - 1].x1, sData.p1[1]],
                    })
                }
                if (j === 0) {
                    sData.wallSegments.push({
                        p0: [sData.doors[j].x0, sData.p1[1]],
                        p1: [...sData.p0],
                    })
                }
            }
        }
        const eData = arrWalls[i].walls['e']
        if (eData.doors) {
            eData.doors.sort((a, b) => a.z0 - b.z0)
            eData.wallSegments = []
            for (let j = 0; j < eData.doors.length; ++j) {
                if (j === 0) {
                    eData.wallSegments.push({
                        p0: [...eData.p0],
                        p1: [eData.p0[0], eData.doors[j].z0],
                    })
                }
                if (eData.doors[j - 1]) {
                    eData.wallSegments.push({
                        p0: [eData.p0[0], eData.doors[j - 1].z1],
                        p1: [eData.p0[0], eData.doors[j].z0],
                    })
                }
                if (j === eData.doors.length - 1) {
                    eData.wallSegments.push({
                        p0: [eData.p0[0], eData.doors[j].z1],
                        p1: [...eData.p1],
                    })
                }
            }
        }
        const wData = arrWalls[i].walls['w']
        if (wData.doors) {
            wData.doors.sort((a, b) => a.z0 - b.z0)
            wData.wallSegments = []
            for (let j = wData.doors.length - 1; j > -1; --j) {
                if (j === wData.doors.length - 1) {
                    wData.wallSegments.push({
                        p0: [...wData.p1],
                        p1: [wData.p1[0], wData.doors[j].z1],
                    })
                }
                if (wData.doors[j - 1]) {
                    wData.wallSegments.push({
                        p0: [wData.p1[0], wData.doors[j].z0],
                        p1: [wData.p1[0], wData.doors[j- 1].z1],
                    })
                }
                if (j === 0) {
                    wData.wallSegments.push({
                        p0: [wData.p1[0], wData.doors[j].z0],
                        p1: [...wData.p0],
                    })
                }
            }
        }
    }
}

const getWallsFromRooms = (arrWalls) => {
    return new Promise(res => {
        const floors = []
        const walls = []
        for (let i = 0; i < arrWalls.length; ++i) {
            const colorRoom = [Math.random() * .4, Math.random() * .4, Math.random() * .4]

            const nData = arrWalls[i].walls['n']
            {
                const data = {
                    p0: nData.p0,
                    p1: nData.p1,
                    segments: [],
                    colorRoom,
                }
                if (nData.wallSegments) {
                    for (let i = 0; i < nData.wallSegments.length; ++i) {
                        data.segments.push(nData.wallSegments[i])
                    }
                }
                walls.push(data)
            }
            const sData = arrWalls[i].walls['s']
            {
                const data = {
                    p0: sData.p1,
                    p1: sData.p0,
                    segments: [],
                    colorRoom,
                }
                if (sData.wallSegments) {
                    for (let i = 0; i < sData.wallSegments.length; ++i) {
                        data.segments.push(sData.wallSegments[i])
                    }
                }
                walls.push(data)
            }
            const eData = arrWalls[i].walls['e']
            {
                const data = {
                    p0: eData.p0,
                    p1: eData.p1,
                    segments: [],
                    colorRoom,
                }
                if (eData.wallSegments) {
                    for (let i = 0; i < eData.wallSegments.length; ++i) {
                        data.segments.push(eData.wallSegments[i])
                    }
                }
                walls.push(data)
            }
            const wData = arrWalls[i].walls['w']
            {
                const data = {
                    p0: wData.p1,
                    p1: wData.p0,
                    segments: [],
                    colorRoom,
                }
                if (wData.wallSegments) {
                    for (let i = 0; i < wData.wallSegments.length; ++i) {
                        data.segments.push(wData.wallSegments[i])
                    }
                }
                walls.push(data)
            }

            const floorData = {
                p0: sData.p0,
                p1: sData.p1,
                p2: nData.p1,
                p3: nData.p0,
                colorRoom,
            }
            floors.push(floorData)
        }
        res({ walls, floors })
    })
}

const prepareDoors = arrWalls => {
    return new Promise(res => {
        const doors = {}
        for (let i = 0; i < arrWalls.length; ++i) {
            for (let key in arrWalls[i].walls) {
                if (arrWalls[i].walls[key].doors) {
                    for (let j = 0; j < arrWalls[i].walls[key].doors.length; ++j) {
                        let x = null, z = null
                        if (key === 'n' || key === 's') {
                            z = arrWalls[i].walls[key].p0[1]
                        }
                        if (key === 'e' || key === 'w') {
                            x = arrWalls[i].walls[key].p0[0]
                        }

                        doors[arrWalls[i].walls[key].doors[j].id] = {
                            ...arrWalls[i].walls[key].doors[j],
                            dir: key,
                            x, z,
                        }
                    }
                }
            }
        }
        for (let key in doors) {
            if (doors[key].x0) {
                doors[key].l = doors[key].x1 - doors[key].x0
                doors[key].p0 = [doors[key].x0, doors[key].z]
                doors[key].p1 = [doors[key].x1, doors[key].z]
                doors[key].angle = 0
            } else {
                doors[key].l = doors[key].z1 - doors[key].z0
                doors[key].p0 = [doors[key].x, doors[key].z0]
                doors[key].p1 = [doors[key].x, doors[key].z1]
                doors[key].angle = -Math.PI / 2
            }
        }
        res(doors)
    })
}

const prepareOuterDoors = (firstRoom, outerDoors) => {
    return new Promise(res => {
        const outerWallsData = JSON.parse(JSON.stringify(firstRoom))
        const wallsOuter = []
        for (let key in outerWallsData.walls) {
            if (key === 'n') {
                outerDoors.sort((a, b) => a.x0 - b.x0)
                const doorOffset = 10
                for (let i = outerDoors.length - 1; i > -1; --i) {
                    if (i === outerDoors.length - 1) {
                        wallsOuter.push({
                            p0: [...outerWallsData.walls[key].p1],
                            p1: [outerDoors[i].x1 + doorOffset, outerWallsData.walls[key].p1[1]]
                        })
                    }
                    if (outerDoors[i - 1]) {
                        wallsOuter.push({
                            p0: [outerDoors[i].x0 - doorOffset, outerWallsData.walls[key].p1[1]],
                            p1: [outerDoors[i - 1].x1 + doorOffset, outerWallsData.walls[key].p1[1]]
                        })
                    }
                    if (i === 0) {
                        wallsOuter.push({
                            p0: [outerDoors[i].x0 - doorOffset, outerWallsData.walls[key].p1[1]],
                            p1: [...outerWallsData.walls[key].p0]
                        })
                    }
                }
            }
            if (key === 's') {
                wallsOuter.push({ p0: outerWallsData.walls[key].p0, p1: outerWallsData.walls[key].p1 })
            }
            if (key === 'e') {
                wallsOuter.push({ p0: outerWallsData.walls[key].p1, p1: outerWallsData.walls[key].p0 })
            }
            if (key === 'w') {
                wallsOuter.push({ p0: outerWallsData.walls[key].p0, p1: outerWallsData.walls[key].p1 })
            }
        }
        res(wallsOuter)
    })
}

export async function createTown2Scheme (root) {
    root.lineHelpers = createLineHelpers(root)

    const arrRooms = await makeScheme(root)
    const arrWalls = await makeDoors(root, arrRooms)
    const outerDoors = await makeDoorsOuter(root, arrWalls)
    await divideWallsByDoors(arrWalls)
    const { walls, floors } = await getWallsFromRooms(arrWalls)
    const doors = await prepareDoors(arrWalls)
    const wallsOuter = await prepareOuterDoors(firstRoom, outerDoors)

    return { wallsOuter, walls, doors, floors }
}
