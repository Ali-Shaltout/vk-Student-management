(function() {
	'use strict';

	app.controller("UserStartLessonCtrl", ["$scope", "$rootScope", "$location", "$routeParams", "httpService",
		function ($scope, $rootScope, $location, $routeParams, httpService) {
            var config = {
                params: {
					lessonId: $routeParams.id,
				}
            };

			function getStartLessonCallback(isStatusOk, result) {
				if (isStatusOk) {
					$scope.lesson = result.lesson;
				}
				else {
					$scope.errors = result.errors;
				}
			}
			
            httpService.getWithAuth("/api/start-lesson", config, getStartLessonCallback);
			
			$scope.startTopic = function (topicId) {
				$location.path("/user/start-topic/" + topicId);
			}
			
			$scope.back = function () {
				$location.path("/user/main");
			}
		}
	]);
})();
