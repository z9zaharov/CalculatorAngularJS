var app = angular.module('app', ['ui.bootstrap']);

app.constant('Constants', {
    States: {
        operand1: 0,
        operation: 1,
        operand2: 2,
    },
    ButtonTypes: {
      control: 0,
      number: 1
    }
}); 

app.controller('CalculatorCtrl', ['$scope', 'Constants', function ($scope, Constants) {

  $scope.buttons = [
      [{label: 'CE', type: Constants.ButtonTypes.control }, {label: 'C', type: Constants.ButtonTypes.control }, {label: '<', type: Constants.ButtonTypes.control }, {label: '/', type: Constants.ButtonTypes.control }],
      [{label: '7', type: Constants.ButtonTypes.number }, {label: '8', type: Constants.ButtonTypes.number }, {label: '9', type: Constants.ButtonTypes.number }, {label: '*', type: Constants.ButtonTypes.control }],
      [{label: '4', type: Constants.ButtonTypes.number }, {label: '5', type: Constants.ButtonTypes.number }, {label: '6', type: Constants.ButtonTypes.number }, {label: '-', type: Constants.ButtonTypes.control }],
      [{label: '1', type: Constants.ButtonTypes.number }, {label: '2', type: Constants.ButtonTypes.number }, {label: '3', type: Constants.ButtonTypes.number }, {label: '+', type: Constants.ButtonTypes.control }],
      [{label: '+-', type: Constants.ButtonTypes.control }, {label: '0', type: Constants.ButtonTypes.number }, {label: '.', type: Constants.ButtonTypes.number }, {label: '=', type: Constants.ButtonTypes.control }]
  ];

  var clear = function() {
    $scope.result = 0;
    $scope.operationStr = '';

    $scope.operand1 = '';
    $scope.operand2 = '';
    $scope.operation = '';

    $scope.state = Constants.States.operand1;
  };
  clear();

  var calculate = function() {
      var str = $scope.operand1 + $scope.operation + $scope.operand2;
      return eval(str);
  };

  var processOperation = function(label, type) {
    switch (label) {
      case 'C':
        clear();
        break;
      case 'CE':
        if ($scope.state == Constants.States.operand1) {
          $scope.operand1 = '';
        }
        else if ($scope.state == Constants.States.operand2) {
          $scope.operand2 = '';
        }
        $scope.result = '0';
        break;
      case '<':
        if ($scope.state == Constants.States.operand1) {
          if ($scope.operand1 != '') {
            $scope.operand1 = $scope.operand1.slice(0, -1);
            $scope.result = ($scope.operand1 != '') ? $scope.operand1 : '0';
          }
        }
        else if ($scope.state == Constants.States.operand2) {
          if ($scope.operand2 != '') {
            $scope.operand2 = $scope.operand2.slice(0, -1);
            $scope.result = ($scope.operand2 != '') ? $scope.operand2 : '0';
          }
        }
        break;
      case '+-':
        var res = ($scope.state == Constants.States.operand1) ? $scope.operand1 : ($scope.state == Constants.States.operand2) ? $scope.operand2 : '';
        res = (res.indexOf('-') == -1) ? (res !== '' && res != '0') ? '-' + res : res : res.slice(1);
        if ($scope.state == Constants.States.operand1) {
          $scope.operand1 = res;
          $scope.result = (res !== '' && res != '0') ? $scope.operand1 : 0;
        }
        else if ($scope.state == Constants.States.operand2) {
          $scope.operand2 = res;
          $scope.result = (res !== '' && res != '0') ? $scope.operand2 : 0;
        }        
        break;
      case '\/':
      case '-':
      case '+':
      case '*':
        if ($scope.state == Constants.States.operand1) {
          $scope.state = Constants.States.operation;
          $scope.operation = label;
        }
        else if ($scope.state == Constants.States.operand2) {
          var result = calculate();
          $scope.operand1 = result.toString();
          $scope.operation = label;
        }
        break;
      case '=':
        if ($scope.state == Constants.States.operation) {
          $scope.operand2 = $scope.operand1;
        }
        $scope.result = calculate().toString();
        $scope.operand1 = $scope.result;
        $scope.operand2 = '';
        $scope.operation = '';
        $scope.state = Constants.States.operand1;
        break;
      default:
        break;
    }
  };

  var createOperand = function(label) {
    if ($scope.state == Constants.States.operand1) {
      $scope.operand1 = ($scope.operand1 == '0' && label != '0') ? '' : $scope.operand1;
      $scope.operand1 += ($scope.operand1 == '' && label == '.') ? '0.' : ($scope.operand1 == '0' && label == '0') ? '' : label;
      $scope.result = $scope.operand1;
    }
    else if ($scope.state == Constants.States.operation) {
      $scope.state = Constants.States.operand2;
      $scope.operand2 = ($scope.operand2 == '0' && label != '0') ? '' : $scope.operand2;
      $scope.operand2 += ($scope.operand2 == '' && label == '.') ? '0.' : ($scope.operand2 == '0' && label == '0') ? '' : label;
      $scope.result = $scope.operand2;      
    }
    else if ($scope.state == Constants.States.operand2) {
      $scope.operand2 = ($scope.operand2 == '0' && label != '0') ? '' : $scope.operand2;
      $scope.operand2 +=  ($scope.operand2 == '' && label == '.') ? '0.' : ($scope.operand2 == '0' && label == '0') ? '' : label;
      $scope.result = $scope.operand2;
    }
  }

  $scope.click = function(label, type) {
    switch (type) {
      case Constants.ButtonTypes.control:
        processOperation(label, type);
      break;
      case Constants.ButtonTypes.number:
        createOperand(label);
      break;
      default:
      break;
    }

    $scope.operationStr = $scope.operand1 + $scope.operation + $scope.operand2;
  }

}]);

app.directive('calcButton', function() {
  return {
    restrict: 'E',
    replace: 'true',
    scope: {
      type: '@',
      label: '@',
      click: '&'
    },
    template: '<span class="col-xs-3"><button type="button" class="btn btn-block" ng-class="{\'btn-warning\': type == \'0\', \'btn-default\': type == \'1\' }" ng-click="clickButton()">{{label}}</button></span>',
    controller: function ($scope) {
            $scope.clickButton = function () {
                $scope.click()($scope.label, parseInt($scope.type));
            };
        }
  }; 
});
