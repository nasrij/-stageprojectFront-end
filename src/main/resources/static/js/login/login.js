var app = angular.module('login', [ 'ngMaterial', 'ngMessages']);
app.controller('loginController', function($scope, $http, $mdDialog, $window ) {
	alert("nasri");
	$scope.erreur = false;
	$scope.valid = false;
	$scope.verifPassword = function()
	{
		if($scope.username != "" && $scope.password != "")
		{
			$scope.valid = true;	
		}else{
			$scope.valid = false;
		}
	}
	
	$scope.verifUsername = function()
	{
		if($scope.username != "" && $scope.password != "")
		{
			$scope.valid = true;	
		}else{
			$scope.valid = false;
		}
	}
})
