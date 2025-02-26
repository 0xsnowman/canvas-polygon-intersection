class Camera {
  constructor(type, center_x, center_y, angle = 30) {
    this.type = type;
    this.cameraID = this.generateCameraID();
    this.cameraName = (type == "fisheye" ? "F-" : "Z-") + this.cameraID;
    this.m_angle = angle;

    this.visibility_of_out = true;
    this.visibility_of_in1 = true;
    this.visibility_of_in2 = true;

    // Example usage
    this.center = {
      x: center_x,
      y: center_y,
    };
    this.scale = 150;
    this.rotation = 0;

    this.drawInitialPolygon();
  }

  changeCameraName(cameraName) {
    this.cameraName = cameraName;

    if (this.cameraVision) {
      this.cameraVision.changeCameraNameInVision(cameraName);
      this.draw();
    }
  }

  // Generates random camera ID
  generateCameraID() {
    let numbers = "";
    for (let i = 0; i < 4; i++) {
      numbers += Math.floor(Math.random() * 10); // Random digit (0-9)
    }

    return numbers;
  }

  generatePentagons(center, scale) {
    function createPentagon(center, radius) {
      let pentagon = [],
        pointCount = 20;
      for (let i = 0; i < pointCount; i++) {
        let angle = (2 * Math.PI * i) / pointCount; // 360-degree steps
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

  changeCameraAngle(angle) {
    this.m_angle = angle;
    const { out_pol, in_pol1, in_pol2 } = this.generateIsoscelesTriangles(
      { x: this.center.x, y: this.center.y },
      this.scale
    );
    this.cameraVision.updateInnerPolygons(in_pol1, in_pol2);
    this.cameraVision.updateOuterPolygon(out_pol);
    this.draw();
  }

  generateIsoscelesTriangles(center, scale) {
    function createSectorPoints(
      center,
      radius,
      angleStart,
      angleEnd
    ) {
      let points = [{ x: center.x, y: center.y }]; // Start at the center

      let numPoints = getPointsCountForAngle(angleEnd - angleStart);
      // Calculate angle step
      let angleStep = (angleEnd - angleStart) / (numPoints - 1);

      // Generate points along the arc
      for (let i = 0; i < numPoints; i++) {
        let angle = angleStart + angleStep * i; // Calculate current angle (in radians)
        let x = center.x + radius * Math.cos(angle);
        let y = center.y + radius * Math.sin(angle);
        points.push({ x, y });
      }

      return points;
    }

    return {
      out_pol: createSectorPoints(center, scale, -toRadians(this.m_angle), toRadians(this.m_angle)),
      in_pol1: createSectorPoints(center, scale * 0.7, -toRadians(this.m_angle), toRadians(this.m_angle)),
      in_pol2: createSectorPoints(center, scale * 0.85, -toRadians(this.m_angle), toRadians(this.m_angle)),
    };
  }

  drawInitialPolygon() {
    switch (this.type) {
      case "fisheye":
        this.drawPentagon();
        break;
      case "zoom-2mp":
        this.drawTriangle();
        break;
      case "zoom-4mp":
        this.drawTriangle();
        break;
      case "zoom-8mp":
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
      { x: this.center.x, y: this.center.y },
      this.scale
    );

    this.cameraVision = new CameraVision(
      this.cameraID,
      this.cameraName,
      this.type,
      this.center,
      this.rotation,
      in_pol1,
      in_pol2,
      out_pol,
      this.scale
    );
  }

  drawPentagon() {
    const { out_pol, in_pol1, in_pol2 } = this.generatePentagons(
      this.center,
      this.scale
    );

    this.cameraVision = new CameraVision(
      this.cameraID,
      this.cameraName,
      this.type,
      this.center,
      this.rotation,
      in_pol1,
      in_pol2,
      out_pol,
      this.scale
    );
  }
}
