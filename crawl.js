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

async function fetchHTML(url) {
    try {
        const response = await fetch(url);
        
        // Check if the request was successful
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        // Get the response body as text (HTML content)
        const html = await response.text();
        return html;
    } catch (error) {
        console.error('Error fetching the HTML:', error);
        return null;
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


export { 
    normalizeURL,
    getURLsFromHTML
}