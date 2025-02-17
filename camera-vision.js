class CameraVision {
  constructor(
    center_point,
    rotation,
    inner_polygon1,
    inner_polygon2,
    outer_polygon
  ) {
    this.center_point = center_point;
    this.rotation = rotation;
    this.inner_polygon1 = this._rotatePolygon(
      inner_polygon1,
      center_point,
      rotation
    );
    this.inner_polygon2 = this._rotatePolygon(
      inner_polygon2,
      center_point,
      rotation
    );
    this.outer_polygon = this._rotatePolygon(
      outer_polygon,
      center_point,
      rotation
    );

    this._draw();
  }

  rotate(angle) {
    this.rotation += angle;
    this.inner_polygon1 = this._rotatePolygon(
      this.inner_polygon1,
      this.center_point,
      angle
    );
    this.inner_polygon2 = this._rotatePolygon(
      this.inner_polygon2,
      this.center_point,
      angle
    );
    this.outer_polygon = this._rotatePolygon(
      this.outer_polygon,
      this.center_point,
      angle
    );
    this._draw();
  }

  _rotatePolygon(points, center, angle) {
    const radians = (Math.PI / 180) * angle; // Convert degrees to radians
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
    var canvas = document.getElementById("finalCanvas");
    var ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
  }

  _draw() {
    // Initialize the canvas and polygon
    const canvas = document.getElementById("finalCanvas");

    var draggablePolygonObject = new DraggablePolygon(
      canvas,
      this.outer_polygon,
      () => {
        _drawFOPACAFIP(
          "finalCanvas",
          this.outer_polygon,
          this.inner_polygon1,
          this.inner_polygon2,
          "rgba(255, 0, 0, 0.3)",
          "rgba(0, 0, 255, 0.4)",
          "rgba(0, 255, 0, 0.5)",
          draggablePolygonObject
        );

        setTimeout(() => {
          this._drawCircle(this.center_point, 10, "red");
        }, 100);
      }
    );

    draggablePolygonObject.draw();
  }
}
