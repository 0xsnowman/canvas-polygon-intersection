var cachedBgImage = null;

// draw an image based on img url to canvas
function drawImageOnCanvas(canvas, imgURL, callback) {
  const ctx = canvas.getContext("2d");
  const bgImage = new Image();
  bgImage.src = imgURL;

  // If image is already loaded, use it directly
  if (cachedBgImage) {
    ctx.drawImage(cachedBgImage, 0, 0, canvas.width, canvas.height);
    // Call the callback function after the image is drawn
    if (callback) {
      callback();
    }
  }

  bgImage.onload = () => {
    // console.log("Image loaded successfully!");
    cachedBgImage = bgImage; // Cache the image after loading
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
    
    // Call the callback function after the image is drawn
    if (callback) {
      callback();
    }
  };

  bgImage.onerror = () => {
    console.error("Failed to load image. Check the URL!");
  };
}


// Fill polygon with some color on to the canvas
function drawPolygonToCanvas(canvas, points, fillStyle = "red") {
  var ctx = canvas.getContext("2d");
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.closePath();
  ctx.fillStyle = fillStyle;
  ctx.fill();
}

// Copy canvas1 polygon area -> canvas 2 polygon area
function copyPolygonArea(canvas1, canvas2, polygon) {
  const ctx1 = canvas1.getContext("2d");
  const ctx2 = canvas2.getContext("2d");

  // Create a temporary canvas to extract the polygon area
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = canvas1.width;
  tempCanvas.height = canvas1.height;
  const tempCtx = tempCanvas.getContext("2d");

  // Clip the polygon area on tempCanvas
  tempCtx.save();
  tempCtx.beginPath();
  polygon.forEach((point, index) => {
      if (index === 0) {
          tempCtx.moveTo(point.x, point.y);
      } else {
          tempCtx.lineTo(point.x, point.y);
      }
  });
  tempCtx.closePath();
  tempCtx.clip();

  // Draw the clipped area from canvas1 onto tempCanvas
  tempCtx.drawImage(canvas1, 0, 0);

  // Get the bounding box of the polygon
  const minX = Math.min(...polygon.map(p => p.x));
  const minY = Math.min(...polygon.map(p => p.y));
  const maxX = Math.max(...polygon.map(p => p.x));
  const maxY = Math.max(...polygon.map(p => p.y));
  const width = maxX - minX;
  const height = maxY - minY;

  // Clip the same polygon on canvas2
  ctx2.save();
  ctx2.beginPath();
  polygon.forEach((point, index) => {
      if (index === 0) {
          ctx2.moveTo(point.x, point.y);
      } else {
          ctx2.lineTo(point.x, point.y);
      }
  });
  ctx2.closePath();
  ctx2.clip();

  // Draw the extracted polygon region onto canvas2 at the same position
  ctx2.drawImage(tempCanvas, minX, minY, width, height, minX, minY, width, height);

  ctx2.restore();
}

// Draw 3 polygons (2 inner, 1 outer) - outer is controllable on canvas
function _drawFOPACAFIP(
  canvasId,
  outer_polygon,
  inner_polygon,
  inner_polygon2,
  outerFillStyle,
  innerFillStyle,
  innerFillStyle2,
  draggablePolygonObject
) {
  var finalCanvas = document.getElementById(canvasId);
  var finalCtx = finalCanvas.getContext("2d");
  finalCtx.clearRect(0, 0, finalCanvas.width, finalCanvas.height);
  // console.log("clearing rect of canvas");

  drawImageOnCanvas(finalCanvas, "map.png", () => {
    drawImageOnCanvas(tempCanvas, "map.png", () => {
      // This runs AFTER the image has loaded and been drawn

      drawPolygonToCanvas(tempCanvas, outer_polygon, outerFillStyle);
      drawPolygonToCanvas(tempCanvas, inner_polygon, innerFillStyle);
      drawPolygonToCanvas(tempCanvas, inner_polygon2, innerFillStyle2);

      var intersect_polygons = intersect(outer_polygon, inner_polygon);

      if (intersect_polygons.length > 0) {
        intersect_polygons.forEach((polygon) => {
          copyPolygonArea(tempCanvas, finalCanvas, polygon);
        });
      }

      copyPolygonArea(tempCanvas, finalCanvas, outer_polygon);

      if (draggablePolygonObject) {
        draggablePolygonObject.updatePoints(outer_polygon);
        draggablePolygonObject.drawPointsAndLines();
      }
    });
  });
}
