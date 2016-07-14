angular.module('fishbowls.projectstore', [])

.factory('ProjectStore', function() {

  var projectArray = angular.fromJson(window.localStorage['projectArray'] || '[]');

  function persist() {
    window.localStorage['projectArray'] = angular.toJson(projectArray);
  }


  return {


    create: function(pjt) {
      projectArray.push(pjt);
      console.log(projectArray);
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

    toggleActive: function(projectId) {
      for (var i = 0; i < projectArray.length; i++) {
        if (projectArray[i].id === projectId) {
          projectArray[i].active = !projectArray[i].active;
          persist();
          return;
        }
      }
    },

    getActive: function(projectId, type) {
      for (var i = 0; i < projectArray.length; i++) {
        if (projectArray[i].id === projectId) {
          if (projectArray[i].active === true) {
            if (type == 'text') {
              return 'Deactivate';
            }
            if (type == 'icon') {
              return 'ion-play';
            }
          } else {
            if (type == 'text') {
              return 'Activate';
            }
            if (type == 'icon') {
              return 'ion-pause';
            }
          }
        }
      }
    }

  };

});
