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
    $scope.moreOption = true;
    $scope.moreTagText = 'More...';

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

    $scope.toggleMoreOptions = function() {
      $scope.moreOption = !$scope.moreOption;
    };

    $scope.getMoreTagText = function(){
      if ($scope.moreOption === true) {
        return 'Show More';
      } else {
        return 'Show Less';
      }
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
      ProjectStore.updateProject($scope.project);
      $state.go('list');
    };

  });

  app.controller("HomeCtrl", function($scope, $state, ProjectStore) {

    $scope.projects = ProjectStore.list();
    $scope.pjtTitle = 'Swipe For New Task';
    $scope.tskDescription = 'Swipe For New Task';
    $scope.time = 0;
    $scope.seconds = 0;
    $scope.minutes = 0;
    $scope.tskMax = 5 * 60000;
    $scope.timerRunning = true;
    $scope.lastOne = 0;


    $scope.getTimericon = function() {
      if ($scope.timerGoing === 0) {
        return 'ion-play';
      } else {
        return 'ion-pause';
      }
    }

    $scope.swipe = function () {

      var filtered = [];
      var selectedProject = '';
      var selectedTask = '';

      if ($scope.projects.length > 0) {

        for (var i = 0; i < $scope.projects.length; i++) {
          if ($scope.projects[i].active === true) {
            filtered.push($scope.projects[i]);
          }
        }

        if (filtered.length > 0) {
          selectedProject = filtered[Math.floor(Math.random()*filtered.length)];
          $scope.pjtTitle = selectedProject.title;

          if (selectedProject.tasks.length > 0){
            for (var i = 0; i < selectedProject.tasks.length; i++) {
              if (selectedProject.tasks[i].finished === false) {
                selectedTask = selectedProject.tasks[i];
                $scope.tskDescription = selectedTask.title;
                $scope.tskMax = selectedTask.time*60000;
                selectedProject.tasks[i].finished = true;
                var last = selectedProject.tasks.length;

                if (selectedProject.tasks[last-1].finished == true) {
                  selectedProject.active = false;
                  if (selectedProject.useOnce === true) {
                    ProjectStore.remove(selectedProject.id);
                  }
                }

                return;
              }
            }
          }



          $scope.seconds = 0;
          $scope.minutes = 0;
          $scope.toggleTimer = 0;
        } else if (filtered == 0) {
          $scope.pjtTitle = 'All Finished';
          $scope.tskDescription = 'Great Job! You are all finished for now';
        }
      }
    };



      $scope.startTimer = function (){
          $scope.$broadcast('timer-start');
          $scope.timerRunning = true;
      };

      $scope.stopTimer = function (){
          $scope.$broadcast('timer-stop');
          $scope.timerRunning = false;
      };

      $scope.$on('timer-stopped', function (event, data){
          console.log('Timer Stopped - data = ', data);
      });




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
