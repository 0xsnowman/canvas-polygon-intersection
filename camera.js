class Camera {
  constructor(type) {
    this.type = type;
    this.cameraID = this.generateCameraID();

    // Example usage
    this.center = { x: 800 * Math.random(), y: 800 * Math.random() };
    this.scale = 150;
    this.rotation = 0;

    this.drawInitialPolygon();
  }

  // Generates random camera ID
  generateCameraID() {
    const letters = "abcdefghijklmnopqrstuvwxyz";
    const firstChar = letters[Math.floor(Math.random() * letters.length)]; // Random letter

    let numbers = "";
    for (let i = 0; i < 4; i++) {
      numbers += Math.floor(Math.random() * 10); // Random digit (0-9)
    }

    return firstChar.toUpperCase() + numbers;
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
  
      // Calculate midpoints and offset them outward
      let midpoints = [];
      for (let i = 0; i < 5; i++) {
        let p1 = pentagon[i];
        let p2 = pentagon[(i + 1) % 5];
  
        // Midpoint of the edge
        let mx = (p1.x + p2.x) / 2;
        let my = (p1.y + p2.y) / 2;
  
        midpoints.push({ x: mx, y: my });
      }

      let result = [];
      for (let i = 0; i < 5; ++ i) {
        result.push(pentagon[i]);
        result.push(midpoints[i]);
      }
  
      return result;
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
  
      // Calculate division points
      let p1 = triangle[1];
      let p2 = triangle[2];
  
      let p3 = {
        x: p1.x + 1,
        y: p1.y + (p2.y - p1.y) / 3,
      };
      
      let p4 = {
        x: p1.x + 1,
        y: p1.y + (p2.y - p1.y) * (2 / 3),
      };
 
      return [triangle[0], p1, p3, p4, p2 ];
    }
  
    return {
      out_pol: createTriangle(center, scale),
      in_pol1: createTriangle(center, scale * 0.7),
      in_pol2: createTriangle(center, scale * 0.85),
    };
  }

  drawInitialPolygon() {
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

  draw() {
    this.cameraVision._draw();
  }

  drawTriangle() {
    const { out_pol, in_pol1, in_pol2 } = this.generateIsoscelesTriangles(
      { x: this.center.x - 15, y: this.center.y },
      this.scale
    );

    this.cameraVision = new CameraVision(
      this.center,
      this.rotation,
      in_pol1,
      in_pol2,
      out_pol,
      this.scale,
    );
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
      out_pol,
      this.scale,
    );
  }

  // Orders it's outer polygon (camera vision) to restore its original polygon
  restoreCamera() {
    this.cameraVision.restoreVision();
  }
}
