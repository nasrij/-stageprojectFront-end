var app = angular.module('processus', [ 'ngMaterial', 'fc.paging' ]);
app.controller('processusController', function($scope, $http, $mdDialog,$window) {
	
	$scope.processus = null;
	$scope.user = null;
	$scope.pageProcessCourant = 1;
	$scope.ispanelshowed = true;

	$scope.pageSize = 6;
	
	$http.get("/currentUser").success(function(data) {
		$scope.user = data;
		$scope.getlastSession();
		$scope.getProcessus();

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
	
	$scope.gotoPage = function() {
		// $scope.pageScreenshotCourant = p;
		$scope.getProcessus();
	};
	$scope.getProcessus = function() {
		$http.get(
				"/process?machineName=" + $scope.user.machineName + "&page="
						+ ($scope.pageProcessCourant - 1) + "&size="
						+ $scope.pageSize).success(function(data) {
			$scope.ispanelshowed = false;

			$scope.processus = data;
		}).error(function(data) {
			$window.location = "/error";
		})

	};
	
	$scope.id = 0;
	$scope.showConfirm = function(ev, id) {
		$scope.id = id;
		// Appending dialog to document.body to cover sidenav in docs app
		var confirm = $mdDialog.confirm().title('tu veux supprimer vraiment?')
				.textContent("Supprimer le donnée avec ID=" + id).ariaLabel(
						'Lucky day').targetEvent(ev).ok('OUI').cancel('NON');
		$mdDialog.show(confirm).then(function() {
			$scope.ispanelshowed = true;

			$scope.deleteProcessus($scope.id, ev);

		}, function() {
			$scope.status = 'You decided to keep your debt.';
		});
	};

	$scope.showAlert = function(ev) {
		// Appending dialog to document.body to cover sidenav in docs app
		// Modal dialogs should fully cover application
		// to prevent interaction outside of dialog
		$mdDialog.show($mdDialog.alert().parent(
				angular.element(document.querySelector('#popupContainer')))
				.clickOutsideToClose(true).title('').textContent(
						$scope.alertmsg).ariaLabel('Alert Dialog Demo')
				.ok('OK').targetEvent(ev));
	};

	$scope.deleteProcessus = function(id, ev) {
		$http({
			method : "POST",
			url : "/process/delete?id=" + id,
			data : angular.toJson($scope.form),
			headers : {
				'Content-Type' : 'application/json'
			}
		}).then(_success, _error);
	};

	function _success(response) {
		$scope.ispanelshowed = true;

		$scope.getProcessus();
		$scope.alertmsg = "Processus supprimer !";
		$scope.showAlert();

	}

	function _error(response) {
		$scope.alertmsg = response.statusText;
		$scope.showAlert();
	}
});
