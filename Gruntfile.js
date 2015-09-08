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
        }
      },
      prod: {
        files: {
          '<%= config.prod %>/css/<%= pkg.mainCss %>.css': '<%= config.src %>/scss/<%= pkg.mainCss %>.scss',
          '<%= config.prod %>/css/print.css': '<%= config.src %>/scss/print.scss',
        }
      }
    },
    copy: {
      devData: {
        expand: true,
        cwd: '<%= config.src %>/views/data/',
        src: ['svenska.json'],
        dest: '<%= config.dev %>/'
      },
      devJs: {
        expand: true,
        cwd: 'node_modules/angular/',
        src: ['*.map'],
        dest: '<%= config.dev %>/js'
      },
      devAssets: {
        expand: true,
        cwd: '<%= config.src %>/',
        src: ['fonts/*', 'img/*'],
        dest: '<%= config.dev %>/'
      },
      devManifest: {
        expand: true,
        cwd: '<%= config.src %>/views/pages/',
        src: ['manifest.json'],
        dest: '<%= config.dev %>/'
      },
      prodData: {
        expand: true,
        cwd: '<%= config.src %>/views/data/',
        src: ['svenska.json'],
        dest: '<%= config.prod %>/'
      },
      prodJs: {
        expand: true,
        cwd: 'node_modules/angular/',
        src: ['*.map'],
        dest: '<%= config.prod %>/js'
      },
      prodAssets: {
        expand: true,
        cwd: '<%= config.src %>/',
        src: ['fonts/*', 'img/*'],
        dest: '<%= config.prod %>/'
      },
      prodManifest: {
        expand: true,
        cwd: '<%= config.src %>/views/pages/',
        src: ['manifest.json'],
        dest: '<%= config.prod %>/'
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
        tasks: ['sass','postcss'],
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
          'node_modules/es6-promise/dist/es6-promise.js',
          '<%= config.src %>/js/*/*.js',
          '<%= config.src %>/js/*.js',
        ],
        dest: '<%= config.dev %>/js/<%= pkg.mainJs %>.js',
      },
      prod: {
        src: [
          'node_modules/fastclick/lib/fastclick.js',
          'node_modules/hammerjs/hammer.js',
          'node_modules/es6-promise/dist/es6-promise.js',
          '<%= config.src %>/js/*/*.js',
          '<%= config.src %>/js/*.js',
        ],
        dest: '<%= config.prod %>/js/<%= pkg.mainJs %>.js',
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
      },
      prod: {
        files: [
          {
            expand: true,
            cwd: '<%= config.prod %>/',
            src: '**/*',
          },
        ],
      }
    },
    assemble: {
      options: {
        partials: [
          '<%= config.src %>/views/partials/**/*.hbs',
        ],
        helpers: '<%= config.src %>/views/helpers/**/*.js',
        layoutdir: '<%= config.src %>/views/layouts/',
        data: '<%= config.src %>/views/**/*.{json,yml}',
        layout: "_default.hbs",
      },
      dev: {
        files: [
          {
            expand: true,
            cwd: '<%= config.src %>/views/pages',
            src: ['*.hbs'],
            dest: '<%= config.dev %>/',
          },
        ],
      },
      prod: {
        files: [
          {
            expand: true,
            cwd: '<%= config.src %>/views/pages',
            src: ['*.hbs'],
            dest: '<%= config.prod %>/',
          },
        ],
      },
    },
    postcss: {
        options: {
            map: true,
            processors: [
                require('autoprefixer')({
                    browsers: ['last 3 versions']
                }),
                require('csswring')
            ]
        },
        dev: {
            src: '<%= config.dev %>/css/*.css'
        }
    },
    'json-minify': {
      prod: {
        files: '<%= config.prod %>/*.json'
      }
    },
    connect: {
      server: {
        options: {
          port: 8000,
          hostname: '*'
        }
      },
      dev : {
        options: {
          base: '<%= config.dev %>'
        }
      },
      prod : {
        options: {
          base: '<%= config.prod %>'
        }
      }
    },
    'gh-pages': {
      options: {
        base: '<%= config.prod %>'
      },
      src: ['**']
    }
  });

  require('load-grunt-tasks')(grunt);
  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-json-minify');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('devbuild', ['clean:dev', 'copy', 'assemble:dev', 'sass:dev', 'concat:dev', 'postcss', 'connect:dev']);

  grunt.registerTask('prodbuild', ['clean:prod', 'copy', 'assemble:prod', 'sass:prod', 'concat:prod', 'postcss', 'json-minify', 'connect:prod']);

  // Default task(s).
  grunt.registerTask('default', ['devbuild', 'watch']);
  grunt.registerTask('prod', ['prodbuild', 'watch']);
  grunt.registerTask('deploy', ['prodbuild', 'gh-pages']);

};