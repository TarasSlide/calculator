angular.module('roundNumbers', [])

.filter('roundNumber', [function () {
    return function (num) {
        return num.slice(0, 5);
    };
}]);
