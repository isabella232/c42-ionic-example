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

.controller('InterestsCtrl', function($scope, Interests, c42Api) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  $scope.$on('$ionicView.enter', function(e) {
    $scope.chats = Interests;
  });

  c42Api.getCalendars(function(resp){
    resp = JSON.parse(resp);
    $scope.$apply(function () {
        $scope.calendars = resp.data;
    });
  });

})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
