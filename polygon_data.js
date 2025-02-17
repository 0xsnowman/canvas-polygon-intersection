// generates two random polygons
// Num1: first polygon dimension
// Num2: second polygon dimension
function getTwoRandomPolygons(num1, num2) {
  var twoPolygons = [[], []];
  var x, y;
  nums = [num1, num2];
  for (var i = 0; i < nums.length; i++) {
    for (var j = 0; j < nums[i]; j++) {
      x = Math.round(380 * Math.random() + 10);
      y = Math.round(380 * Math.random() + 10);
      twoPolygons[i].push({ x: x, y: y });
    }
  }
  //log(twoPolygons);
  return twoPolygons;
}
