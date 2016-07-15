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

        $stateProvider.state('edit', {
          url: '/edit/:projectId',
          views: {
            'tab-projects': {
                templateUrl: 'templates/edit.html'
            }
          }

    });

    $urlRouterProvider.otherwise('/home');

  });

  app.controller("ListCtrl", function($scope, ProjectStore) {

    $scope.projects = ProjectStore.list();
    $scope.activeState = '';

    $scope.removeProject = function(projectId) {
        ProjectStore.remove(projectId);
    }

    $scope.toggleActive = function(projectId) {
        ProjectStore.toggleActive(projectId);
    },

    $scope.getActiveState = function(projectId, type) {
        return ProjectStore.getActive(projectId, type);
    }
  });


  app.controller("AddCtrl", function($scope, $state, ProjectStore) {

    $scope.reordering = false;

    $scope.project = {
        id: '',
        title: '',
        tasks: [],
        useOnce: false,
        active: false
      };

      $scope.time = 0;

    $scope.addTask = function () {
      if ($scope.addMe !== null) {

        var task = new Object();
        task.title = $scope.addMe;
        task.time = $scope.time;
        task.finished = false;

        $scope.project['tasks'].push(task);
      }
      $scope.addMe = null;
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


  app.controller("EditCtrl", function($scope, $state, ProjectStore) {

    $scope.project = angular.copy(ProjectStore.getProject($state.params.projectId));

    $scope.addTask = function () {
      if ($scope.addMe !== null) {
        $scope.project['tasks'].push($scope.addMe);
      }
      $scope.addMe = null;
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
      ProjectStore.updateProject($scope.project);
      $state.go('list');
    };

  });

  app.controller("HomeCtrl", function($scope, $state, ProjectStore) {

    $scope.projects = ProjectStore.list();
    $scope.seconds = 0;
    $scope.minutes = 0;
    $scope.max = 5;
    $scope.timeValue = $scope.minutes + $scope.seconds;
    $scope.title = 'Swipe For New Task';
    $scope.description = 'Swipe For New Task';




    $scope.swipe = function () {

      var selectedProject = $scope.projects[Math.floor(Math.random()*$scope.projects.length)];
      var selectedTask = selectedProject.tasks[Math.floor(Math.random()*selectedProject.tasks.length)];

      $scope.title = selectedProject.title;
      $scope.description = selectedTask.title;
      $scope.max = selectedTask.time;
      $scope.seconds = 0;
      $scope.minutes = 0;

    };

    $scope.startCounter = function() {
      var secs = 0;
      var mins = 0;

      var timerMinutes = setInterval(function(){
      if (mins < $scope.max) {
          mins++;
          $scope.minutes = mins;
      } else  if (mins >= $scope.max){
          mins = $scope.max
          $scope.minutes = $scope.max;
          secs = 0;
          $scope.seconds = .0;
          return;
      }
      $scope.$apply();
      }, 60000);

      var timerSeconds = setInterval(function(){
      if (mins < $scope.max){
        if (secs < 60) {
            secs++;
            $scope.seconds = secs * 0.01;
        } else {
            secs = 0;;
            $scope.seconds = 0;
            return;
        }
      }
      $scope.$apply();
      }, 1000);

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
