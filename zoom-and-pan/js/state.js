function updateStatePanel() {
    element_by_id('scaleValue').textContent = scale.toFixed(2);
    element_by_id('originXValue').textContent = Math.round(originX);
    element_by_id('originYValue').textContent = Math.round(originY);
    element_by_id('canvasWidth').textContent = canvas.width;
    element_by_id('canvasHeight').textContent = canvas.height;
    element_by_id('mouseXValue').textContent = startX;
    element_by_id('mouseYValue').textContent = startY;
    element_by_id('isDraggingValue').textContent = isDragging;
}
  