angular.module('c42-ionic.controllers', [])

.controller('HomeCtrl', ['$scope', 'config', 'local_settings', 'c42Api','calendarFilter', '$window', function($scope,config, local_settings, c42Api, calendarFilter, $window) {
  var options = {
    // As we want to show quite some markers on the map, this is now set to 100.
    // If the markers and events in the list are pulled of different API calls this could be set to 10
    // Also, we should move the client side filtering then to the API
    limit: 100,
    offset: 0
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

  // As the infinite-scroll directive is already checking whether to load more, it will automaticaly load on entering the view
}])

.controller('InterestsCtrl', function($scope, c42Api, calendarFilter) {
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

.controller('EventDetailCtrl', ['$scope', '$stateParams', '$ionicScrollDelegate', '$ionicPopup', 'c42Api', 'local_settings', function($scope, $stateParams, $ionicScrollDelegate, $ionicPopup, c42Api, local_settings) {
  // Var used to know if certain element should be shown.
  // Used to know if the 'description' is shown.
  $scope.shownItem = null;
  $scope.isItemShown = function(item) {
    return $scope.shownItem === item;
  };
  $scope.toggleItem= function(item) {
    if ($scope.isItemShown(item)) {
      $scope.shownItem = null;
    } else {
      $scope.shownItem = item;
    }
  };
  // This method is required (and called) after toggle an element that increases/reduces the page length.
  // In that case the scroll is affected and needs to be re-calculated
  $scope.refreshScroll = function () {
    $ionicScrollDelegate.resize();
  };

  $scope.changeAttending = function() {
    $scope.attending = !$scope.attending;
    $scope.event.rsvp_status = $scope.attending ? 'attending' : 'not_attending';
    c42Api.updateEventFields($scope.event, ['rsvp_status'], function (resp) {
      console.warn(resp);
    });
  };

  // Method used when the user requests for showing the location in an external app, e.g: google maops
  $scope.openMaps = function(){
    var ref = window.open(this.mapsUrl, '_system', 'location=yes');
  }

  var _setEventScope = function () {
    c42Api.getEventById($stateParams.eventId, function (event) {
      $scope.event = event;
      $scope.attending = event.rsvp_status == 'attending';
      if (event.start_location.geo) {
        // @TODO: apply this solution despite different link should be called depending on whether you're on Android or iOS
        //        - https://gist.github.com/mrzmyr/977fc7d8bee58db9d96f
        $scope.mapsUrl = "http://maps.google.com/maps?q="+event.start_location.text.replace(/ /g,"+"); // Android
      }
      $scope.heroPicture = event.icon || "https://maps.googleapis.com/maps/api/staticmap?center="+event.start_location.geo.latitude+","+event.start_location.geo.longitude+"&zoom=18&size=400x400&maptype=satellite&key=" + local_settings.googleStaticMapsAPIKey;
      $scope.mapPicture = "https://maps.googleapis.com/maps/api/staticmap?markers=size:mid%7Ccolor:red%7C"+event.start_location.geo.latitude+","+event.start_location.geo.longitude+"&zoom=18&size=400x240&key=" + local_settings.googleStaticMapsAPIKey;
    });
  };

  $scope.showMailPopup = function () {
    $scope.data = {};

    var mailPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="data.email">',
      title: 'Enter Email',
      subTitle: 'Subscribe to event',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.data.email) {
              e.preventDefault();
            } else {
              return $scope;
            }
          }
        }
      ]
    }).then(function($scope) {
      c42Api.createEventSubscription($scope.event, { "email": $scope.data.email }, function (err) {
        if (!err) {
          console.warn("success");
        }
      });
    });
  };

  $scope.$on('$ionicView.afterEnter', function(){
    _setEventScope();
  });

}]);
