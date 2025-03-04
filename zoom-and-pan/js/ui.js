const canvas = element_by_id('finalCanvas');
const ctx = canvas.getContext('2d');
const fileInput = element_by_id('fileInput');
const burgerIconForSidePanel = element_by_id('burgerIconForSidePanel');
const cameraListPanel = element_by_id('cameraListPanel');
const cameraButtons = document.querySelectorAll('.buttons button');
const showPointIndexCheckbox = element_by_id('showPointIndex');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drawImage();
  updateStatePanel();
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Function to draw the grid
function drawGrid() {
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  // Calculate the large grid size (5x the canvas size)
  const largeGridWidth = canvasWidth * GRID_SCALE;
  const largeGridHeight = canvasHeight * GRID_SCALE;

  // Set the grid color
  ctx.strokeStyle = gridColor;

  // Draw vertical lines for the grid (using large grid size)
  for (let x = -largeGridWidth; x < largeGridWidth; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, -largeGridHeight);
    ctx.lineTo(x, largeGridHeight);
    ctx.stroke();
  }

  // Draw horizontal lines for the grid (using large grid size)
  for (let y = -largeGridHeight; y < largeGridHeight; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(-largeGridWidth, y);
    ctx.lineTo(largeGridWidth, y);
    ctx.stroke();
  }
}

function drawImage() {
  clearCanvas();
  ctx.save();
  ctx.translate(originX, originY);
  ctx.scale(scale, scale);
  if (image.complete) {
    // Draw the grid in the background

    if (flagShowGrid) {
      drawGrid();
    }
    ctx.drawImage(image, 0, 0);
  }
  ctx.restore();
  updateStatePanel();
}

function toggleSidePanel() {
  sidePanel.classList.toggle('hidden');
}

function toggleCameraListPanel() {
  cameraListPanel.classList.toggle('hidden');
}

cameraButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    console.log(`Camera ${index + 1} clicked`);
    // Add camera switch logic here
  });
});

function closeSidePanel() {
  const sidePanel = element_by_id('sidePanel');
  sidePanel.classList.add('hidden');
}

function closeStatePanel() {
  const statePanel = element_by_id('statePanel');
  statePanel.classList.add('hidden');
}

function closeCameraListPanel() {
  const cameraListPanel = element_by_id('cameraListPanel');
  cameraListPanel.classList.add('hidden');
}
