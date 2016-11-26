var app = angular.module('profile', []);
app.controller('profileController', function($scope, $http,$window) {
	$scope.user = null;
	$http.get("/currentUser").success(function(data) {
		$scope.user = data;
		$scope.getlastSession();
	}).error(function(data) {
		$window.location = "/error";
	});
	
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
	
});