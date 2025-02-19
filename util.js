function shortenName(name) {
    if (!name || name == undefined) return "CAM-ERR";
    if (name.length > 7) {
        return name.substr(0, 2) + "..." + name.substr(name.length - 3, 3);
    }
    return name;
}