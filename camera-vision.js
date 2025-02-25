class CameraVision {
  constructor(
    cameraID,
    cameraName,
    type,
    center_point,
    rotation,
    inner_polygon1,
    inner_polygon2,
    outer_polygon,
    scale,
  ) {
    this.cameraID = cameraID,
    this.cameraName = cameraName,
    this.type = type,
    this.scale = scale;
    this.center_point = center_point;
    this.rotation = rotation;
    this.inner_polygon1 = this._rotatePolygon(inner_polygon1, center_point, rotation);
    this.inner_polygon2 = this._rotatePolygon(inner_polygon2, center_point, rotation);
    this.outer_polygon = this._rotatePolygon(outer_polygon, center_point, rotation);

    this.isDragging = false;
    this.dragStart = null;
    this.selectedPoint = null;
    this.draggablePolygonObject = null;
    this.initialMousePosition = null;

    this._draw();
    this._initMouseEvents();
  }

  changeCameraNameInVision(cameraName) {
    this.cameraName = cameraName;

    if (this.draggablePolygonObject) {
      this.draggablePolygonObject.changeCameraNameInPolygon(cameraName);
    }
  }

  updateOuterPolygon(points) {
    this.outer_polygon = [];
    if (points) {
      (points).forEach(point => {
        this.outer_polygon.push(point);
      });
    }
  }

  _initMouseEvents() {
    const canvas = document.getElementById("finalCanvas");
    canvas.addEventListener("mousedown", this._onMouseDown.bind(this));
    canvas.addEventListener("mousemove", this._onMouseMove.bind(this));
    canvas.addEventListener("mouseup", this._onMouseUp.bind(this));
  }

  _onMouseDown(event) {
    const { offsetX, offsetY } = event;
    const rect = document.getElementById("finalCanvas").getBoundingClientRect();

    // Check necessity to rotate first
    if (this._isInRotatorHandle(offsetX, offsetY)) {
      // Calculate initial angle based on mouse click position
      this.initialMousePosition = { x: offsetX, y: offsetY };
      showMenu(polygon_menu, offsetX + rect.left, offsetY + rect.top, this.cameraID);
      return;
    } else {
      // hideMenu(polygon_menu);
    }

    // Check necessity to drag after
    this.selectedPoint = this._getClickedPoint(
      { x: offsetX, y: offsetY },
      this.outer_polygon
    );

    if (this.selectedPoint) {
      return; // Allow reshaping instead of dragging
    }

    if (
      this._isPointInsidePolygon({ x: offsetX, y: offsetY }, this.outer_polygon)
    ) {
      if (isReplaceAllowed) {
        this.isDragging = true;
        this.dragStart = { x: offsetX, y: offsetY };
      }
    }
  }

  _onMouseMove(event) {
    const { offsetX, offsetY } = event;

    if (this.selectedPoint) {
      this.selectedPoint.x = event.offsetX;
      this.selectedPoint.y = event.offsetY;
      this._draw();
      return;
    }

    // Calculate the angle between the initial position and the current mouse position
    if (this.initialMousePosition && isRotationAllowed) {
      const angleChange = this._calculateAngleChange(
        this.initialMousePosition,
        { x: offsetX, y: offsetY }
      );
      this.rotate(angleChange);
      this.initialMousePosition = { x: offsetX, y: offsetY }; // Update the initial position for next move
      return;
    }

    if (!this.isDragging) return;

    const dx = offsetX - this.dragStart.x;
    const dy = offsetY - this.dragStart.y;

    this.center_point.x += dx;
    this.center_point.y += dy;
    this.outer_polygon = this._translatePolygon(this.outer_polygon, dx, dy);
    this.inner_polygon1 = this._translatePolygon(this.inner_polygon1, dx, dy);
    this.inner_polygon2 = this._translatePolygon(this.inner_polygon2, dx, dy);
    this.dragStart = { x: offsetX, y: offsetY };
    this._drawSketch();
  }

  _onMouseUp() {
    if (this.isDragging) {
      isReplaceAllowed = false;
      this.isDragging = false;
    }

    if (isRotationAllowed) {
      isRotationAllowed = false;
      this.initialMousePosition = null; // Reset the initial position
    }
    this.selectedPoint = null;
  }

  _calculateAngleChange(initial, current) {
    const deltaX = current.x - this.center_point.x;
    const deltaY = current.y - this.center_point.y;
    const initialDeltaX = initial.x - this.center_point.x;
    const initialDeltaY = initial.y - this.center_point.y;

    const initialAngle = Math.atan2(initialDeltaY, initialDeltaX);
    const currentAngle = Math.atan2(deltaY, deltaX);

    // Convert the angle difference from radians to degrees
    const angleChange = (currentAngle - initialAngle) * (180 / Math.PI);

    return angleChange;
  }

  _translatePolygon(polygon, dx, dy) {
    return polygon.map(({ x, y }) => ({ x: x + dx, y: y + dy }));
  }

  _getClickedPoint(point, polygon) {
    return (
      polygon.find(({ x, y }) => Math.hypot(x - point.x, y - point.y) < 5) ||
      null
    );
  }

  _isPointInsidePolygon(point, polygon) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x,
        yi = polygon[i].y;
      const xj = polygon[j].x,
        yj = polygon[j].y;
      const intersect =
        yi > point.y !== yj > point.y &&
        point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  }

  rotate(angle) {
    if (this.cameraID != lastSelectedCameraID) return;
    if (!isRotationAllowed) return;
    this.rotation += angle;
    this.inner_polygon1 = this._rotatePolygon(this.inner_polygon1, this.center_point, angle);
    this.inner_polygon2 = this._rotatePolygon(this.inner_polygon2, this.center_point, angle);
    this.outer_polygon = this._rotatePolygon(this.outer_polygon, this.center_point, angle);
    this._drawSketch();
  }

  _rotatePolygon(points, center, angle) {
    const radians = (Math.PI / 180) * angle;
    return points.map(({ x, y }) => {
      const dx = x - center.x;
      const dy = y - center.y;
      return {
        x: Math.cos(radians) * dx - Math.sin(radians) * dy + center.x,
        y: Math.sin(radians) * dx + Math.cos(radians) * dy + center.y,
      };
    });
  }

  _drawCircle(center, radius, color = "black") {
    const canvas = document.getElementById("finalCanvas");
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
  }

  _isInRotatorHandle(x, y) {
    return (
      (x - this.center_point.x) * (x - this.center_point.x) +
        (y - this.center_point.y) * (y - this.center_point.y) <
      100
    );
  }

  _draw() {
    const canvas = document.getElementById("finalCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (this.draggablePolygonObject == null) {
      this.draggablePolygonObject = new DraggablePolygon(
        this.cameraID,
        this.cameraName,
        this.type,
        this.scale,
        this.center_point,
        canvas,
        this.outer_polygon,
        (camera_redraw) => {
          this._drawSketch();

          setTimeout(() => {
            this._drawCircle(this.center_point, CAMERA_CIRCLE_RADIUS, "rgba(0, 0, 255, 1)");
          }, 100);
        },
        (points) => {
          this.updateOuterPolygon(points);
        }
      );
    } else {
      this.draggablePolygonObject.draw();
    }
  }

  _drawSketch() {
    if (this.draggablePolygonObject) {
      this.draggablePolygonObject.updatePoints(this.outer_polygon);
    }

    _drawDirectlyToMainCanvas(
      this.cameraID,
      "finalCanvas",
      this.outer_polygon,
      this.inner_polygon1,
      this.inner_polygon2,
      "rgba(255, 0, 0, 0.3)",
      "rgba(0, 0, 255, 0.4)",
      "rgba(0, 255, 0, 0.5)",
      this.center_point,
      this.draggablePolygonObject,
    );
  }
}