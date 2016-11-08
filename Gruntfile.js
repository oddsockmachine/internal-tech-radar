/**
__author__    =	"Ashwini Chandrasekar(@sriniash)"
__email__     =	"ASHWINI_CHANDRASEKAR@homedepot.com"
__version__   =	"1.0"
__doc__       = "Grunt file for Build Process"

 */
module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        static_js_dir: 'apps/static/js',
        static_css_dir: 'apps/static/css',
        assets_css_dir: 'apps/static/assets/css',
        assets_js_dir: 'apps/static/assets/js',

        concat: {

            controllers: {
                src: ['<%= static_js_dir %>/controllers/*.js'],
                dest: '<%= assets_js_dir %>/controllers.js'
            },
            services: {
                src: ['<%= static_js_dir %>/services/*.js'],
                dest: '<%= assets_js_dir%>/services.js'
            },
            directives: {
                src: ['<%= static_js_dir %>/directives/*.js'],
                dest: '<%= assets_js_dir %>/directives.js'
            },
            app_css: {
                src: ['<%= static_css_dir %>/app.css','<%= static_css_dir %>/stic*.css'],
                dest: '<%= assets_css_dir %>/radar.css'
            },
            vendor_css: {
                src: ['<%= static_css_dir %>/libs/*.css'],
                dest: '<%= assets_css_dir %>/vendor.css'
            }

        },
        uglify: {
            options: {
                // the banner is inserted at the top of the output
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'apps/static/assets/js/controllers.min.js': ['<%= concat.controllers.dest %>'],
                    'apps/static/assets/js/services.min.js': ['<%= concat.services.dest %>'],
                    'apps/static/assets/js/directives.min.js': ['<%= concat.directives.dest %>']
                }
            }
        },
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'apps/static/assets/css/radar.min.css': ['<%= concat.app_css.dest %>'],
                    'apps/static/assets/css/vendor.min.css': ['<%= concat.vendor_css.dest %>']
                }
            }
        },
        // Deletes all .js files, but skips min.js files
        clean: {
            js: ["apps/static/assets/js/*.*", "apps/static/assets/css/*.*"]
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('default', ['clean','concat', 'uglify', 'cssmin']);

};