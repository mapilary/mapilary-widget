module.exports = function(grunt) {

    // load tasks
    [
        'grunt-contrib-clean',
        'grunt-contrib-copy',
        'grunt-contrib-uglify',
        'grunt-contrib-cssmin',
        'grunt-contrib-concat',
        'grunt-contrib-less',
        'grunt-contrib-coffee',
        'grunt-browserify',
        'grunt-usemin'
    ].forEach(function(task) {
        grunt.loadNpmTasks(task);
    });


    // setup init config
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            dist: ['.tmp', 'dist']
        },
        copy: {
            prepareUsemin: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    dest: '.tmp',
                    src: ['vendor/*', '*.html', 'build/*'],
                    filter: 'isFile'
                }, {
                    expand: true,
                    flatten: true,
                    dest: '.tmp/vendor',
                    src: [
                        'bower_components/leaflet-locatecontrol/**/L.Control.Locate.css',
                        'node_modules/leaflet/dist/leaflet.css',
                        'node_modules/jquery/**/jquery.min.js',
                        'node_modules/socket.io-client/**/socket.io.min.js',
                        'node_modules/leaflet/dist/leaflet.js',
                        'bower_components/leaflet-locatecontrol/**/L.Control.Locate.js'
                    ],
                    filter: 'isFile'
                }]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp',
                    dest: 'dist',
                    src: ['*.html', 'js/*', 'css/*', 'vendor/*'],
                    filter: 'isFile'
                }, { // images
                    expand: true,
                    cwd: 'src',
                    dest: 'dist',
                    src: ['images/*'],
                    filter: 'isFile'
                }]
            }
        },
        less: {
            options: {
                compress: false,
                // LESS source maps
                // To enable, set sourceMap to true and update sourceMapRootpath based on your install
                sourceMap: false,
                sourceMapFilename: 'dist/css/widget.css.map',
                sourceMapRootpath: '/mapilary-widget',
            },
            dist: {
                files: [{
                    expand: true,
                    flatten: true,
                    cwd: 'src/less',
                    dest: '.tmp/css',
                    src: ['*.less', '!_*'],
                    filter: 'isFile',
                    ext: '.css'
                }]
            }
        },
        coffee: {
            dist: {
                expand: true,
                cwd: 'src/coffee',
                src: ['*.coffee'],
                dest: '.tmp/js',
                ext: '.js'
            }
        },
        cssmin: {
            widget: {
                files: { 
                'dist/css/widget-loader.bundle.min.css': [
                    '.tmp/vendor/L.Control.Locate.css',
                    '.tmp/vendor/fonts.css',
                    '.tmp/vendor/map.css',
                    '.tmp/css/style.css'
                ]}
            }
        },
        uglify: {
            widget: {
                files: { 
                'dist/js/widget-loader.bundle.min.js': [
                    '.tmp/vendor/L.Control.Locate.js',
                    '.tmp/js/widget.js'
                ]}
            }
        },        
        browserify: {
            shim: {
                files: {
                    '.tmp/vendor/L.Control.Locate.browserify.js': ['.tmp/vendor/L.Control.Locate.js']
                },
                options: {
                    transform: ['browserify-shim']
                }
            },
            bundle: {
                src: '.tmp/build/bundle.js',
                dest: '.tmp/js/widget.bundle.js'
            }
        },
        useminPrepare: {
            html: ['.tmp/*.html'],
        },
        usemin: {
            html: ['dist/*.html']
        }
    });

    grunt.registerTask('build', [
        'less',
        'coffee',
        'copy:prepareUsemin',
        'browserify',
        'useminPrepare',
        'concat',
        'uglify',
        'cssmin',
        'copy:dist',
        'usemin'
    ]);

    grunt.registerTask('default', [
        'clean',
        'build'
    ]);
};