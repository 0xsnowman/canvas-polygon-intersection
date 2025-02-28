class Point {
  constructor(x, y, isReal = true) {
    this.x = x;
    this.y = y;
    this.isReal = isReal;
  }

  move(x, y) {
    this.x = x;
    this.y = y;
  }

  makeReal() {
    this.isReal = true;
  }

  distanceTo(point) {
    return Math.sqrt((this.x - point.x) ** 2 + (this.y - point.y) ** 2);
  }

  draw(ctx, index) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.isReal ? 6 : 5, 0, Math.PI * 2);
    ctx.fillStyle = this.isReal ? "red" : "rgba(0, 0, 255, 0.8)";
    ctx.fill();
    ctx.strokeStyle = this.isReal ? "black" : "rgba(0, 0, 0, 0.3)";
    ctx.stroke();

    if (globalShowPointIndexFlag) {
      ctx.font = "20px Arial";
      ctx.fillStyle = "red"; // Text color
      ctx.textAlign = "center"; // Align text
      ctx.textBaseline = "middle"; // Align baseline
      ctx.fontWeight = "bold";

      // Draw text
      ctx.fillText(index, this.x, this.y - 15);
    }
  }
}
