const { execFile } = require('child_process');
const express = require('express');
const cron = require('node-cron');

cron.schedule('*/15 * * * *', function () {
    const date = new Date().toTimeString().split(' ')[0];
    console.log('Getting stocks data:', date);
    execFile('node', ['nseIndia.js']);
    console.log();
});

const app = express();
app.listen(3000);