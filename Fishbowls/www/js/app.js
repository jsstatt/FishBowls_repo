// app.js

(function() {

  var app = angular.module('fishbowls', ['ionic', 'fishbowls.projectstore', 'ngCordova']);



  app.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider.state('home', {
      url: '/home',
      views: {
        'tab-home': {
          templateUrl: 'templates/home.html'
        }
      }
    });

    $stateProvider.state('settings', {
      url: '/settings',
      views: {
        'tab-home': {
          templateUrl: 'templates/settings.html'
        }
      }
    });

    $stateProvider.state('todo', {
      url: '/todo',
      views: {
        'tab-todo': {
          templateUrl: 'templates/todo.html'
        }
      }
    });

    $stateProvider.state('addtodo', {
      url: '/addtodo',
      views: {
        'tab-todo': {
          templateUrl: 'templates/addtodo.html'
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

  app.controller("ListCtrl", function($scope, $state, ProjectStore) {

    $scope.projects = ProjectStore.list();
    $scope.hideCheckboxes = true;
    $scope.hideItem = false;

    $scope.showCheckboxes = function() {
      $scope.hideCheckboxes = false;
      $scope.hideItem = true;
    };

    $scope.closeCheckboxes = function() {
      $scope.hideCheckboxes = true;
      $scope.hideItem = false;
    };



    $scope.addTodoItems = function() {
      var filtered = [];
      for (var i = 0; i < $scope.projects.length; i++) {
        if ($scope.projects[i].onTodo === true) {
          filtered.push($scope.projects[i]);
          $scope.projects[i].onTodo = false;
        }
      }
      ProjectStore.addTodoItems(filtered);
      $state.go('todo');
    };

    $scope.deleteCheckItems = function() {
      var filtered = [];
      for (var i = 0; i < $scope.projects.length; i++) {
        if ($scope.projects[i].onTodo === true) {
          filtered.push($scope.projects[i]);
        }
      }
      ProjectStore.removeProjects(filtered);
    };

  });

  app.controller("AddTodoCtrl", function($scope, $state, ProjectStore) {

    $scope.projects = ProjectStore.list();

    $scope.addTodoItems = function() {
      var filtered = [];
      for (var i = 0; i < $scope.projects.length; i++) {
        if ($scope.projects[i].onTodo === true) {
          filtered.push($scope.projects[i]);
          $scope.projects[i].onTodo = false;
        }
      }
      ProjectStore.addTodoItems(filtered);
      $state.go('todo');
    };
  });

  app.controller("TodoCtrl", function($scope, ProjectStore, $ionicListDelegate) {

    $scope.todoList = ProjectStore.listTodo();

    $scope.removeTodoItem = function(projectId) {
      ProjectStore.removeTodoItem(projectId);
    };

    $scope.updateProject = function(project) {
      for (var i = 0; i < project.tasks.length; i++) {
        project.tasks[i].finished = false;
      }
      ProjectStore.updateTodo(project);
    }



  });


  app.controller("AddCtrl", function($scope, $state, ProjectStore) {

    $scope.settings = ProjectStore.listSettings();
    $scope.reordering = false;
    $scope.time = 0;
    $scope.deleteAfter = $scope.settings.deleteAfter;
    $scope.checkMisc = $scope.settings.playInOrder;


    $scope.project = {
        id: '',
        title: '',
        tasks: [],
        useOnce: false,
        onTodo: false,
        active: false,
        ordered: true
      };

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
      $scope.project.useOnce = $scope.deleteAfter;
      $scope.project.active = true;
      $scope.project.onTodo = false;
      $scope.project.ordered = $scope.checkMisc;
      ProjectStore.create($scope.project);
      $state.go('list');
    };

  });


  app.controller("EditCtrl", function($scope, $state, ProjectStore) {

    $scope.project = angular.copy(ProjectStore.getProject($state.params.projectId));
    $scope.settings = ProjectStore.listSettings();
    $scope.addMe = '';
    $scope.time = '';


    $scope.addTask = function () {
      if ($scope.addMe !== '') {

        var task = new Object();
        task.title = $scope.addMe;
        task.time = $scope.time;
        task.finished = false;

        $scope.project['tasks'].push(task);
      }
      $scope.addMe = '';
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


  app.controller("SettingsCtrl", function($scope, $state, ProjectStore) {

    $scope.settings = ProjectStore.listSettings();

    $scope.save = function() {
      ProjectStore.updateSettings($scope.settings);
      $state.go('home');
    };

  });


  app.controller("HomeCtrl", function($scope, $state, ProjectStore, $ionicPopup,
    $interval, $cordovaVibration) {

    $scope.projects = ProjectStore.listTodo();
    $scope.settings = ProjectStore.listSettings();
    $scope.pjtTitle = 'Start';
    $scope.tskDescription = 'The forward button will complete the task. Click here or click the skip button to start';
    $scope.time = 0;
    $scope.seconds = 0;
    $scope.minutes = 0;
    $scope.tskMax = 5 * 60000;
    $scope.lastOne = 0;
    $scope.lockIcon = 'ion-unlocked';
    $scope.lockProject = false;
    $scope.hideNew = true;
    $scope.selectedProject = '';
    $scope.slectedTask = [];
    var stop;




    $scope.toggleLock = function() {
      if ($scope.lockIcon === 'ion-unlocked') {
        $scope.lockIcon = 'ion-locked';
        $scope.lockProject = true;
      } else {
        $scope.lockIcon = 'ion-unlocked';
        $scope.lockProject = false;
      }
    }

    $scope.toggleNewHide = function() {
      $scope.hideNew = !$scope.hideNew;
    }

    $scope.addNewTask = function() {
      $scope.data = {}
      var newTask = $ionicPopup.show({
        title: 'Add New Task',
        templateUrl: 'templates/newtaskpopup.html',
        scope: $scope,
        buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
           text: 'Cancel',
           type: 'button-default',
           onTap: function(e) {
             // e.preventDefault() will stop the popup from closing when tapped.

           }
         }, {
           text: 'OK',
           type: 'button-positive',
           onTap: function(e) {
             // Returning a value will cause the promise to resolve with the given value.

               if ($scope.data.addMe !== null) {

                 var task = new Object();
                 task.title = $scope.data.addMe;
                 task.time = $scope.data.time;
                 task.finished = false;


                 if ($scope.data.choice === 'this') {
                   if ($scope.selectedProject !== '') {
                     $scope.selectedProject['tasks'].push(task);
                   } else {
                     e.preventDefault();
                   }

                 } else if ($scope.data.choice === 'misc') {
                    for (var i = 0; i < $scope.projects.length; i++) {
                      if ($scope.projects[i].title === 'Miscellaneous') {
                        $scope.projects[i]['tasks'].push(task);
                      }
                    }
                    var length = $scope.projects.length;
                    if ($scope.projects[length-1].title !== 'Miscellaneous') {
                      var newProject = new Object();
                      newProject.id = new Date().getTime().toString();
                      newProject.title = 'Miscellaneous';
                      newProject.useOnce = true;
                      newProject.active = true;
                      newProject.ordered = false;
                      newProject.onTodo = false;
                      newProject.tasks = [];
                      newProject.tasks.push(task);
                      ProjectStore.create(newProject);
                      var project = [];
                      project.push(newProject);
                      ProjectStore.addTodoItems(project);
                    }
                 }
               }
           }
         }]
      })
    }


    $scope.getTimericon = function() {
      if (stop === undefined) {
        return 'ion-play';
      } else {
        return 'ion-pause';
      }
    };

    $scope.finish = function() {
      if ($scope.pjtTitle === 'Start' || $scope.pjtTitle === 'All Finished') {
        $scope.skipTask();
      } else {
        $scope.selectedTask.finished = true;
        if ($scope.selectedProject !== undefined) {
          if ($scope.selectedProject.ordered === true) {
            var last = $scope.selectedProject.tasks.length;
            if ($scope.selectedProject.tasks[last-1].finished === true) {
              $scope.selectedProject.active = false;
              for (var i = 0; i < $scope.selectedProject.tasks.length; i++) {
                $scope.selectedProject.tasks[i].finished = false;
              }
              ProjectStore.updateTodo($scope.selectedProject);

              if ($scope.selectedProject.useOnce === true) {
                ProjectStore.remove($scope.selectedProject);
                ProjectStore.removeTodoItem($scope.selectedProject);
              }
            }
          } else if ($scope.selectedProject.ordered === false) {
            var filteredRandom = [];
            var filteredRandomFalse = [];

            for (var i = 0; i < $scope.selectedProject.tasks.length; i++) {
              if ($scope.selectedProject.tasks[i].finished === false) {
                filteredRandom.push($scope.selectedProject.tasks[i]);
              } else {
                filteredRandomFalse.push($scope.selectedProject.tasks[i]);
              }
            }
            $scope.selectedTask = filteredRandom[Math.floor(Math.random()*filteredRandom.length)];

            $scope.tskDescription = $scope.selectedTask.title;
            $scope.tskMax = $scope.selectedTask.time*60000;
            var last = $scope.selectedProject.tasks.length;

            if (filteredRandomFalse.length >= last-1) {
              $scope.selectedProject.active = false;
              for (var i = 0; i < $scope.selectedProject.tasks.length; i++) {
                $scope.selectedProject.tasks[i].finished = false;
              }
              ProjectStore.updateTodo($scope.selectedProject);
              if ($scope.selectedProject.useOnce === true) {
                ProjectStore.remove($scope.selectedProject);
                ProjectStore.removeTodoItem($scope.selectedProject);
              }
            }
          }
        }
      }
    };

    $scope.skipTask = function () {
      $scope.restartTimer();
      var filtered = [];

      if ($scope.projects.length > 0) {

        for (var i = 0; i < $scope.projects.length; i++) {
          if ($scope.projects[i].active === true) {
            filtered.push($scope.projects[i]);
          }
        }
        console.log(filtered.length);
        if (filtered.length > 0) {
          if ($scope.lockProject === false) {
            $scope.selectedProject = filtered[Math.floor(Math.random()*filtered.length)];
            $scope.pjtTitle = $scope.selectedProject.title;
          } else {
            if ($scope.selectedProject === '') {
              $scope.selectedProject = filtered[0];
              $scope.pjtTitle = $scope.selectedProject.title;
            } else {
              if ($scope.selectedProject.tasks[$scope.selectedProject.tasks.length-1].finished === false) {
                $scope.selectedProject = $scope.selectedProject;
                $scope.pjtTitle = $scope.selectedProject.title;
              } else {
                $scope.selectedProject = filtered[0];
                $scope.pjtTitle = $scope.selectedProject.title;
              }
            }
          }
          if ($scope.selectedProject.tasks.length > 0){

            if ($scope.selectedProject.ordered === true) {

              for (var i = 0; i < $scope.selectedProject.tasks.length; i++) {
                if ($scope.selectedProject.tasks[i].finished === false) {
                  $scope.selectedTask = $scope.selectedProject.tasks[i];
                  $scope.tskDescription = $scope.selectedTask.title;
                  $scope.tskMax = $scope.selectedTask.time*60000;
                  var last = $scope.selectedProject.tasks.length;

                  if ($scope.selectedProject.tasks[last-1].finished == true) {
                    $scope.selectedProject.active = false;
                    for (var i = 0; i < $scope.selectedProject.tasks.length; i++) {
                      $scope.selectedProject.tasks[i].finished = false;
                    }
                    ProjectStore.updateTodo($scope.selectedProject);
                    if ($scope.selectedProject.useOnce === true) {
                      ProjectStore.remove($scope.selectedProject);
                      ProjectStore.removeTodoItem($scope.selectedProject);
                    }
                  }
                  return;
                }
              }
            } else if ($scope.selectedProject.ordered === false) {
              var filteredRandom = [];
              var filteredRandomFalse = [];

              for (var i = 0; i < $scope.selectedProject.tasks.length; i++) {
                if ($scope.selectedProject.tasks[i].finished === false) {
                  filteredRandom.push($scope.selectedProject.tasks[i]);
                } else {
                  filteredRandomFalse.push($scope.selectedProject.tasks[i]);
                }
              }
              $scope.selectedTask = filteredRandom[Math.floor(Math.random()*filteredRandom.length)];

              $scope.tskDescription = $scope.selectedTask.title;
              $scope.tskMax = $scope.selectedTask.time*60000;
              var last = $scope.selectedProject.tasks.length;

              if (filteredRandomFalse.length >= last-1) {
                $scope.selectedProject.active = false;
                for (var i = 0; i < $scope.selectedProject.tasks.length; i++) {
                  $scope.selectedProject.tasks[i].finished = false;
                }
                ProjectStore.updateTodo($scope.selectedProject);
                if ($scope.selectedProject.useOnce === true) {
                  ProjectStore.remove($scope.selectedProject);
                  ProjectStore.removeTodoItem($scope.selectedProject);
                }
              }
            }
          }
        } else if (filtered.length === 0) {
          console.log('is 0');
          $scope.pjtTitle = 'All Finished';
          $scope.tskDescription = 'Great Job! You are all finished for now';
        }
      }
    };



    $scope.toggleTimer = function() {
      $scope.play('drop');
      if (stop === undefined) {
        $scope.startTimer();
      } else {
        $scope.stopTimer();
      }
    };

    $scope.startTimer = function() {

      if (angular.isDefined(stop)) {
        return;
      }

      stop = $interval(function () {
          $scope.seconds += 1000;
          if ($scope.seconds === 60000) {
            $scope.minutes += 60000;
            $scope.seconds = 0;
          }
        if ($scope.minutes === $scope.tskMax){
          $scope.stopTimer();
          $scope.timerPopup();
          if ($scope.settings.vibrate === true) {
            $cordovaVibration.vibrate(400);
          }
          if ($scope.settings.sound === true) {
          }
          $scope.minutes = $scope.tskMax;
        }
      }, 1000);
    };

    $scope.stopTimer = function() {
      if (angular.isDefined(stop)) {
        $interval.cancel(stop);
        stop = undefined;
      }
    };

    $scope.restartTimer = function() {
      $scope.stopTimer();
      $scope.seconds = 0;
      $scope.minutes = 0;
    };

    $scope.$on('$destroy',  function() {
      $scope.stopTimer();
    });


    $scope.timerPopup = function() {
      $scope.data = {}
      var askComplete = $ionicPopup.show({
        title: 'Alarm',
        scope: $scope,
        buttons: [{
           text: 'Need More Time',
           type: 'button-dark',
           onTap: function(e) {
             $scope.restartTimer();
           }
         }, {
           text: 'Finished',
           type: 'button-positive',
           onTap: function(e) {
             // Close and continue to the next task
             $scope.finish();
             $scope.skipTask();
           }
         }]
      })
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

  });

}());
