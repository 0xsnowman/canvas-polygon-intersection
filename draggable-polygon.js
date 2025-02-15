class DraggablePolygon {
  constructor(canvas, points, clearCanvasCallback) {
    this.canvas = canvas;
    this.clearCanvasCallback = clearCanvasCallback;
    this.ctx = canvas.getContext("2d");
    this.points = points; // [{x, y}, {x, y}, ...]
    this.draggingPoint = null;

    // Mouse event listeners
    this.canvas.addEventListener("mousedown", (e) => this.onMouseDown(e));
    this.canvas.addEventListener("mousemove", (e) => this.onMouseMove(e));
    this.canvas.addEventListener("mouseup", () => this.onMouseUp());
    this.canvas.addEventListener("mouseleave", () => this.onMouseUp());

    this.draw(); // Initial draw
  }

  draw() {
    const ctx = this.ctx;
    
    if (this.clearCanvasCallback) {
        this.clearCanvasCallback();
    }

    // Draw polygon
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    ctx.closePath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "rgba(0, 0, 255, 0.2)";
    ctx.fill();

    // Draw draggable points
    this.points.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = "red";
      ctx.fill();
      ctx.strokeStyle = "black";
      ctx.stroke();
    });
  }

  onMouseDown(event) {
    const { x, y } = this.getMousePosition(event);
    this.draggingPoint = this.points.find((point) =>
      this.isPointClicked(point, x, y)
    );

    if (this.draggingPoint) {
      this.canvas.style.cursor = "grabbing";
    }
  }

  onMouseMove(event) {
    const { x, y } = this.getMousePosition(event);

    if (this.draggingPoint) {
      // Move the point
      this.draggingPoint.x = x;
      this.draggingPoint.y = y;
      this.draw();
    } else {
      // Change cursor when hovering over points
      const hovering = this.points.some((point) =>
        this.isPointClicked(point, x, y)
      );
      this.canvas.style.cursor = hovering ? "grab" : "default";
    }
  }

  onMouseUp() {
    this.draggingPoint = null;
    this.canvas.style.cursor = "default";
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
    return Math.sqrt(dx * dx + dy * dy) < 8; // Radius threshold
  }
}