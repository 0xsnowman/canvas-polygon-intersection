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
  
    draw(ctx, size = 5) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
      ctx.fillStyle = this.isReal ? 'blue' : 'red';
      ctx.fill();
      ctx.closePath();
    }
  }