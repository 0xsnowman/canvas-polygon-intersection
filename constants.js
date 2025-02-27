CAMERA_CIRCLE_RADIUS = 10;
CANVAS_WIDTH = 600;
CANVAS_HEIGHT = 600;

// Returns distance for each types, angles
function visionRanges(type, angle) {
  const double_angle = angle * 2;
  if (type == "zoom-2mp") {
    if (double_angle == 30) return [17, 28, 179];
    if (double_angle == 50) return [8, 16, 102];
    if (double_angle == 70) return [5, 10, 67];
    if (double_angle == 90) return [3, 7, 47];
    if (double_angle == 110) return [2, 5, 33];
  }
  if (type == "zoom-4mp") {
    if (double_angle == 30) return [20, 40, 250];
    if (double_angle == 50) return [11, 25, 144];
    if (double_angle == 70) return [7, 15, 95];
    if (double_angle == 90) return [5, 10, 67];
    if (double_angle == 110) return [3, 7, 47];
  }
  if (type == "zoom-8mp") {
    if (double_angle == 30) return [28, 57, 358];
    if (double_angle == 50) return [16, 32, 205];
    if (double_angle == 70) return [10, 21, 137];
    if (double_angle == 90) return [7, 15, 95];
    if (double_angle == 110) return [5, 10, 67];
  }
  if (type == "fisheye-8mp") {
    return [2, 5, 33];
  }
  if (type == "fisheye-12mp") {
    return [3, 7, 46];
  }
  if (type == "fisheye-125mp") {
    return [4, 8, 53];
  }
}
