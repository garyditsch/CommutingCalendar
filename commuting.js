// const sample = [
//     {Date: "2017-08-30", AnswerCount: "9510" },
//     {Date: "2018-09-23", AnswerCount: "8498" },
//     {Date: "2015-02-10", AnswerCount: "10334" }
// ];


// Fetch the data from the csv file
const getData = async (url) => {
    const response = await fetch(url);
    const data = await response.text();
    return data
}

// Where I save the csv data
const commuting_csv = "https://gist.githubusercontent.com/garyditsch/beb02ef6a73f69d65707eee6c3cd128b/raw/commuting_data.csv"

// map over the data and return a new array with just the formatted date and distance of the commute
// this format was utilized by the example I worked from would like to improve with additional data
// TODO: bring in other data for additional data sources
const dateValues = async (data) => data.map(dv => ({
    date: d3.timeDay(new Date(dv['Start Time'])),
    value: Number(dv['Distance (miles)'])
    }));

//grabbing the first svg element
const svg = d3.select("#bike_svg");

// getting the width and height of the svg
// had to look up getBoundingClientRect() as hadn't used it previous
// https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
// lines 37 - 40 can be uncommented to see what is returned when not deconstructed
const {width, height} = document
    .getElementById("bike_svg")
    .getBoundingClientRect();

// const object = document
//     .getElementById("svg")
//     .getBoundingClientRect();
// console.log(object)

const draw = (dates) => {
    // return array with months grouped together. NOTE: nest is deprecated in future d3 versions
    const months = d3.nest()
        // .key(d => d.date.getUTCFullYear())
        .key(d => d.date.toLocaleString('default', { month: 'long' }))
        .entries(dates)
        .reverse()

    // get array of all values
    const values = dates.map(c => c.value);
    
    // get max/min values 
    const maxValue = d3.max(values);
    const minValue = d3.min(values);
    
    // set constants, yearHeight is * 7 for days of week
    const cellSize = 25;
    const yearHeight = cellSize * 7;

    // adding g element to svg
    const group = svg.append("g");  

    // adds g element for each month with data to svg
    // gives the y axis value to move g element based on month index within data
    const month = group
        .selectAll("g")
        .data(months)
        .join("g")
        .attr(
            "transform",
            (d, i) => `translate(50, ${yearHeight * i + cellSize * 1.5})`
        );

    // add the month label with positioning and style
    month
        .append("text")
        .attr("x", -5)
        .attr("y", -35)
        .attr("text-anchor", "end")
        .attr("font-size", 16)
        .attr("font-weight", 550)
        .attr("transform", "rotate(270)")
            .text(d => d.key);

    // function to return week label
    const formatDay = d =>
        ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][d.getUTCDay()];
    
    // return an index representing day of week: Ex: 0 = Sunday, 6 = Saturday
    const countDay = d => d.getUTCDay();

    // https://www.geeksforgeeks.org/d3-js-d3-utcsunday-function/
    // returns array of all the sundays from a start/end date
    const timeWeek = d3.utcSunday;
    const formatDate = d3.utcFormat("%x");


    
    const colorFn = d3
            .scaleSequential(d3.interpolateBuGn)
            .domain([Math.floor(minValue), Math.ceil(maxValue)]);
    const format = d3.format("+.2%");

    
    // adds group element that displays add the day of week label 
    month
        .append("g")
        .attr("text-anchor", "end")
        .selectAll("text")
        .data(d3.range(7).map(i => new Date(1995, 0, i)))
        .join("text")
        .attr("x", -5)
        .attr("y", d => (countDay(d) + 0.5) * cellSize)
        .attr("dy", "0.31em")
        .attr("font-size", 12)
        .text(formatDay);

    // console.log(month, '119')

    month
        .append("g")
        .selectAll("rect")
            .data(d => d.values)
        .join("rect")
        .attr("width", cellSize - 1.5)
        .attr("height", cellSize - 1.5)
        .attr(
            "x",
            (d, i) => timeWeek.count(d3.utcMonth(d.date), d.date) * cellSize + 10
        )
        .attr("y", d => countDay(d.date) * cellSize + 0.5)
        .attr("fill", d => colorFn(d.value))
        .append("title")
            .text(d => `${formatDate(d.date)}: ${d.value.toFixed(2)}`);

    const legend = group
        .append("g")
        .attr(
            "transform",
            `translate(10, ${months.length * yearHeight + cellSize * 4})`
        );

    const categoriesCount = 10;
    const categories = [...Array(categoriesCount)].map((_, i) => {
    const upperBound = (maxValue / categoriesCount) * (i + 1);
    const lowerBound = (maxValue / categoriesCount) * i;

    return {
        upperBound,
        lowerBound,
        color: d3.interpolateBuGn(upperBound / maxValue),
        selected: true
        };
    });
}

const drawTheCalendar = async () => {
    const data = await getData(commuting_csv)
    const parsedData = d3.csvParse(data);
    console.log(parsedData);
    const dates = await dateValues(parsedData)
    console.log(dates)
    draw(dates);
    console.log('hello')
}
drawTheCalendar();

