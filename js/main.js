const svg = d3.select("svg");

const line_group = svg.append("g").attr("class", "lines");
const bezier_ui_group = svg.append("g").attr("class", "bezierUI");
const node_group = svg.append("g").attr("class", "nodes");
const b_spline_group = svg.append("g").attr("class", "bSplines");
const point_group = svg.append("g").attr("class", "points");
const thirdPoint_group = svg.append("g").attr("class", "thirdPoints");


let points = [];
let lines = [];

let spline = null;

svg.on("dblclick", function (event) {
    if (spline) {
        spline.deleteSpline();
        spline = null;
    }

    const [x, y] = d3.pointer(event);
    const newIndex = points.length;
    // create and store the new point first so IDs match indexes
    const newPoint = new Point(x, y);
    points.push(newPoint);
    newPoint.drawPoint(point_group, 7, "steelblue", newIndex)
        .on("click", function (event) {
            // Manual double click detection to work around d3.drag conflict
            const now = Date.now();
            const last = this.lastClick || 0;
            this.lastClick = now;

            if (now - last < 300) {
                event.stopPropagation();
                console.log("Double clicked on point to remove it");

                const id = d3.select(this).attr("id");
                const index = parseInt(id.slice(1));

                // remove DOM circle and data point
                newPoint.deletePoint();
                points.splice(index, 1);

                // Reassign IDs to remaining points (DOM)
                for (let i = index; i < points.length; i++) {
                    points[i].updateId(i);
                }

                // Remove incident lines in the DOM that reference this id
                lines[index - 1]?.deleteLine();
                lines[index]?.deleteLine();

                // Remove incident lines from the lines array by comparing point objects
                lines.splice(Math.max(0, index - 1), Math.min(2, lines.length - Math.max(0, index - 1)));


                // draw new line between adjacent points if applicable
                if (index > 0 && index < points.length) {
                    let newLine = new ThirdPointLine(points[index - 1], points[index]);
                    newLine.drawLine(line_group, thirdPoint_group, "#00000050", newPoint.id, `p${index - 1}`, `p${index}`);
                    lines.splice(index - 1, 0, newLine);
                }

                // Reassign IDs to remaining lines (DOM)
                for (let i = 0; i < lines.length; i++) {
                    lines[i].id = i;
                }

                if (spline) {
                    spline.deleteSpline();
                    spline = new BSpline(points, lines);
                    spline.drawBSpline(b_spline_group, node_group, bezier_ui_group, "black");
                }
            }
        })
        .call(d3.drag()
            .on("start", function () {
                d3.select(this).attr("r", 10); // Change color on drag start
            })
            .on("drag", function (event) {
                console.log("Dragging point " + newPoint.id);
                d3.select(this)
                    .attr("cx", event.x)
                    .attr("cy", event.y);
                // Update the underlying data model
                newPoint.x = event.x;
                newPoint.y = event.y;

                // Update connected lines
                lines[newPoint.id - 1]?.updateLine(lines[newPoint.id - 1].startPoint, newPoint);
                lines[newPoint.id]?.updateLine(newPoint, lines[newPoint.id].endPoint);
                if (spline) {
                    spline.updateBSpline();
                }
            })
            .on("end", function () {
                d3.select(this).attr("r", 7);
            })
        );

    if (newIndex > 0) {
        // draw line between last point and new point
        const lastPoint = points[newIndex - 1];
        let line = new ThirdPointLine(lastPoint, newPoint);
        line.drawLine(line_group, thirdPoint_group, "#00000050", lines.length, `p${newIndex - 1}`, `p${newIndex}`);

        lines.push(line);
    }

    spline = new BSpline(points, lines);
    spline.drawBSpline(b_spline_group, node_group, bezier_ui_group, "black");
});