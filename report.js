function sortPages(pages) {
    // Convert pages dictionary into an array of [key,value] pairs
    const pagesArray = Object.entries(pages)
    pagesArray.sort((a,b) => {
        if (b[1] === a[1]) {
            return a[0].localeCompare(b[0])
        } else {
            return b[1] - a[1]
        }
    })

    const sortedPages = Object.fromEntries(pagesArray)

    return sortedPages
}

function printReport(pages) {
    console.log('Report is starting...')
    
    const sortedPages = sortPages(pages)

    for (const url in sortedPages) {
        let count = sortedPages[url]
        console.log(`Found ${count} internal links to ${url}`)
    }
}

export { printReport }