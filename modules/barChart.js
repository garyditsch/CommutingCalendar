// https://stackoverflow.com/questions/45211408/making-a-grouped-bar-chart-using-d3-js
// https://observablehq.com/@d3/gallery

const draw = (dates, svg, width, height, number) => {

    //  the size of the overall svg element
    const margin = { top: 10, right: 20, bottom: 35, left: 0 };
    const widthBar = width - margin.left - margin.right;
    const heightBar = height - margin.top - margin.bottom;

    const topRunList = dates.sort((a,b) => { return b.value - a.value }).slice(0,number)
    
    const formatDate = d3.utcFormat("%x");

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(topRunList, d => d.value)])
        .range([0, widthBar])

    const yScale = d3.scaleBand()
        .domain(topRunList.map(d => d.date))
        .range([0, heightBar])
        .padding(0.05)

    svg
        .attr('width', widthBar + margin.left + margin.right)
        .attr('height', heightBar + margin.top + margin.bottom)
        .style('background', '#fff')
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // svg
    //     .append('text')
    //     .attr('width', 200)
    //     .attr('height', 50)
    //     .text(`HELLO`)
    //     .style('fill', "#000")

    svg
        .append('g')
        .selectAll('rect')
        .data(topRunList)
        .enter().append('rect')
        .style('fill', 'rgb(83, 157, 204)')
        .style('stroke', '#000')
        .style('stroke-width', '0')
        .attr('height', yScale.bandwidth)
        .attr('width', (topRunList) => xScale(topRunList.value))
        .attr('y', topRunList => yScale(topRunList.date))
        .attr('x', 0 + margin.left)
        

    svg
        .append('g')
        .selectAll('text')
        .data(topRunList)
        .enter().append('text')
        .attr('height', yScale.bandwidth)
        .attr('width', (topRunList) => xScale(topRunList.value))
        .attr('y', topRunList => yScale(topRunList.date) + margin.top + 10)
        .attr('x', 0 + margin.left + 10)
        .text(d => `${formatDate(d.date)}` + `, ` +  `${d.value.toFixed(2)} miles`)
        .style('fill', "#fff") 
}

export { draw }