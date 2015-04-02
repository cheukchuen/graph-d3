var width = window.innerWidth - 10,
        height = window.innerHeight - 20;

// force layout setup
var force = d3.layout.force()
        .charge(-1500)
        .linkDistance(200)
        .size([width, height]);

// setup svg div
var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("pointer-events", "all");

var nodes={}, links={};

// load graph (vertices, edges) from json
d3.json("data/graph-of-the-gods.json", function(error, graph) {
    if (error) return;

    // assign vertices to nodes array
    graph.vertices.forEach(function(vertex) {
        nodes[vertex._id] = {name: vertex.name};
    });
    
    // assign edges to links array
    graph.edges.forEach(function(edge) {
        links[edge._id] = {source: nodes[edge._outV], target: nodes[edge._inV], label: edge._label};
    });

    // init force layout
    force.nodes(d3.values(nodes))
            .links(d3.values(links))
            .on("tick", tick)
            .start();

    // define arrow markers for graph links
    svg.append("defs").append("marker")
            .attr("id", "arrow-head")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 35)
            .attr("refY", 0)
            .attr("markerWidth", 8)
            .attr("markerHeight", 8)
            .attr("orient", "auto")
            .append("path")
            .attr("fill", "#666")
            .attr("stroke", "#666")
            .attr("stroke-width", "1px")
            .attr("d", "M0,-5L10,0L0,5Z");

    d3.select("defs").append("marker")
            .attr("id", "hollow-head")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 35)
            .attr("refY", 0)
            .attr("markerWidth", 8)
            .attr("markerHeight", 8)
            .attr("orient", "auto")
            .append("path")
            .attr("fill", "#fff")
            .attr("stroke", "#666")
            .attr("stroke-width", "1px")
            .attr("d", "M0,-5L10,0L0,5Z");

    d3.select("defs").append("marker")
            .attr("id", "tail-crossed")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", -35)
            .attr("refY", 0)
            .attr("markerWidth", 8)
            .attr("markerHeight", 8)
            .attr("orient", "auto")
            .append("path")
            .attr("class", "link")
            .attr("d", "M0,-5L0,5");

    // line displayed for links
    var path = svg.append("g").selectAll("path")
            .data(force.links())
            .enter().append("path")
            .attr("class", function(d) { return "link " + d.label; })
            .attr("marker-start", function(d) { return d.label === "lives" ? "url(#tail-crossed)" : "none"; })
            .attr("marker-end", function(d) { return d.label === "mother" || d.label === "father" ? "url(#hollow-head)" : "url(#arrow-head)"; });

    // label displayed for links
    var label = svg.append("g").selectAll("text")
            .data(force.links())
            .enter().append("text")
            .attr("class", "link-label")
            .attr("x", 0)
            .attr("y", ".31em")
            .text(function(d) { return d.label; });

    // circle displayed for nodes
    var circle = svg.append("g").selectAll("circle")
            .data(force.nodes())
            .enter().append("circle")
            .attr("r", 30)
            .call(force.drag);

    // name displayed for nodes
    var text = svg.append("g").selectAll("text")
            .data(force.nodes())
            .enter().append("text")
            .attr("class", "node-label")
            .attr("x", 0)
            .attr("y", ".31em")
            .text(function(d) { return d.name; });

    // attach transformation attributes to nodes and links
    function tick() {
        path.attr("d", linkArrow);
        label.attr("transform", linkLabel);
        circle.attr("transform", transform);
        text.attr("transform", transform);
    }

    function linkArrow(d) {
        return "M" + d.source.x + "," + d.source.y + "L" + d.target.x + "," + d.target.y;
    }

    function linkLabel(d) {
        var x = (d.source.x + d.target.x) / 2,
                y = (d.source.y + d.target.y) / 2;
        var dx = d.target.x - x,
                dy = d.target.y - y;
        var theta = Math.atan2(dy, dx);
        theta *= 180.0 / Math.PI;

        return "rotate(" + theta + "," + x + "," + y + ")translate(" + x + "," + (y - 8) + ")";
    }

    function transform(d) {
        return "translate(" + d.x + "," + d.y + ")";
    }
});
