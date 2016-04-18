angular.module('c42-ionic.controllers', [])

.controller('HomeCtrl', ['$scope', 'config', 'local_settings', 'c42Api','calendarFilter', function($scope,config, local_settings, c42Api, calendarFilter) {
  var _setEvents = function (callback) {
    c42Api.getEvents(function(events){
      $scope.$apply(function () {
          $scope.events = events;
          return callback ? callback(events) : events;
      });
    });
  };

  $scope.mapCongig = config.initialConfig.mapDefaults;
  _setEvents();

  // @TODO: Add this to the resolve in the way that is filtered before of being rendered
  // @TODO: Get it form the BE
  $scope.$on('$ionicView.enter', function() {
    if($scope.events){
      var filters = calendarFilter.getFilters();
      // Checking if the event contains any calendar that is selected in the "filter calendars"
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

  $scope.doRefresh = function () {
    _setEvents( function () {
      //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

}])

.controller('InterestsCtrl', function($scope, c42Api, calendarFilter) {
  // $scope.calendars = [];
  $scope.data = {
    badgeCount : 1
  };
  if(!$scope.calendars){
    c42Api.getCalendars(function(calendars){
      $scope.calendars = calendars;
      $scope.data = {
        badgeCount : calendars.length
      };
    });
  }

  $scope.inFilter = function(calendar_id){
    return calendarFilter.inFilter(calendar_id);
  };

  $scope.saveFilter = function(checked, calendar_id){
    if(checked){
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

  $scope.changeAttending = function() {
    $scope.attending = !$scope.attending;
    $scope.event.rsvp_status = $scope.attending ? 'attending' : 'not_attending';
    c42Api.updateEventFields($scope.event, ['rsvp_status'], function (resp) {
      console.warn(resp);
    });
  };


  // BEGIN setting event data
  c42Api.getEventById($stateParams.eventId, function (event) {
    $scope.event = event;
    $scope.attending = event.rsvp_status == 'attending';
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
