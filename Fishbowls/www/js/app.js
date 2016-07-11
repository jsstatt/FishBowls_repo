// app.js

(function() {

  var app = angular.module('fishbowls', ['ionic', 'fishbowls.projectstore']);

  app.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider.state('home', {
      url: '/home',
      views: {
        'tab-home': {
          templateUrl: 'templates/home.html'
        }
      }
    });

    $stateProvider.state('list', {
      url: '/list',
      views: {
        'tab-projects': {
            templateUrl: 'templates/list.html'
        }
      }
    });

    $stateProvider.state('add', {
      url: '/add',
      views: {
        'tab-projects': {
            templateUrl: 'templates/add.html'
        }
      }
    });

    $urlRouterProvider.otherwise('/home');

  });

  app.controller("ListCtrl", function($scope, ProjectStore) {

    $scope.projects = ProjectStore.list();

    $scope.setActive = function(x) {
      for (var i = 0; i < projects.length(); i++) {
        if (projects[i] === x) {
          if (projects[i].active === true) {
              projects[i].active = false;
          } else {
              projects[i].active = true;
          }
        }
      }
    };

    $scope.getIcon = function(x) {
      for (var i = 0; i < projects.length(); i++) {
        if (projects[i] === x) {
            if (projects[i].active === true) {
              return 'ion-play';
            } else {
              return 'ion-pause';
            }
        }
      }
    };

  });


  app.controller("AddCtrl", function($scope, $state, ProjectStore) {

    $scope.reordering = false;

    $scope.project = {
        id: '',
        title: '',
        tasks: [],
        useOnce: false,
        active: false,
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
      $scope.project.active = true;
      ProjectStore.create($scope.project);
      $state.go('list');
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
