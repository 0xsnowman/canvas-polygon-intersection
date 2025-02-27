class Camera {
  constructor(type, center_x, center_y, angle = 25) {
    this.type = type;
    this.cameraID = generateRandom4Digits();
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
    this.scale = scaleValue;
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

    const visionRangesValue = this.visionRanges();

    return {
      out_pol: createPentagon(center, visionRangesValue[2]),
      in_pol1: createPentagon(center, visionRangesValue[1]),
      in_pol2: createPentagon(center, visionRangesValue[0]),
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

    const visionRangesValue = this.visionRanges();

    console.log('visionRangesValue: ', visionRangesValue);

    return {
      out_pol: createSectorPoints(center, scale * visionRangesValue[2], -toRadians(this.m_angle), toRadians(this.m_angle)),
      in_pol1: createSectorPoints(center, scale * visionRangesValue[1], -toRadians(this.m_angle), toRadians(this.m_angle)),
      in_pol2: createSectorPoints(center, scale * visionRangesValue[0], -toRadians(this.m_angle), toRadians(this.m_angle)),
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

  visionRanges() {
    const double_angle = this.m_angle * 2;
    if (this.type == "zoom-2mp") {
      if (double_angle == 30) return [17, 28, 179];
      if (double_angle == 50) return [8, 16, 102];
      if (double_angle == 70) return [5, 10, 67];
      if (double_angle == 90) return [3, 7, 47];
      if (double_angle == 110) return [2, 5, 33];
    }
    if (this.type == "zoom-4mp") {
      if (double_angle == 30) return [20, 40, 250];
      if (double_angle == 50) return [11, 25, 144];
      if (double_angle == 70) return [7, 15, 95];
      if (double_angle == 90) return [5, 10, 67];
      if (double_angle == 110) return [3, 7, 47];
    }
    if (this.type == "zoom-8mp") {
      if (double_angle == 30) return [28, 57, 358];
      if (double_angle == 50) return [16, 32, 205];
      if (double_angle == 70) return [10, 21, 137];
      if (double_angle == 90) return [7, 15, 95];
      if (double_angle == 110) return [5, 10, 67];
    }
    if (this.type == "fisheye") {
      return [2, 5, 33];
    }
  }
}
