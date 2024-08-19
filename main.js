import { argv } from 'node:process';
import { 
    normalizeURL,
    getURLsFromHTML,
    crawlPage
} from "./crawl.js";

function main() {
    const args = argv.slice(2)
    if (args.length === 1) {
        const baseURL = args[0]
        console.log(`Starting crawl of: ${baseURL}...`)
        crawlPage(baseURL)
        return
    }
    console.log(`whoops`)
}

main();