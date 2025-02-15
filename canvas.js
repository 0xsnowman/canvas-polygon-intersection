// Function to clip and draw a polygonal area onto another canvas
/*

Example use case:

// Define polygon clipping areas
const clippingPolygon1 = [
  { x: 50, y: 50 }, // Point 1 of polygon for canvas1
  { x: 150, y: 50 }, // Point 2 of polygon for canvas1
  { x: 150, y: 150 }, // Point 3 of polygon for canvas1
  { x: 50, y: 150 }, // Point 4 of polygon for canvas1
];

// Define target polygon areas
const targetPolygon1 = [
  { x: 0, y: 0 },
  { x: 100, y: 0 },
  { x: 100, y: 100 },
  { x: 0, y: 100 },
];

// Clip and draw from canvas1 to finalCanvas
clipAndDraw(ctx1, clippingPolygon1, finalCtx, targetPolygon1);
*/
function clipAndDraw(originalCtx, clippingPolygon, targetCtx, targetPolygon) {
  // Save the target context before clipping
  targetCtx.save();

  // Clip the original image with the clipping polygon
  targetCtx.beginPath();
  targetCtx.moveTo(clippingPolygon[0].x, clippingPolygon[0].y); // Start the path at the first point

  for (let i = 1; i < clippingPolygon.length; i++) {
    targetCtx.lineTo(clippingPolygon[i].x, clippingPolygon[i].y); // Draw lines to subsequent points
  }
  targetCtx.closePath(); // Close the path
  targetCtx.clip(); // Apply the clipping path

  // Draw the clipped area onto the target canvas
  // Calculate the transformation needed to match the target polygon
  const scaleX =
    (targetPolygon[1].x - targetPolygon[0].x) /
    (clippingPolygon[1].x - clippingPolygon[0].x);
  const scaleY =
    (targetPolygon[2].y - targetPolygon[0].y) /
    (clippingPolygon[2].y - clippingPolygon[0].y);
  targetCtx.drawImage(
    originalCtx.canvas, // The source canvas (original)
    0,
    0,
    originalCtx.canvas.width,
    originalCtx.canvas.height, // Source area
    targetPolygon[0].x,
    targetPolygon[0].y,
    (clippingPolygon[1].x - clippingPolygon[0].x) * scaleX,
    (clippingPolygon[2].y - clippingPolygon[0].y) * scaleY // Target area on the final canvas
  );

  // Restore the target context
  targetCtx.restore();
}

// draw an image based on img url to canvas
function drawImageOnCanvas(canvas, imgURL, callback) {
  const ctx = canvas.getContext("2d");
  const bgImage = new Image();
  bgImage.src = imgURL;

  bgImage.onload = () => {
    console.log("Image loaded successfully!");
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
