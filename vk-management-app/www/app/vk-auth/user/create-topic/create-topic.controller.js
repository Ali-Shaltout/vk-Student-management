(function() {
	'use strict';

	app.controller("UserCreateTopicCtrl", ["$scope", "$rootScope", "$location", "$routeParams", "httpService",
		function ($scope, $rootScope, $location, $routeParams, httpService) {
			$scope.topic = {};
			
			$scope.back = function () {
				$location.path("/user/edit-lesson/" + $routeParams.lessonId);
			}
			
            httpService.getWithAuth("/api/create-topic", null, null);
			
			$scope.createTopic = function () {
				function postCreateTopicCallback(isStatusOk, result) {
					if (isStatusOk) {
						$scope.back();
					}
					else {
						$scope.errors = result.errors;
					}
				}
				
				$scope.topic.lessonId = $routeParams.lessonId;
				httpService.postWithAuth("/api/create-topic", $scope.topic, postCreateTopicCallback);
			}
		}
	]);
})();
