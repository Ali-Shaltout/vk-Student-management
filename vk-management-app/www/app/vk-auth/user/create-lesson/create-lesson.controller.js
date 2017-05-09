(function() {
	'use strict';

	app.controller("UserCreateLessonCtrl", ["$scope", "$rootScope", "$location", "httpService",
		function ($scope, $rootScope, $location, httpService) {
			$scope.lesson = { programmingLanguageName: "select programming language", levelName: "select difficulty level" };
			
			$scope.back = function () {
				$location.path("/user/main");
			}
			
            httpService.getWithAuth("/api/create-lesson", null, null);
			
			$scope.createLesson = function () {
				function postCreateLessonCallback(isStatusOk, result) {
					if (isStatusOk) {
						$scope.back();
					}
					else {
						$scope.errors = result.errors;
					}
				}
				
				httpService.postWithAuth("/api/create-lesson", $scope.lesson, postCreateLessonCallback);
			}
			
			$scope.listLevelClassifiers = function () {
				if (!$scope.levelClassifiers) {
					var promiseGet = httpService.get("level-classifier");
					promiseGet.then(function (response) {
						$scope.levelClassifiers = response.data;
					});
				}
			}
			
			$scope.listProgrammingLanguageClassifiers = function () {
				if (!$scope.programmingLanguageClassifiers) {
					var promiseGet = httpService.get("programming-language-classifier");
					promiseGet.then(function (response) {
						$scope.programmingLanguageClassifiers = response.data;
					});
				}
			}
		}
	]);
})();
