class Line {
    constructor(p0, p1, dashed = false) {
        this.p0 = p0;
        this.p1 = p1;
        this.lineObj = null;
        this.dashed = dashed;
    }

    drawLine(lineGroup, stroke = "#000000", id = -1) {
        const line = lineGroup.append("line")
            .attr("x1", this.p0.x)
            .attr("y1", this.p0.y)
            .attr("x2", this.p1.x)
            .attr("y2", this.p1.y)
            .attr("stroke", stroke);
        if (this.dashed) {
            line.attr("stroke-dasharray", "5,5");
        }
        if (id != -1) {
            line.attr("id", `l${id}`);
        }
        this.lineObj = line;
        return line;
    }

    updateLine(p0, p1) {
        this.p0 = p0;
        this.p1 = p1;
        if (this.lineObj) {
            this.lineObj
                .attr("x1", this.p0.x)
                .attr("y1", this.p0.y)
                .attr("x2", this.p1.x)
                .attr("y2", this.p1.y);
        }
    }

    deleteLine() {
        if (this.lineObj) {
            this.lineObj.remove();
            this.lineObj = null;
        }
    }
}