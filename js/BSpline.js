class BSpline {
    constructor(controlPoints, lines) {
        this.controlPoints = controlPoints;
        this.lines = lines;
        this.splineSegments = [];
        this.nodes = [];
    }

    drawBSpline(bSplineGroup, nodeGroup, bezierUIGroup, stroke = "#000000") {

        if (this.controlPoints.length < 3) {
            return null; // Not enough points to draw a B-spline
        }

        let firstEndPoint = Point.middlePoint(this.lines[0].thirdPoint_b, this.lines[1].thirdPoint_a);
        let firstSegment = new BezierSegment(
            this.controlPoints[0],
            this.controlPoints[0],
            this.lines[0].thirdPoint_b,
            firstEndPoint
        );
        this.splineSegments.push(firstSegment);

        let startPoint = Point.middlePoint(this.lines[0].thirdPoint_b, this.lines[1].thirdPoint_a);
        startPoint.drawPoint(nodeGroup, 4, "#606060");
        this.nodes.push(startPoint);

        for (let i = 1; i <= this.lines.length - 2; i++) {
            let c0 = this.lines[i].thirdPoint_a;
            let c1 = this.lines[i].thirdPoint_b;
            let endPoint = Point.middlePoint(this.lines[i].thirdPoint_b, this.lines[i + 1].thirdPoint_a);
            endPoint.drawPoint(nodeGroup, 4, "#606060");
            this.nodes.push(endPoint);


            let segment = new BezierSegment(startPoint, c0, c1, endPoint);
            this.splineSegments.push(segment);
            startPoint = endPoint;
        }

        let lastEndPoint = this.controlPoints[this.controlPoints.length - 1];
        let lastSegment = new BezierSegment(
            startPoint,
            this.lines[this.lines.length - 1].thirdPoint_a,
            lastEndPoint,
            lastEndPoint
        );
        this.splineSegments.push(lastSegment);

        // Draw all segments
        for (let i = 0; i < this.splineSegments.length; i++) {
            console.log("Drawing segment " + i);
            this.splineSegments[i].drawBezier(bSplineGroup, bezierUIGroup, stroke);
        }

        // draw nodes
        return this.splineSegments;
    }

    updateBSpline() {
        if (this.controlPoints.length == 0) {
            return;
        }

        let firstEndPoint = Point.middlePoint(this.lines[0].thirdPoint_b, this.lines[1].thirdPoint_a);
        this.splineSegments[0].updateBezier(
            this.controlPoints[0],
            this.controlPoints[0],
            this.lines[0].thirdPoint_b,
            firstEndPoint
        );

        let startPoint = Point.middlePoint(this.lines[0].thirdPoint_b, this.lines[1].thirdPoint_a);
        this.nodes[0].updatePosition(startPoint.x, startPoint.y);

        this.splineSegments.forEach((segment, i) => {
            if (i < 1) return; // skip first segment
            if (i == this.splineSegments.length - 1) {
                // last segment
                let lastEndPoint = this.controlPoints[this.controlPoints.length - 1];
                segment.updateBezier(
                    this.nodes[this.nodes.length - 1],
                    this.lines[this.lines.length - 1].thirdPoint_a,
                    lastEndPoint,
                    lastEndPoint
                );
                return;
            }

            let lineIndex = i;
            // Guard against array bounds if lines were removed
            if (lineIndex > this.lines.length - 2) return;

            let c0 = this.lines[lineIndex].thirdPoint_a;
            let c1 = this.lines[lineIndex].thirdPoint_b;
            let endPoint = Point.middlePoint(this.lines[lineIndex].thirdPoint_b, this.lines[lineIndex + 1].thirdPoint_a);
            this.nodes[lineIndex].updatePosition(endPoint.x, endPoint.y);
            segment.updateBezier(startPoint, c0, c1, endPoint);
            startPoint = endPoint;
        });
    }

    deleteSpline() {
        this.splineSegments.forEach(segment => {
            segment.deleteBezier();
        });
        this.splineSegments = [];

        this.nodes.forEach(node => {
            node.deletePoint();
        });
        this.nodes = [];
    }
}