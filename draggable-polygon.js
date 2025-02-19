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
    updateOuterPolygon, // update camera-vision's outer_polygon
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
    this.points = [...points]; // [{x, y}, {x, y}, ...]
    this.draggingPoint = null;
    this.originalPoints = null;

    // Mouse event listeners
    this.canvas.addEventListener("mousedown", (e) => this.onMouseDown(e));
    this.canvas.addEventListener("mousemove", (e) => this.onMouseMove(e));
    this.canvas.addEventListener("mouseup", () => this.onMouseUp());
    this.canvas.addEventListener("mouseleave", () => this.onMouseUp());

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
      this.points.push({x: point.x, y: point.y});
    });
  }

  draw(camera_redraw = true) {
    if (this.clearCanvasCallback) {
      this.clearCanvasCallback(camera_redraw);
    }
  }

  drawPointsAndLines() {
    // Draw polygon
    this.ctx.beginPath();
    this.ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      this.ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    this.ctx.closePath();
    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    this.ctx.fillStyle = "rgba(0, 0, 255, 0.2)";
    this.ctx.fill();

    // Draw draggable points
    this.points.forEach((point) => {
      this.ctx.beginPath();
      this.ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
      this.ctx.fillStyle = "red";
      this.ctx.fill();
      this.ctx.strokeStyle = "black";
      this.ctx.stroke();
    });

    this.drawCameraName();
  }

  onMouseDown(event) {
    const { x, y } = this.getMousePosition(event);
    const dragPoint = this.points.find((point) =>
      this.isPointClicked(point, x, y)
    );

    if (dragPoint) {
      this.draggingPoint = {x: dragPoint.x, y: dragPoint.y};

      if (this.type == "zoom" && this.getDraggingPointIndex() == 0) {
        this.draggingPoint = null;
        return;
      }

      this.originalPoints = [...this.points];
      this.canvas.style.cursor = "grabbing";
    }
  }

  onMouseMove(event) {
    const { x, y } = this.getMousePosition(event);

    if (this.draggingPoint) {
      // Move the point
      this.draggingPoint.x = x;
      this.draggingPoint.y = y;
    } else {
      // Change cursor when hovering over points
      const hovering = this.points.some((point) =>
        this.isPointClicked(point, x, y)
      );

      const hoveringIndex = this.points.findIndex((point) => this.isPointClicked(point, x, y));
      if (this.type == "zoom" && hoveringIndex == 0) return;
      
      this.canvas.style.cursor = hovering ? "grab" : "default";
    }
  }

  onMouseUp() {
    if (this.draggingPoint) {
      if (distance(this.draggingPoint, this.center) > this.scale) {
        this.draggingPoint = null;
        this.points = [...this.originalPoints];
        this.canvas.style.cursor = "default";
        this.updateOuterPolygon(this.points);
        this.drawPointsAndLines();
        return;
      }
    }

    const draggingPointIndex = this.getDraggingPointIndex();
    this.draggingPoint = null;
    this.canvas.style.cursor = "default";

    if (draggingPointIndex == undefined) return;

    this.points = this.addPointsAroundDraggingPoint(
      this.points,
      draggingPointIndex
    );

    this.updateOuterPolygon(this.points);
    this.drawPointsAndLines();
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

    return (dx * dx + dy * dy) < 64; // Radius threshold < 8?
  }

  getDraggingPointIndex() {
    if (this.draggingPoint == null) return;

    var index = this.points.findIndex((point) => {
      return this.isPointClicked(this.draggingPoint, point.x, point.y);
    });

    return index;
  }

  addPointsAroundDraggingPoint(points, draggingPointIndex) {
    // Ensure draggingPointIndex is valid
    if (draggingPointIndex < 0 || draggingPointIndex >= points.length) {
      console.error("Invalid draggingPointIndex");
      return points;
    }

    let newPrevPoint, newNextPoint;

    if (draggingPointIndex === 0) {
      // Case 1: draggingPointIndex is 0, add points between last and first, and between first and second
      const lastPoint = points[points.length - 1];
      const firstPoint = points[0];
      const secondPoint = points[1];

      newPrevPoint = {
        x: (lastPoint.x + firstPoint.x) / 2,
        y: (lastPoint.y + firstPoint.y) / 2,
      };
      newNextPoint = {
        x: (firstPoint.x + secondPoint.x) / 2,
        y: (firstPoint.y + secondPoint.y) / 2,
      };

      points.splice(draggingPointIndex, 0, newPrevPoint); // Insert before the first point
      points.splice(draggingPointIndex + 2, 0, newNextPoint); // Insert after the first point
    } else if (draggingPointIndex === points.length - 1) {
      // Case 2: draggingPointIndex is the last point, add points between last and first, and between second last and last
      const lastPoint = points[points.length - 1];
      const firstPoint = points[0];
      const secondLastPoint = points[points.length - 2];

      newPrevPoint = {
        x: (lastPoint.x + firstPoint.x) / 2,
        y: (lastPoint.y + firstPoint.y) / 2,
      };
      newNextPoint = {
        x: (secondLastPoint.x + lastPoint.x) / 2,
        y: (secondLastPoint.y + lastPoint.y) / 2,
      };

      points.splice(draggingPointIndex, 0, newPrevPoint); // Insert before the last point
      points.splice(draggingPointIndex + 2, 0, newNextPoint); // Insert after the last point
    } else {
      // Case 3: Normal case, add points between dragging point and its neighbors
      const prevPoint = points[draggingPointIndex - 1];
      const draggingPoint = points[draggingPointIndex];
      const nextPoint = points[draggingPointIndex + 1];

      newPrevPoint = {
        x: (prevPoint.x + draggingPoint.x) / 2,
        y: (prevPoint.y + draggingPoint.y) / 2,
      };
      newNextPoint = {
        x: (draggingPoint.x + nextPoint.x) / 2,
        y: (draggingPoint.y + nextPoint.y) / 2,
      };

      points.splice(draggingPointIndex, 0, newPrevPoint); // Insert before the dragging point
      points.splice(draggingPointIndex + 2, 0, newNextPoint); // Insert after the dragging point
    }

    return points;
  }
}
