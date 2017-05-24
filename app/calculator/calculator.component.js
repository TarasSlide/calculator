'use strict';

// Register `calculator` component, along with its associated controller and template

angular.module('calculator').component('calculator', {
    templateUrl: '/app/calculator/calculator.template.html',
    controller: ['$http', function CalculatorController($http) {

        var self = this;

        $http.get('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5').then(function (response) {
            self.rates = response.data;
            self.rates.push({ccy: 'UAH', buy: '1', sale: '1'});
            self.rates.forEach(function (item) {
                localStorage.setItem(item.ccy, item.buy);
            });
        });

        // return @string expression with converted currency numbers
        self.convertCurrExpression = function (expression, curr) {

            var arr = expression.trim().split(' ');

            var convertedArr = arr.map(function (item) {
                if (item == '+' || item == '-' || item == '/' || item == '*') {
                    return item;
                } else if (item == '=') {
                    return '';
                } else {
                    return parseFloat(item) / parseFloat(curr);
                }
            });

            if (isNaN(convertedArr[convertedArr.length - 1])) {
                convertedArr.pop();
                return convertedArr.join(' ')
            } else {
                return convertedArr.join(' ')
            }

        };

        var operationPressed = false;
        var resultPressed = false;

        self.expression = '';
        self.result = '0';
        self.currMod = 'UAH';

        self.convert = function (currencyFrom, currencyTo, num) {
            return num * (localStorage.getItem(currencyFrom) / localStorage.getItem(currencyTo));
        };
        self.updateCurrentCurrency = function (currency) {
            self.result = self.expression = self.convert(self.currMod, currency, self.result);
            self.currMod = currency;
        };

        self.digit = function (num) {
            if (self.result === '0' || operationPressed) {
                self.result = num;
                self.expression += self.result;
            } else if (resultPressed) {
                self.result = num;
                self.expression = self.result;
            } else {
                self.result += num;
                self.expression += num;
            }

            operationPressed = false;
            resultPressed = false;
        };

        self.clear = function () {
            self.result = '0';
            self.expression = '';
            operationPressed = false;
            resultPressed = false;
        };

        self.operate = function (operand) {
            if (operationPressed) {
                return;
            } else if (resultPressed) {
                self.expression = self.result + ' ' + operand + ' ';
                resultPressed = false;
            } else {
                self.expression += ' ' + operand + ' ';
            }
            operationPressed = true;
        };

        // add keyup event for type from keyboard
        angular.element(document).on('keyup', function (e) {
            var appElement = document.querySelector('[ng-app=calculatorApp]');
            var $scope = angular.element(appElement).scope();
            $scope.$apply(function () {
                if (e.key == '+' || e.key == '-' || e.key == '/' || e.key == '*') {
                    self.operate(e.key);
                } else if (!isNaN(e.key) || e.key == '.') {
                    self.digit(e.key);
                } else if (e.key == 'Enter' || e.key == '=') {
                    if (self.expression == '') return;
                    self.calcResult();
                }
            });
        });

        self.calcResult = function () {

            if (self.result == '0' && self.expression == '' || self.expression.search('=') != '-1') return;
            self.result = eval(self.expression);
            self.expression += ' = ';

            resultPressed = true;
        };

        self.getResult = function (expression) {
            return eval(expression);
        };

        self.memoryArray = [];

        self.memoryStore = function () {
            if (!self.expression) return;
            self.memoryArray.unshift(+self.result);
            resultPressed = true;
        };

        self.memoryAdd = function () {
            if (!self.expression) return;
            if (self.memoryArray.length == 0) {
                self.memoryArray.unshift(+self.result);
                resultPressed = true;
            } else {
                if (self.memoryArray.length > 1) {
                    var lastElem = self.memoryArray[self.memoryArray.length - 1];
                    self.memoryArray[self.memoryArray.length - 1] += +self.result
                } else {
                    self.memoryArray[0] += +self.result;
                }
            }
        };

        self.memorySubtract = function () {
            if (!self.expression) return;
            if (self.memoryArray.length == 0) {
                self.memoryArray.unshift(+self.result);
                resultPressed = true;
            } else {
                if (self.memoryArray.length > 1) {
                    var lastElem = self.memoryArray[self.memoryArray.length - 1];
                    self.memoryArray[self.memoryArray.length - 1] -= +self.result
                } else {
                    self.memoryArray[0] -= +self.result;
                }
            }
        };

        self.memoryRecall = function () {
            if (!self.expression || self.memoryArray.length == 0) return;
            self.result = self.memoryArray[self.memoryArray.length - 1];
        };

        self.memoryClear = function () {
            self.memoryArray = [];
        };

        // memory item
        self.memoryClearItem = function (i, array) {
            array.splice(i, 1);
        };

        self.addToMemoryItem = function (i, array, result) {
            array[i] += result;
        };

        self.subtractToMemoryItem = function (i, array, result) {
            array[i] -= result;
        };
    }]
});
