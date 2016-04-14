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

  return {
    onReady: function(onReadyUserCallback){
      if(onReadyUserCallback){
        defaultOnReady = function(){
          onReadyUserCallback();
        };
      }
    },
    getEvents: function(callback){
      API.events.getEvents({
        params: {
          "include_removed_events": false,
          "limit": 100,
          "event_types": "[normal]",
          "geo_polygons": "[y___Iy%7Bv%5CpiFa~Sb%7DP%7CaIosBxsh@esTuw]]",
          "from_time": "2016-04-07T22:00:00.000Z",
          "end_time": "2016-04-08T22:00:39.099Z"
        },
        callback: callback
      });
    },
     getCalendars: function(callback){
       API.calendars.getCalendars({
         callback: callback
       });
     },
  }
})
.factory('Interests', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
