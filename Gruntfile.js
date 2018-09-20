module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-clean');
    // grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-peg');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-uglify-es');
    grunt.loadNpmTasks('grunt-preprocess');

    let transforms = [];
    grunt.initConfig({
        preprocess: {
            options: {
            },
            html: {
                src: 'template/settings.html',
                dest: 'settings.html'
            },
        },

	shell: {
            schema: './node_modules/ajv-cli/index.js compile --all-errors\
                       -s src/settings-schema.json  -o src/settings-validate.js',
            manual: 'pandoc -s --template=template/pandoc.html --toc --toc-depth=5 \
                       --metadata=title:manual README.md > template/manual.html'
	},

        browserify: {
            content: {
                files: {
                    'dist/content.js': ['src/content.js', 'lib/mousetrap.min.js'],
                },
                options: {
                    transform: transforms,
                    browserifyOptions: {
                        debug: true
                    },
                    debug: true,
                }
            },

            background: {
                files: {
                    'dist/background.js': ['src/background.js'],
                },
                options: {
                    transform: transforms,
                    browserifyOptions: {
                        debug: true
                    },
                    debug: true,
                }
            },

            settings: {
                files: {
                    'dist/settings.js': ['settings/js/main.js', 'settings/js/fix-links.js'],
                },
                options: {
                    transform: transforms,
                    browserifyOptions: {
                        debug: true
                    },
                },
            },
        },

        uglify: {
            options: {
                mangle: {
                    toplevel: true,
                },
            },
            content: {
                files: {
                    'dist/content.js': ['dist/content.js']
                }
            }
        },

        peg: {
            inputDev: {
                src: "src/input-parser.pegjs",
                dest: "src/input-parser.js",
                options: { allowedStartRules: ['start', 'modifier', 'commands', 'selectors1',
                                               'target', 'selectors', 'label', 'intervals'],
                           format: 'commonjs' }
            },
            input: {
                src: "src/input-parser.pegjs",
                dest: "src/input-parser.js",
                options: { allowedStartRules: ['start'],
                           format: 'commonjs' }
            }
        },

        mochaTest: {
            all: {
                options: {
                    reporter: 'spec',
                },
                src: ['test/*.js']
            },
            validate: {
                options: {
                    reporter: 'spec',
                },
                src: ['test/validate.js']
            }
        },

    });

    grunt.registerTask('manual', ['shell:manual', 'preprocess']);
    grunt.registerTask('dev',
                       ['manual', 'shell:schema', 'peg:input', 'browserify:content',
                        'browserify:settings', 'browserify:background']);
    grunt.registerTask('build',
                       ['dev', 'uglify']);
    grunt.registerTask('test', ['shell:schema', 'peg:inputDev', 'mochaTest:all']);
};
