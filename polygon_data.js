// Define polygon clipping areas
const clippingPolygon1= [
  { x: 50, y: 50 }, // Point 1 of polygon for canvas1
  { x: 150, y: 50 }, // Point 2 of polygon for canvas1
  { x: 150, y: 150 }, // Point 3 of polygon for canvas1
  { x: 50, y: 150 }, // Point 4 of polygon for canvas1
];

const clippingPolygon2 = [
  { x: 30, y: 30 }, // Point 1 of polygon for canvas2
  { x: 170, y: 30 }, // Point 2 of polygon for canvas2
  { x: 170, y: 170 }, // Point 3 of polygon for canvas2
  { x: 30, y: 170 }, // Point 4 of polygon for canvas2
];

// Define target polygon areas
const targetPolygon1 = [
  { x: 0, y: 0 },
  { x: 100, y: 0 },
  { x: 100, y: 100 },
  { x: 0, y: 100 },
];

const targetPolygon2 = [
  { x: 100, y: 100 },
  { x: 200, y: 100 },
  { x: 200, y: 200 },
  { x: 100, y: 200 },
];

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
