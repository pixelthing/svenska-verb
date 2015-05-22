/// <vs AfterBuild='build' Clean='clean' SolutionOpened='default' />
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    config: {
      src:  'root-src',
      dev:  'root-dev',
      prod: 'root-prod'
    },
    pkg: grunt.file.readJSON('package.json'),

    sass: {
      options: {
        //sourceMap: true,
      },
      dev: {
        files: {
          '<%= config.dev %>/css/<%= pkg.mainCss %>.css': '<%= config.src %>/scss/<%= pkg.mainCss %>.scss',
          '<%= config.dev %>/css/print.css': '<%= config.src %>/scss/print.scss',
        },
      },
    },
    copy: {
      data: {
        expand: true,
        cwd: '<%= config.src %>/views/data/',
        src: ['svenska.json'],
        dest: '<%= config.dev %>/'
      },
      maps: {
        expand: true,
        cwd: 'node_modules/angular/',
        src: ['*.map'],
        dest: '<%= config.dev %>/js'
      },
      assets: {
        expand: true,
        cwd: '<%= config.src %>/',
        src: ['fonts/*', 'img/*'],
        dest: '<%= config.dev %>/'
      },
      manifest: {
        expand: true,
        cwd: '<%= config.src %>/views/pages/',
        src: ['manifest.json'],
        dest: '<%= config.dev %>/'
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'root-src/**/*.js'],
      options: {
        globals: {
          jQuery: false
        }
      }
    },
    watch: {
      data: {
        files: ['<%= config.src %>/views/data/*.json'],
        tasks: ['copy'],
        options: {
          livereload: true,
        },
      },
      sass: {
        files: ['<%= config.src %>/**/*.scss'],
        tasks: ['sass'],
        options: {
          livereload: true,
        },
      },
      script: {
        files: ['<%= config.src %>/**/*.js'],
        tasks: ['concat'],
      },
      assemble: {
        files: ['<%= config.src %>/views/{,*/}*.{html,hbs,json}'],
        tasks: ['assemble'],
      },
      livereload: {
        //Here we watch the files the sass task will compile to
        //These files are sent to the live reload server after sass compiles to them
        options: { livereload: true },
        files: ['<%= config.dev %>/**/*'],
      },
    },
    concat: {
      options: {
        banner: '',
        stripBanners: false,
      },
      dev: {
        src: [
          'node_modules/fastclick/lib/fastclick.js',
          'node_modules/hammerjs/hammer.js',
          'node_modules/angular/angular.js',
          'node_modules/angular-animate/angular-animate.js',
          'node_modules/angular-hammer/angular.hammer.js',
          '<%= config.src %>/js/*/*',
        ],
        dest: '<%= config.dev %>/js/<%= pkg.mainJs %>.js',
      },
    },
    clean: {
      tmp: {
        files: [
          {
            expand: true,
            cwd: '.tmp/',
            src: '**/*',
          },
        ],
      },
      dev: {
        files: [
          {
            expand: true,
            cwd: '<%= config.dev %>/',
            src: '**/*',
          },
        ],
      }
    },
    assemble: {
      options: {
        helpers: '<%= config.src %>/views/helpers/**/*.js',
        layoutdir: '<%= config.src %>/views/layouts/',
        data: '<%= config.src %>/views/**/*.{json,yml}',
      },
      dev: {
        options: {
          layout: "_default.hbs",
          partials: [
            '<%= config.src %>/views/partials/**/*.hbs',
          ]
        },
        files: [
          {
            expand: true,
            cwd: '<%= config.src %>/views/pages',
            src: ['*.hbs'],
            dest: '<%= config.dev %>/',
          },
        ],
      },
    },
    'gh-pages': {
      options: {
        base: '<%= config.dev %>'
      },
      src: ['**']
    },
    uglify: {
      my_target: {
        files: {
          '<%= config.prod %>/js/main.js': ['<%= config.dev %>/js/main.js']
        }
      }
    },
    compress: {
      main: {
        options: {
          mode: 'gzip'
        },
        files: [
          // Each of the files in the src/ folder will be output to
          // the dist/ folder each with the extension .gz.js
          {expand: true, src: ['src/*.js'], dest: '<%= config.prod %>/', ext: '.gz.js'}
        ]
      }
    },
    connect: {
      server: {
        options: {
          port: 8000,
          hostname: '*',
          base: '<%= config.dev %>'
        }
      }
    }
  });

  require('load-grunt-tasks')(grunt);
  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-compress');

  grunt.registerTask('devbuild', ['clean', 'copy', 'assemble', 'sass', 'concat', 'connect']);

  grunt.registerTask('prodbuild', ['clean', 'copy', 'assemble', 'sass', 'concat', 'connect', 'uglify', 'compress']);

  // Default task(s).
  grunt.registerTask('default', ['devbuild', 'watch']);

  grunt.registerTask('deploy', ['prodbuild', 'gh-pages']);

};