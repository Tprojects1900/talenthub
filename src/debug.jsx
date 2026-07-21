window.onerror = function (message, source, lineno, colno, error) {
    document.body.innerHTML =
        "<h2 style='color:red'>JavaScript Error</h2>" +
        "<pre>" +
        "Message : " + message + "\n\n" +
        "Source : " + source + "\n" +
        "Line : " + lineno + "\n" +
        "Column : " + colno + "\n\n" +
        (error && error.stack ? error.stack : "") +
        "</pre>";

    return true;
};

window.onunhandledrejection = function (event) {
    document.body.innerHTML =
        "<h2 style='color:red'>Unhandled Promise Rejection</h2>" +
        "<pre>" +
        event.reason +
        "</pre>";
};