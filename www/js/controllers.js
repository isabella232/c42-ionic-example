angular.module('c42-ionic.controllers', [])

.controller('HomeCtrl', ['$scope', 'config', 'local_settings', 'c42Api', function($scope,config, local_settings, c42Api) {
  $scope.mapCongig = config.initialConfig.mapDefaults;
  // When the C42API is loaded we recover the events and apply to the scope
  c42Api.onReady(function(){
    c42Api.getEvents(function(resp){
      resp = JSON.parse(resp);
      $scope.$apply(function () {
          $scope.events = resp.data;
      });
    });
  });
  //
}])

.controller('InterestsCtrl', function($scope, c42Api) {
  $scope.calendars = [];
  c42Api.getCalendars(function(resp){
    resp = JSON.parse(resp);
    $scope.$apply(function () {
      console.log(resp.data);
      $scope.calendars = resp.data;
    });
  });

})

.controller('EventDetailCtrl', ['$scope', '$stateParams', 'c42Api', function($scope, $stateParams, c42Api) {
  $scope.mapOptions ={disableDefaultUI:true, tilt:45};
  var setScope = function () {
    c42Api.getEventById($stateParams.eventId, function (resp) {
      resp = JSON.parse(resp);
      $scope.$apply(function () {
        console.log(resp.data);
        $scope.event = resp.data[0];
      });
    });
  };
  // @edmon: I would like to have this function to work when I visit the page directly AND when from the app
  // Now I need to do this workaround
  try {
    setScope();
  } catch(e) {
    c42Api.onReady(function(){
      setScope();
    });
  }
}])

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
