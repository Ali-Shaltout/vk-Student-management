'use strict';

var app = angular.module('vk-auth', ['ngRoute', 'ui.bootstrap', 'LocalStorageModule', 'hljs']);

app.run(["$rootScope", "localStorageService", function ($rootScope, localStorageService) {
    $rootScope.user = localStorageService.get('vk-auth');
}]);

app.config(['$routeProvider', '$locationProvider', '$httpProvider', 'hljsServiceProvider', function ($routeProvider, $locationProvider, $httpProvider, hljsServiceProvider) {
	$httpProvider.defaults.headers.delete = { 'Content-Type' : 'application/json' };
	hljsServiceProvider.setOptions({
		tabReplace: '    '
	});
	
    $routeProvider.when("/", {
        controller: "HomeCtrl",
        templateUrl: "App/vk-auth/home/home.html"
    });
	
	$routeProvider.when("/login", {
        controller: "LoginCtrl",
        templateUrl: "App/vk-auth/login/login.html"
    });
	
	$routeProvider.when("/user/logout", {
        controller: "LogoutCtrl",
		templateUrl: "App/vk-auth/logout/logout.html"
    });
	
	$routeProvider.when("/register", {
        controller: "RegisterCtrl",
        templateUrl: "App/vk-auth/register/register.html"
    });
	
	$routeProvider.when("/user/main", {
        controller: "UserMainCtrl",
        templateUrl: "App/vk-auth/user/main/main.html"
    });
	
	$routeProvider.when("/user/start-lesson/:id", {
        controller: "UserStartLessonCtrl",
        templateUrl: "App/vk-auth/user/start-lesson/start-lesson.html"
    });
	
	$routeProvider.when("/user/create-lesson", {
        controller: "UserCreateLessonCtrl",
        templateUrl: "App/vk-auth/user/create-lesson/create-lesson.html"
    });
	
	$routeProvider.when("/user/edit-lesson/:id", {
        controller: "UserEditLessonCtrl",
        templateUrl: "App/vk-auth/user/edit-lesson/edit-lesson.html"
    });
	
	$routeProvider.when("/user/start-topic/:id", {
        controller: "UserStartTopicCtrl",
        templateUrl: "App/vk-auth/user/start-topic/start-topic.html"
    });
	
	$routeProvider.when("/user/create-topic/:lessonId", {
        controller: "UserCreateTopicCtrl",
        templateUrl: "App/vk-auth/user/create-topic/create-topic.html"
    });
	
	$routeProvider.when("/user/edit-topic/:id", {
        controller: "UserEditTopicCtrl",
        templateUrl: "App/vk-auth/user/edit-topic/edit-topic.html"
    });
	
	$routeProvider.when("/user/create-slide/:topicId", {
        controller: "UserCreateSlideCtrl",
        templateUrl: "App/vk-auth/user/create-slide/create-slide.html"
    });
	
	$routeProvider.when("/user/edit-slide/:id", {
        controller: "UserEditSlideCtrl",
        templateUrl: "App/vk-auth/user/edit-slide/edit-slide.html"
    });

    $routeProvider.otherwise({
        controller: "404Ctrl",
        templateUrl: "App/vk-auth/404/404.html"
    });

    $locationProvider.html5Mode(true);
}]);

