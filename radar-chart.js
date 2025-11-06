// Note: 3 attributes: cpu cores, cpu_base_ghz, price
// Two charts: Intel and AMD
// Customer Form factors: Mainstream Gaming Ultrabook 2-in-1 Workstation

d3.select("#radar_svg").selectAll("*").remove();

// var margin = {top: 10, right: 10, bottom: 10, left: 10},
let width = 500;
let height = 500;

const color = d3.scaleOrdinal(d3.schemeCategory10);

// append the svg object to the body of the page
var master_svg = d3.select("#radar_svg")
    .append("svg")
    .attr("id", "render_svg")
    .attr("width", width*2 + 250)
    .attr("height", height)


document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll("button");
  buttons.forEach((btn, i) => {
    btn.style.borderColor = color(i);
    btn.style.opacity = 0.75
    
    btn.addEventListener("mouseover", () => {
       btn.style.background = color(i);
    });

    btn.addEventListener("mouseout", () => {
       btn.style.background = "#ffffffff";
    });
  });
});

function RadarChartRender(centerX, centerY, title){
    let data = [];
    let features = ["CPU Cores", "CPU Base GHz", "Price"];
    let perf_attributes = ["Mainstream", "Gaming", "Ultrabook", "2 in 1", "Workstation"]

    const svg = master_svg.append("g").attr("class", "radar-chart");

    //generate the data
    for (var i = 0; i < perf_attributes.length; i++){
        var point = {}
        //each feature will be a random number from 1-9
        features.forEach(f => point[f] = 1 + Math.random() * 8);
        data.push(point);
    }

    const maxRadius = Math.min(centerX, centerY) - 40;

    const radialScale = d3.scaleLinear().domain([0, 10]).range([0, maxRadius]);
    let ticks = [2, 4, 6, 8, 10];

    // // Draw circle border
    // svg.selectAll("circle")
    //     .data(ticks)
    //     .join(
    //         enter => enter.append("circle")
    //             .attr("cx", centerX)
    //             .attr("cy", centerY)
    //             .attr("fill", "none")
    //             .attr("stroke", "gray")
    //             .attr("r", d => radialScale(d))
    //     )

    // // Draw tick numbers
    // svg.selectAll(".ticklabel")
    //     .data(ticks)
    //     .join(
    //         enter => enter.append("text")
    //             .attr("class", "ticklabel")
    //             .attr("x", width / 2 + 5)
    //             .attr("y", d => height / 2 - radialScale(d))
    //             .text(d => d.toString())
    //     )

    function angleToCoordinate(angle, value){
        let x = Math.cos(angle) * radialScale(value);
        let y = Math.sin(angle) * radialScale(value);
        return {"x": centerX + x, "y": centerY - y};
    }

    let featureData = features.map((f, i) => {
        let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
        return {
            "name": f,
            "angle": angle,
            "line_coord": angleToCoordinate(angle, 10),
            "label_coord": angleToCoordinate(angle, 11)
        }
    });

    // Draw axis fine
    svg.selectAll("line")
        .data(featureData)
        .join(
            enter => enter.append("line")
                .attr("x1", centerX)
                .attr("y1", centerY)
                .attr("x2", d => d.line_coord.x)
                .attr("y2", d => d.line_coord.y)
                .attr("stroke", "black")
        )

    // Draw axis label
    svg.selectAll(".axislabel")
        .data(featureData)
        .join(
            enter => enter.append("text")
                .attr("x", d => d.label_coord.x - 32)
                .attr("y", d => d.label_coord.y + 10)
                .text(d => d.name)
        )

    let line = d3.line()
        .x(d => d.x)
        .y(d => d.y);

    // Get x,y,z coordinates for each attr
    function getPathCoordinates(data_point){
        let coordinates = [];
        for (var i = 0; i < features.length; i++){
            let ft_name = features[i];
            let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
            coordinates.push(angleToCoordinate(angle, data_point[ft_name]))
        }
        return coordinates;
    }
    console.log(data)

    // Draw the path element
    svg.selectAll("path")
        .data(data)
        .join(
            enter => enter.append("path")
                .datum(d => getPathCoordinates(d))
                .attr("d", line)
                .attr("stroke-width", 3)
                .attr("stroke", (_, i) => color(i))
                .attr("fill", (_, i) => color(i))
                .attr("stroke-opacity", 1)
                .attr("opacity", 0.25)
        )
        .on("mouseover", function (d, i) {
            d3.select(this).transition()
                .attr("opacity", 0.5)
            console.log(i)
        })
        .on("mouseout", function (d, i) {
            d3.select(this).transition()
                .attr("opacity", 0.25)
        });
    
    // Add chart title
    svg.append("text")
        .attr("x", centerX)
        .attr("y", centerY + maxRadius - 30)
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .text(title);
}



RadarChartRender(50 + width/2, height/2, "Intel")
RadarChartRender(width/2 + width + 250, height/2, "AMD")

