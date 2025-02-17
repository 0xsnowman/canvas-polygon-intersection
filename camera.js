class Camera {
  constructor(type) {
    this.type = type;

    // Example usage
    this.center = { x: 200, y: 200 };
    this.scale = 150;
    this.rotation = 0;

    this.draw();
  }

  generatePentagons(center, scale) {
    function createPentagon(center, radius) {
      let pentagon = [];
      for (let i = 0; i < 5; i++) {
        let angle = (2 * Math.PI * i) / 5; // 72-degree steps
        pentagon.push({
          x: center.x + radius * Math.cos(angle),
          y: center.y + radius * Math.sin(angle),
        });
      }
      return pentagon;
    }

    return {
      out_pol: createPentagon(center, scale),
      in_pol1: createPentagon(center, scale * 0.7),
      in_pol2: createPentagon(center, scale * 0.85),
    };
  }

  generateIsoscelesTriangles(center, scale) {
    function createTriangle(center, radius) {
      let triangle = [
        { x: center.x, y: center.y },
        { x: center.x + radius, y: center.y - radius * 0.4 },
        { x: center.x + radius, y: center.y + radius * 0.4 },
      ];
      return triangle;
    }

    return {
      out_pol: createTriangle(center, scale),
      in_pol1: createTriangle(center, scale * 0.7),
      in_pol2: createTriangle(center, scale * 0.85),
    };
  }

  draw() {
    switch (this.type) {
      case "fisheye":
        this.drawPentagon();
        break;
      case "zoom":
        this.drawTriangle();
        break;
      default:
    }
  }

  drawTriangle() {
    const { out_pol, in_pol1, in_pol2 } = this.generateIsoscelesTriangles(
      this.center,
      this.scale
    );

    this.cameraVision = new CameraVision(
      this.center,
      this.rotation,
      in_pol1,
      in_pol2,
      out_pol
    );
    document.getElementById("rotate_btn").addEventListener("click", () => {
      this.cameraVision.rotate(5);
    });
  }

  drawPentagon() {
    const { out_pol, in_pol1, in_pol2 } = this.generatePentagons(
      this.center,
      this.scale
    );

    this.cameraVision = new CameraVision(
      this.center,
      this.rotation,
      in_pol1,
      in_pol2,
      out_pol
    );
    document.getElementById("rotate_btn").addEventListener("click", () => {
      this.cameraVision.rotate(5);
    });
  }
}
