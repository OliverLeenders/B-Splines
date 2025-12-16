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

        // 1. Update the first node (Node 0)
        let firstNodePos = Point.middlePoint(this.lines[0].thirdPoint_b, this.lines[1].thirdPoint_a);
        this.nodes[0].updatePosition(firstNodePos.x, firstNodePos.y);

        // 2. Update the first segment (ends at Node 0)
        this.splineSegments[0].updateBezier(
            this.controlPoints[0],
            this.controlPoints[0],
            this.lines[0].thirdPoint_b,
            this.nodes[0] // Use persistent node object
        );

        // 3. Loop through remaining segments
        this.splineSegments.forEach((segment, i) => {
            if (i < 1) return; // skip first segment

            // Handle Last Segment
            if (i == this.splineSegments.length - 1) {
                let lastEndPoint = this.controlPoints[this.controlPoints.length - 1];
                // Starts at the last node
                segment.updateBezier(
                    this.nodes[this.nodes.length - 1],
                    this.lines[this.lines.length - 1].thirdPoint_a,
                    lastEndPoint,
                    lastEndPoint
                );
                return;
            }

            // Handle Middle Segments
            let lineIndex = i;
            // Guard against array bounds
            if (lineIndex > this.lines.length - 2) return;

            let c0 = this.lines[lineIndex].thirdPoint_a;
            let c1 = this.lines[lineIndex].thirdPoint_b;
            
            // Calculate new position for Node i
            let nodePos = Point.middlePoint(this.lines[lineIndex].thirdPoint_b, this.lines[lineIndex + 1].thirdPoint_a);
            this.nodes[lineIndex].updatePosition(nodePos.x, nodePos.y);

            // Update segment using persistent node objects
            // Start: Node i-1, End: Node i
            segment.updateBezier(this.nodes[lineIndex - 1], c0, c1, this.nodes[lineIndex]);
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