(function() {
	'use strict';

	app.controller("LogoutCtrl", ["$rootScope", "$location", "localStorageService",
		function ($rootScope, $location, localStorageService) {
			$rootScope.user = null;
			localStorageService.set('vk-auth', null);
			$location.path('/login');
		}
	]);
})();
