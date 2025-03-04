function updateStatePanel() {
    document.getElementById('scaleValue').textContent = scale.toFixed(2);
    document.getElementById('originXValue').textContent = Math.round(originX);
    document.getElementById('originYValue').textContent = Math.round(originY);
    document.getElementById('canvasWidth').textContent = canvas.width;
    document.getElementById('canvasHeight').textContent = canvas.height;
    document.getElementById('mouseXValue').textContent = startX;
    document.getElementById('mouseYValue').textContent = startY;
    document.getElementById('isDraggingValue').textContent = isDragging;
}
  