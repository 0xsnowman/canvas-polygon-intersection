function shortenName(name) {
  if (!name || name == undefined) return "CAM-ERR";
  if (name.length > 7) {
    return name.substr(0, 2) + "..." + name.substr(name.length - 3, 3);
  }
  return name;
}

function toRadians(angle) {
  return (Math.PI / 180) * angle;
}

function getPointsCountForAngle(ridians) {
  return Math.round(ridians * 5);
}