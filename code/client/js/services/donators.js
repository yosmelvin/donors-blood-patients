angular.module('bdms').factory('Donators', ['$resource', function($resource) {
	var Donators = $resource('/api/donators/:id', null, {
        'update': { method:'PUT' }
    });
	
	Donators.prototype.getFullName = function () {
		return this.firstname + ' ' + this.lastname;
	};
	
	return Donators;
}]);