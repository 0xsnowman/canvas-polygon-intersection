// makes shorten form of name
function shortenName(name) {
    if (!name || name == undefined) return "CAM-ERR";
    if (name.length > 7) {
        return name.substr(0, 2) + "..." + name.substr(name.length - 3, 3);
    }
    return name;
}

// change angle to radians
function toRadians(angle) {
    return (Math.PI / 180) * angle;
}

// get needed points count for certain angle
function getPointsCountForAngle(ridians) {
    return Math.round(ridians * 4) + 3;
}

// generates random camera ID
function generateRandom4Digits() {
    let numbers = "";
    for (let i = 0; i < 4; i++) {
        numbers += Math.floor(Math.random() * 10); // Random digit (0-9)
    }

    return numbers;
}

// html document.getElementById function instead
function element_by_id(id) {
    return document.getElementById(id);
}

// html document.getElementsByClassName instead
function elements_by_class(className) {
    return document.getElementsByClassName(className);
}

// index validation
function is_index_valid(index) {
    return (index && index != undefined && index >= 0);
}