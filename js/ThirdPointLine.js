class ThirdPointLine {
    constructor(startPoint, endPoint) {
        this.startPoint = startPoint;
        this.endPoint = endPoint;
        this.lineObj = null;
        this.thirdPoint_a = null;
        this.thirdPoint_b = null;
        this.id = -1;
    }

    drawLine(lineGroup, thirdPoint_group, stroke = "#00000050", id = -1) {
        const line = lineGroup.append("line")
            .attr("x1", this.startPoint.x)
            .attr("y1", this.startPoint.y)
            .attr("x2", this.endPoint.x)
            .attr("y2", this.endPoint.y)
            .attr("stroke-width", 2)
            .attr("stroke", stroke);
        if (id != -1) {
            line.attr("id", `l${id}`);
        }
        this.lineObj = line;

        // draw third points
        this.thirdPoint_a = new Point(
            (2 * this.startPoint.x + this.endPoint.x) / 3,
            (2 * this.startPoint.y + this.endPoint.y) / 3
        );
        this.thirdPoint_b = new Point(
            (this.startPoint.x + 2 * this.endPoint.x) / 3,
            (this.startPoint.y + 2 * this.endPoint.y) / 3
        );

        this.thirdPoint_a.drawPoint(thirdPoint_group, 3, "darkgray");
        this.thirdPoint_b.drawPoint(thirdPoint_group, 3, "darkgray");

        return line;
    }

    updateLine(startPoint, endPoint) {
        this.startPoint = startPoint;
        this.endPoint = endPoint;
        if (this.lineObj) {
            this.lineObj
                .attr("x1", this.startPoint.x)
                .attr("y1", this.startPoint.y)
                .attr("x2", this.endPoint.x)
                .attr("y2", this.endPoint.y);
        }

        // Update third points
        if (this.thirdPoint_a) {
            this.thirdPoint_a.x = (2 * this.startPoint.x + this.endPoint.x) / 3;
            this.thirdPoint_a.y = (2 * this.startPoint.y + this.endPoint.y) / 3;

            this.thirdPoint_a.updatePosition(this.thirdPoint_a.x, this.thirdPoint_a.y);
        }
        if (this.thirdPoint_b) {
            this.thirdPoint_b.x = (this.startPoint.x + 2 * this.endPoint.x) / 3;
            this.thirdPoint_b.y = (this.startPoint.y + 2 * this.endPoint.y) / 3;
            this.thirdPoint_b.updatePosition(this.thirdPoint_b.x, this.thirdPoint_b.y);
        }
    }

    deleteLine() {
        if (this.lineObj) {
            this.lineObj.remove();
            this.lineObj = null;
        }
        if (this.thirdPoint_a) {
            this.thirdPoint_a.deletePoint();
            this.thirdPoint_a = null;
        }
        if (this.thirdPoint_b) {
            this.thirdPoint_b.deletePoint();
            this.thirdPoint_b = null;
        }
    }
}