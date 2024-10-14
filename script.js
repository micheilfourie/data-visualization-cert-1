document.addEventListener("DOMContentLoaded", () => {

    fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
        .then(response => response.json())
        .then(data => {
            const dataset = data.data; // [date,value]
            console.log(JSON.stringify(data, null, 2));

            document.getElementById("title").innerHTML = data.source_name;

            const width = 1100;
            const height = 500;
            const padding = 60;

            const xScale = d3.scaleLinear()
                .domain([0, dataset.length - 1])
                .range([padding, width - padding]);

            const yScale = d3.scaleLinear()
                .domain([0, d3.max(dataset, d => d[1])])
                .range([height - padding, padding]);

            const xAxis = d3.axisBottom(xScale)
                .tickFormat(d => dataset[d][0].substring(0, 4))

            const yAxis = d3.axisLeft(yScale)
                .tickFormat(d => `${d}`);

            d3.select("body").append("h1").text(data.source_name).style("margin", "50px");

            const svg = d3.select("body").append("svg")
                .attr("width", width)
                .attr("height", height + 30)

            svg.append("g")
                .attr("transform", `translate(0, ${height - padding})`)
                .attr("id", "x-axis")
                .call(xAxis)

            svg.append("g")
                .attr("transform", `translate(${padding}, 0)`)
                .attr("id", "y-axis")
                .call(yAxis);

            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", padding + 20)
                .attr("x", -height / 2)
                .attr("dy", "1em")
                .style("font-size", "20px")
                .style("text-anchor", "middle")
                .text("Gross Domestic Product (USD)");

            svg.append("text")
                .attr("y", height - 20)
                .attr("x", width / 2)
                .attr("dy", "1em")
                .style("font-size", "20px")
                .style("text-anchor", "middle")
                .text("Date (Years)");

            svg.selectAll("rect")
                .data(dataset)
                .enter()
                .append("rect")
                .classed("bar", true)
                .on("mouseover", onMouseOver)
                .on("mouseout", onMouseOut)
                .attr("data-date", d => d[0])
                .attr("data-gdp", d => d[1])
                .attr("x", (d, i) => xScale(i))
                .attr("y", d => yScale(d[1]))
                .attr("width", 3.5)
                .attr("height", d => height - yScale(d[1]) - padding)
                .attr("fill", "steelblue")

            const tooltip = d3.select("body")
                .append("div")
                .attr("id", "tooltip")


            function onMouseOver(event, d) {
                const date = d[0];
                const gdp = d[1];
                const x = event.clientX + 10;
                const y = event.clientY + 10;

                tooltip
                    .style("display", "block")
                    .style("left", `${x}px`)
                    .style("top", `${y}px`)
                    .html(`Date: ${date}<br/>GDP: $${gdp}`)
                    .attr("data-date", date)
                    .attr("data-gdp", gdp)
            }

            function onMouseOut(event, d) {
                tooltip
                    .style("display", "none")
            }

        })
});

