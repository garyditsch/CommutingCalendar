// https://stackoverflow.com/questions/45211408/making-a-grouped-bar-chart-using-d3-js
// https://observablehq.com/@d3/gallery

//grabbing the svg element
const runStatsSvg = d3.select("#run_stats_svg")
//  the size of the overall svg element
const marginBar = { top: 10, right: 20, bottom: 35, left: 0 };
const widthBar = 500 - marginBar.left - marginBar.right;
const heightBar = 800 - marginBar.top - marginBar.bottom;


const stravaDraw = (dates) => {

    const topTen = dates.sort((a,b) => { return b.value - a.value }).slice(0,15)
    
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
}

const drawStravaBar = async () => {
    const data = await getRunData(running_csv)
    const parsedData = d3.csvParse(data);
    const dates = await runDateValues(parsedData)
    stravaDraw(dates);
}
drawStravaBar();