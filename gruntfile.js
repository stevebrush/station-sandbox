module.exports = function (grunt) {
    'use strict';

    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-concat-sourcemap');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.initConfig({
        srcPath: grunt.option('srcpath') || 'public/src',
        buildPath: grunt.option('buildpath') || 'public/build',
        concat_sourcemap: {
            options: {
                sourcesContent: true,
                sourceRoot: '../..'
            },
            app: {
                files: {
                    '<%= buildPath %>/js/app.js': [
                        'bower_components/angular/angular.js',
                        'bower_components/angular-ui-router/release/angular-ui-router.js',
                        '<%= srcPath %>/app.js',
                        '<%= srcPath %>/scripts/**/*.js',
                        '<%= srcPath %>/components/**/*.js',
                        '<%= srcPath %>/views/**/*.js',
                        'tmp/templates.js'
                    ]
                }
            }
        },
        copy: {
            fonts: {
                files: [{
                    expand: true,
                    cwd: '<%= srcPath %>/fonts',
                    src: ['*'],
                    dest: '<%= buildPath %>/fonts/'
                }]
            },
            data: {
                files: [{
                    expand: true,
                    cwd: '<%= srcPath %>/data/',
                    src: ['**/*.json'],
                    dest: '<%= buildPath %>/data/'
                }]
            }
        },
        html2js: {
            app: {
                options: {
                    module: 'station.templates',
                    quoteChar: '\'',
                    indentString: '    ',
                    singleModule: true,
                    htmlmin: {
                        collapseBooleanAttributes: true,
                        collapseWhitespace: true,
                        removeAttributeQuotes: true,
                        removeComments: true,
                        removeEmptyAttributes: true,
                        removeRedundantAttributes: true,
                        removeScriptTypeAttributes: true,
                        removeStyleLinkTypeAttributes: true
                    },
                    rename: function (moduleName) {
                        return '/' + moduleName.replace('../public/', '');
                    }
                },
                src: ['<%= srcPath %>/views/**/*.html', '<%= srcPath %>/components/**/*.html'],
                dest: 'tmp/templates.js'
            }
        },
        sass: {
            options: {
                outputStyle: 'compressed',
                includePaths: [
                    'bower_components/'
                ]
            },
            app: {
                files: {
                    '<%= buildPath %>/css/app.min.css': '<%= srcPath %>/styles/app.scss'
                }
            }
        },
        uglify: {
            options: {
                sourceMap: true,
                sourceMapIncludeSources: true
            },
            app: {
                options: {
                    sourceMapIn: '<%= buildPath %>/js/app.js.map'
                },
                src: ['<%= buildPath %>/js/app.js'],
                dest: '<%= buildPath %>/js/app.min.js'
            }
        },
        watch: {
            sass: {
                files: ['<%= srcPath %>/**/*.scss'],
                tasks: ['sass']
            },
            scripts: {
                files: ['<%= srcPath %>/**/*.js'],
                tasks: ['concat_sourcemap:app', 'uglify:app']
            },
            templates: {
                files: ['<%= srcPath %>/views/**/*.html', '<%= srcPath %>/components/**/*.html'],
                tasks: ['html2js', 'concat_sourcemap:app', 'uglify:app']
            }
        }
    });

    grunt.registerTask('build', [
        'html2js',
        'concat_sourcemap',
        'uglify',
        'sass',
        'copy',
        'watch'
    ]);

    grunt.registerTask('default', 'build');
};
