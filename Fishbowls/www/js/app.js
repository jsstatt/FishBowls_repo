// app.js

(function() {

  var app = angular.module('fishbowls', ['ionic', 'fishbowls.projectstore', 'ngCordova', 'rzModule']);



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

  app.controller("TodoCtrl", function($scope, ProjectStore, $ionicListDelegate, $interval) {

    $scope.todoList = ProjectStore.listTodo();
    var interval = '';

    $scope.removeTodoItem = function(projectId) {
      ProjectStore.removeTodoItem(projectId);
    };

    $scope.updateProject = function(project) {
      for (var i = 0; i < project.tasks.length; i++) {
        project.tasks[i].finished = false;
      }
      ProjectStore.updateTodo(project);
    }

    interval = $interval(function () {
        for (var i = 0; i < $scope.todoList.length; i++) {
          if ($scope.todoList[i].useOnce === true) {
            console.log($scope.todoList[i].todoActive);
              if ($scope.todoList[i].todoActive === false) {
                ProjectStore.remove($scope.todoList[i].id);
                ProjectStore.removeTodoItem($scope.todoList[i]);
              }
            }
          }
    }, 10);

  });


  app.controller("AddCtrl", function($scope, $state, ProjectStore) {

    $scope.settings = ProjectStore.listSettings();
    $scope.reordering = false;
    $scope.time = $scope.settings.StartingTimerNum;
    $scope.startingBlanks = $scope.settings.startingBlanks;
    $scope.deleteAfter = $scope.settings.deleteAfter;
    $scope.checkMisc = $scope.settings.playInOrder;
    $scope.boxState = 'add';
    $scope.boxButtonText = 'Add';
    $scope.taskInEdit = '';

    $scope.project = {
        id: '',
        title: '',
        tasks: [],
        useOnce: false,
        onTodo: false,
        active: false,
        todoActive: false,
        ordered: true
      };

    if ($scope.startingBlanks > 0) {
      for (var i = 0; i < $scope.startingBlanks; i++) {
        var task = new Object();
        task.title = 'Blank';
        task.time = $scope.time;
        task.finished = false;
        task.editing = '';

        $scope.project['tasks'].push(task);
      }
    }

    $scope.addTask = function () {
      if ($scope.boxState === 'add') {
        if ($scope.addMe !== null) {

          var task = new Object();
          task.title = $scope.addMe;
          task.time = $scope.time;
          task.finished = false;

          $scope.project['tasks'].push(task);
        }
        $scope.addMe = null;
      } else if ($scope.boxState === 'edit') {
        $scope.taskInEdit.title = $scope.addMe;
        $scope.taskInEdit.time = $scope.time;
        $scope.taskInEdit.editing = '';
        $scope.boxState = 'add';
        $scope.boxButtonText = 'Add'
        $scope.addMe = null;
      }

    };

    $scope.editTask = function(x) {
      $scope.boxState = 'edit';
      $scope.boxButtonText = 'Save Edit'
      $scope.addMe = x.title;
      $scope.time = x.time;
      $scope.taskInEdit = x;
      x.editing = 'highlight';
    }

    $scope.removeTask = function(x) {
      $scope.project['tasks'].splice(x,1);
    };

    $scope.move = function(task, fromIndex, toIndex) {
      $scope.project['tasks'].splice(fromIndex, 1);
      $scope.project['tasks'].splice(toIndex, 0, task);
      $scope.reordering = !$scope.reordering;
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
    $scope.boxState = 'add';
    $scope.boxButtonText = 'Add';
    $scope.taskInEdit = '';


    $scope.addTask = function () {
      if ($scope.boxState === 'add') {
        if ($scope.addMe !== null) {

          var task = new Object();
          task.title = $scope.addMe;
          task.time = $scope.time;
          task.finished = false;
          task.id =  new Date().getTime().toString();

          $scope.project['tasks'].push(task);
        }
        $scope.addMe = null;
      } else if ($scope.boxState === 'edit') {
        $scope.taskInEdit.title = $scope.addMe;
        $scope.taskInEdit.time = $scope.time;
        $scope.taskInEdit.editing = '';
        $scope.boxState = 'add';
        $scope.boxButtonText = 'Add'
        $scope.addMe = null;
      }

    };

    $scope.editTask = function(x) {
      $scope.boxState = 'edit';
      $scope.boxButtonText = 'Save Edit'
      $scope.addMe = x.title;
      $scope.time = x.time;
      $scope.taskInEdit = x;
      x.editing = 'highlight';
    }

    $scope.removeTask = function(x) {
      $scope.project['tasks'].splice(x,1);
    };

    $scope.move = function(task, fromIndex, toIndex) {
      $scope.project['tasks'].splice(fromIndex, 1);
      $scope.project['tasks'].splice(toIndex, 0, task);
      $scope.reordering = !$scope.reordering;
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
    $interval, $cordovaLocalNotification, $cordovaToast) {

    $scope.projects = ProjectStore.listTodo();
    $scope.allProjects = ProjectStore.list();
    $scope.settings = ProjectStore.listSettings();
    $scope.pjtTitle = 'Start';
    $scope.tskDescription = 'The forward button will complete the task. Click here or click the skip button to start';
    $scope.addTimer = $scope.settings.StartingTimerNum;
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
    $scope.sliderValue = .5;
    $scope.sliderMinutes = 0;
    $scope.sliderSeconds =  0;
    $scope.hideSlider = true;
    $scope.pastProjects = '';
    $scope.pastTasks = '';

    $scope.slider = {
      options: {
          floor: 0,
          ceil: 5,
          step: 0.01,
          precision: 1,
          showSelectionBar: true,
          readOnly: true,
          autoHideLimitLabels: true,
          enforceStep: true,
          translate: function(value) {
            return "";
          }
      }
  };

    $scope.refreshSlider = function () {
      $scope.$broadcast('rzSliderForceRender');
    };



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
                 task.id =  new Date().getTime().toString();


                 if ($scope.data.choice === 'this') {
                   if ($scope.selectedProject !== '') {
                     $scope.selectedProject['tasks'].push(task);
                   } else {
                     e.preventDefault();
                   }

                 } else if ($scope.data.choice === 'misc') {
                    for (var i = 0; i < $scope.allProjects.length; i++) {
                      if ($scope.allProjects[i].title === 'Miscellaneous') {
                        $scope.allProjects[i]['tasks'].push(task);
                      }
                    }
                    var length = $scope.allProjects.length;
                    if ($scope.allProjects[length-1].title !== 'Miscellaneous') {
                      var newProject = new Object();
                      newProject.id = new Date().getTime().toString();
                      newProject.title = 'Miscellaneous';
                      newProject.useOnce = true;
                      newProject.active = true;
                      newProject.todoActive = true;
                      newProject.ordered = true;
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
       $scope.hideSlider = false;
      if ($scope.pjtTitle === 'Start' || $scope.pjtTitle === 'All Finished') {
        $scope.skipTask();
      } else {
        $scope.selectedTask.finished = true;
        $scope.pastProjects = $scope.selectedProject;
        console.log("past task = "+$scope.pastProjects);
        $scope.pastTasks = $scope.selectedTask;

        if ($scope.selectedProject !== undefined) {
          if ($scope.selectedProject.ordered === true) {
            var last = $scope.selectedProject.tasks.length;
            if ($scope.selectedProject.tasks[last-1].finished === true) {
              $scope.selectedProject.active = false;
              $scope.selectedProject.todoActive = false;
              for (var i = 0; i < $scope.selectedProject.tasks.length; i++) {
                $scope.selectedProject.tasks[i].finished = false;
              }
              ProjectStore.updateTodo($scope.selectedProject);
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
            $scope.sliderValue = 0;
            $scope.slider.options.ceil = $scope.selectedTask.time;

            var last = $scope.selectedProject.tasks.length;

            if (filteredRandomFalse.length >= last) {
              $scope.selectedProject.active = false;
              $scope.selectedProject.todoActive = false;
              for (var i = 0; i < $scope.selectedProject.tasks.length; i++) {
                $scope.selectedProject.tasks[i].finished = false;
              }
              ProjectStore.updateTodo($scope.selectedProject);
            }
          }
        }
      }
    };

    $scope.skipTask = function () {
      $scope.hideSlider = false;
      $scope.restartTimer();
      var filtered = [];

      if ($scope.projects.length > 0) {

        for (var i = 0; i < $scope.projects.length; i++) {
          if ($scope.projects[i].active === true) {
            filtered.push($scope.projects[i]);
          }
        }
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
                  $scope.sliderValue = 0;
                  $scope.slider.options.ceil = $scope.selectedTask.time;

                  var last = $scope.selectedProject.tasks.length;

                  if ($scope.selectedProject.tasks[last-1].finished == true) {
                    $scope.selectedProject.active = false;
                    $scope.selectedProject.todoActive = false;
                    for (var i = 0; i < $scope.selectedProject.tasks.length; i++) {
                      $scope.selectedProject.tasks[i].finished = false;
                    }
                    ProjectStore.updateTodo($scope.selectedProject);
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
              $scope.sliderValue = 0;
              $scope.slider.options.ceil = $scope.selectedTask.time;

              var last = $scope.selectedProject.tasks.length;

              if (filteredRandomFalse.length >= last-1) {
                $scope.selectedProject.active = false;
                $scope.selectedProject.todoActive = false;
                for (var i = 0; i < $scope.selectedProject.tasks.length; i++) {
                  $scope.selectedProject.tasks[i].finished = false;
                }
                ProjectStore.updateTodo($scope.selectedProject);
              }
            }
          }
        } else if (filtered.length === 0) {
          $scope.hideSlider = true;
          $scope.pjtTitle = 'All Finished';
          $scope.tskDescription = 'Great Job! You are all finished for now';
        }
      }
    };

    $scope.undo = function() {
        console.log($scope.pastProjects + "first test after undo" );
      if ($scope.pastProjects === "") {
          window.plugins.toast.show('Cannot go back', 'short', 'bottom');
      } else if ($scope.pastProjects !== undefined) {
        console.log("back");
        console.log($scope.pastProjects + "Second test after check");
          for (var i = 0; i < $scope.pastProjects.tasks.length; i++) {
            if ($scope.pastProjects.tasks[i].id === $scope.pastTasks.id) {
              $scope.pastProjects.tasks[i].finished = false;
            }
          }
          ProjectStore.updateTodo($scope.pastProjects);

          $scope.selectedProject = $scope.pastProjects;
          $scope.selectedTask = $scope.pastTasks;
          $scope.tskDescription = $scope.pastTasks.title;
          $scope.pjtTitle = $scope.pastProjects.title;
          $scope.tskMax = $scope.pastTasks.time*60000;
          $scope.sliderValue = 0;
          $scope.slider.options.ceil = $scope.pastTasks.time;
      }
    };

    $scope.toggleTimer = function() {
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
          if ($scope.settings.sound === true) {
            cordova.plugins.notification.local.schedule({
              id: new Date().getTime().toString(),
              title: "fishbowls",
              text: "Alarm for " + $scope.tskDescription + " is complete",
              icon: "file://platform/android/res/drawable",
              sound: "file://audio/water_drop.mp3",
              smallIcon: "file://img/icon.png",
          });
          }
          $scope.minutes = $scope.tskMax;
        }
          $scope.sliderValue = ($scope.minutes/60000)+((($scope.seconds/1000) * (100/60))/100);
          $scope.refreshSlider();
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
