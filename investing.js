const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

const blockedResources = require('./blockedResources');

puppeteer.use(StealthPlugin());

const getInvestingData = async () => {
    const browser = await puppeteer.launch({ headless: false, userDataDir: './data' });

    try {
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.setViewport({ width: 1200, height: 720 });
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36');
        await page.setRequestInterception(true);
        page.on('request', (request) => {
            if (request.url().endsWith('.png') || request.url().endsWith('.jpg')) {
                request.abort();
            }
            else if (blockedResources.some(resource => request.url().indexOf(resource) !== -1)) {
                request.abort();
            }
            else {
                request.continue();
            }
        });
        page.on('dialog', async dialog => {
            await dialog.dismiss();
        });

        await page.goto('https://in.investing.com/');
        const cookie = await page.cookies();
        const isLoggedIn = cookie.some((c) => (c.name === 'ses_id'));
        if (!isLoggedIn) {
            console.log('INVESTING - Logging on to investing.com');
            await page.goto('https://in.investing.com/members-admin/login');
            await page.waitForSelector('#emailSigningNotify');

            const userName = process.env.investing_username;
            const pass = process.env.investing_pw;

            await page.type('input[name="loginFormUser_email"]', userName);
            await page.type('#loginForm_password', pass);

            console.log('INVESTING - clicking login button');
            await page.evaluate(async () => {
                const elem = document.querySelector('#signup .newButton.orange');
                await elem.click();
            });

            await page.waitForSelector('span.user-name', { visible: true, timeout: 0 });
        }

        console.log('INVESTING - Navigating to portfolio page');
        await page.goto('https://in.investing.com/portfolio/?portfolioID=YGZmMG8xYT5jNjo%2BNGM%3D');
        
        console.log('INVESTING - Downloading portfolio');
        await page.click('.portfolioActionsContainer.float_lang_base_2');
        await page.click('.addRow.js-open-download-portfolio-popup');
        await page.click('#downloadPortfolio .footer .newBtn.Orange2');

        await page.waitForTimeout(15000);

        console.log('INVESTING - Done');
        browser.close();
    } catch (e) {
        console.log("INVESTING - Error:", e);
        browser.close();
    }
}

module.exports = getInvestingData;

if (require.main === module) {
    console.log('Starting data fetch');
    getInvestingData();
}