import { FACET33 } from '../../schemes/schemeFacet33'
import { FACET22 } from '../../schemes/schemeFacet22'
import { rotateArrY, translateArr } from "../../helpers/geomHelpers";


const F = {
    FACET22,
    FACET33,
}

export const createTopPr = (params) => {
    const v = []
    
    const { w, d, h, facetT } = params
    const { offsetX, offsetZ } = facetT 

    const { points } = F[facetT.type]
    const profile = []
    for (let i = 0; i < points.length; ++i) {
        profile.push(points[i][0], h + points[i][1], 0)
    }

    const profileWS = [...profile]
    rotateArrY(profileWS, Math.PI / 4)
    translateArr(profileWS, offsetX, 0, -offsetZ)

    const profileWN = [...profile]
    rotateArrY(profileWN, -Math.PI / 4)
    translateArr(profileWN, offsetX, 0, -d + offsetZ)

    const profileES = [...profile]
    rotateArrY(profileES, Math.PI * 0.75)
    translateArr(profileES, w - offsetX, 0, -offsetZ)

    const profileEN = [...profile]
    rotateArrY(profileEN, -Math.PI * 0.75)
    translateArr(profileEN, w - offsetX, 0, -d + offsetZ)

    const arrProfiles = [
        profileWN,
        profileWS,
        profileES,
        profileEN,
        profileWN,
    ]

    for (let p = 1; p < arrProfiles.length; ++p) {
        const pPrev = arrProfiles[p - 1]
        const pNext = arrProfiles[p]

        for (let i = 3; i < pPrev.length; i += 3) {
            v.push(
                pPrev[i - 3], pPrev[i - 2], pPrev[i - 1],
                pNext[i - 3], pNext[i - 2], pNext[i - 1],
                pNext[i], pNext[i + 1], pNext[i + 2],
                pPrev[i - 3], pPrev[i - 2], pPrev[i - 1],
                pNext[i], pNext[i + 1], pNext[i + 2],
                pPrev[i], pPrev[i + 1], pPrev[i + 2],
            )
        }

    }

    const n = profileWS.length - 3
    // v.push(
    //     profileWS[n], profileWS[n + 1], profileWS[n + 2],
    //     profileES[n], profileES[n + 1], profileES[n + 2],
    //     profileEN[n], profileEN[n + 1], profileEN[n + 2],
    //     profileWS[n], profileWS[n + 1], profileWS[n + 2],
    //     profileEN[n], profileEN[n + 1], profileEN[n + 2],
    //     profileWN[n],
    //     profileWN[n + 1],
    //     profileWN[n + 2],
    // )

    return {
        v,
        wso: [profileWS[0], profileWS[1], profileWS[2]],
        wno: [profileWN[0], profileWN[1], profileWN[2]],
        eso: [profileES[0], profileES[1], profileES[2]],
        eno: [profileEN[0], profileEN[1], profileEN[2]],

        wsi: [profileWS[n], profileWS[n + 1], profileWS[n + 2]],
        wni: [profileWN[n], profileWN[n + 1], profileWN[n + 2]],
        esi: [profileES[n], profileES[n + 1], profileES[n + 2]],
        eni: [profileEN[n], profileEN[n + 1], profileEN[n + 2]],
    }
}
