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
  c42Api.getCalendars(function(resp){
    resp = JSON.parse(resp);
    $scope.$apply(function () {
      console.log(resp.data);
      $scope.calendars = resp.data;
    });
  });

})

.controller('EventDetailCtrl', function($scope, $stateParams) {
  // $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
