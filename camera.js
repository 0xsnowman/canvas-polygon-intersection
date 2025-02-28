class Camera {
  constructor(type, center_x, center_y, angle = 25) {
    this.type = type;
    this.cameraID = generateRandom4Digits();
    this.cameraName =
      type == "fisheye-8mp" || type == "fisheye-12mp" || type == "fisheye-125mp"
        ? "F-" + this.cameraID
        : "Z-" + this.cameraID;
    
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
        pointCount = 14;
      for (let i = 0; i < pointCount; i++) {
        let angle = (2 * Math.PI * i) / pointCount; // 360-degree steps
        pentagon.push(new Point(
          center.x + radius * Math.cos(angle),
          center.y + radius * Math.sin(angle),
          true
        ));
      }

      return pentagon;
    }

    const visionRangesValue = visionRanges(this.type, this.m_angle);

    return {
      out_pol: createPentagon(center, visionRangesValue[2] * scale),
      in_pol1: createPentagon(center, visionRangesValue[1] * scale),
      in_pol2: createPentagon(center, visionRangesValue[0] * scale),
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
      let points = [new Point(center.x, center.y, true)]; // Start at the center

      let numPoints = getPointsCountForAngle(angleEnd - angleStart);
      // Calculate angle step
      let angleStep = (angleEnd - angleStart) / (numPoints - 1);

      // Generate points along the arc
      for (let i = 0; i < numPoints; i++) {
        let angle = angleStart + angleStep * i; // Calculate current angle (in radians)
        let x = center.x + radius * Math.cos(angle);
        let y = center.y + radius * Math.sin(angle);
        points.push(new Point(x, y, true));
      }

      return points;
    }

    const visionRangesValue = visionRanges(this.type, this.m_angle);

    return {
      out_pol: createSectorPoints(center, scale * visionRangesValue[2], -toRadians(this.m_angle), toRadians(this.m_angle)),
      in_pol1: createSectorPoints(center, scale * visionRangesValue[1], -toRadians(this.m_angle), toRadians(this.m_angle)),
      in_pol2: createSectorPoints(center, scale * visionRangesValue[0], -toRadians(this.m_angle), toRadians(this.m_angle)),
    };
  }

  drawInitialPolygon() {
    switch (this.type) {
      case "fisheye-8mp":
        this.drawPentagon();
        break;
      case "fisheye-12mp":
        this.drawPentagon();
        break;
      case "fisheye-125mp":
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
      new Point(this.center.x, this.center.y, true),
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
