(function() {
	'use strict';

	app.controller("UserEditSlideCtrl", ["$scope", "$rootScope", "$location", "$routeParams", "httpService",
		function ($scope, $rootScope, $location, $routeParams, httpService) {
            var getConfig = {
                params: {
					id: $routeParams.id,
				}
            };
			
			function getEditSlideCallback(isStatusOk, result) {
				$scope.slide = result.slide;
			}
			
            httpService.getWithAuth("/api/edit-slide", getConfig, getEditSlideCallback);
			
			$scope.back = function () {
				$location.path("/user/edit-topic/" + $scope.slide.topicId);
			}
			
			$scope.changeSlideInformation = function () {
				function putEditSlideCallback(isStatusOk, result) {
					if (isStatusOk) {
						$scope.back();
					}
					else {
						$scope.errors = result.errors;
					}
				}
				
				httpService.putWithAuth("/api/edit-slide", $scope.slide, putEditSlideCallback);
			}
		}
	]);
})();
