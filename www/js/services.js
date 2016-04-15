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

  // Used to store in session more the following vars
  var cached_calendars;
  var cached_events;

  // Method encharged of actually load the events from the API
  var _loadEvents = function(callback){
    // This can be personalisated
    API.events.getEvents({
      params: {
        "include_removed_events": false,
        "limit": 100,
        "event_types": "[normal]",
        "geo_polygons": "[y___Iy%7Bv%5CpiFa~Sb%7DP%7CaIosBxsh@esTuw]]",
        "from_time": "2016-04-07T22:00:00.000Z",
        "end_time": "2016-04-08T22:00:39.099Z"
      },
      callback: function(resp){
        // setting some meta data to manage the cached objects
        resp.last_load = new Date();
        cached_events = resp;
        callback.apply(this,arguments);
      }
    });
  };

  // Method encharged of actually load the calendars form the API
  var _loadCalendars = function(callback){
    API.calendars.getCalendars({
      callback: function(resp){
        // setting some meta data to manage the cached objects
        resp.last_load = new Date();
        cached_calendars = resp;
        callback.apply(this,arguments);
      }
    });
  };

  return {
    onReady: function(onReadyUserCallback){
      if(onReadyUserCallback){
        defaultOnReady = function(){
          onReadyUserCallback();
        };
      }
    },
    getEvents: function(callback){
      // Since this is an example we only load the events once
      // @TODO: Add a "forceReload" param to allow the loading even when the cache rules are not accomplished
      if(cached_events){
        callback(cached_events);
      }else{
        _loadEvents(callback);
      }
    },
     getCalendars: function(callback){
       // Since this is an example we only load the events once
       // @TODO: Add a "forceReload" param to allow the loading even when the cache rules are not accomplished
       if(cached_calendars){
         callback(cached_calendars);
       }else{
         _loadCalendars(callback);
       }
     },
  }
});
