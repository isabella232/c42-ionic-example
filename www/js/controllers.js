angular.module('c42-ionic.controllers', [])

.controller('HomeCtrl', ['$scope', 'config', 'local_settings', 'c42Api','calendarFilter', function($scope,config, local_settings, c42Api, calendarFilter) {
  $scope.mapCongig = config.initialConfig.mapDefaults;
  // When the C42API is loaded we recover the events and apply to the scope
  c42Api.getEvents(function(events){
    $scope.$apply(function () {
        $scope.events = events;
    });
  });
  // @TODO: Add this to the resolve in the way that is filtered before of being rendered
  // @TODO: Get it form the BE
  $scope.$on('$ionicView.enter', function() {
    if($scope.events){
      var filters = calendarFilter.getFilters();
      $scope.events.forEach(function(event,idx, eventsList){
        if(event.__calendars.length && filters.length){
          eventsList[idx].filtererdOut = event.__calendars.some(function(calendar){
            return !calendarFilter.inFilter(calendar.id);
          });
        }else{
          eventsList[idx].filtererdOut = false;
        }
      });
    }
  });
}])

.controller('InterestsCtrl', function($scope, c42Api, calendarFilter) {
  $scope.calendars = [];
  $scope.data = {
    badgeCount : 1
  };
  c42Api.getCalendars(function(calendars){
    $scope.calendars = calendars;
    $scope.data = {
      badgeCount : calendars.length
    };
  });

  $scope.saveFilter = function(calendar_id){
    if(this.isChecked){
      calendarFilter.addFilter(calendar_id);
    }else{
      calendarFilter.removeFilter(calendar_id);
    }
  };
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
  c42Api.getEventById($stateParams.eventId, function (event) {
    $scope.event = event;
    if (event.start_location.geo) {
      // @todo: this has actually not been tested on any device yet, we might need to add cordova-plugin-inappbrowser
      // @todo: a different link should be called depending on whether you're on Android or iOS
      //        - https://gist.github.com/mrzmyr/977fc7d8bee58db9d96f
      $scope.mapsUrl = "comgooglemaps://?daddr="+event.start_location.text; // Android
    }
  });
  // END setting event data
}])


.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
