const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const notifier = require('node-notifier');

puppeteer.use(StealthPlugin());

const getNSEIndiaData = async () => {
    const browser = await puppeteer.launch({headless: false});
    try {
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0);
        await page.setViewport({width: 1200, height: 720});
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36');

        await page.goto('https://www.nseindia.com/market-data/live-equity-market');
        await page.waitForSelector('#equitieStockSelect');
        await page.waitForTimeout(5000);

        await page.select('select#equitieStockSelect', 'Securities in F&O');
        await page.waitForTimeout(5000);

        await page.evaluate(() => {
            const elem = document.querySelector(".downloads a");
            elem.click();
            return elem;
        })
        
        await page.waitForTimeout(5000);
        console.log('Complete');

        notifier.notify({
            message: 'Latest stock market data downloaded',
        });
        
        browser.close();
    } catch (e) {
        console.log("Error:", e);
        browser.close();
    }
};

module.exports = getNSEIndiaData;

if (require.main === module) {
    console.log('Fetching data');
    getNSEIndiaData();
}