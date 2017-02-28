<<<<<<< HEAD
angular.module('mean', ['ngCookies', 'ngResource', 'ui.bootstrap', 'ui.route', 'mean.system', 'mean.directives', 'checklist-model'])
  .config(['$routeProvider',
      function($routeProvider) {
          $routeProvider.
          when('/', {
            templateUrl: 'views/index.html'
          }).
          when('/app', {
            templateUrl: '/views/app.html',
          }).
          when('/privacy', {
            templateUrl: '/views/privacy.html',
          }).
          when('/bottom', {
            templateUrl: '/views/bottom.html'
          }).
          when('/signin', {
            templateUrl: '/views/signin.html'
          }).
          when('/signup', {
            templateUrl: '/views/signup.html'
          }).
          when('/choose-avatar', {
            templateUrl: '/views/choose-avatar.html'
          }).
          when('/charity', {
            templateUrl: '/views/charity.html'
          }).
          when('/aboutus', {
            templateUrl: '/views/aboutus.html'
          }).
          when('/signin-up', {
            templateUrl: '/views/signin-up.html'
          }).
          otherwise({
            redirectTo: '/'
          });
      }
  ]).config([function () {
    var config = {
      apiKey: 'AIzaSyAAU_0vcioI8gYtO4XD3z3eSDz3wVYOmYs',
      authDomain: 'cards-for-humanity-e3686.firebaseapp.com',
      databaseURL: 'https://cards-for-humanity-e3686.firebaseio.com',
      storageBucket: 'cards-for-humanity-e3686.appspot.com',
      messagingSenderId: '324856728467'
    };
    firebase.initializeApp(config);

  }]).config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.hashPrefix("!");

    }
  ]).config(['$locationProvider',
    function ($locationProvider) {
      $locationProvider.hashPrefix('!');
    }
  ]).run(['$rootScope', function ($rootScope) {
    $rootScope.safeApply = function (fn) {
      var phase = this.$root.$$phase;
      if (phase === '$apply' || phase === '$digest') {
        if (fn && (typeof (fn) === 'function')) {
          fn();
        }
      } else {
        this.$apply(fn);
      }
    };
  }]).run(['DonationService', function (DonationService) {
    window.userDonationCb = function (donationObject) {
      DonationService.userDonated(donationObject);
    };
  }]);

angular.module('mean.system', ['ngMaterial', 'ngMessages', 'ngSanitize', 'material.svgAssetsCache', 'angularMoment']);
angular.module('mean.directives', []);
