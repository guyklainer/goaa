"use strict";

app.factory('contextService', [function(){

    var group = { val: null },
        groups = { val: null };

    // Public API here
    return {
        group: group,
        groups: groups
    };
}]);
