angular.module('mean.system')
  .controller('IndexController', ['$scope', 'Global', '$location', 'socket', 'game', 'AvatarService', '$http', '$window', '$timeout', function ($scope, Global, $location, socket, game, AvatarService, $http, $window, $timeout) {
    $scope.global = Global;
    $scope.credentials = {};
    $scope.playAsGuest = function () {
      game.joinGame();
      $location.path('/app');
    };

    $scope.showError = function () {
      if ($location.search().error) {
        return $location.search().error;
      }
      return false;
    };

    $scope.avatars = [];
    AvatarService.getAvatars()
      .then(function (data) {
        $scope.avatars = data;
      });
    $scope.userLogin = function () {
      $http.post('/api/auth/login', { email: $scope.credentials.userEmail, password: $scope.credentials.userPassword }).success(function (res) {
        if (res.success) {
          // Write token to local storage
          localStorage.setItem('JWT', res.token);
          localStorage.setItem('Email', res.userEmail);
          localStorage.setItem('expDate', res.expDate);
          $location.path('/app');
        } else if (res.msg === 'An unexpected error occurred') {
          $scope.message = 'An unexpected error occured';
          $scope.errorMessage = true;
          // display error message for 4000ms
          $scope.timer(4000);
        } else if (res.message === 'Authentication failed wrong password') {
          $scope.message = 'Wrong password';
          $scope.errorMessage = true;
          // display error message for 4000ms
          $scope.timer(4000);
        } else if (res.msg === 'Authentication failed user not found') {
          $scope.message = 'Invalid user';
          $scope.errorMessage = true;
          // display error message for 4000ms
          $scope.timer(4000);
        } else {
          $location.path('/#!/signin');
        }
      }).error(function (err) {
        $scope.userActive = false;
      });
    };

    /**
     * Function to display message a for a time
     * @param{Integer} howLong - How long in milliseconds message should show
     * @returns{undefined}
     */
    $scope.timer = function (howLong) {
      $timeout(function () {
        $scope.errorMessage = false;
      }, howLong);
    };

    $scope.userSignUp = function () {
      $http.post('/api/auth/signup', { email: $scope.credentials.email, password: $scope.credentials.password, username: $scope.credentials.username }).success(function (res) {
        if (res.success) {
          $window.localStorage.setItem('jwtToken', res.token);
          $location.path('/app');
        } else {
          $location.path('/#!/signup');
        }
      }).error(function (err) {
        $scope.userActive = false;
      });
    };
  }]);
