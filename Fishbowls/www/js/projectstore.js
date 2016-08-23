angular.module('fishbowls.projectstore', [])

.factory('ProjectStore', function() {

  var projectArray = angular.fromJson(window.localStorage['projectArray'] || '[]');

  function persist() {
    window.localStorage['projectArray'] = angular.toJson(projectArray);
  }

  var todoArray = angular.fromJson(window.localStorage['todoArray'] || '[]');

  function persistTodo() {
    window.localStorage['todoArray'] = angular.toJson(todoArray);
  }

  var settings = {
    maxSlider: 30,
    deleteAfter: false,
    playInOrder: true,
    vibrate: true,
    sound: false
  }

  if (JSON.parse(localStorage.getItem('settingsStorage')) === null) {
    localStorage.setItem('settingsStorage', JSON.stringify(settings));
  }


  settingsObject =  JSON.parse(localStorage.getItem('settingsStorage'));

  function persistSettings(set) {
    console.log(set);
    localStorage.setItem('settingsStorage', JSON.stringify(set));
  }



  return {

    create: function(project) {
      projectArray.push(project);
      persist();
    },

    list: function() {
      return projectArray;
    },

    getProject: function(projectId) {
      for (var i = 0; i < projectArray.length; i++) {
        if (projectArray[i].id === projectId) {
          return projectArray[i];
        }
      }
      return undefined;
    },

    updateProject: function(project) {
      for (var i = 0; i < projectArray.length; i++) {
        if (projectArray[i].id === project.id) {
          projectArray[i] = project;
          persist();
          return;
        }
      }
    },

    remove: function(projectId) {
      for (var i = 0; i < projectArray.length; i++) {
        if (projectArray[i].id === projectId) {
          projectArray.splice(i, 1);
          persist();
          return;
        }
      }
    },

    removeProjects: function(projects) {
      for (var i = 0; i < projects.length; i++) {
        for (var j = 0; j < projectArray.length; j++) {
          if (projects[i].id === projectArray[j].id) {
            projectArray.splice(j,1);
          }
        }
      }
      persist();
    },

    toggleActive: function(projectId) {
      for (var i = 0; i < projectArray.length; i++) {
        if (projectArray[i].id === projectId) {
          if (projectArray[i].active === false) {
              projectArray[i].active = true;
          } else {
              projectArray[i].active = false;
          }
          persist();
          return;
        }
      }
    },


    addTodoItems: function(projects) {
      for (var i = 0; i < projects.length; i++) {
        projects[i].active = true;
        todoArray.push(projects[i]);
        persistTodo();
      }
    },

    listTodo: function() {
      return todoArray;
    },

    updateTodo: function(project) {
      for (var i = 0; i < todoArray.length; i++) {
        if (todoArray[i].id === project.id) {
          todoArray[i] = project;
          persistTodo();
          return;
        }
      }
    },

    removeTodoItem: function(project) {
      for (var i = 0; i < todoArray.length; i++) {
        if (todoArray[i].id === project.id) {
          todoArray[i].onTodo = false;
          todoArray[i].active = false;
          todoArray.splice(i,1);
          persistTodo();
        }
      }
    },

    listSettings: function() {
      return settingsObject;
    },

    updateSettings: function(clsSetting) {
      persistSettings(clsSetting);
    }

  };

});
