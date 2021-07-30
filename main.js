import { 
    draw as drawCalendarHeatMap
} from './modules/running.js';

import {
    draw as drawMilestoneChart
} from './modules/milestone.js';

import {
    getStreak
} from './modules/streak.js';

import {
    draw as horizontalBarDraw
} from './modules/barChart.js';

// Fetch the data from the csv file
const getRunData = async (url) => {
    const response = await fetch(url);
    const data = await response.text();
    return data
}

const getMilestones = (data) => {
    const fiftyMiles = []
    let milestoneCount = 1
    let runTotal = 0

    for (let i = 0; i < data.length; i++) {
        runTotal = runTotal + data[i].value
        if (runTotal === 200) {
            milestoneCount = milestoneCount + 1
            fiftyMiles.push({ 'date': data[i], 'miles': runTotal })
        } else if ((runTotal >= 200 * milestoneCount) && (milestoneCount != 0)) {
            milestoneCount = milestoneCount + 1
            fiftyMiles.push({ 'date': data[i], 'miles': runTotal })
        }
    }
    return fiftyMiles
}

// Where I save the csv data
const running_csv = "https://gist.githubusercontent.com/garyditsch/7e8b58555746148d10009f9954a9e690/raw/strava_run_data_2021.csv"
// https://gist.githubusercontent.com/garyditsch/7e8b58555746148d10009f9954a9e690/raw/d52398ff228567d16030e6a771c3bdd4dada1f89/strava_run_data_2021.csv
// const running_csv = "https://gist.githubusercontent.com/garyditsch/f24197477b181077c64bb3f6de034223/raw/all_strava.csv"


// map over the data and return a new array with just the formatted date and distance of the commute
// this format was utilized by the example I worked from would like to improve with additional data
// convert from km to miles
// TODO: bring in other data for additional data sources
const runDateValues = async (data) => data.map(dv => ({
    date: d3.timeDay(new Date(dv['Activity Date'])),
    value: Number(dv['Distance']) * 0.6213712
}));

//grabbing the first svg element
const runSvg = d3.select("#run_svg");
const timelineSvg = d3.select('#milestone')
const streakCanvas = document.getElementById('streakText');
const runStatsSvg = d3.select("#run_stats_svg")

// start / end dates 
const startDate = new Date('1/1/2021').getTime()
const endDate = new Date('12/31/2021').getTime()

const drawMilestone = async () => {
    const data = await getRunData(running_csv)
    const parsedData = d3.csvParse(data);
    const orderedData = parsedData.sort((a, b) => new Date(a['Activity Date']) - new Date(b['Activity Date']));
    const dates = await runDateValues(orderedData)
    const milestones = getMilestones(dates)
    drawMilestoneChart(milestones, timelineSvg, startDate, endDate);
}

const drawStreak = async () => {
    const data = await getRunData(running_csv)
    const parsedData = d3.csvParse(data);
    const dates = await runDateValues(parsedData)
    const longestStreak = getStreak(dates)
    streakCanvas.innerHTML = `<span style="font-size: 3rem; width: 300px; color: rgb(83, 157, 204)">${longestStreak} Days</span>`
}

const drawStravaBar = async () => {
    const data = await getRunData(running_csv)
    const parsedData = d3.csvParse(data);
    const dates = await runDateValues(parsedData)
    horizontalBarDraw(dates, runStatsSvg, 500, 800, 6);
}

const drawCalendar = async () => {
    const data = await getRunData(running_csv)
    const parsedData = d3.csvParse(data);
    // Need to sort the run dates, had to create date object b/c the string data wouldn't sort properly
    // const orderedData = parsedData.sort((a, b) => new Date(a['Activity Date']) - new Date(b['Activity Date']));
    const dates = await runDateValues(parsedData)
    drawCalendarHeatMap(dates, runSvg);
}

drawCalendar();
drawMilestone();
drawStreak();
drawStravaBar();