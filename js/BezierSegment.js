class BezierSegment {
    constructor(p0, c0, c1, p1) {
        this.p0 = p0;
        this.c0 = c0;
        this.c1 = c1;
        this.p1 = p1;
        this.pathObj = null;
        this.c0Obj = null;
        this.c0LineObj = null;
        this.c1Obj = null;
        this.c1LineObj = null;
    }

    drawBezier(svgGroup, UIGroup, stroke = "#000000") {
        const bezierPath = `M ${this.p0.x} ${this.p0.y} C ${this.c0.x} ${this.c0.y}, ${this.c1.x} ${this.c1.y}, ${this.p1.x} ${this.p1.y}`;
        const path = svgGroup.append("path")
            .attr("d", bezierPath)
            .attr("stroke", stroke)
            .attr("fill", "none");
        this.pathObj = path;

        this.c0Obj = new Point(this.c0.x, this.c0.y);
        this.c0Obj.drawPoint(UIGroup, 3, "darkgray");

        this.c0LineObj = new Line(this.p0, this.c0, true);
        this.c0LineObj.drawLine(UIGroup, "darkgray");

        this.c1Obj = new Point(this.c1.x, this.c1.y);
        this.c1Obj.drawPoint(UIGroup, 3, "darkgray");

        this.c1LineObj = new Line(this.c1, this.p1, true);
        this.c1LineObj.drawLine(UIGroup, "darkgray");

        return path;
    }

    updateBezier(p0, c0, c1, p1) {
        this.p0 = p0;
        this.c0 = c0;
        this.c1 = c1;
        this.p1 = p1;
        if (this.pathObj) {
            const bezierPath = `M ${this.p0.x} ${this.p0.y} C ${this.c0.x} ${this.c0.y}, ${this.c1.x} ${this.c1.y}, ${this.p1.x} ${this.p1.y}`;
            this.pathObj.attr("d", bezierPath);
        }

        if (this.c0Obj) {
            this.c0Obj.updatePosition(this.c0.x, this.c0.y);
        }

        if (this.c0LineObj) {
            this.c0LineObj.updateLine(this.p0, this.c0);
        }

        if (this.c1Obj) {
            this.c1Obj.updatePosition(this.c1.x, this.c1.y);
        }

        if (this.c1LineObj) {
            this.c1LineObj.updateLine(this.c1, this.p1);
        }
    }

    deleteBezier() {
        if (this.pathObj) {
            this.pathObj.remove();
            this.pathObj = null;
        }

        if (this.c0Obj) {
            this.c0Obj.deletePoint();
            this.c0Obj = null;
        }

        if (this.c0LineObj) {
            this.c0LineObj.deleteLine();
            this.c0LineObj = null;
        }

        if (this.c1Obj) {
            this.c1Obj.deletePoint();
            this.c1Obj = null;
        }

        if (this.c1LineObj) {
            this.c1LineObj.deleteLine();
            this.c1LineObj = null;
        }
    }
}