const prompt = require('prompt');
const moment = require('moment');
const scraper = require('./scraper');
const fs = require('fs');

prompt.start();

prompt.get(['start [mm-yyyy]', 'end [mm-yyyy]', 'country', 'state_abbreviation', 'city'], async function (err, result) {
    if (err) { return onErr(err); }
    let [startDate, endDate, country, state, city] = [
        moment(`01-${result['start [mm-yyyy]']}`, 'DD-MM-YYYY'), 
        moment(`31-${result['end [mm-yyyy]']}`, 'DD-MM-YYYY'),
        result['country'],
        result['state_abbreviation'],
        result['city']
    ];
    let weatherData = {};
    for (var m = moment(startDate); m.isBefore(endDate); m.add(1, 'months')) {
        let date = m.format('YYYY-MM');
        let weatherUrl = `https://www.wunderground.com/history/monthly/${country}/${state}/${city}/date/${date}`;
        weatherData[date] = await scraper.scrapeWunderGround(date, weatherUrl);
    }
    const fileName = `./${city}-${result['start [mm-yyyy]']}-${result['end [mm-yyyy]']}.json`;
    fs.writeFileSync(fileName, JSON.stringify(weatherData, null, 4));
    console.log(`output saved to ${fileName}`);
});

function onErr(err) {
    console.log(err);
    return 1;
}