import { JSDOM } from 'jsdom'

function normalizeURL(urlString){
    try {
        const url = new URL(urlString)
        const host = url.host
        let path = url.pathname
        if (path.slice(-1) === '/') {
            path = path.slice(0, -1)
        }
        return (host + path).toLowerCase()
    }
    catch {
        console.log("Invalid URL")
    }
}

function getURLsFromHTML(htmlBody, baseURL){
    const dom = new JSDOM(htmlBody)
    const anchors = dom.window.document.querySelectorAll('a')
    const urls = []

    for (let anchor of anchors){
        if (anchor.hasAttribute('href')) {
            let href = anchor.getAttribute('href')
            try {
                href = new URL(href, baseURL).href
                urls.push(href)
            } catch(err) {
                console.log(`${err.message}: ${href}`)
            }
        }
    }
    return urls
}

async function crawlPage(baseURL) {

    let res
    try {
        res = await fetch(baseURL)
    } catch (err) {
        throw new Error(`Network error fetching the URL: ${err.message}`);
    }

    // Check if the request was successful
    if (!res.status > 399) {
        throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const contentType = res.headers.get('content-type')
    if (!contentType || !contentType.includes('text/html')) {
        console.log(`Not an HTML page, content-type: ${res.headers.get('content-type')}`);
    }

    console.log(await res.text())
}


export { 
    normalizeURL,
    getURLsFromHTML,
    crawlPage
}