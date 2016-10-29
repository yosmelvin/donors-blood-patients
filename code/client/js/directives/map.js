angular.module('bdms').directive('bdmsMap', ['Map', 'Donators', 'Socket', function (Map, Donators, Socket) {
	return {
		restrict: 'A',
		link: function (scope, elem) {
			Map.init('AIzaSyC3RTzUYxLkEkaUfP6FUQNOUl4Vs0aDpBg').then(function () {
				scope.map = new Map.api.Map(elem.get(0), {
					center: {lat: elem.data('center-lat') || 46.7651382, lng: elem.data('center-lng') || -92.2513077},
					zoom: elem.data('zoom') || 8,
					mapTypeControl: false,
					streetViewControl: false
		        });
				
				Map.getLocation().then(function (pos) {
					scope.map.setCenter(pos);
				});
				
				Map.api.event.addListener(scope.map, 'idle', function () {
					if (!scope.showAll) return;
					var bounds = scope.map.getBounds();
					if (scope._bounds && scope._bounds.equals(bounds)) return;
					
					scope._bounds = bounds;
					//if (scope._queryPromice)
					scope.$apply(function () {
						scope.updateMarkers(bounds);
					})
				});
				
			});
		},
		controller: function ($scope, $rootScope, $location) {
			$scope.showAll = true;
			
			$rootScope.$on('DonatorManager.showLocationMarker', function ($event, pos) {
				$scope.showAll = false;
				$scope.hideMarkers($scope._markers);
				
				var pos = pos || $scope.map.getCenter();
				
				if (!$scope._locationMarker) {
					$scope._locationMarker = new Map.api.Marker({
						position: pos,
						map: $scope.map,
						title: 'Your location',
						label: '!',
						animation: Map.api.Animation.DROP,
						draggable: true
					});
					$scope._locationMarker.addListener('dragend', function () {
						$rootScope.$emit('DonatorManager.locationMarkerMoved', $scope._locationMarker.getPosition());
					})
				} else {
					$scope._locationMarker.setPosition(pos);
					$scope._locationMarker.setMap($scope.map);
				}
			});
			
			Socket.on('donatorCreated', function (data) {
				if (!$scope.showAll) return;
				
				var donator = new Donators(data);
				$scope.createPin(donator, $scope.map, Map.api.Animation.DROP);
				$scope._markers.push(donator);
			});
			
			Socket.on('donatorChanged', function (data) {
				if (!$scope.showAll) return;
				
				var donator = $scope._markers.find(function (donator) {
					return donator._id === data._id;
				});
				if (donator) {
					var newDonator = new Donators(data);
					if (!donator.pin) {
						$scope.createPin(newDonator, $scope.map);
					} else {
						donator.pin.setLabel(newDonator.bloodGroup);
						donator.pin.setTitle(newDonator.getFullName());
						donator.pin.setPosition(newDonator.coordinates);
					}
				}
			});
			
			Socket.on('donatorRemoved', function (id) {
				if (!$scope.showAll) return;
				
				var index = $scope._markers.findIndex(function (donator) {
					return donator._id === id;
				});
				
				if (index) {
					$scope._markers[index].pin.setMap(null);
					$scope._markers.splice(index, 1);
				}
			});
			
			$rootScope.$on('DonatorManager.hideLocationMarker', function (pos) {
				$scope._locationMarker.setMap(null);
				$scope.showAll = true;
				$scope.updateMarkers($scope.map.getBounds());
			});
			
			$scope.createPin = function (donator, map, animation) {
				donator.pin = new Map.api.Marker({
					position: donator.coordinates,
					map: map,
					title: donator.getFullName(),
					label: donator.bloodGroup,
					animation: animation
				});
				donator.pin.addListener('click', function() {
					$scope.$apply(function () {
						$location.url('/view/' + donator._id);
					});
				});
			};
			
			$scope.showMarkers = function (markers) {
				markers.forEach(function (marker) {
					if (!marker.pin) $scope.createPin(marker);
					marker.pin.setMap($scope.map);
				});
			};
			
			$scope.hideMarkers = function (markers) {
				markers.forEach(function (marker) {
					if (marker.pin) {
						marker.pin.setMap(null);
					}
				});
			};
			
			$scope.updateMarkers = function (bounds) {
				var boundsQuery = [bounds.getNorthEast(), bounds.getSouthWest()];
				
				Donators.query(boundsQuery).$promise.then(function (markers) {
					if ($scope._markers) {
						$scope.hideMarkers($scope._markers);
						$scope._markers = [];
					}
					
					$scope._markers = markers;
					
					$scope.showMarkers($scope._markers);
					
				});
			};
		}
	};
}]);