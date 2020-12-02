const { exec } = require('child_process');
const express = require('express');
const cron = require('node-cron');

const currentTime = () => {
    return new Date().toTimeString().split(' ')[0];
}

cron.schedule('*/15 * * * *', function () {
    console.log(currentTime(), 'GETTING LATEST STOCK MARKET DATA - NSE INDIA');

    const process1 = exec('node nseIndia.js');
    process1.stdout.on('data', (data) => {
        console.log(currentTime(), 'NSEINDIA -', data);
    });
    process1.stderr.on('data', (data) => {
        console.log(currentTime(), 'NSEINDIA - ERROR -', data);
    });
});

cron.schedule('5-59/15 * * * *', function () {
    console.log(currentTime(), 'GETTING LATEST STOCK MARKET DATA - INVESTING');
    const process2 = exec('node -r dotenv/config investing.js');
    process2.stdout.on('data', (data) => {
        console.log(currentTime(), 'INVESTING -', data);
    });
    process2.stderr.on('data', (data) => {
        console.log(currentTime(), 'INVESTING - ERROR -', data);
    });
});

const app = express();
app.listen(3000);