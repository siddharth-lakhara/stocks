const express = require('express');
const cron = require('node-cron');
const getInvestingData = require('./investing');
const getNSEIndiaData = require('./nseIndia');

const currentTime = () => {
    return new Date().toTimeString().split(' ')[0];
}

cron.schedule('*/15 * * * *', async () => {
    console.log(currentTime(), 'GETTING LATEST STOCK MARKET DATA');
    await getInvestingData();
    await getNSEIndiaData();
    console.log('\n');
});

const app = express();
app.listen(3000);