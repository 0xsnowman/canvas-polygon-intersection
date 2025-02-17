class CameraVision {
    constructor(inner_polygon1, inner_polygon2, outer_polygon) {
        this.inner_polygon1 = inner_polygon1;
        this.inner_polygon2 = inner_polygon2;
        this.outer_polygon = outer_polygon;
        this._draw();
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
        }
      );

      draggablePolygonObject.draw();
    }
}