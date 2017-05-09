(function() {
	'use strict';

	app.controller("UserStartTopicCtrl", ["$scope", "$rootScope", "$location", "$routeParams", "httpService",
		function ($scope, $rootScope, $location, $routeParams, httpService) {
			
            var config = {
                params: {
					topicId: $routeParams.id,
				}
            };
			
			function getStartTopicCallback(isStatusOk, result) {
				if (isStatusOk) {
					$scope.topic = result.topic;
					$scope.activeSlideId = result.topic.activeSlideId;
					$scope.draftSlideId = result.topic.activeSlideId;
					console.log(result.topic.activeSlideId);
				}
				else {
					alert(result.errors["errorHeader"]);
				}
			}
			
            httpService.getWithAuth("/api/start-topic", config, getStartTopicCallback);	

			$scope.nextSlide = function (slideIndex) {
				var config = {
					answer: $scope.topic.slides[slideIndex].answer,
					topicId: $scope.topic.id
				};

				function putNextSlideCallback(isStatusOk, result) {
					if (isStatusOk) {
						var nextSlide = $scope.topic.slides[++slideIndex];
						if (nextSlide) {
							$scope.activeSlideId = nextSlide.id;
							$scope.draftSlideId = $scope.activeSlideId;			
						}
						else {
							// This is last slide
							$scope.back();
						}
					}
					else {
						alert(result.errors["nextError"]);
					}
				}
				
				httpService.putWithAuth("/api/next-slide", config, putNextSlideCallback);
			}
			
			$scope.back = function () {
				$location.path("/user/start-lesson/" + $scope.topic.lessonId);
			}
			
			$scope.backSlide = function (slide) {
				$scope.draftSlideId = slide.id;	
			}
		}
	]);
})();
