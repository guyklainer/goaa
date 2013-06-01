"use strict";

app.filter('celTemp', function() {
    return function(number) {
        return number + "°C";
    }
});