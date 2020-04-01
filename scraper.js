const puppeteer = require('puppeteer');

const scrapeWunderGround = async function(date, url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector('.observation-table');
    const weatherData = [];
    const cols = await page.$$('.observation-table > table > tbody > tr > td');
    for(let i=0; i<cols.length; i++) {
        const table = await cols[i].$('table');
        const trs = await table.$$('tr');
        weatherData.push([]);
        for(let j=0; j<trs.length; j++) {
            weatherData[i].push([]);
            const tds = await trs[j].$$('td');
            for(let k=0; k<tds.length; k++) {
                const txt = await tds[k].getProperty('textContent');
                const rawTxt = await txt.jsonValue();
                weatherData[i][j].push(rawTxt.trim());
            }
        }
    }
    let [month, year] = [date.split('-')[1], date.split('-')[0]];
    let weatherJson = {};
    for(let i=1; i<weatherData[0].length; i++) {
        weatherJson[`${month}-${parseInt(weatherData[0][i])}-${year}`] = {
            maxTemp: weatherData[1][i][0],
            avgTemp: weatherData[1][i][1],
            minTemp: weatherData[1][i][2],
            maxDewPoint: weatherData[2][i][0],
            avgDewPoint: weatherData[2][i][1],
            minDewPoint: weatherData[2][i][2],
            maxHumidity: weatherData[3][i][0],
            avgHumidity: weatherData[3][i][1],
            minHumidity: weatherData[3][i][2],
            maxWindspeed: weatherData[4][i][0],
            avgWindspeed: weatherData[4][i][1],
            minWindspeed: weatherData[4][i][2],
            maxPressure: weatherData[5][i][0],
            avgPressure: weatherData[5][i][1],
            minPressure: weatherData[5][i][2],
            precipitation: weatherData[6][i][0]
        }
    }
    browser.close();
    return weatherJson;
}

module.exports = {
    scrapeWunderGround
}