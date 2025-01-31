// function for scraping all groups off TGStat


import {chromium} from "playwright";

export async function scraper() {

    const browser = await chromium.launch({headless: false});
    const page = await browser.newPage();
    await page.goto("https://tgstat.com/ratings/chats/crypto/public?sort=members",{waitUntil: "load"});

    // get all elements by .card
    const el = await page.$$("#sticky-center-column > .card");
   
    const groups = el.map(async (elHandle) => {
        // get the href for all the URLs inside
        const links = await elHandle.$$("div > a");
        const linkAttributePromises = links.map((link) => link.getAttribute("href"));
        const resolved = await Promise.all(linkAttributePromises);
        return resolved;
    })

    const resolvedGroups = await Promise.all(groups).then((val) => {
        //pair of # and url
        const urls = val.map((value) => value[1]);
        const split = urls.map((url) => url?.split("/"));
        const onlyGroups = split.map((item) => item?.[4]);
       return onlyGroups;


    });
    return resolvedGroups;



}
