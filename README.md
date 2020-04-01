# monthly-weather-scraper
Get historical monthly weather data for any city in the world in json format. This program scrapes data from https://www.wunderground.com/history.

# How to use

1. Open terminal, navigate to the directory and run the following command: <br> `npm install`
2. Start the program by running the following command: <br> `node index.js`
2. The program will prompt you for the following inputs:
    1. start date in mm-yyyy format.
    2. end date in mm-yyyy format.
    3. country code.
    4. state code.
    5. city name. If name contains spaces, add a '-' in between.
3. The output json file containing weather data will be saved in the same directory. 