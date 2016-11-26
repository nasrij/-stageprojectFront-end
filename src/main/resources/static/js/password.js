var app = angular.module('password', [ 'ngMaterial', 'ngMessages']);
app.controller('passwordController', function($scope, $http, $mdDialog, $window ) {
	$scope.erreur = false;
	$scope.sendMail = function()
	{
		var f = $scope.form;
		if(f.username.$valid && f.email.$valid)
		{
			alert("122");
		}else{
			$scope.erreur = true;
		}
	}

})
