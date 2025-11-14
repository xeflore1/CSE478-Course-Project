
var dataset = undefined;

d3.csv("dataset.csv").then(data => {
    // Keep access
    dataset = data;
    console.log(data[0]);

    // Get numeric columns only
    const columns = data.columns.filter(col => !isNaN(+data[0][col]));

    populate3DSPCombos("xSelect", columns);
    populate3DSPCombos("ySelect", columns);
    populate3DSPCombos("zSelect", columns);

    // Default selections
    document.getElementById("xSelect").selectedIndex = 0;
    document.getElementById("ySelect").selectedIndex = 1;
    document.getElementById("zSelect").selectedIndex = 2;

    // Initial plot
    updatePlot();

    // Update plot when any selector changes
    ["xSelect", "ySelect", "zSelect"].forEach(id => {
        document.getElementById(id).addEventListener("change", updatePlot);
    });
});

// Add options to the combo menu
function populate3DSPCombos(id, options) {
    const sel = document.getElementById(id);
    options.forEach(opt => {
        const el = document.createElement("option");
        el.value = opt;
        el.text = opt;
        sel.appendChild(el);
    });
}

// Alright lets get down and dirty and plot this data up
function updatePlot() {
    const xKey = document.getElementById("xSelect").value;
    const yKey = document.getElementById("ySelect").value;
    const zKey = document.getElementById("zSelect").value;

    const trace = {
      type: "scatter3d",
      mode: "markers",
      x: dataset.map(d => +d[xKey]),
      y: dataset.map(d => +d[yKey]),
      z: dataset.map(d => +d[zKey]),

      marker: {
        size: 4,
        color: dataset.map(d => d.cpu_brand === "AMD" ? "red" : "blue"),
        colorscale: "Viridis",
        opacity: 0.85
      }
    };

    const layout = {
      scene: {
        xaxis: { title: xKey },
        yaxis: { title: yKey },
        zaxis: { title: zKey }
      },
      margin: { l: 0, r: 0, t: 0, b: 0 }
    };

    Plotly.newPlot("scatter-plot", [trace], layout);
}
