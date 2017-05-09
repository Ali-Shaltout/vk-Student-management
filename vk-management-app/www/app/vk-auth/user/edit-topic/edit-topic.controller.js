(function() {
	'use strict';

	app.controller("UserEditTopicCtrl", ["$scope", "$rootScope", "$location", "$routeParams", "httpService",
		function ($scope, $rootScope, $location, $routeParams, httpService) {
            var getConfig = {
                params: {
					id: $routeParams.id,
				}
            };
			
			function getEditTopicCallback(isStatusOk, result) {
				$scope.topic = result.topic;
			}
			
            httpService.getWithAuth("/api/edit-topic", getConfig, getEditTopicCallback);
			
			$scope.back = function () {
				$location.path("/user/edit-lesson/" + $scope.topic.lessonId);
			}
			
			$scope.changeTopicInformation = function () {
				function putEditTopicCallback(isStatusOk, result) {
					if (isStatusOk) {
						$scope.back();
					}
					else {
						$scope.errors = result.errors;
					}
				}
				
				httpService.putWithAuth("/api/edit-topic", $scope.topic, putEditTopicCallback);
			}
			
			$scope.setSlidePublishState = function (slide) {
				var config = {
					topicId: slide.topicId,
					slideId: slide.id,
					publishState: angular.copy(!slide.isPublished)
				};
				
				function putPublishSlideCallback(isStatusOk, result) {
					if (isStatusOk) {
						slide.isPublished = !slide.isPublished;						
					}
					else {
						alert(result.errors["publishError"]);
					}
				}
				
				httpService.putWithAuth("/api/publish-slide", config, putPublishSlideCallback);
			}
			
			$scope.editSlide = function (slide) {
				$location.path("/user/edit-slide/" + slide.id);
			}
			
			$scope.createSlide = function (topicId) {
				$location.path("/user/create-slide/" + topicId);
			}
			
			$scope.deleteSlide = function (slide) {
				var config = {
					slideId: slide.id,
					lessonId: $scope.topic.lessonId,
					topicId: $scope.topic.id
				};
				console.log($scope.topic.lessonId);
				function deleteSlideCallback(isStatusOk, result) {
					if (isStatusOk) {
						if (result.isDeleted === 1) {
							var index = $scope.topic.slides.indexOf(slide);
							$scope.topic.slides.splice(index, 1);
						}						
					}
					else {
						alert(result.errors["deleteError"]);
					}
				}
				
				httpService.postWithAuth("/api/delete-slide", config, deleteSlideCallback);
			}
		}
	]);
})();
