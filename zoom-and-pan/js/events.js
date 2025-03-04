window.addEventListener('resize', resizeCanvas);

canvas.addEventListener('wheel', zoom);
canvas.addEventListener('mousedown', startDragging);
canvas.addEventListener('mousemove', drag);
canvas.addEventListener('mouseup', stopDragging);
canvas.addEventListener('mouseleave', stopDragging);
