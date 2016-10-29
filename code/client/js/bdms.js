angular.module('bdms', ['ngRoute', 'ngResource']).config(function($routeProvider, $locationProvider) {
	$routeProvider.when('/', {
		templateUrl: './templates/list.html'
	});
	
	$routeProvider.when('/manage/:donator', {
		templateUrl: './templates/donator-form.html',
		controller: 'DonatorManager',
		resolve: {
			donator: function ($route, $location, Donators) {
				var donator = Donators.get({id: $route.current.params.donator});
				donator.$promise.catch(function () {
					$location.url('/');
				});
				return donator;
			}
		}
	});
	
	$routeProvider.when('/view/:donator', {
		templateUrl: './templates/donator-card.html',
		controller: 'DonatorManager',
		resolve: {
			donator: function ($route, $location, Donators) {
				var donator = Donators.get({id: $route.current.params.donator});
				donator.$promise.catch(function () {
					$location.url('/');
				});
				return donator;
			}
		}
	});
	
	$routeProvider.when('/become', {
		templateUrl: './templates/donator-form.html',
		controller: 'DonatorManager',
		resolve: {
			donator: function ($route, Donators) {
				return new Donators();
			}
		}
	});
	
	$routeProvider.otherwise({
		redirectTo: '/'
	});
	
	$locationProvider.html5Mode(true);
});