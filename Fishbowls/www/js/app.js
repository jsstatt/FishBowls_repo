// app.js

(function() {

  var app = angular.module('fishbowls', ['ionic', 'fishbowls.projectstore']);

  app.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider.state('home', {
      url: '/home',
      templateUrl: 'templates/home.html'
    });

    $stateProvider.state('add', {
      url: '/add',
      templateUrl: 'templates/add.html'
    });

    $urlRouterProvider.otherwise('/home');

  });


  app.controller("AddCtrl", function($scope, $state, ProjectStore) {

    $scope.reordering = false;

    $scope.project = {
        id: '',
        title: '',
        tasks: ["TASK 1", "TASK 2", "TASK 3"],
        useOnce: false
      };

    $scope.addTask = function () {
       $scope.project['tasks'].push($scope.addMe);
    };

    $scope.removeTask = function(x) {
      $scope.project['tasks'].splice(x,1);
    };

    $scope.move = function(task, fromIndex, toIndex) {
      $scope.project['tasks'].splice(fromIndex, 1);
      $scope.project['tasks'].splice(toIndex, 0, task);
    };

    $scope.toggleReordering = function() {
      $scope.reordering = !$scope.reordering;
    };

    $scope.save = function () {
      $scope.project.id = new Date().getTime().toString();
      $scope.project.title = $scope.projectName;
      $scope.project.useOnce = $scope.isChecked;
      ProjectStore.create($scope.project);
      $state.go('home');
    };

  });

  app.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      if(window.cordova && window.cordova.plugins.Keyboard) {

        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })

}());
