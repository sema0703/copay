'use strict';

angular.module('copayApp.controllers').controller('disclaimerController',
  function($scope, $timeout, $log, profileService, isCordova, storageService, applicationService, gettextCatalog, uxLanguage, go) {
    self = this;

    $scope.goHome = function() {
      $scope.error = "";
      profileService.storeDisclaimer(function(err) {
        if (err) {
          $scope.error = err;
          $scope.$apply();
        } else go.walletHome();
      });
    };

    var create = function() {
      $scope.creatingProfile = true;
      profileService.create({}, function(err) {

        if (err) {
          $log.warn(err);
          $scope.error = err;
          $scope.$apply();
          $timeout(function() {
            $log.warn('Retrying to create profile......');
            create();
          }, 3000);
        } else {
          $scope.error = "";
          $scope.creatingProfile = false;
        }
      });
    };

    this.init = function() {
      self.lang = uxLanguage.currentLanguage;
      storageService.getProfile(function(err, profile) {
        if (!profile) create();
        else $scope.creatingProfile = false;

        //compatible
        profileService.checkDisclaimer(function(val) {
          if (val) go.walletHome();
        });
      });
    };
  });
