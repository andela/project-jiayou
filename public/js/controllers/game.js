angular.module('mean.system')
.controller('GameController', ['$scope', 'game', '$timeout', '$location', 'MakeAWishFactsService', '$http', '$dialog', 'gameModals', function ($scope, game, $timeout, $location, MakeAWishFactsService, $http, $dialog, gameModals, $window) {
     Materialize.toast('Welcome!', 4000);
    $scope.hasPickedCards = false;
    $scope.winningCardPicked = false;
    $scope.showTable = false;
    $scope.modalShown = false;
    $scope.game = game;
    $timeout(function(){
      $window.sessionStorage.setItem('gameID', game.gameID);
    }, 500);

    // boolean that tracks if the card deck has been clicked
    $scope.cardDeckClicked = false;
    $scope.game = game;
    $scope.pickedCards = [];
    var makeAWishFacts = MakeAWishFactsService.getMakeAWishFacts();
    $scope.makeAWishFact = makeAWishFacts.pop();
  
  $scope.pickCard = function (card) {
    if (!$scope.hasPickedCards) {
      if ($scope.pickedCards.indexOf(card.id) < 0) {
        $scope.pickedCards.push(card.id);
        if (game.curQuestion.numAnswers === 1) {
          $scope.sendPickedCards();
          $scope.hasPickedCards = true;
        } else if (game.curQuestion.numAnswers === 2 &&
            $scope.pickedCards.length === 2) {
            // delay and send
            $scope.hasPickedCards = true;
            $timeout($scope.sendPickedCards, 300);
          }
        }
      }

    $scope.pointerCursorStyle = function () {
      if ($scope.isCzar() && $scope.game.state === 'waiting for czar to decide') {
        return { cursor: 'pointer' };
      }
      return {};
    };
                                 
    $scope.getEmail = function () {
      $scope.canSend = false;
      $http({
        method: 'GET',
        url: '/api/userEmail'
      }).then(function successCallback(response) {
        var data = response.data;
        $scope.emails = data;
      }, function errorCallback(response) {
      });
    };

    $scope.checkAll = function () {
      $scope.selected = angular.copy($scope.emails);
    };

    $scope.uncheckAll = function () {
      $scope.selected = angular.copy([]);
    };

    $scope.sentEmails = [];
    $scope.canSend = false;
    $scope.cantSend = [];

    $scope.sendInvite = function () {
      array = [];
      var selectedEmail = document.getElementById('select').value;
      var currentUser = localStorage.getItem('Email');
      if (currentUser !== selectedEmail) {
        array.push({ email: selectedEmail });
        if ($scope.sentEmails.indexOf(selectedEmail) === -1) {
          $scope.sentEmails.push(selectedEmail);
        } else {
          $scope.cantSend.push(selectedEmail);
        }
        if ($scope.sentEmails.length > 11) {
          $scope.canSend = false;
        } else {
          $scope.canSend = true;
        }
        if ($scope.canSend) {
          $http.post('/api/search/users', { emailArray: array }).success(function (res) {
            if (res.statusCode === 202) {
              $scope.showSuccessAlert = true;
              $scope.timer(5000);
            } else {
              $location.path('/#!/signup');
            }
          });
        } else {
          $scope.showAlert2 = true;
          $scope.timer(4000);
        }
      } else {
        $scope.showWarningAlert = true;
        $scope.timer(5000);
      }
      document.getElementById('select').value = '';
    };

    $scope.timer = function (howLong) {
      $timeout(function () {
        $scope.showSuccessAlert = false;
        $scope.showWarningAlert = false;
        $scope.showAlert2 = false;
      }, howLong);
    };
    $scope.checkFirst = function () {
      $scope.user.emails.splice(0, $scope.user.roles.length);
      $scope.user.emails.push('guest');
    };

    $scope.sendPickedCards = function () {
      game.pickCards($scope.pickedCards);
      $scope.showTable = true;
    };

    $scope.cardIsFirstSelected = function (card) {
      if (game.curQuestion.numAnswers > 1) {
        return card === $scope.pickedCards[0];
      }
      return false;
    };

    $scope.cardIsSecondSelected = function (card) {
      if (game.curQuestion.numAnswers > 1) {
        return card === $scope.pickedCards[1];
      }
      return false;
    };

    $scope.firstAnswer = function ($index) {
      if ($index % 2 === 0 && game.curQuestion.numAnswers > 1) {
        return true;
      }
      return false;
    };

    $scope.secondAnswer = function ($index) {
      if ($index % 2 === 1 && game.curQuestion.numAnswers > 1) {
        return true;
      }
      return false;
    };

    $scope.showFirst = function (card) {
      return game.curQuestion.numAnswers > 1 && $scope.pickedCards[0] === card.id;
    };

    $scope.showSecond = function (card) {
      return game.curQuestion.numAnswers > 1 && $scope.pickedCards[1] === card.id;
    };

    $scope.isCzar = function () {
      return game.czar === game.playerIndex;
    };

    $scope.isPlayer = function($index) {
      $window.sessionStorage.setItem('Username', game.players[game.playerIndex].username);
      $window.sessionStorage.setItem('Avatar', game.players[game.playerIndex].avatar);
      return $index === game.playerIndex;
    };

    $scope.isPremium = function ($index) {
      return game.players[$index].premium;
    };

    $scope.currentCzar = function ($index) {
      return $index === game.czar;
    };

  $scope.isCustomGame = function () {
    return !(/^\d+$/).test(game.gameID) && game.state === 'awaiting players';
  };

    $scope.winningColor = function ($index) {
      if (game.winningCardPlayer !== -1 && $index === game.winningCard) {
        return $scope.colors[game.players[game.winningCardPlayer].color];
      }
      return '#f9f9f9';
    };

    $scope.pickWinning = function (winningSet) {
      if ($scope.isCzar()) {
        game.pickWinning(winningSet.card[0]);
        $scope.winningCardPicked = true;
      }
    };

    $scope.winnerPicked = function () {
      return game.winningCard !== -1;
    };

    $scope.startGame = function () {
      game.startGame();
    };

    $scope.abandonGame = function () {
      // sessionStorage.clear();
      sessionStorage.removeItem('guest');
      game.leaveGame();
      $location.path('/');
    };

    $scope.gameState = {
      awaitingPlayers: function () {
        return $scope.game.state === 'awaiting players';
      },

      ended: function () {
        return $scope.game.state === 'game ended';
      },

      dissolved: function () {
        return $scope.game.state === 'game dissolved';
      },

  $scope.abandonGame = function (event) {
    var dialogDetails = { title: "Exit Game",
      content: "Do you really want to abandon the game?",
      label: "Abandon Game",
      okTitle: "Yes",
      cancelTitle: "No"
    };
    gameModals.showConfirm($scope.event, dialogDetails).then(function () {
      game.leaveGame();
      $location.path('/').search({});
    });
      /* call function to update the
      database record with new gameId if
      remaining players are just two
      and then route user to
      $location.path('/');
      */
      // $scope.updateGameId(gameDetails);
  };

  $scope.updateGameId = function (gameDetail) {
    if (gameDetail.playerLeft === 2) {
      $http.put('/api/games/${gameDetails.gameId}/start', {
        gameDetails: gameDetail
      }).success(function (res) {
        $location.path('/');
      }).error(function (err) {
          // $scope.startGameStatus = false;
          // $scope.showDialog();
        });
        $location.path('/');
      }
    };
    awaitingCzar: function () {
      return $scope.game.state === 'waiting for czar to decide';
     },

      winnerChosen: function () {
        return $scope.game.state === 'winner has been chosen';
      },

      noWinner: function () {
        return game.gameWinner === -1;
      },
      userWon: function () {
        return game.gameWinner === game.playerIndex;
      },
      userLost: function () {
        return game.gameWinner !== game.playerIndex;
      },
      awaitingDrawCard: function () {
        return $scope.game.state === 'waiting for czar to draw cards';
      }
    };

    // Catches changes to round to update when no players pick card
    // (because game.state remains the same)
    $scope.$watch('game.round', function () {
      $scope.hasPickedCards = false;
      $scope.showTable = false;
      $scope.winningCardPicked = false;
      $scope.makeAWishFact = makeAWishFacts.pop();
      if (!makeAWishFacts.length) {
        makeAWishFacts = MakeAWishFactsService.getMakeAWishFacts();
      }
      $scope.pickedCards = [];
    });

    // In case player doesn't pick a card in time, show the table
    $scope.$watch('game.state', function () {
      if (game.state === 'waiting for czar to decide' && $scope.showTable === false) {
        $scope.showTable = true;
      }
    });


    $scope.$watch('game.gameID', function () {
      if (game.gameID && game.state === 'awaiting players') {
        if (!$scope.isCustomGame() && $location.search().game) {
          // If the player didn't successfully enter the request room,
          // reset the URL so they don't think they're in the requested room.
          $location.search({});
        } else if ($scope.isCustomGame() && !$location.search().game) {
          // Once the game ID is set, update the URL if this is a game with friends,
          // where the link is meant to be shared.
          $location.search({ game: game.gameID });
          if (!$scope.modalShown) {
            setTimeout(function () {
              var link = document.URL;
              var txt = 'Give the following link to your friends so they can join your game: ';
              $('#lobby-how-to-play').text(txt);

              $('#oh-el').css({ 'text-align': 'center', 'font-size': '22px', 'background': 'white', 'color': 'black' }).text(link);
            }, 200);
            $scope.modalShown = true;
          }
        }
      }
    });

    if ($location.search().game && !(/^\d+$/).test($location.search().game)) {
      game.joinGame('joinGame', $location.search().game);
    } else if ($location.search().custom) {
      var gameDBId = localStorage.getItem("gameDBId");
      game.joinGame('joinGame', null, gameDBId, true);
    } else {
      game.joinGame();
    }
    $scope.drawCard = () => {
      if (game.state === 'waiting for czar to draw cards' && !$scope.isCzar()) {
        Materialize.toast('You are not the czar!');
      } else if (game.state === 'waiting for czar to draw cards' && $scope.isCzar()) {
        // Ensure only card czar choose question for next round
        game.drawCard();
        /**
         * Flip cards. First set cardDeckClicked to true only when czar clicks
         * the card deck
         */
        $scope.cardDeckClicked = true;
      } else {
        Materialize.toast('Wait for czar to choose next question!', 4000);
      }
    };
  }]);
