angular.module('c42-ionic.services', [])
.factory('c42Api', function(local_settings) {

  var defaultOnReady = function(){
    console.log("C42 API LOADED");
  };

  /* CONSTRUCTING THE API MAPPING */
  var API = [];
  var swaggerOptions = {
    "serverInfo":{
      "basePath": 'https://dev02.calendar42.com/api'
    },
    "Authorization":{
      "token" : local_settings.c42APIKey
    },
    "operations":{
      "Calendar_Api_get_calendars":"getCalendars",
      "Event_Subscription_Api_post_event_subscription" : "postEventSubscription",
      "Event_Subscription_Api_get_event_subscriptions" : "getEventSubscription",
      "Event_Api_post_event" : "postEvent",
      "Event_Api_patch_event" : "patchEvent",
      "Event_Api_get_events" : "getEvents",
      "Location_Api_get_locations" : "getLocations",
      "Position_Api_post_position" : "postPosition",
      "Search_Event_Api_search_events" : "searchEvents",
      "Service_Api_get_service_by_id" : "getServiceById",
      "User_Attendance_Api_get_attendances" : "getAttendances"
    },
    forceParams: true,
    onReady: function(){
      defaultOnReady();
    }
  };
  API = new swaggerAPI(swaggerOptions);
  /* END CONSTRUCTING THE API MAPPING */

  /*
    CACHE OF ITEMS
    Used to store in session more the following vars.
    Will be filled like:
    cached_items = {
      "item.id": <item>,
    }
  */
  var cached_calendars = {};
  var cached_events = {};

  var _handleEventResponse = function (resp, callback, returnFirst) {
    /**
      This function should handle all the API calls that return events

      It will:
      - parse the response
      - map the .calendar_ids to calendar objects in __calendars
      - try to JSON parse the .data field
      - update the cached_events
      - call the provided callback

      Setting returnFirst to true will make sure the callback is called with
      an event object instead of with an array of events.
    */

    resp = JSON.parse(resp);
    resp = resp.data;

    // set up cache
    resp.forEach(function(event){
      event.__calendars = event.calendar_ids.map(function(cal){
        return cached_calendars[cal] || cal;
      });
      event.filtererdOut = false;
      try {
        event.data = JSON.parse(event.data);
      } catch (err) {
        event.data = {};
      }
      cached_events[event.id] = event;
    });

    if (returnFirst) {
      resp = resp[0];
    }

    callback.apply(this,arguments);
  };

  var _handleCalendarResponse = function (resp, callback, returnFirst) {
    /**
      This function should handle all the API calls that return calendars

      It will:
      - parse the response
      - update the cached_calendars
      - call the provided callback

      Setting returnFirst to true will make sure the callback is called with
      a calendar object instead of with an array of calendars.
    */

    resp = JSON.parse(resp);
    resp = resp.data;

    // set up cache
    resp.forEach(function(calendar){
      cached_calendars[calendar.id] = calendar;
    });

    // The C42 API always returns an array, but sometimes you just want to get 1 item (like, get by id)
    if (returnFirst) {
      resp = resp[0];
    }

    callback.apply(this,arguments);
  };

  // Method encharged of actually load the events from the API
  var _loadEvents = function(options, callback){
    var defaultOptions = {
      "include_removed_events": false,
      "limit": 100,
      "event_types": "[normal]",
      "geo_polygons": "[y___Iy%7Bv%5CpiFa~Sb%7DP%7CaIosBxsh@esTuw]]",
      "from_time": "2016-04-07T22:00:00.000Z",
      "end_time": "2016-04-08T22:00:39.099Z",
      "order_by": "start"
    };
    options = angular.extend(defaultOptions, options || {});

    // This can be personalisated
    API.events.getEvents({
      params: options,
      callback: function(resp){
        _handleEventResponse(resp, callback);
      }
    });
  };

  var _updateEvent = function (event_id, partial, callback) {
    partial.id = event_id;
    API.events.patchEvent({
      params: partial,
      callback: function(resp){
        _handleEventResponse(resp, callback, true); // true in order to return single event object
      }
    });
    setTimeout(function() {
      err = null;
      callback(err);
    }, 300);
  };

  var _loadEventById = function(id, callback){
    API.events.getEvents({
      params: {
        "ids": '['+id+']'
      },
      callback: function(resp){
        _handleEventResponse(resp, callback, true); // true in order to return single event object
      }
    });
  };

  var _createEventSubscription = function (event, subscriber, callback) {
    // @todo: create subscription
    setTimeout(function() {
      err = null;
      callback(err);
    }, 300);
  };

  // Method encharged of actually load the calendars form the API
  var _loadCalendars = function(callback){
    API.calendars.getCalendars({
      params: {
        "limit": 20
      },
      callback: function(resp){
        _handleCalendarResponse(resp, callback);
      }
    });
  };


  return {
    // Returns a Promise
    storeReady: function () {
      var self = this;
      return new Promise(function(resolve, reject) {
        self.onReady(function (){
          self.getCalendars(resolve);
        });
      });
    },
    onReady: function(onReadyUserCallback){
      if(onReadyUserCallback){
        defaultOnReady = function(){
          onReadyUserCallback();
        };
      }
    },
    getEvents: function(options, callback){
      _loadEvents(options, callback);
    },
    getCalendars: function(callback){
      /*
        Gets all the calendars
        For now will only get them once from the API, after that from the cache

        @TODO: Add a "forceReload" param to allow the loading even when the cache rules are not accomplished
      */
       var calendars = Object.keys(cached_calendars).map(function (key) {return cached_calendars[key];});
       if(calendars.length){
         callback(calendars);
       }else{
         _loadCalendars(callback);
       }
     },
     getEventById: function(id, callback){
      /*
        Gets an event
        For now will only get an event once from the API, after that from the cache

        @TODO: Add a "forceReload" param to allow the loading even when the cache rules are not accomplished
      */
      if (cached_events[id]) {
        callback(cached_events[id]);
      } else {
        _loadEventById(id,callback);
      }
     },
     updateEventFields: function (event, fields, callback) {
        var partial = {};
        for (var i = 0; i < fields.length; i++) {
          partial[fields[i]] = event[fields[i]];
        }
        _updateEvent(event.id, partial, callback);
     },
     createEventSubscription: function (event, subscriber, callback) {
       _createEventSubscription(event, subscriber, callback);
     }
  };
})
/* Will keep the user selected filters */
.factory('calendarFilter', function(local_settings) {
  // appliedFilters
  var filterList = [];
  return {
    // Returns true if the selected calendar is in the filter
    inFilter: function(calendarId){
      return filterList.indexOf(calendarId) !== -1;
    },
    // Adds a new id to the filters list
    addFilter: function(calendarId){
      if(!this.inFilter(calendarId)){
        filterList.push(calendarId);
      }
    },
    // Removes the calendarId from the filters list
    removeFilter: function(calendarId){
      if(this.inFilter(calendarId)){
        filterList.splice(filterList.indexOf(calendarId), 1);
      }
    },
    // Returns the list of filters
    getFilters: function(){
      return filterList;
    }
  };
})
// @todo: Move me to a directives file
/**
  Directive used to call actions upon finished CSS animations, e.g:
    <div my-transition-end="doSomething()">
*/
.directive('myTransitionEnd', [
           '$parse',
 function ( $parse  ) {
    var transitions = {
        "transition"      : "transitionend",
        "OTransition"     : "oTransitionEnd",
        "MozTransition"   : "transitionend",
        "WebkitTransition": "webkitTransitionEnd"
    };

    var whichTransitionEvent = function () {
        var t,
            el = document.createElement("fakeelement");

        for (t in transitions) {
            if (el.style[t] !== undefined){
                return transitions[t];
            }
        }
    };

    var transitionEvent = whichTransitionEvent();

    return {
        'restrict': 'A',
        'link': function (scope, element, attrs) {
            var expr = attrs['myTransitionEnd'];
            var fn = $parse(expr);

            element.bind(transitionEvent, function (evt) {
                console.log('got a css transition event', evt);

                var phase = scope.$root.$$phase;

                if (phase === '$apply' || phase === '$digest') {
                    fn();
                } else {
                    scope.$apply(fn);
                }
            });
        },
    };
 }]);
