const prompt = require('prompt');
const moment = require('moment');
const scraper = require('./scraper');
const fs = require('fs');

prompt.start();

prompt.get(['start [mm-yyyy]', 'end [mm-yyyy]', 'icao_code'], async function (err, result) {
    if (err) { return onErr(err); }
    let [startDate, endDate, icaoCode] = [
        moment(`01-${result['start [mm-yyyy]']}`, 'DD-MM-YYYY'), 
        moment(`31-${result['end [mm-yyyy]']}`, 'DD-MM-YYYY'),
        result['icao_code']
    ];
    console.log('Scraping the web...')
    let weatherData = {};
    for (var m = moment(startDate); m.isBefore(endDate); m.add(1, 'months')) {
        let date = m.format('YYYY-MM');
        let weatherUrl = `https://www.wunderground.com/history/monthly/${icaoCode}/date/${date}`;
        console.log(`Getting data for date ${date} from ${weatherUrl}`);
        weatherData[date] = await scraper.scrapeWunderGround(date, weatherUrl);
    }
    const fileName = `./data/${icaoCode}-${result['start [mm-yyyy]']}-${result['end [mm-yyyy]']}.json`;
    fs.writeFileSync(fileName, JSON.stringify(weatherData, null, 4));
    console.log(`Output saved to ${fileName}`);
});

function onErr(err) {
    console.log(err);
    return 1;
}