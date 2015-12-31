module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      // write our code here
      options: { seperator: ';'},
      dist: {
        src: ['public/client/*.js'],
        dest: 'public/dist/<%= pkg.name %>.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      // write our code here
      target: {
        files: {
          'public/dist/<%= pkg.name %>.min.js': ['public/dist/*.js']
        }
      }
    },

    jshint: {
      files: [
        // Add filespec list here
        'public/client/*.js'
      ],
      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js'
        ]
      }
    },

    cssmin: {
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    // shell: {
    //   prodServer: {
    //     command: 'git add .&&git commit -m "updated content"'
    //   }
    // },
    
    gitadd: {
      task: {
        options: {
          force: true
        },
        files: {
          src: ['Gruntfile.js']
        }
      }
    },
    gitcommit: {
      task: {
        options: {
            message: 'Testing',
            noVerify: true,
            noStatus: false
        }
      }
    },
    gitpush: {
    your_target: {
      options: {
        remote: "azure",
        branch: "master" 
      }
    }
  },

  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-git');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  /////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', [
    // be sure to add uglify and concat
    // 'concat', 'uglify', 'jshint', 'test'
    'concat', 'uglify', 'jshint'
  ]);

  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      // grunt.task.run(['shell','gitpush']);
      grunt.task.run(['gitadd', 'gitcommit', 'gitpush']);
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
    // add your deploy tasks here
    'build', 'upload'
  ]);


};
