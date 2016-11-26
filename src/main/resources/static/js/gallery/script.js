var app = angular.module('screenshot', ['ngMaterial', 'fc.paging','ui.bootstrap','dialogs.main','pascalprecht.translate','dialogs.default-translations']);

app.controller('screenshotController', function($scope, $http, $mdDialog, $window,dialogs) {
	$scope.images =null;
	$scope.user = null;
	$scope.pageScreenshotCourant = 1;

	$scope.pageSize = 4;
	$http.get("/currentUser").success(function(data) {
		$scope.user = data;
		$scope.getlastSession();
		$scope.getScreenshot();		
		
	}).error(function(data) {
		$window.location = "/error";
	})
	
		$scope.gotoPage = function() {
		// $scope.pageScreenshotCourant = p;
		$scope.getScreenshot();
	};
	
	$scope.userimageUrl = "/images/Icon.png";
	$scope.getlastSession = function()
	{
		$http.get("/session/last?machineName="+$scope.user.machineName).success(function(data){
			if(data != null)
			{
				if(data.action == "ouverture")
					{
					$scope.userimageUrl = "/images/userOnline.png";
					}else
						{
						$scope.userimageUrl = "/images/userOffline.png";
						}
			}
		})
	}
    
	$scope.getScreenshot = function() {
		$http.get(
				"/screenshot?machineName=" + $scope.user.machineName + "&page="+($scope.pageScreenshotCourant-1)+"&size="
						+ $scope.pageSize).success(function(data) {													
			$scope.images = data;
		}).error(function(data) {
			$window.location = "/error";

		})

	};
});
