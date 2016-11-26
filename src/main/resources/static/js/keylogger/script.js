var app = angular.module('keylogger', [ 'ngMaterial', 'fc.paging','ui.bootstrap','dialogs.main','pascalprecht.translate','dialogs.default-translations' ]);
app.controller('keyloggerController', function($scope, $http, $mdDialog, $window,dialogs) {
	
	$scope.keylogger = null;
	$scope.user = null;
	$scope.pageKeyloggerCourant = 1;
	$scope.ispanelshowed = true;

	$scope.pageSize = 6;
	
	$http.get("/currentUser").success(function(data) {
		$scope.user = data;
		$scope.getlastSession();
		$scope.getKeylogger();

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
		$scope.getKeylogger();
	};
	$scope.getKeylogger = function() {
		$http.get(
				"/keylogger?machineName=" + $scope.user.machineName + "&page="
						+ ($scope.pageKeyloggerCourant - 1) + "&size="
						+ $scope.pageSize).success(function(data) {
			$scope.ispanelshowed = false;

			$scope.keylogger = data;
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

			$scope.deleteKeylogger($scope.id, ev);

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

	$scope.deleteKeylogger = function(id, ev) {
		$http({
			method : "POST",
			url : "/keylogger/delete?id=" + id,
			data : angular.toJson($scope.form),
			headers : {
				'Content-Type' : 'application/json'
			}
		}).then(_success, _error);
	};

	function _success(response) {
		$scope.ispanelshowed = true;

		$scope.getKeylogger();
		$scope.alertmsg = "Texte supprimer !";
		$scope.showAlert();

	}

	function _error(response) {
		$scope.alertmsg = response.statusText;
		$scope.showAlert();
	}
});
