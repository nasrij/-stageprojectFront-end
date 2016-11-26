var app = angular.module('setting', [ 'ngMaterial', 'ngMessages' ]);
app.controller('settingController', function($scope, $http, $mdDialog, $window) {
	$scope.user = null;
	$scope.ispanelshowed = true;
	$scope.errormessage = false;
	$http.get("/currentUser").success(function(data) {
		$scope.ispanelshowed = false;
		$scope.user = data;
		$scope.getlastSession();
	}).error(function(data) {
		$scope.ispanelshowed = false;
		$window.location = "/error";

	});
	$scope.goHome = function() {
		$window.location = "/Home";
	}
	$scope.ev = null;
	$scope.saveSetting = function(ev)
	{
		$scope.ispanelshowed = true;

		$scope.ev = ev;
		var f = $scope.setting;
		if(f.IntScreenshot.$valid && f.IntKeylogger.$valid )
		{
			if($scope.user.configuration.idConfig == 1 )
			{
				$scope.user.configuration.idConfig = null;
				var parameter = JSON.stringify($scope.user.configuration);
				 $http.post("/configuration/save", parameter).
				    success(function(data, status, headers, config) {
				        console.log(data);
				        $scope.user.configuration = null ;
				        $scope.user.configuration = data;
				        $scope.saveUser();
				      }).
				      error(function(data, status, headers, config) {
				    		$scope.ispanelshowed = false;
							$scope.errormessage = true;
				      });
			}else{
				var parameter = JSON.stringify($scope.user.configuration);
				 $http.post("/configuration/save", parameter).
				    success(function(data, status, headers, config) {
				        console.log(data);
				    	$scope.showConfirm();

				      }).
				      error(function(data, status, headers, config) {
				    		$scope.ispanelshowed = false;
							$scope.errormessage = true;
				      });
				
			}
		}else{
			$scope.ispanelshowed = false;

				$scope.errormessage = true;
			}
		
	}
	
	$scope.saveUser = function() {
			$scope.user.date = new Date().getTime();
			var parameter = JSON.stringify($scope.user);
			 $http.post("/user/save", parameter).
			    success(function(data, status, headers, config) {
			    	$scope.showConfirm();
			        console.log(data);
			      }).
			      error(function(data, status, headers, config) {
						$scope.errormessage = true;
						$scope.ispanelshowed = false;

			      });		
	}
	$scope.showConfirm = function() {
		$scope.ispanelshowed = false;
		// Appending dialog to document.body to cover sidenav in docs app
		var confirm = $mdDialog.confirm().title('MESSAGE')
				.textContent("Configuration bien enregistrer?").ariaLabel(
						'Lucky day').targetEvent($scope.ev).ok('OK');
		$mdDialog.show(confirm).then(function() {			
			$window.location = "/User/Profil";
		});
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
	
});