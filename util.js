function shortenName(name) {
  if (!name || name == undefined) return "CAM-ERR";
  if (name.length > 7) {
    return name.substr(0, 2) + "..." + name.substr(name.length - 3, 3);
  }
  return name;
}

// Show the menu at the click position
function showMenu(menu, x, y) {
  menu.style.left = `${x}px`;
  menu.style.top = `${y}px`;
  menu.style.display = "block";
}

// Hide the menu
function hideMenu(menu) {
  menu.style.display = "none";
}

document.getElementById("allow-rotate").addEventListener("click", () => {
    isRotationAllowed = true;
    hideMenu(polygon_menu);
});

document.getElementById("allow-replace").addEventListener("click", () => {
    isReplaceAllowed = true;
    hideMenu(polygon_menu);
});