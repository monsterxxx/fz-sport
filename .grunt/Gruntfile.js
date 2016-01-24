(function(){
'use strict';

module.exports = function(grunt){
  //Project configuration
  grunt.initConfig({
    svgstore: {
      options: {
        prefix : 'shape-', // This will prefix each ID
        svg: {
          style: 'display: none;'
        },
        formatting : {
          indent_size : 2
        }
      },
      default : {
        files: {
          '../client/styles/shapes.html': ['svg/*.svg']
        },
      }
    }
  });
  //Load plugins
  grunt.loadNpmTasks('grunt-svgstore');
  //set Base exec path

  //Register tasks
  // grunt.registerTask('build', ['jshint', 'sass', 'postcss', 'svgstore']);
  //Default task
  // grunt.registerTask('default', ['build', 'watch']);
};
})();
