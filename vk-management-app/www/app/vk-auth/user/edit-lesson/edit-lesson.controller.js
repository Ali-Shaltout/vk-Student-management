(function() {
	'use strict';

	app.controller("UserEditLessonCtrl", ["$scope", "$rootScope", "$location", "$routeParams", "httpService",
		function ($scope, $rootScope, $location, $routeParams, httpService) {
            var getConfig = {
                params: {
					lessonId: $routeParams.id,
				}
            };
			
			function getEditLessonCallback(isStatusOk, result) {
				$scope.lesson = result.lesson;
			}
			
            httpService.getWithAuth("/api/edit-lesson", getConfig, getEditLessonCallback);
			
			$scope.back = function () {
				$location.path("/user/main");
			}
			
			$scope.changeLessonInformation = function () {
				function putEditLessonCallback(isStatusOk, result) {
					if (isStatusOk) {
						$scope.back();
					}
					else {
						$scope.errors = result.errors;
					}
				}
				
				httpService.putWithAuth("/api/edit-lesson", $scope.lesson, putEditLessonCallback);
			}
			
			$scope.setTopicPublishState = function (topic) {
				var config = {
					lessonId: topic.lessonId,
					topicId: topic.id,
					publishState: angular.copy(!topic.isPublished)
				};
				
				function putPublishTopicCallback(isStatusOk, result) {
					if (isStatusOk) {
						topic.isPublished = !topic.isPublished;						
					}
					else {
						alert(result.errors["publishError"]);
					}
				}
				
				httpService.putWithAuth("/api/publish-topic", config, putPublishTopicCallback);
			}
			
			$scope.editTopic = function (topic) {
				$location.path("/user/edit-topic/" + topic.id);
			}
			
			$scope.createTopic = function (lessonId) {
				$location.path("/user/create-topic/" + lessonId);
			}
			
			$scope.deleteTopic = function (topic) {
				var config = {
					lessonId: $routeParams.id,
					topicId: topic.id
				};
				
				function deleteLessonCallback(isStatusOk, result) {
					if (isStatusOk) {
						if (result.isDeleted === 1) {
							var index = $scope.lesson.topics.indexOf(topic);
							$scope.lesson.topics.splice(index, 1);
						}						
					}
					else {
						alert(result.errors["deleteError"]);
					}
				}
				
				httpService.postWithAuth("/api/delete-topic", config, deleteLessonCallback);
			}
			
			$scope.listLevelClassifiers = function () {
				if (!$scope.levelClassifiers) {
					var promiseGet = httpService.get("level-classifier");
					promiseGet.then(function (response) {
						$scope.levelClassifiers = response.data;
						console.log(response);
					});
				}
			}
			
			$scope.listProgrammingLanguageClassifiers = function () {
				if (!$scope.programmingLanguageClassifiers) {
					var promiseGet = httpService.get("programming-language-classifier");
					promiseGet.then(function (response) {
						$scope.programmingLanguageClassifiers = response.data;
						console.log(response);
					});
				}
			}
		}
	]);
})();
