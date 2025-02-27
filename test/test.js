function polygonate(edges) {
  var polygons = [];
  var polygon = [];
  var len = edges.length;
  var midpoints = getMidpoints(edges);
  //start from every edge and create non-selfintersecting polygons
  for (var i = 0; i < len - 2; i++) {
    var org = { x: edges[i][0].x, y: edges[i][0].y };
    var dest = { x: edges[i][1].x, y: edges[i][1].y };
    var currentEdge = i;
    var point;
    var p;
    var direction;
    var stop;
    //while we havn't come to the starting edge again
    for (direction = 0; direction < 2; direction++) {
      polygon = [];
      stop = false;
      while (polygon.length === 0 || !stop) {
        //add point to polygon
        polygon.push({ x: org.x, y: org.y });
        point = undefined;
        //look for edge connected with end of current edge
        for (var j = 0; j < len; j++) {
          p = undefined;
          //except itself
          if (!equalEdges(edges[j], edges[currentEdge])) {
            //if some edge is connected to current edge in one endpoint
            if (edges[j][0].x === dest.x && edges[j][0].y === dest.y) {
              p = edges[j][1];
            }
            if (edges[j][1].x === dest.x && edges[j][1].y === dest.y) {
              p = edges[j][0];
            }
            //compare it with last found connected edge for minimum angle between itself and current edge
            if (p) {
              var classify = classifyPoint(p, [org, dest]);
              //if this edge has smaller theta then last found edge update data of next edge of polygon
              if (
                !point ||
                (classify.theta < point.theta && direction === 0) ||
                (classify.theta > point.theta && direction === 1)
              ) {
                point = { x: p.x, y: p.y, theta: classify.theta, edge: j };
              }
            }
          }
        }
        //change current edge to next edge
        org.x = dest.x;
        org.y = dest.y;
        dest.x = point.x;
        dest.y = point.y;
        currentEdge = point.edge;
        //if we reach start edge
        if (equalEdges([org, dest], edges[i])) {
          stop = true;
          //check polygon for correctness
          /*for (var k = 0; k < allPoints.length; k++) {
                //if some point is inside polygon it is incorrect
                if ((!pointExists(allPoints[k], polygon)) && (findPointInsidePolygon(allPoints[k], polygon))) {
                  polygon = false;
                }
              }*/
          for (k = 0; k < midpoints.length; k++) {
            //if some midpoint is inside polygon (edge inside polygon) it is incorrect
            if (findPointInsidePolygon(midpoints[k], polygon)) {
              polygon = false;
            }
          }
        }
      }
      //add created polygon if it is correct and was not found before
      if (polygon && !polygonExists(polygon, polygons)) {
        polygons.push(polygon);
      }
    }
  }
  return polygons;
}

var polygonate_test_data = [
  [
    {
      x: 629.55007494,
      y: 317.768476808,
    },
    {
      x: 734.55007494,
      y: 275.768476808,
    },
  ],
  [
    {
      x: 734.55007494,
      y: 275.768476808,
    },
    {
      x: 779.55007494,
      y: 257.768476808,
    },
  ],
  [
    {
      x: 779.55007494,
      y: 257.768476808,
    },
    {
      x: 779.55007494,
      y: 297.768476808,
    },
  ],
  [
    {
      x: 779.55007494,
      y: 297.768476808,
    },
    {
      x: 779.55007494,
      y: 337.768476808,
    },
  ],
  [
    {
      x: 779.55007494,
      y: 337.768476808,
    },
    {
      x: 779.55007494,
      y: 377.768476808,
    },
  ],
  [
    {
      x: 779.55007494,
      y: 337.768476808,
    },
    {
      x: 734.55007494,
      y: 331.768476808,
    },
  ],
  [
    {
      x: 734.55007494,
      y: 331.768476808,
    },
    {
      x: 629.55007494,
      y: 317.768476808,
    },
  ],
  [
    {
      x: 734.55007494,
      y: 275.768476808,
    },
    {
      x: 734.55007494,
      y: 303.768476808,
    },
  ],
  [
    {
      x: 734.55007494,
      y: 303.768476808,
    },
    {
      x: 734.55007494,
      y: 331.768476808,
    },
  ],
  [
    {
      x: 734.55007494,
      y: 331.768476808,
    },
    {
      x: 734.55007494,
      y: 359.768476808,
    },
  ],
];

polygonate(polygonate_test_data);

function getMidpoints(edges) {
  var midpoints = [];
  var x, y;
  for (var i = 0; i < edges.length; i++) {
    x = (edges[i][0].x + edges[i][1].x) / 2;
    y = (edges[i][0].y + edges[i][1].y) / 2;
    classify = classifyPoint({ x: x, y: y }, edges[i]);
    if (classify.loc != "BETWEEN") {
      console.error("Midpoint calculation error");
    }
    midpoints.push({ x: x, y: y });
  }
  return midpoints;
}

function classifyPoint(p, edge) {
  var ax = edge[1].x - edge[0].x;
  var ay = edge[1].y - edge[0].y;
  var bx = p.x - edge[0].x;
  var by = p.y - edge[0].y;
  var sa = ax * by - bx * ay;
  if (p.x === edge[0].x && p.y === edge[0].y) {
    return { loc: "ORIGIN", t: 0 };
  }
  if (p.x === edge[1].x && p.y === edge[1].y) {
    return { loc: "DESTINATION", t: 1 };
  }
  var theta =
    (polarAngle([edge[1], edge[0]]) -
      polarAngle([
        { x: edge[1].x, y: edge[1].y },
        { x: p.x, y: p.y },
      ])) %
    360;
  if (theta < 0) {
    theta = theta + 360;
  }
  if (sa < -0.000000001) {
    return { loc: "LEFT", theta: theta };
  }
  if (sa > 0.000000001) {
    return { loc: "RIGHT", theta: theta };
  }
  if (ax * bx < 0 || ay * by < 0) {
    return { loc: "BEHIND", theta: theta };
  }
  if (Math.sqrt(ax * ax + ay * ay) < Math.sqrt(bx * bx + by * by)) {
    return { loc: "BEYOND", theta: theta };
  }
  var t;
  if (ax !== 0) {
    t = bx / ax;
  } else {
    t = by / ay;
  }
  return { loc: "BETWEEN", t: t };
}

function polarAngle(edge) {
  var dx = edge[1].x - edge[0].x;
  var dy = edge[1].y - edge[0].y;
  if (dx === 0 && dy === 0) {
    //console.error("Edge has zero length.");
    return false;
  }
  if (dx === 0) {
    return dy > 0 ? 90 : 270;
  }
  if (dy === 0) {
    return dx > 0 ? 0 : 180;
  }
  var theta = (Math.atan(dy / dx) * 360) / (2 * Math.PI);
  if (dx > 0) {
    return dy >= 0 ? theta : theta + 360;
  } else {
    return theta + 180;
  }
}

function equalEdges(edge1, edge2) {
  if (
    (edge1[0].x === edge2[0].x &&
      edge1[0].y === edge2[0].y &&
      edge1[1].x === edge2[1].x &&
      edge1[1].y === edge2[1].y) ||
    (edge1[0].x === edge2[1].x &&
      edge1[0].y === edge2[1].y &&
      edge1[1].x === edge2[0].x &&
      edge1[1].y === edge2[0].y)
  ) {
    return true;
  } else {
    return false;
  }
}

function findPointInsidePolygon(point, polygon) {
  var cross = 0;
  var edges = getEdges(polygon);
  var classify;
  var org, dest;
  for (var i = 0; i < edges.length; i++) {
    [org, dest] = edges[i];
    classify = classifyPoint(point, [org, dest]);
    if (
      (classify.loc === "RIGHT" && org.y < point.y && dest.y >= point.y) ||
      (classify.loc === "LEFT" && org.y >= point.y && dest.y < point.y)
    ) {
      cross++;
    }
    if (classify.loc === "BETWEEN") return false;
  }
  if (cross % 2) {
    return true;
  } else {
    return false;
  }
}

function getEdges(fig) {
  var edges = [];
  var len = fig.length;
  for (var i = 0; i < len; i++) {
    edges.push([
      { x: fig[i % len].x, y: fig[i % len].y },
      { x: fig[(i + 1) % len].x, y: fig[(i + 1) % len].y },
    ]);
  }
  return edges;
}

function polygonExists(polygon, polygons) {
  //if array is empty element doesn't exist in it
  if (polygons.length === 0) return false;
  //check every polygon in array
  for (var i = 0; i < polygons.length; i++) {
    //if lengths are not same go to next element
    if (polygon.length !== polygons[i].length) continue;
    //if length are same need to check
    else {
      //if all the points are same
      for (var j = 0; j < polygon.length; j++) {
        //if point is not found break forloop and go to next element
        if (!pointExists(polygon[j], polygons[i])) break;
        //if point found
        else {
          //and it is last point in polygon we found polygon in array!
          if (j === polygon.length - 1) return true;
        }
      }
    }
  }
  return false;
}
