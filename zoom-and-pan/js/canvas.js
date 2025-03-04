// draw an image based on img url to canvas
function drawImageOnCanvas(canvas, imgURL, callback) {
  const ctx = canvas.getContext("2d");
  const bgImage = new Image();
  bgImage.src = imgURL;

  clearCanvas();
  ctx.save();
  ctx.translate(originX, originY);
  ctx.scale(scale, scale);

  if (flagShowGrid) {
    drawGrid();
  }

  // If image is already loaded, use it directly
  if (cachedBgImage) {
    ctx.drawImage(cachedBgImage, 0, 0, cachedBgImage.width, cachedBgImage.height);
    ctx.restore();
    updateStatePanel();
    // Call the callback function after the image is drawn
    if (callback) {
      callback();
    }
  } else {
    bgImage.onload = () => {
      cachedBgImage = bgImage; // Cache the image after loading
      ctx.drawImage(bgImage, 0, 0, bgImage.width, bgImage.height);
      ctx.restore();
      updateStatePanel();

      // Call the callback function after the image is drawn
      if (callback) {
        callback();
      }
    };

    bgImage.onerror = () => {
      console.error("Failed to load image. Check the URL!");
    };
  }
}

// Fill polygon with some color on to the canvas
function drawPolygonToCanvas(
  canvas,
  points,
  fillStyle = "red",
  isRealRelated = false
) {
  var ctx = canvas.getContext("2d");
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    if (!isRealRelated || points[i].isReal) {
      ctx.lineTo(points[i].x, points[i].y);
    }
  }
  ctx.closePath();
  ctx.fillStyle = fillStyle;
  ctx.fill();
}

function _drawDirectlyToMainCanvas(
  canvasId,
  outerFillStyle,
  innerFillStyle1,
  innerFillStyle2
) {
  var finalCanvas = element_by_id(canvasId);

  drawImageOnCanvas(finalCanvas, imgURL, () => {
    globalCameras.forEach((cam) => {
      if (cam.visibility_of_in1) {
        var intersect_polygons1 = intersect(
          cam.cameraVision.outer_polygon,
          cam.cameraVision.inner_polygon1
        );
        if (intersect_polygons1.length > 0) {
          intersect_polygons1.forEach((polygon, index) => {
            if (index == 0) {
              // drawing only first intersection area
              drawPolygonToCanvas(finalCanvas, polygon, innerFillStyle1);
            }
          });
        }
      }

      if (cam.visibility_of_in2) {
        var intersect_polygons2 = intersect(
          cam.cameraVision.outer_polygon,
          cam.cameraVision.inner_polygon2
        );
        if (intersect_polygons2.length > 0) {
          intersect_polygons2.forEach((polygon, index) => {
            if (index == 0) {
              // drawing only first intersection area
              drawPolygonToCanvas(finalCanvas, polygon, innerFillStyle2);
            }
          });
        }
      }

      if (cam.visibility_of_out) {
        drawPolygonToCanvas(
          finalCanvas,
          cam.cameraVision.outer_polygon,
          outerFillStyle,
          true
        );
        cam.cameraVision.draggablePolygonObject.drawPointsAndLines();
      }

      // Draws circle (camera) when dragging the polygon
      drawCircleToCanvas(
        finalCanvas,
        cam.cameraVision.center_point,
        CAMERA_CIRCLE_RADIUS
      );
    });
  });
}

function drawCircleToCanvas(canvas, center, radius, color = "blue") {
  const ctx = canvas.getContext("2d");
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fill();
  ctx.closePath();
}
