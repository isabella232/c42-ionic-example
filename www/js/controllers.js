angular.module('c42-ionic.controllers', [])

.controller('HomeCtrl', ['$scope', 'config', 'local_settings', 'c42Api','calendarFilter', '$window', function($scope,config, local_settings, c42Api, calendarFilter, $window) {
  var options = {
    // As we want to show quite some markers on the map, this is now set to 100.
    // If the markers and events in the list are pulled of different API calls this could be set to 10
    // Also, we should move the client side filtering then to the API
    limit: 100,
    offset: 0,
  };

  var _resetOffset = function () {
    options.offset = 0;
    $scope.events = null;
  };

  $scope.onclick = function (eventId) {
    var href="#/tab/event/" + eventId;
    $window.location.href = href;
  };

  $scope.mapConfig = config.initialConfig.mapDefaults;

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
    // @fixme: although we immediatly broadcast this, the arrow can still be briefly seen after loading
    $scope.$broadcast('scroll.refreshComplete');
    _resetOffset();
    $scope.loadMore();
  };

  $scope.loadMore = function () {
    c42Api.getEvents(options, function(events){
        $scope.$apply(function () {
            $scope.events = $scope.events ? $scope.events.concat(events) : events;
        });
        options.offset += $scope.events.length;
        // Notify that the infinite loading is complete
        $scope.$broadcast('scroll.infiniteScrollComplete');
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
