// https://www.d3indepth.com/scales/

const getMilestones = (data) => {
    const fiftyMiles = []
    let milestoneCount = 1
    let runTotal = 0

    for(i=0; i < data.length; i++){
        runTotal = runTotal + data[i].value
        if(runTotal === 50){
            milestoneCount = milestoneCount + 1
            fiftyMiles.push({'date': data[i], 'miles': runTotal})
        } else if ((runTotal >= 50 * milestoneCount) && (milestoneCount != 0)) {
            milestoneCount = milestoneCount + 1
            fiftyMiles.push({ 'date': data[i], 'miles': runTotal })
        }
    }
    return fiftyMiles;
}

const drawMilestones = (fiftyMiles) => {
    console.log(fiftyMiles)
    const margin = { 'left': 20, 'right': 20 }
    const milestoneWidth = 900 - margin.left - margin.right
    const monthWidth = milestoneWidth / 12
    const monthPadding = 5
    const timeline = d3.select('#milestone')

    const startDate = new Date('1/1/2021').getTime()
    const endDate = new Date('12/31/2021').getTime()

    const monthRange = d3.range(0, 12, 1)
    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    let x = d3.scaleLinear()
        .domain([startDate, endDate])
        .range([0, milestoneWidth])

    let monthX = d3.scaleLinear()
        .domain([0, 12])
        .range([0, milestoneWidth])

    timeline
        .append("g")
            .append("line")
            .attr('stroke', 'blue')
            .attr('stroke-width', '2')
            .attr('x1', x(startDate) + margin.left)
            .attr('x2', x(endDate) + margin.left)
            .attr('y1', 60)
            .attr('y2', 60)

    timeline
        .append("g")
        .selectAll('text')
        .data(fiftyMiles)
        .enter().append('text')
        .attr('x', (d, i) => x(new Date(d.date.date).getTime()) + margin.left)
        .attr('y', (d, i) => { if(i % 2 === 0){ return 15 } else { return 45 }})
        .attr('height', 45)
        .attr('width', 25)
        .text(d => d.miles.toFixed(0).toString())
        .style('fill', '#000')

    timeline
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

    timeline
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

    timeline
        .append("g")
        .selectAll('rect')
        .data(monthRange)
        .join("rect")
        .attr('x', (d) => monthX(d) + margin.left)
        .attr('width', monthWidth - monthPadding)
        .attr('height', 30)
        .attr('y', 85)
        .style('fill', "rgb(209, 227, 243)")


    timeline
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
}

const drawRunTheMilestoneChart = async () => {
    const data = await getRunData(running_csv)
    const parsedData = d3.csvParse(data);
    const orderedData = parsedData.sort((a, b) => new Date(a['Activity Date']) - new Date(b['Activity Date']));
    // console.log(orderedData)
    const dates = await runDateValues(orderedData)
    console.log(orderedData)
    const milestones = getMilestones(dates)
    console.log(milestones)
    drawMilestones(milestones);
}
drawRunTheMilestoneChart();