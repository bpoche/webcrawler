import { JSDOM } from 'jsdom'

function normalizeURL(urlString){
    const url = new URL(urlString)
    const host = url.host
    let path = url.pathname
    if (path.slice(-1) === '/') {
        path = path.slice(0, -1)
    }
    return (host + path).toLowerCase()
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
                console.log(`getURLSFromHTML: ${err.message}: ${href}`)
            }
        }
    }
    return urls
}

async function fetchPage(url) {
    // console.log("Fectching",url)
    let res
    try {
        res = await fetch(url)
    } catch (err) {
        throw new Error(`Network error fetching the URL: ${url}, ${err.message}`);
    }

    // Check if the request was successful
    if (res.status >= 400) {
        throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const contentType = res.headers.get('content-type')
    if (!contentType || !contentType.includes('text/html')) {
        console.log(`Not an HTML page, url: ${url}, content-type: ${contentType}`);
    }

    return await res.text()
}

//Initially called with base url
async function crawlPage(baseURL, currentURL = baseURL, pages = {}) {

    //Avoid searching entire internet by making sure urls have same hosts
    const currentURLObj = new URL(currentURL)
    const baseURLObj = new URL(baseURL)
    if (currentURLObj.hostname !== baseURLObj.hostname) {
        // console.log(`hosts do not match, base: ${baseURL}, current: ${currentURL} skipping...`)
        return pages
    }

    //http:// prefix treated same as https:// etc.
    const normalizedURL =  normalizeURL(currentURL)

    // increment page counter if already visited, or initialize to 1
    if (pages[normalizedURL] > 0) {
        pages[normalizedURL]++
        return pages
    }

    // Initialize page count to 1
    pages[normalizedURL] = 1

    // Fetch and parse html for currentURL
    console.log(`crawling ${currentURL}`)
    let htmlBody
    try {
        htmlBody = await fetchPage(currentURL)
    } catch (err) {
        //throw new Error(`Failed to get html, ${err.message}`)
        console.log(`${err.message}`)
        return pages
    }

    // Loop through internal links and recusively call crawlPage
    const urls = getURLsFromHTML(htmlBody, baseURL)
    for (const newURL of urls){
        pages =  await crawlPage(baseURL, newURL, pages)
    }
    return pages
}


export { 
    normalizeURL,
    getURLsFromHTML,
    fetchPage,
    crawlPage
}