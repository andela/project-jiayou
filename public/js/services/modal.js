angular.module("mean.system")
  .factory("gameModals", ["ModalService", function (ModalService) {
    return {
      showDialog: (paramController, paramScope) => {
        ModalService.showModal({
          templateUrl: paramScope.templateUrl,
          controller: paramController,
          scope: paramScope
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {
          // do something on successful page routing
          });
        });
      }
    };
  }]);
