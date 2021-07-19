// https://stackoverflow.com/questions/45211408/making-a-grouped-bar-chart-using-d3-js
// https://observablehq.com/@d3/gallery


// Fetch the data from the csv file
const getBarData = async (url) => {
    const response = await fetch(url);
    const data = await response.text();
    return data
}

// Where I save the csv data
const strava_csv = "https://gist.githubusercontent.com/garyditsch/7e8b58555746148d10009f9954a9e690/raw/strava_run_data_2021.csv"

const stravaValues = async (data) => data.map(dv => ({
    date: d3.timeDay(new Date(dv['Activity Date'])),
    value: Number(dv['Distance']) * 0.6213712
}));

//grabbing the svg element
const runStatsSvg = d3.select("#run_stats_svg")
//  the size of the overall svg element
const marginBar = { top: 10, right: 20, bottom: 35, left: 0 };
const widthBar = 500 - marginBar.left - marginBar.right;
const heightBar = 800 - marginBar.top - marginBar.bottom;


const stravaDraw = (dates) => {

    const topTen = dates.sort((a,b) => { return b.value - a.value }).slice(0,20)
    console.log(topTen)
    
    const formatDate = d3.utcFormat("%x");

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(topTen, d => d.value)])
        .range([0, widthBar])

    const yScale = d3.scaleBand()
        .domain(topTen.map(d => d.date))
        .range([0, heightBar])
        .padding(0.05)


    runStatsSvg
        .attr('width', widthBar + marginBar.left + marginBar.right)
        .attr('height', heightBar + marginBar.top + marginBar.bottom)
        .style('background', '#fff')
        .append('g')
        .attr('transform', `translate(${marginBar.left}, ${marginBar.top})`);

    runStatsSvg
        .append('g')
        .selectAll('rect')
        .data(topTen)
        .enter().append('rect')
        .style('fill', 'rgb(83, 157, 204)')
        .style('stroke', '#000')
        .style('stroke-width', '0')
        .attr('height', yScale.bandwidth)
        .attr('width', (topTen) => xScale(topTen.value))
        .attr('y', topTen => yScale(topTen.date))
        .attr('x', 0 + marginBar.left)
        

    runStatsSvg
        .append('g')
        .selectAll('text')
        .data(topTen)
        .enter().append('text')
        .attr('height', yScale.bandwidth)
        .attr('width', (topTen) => xScale(topTen.value))
        .attr('y', topTen => yScale(topTen.date) + marginBar.top + 10)
        .attr('x', 0 + marginBar.left + 10)
        .text(d => `${formatDate(d.date)}` + `, ` +  `${d.value.toFixed(2)} miles`)
        .style('fill', "#fff")

    // runStatsSvg
    //     .append('g')
    //     .call(d3.axisLeft(yScale))
    //     .attr('transform', `translate(${marginBar.left})`)

    // runStatsSvg
    //     .append('g')
    //     .attr('transform', `translate(${marginBar.left}, ${heightBar})`)
    //     .call(d3.axisBottom(xScale))
    //     .selectAll('text')
    //     .style('text-anchor', 'end')
    //     .style('font-size', '10px')
    //     .style('color', '#000')    
}

const drawStravaBar = async () => {
    const data = await getBarData(strava_csv)
    const parsedData = d3.csvParse(data);
    const dates = await stravaValues(parsedData)
    stravaDraw(dates);
    console.log('hello bar chart')
}
drawStravaBar();