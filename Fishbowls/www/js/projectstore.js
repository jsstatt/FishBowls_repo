angular.module('fishbowls.projectstore', [])

.factory('ProjectStore', function() {

var projectArray = [];

 /*
  var projectArray = angular.fromJson(window.localStorage['projectArray'] || '[]');

  function persist() {
    window.localStorage['projectArray'] = angular.toJson(projectArray);
  }
  */

  return {

    create: function(pjt) {
      projectArray.push(pjt);
      console.log(projectArray);
      //persist();
    }

  };

});
