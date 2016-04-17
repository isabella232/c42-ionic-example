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
  $scope.data = {
    badgeCount : 1
  };
  var setScope = function () {
    c42Api.getCalendars(function(resp){
      resp = JSON.parse(resp);
      $scope.$apply(function () {
        $scope.calendars = resp.data;
        // Fixme Not updating?
        $scope.data = {
          badgeCount : resp.data.length
        };
      });
    });
  };

  try {
    setScope();
  } catch(e) {
    c42Api.onReady(function(){
      setScope();
    });
  }

})

.controller('EventDetailCtrl', ['$scope', '$stateParams', 'c42Api', function($scope, $stateParams, c42Api) {
  // Map Options
  $scope.mapOptions ={
    disableDefaultUI:true,
    panControl: false,
    draggable: false
  };

  $scope.mapOptionsHero ={
    disableDefaultUI:true,
    tilt:45,
    panControl: false,
    draggable: false,
    mapTypeId: google.maps.MapTypeId.SATELLITE
  };

  // toggling items
  $scope.toggleItem= function(item) {
    if ($scope.isItemShown(item)) {
      $scope.shownItem = null;
    } else {
      $scope.shownItem = item;
    }
  };
  $scope.isItemShown = function(item) {
    return $scope.shownItem === item;
  };


  // BEGIN setting event data
  var setScope = function () {
    c42Api.getEventById($stateParams.eventId, function (resp) {
      resp = JSON.parse(resp);
      $scope.$apply(function () {
        var eventData = resp.data[0];
        eventData.__calendars = eventData.calendar_ids;
        eventData.data = JSON.parse(eventData.data);
        $scope.event = eventData;
        c42Api.getCalendarByIds(eventData.calendar_ids, function (resp) {
          resp = JSON.parse(resp);
          $scope.event.__calendars = resp.data;
        });
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
  // END setting event data
}])


.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
