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
const svg = d3.select("#svg");

// getting the width and height of the svg
// had to look up getBoundingClientRect() as hadn't used it previous
// https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
// lines 37 - 40 can be uncommented to see what is returned when not deconstructed
const {width, height} = document
    .getElementById("svg")
    .getBoundingClientRect();

// const object = document
//     .getElementById("svg")
//     .getBoundingClientRect();
// console.log(object)

const draw = (dates) => {
    const years = d3.nest()
        .key(d => d.date.getUTCFullYear())
        .entries(dates)
        .reverse();

    console.log(years)

    const values = dates.map(c => c.value);
    const maxValue = d3.max(values);
    const minValue = d3.min(values);

    const cellSize = 15;
    const yearHeight = cellSize * 7;

    const group = svg.append("g");  

    const year = group
        .selectAll("g")
        .data(years)
        .join("g")
        .attr(
            "transform",
            (d, i) => `translate(50, ${yearHeight * i + cellSize * 1.5})`
        );

    year
        .append("text")
        .attr("x", -5)
        .attr("y", -30)
        .attr("text-anchor", "end")
        .attr("font-size", 16)
        .attr("font-weight", 550)
        .attr("transform", "rotate(270)")
            .text(d => d.key);

    const formatDay = d =>
        ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][d.getUTCDay()];
        
    const countDay = d => d.getUTCDay();
    const timeWeek = d3.utcSunday;
    const formatDate = d3.utcFormat("%x");
    const colorFn = d3
            .scaleSequential(d3.interpolateBuGn)
            .domain([Math.floor(minValue), Math.ceil(maxValue)]);
    const format = d3.format("+.2%");

    year
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

    year
        .append("g")
        .selectAll("rect")
            .data(d => d.values)
        .join("rect")
        .attr("width", cellSize - 1.5)
        .attr("height", cellSize - 1.5)
        .attr(
            "x",
            (d, i) => timeWeek.count(d3.utcYear(d.date), d.date) * cellSize + 10
        )
        .attr("y", d => countDay(d.date) * cellSize + 0.5)
        .attr("fill", d => colorFn(d.value))
        .append("title")
            .text(d => `${formatDate(d.date)}: ${d.value.toFixed(2)}`);

    const legend = group
        .append("g")
        .attr(
            "transform",
            `translate(10, ${years.length * yearHeight + cellSize * 4})`
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

