// Ionic c42-ionic App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'c42-ionic' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'c42-ionic.services' is found in services.js
// 'c42-ionic.controllers' is found in controllers.js
var c42IonicApp = angular.module('c42-ionic', ['ionic', 'c42-ionic.controllers', 'c42-ionic.services','ionic-material','uiGmapgoogle-maps'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:
  .state('tab.home', {
    url: '/home',
    views: {
      'tab-home': {
        templateUrl: 'templates/tab-home.html',
        controller: 'HomeCtrl'
      }
    }
  })
  .state('tab.event', {
    url: '/event/:eventId',
    views: {
      'tab-home': {
        templateUrl: 'templates/event-detail.html',
        controller: 'HomeCtrl'
      }
    }
  })

  .state('tab.interests', {
    url: '/interests',
    views: {
      'tab-interests': {
        templateUrl: 'templates/tab-interests.html',
        controller: 'InterestsCtrl'
      }
    }
  })
  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/home');

})
// .config(function(uiGmapGoogleMapApiProvider, local_settings) {
//     uiGmapGoogleMapApiProvider.configure({
//         key: local_settings.googleMapsAPIKey,
//         libraries: 'weather,geometry,visualization'
//     });
// });
