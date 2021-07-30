// https://www.d3indepth.com/scales/

const draw = (fiftyMiles, svg, startDate, endDate) => {
    const margin = { 'left': 20, 'right': 20 }
    const milestoneWidth = 900 - margin.left - margin.right
    const monthWidth = milestoneWidth / 12
    const monthPadding = 5

    const monthRange = d3.range(0, 12, 1)
    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    let x = d3.scaleLinear()
        .domain([startDate, endDate])
        .range([0, milestoneWidth])

    let monthX = d3.scaleLinear()
        .domain([0, 12])
        .range([0, milestoneWidth])

    svg
        .append("g")
            .append("line")
            .attr('stroke', 'blue')
            .attr('stroke-width', '2')
            .attr('x1', x(startDate) + margin.left)
            .attr('x2', x(endDate) + margin.left)
            .attr('y1', 60)
            .attr('y2', 60)

    svg
        .append("g")
        .selectAll('text')
        .data(fiftyMiles)
        .enter().append('text')
        .attr('x', (d, i) => x(new Date(d.date.date).getTime()) + margin.left)
        .attr('y', (d, i) => { if(i % 2 === 0){ return 15 } else { return 45 }})
        .attr('height', 45)
        .attr('width', 25)
        .text((d, i) => i + 1)
        .style('fill', '#000')

    svg
        .append("g")
        .selectAll('line')
        .data(fiftyMiles)
        .enter().append('line')
        .attr('x1', (d, i) => x(new Date(d.date.date).getTime()) + margin.left)
        .attr('x2', (d, i) => x(new Date(d.date.date).getTime()) + margin.left)
        .attr('y1', (d, i) => { if (i % 2 === 0) { return 18 } else { return 48 } })
        .attr('y2', 60)
        .attr('stroke', 'blue')
        .attr('stroke-width', '2')

    svg
        .append("g")
        .selectAll("circle")
        .data(fiftyMiles)
        .enter()
        .append("circle")
        .attr('width', 5)
        .attr('height', 20)
        .attr('cx', (d,i) => x(new Date(d.date.date).getTime()) + margin.left)
        .attr('cy', 60)
        .attr('r', 10)
        .style('opacity', 0.4)
        .style('visibility', 'visible')

    svg
        .append("g")
        .selectAll('rect')
        .data(monthRange)
        .join("rect")
        .attr('x', (d) => monthX(d) + margin.left)
        .attr('width', monthWidth - monthPadding)
        .attr('height', 30)
        .attr('y', 85)
        .style('fill', "rgb(209, 227, 243)")


    svg
        .append("g")
        .selectAll('text')
        .data(monthRange)
        .enter().append('text')
        .attr('x', (d) => monthX(d) + margin.left + 10)
        .attr('y', 100)
        .attr('height', 20)
        .attr('width', 25)
        .text(d => monthLabels[d])
        .style('fill', '#000')

    svg
        .append("g")
        .selectAll("rect")
        .data(fiftyMiles)
        .enter().append('rect')
        .attr('x', 0 + margin.left)
        .attr('y', (d, i) => (40 * i) + 125)
        .attr('height', 30)
        .attr('width', milestoneWidth)
        .style('fill', "rgb(241, 247, 253)")

    svg
        .append("g")
        .selectAll('text')
        .data(fiftyMiles)
        .enter().append('text')
        .attr('x', 5 + margin.left)
        .attr('y', (d, i) => (40 * i) + 145)
        .attr('height', 45)
        .attr('width', milestoneWidth)
        .text((d, i) => `${i+1} //  Date: ${d.date.date.toLocaleDateString(
            'en-US',
            {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }
        )}  // Total Miles: ${d.miles.toFixed(0)}`)
        .style('fill', '#000')
}

export { draw }