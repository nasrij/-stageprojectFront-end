'use strict';

var app = angular.module("myApp",[]);
app.controller("myAppController", function($scope,$http,$window) {
	$scope.email = "";
	$scope.password = "";
	$scope.verifEmail = true;
	$scope.verifPassword = true;
	$scope.user = null;
	$scope.showButton = false;
	/*$scope.connecter = function(){		

		if($scope.email != "" && $scope.password != "")
		{
			$http.get("/user/login?email="+$scope.email+"&password="+$scope.password).success(function(data){
				$scope.user = data;		
				$cookies.putObject("user",data);				
				$window.location.href = '/index.html';
				//$scope.chargerOperations();
			}).error(function(data) {			
				$scope.errorMessage1 = data.message;
			})	
		}else{
			if($scope.email == "")
			{
				var mail = angular.element( document.querySelector( '#mail' ) );
				mail.addClass('has-error');
			}
			if($scope.password == "")
			{
				var pass = angular.element( document.querySelector( '#pass' ) );
				pass.addClass('has-error');
			}
		}		
	}
	*/
	$scope.verifmail = function(){
		var myEl = angular.element( document.querySelector( '#mail' ) );
		if($scope.email == ""){
			myEl.addClass('has-error');
			$scope.showButton = false;
		}
		else{
			myEl.removeClass('has-error');
		}
		if($scope.email != "" && $scope.password != "")
			{
			$scope.showButton = true;}
		}
	$scope.verifpass = function(){
		var myEl = angular.element( document.querySelector( '#pass' ) );
		if($scope.password == ""){
			$scope.showButton = false;
			myEl.addClass('has-error');
		}else{
			myEl.removeClass('has-error');
		}
		if($scope.email != "" && $scope.password != "")
			{$scope.showButton = true;
			}
		
	}
});