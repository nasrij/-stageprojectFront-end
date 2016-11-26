var index = angular.module("indexApp",[]);

app.controller("indexController",function($scope,$http){
	
	$scope.screenshot = null;
	$scope.user = null;
	$http.get("/currentUser).success(function(data){
		$scope.user = data;				
		alert(data.nom)
	}).error(function(data) {			
		alert("user");
	})	};
	
	
});