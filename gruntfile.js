"use strict";

module.exports = function(grunt) {
    var pkg = grunt.file.readJSON("package.json");

    grunt.initConfig({
        pkg: pkg,
        replace: {
            dist: {
                options: {
                    patterns: [{
                        match: "VERSION",
                        replacement: "<%= pkg.version %>"
                    }]
                },
                files: [{
                    expand: true,
                    flatten: true,
                    src: ["dev/eve.js"],
                    dest: "./"
                }]
            }
        }
    });

    grunt.loadNpmTasks("grunt-replace");

    grunt.registerTask("default", ["replace"]);
};
