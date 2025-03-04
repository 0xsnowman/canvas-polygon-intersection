let image = new Image();
let scale = 1;
let originX = 0;
let originY = 0;
let isDragging = false;
let startX, startY;
let flagShowGrid = true;

// Variables for grid settings
const gridSize = 30; // Size of each grid square (adjust as needed)
const gridColor = '#cccccc'; // Color of the grid lines

function zoom(e) {
  e.preventDefault();
  const zoomFactor = e.deltaY > 0 ? 1 - ZOOM_INTENSITY : 1 + ZOOM_INTENSITY;
  scale *= zoomFactor;
  scale = Math.min(Math.max(MIN_SCALE, scale), MAX_SCALE);
  redrawEntireCanvas();
  updateStatePanel();
}

function startDragging(e) {
  if (!isReplaceAllowed && !isRotationAllowed && !isAnyOfPointsOfOuterPolygonsClicked(e.clientX, e.clientY)) {
    isDragging = true;
    startX = e.clientX - originX;
    startY = e.clientY - originY;
    canvas.style.cursor = 'grabbing';
    updateStatePanel();
  }
}

function drag(e) {
  if (!isScaleSet) canvas.style.cursor = 'default';
  else canvas.style.cursor = 'grab';

  if (!isDragging) return;
  originX = e.clientX - startX;
  originY = e.clientY - startY;
  redrawEntireCanvas();
  updateStatePanel();
}

function stopDragging() {
  isDragging = false;
  canvas.style.cursor = 'grab';
  updateStatePanel();
}

function isAnyOfPointsOfOuterPolygonsClicked(x, y) {
  var flag = false;
  
  globalCameras.forEach((cam) => {
    cam.cameraVision.draggablePolygonObject.points.forEach((point) => {
      const dx = point.x - x;
      const dy = point.y - y;

      if (dx * dx + dy * dy < 36) {
        flag = true;
      }
    })
  });

  return flag;
}