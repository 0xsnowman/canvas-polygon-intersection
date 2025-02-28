class DraggablePolygon {
  constructor(
    cameraID,
    cameraName,
    type,
    scale,
    center,
    canvas,
    points,
    clearCanvasCallback, // call camera-vision's _drawSketch
    updateOuterPolygon // update camera-vision's outer_polygon
  ) {
    this.cameraID = cameraID;
    this.cameraName = cameraName;
    this.type = type;
    this.scale = scale; // radius of camera vision
    this.center = center;
    this.canvas = canvas;
    this.clearCanvasCallback = clearCanvasCallback;
    this.updateOuterPolygon = updateOuterPolygon;
    this.ctx = canvas.getContext("2d");
    this.points = [];
    points.forEach((point) => {
      this.points.push(new Point(point.x, point.y, true))
    });
    this.draggingPointIndex = null;
    this.originalPoints = null;

    // Mouse event listeners
    this.canvas.addEventListener("mousedown", (e) => this.onMouseDown(e));
    this.canvas.addEventListener("mousemove", (e) => this.onMouseMove(e));
    this.canvas.addEventListener("mouseup", (e) => this.onMouseUp(e));

    this.draw(); // Initial draw
  }

  changeCameraNameInPolygon(cameraName) {
    this.cameraName = cameraName;

    this.drawPointsAndLines();
  }

  drawCameraName() {
    // Set font properties
    this.ctx.font = "20px Arial";
    this.ctx.fillStyle = "blue"; // Text color
    this.ctx.textAlign = "center"; // Align text
    this.ctx.textBaseline = "middle"; // Align baseline

    // Draw text
    // this.ctx.fillText(this.cameraName, this.center.x, this.center.y - 30);

    // Optionally, draw an outlined text
    this.ctx.strokeStyle = "blue"; // Outline color
    this.ctx.lineWidth = 2; // Outline width
    this.ctx.strokeText(this.cameraName, this.center.x, this.center.y - 30);
  }

  updatePoints(points) {
    this.points = [];
    points.forEach((point) => {
      this.points.push(new Point(point.x, point.y, point.isReal));
    });
  }

  draw() {
    if (this.clearCanvasCallback) {
      this.clearCanvasCallback();
    }
  }

  drawPointsAndLines() {
    // Draw polygon
    this.ctx.beginPath();
    this.ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      if (this.points[i].isReal) {
        this.ctx.lineTo(this.points[i].x, this.points[i].y);
      }
    }
    this.ctx.closePath();
    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    this.ctx.fillStyle = "rgba(0, 0, 255, 0.2)";
    this.ctx.fill();

    // Draw draggable points
    this.points.forEach((point, index) => {
      point.draw(this.ctx, index);
    });

    this.drawCameraName();
  }

  onMouseDown(event) {
    const { x, y } = this.getMousePosition(event);
    const dragPointIndex = this.points.findIndex((point) =>
      this.isPointClicked(point, x, y)
    );

    if (is_index_valid(dragPointIndex)) {
      this.draggingPointIndex = dragPointIndex;

      // Keep the original point at camera position in Zoom
      if (
        (this.type == "zoom-2mp" ||
          this.type == "zoom-4mp" ||
          this.type == "zoom-8mp") &&
        this.draggingPointIndex == 0
      ) {
        this.draggingPointIndex = null;
        return;
      }

      if (this.points[this.draggingPointIndex].isReal == false) {
        this.points[this.draggingPointIndex].isReal = true;
      }
      
      this.originalPoints = [];
      this.points.forEach((point) => this.originalPoints.push(new Point(point.x, point.y, point.isReal)));
      this.canvas.style.cursor = "grabbing";
    }
  }

  onMouseMove(event) {
    const { x, y } = this.getMousePosition(event);
    
    if (is_index_valid(this.draggingPointIndex)) {
      console.log("this.draggingPointIndex: ", this.draggingPointIndex);
      // Move the point
      // this.points[this.draggingPointIndex].x = x;
      // this.points[this.draggingPointIndex].y = y;

      // const draggingPointIndex = this.getDraggingPointIndex();
      this.points[this.draggingPointIndex].x = x;
      this.points[this.draggingPointIndex].y = y;
      // this.points[this.draggingPointIndex].isReal = true;
      console.log("isReal of draggingPoint: ", this.points[this.draggingPointIndex].isReal);
    } else {
      // Change cursor when hovering over points
      const hovering = this.points.some((point) =>
        this.isPointClicked(point, x, y)
      );

      const hoveringIndex = this.points.findIndex((point) =>
        this.isPointClicked(point, x, y)
      );
      if (this.type == "zoom" && hoveringIndex == 0) return;

      this.canvas.style.cursor = hovering ? "grab" : "default";
    }
  }

  onMouseUp() {
    if (is_index_valid(this.draggingPointIndex)) {
      const angle = globalCameras.find((cam) => cam.cameraID == this.cameraID).m_angle;
      const out_radius = visionRanges(this.type, angle)[2] * this.scale;

      if (distance(this.points[this.draggingPointIndex], this.center) > out_radius) {
        this.draggingPointIndex = null;
        this.points = [];
        this.originalPoints.forEach(point => this.points.push(new Point(point.x, point.y, point.isReal)));
        this.canvas.style.cursor = "default";
        this.updateOuterPolygon(this.points);
        this.drawPointsAndLines();
        return;
      }
      if (
        this.type == "zoom-2mp" ||
        this.type == "zoom-4mp" ||
        this.type == "zoom-8mp"
      ) {
        // const draggingPointIndex = this.getDraggingPointIndex();

        // Keep the 1st and Last point of vision arc on the 'yellow' line
        if (this.draggingPointIndex == 1 || this.draggingPointIndex == this.points.length - 1) {
          const restrictedPoint = this.restrictToRadius(
            this.center.x,
            this.center.y,
            this.points[this.draggingPointIndex].x,
            this.points[this.draggingPointIndex].y,
            out_radius,
            this.draggingPointIndex == 1 ? true : false
          );
          this.points[this.draggingPointIndex].x = restrictedPoint.x;
          this.points[this.draggingPointIndex].y = restrictedPoint.y;
          this.points[this.draggingPointIndex].isReal = true;

          this.draggingPointIndex = null;
          this.canvas.style.cursor = "default";

          this.updateOuterPolygon(this.points);
          this.drawPointsAndLines();
          return;
        }
      }
    }

    const arrivedPoint = this.points[this.draggingPointIndex];

    if (!is_index_valid(this.draggingPointIndex)) return;

    const intersectArea = this.intersectAreaNotVisibleExist(
      // (this.draggingPointIndex + 1) % this.points.length
    );

    if (intersectArea.edge.length > 0) {
      console.log("intersectArea: ", intersectArea);
      const firstCutoutIndex = this.draggingPointIndex;
      const secondCutoutIndex = intersectArea.index;

      console.log("this.points: ", this.points);

      console.log("draggingPointIndex: ", this.draggingPointIndex);
      console.log("firstCutoutIndex: ", firstCutoutIndex);
      console.log("secondCutoutIndex: ", secondCutoutIndex);

      var directionDueToCamType = this.type.substr(0, 1) == "f" ? true : false;
      var tempPoints = [];

      if (directionDueToCamType) {
        // Fisheye case
        tempPoints = this.optimizedCircularCut(
          this.points,
          firstCutoutIndex,
          secondCutoutIndex,
          intersectArea.edge[0],
        );
      } else {
        // Zoom case
        tempPoints = this.circularCutRestAndAddIntersect(
          this.points,
          firstCutoutIndex,
          secondCutoutIndex,
          intersectArea.edge[0],
        );
      }

      this.updatePoints(tempPoints);
      console.log(this.points);
    }

    this.points = this.addPointsAroundDraggingPoint(arrivedPoint);

    this.draggingPointIndex = null;
    this.canvas.style.cursor = "default";

    this.updateOuterPolygon(this.points);
    this.drawPointsAndLines();
  }

  restrictToRadius(centerX, centerY, mouseX, mouseY, radius, upOrDown) {
    const angle = toRadians(globalCameras.find((cam) => cam.cameraID == this.cameraID).m_angle);

    const Rx = radius * Math.cos(angle);
    const Ry = radius * Math.sin(angle);

    const x = mouseX - centerX;
    let y = centerY;

    if (upOrDown) {
      y = y - (x * Ry) / Rx;
    } else {
      y = y + (x * Ry) / Rx;
    }

    return { x: mouseX, y: y };
  }

  removeCircularSegment(startIdx, endIdx) {
    if (startIdx <= endIdx) {
      return this.points
        .slice(0, startIdx)
        .concat(this.points.slice(endIdx + 1));
    } else {
      return this.points.slice(endIdx + 1, startIdx);
    }
  }

  optimizedCircularCut(arr, firstCutOutIndex, secondCutOutIndex, newPoint) {
    if (!Array.isArray(arr) || arr.length === 0) {
      throw new Error('Invalid array');
    }
  
    const n = arr.length;
    if (firstCutOutIndex < 0 || secondCutOutIndex < 0 || 
        firstCutOutIndex >= n || secondCutOutIndex >= n) {
      throw new Error('Invalid indices');
    }
  
    if (firstCutOutIndex === secondCutOutIndex) {
      return []; // Everything would be cut out
    }
  
    // Get cut-out part
    let cutOut = [];
    let i = firstCutOutIndex;
    while (true) {
      cutOut.push(arr[i]);
      if (i === secondCutOutIndex) {
        cutOut.push(newPoint);
        break;
      }
      i = (i + 1) % n;
    }
  
    // Get rest part
    let rest = [];
    i = (secondCutOutIndex + 1) % n;
    do {
      rest.push(arr[i]);
      i = (i + 1) % n;
    } while (i !== firstCutOutIndex);
    rest.push(arr[firstCutOutIndex]);
    rest.push(newPoint);
  
    // Return the smaller portion to be cut out
    return cutOut.length <= rest.length ? rest : cutOut;
  }

  circularCutRestAndAddIntersect(arr, firstCutOutIndex, secondCutOutIndex, newPoint, directionDueToCamType) {
    if (!Array.isArray(arr) || arr.length === 0) {
      throw new Error('Invalid array');
    }
  
    const n = arr.length;
    if (firstCutOutIndex < 0 || secondCutOutIndex < 0 || 
        firstCutOutIndex >= n || secondCutOutIndex >= n) {
      throw new Error('Invalid indices');
    }
  
    var flag = false;

    if (firstCutOutIndex > secondCutOutIndex) {
      var temp = firstCutOutIndex;
      firstCutOutIndex = secondCutOutIndex;
      secondCutOutIndex = temp;
      flag = true;
    }

    return arr.filter((point, index) => {
      return index <= firstCutOutIndex
    }).concat(newPoint).concat(arr.filter((point, index) => {
      return flag ? (index >= secondCutOutIndex) : (index > secondCutOutIndex)
    }));
  }

  // intersectAreaNotVisibleExist(draggingPointIndex) {
  intersectAreaNotVisibleExist() {
    const angle = globalCameras.find((cam) => cam.cameraID == this.cameraID).m_angle;
    const out_radius = visionRanges(this.type, angle)[2] * this.scale;

    for (let i = 0; i < this.points.length; ++i) {
      if (i != this.draggingPointIndex && (i + 1) % this.points.length != this.draggingPointIndex) {
        const edge2Distanve = distance(this.center, this.points[this.draggingPointIndex]);

        const edge1 = [
          this.points[i],
          this.points[(i + 1) % this.points.length],
        ];
        const edge2 = [
          this.center,
          {
            x:
              this.center.x +
              (((this.points[this.draggingPointIndex].x - this.center.x) * out_radius) / edge2Distanve) * 2,
            y:
              this.center.y +
              (((this.points[this.draggingPointIndex].y - this.center.y) * out_radius) / edge2Distanve) * 2,
          },
        ];
        const intersectEdges = findEdgeIntersection(edge1, edge2);

        if (intersectEdges.length > 0) {
          return { edge: intersectEdges, index: i };
        }
      }
    }
    return { edge: [], index: -1 };
  }

  getMousePosition(event) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  isPointClicked(point, x, y) {
    const dx = point.x - x;
    const dy = point.y - y;

    return dx * dx + dy * dy < 36; // Radius threshold < 6?
  }

  addPointsAroundDraggingPoint(arrivedPoint) {
    const arrivedPointIndex = this.points.findIndex((point) => this.isPointClicked(point, arrivedPoint.x, arrivedPoint.y));
    // Ensure draggingPointIndex is valid
    if (arrivedPointIndex < 0 || arrivedPointIndex >= this.points.length) {
      console.error("Invalid draggingPointIndex", arrivedPointIndex);
      return this.points;
    }

    let newPrevPoint, newNextPoint;

    if (arrivedPointIndex === 0) {
      // Case 1: arrivedPointIndex is 0, add points between last and first, and between first and second
      const lastPoint = this.points[this.points.length - 1];
      const firstPoint = this.points[0];
      const secondPoint = this.points[1];

      newPrevPoint = new Point(
        (lastPoint.x + firstPoint.x) / 2,
        (lastPoint.y + firstPoint.y) / 2,
        false,
      );
      newNextPoint = new Point(
        (firstPoint.x + secondPoint.x) / 2,
        (firstPoint.y + secondPoint.y) / 2,
        false,
      );

      this.points.splice(arrivedPointIndex, 0, newPrevPoint); // Insert before the first point
      this.points.splice(arrivedPointIndex + 2, 0, newNextPoint); // Insert after the first point
    } else if (arrivedPointIndex === this.points.length - 1) {
      // Case 2: arrivedPointIndex is the last point, add points between last and first, and between second last and last
      const lastPoint = this.points[points.length - 1];
      const firstPoint = this.points[0];
      const secondLastPoint = this.points[this.points.length - 2];

      newPrevPoint = new Point(
        (secondLastPoint.x + lastPoint.x) / 2,
        (secondLastPoint.y + lastPoint.y) / 2,
        false,
      );
      newNextPoint = new Point(
        (lastPoint.x + firstPoint.x) / 2,
        (lastPoint.y + firstPoint.y) / 2,
        false,
      );

      this.points.splice(arrivedPointIndex, 0, newPrevPoint); // Insert before the last point
      this.points.splice(arrivedPointIndex + 2, 0, newNextPoint); // Insert after the last point
    } else {
      // Case 3: Normal case, add points between dragging point and its neighbors
      const prevPoint = this.points[arrivedPointIndex - 1];
      const draggingPoint = this.points[arrivedPointIndex];
      const nextPoint = this.points[arrivedPointIndex + 1];

      newPrevPoint = new Point(
        (prevPoint.x + draggingPoint.x) / 2,
        (prevPoint.y + draggingPoint.y) / 2,
        false,
      );
      newNextPoint = new Point(
        (draggingPoint.x + nextPoint.x) / 2,
        (draggingPoint.y + nextPoint.y) / 2,
        false,
      );

      this.points.splice(arrivedPointIndex, 0, newPrevPoint); // Insert before the dragging point
      this.points.splice(arrivedPointIndex + 2, 0, newNextPoint); // Insert after the dragging point
    }

    return this.points;
  }
}
