exports.getDate = function () {
    let today = new Date();
    let options = {
        day: "numeric",
        weekday: "long",
        month: "long"
    };
    return today.toLocaleDateString("es-ES", options);
}

exports.getDay = function () {
    let today = new Date();
    let options = {
        weekday: "long",
    };
    return today.toLocaleDateString("es-ES", options);
}