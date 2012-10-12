/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '// <%= pkg.name %> v<%= pkg.version %>\n' +
              '//\n' +
              '// Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
              '// Distributed under MIT License\n'
    },

    // Configuration for javascript build process.Options apply from r.js
    // see https://github.com/jrburke/r.js/blob/master/build/example.build.js
    // requirejs: { 
    //   mainConfigFile    : "example/assets/js/config.js"   /* Include the main configuration file */
    //   , out             : "example/temp/application.js"   /* Output file */
    //   , name            : "config"                        /* Root application module */
    //   , wrap            : false                           /* Do not wrap everything in an IIFE */
    //   , optimize        : "none"                          /* JS-optimization on build: 'none' or 'uglify' supported via Node */
    //   , insertRequire   : ['main']
    // },

    concat: {
      backbone_structuredmodelbinder: {
          src: ['<banner>', 'src/backbone.structuredmodelbinder.js']
        , dest: 'dist/<%= pkg.name %>.js'
      },
      amd: {
          src: ['<banner>', 'src/amd-intro.jsnip', 'src/backbone.structuredmodelbinder.js', 'src/amd-outro.jsnip']
        , dest: 'dist/Backbone.StructuredModelBinder.js'
      }
    },

    clean: {
        debug: ['dist/*']
      //, app: ['example/temp/*', 'example/assets/templates/backbone_forms/*']
    },

    lint: {
      debug: ['grunt.js', 'src/backbone.structuredmodelbinder.js']
      //, app: ['example/assets/js/**/*.js']
    },

    watch: {
      files: ['src/**/*.js'],
      tasks: 'moduleBuild'
    },
    jshint: {
      options: {
        /* default options that grunt creates on init. May need revision */
          curly   : true
        , eqeqeq  : true
        , immed   : true
        , latedef : true
        , newcap  : true
        , noarg   : true
        , sub     : true
        , undef   : true      // in combination with globals allowing 'define' keyword
        , boss    : true
        , eqnull  : true
        , node    : true
      
        /* custom set options (http://www.jshint.com/options/) */
        , laxcomma  : true
        , strict    : false       // will complain on missing 'use strict' => turn on for compiled code linting
        , browser   : true        // allows browsers globals
        , onevar    : true        // forces a single var statement per-scope => readability & code org.
        , camelCase : true        // variable naming check for consistency
        , bitwise   : true        // disallows bitwise operators (see jsHint docs why; override per-file if needed)
        , quotmark  : 'single'    // quotation marks consistency (not forcing a particular style at the moment, might in the future)
        , multistr  : true

      },

      globals: {
          exports   : true
        , define    : true
        , _         : true
        , $         : true
        , Backbone  : true
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib');
  // grunt.loadNpmTasks('grunt-requirejs');
  // grunt.loadNpmTasks('grunt-replace');

  grunt.registerTask('moduleBuild', 'clean:debug concat:amd lint:debug');

  //grunt.registerTask('app', 'moduleBuild clean:app copy:app copy:templates requirejs concat:app less:app');
  // Default task.
  grunt.registerTask('default', 'moduleBuild watch');

};
