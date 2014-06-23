module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg : grunt.file.readJSON('package.json'),

    concat : {
      dist : {
        src  : ['<banner:meta.banner>', 'src/cache.js'],
        dest : 'dist/cache.js'
      }
    },

    uglify : {
      files : {
        'dist/cache.min.js' : ['<banner:meta.banner>', '<config:concat.dist.dest>']
      }
    },

    jshint : {
      src   : 'src/**/*.js',
      grunt : 'Gruntfile.js',
      tests : [
        'spec/**/*Spec.js'
      ]
    },

    jasmine : {
      test : {
        src     : [
          'src/cache.js'
        ],
        options : {
          specs   : 'spec/**/*Spec.js',
          vendor : [
            'vendor/jquery-1.8.2.js',
            'vendor/jquery.store.js',
            'vendor/underscore.js',
            'vendor/backbone.js',
            'vendor/base64.js'
          ]
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task.
  grunt.registerTask('default', 'dev');
  grunt.registerTask('test', ['jasmine']);
  grunt.registerTask('dev', ['jshint', 'test']);
  grunt.registerTask('build', ['dev', 'concat', 'uglify']);
};
