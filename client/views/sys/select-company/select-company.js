(function() {
'use strict';

angular
  .module('fz.select-company', [
    'fz.greeting-modal'
  ])
  .config(function ($stateProvider) {
    $stateProvider
      .state('sys.select-company', {
        url: '/select-company',
        templateUrl: 'client/views/sys/select-company/select-company.html',
        controller: Ctrl,
        controllerAs: 'vm'
      });
  });

function Ctrl() {
  // console.log('select-company Ctrl');
  const vm = this;
  vm.user = Meteor.user();
  vm.companies = vm.user.companies;
  vm.blinkCompanySelect = blinkCompanySelect;

  function blinkCompanySelect(e) {
    e.preventDefault();
    e.stopPropagation();

    let screenSizes = { sm: 768 };
    let $select = $('#company-select');

    //show main menu if it's hidden
    if ($(window).width() > (screenSizes.sm - 1)) {
      if ($('body').hasClass('sidebar-collapse')) {
        $('body').removeClass('sidebar-collapse').trigger('expanded.pushMenu');
      }
    }
    else {
      if (!$('body').hasClass('sidebar-open')) {
        console.log('should work');
        $('body').addClass('sidebar-open').trigger('expanded.pushMenu');
      }
    }

    //highlight select input for 3 seconds
    if (!$select.hasClass('highlight-borders')) {
      $select.addClass('highlight-borders');
      setTimeout(function () {
        $select.removeClass('highlight-borders');
      }, 3000);
    }
  }
}

})();
