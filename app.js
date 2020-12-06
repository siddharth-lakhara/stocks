const express = require('express');
const cron = require('node-cron');
const getInvestingData = require('./investing');
const getNSEIndiaData = require('./nseIndia');
const parseInvestingData = require('./parseInvestingData');

const currentTime = () => {
    return new Date().toTimeString().split(' ')[0];
}

cron.schedule('*/15 * * * *', async () => {
    console.log(currentTime(), 'GETTING LATEST STOCK MARKET DATA');
    console.log(currentTime(), 'Downloading investing data');
    await getInvestingData();
    console.log(currentTime(), 'Downloading NSE India data');
    await getNSEIndiaData();
    console.log(currentTime(), 'Copying data to excel');
    await parseInvestingData();
    console.log('\n');
});

const app = express();
app.listen(3000);