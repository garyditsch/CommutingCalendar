const draw = (dates, svg) => {
    // had to reduce the dates to get totals for each day
    // https://stackoverflow.com/questions/47893084/sum-the-values-for-the-same-dates
    // had some issues with the dates as objects, but changing to string and comparing worked
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString
    const reducedDates = dates.reduce(function (allDates, date) {
        if (allDates.some(function (e) {
            return e.date.toLocaleString('en-US') === date.date.toLocaleString('en-US')
        })) {
            allDates.filter(function (e) {
                return e.date.toLocaleString('en-US') === date.date.toLocaleString('en-US')
            })[0].value += +date.value
        } else {
            allDates.push({
                date: date.date,
                value: +date.value
            })
        }
        return allDates
    }, []);

    // return array with months grouped together. NOTE: nest is deprecated in future d3 versions
    const months = d3.nest()
        // .key(d => d.date.getUTCFullYear())
        .key(d => d.date.toLocaleString('default', { month: 'long' }))
        .entries(reducedDates)
        .reverse()

    // get array of all values
    const values = reducedDates.map(c => c.value);
    
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
            .text(d => { return d.key + '  ' + '[' + (d.values.reduce((prev, cur) => { return prev + parseFloat(cur.value)}, 0 )).toFixed(2) + ']' });

    // function to return week label
    const formatDay = d =>
        ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getUTCDay()];
    
    // return an index representing day of week: Ex: 0 = Sunday, 6 = Saturday
    const countDay = d => d.getUTCDay();

    // https://www.geeksforgeeks.org/d3-js-d3-utcsunday-function/
    // returns array of all the sundays from a start/end date
    const timeWeek = d3.utcSunday;
    const formatDate = d3.utcFormat("%x");


    // http://using-d3js.com/04_05_sequential_scales.html
    const colorFn = d3
            .scaleSequential(d3.interpolateBlues)
            // .scaleSequential(d3.interpolateCool)
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
}

export { draw };

