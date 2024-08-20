import { argv } from 'node:process';
import { 
    normalizeURL,
    crawlPage
} from "./crawl.js";

import { printReport } from "./report.js";

async function main() {
    const args = argv.slice(2)
    if (args.length === 1) {
        const baseURL = args[0]
        console.log(`Starting crawl of: ${baseURL}...`)
        const normalizedBaseURL = normalizeURL(baseURL)
        if (!normalizedBaseURL) {
            console.log("Invalid base URL provided. Exiting...")
            return
        }
        const pages = await crawlPage(baseURL)
        printReport(pages)
        return
    }
    console.log(`Usage: node main.js <url>`)
}

await main();