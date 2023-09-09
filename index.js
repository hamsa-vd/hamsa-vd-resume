const SVG_LOAD_TIME = 2000;
const DEFAULT_LOAD_TIME = 500;

const RESUME_LOCATION = "https://drive.google.com/file/d/1Vqvp0kF1FYGqbYXLmNUaqfrhcakdhEkD/view"
const GIT_HOME = "https://raw.githubusercontent.com/hamsa-vd/resume/main/"

const picWrapper = document.querySelector(".pic-wrapper")
const contentWrapper = document.querySelector(".content")
const resumeHome = document.querySelector(".resume-home")

loadContent()

async function delay(time = DEFAULT_LOAD_TIME){
    return new Promise(res => {
        setTimeout(() => { res() }, time)
    })
}
    
/**
 * 
 * @returns {Promise<SVGElement | null>}
 */
async function fetchSvg(){
    return new Promise(async resolve => {
        try {
            const svgSrc = GIT_HOME + picWrapper.dataset.svgSrc
            const svgText = await (await fetch(svgSrc)).text()
            const parser = new DOMParser();
            const svgEl = parser.parseFromString(svgText, 'image/svg+xml').documentElement
            resolve(svgEl)
        } catch (error) {
            console.error(error)
            resolve(null)
        }
    })
}

/**
 * 
 * @param {Array<Element>} paths 
 * @param {number} loadTime
 */
async function lazyLoadSvg(paths, loadTime = SVG_LOAD_TIME){
    const gEl = picWrapper.querySelector("g")
    const pathLoadTime = loadTime/paths.length
    for(const path of paths){
        await delay(pathLoadTime)
        gEl.appendChild(path)
    }
}

function loadImage(){
    const img = document.createElement("img")
    img.src = GIT_HOME + picWrapper.dataset.imgSrc
    picWrapper.appendChild(img)
}

async function loadContent(){
    const svg = await fetchSvg()
    if(svg) {
        const gEl = svg.querySelector("g")
        const paths = Array.from(gEl.children)
        gEl.innerHTML = ""
        picWrapper.appendChild(svg)
        await lazyLoadSvg(paths)
        svg.style.opacity = 0
    }
    loadImage()
    await delay()
    picWrapper.classList.add("disappear")
    await delay()
    resumeHome.removeChild(picWrapper)
    contentWrapper.classList.add("appear")
    await delay()
    window.location.href = RESUME_LOCATION
}