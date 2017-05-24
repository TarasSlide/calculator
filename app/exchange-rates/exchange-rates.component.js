'use strict';

function ExchangeRatesController() {

}

// Register `exchangeRates` component, along with its associated controller and template
angular.module('exchangeRates').component('exchangeRates', {
    templateUrl: 'app/exchange-rates/exchange-rates.template.html',
    controller: ExchangeRatesController,
    bindings: {
        exchangeRatesData: '='
    }
});
