(function() {
	'use strict';

	app.controller("UserCreateSlideCtrl", ["$scope", "$rootScope", "$location", "$routeParams", "httpService",
		function ($scope, $rootScope, $location, $routeParams, httpService) {
			$scope.slide = {};
			
			$scope.back = function () {
				$location.path("/user/edit-topic/" + $routeParams.topicId);
			}
			
            httpService.getWithAuth("/api/create-slide", null, null);
			
			$scope.createSlide = function () {
				function postCreateSlideCallback(isStatusOk, result) {
					if (isStatusOk) {
						$scope.back();
					}
					else {
						$scope.errors = result.errors;
					}
				}
				
				$scope.slide.topicId = $routeParams.topicId;
				httpService.postWithAuth("/api/create-slide", $scope.slide, postCreateSlideCallback);
			}
		}
	]);
})();
