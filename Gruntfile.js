/// <vs AfterBuild='build' Clean='clean' SolutionOpened='default' />
module.exports = function(grunt) {

  // Project configuration.
    grunt.initConfig({
        config: {
            src: 'root-src',
            dev: 'root-dev'
        },
        pkg: grunt.file.readJSON('package.json'),

        sass: {
            options: {
                //sourceMap: true,
            },
            dev: {
                files: {
                    '<%= config.dev %>/css/<%= pkg.mainCss %>.css': '<%= config.src %>/scss/<%= pkg.mainCss %>.scss',
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
                src: ['fonts/**/*', 'img/**/*'],
                dest: '<%= config.dev %>/'
            },
            npm: {
                expand: true,
                cwd: '<%= config.src %>/',
                src: ['fonts/**/*', 'img/**/*'],
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
                files: ['<%= config.src %>/views/{,*/}*.{hbs,json}'],
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
                    'node_modules/jquery/dist/jquery.js',
                    'node_modules/angular/angular.js',
                    'node_modules/fixed-sticky/fixedsticky.js',
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
            site: {
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
        }
    });

    require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('assemble');

    grunt.registerTask('devbuild', ['clean', 'copy', 'assemble', 'sass', 'concat']);

    // Default task(s).
    grunt.registerTask('default', ['devbuild', 'watch']);

};