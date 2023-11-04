const updateFunctions = []
let n = 0
const animate = () => {
    requestAnimationFrame(animate)
    n += .014
    updateFunctions.forEach(fn => fn(n))
}
animate()

export const updateEveryFrame = (f) => {
    updateFunctions.push(f)
}
