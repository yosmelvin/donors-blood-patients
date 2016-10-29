angular.module('bdms').controller('DonatorManager', ['$scope', '$rootScope', 'Donators', 'donator', '$location', 'Map', 'Socket', function($scope, $rootScope, Donators, donator, $location, Map, Socket) {
  $scope.donator = donator;
  $scope.saved = null;
  $scope.locationMode = false;
  $scope.isPhoneShown = false;

  $scope.showPhone = function () {
    $scope.isPhoneShown = true;
  };

  if (!donator.coordinates || !donator.address) {
    Map.getAddress(donator.coordinates).then(function (result) {
      donator.coordinates = result.coordinates;
      donator.address = result.address;
    });
  }

  $scope.onSubmit = function (donator, form) {
    if (!form.$valid) return;

    if (donator._id) {
      Donators.update({ id:donator._id }, donator);
    } else {
      donator.$save();
    }
  };

  $scope.onRemove = function () {
    if (!donator._id || !confirm('Are you shure?')) return;

    Donators.remove({ id:donator._id }).$promise.then(function () {
      $location.url('/');
    });
  };

  $scope.onLocation = function () {
    $scope.locationMode = true;
    $scope._originalDonator = angular.copy(donator);
    $rootScope.$emit('DonatorManager.showLocationMarker', donator.coordinates);

    $scope._locationEvent = $rootScope.$on('DonatorManager.locationMarkerMoved', function ($event, pos) {
      Map.getAddress(pos).then(function (result) {
        donator.coordinates = result.coordinates;
        donator.address = result.address;
      });
    });

  };

  $scope.cancelLocation = function () {
    $scope.donator = angular.copy($scope._originalDonator);
    $scope.locationMode = false;
    $rootScope.$emit('DonatorManager.hideLocationMarker');

    if ($scope._locationEvent) $scope._locationEvent();
  };

  $scope.saveLocation = function () {
    delete $scope._originalDonator;
    $scope.locationMode = false;
    $rootScope.$emit('DonatorManager.hideLocationMarker');

    if ($scope._locationEvent) $scope._locationEvent();
  };

  Socket.on('donatorChanged', function (data) {
    if ($scope.donator._id !== data._id) return;

    $scope.donator = new Donators(data);
  });

  Socket.on('donatorRemoved', function (id) {
    if ($scope.donator._id !== id) return;

    $location.url('/');
  });
}]);
