(function() {
'use strict';

angular
  .module('fz.TimeSvc', [])
  .factory('fzTimeSvc', Svc);

function Svc() {
  return {
    time: () => {
      let dtz = Companies.findOne({});
      console.log(dtz);
      return 'im time';
    }
  };
}

})();
