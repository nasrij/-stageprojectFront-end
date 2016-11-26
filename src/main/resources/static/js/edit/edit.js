var app = angular.module('edit', [ 'ngMaterial', 'ngMessages','ui.bootstrap','dialogs.main','pascalprecht.translate','dialogs.default-translations' ]);
app.controller('editController', function($scope, $http, $mdDialog, $window,dialogs) {
	$scope.user = null;
	$scope.errormessage = false;
	$http.get("/currentUser").success(function(data) {
		$scope.user = data;
		$scope.getlastSession();
	}).error(function(data) {
		$window.location = "/error";
	})
	

	
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

	$scope.goHome = function() {
		$window.location = "/Home";
	}
	$scope.ev = null;
	$scope.saveUser = function(ev) {
		$scope.ev = ev;
		var f = $scope.form;
		if (f.machineName.$valid && f.nom.$valid && f.prenom.$valid
				&& f.email.$valid && f.username.$valid
				&& $scope.user.password == $scope.user.cpassword) {
			$scope.user.date = new Date().getTime();
			var parameter = JSON.stringify($scope.user);
			 $http.post("/user/save", parameter).
			    success(function(data, status, headers, config) {
			        // this callback will be called asynchronously
			        // when the response is available
			    	$scope.showConfirm();
			        console.log(data);
			      }).
			      error(function(data, status, headers, config) {
						$scope.errormessage = true;
						dialogs.error("ERREUR","Erreur dans l'enregistrement de mise à jour!");
			        // called asynchronously if an error occurs
			        // or server returns response with an error status.
			      });

		} else {
			$scope.errormessage = true;
		}
	}
	
	$scope.showConfirm = function() {
	
		// Appending dialog to document.body to cover sidenav in docs app
		var confirm = $mdDialog.confirm().title('MESSAGE')
				.textContent("Utilisateur bien enregistrer?").ariaLabel(
						'Lucky day').targetEvent($scope.ev).ok('OK');
		$mdDialog.show(confirm).then(function() {			
			$window.location = "/User/Profil";
		});
	};

});
