angular.module('reverse', [])

.filter('reverse', [function () {
    return function (array) {
        return array.slice().reverse();
    };
}]);
